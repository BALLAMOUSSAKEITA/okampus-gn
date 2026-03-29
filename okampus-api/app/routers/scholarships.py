from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth import require_role
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


@router.post("", response_model=ScholarshipOut, status_code=201)
async def create_scholarship(
    body: ScholarshipCreate,
    current_user: User = Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    scholarship = Scholarship(**body.model_dump())
    db.add(scholarship)
    await db.commit()
    await db.refresh(scholarship)
    return scholarship
