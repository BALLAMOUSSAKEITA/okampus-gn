from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import StageApplication, StageOffer
from app.schemas import ApplyRequest, ApplicationOut, StageOfferCreate, StageOfferOut

router = APIRouter(prefix="/stages", tags=["stages"])


@router.get("", response_model=list[StageOfferOut])
async def get_stages(
    type: str | None = Query(None),
    domain: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(StageOffer).where(StageOffer.is_active == True).order_by(StageOffer.created_at.desc())
    if type:
        q = q.where(StageOffer.type == type)
    if domain:
        q = q.where(StageOffer.domain == domain)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=StageOfferOut, status_code=201)
async def create_stage(body: StageOfferCreate, db: AsyncSession = Depends(get_db)):
    offer = StageOffer(**body.model_dump())
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    return offer


@router.post("/{offer_id}/apply", response_model=ApplicationOut, status_code=201)
async def apply_to_stage(
    offer_id: str,
    body: ApplyRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(StageOffer).where(StageOffer.id == offer_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Offre introuvable")

    existing = await db.execute(
        select(StageApplication).where(
            StageApplication.user_id == body.user_id,
            StageApplication.offer_id == offer_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Candidature déjà envoyée")

    application = StageApplication(user_id=body.user_id, offer_id=offer_id, message=body.message)
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/{offer_id}/apply", response_model=list[ApplicationOut])
async def get_applications(
    offer_id: str,
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(StageApplication).where(
            StageApplication.offer_id == offer_id,
            StageApplication.user_id == user_id,
        )
    )
    return result.scalars().all()
