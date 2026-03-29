from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth import get_current_user
from app.database import get_db
from app.models import Parcours, User
from app.schemas import ParcoursOut, ParcoursUpsert

router = APIRouter(prefix="/parcours", tags=["parcours"])


@router.get("/{user_id}", response_model=ParcoursOut)
async def get_parcours(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Parcours).where(Parcours.user_id == user_id))
    parcours = result.scalar_one_or_none()
    if not parcours:
        raise HTTPException(status_code=404, detail="Parcours introuvable")
    return parcours


@router.put("/{user_id}", response_model=ParcoursOut)
async def upsert_parcours(
    user_id: str,
    body: ParcoursUpsert,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    result = await db.execute(select(Parcours).where(Parcours.user_id == user_id))
    parcours = result.scalar_one_or_none()

    if parcours:
        for k, v in body.model_dump(exclude_none=True).items():
            setattr(parcours, k, v)
    else:
        parcours = Parcours(user_id=user_id, **body.model_dump())
        db.add(parcours)

    await db.commit()
    await db.refresh(parcours)
    return parcours
