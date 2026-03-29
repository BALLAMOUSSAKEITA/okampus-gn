from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.auth import get_current_user
from app.database import get_db
from app.models import EntrepreneurProject, User
from app.schemas import EntrepreneurProjectCreate, EntrepreneurProjectOut

router = APIRouter(prefix="/entrepreneur", tags=["entrepreneur"])


@router.get("", response_model=list[EntrepreneurProjectOut])
async def get_projects(
    category: str | None = Query(None),
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(EntrepreneurProject).where(EntrepreneurProject.is_active == True).order_by(EntrepreneurProject.created_at.desc())
    if category:
        q = q.where(EntrepreneurProject.category == category)
    if status:
        q = q.where(EntrepreneurProject.status == status)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=EntrepreneurProjectOut, status_code=201)
async def create_project(
    body: EntrepreneurProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project = EntrepreneurProject(**body.model_dump(), author_id=current_user.id)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project
