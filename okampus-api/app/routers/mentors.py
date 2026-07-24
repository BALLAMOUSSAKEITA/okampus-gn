from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import AdvisorProfile, User
from app.schemas import MentorOut

router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("", response_model=list[MentorOut])
async def list_mentors(
    limit: int | None = Query(None, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    q = (
        select(AdvisorProfile, User)
        .join(User, User.id == AdvisorProfile.user_id)
        .order_by(AdvisorProfile.created_at.desc())
    )
    if limit:
        q = q.limit(limit)
    result = await db.execute(q)
    rows = result.all()
    return [
        MentorOut(
            id=adv.user_id,
            name=user.name,
            field=adv.field,
            university=adv.university,
            year=adv.year,
            description=adv.description,
            meet_link=adv.meet_link,
            available_slots=adv.available_slots or [],
        )
        for adv, user in rows
    ]
