from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

from app.database import get_db
from app.models import AdvisorProfile, ForumPost, StageOffer, SuccessStory, User
from app.schemas import PublicStatsOut

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/public", response_model=PublicStatsOut)
async def public_stats(db: AsyncSession = Depends(get_db)):
    users = await db.scalar(
        select(func.count()).select_from(User).where(User.role.in_(["student", "bachelier"]))
    )
    mentors = await db.scalar(select(func.count()).select_from(AdvisorProfile))
    stages = await db.scalar(
        select(func.count()).select_from(StageOffer).where(StageOffer.is_active == True)
    )
    stories = await db.scalar(
        select(func.count()).select_from(SuccessStory).where(SuccessStory.is_active == True)
    )
    forum = await db.scalar(select(func.count()).select_from(ForumPost))
    return PublicStatsOut(
        students=users or 0,
        mentors=mentors or 0,
        stage_offers=stages or 0,
        success_stories=stories or 0,
        forum_posts=forum or 0,
    )
