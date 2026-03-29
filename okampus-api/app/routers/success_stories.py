from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import SuccessStory
from app.schemas import SuccessStoryCreate, SuccessStoryOut

router = APIRouter(prefix="/success-stories", tags=["success-stories"])


@router.get("", response_model=list[SuccessStoryOut])
async def get_stories(
    category: str | None = Query(None),
    featured: bool | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = (
        select(SuccessStory)
        .where(SuccessStory.is_active == True)
        .order_by(SuccessStory.is_featured.desc(), SuccessStory.likes.desc())
    )
    if category:
        q = q.where(SuccessStory.category == category)
    if featured is not None:
        q = q.where(SuccessStory.is_featured == featured)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=SuccessStoryOut, status_code=201)
async def create_story(body: SuccessStoryCreate, db: AsyncSession = Depends(get_db)):
    story = SuccessStory(**body.model_dump())
    db.add(story)
    await db.commit()
    await db.refresh(story)
    return story
