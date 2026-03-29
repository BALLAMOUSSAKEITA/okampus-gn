from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import CalendarEvent
from app.schemas import CalendarEventCreate, CalendarEventOut

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("", response_model=list[CalendarEventOut])
async def get_events(
    type: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(CalendarEvent).where(CalendarEvent.is_active == True).order_by(CalendarEvent.start_date)
    if type:
        q = q.where(CalendarEvent.type == type)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=CalendarEventOut, status_code=201)
async def create_event(body: CalendarEventCreate, db: AsyncSession = Depends(get_db)):
    event = CalendarEvent(**body.model_dump())
    db.add(event)
    await db.commit()
    await db.refresh(event)
    return event
