from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth import get_current_admin
from app.database import get_db
from app.models import Scholarship, User
from app.schemas import ScholarshipCreate, ScholarshipOut

router = APIRouter(prefix="/scholarships", tags=["scholarships"])


@router.get("", response_model=list[ScholarshipOut])
async def get_scholarships(
    type: str | None = Query(None),
    location: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(Scholarship).where(Scholarship.is_active == True).order_by(Scholarship.deadline.asc().nulls_last())
    if type:
        q = q.where(Scholarship.type == type)
    if location:
        q = q.where(Scholarship.location == location)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{scholarship_id}", response_model=ScholarshipOut)
async def get_scholarship(
    scholarship_id: str,
    count_view: bool = Query(False),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Scholarship).where(
            Scholarship.id == scholarship_id,
            Scholarship.is_active == True,
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Bourse introuvable")
    if count_view:
        item.views = (item.views or 0) + 1
        await db.commit()
        await db.refresh(item)
    return item


@router.post("", response_model=ScholarshipOut, status_code=201)
async def create_scholarship(
    body: ScholarshipCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    scholarship = Scholarship(**body.model_dump())
    db.add(scholarship)
    await db.commit()
    await db.refresh(scholarship)
    return scholarship
