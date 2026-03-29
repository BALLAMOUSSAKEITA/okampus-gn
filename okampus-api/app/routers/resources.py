from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Resource, ResourcePurchase
from app.schemas import PurchaseRequest, ResourceCreate, ResourceOut

router = APIRouter(prefix="/resources", tags=["resources"])


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
