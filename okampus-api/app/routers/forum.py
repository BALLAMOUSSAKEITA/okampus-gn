from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import ForumPost
from app.schemas import ForumPostOut

router = APIRouter(prefix="/forum", tags=["forum"])


@router.get("", response_model=list[ForumPostOut])
async def list_forum_posts(
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(ForumPost).order_by(ForumPost.created_at.desc())
    if category:
        q = q.where(ForumPost.category == category)
    result = await db.execute(q)
    return result.scalars().all()
