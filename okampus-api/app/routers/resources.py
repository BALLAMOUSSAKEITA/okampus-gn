from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.auth import get_current_user, get_optional_user
from app.database import get_db
from app.models import Resource, ResourcePurchase, User
from app.file_validation import verify_upload_magic
from app.rate_limit import check_rate_limit
from app.schemas import PurchaseRequest, ResourceCreate, ResourceOut

router = APIRouter(prefix="/resources", tags=["resources"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "resources"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 Mo


def _file_path_from_url(file_url: str) -> Path | None:
    if not file_url or not file_url.startswith("/uploads/resources/"):
        return None
    filename = Path(file_url).name
    if ".." in filename or "/" in filename or "\\" in filename:
        return None
    path = UPLOAD_DIR / filename
    return path if path.is_file() else None


async def _purchased_resource_ids(
    db: AsyncSession, user_id: str | None, resource_ids: list[str]
) -> set[str]:
    if not user_id or not resource_ids:
        return set()
    result = await db.execute(
        select(ResourcePurchase.resource_id).where(
            ResourcePurchase.user_id == user_id,
            ResourcePurchase.resource_id.in_(resource_ids),
        )
    )
    return set(result.scalars().all())


def _can_access_file(resource: Resource, user: User | None, purchased_ids: set[str]) -> bool:
    if not resource.file_url:
        return False
    if not resource.is_premium:
        return True
    if not user:
        return False
    if user.role == "admin" or user.id == resource.author_id:
        return True
    return resource.id in purchased_ids


def _resource_out(
    resource: Resource, user: User | None, purchased_ids: set[str]
) -> ResourceOut:
    out = ResourceOut.model_validate(resource)
    if not _can_access_file(resource, user, purchased_ids):
        return out.model_copy(update={"file_url": ""})
    return out


@router.get("", response_model=list[ResourceOut])
async def get_resources(
    category: str | None = Query(None),
    subject: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    q = select(Resource).where(Resource.is_active == True).order_by(Resource.created_at.desc())
    if category:
        q = q.where(Resource.category == category)
    if subject:
        q = q.where(Resource.subject == subject)
    result = await db.execute(q)
    resources = result.scalars().all()
    purchased_ids = await _purchased_resource_ids(db, user.id if user else None, [r.id for r in resources])
    return [_resource_out(r, user, purchased_ids) for r in resources]


@router.post("", response_model=ResourceOut, status_code=201)
async def create_resource(
    body: ResourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    data = body.model_dump()
    data["author_id"] = current_user.id
    data["is_premium"] = False
    data["price"] = 0
    if data.get("file_url") and not _file_path_from_url(data["file_url"]):
        raise HTTPException(status_code=400, detail="URL de fichier invalide")
    resource = Resource(**data)
    db.add(resource)
    await db.commit()
    await db.refresh(resource)
    return _resource_out(resource, current_user, set())


@router.post("/upload", response_model=ResourceOut, status_code=201)
async def upload_resource(
    request: Request,
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("Autre"),
    subject: str = Form("Autre"),
    filière: str | None = Form(None),
    university: str | None = Form(None),
    year: str | None = Form(None),
    file: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    check_rate_limit(request, "resource_upload", max_calls=10, window_seconds=3600)

    file_url = ""
    file_type = "pdf"
    file_size = 0

    if file and file.filename:
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Type de fichier non autorisé. Extensions acceptées : {', '.join(sorted(ALLOWED_EXTENSIONS))}",
            )
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Fichier trop volumineux (max 20 Mo)")
        verify_upload_magic(content, ext)
        filename = f"{uuid.uuid4().hex}{ext}"
        dest = UPLOAD_DIR / filename
        dest.write_bytes(content)
        file_url = f"/uploads/resources/{filename}"
        file_type = ext.lstrip(".")
        file_size = len(content)

    resource = Resource(
        title=title.strip(),
        description=(description or title).strip(),
        category=(category or "Autre").strip(),
        subject=(subject or "Autre").strip(),
        filière=filière.strip() if filière else None,
        university=university.strip() if university else None,
        year=year.strip() if year else None,
        file_url=file_url,
        file_type=file_type,
        file_size=file_size,
        price=0,
        is_premium=False,
        author_id=current_user.id,
    )
    db.add(resource)
    await db.commit()
    await db.refresh(resource)
    return _resource_out(resource, current_user, set())


@router.get("/{resource_id}/download")
async def download_resource(
    resource_id: str,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    result = await db.execute(select(Resource).where(Resource.id == resource_id, Resource.is_active == True))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Ressource introuvable")

    purchased_ids = await _purchased_resource_ids(db, user.id if user else None, [resource.id])
    if not _can_access_file(resource, user, purchased_ids):
        if resource.is_premium:
            raise HTTPException(status_code=403, detail="Accès premium requis")
        raise HTTPException(status_code=404, detail="Fichier indisponible")

    file_path = _file_path_from_url(resource.file_url)
    if not file_path:
        raise HTTPException(status_code=404, detail="Fichier introuvable")

    resource.downloads += 1
    await db.commit()

    return FileResponse(
        path=file_path,
        filename=Path(resource.file_url).name,
        media_type="application/octet-stream",
    )


@router.post("/{resource_id}/purchase", status_code=201)
async def purchase_resource(
    resource_id: str,
    body: PurchaseRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Ressource introuvable")
    if not resource.is_premium:
        raise HTTPException(status_code=400, detail="Cette ressource est gratuite")

    existing = await db.execute(
        select(ResourcePurchase).where(
            ResourcePurchase.user_id == current_user.id,
            ResourcePurchase.resource_id == resource_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Ressource déjà achetée")

    purchase = ResourcePurchase(
        user_id=current_user.id,
        resource_id=resource_id,
        amount=resource.price,
    )
    db.add(purchase)
    await db.commit()

    return {"message": "Achat effectué", "resource_id": resource_id}
