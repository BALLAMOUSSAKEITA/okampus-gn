from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import PlatformNews
from app.schemas import NewsOut

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=list[NewsOut])
async def get_news(
    limit: int = Query(6, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PlatformNews)
        .where(PlatformNews.is_active == True)
        .order_by(PlatformNews.published_at.desc())
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{news_id}", response_model=NewsOut)
async def get_news_item(news_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PlatformNews).where(
            PlatformNews.id == news_id,
            PlatformNews.is_active == True,
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=404, detail="Actualité introuvable")
    return item
