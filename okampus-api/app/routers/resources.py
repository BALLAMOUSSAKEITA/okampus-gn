from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.database import get_db
from app.models import Resource, ResourcePurchase
from app.schemas import PurchaseRequest, ResourceCreate, ResourceOut

router = APIRouter(prefix="/resources", tags=["resources"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "resources"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 Mo


@router.get("", response_model=list[ResourceOut])
async def get_resources(
    category: str | None = Query(None),
    subject: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(Resource).where(Resource.is_active == True).order_by(Resource.created_at.desc())
    if category:
        q = q.where(Resource.category == category)
    if subject:
        q = q.where(Resource.subject == subject)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=ResourceOut, status_code=201)
async def create_resource(body: ResourceCreate, db: AsyncSession = Depends(get_db)):
    resource = Resource(**body.model_dump())
    db.add(resource)
    await db.commit()
    await db.refresh(resource)
    return resource


@router.post("/upload", response_model=ResourceOut, status_code=201)
async def upload_resource(
    title: str = Form(...),
    description: str = Form(""),
    category: str = Form("Autre"),
    subject: str = Form("Autre"),
    filiere: str | None = Form(None),
    university: str | None = Form(None),
    year: str | None = Form(None),
    author_id: str = Form(...),
    file: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
):
    file_url = ""
    file_type = "pdf"
    file_size = 0

    if file and file.filename:
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Type de fichier non autorise. Extensions acceptees : {', '.join(sorted(ALLOWED_EXTENSIONS))}",
            )
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="Fichier trop volumineux (max 20 Mo)")
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
        filiere=filiere.strip() if filiere else None,
        university=university.strip() if university else None,
        year=year.strip() if year else None,
        file_url=file_url,
        file_type=file_type,
        file_size=file_size,
        price=0,
        is_premium=False,
        author_id=author_id,
    )
    db.add(resource)
    await db.commit()
    await db.refresh(resource)
    return resource


@router.post("/{resource_id}/purchase", status_code=201)
async def purchase_resource(
    resource_id: str,
    body: PurchaseRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Resource).where(Resource.id == resource_id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Ressource introuvable")

    existing = await db.execute(
        select(ResourcePurchase).where(
            ResourcePurchase.user_id == body.user_id,
            ResourcePurchase.resource_id == resource_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Ressource déjà achetée")

    purchase = ResourcePurchase(user_id=body.user_id, resource_id=resource_id, amount=resource.price)
    resource.downloads += 1
    db.add(purchase)
    await db.commit()

    return {"message": "Achat effectué", "resource_id": resource_id}
