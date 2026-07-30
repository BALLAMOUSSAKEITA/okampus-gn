from typing import Any, Type

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth import get_current_admin
from app.config import settings
from app.database import get_db
from app.models import (
    AdvisorProfile,
    AssistantUsage,
    CalendarEvent,
    EntrepreneurProject,
    ForumPost,
    Resource,
    Scholarship,
    StageOffer,
    SuccessStory,
    User,
)
from app.schemas import (
    AdminAssistantUsageOut,
    AdminAssistantUsageSummaryOut,
    AdminAssistantUsageUserOut,
    AdminMentorOut,
    AdminStatsOut,
    AdminUserOut,
    AdminUserUpdate,
    CalendarEventCreate,
    CalendarEventOut,
    CalendarEventUpdate,
    EntrepreneurProjectCreate,
    EntrepreneurProjectOut,
    EntrepreneurProjectUpdate,
    ForumPostCreate,
    ForumPostOut,
    ForumPostUpdate,
    ResourceCreate,
    ResourceOut,
    ResourceUpdate,
    ScholarshipCreate,
    ScholarshipOut,
    ScholarshipUpdate,
    StageOfferCreate,
    StageOfferOut,
    StageOfferUpdate,
    SuccessStoryCreate,
    SuccessStoryOut,
    SuccessStoryUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


def _apply_updates(obj: Any, data: dict) -> None:
    for key, value in data.items():
        if value is not None:
            setattr(obj, key, value)


async def _get_or_404(db: AsyncSession, model: Type, item_id: str):
    result = await db.execute(select(model).where(model.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Élément introuvable")
    return item


@router.get("/stats", response_model=AdminStatsOut)
async def admin_stats(db: AsyncSession = Depends(get_db)):
    async def count(model):
        result = await db.execute(select(func.count()).select_from(model))
        return result.scalar() or 0

    mentors = await db.execute(select(func.count()).select_from(AdvisorProfile))
    return AdminStatsOut(
        users=await count(User),
        mentors=mentors.scalar() or 0,
        stages=await count(StageOffer),
        stories=await count(SuccessStory),
        scholarships=await count(Scholarship),
        resources=await count(Resource),
        calendar_events=await count(CalendarEvent),
        entrepreneur_projects=await count(EntrepreneurProject),
        forum_posts=await count(ForumPost),
    )


# ── Assistant IA — consommation ───────────────────────────────────────────────

def _assistant_period_key(mode: str) -> str:
    from datetime import datetime, timezone

    current = datetime.now(timezone.utc)
    if mode == "chat":
        return current.strftime("%Y-%m-%d")
    return current.strftime("%Y-%m")


@router.get("/assistant-usage", response_model=AdminAssistantUsageOut)
async def admin_assistant_usage(db: AsyncSession = Depends(get_db)):
    chat_period = _assistant_period_key("chat")
    orientation_period = _assistant_period_key("orientation")
    chat_limit = settings.assistant_chat_daily_limit
    orientation_limit = settings.assistant_orientation_monthly_limit

    result = await db.execute(
        select(AssistantUsage, User)
        .join(User, User.id == AssistantUsage.user_id)
        .where(
            or_(
                (AssistantUsage.mode == "chat") & (AssistantUsage.period_key == chat_period),
                (AssistantUsage.mode == "orientation") & (AssistantUsage.period_key == orientation_period),
            )
        )
        .order_by(User.name.asc())
    )
    rows = result.all()

    usage_by_user: dict[str, dict] = {}
    for usage, user in rows:
        entry = usage_by_user.setdefault(
            user.id,
            {
                "user": user,
                "chat_used": 0,
                "orientation_used": 0,
                "last_used_at": None,
            },
        )
        if usage.mode == "chat":
            entry["chat_used"] = usage.count
        elif usage.mode == "orientation":
            entry["orientation_used"] = usage.count

        updated = usage.updated_at
        if updated and (
            entry["last_used_at"] is None or updated > entry["last_used_at"]
        ):
            entry["last_used_at"] = updated

    chat_total_today = 0
    orientation_total_month = 0
    users_at_chat_limit = 0
    users_at_orientation_limit = 0
    active_chat_users_today = 0
    active_orientation_users_month = 0
    user_rows: list[AdminAssistantUsageUserOut] = []

    for entry in usage_by_user.values():
        user: User = entry["user"]
        chat_used = entry["chat_used"]
        orientation_used = entry["orientation_used"]
        unlimited = user.role == "admin"

        chat_total_today += chat_used
        orientation_total_month += orientation_used

        if chat_used > 0:
            active_chat_users_today += 1
        if orientation_used > 0:
            active_orientation_users_month += 1

        chat_remaining = None if unlimited else max(0, chat_limit - chat_used)
        orientation_remaining = None if unlimited else max(0, orientation_limit - orientation_used)
        chat_at_limit = not unlimited and chat_used >= chat_limit
        orientation_at_limit = not unlimited and orientation_used >= orientation_limit

        if chat_at_limit:
            users_at_chat_limit += 1
        if orientation_at_limit:
            users_at_orientation_limit += 1

        user_rows.append(
            AdminAssistantUsageUserOut(
                user_id=user.id,
                name=user.name,
                email=user.email,
                phone=user.phone,
                role=user.role,
                chat_used=chat_used,
                chat_limit=None if unlimited else chat_limit,
                chat_remaining=chat_remaining,
                orientation_used=orientation_used,
                orientation_limit=None if unlimited else orientation_limit,
                orientation_remaining=orientation_remaining,
                chat_at_limit=chat_at_limit,
                orientation_at_limit=orientation_at_limit,
                last_used_at=entry["last_used_at"],
            )
        )

    user_rows.sort(key=lambda row: (row.chat_used + row.orientation_used, row.chat_used), reverse=True)

    summary = AdminAssistantUsageSummaryOut(
        chat_daily_limit=chat_limit,
        orientation_monthly_limit=orientation_limit,
        chat_total_today=chat_total_today,
        orientation_total_month=orientation_total_month,
        active_chat_users_today=active_chat_users_today,
        active_orientation_users_month=active_orientation_users_month,
        users_at_chat_limit=users_at_chat_limit,
        users_at_orientation_limit=users_at_orientation_limit,
        chat_period_key=chat_period,
        orientation_period_key=orientation_period,
    )

    return AdminAssistantUsageOut(summary=summary, users=user_rows)


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=list[AdminUserOut])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User)
        .options(selectinload(User.advisor_profile))
        .order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    return [
        AdminUserOut(
            id=u.id,
            email=u.email,
            phone=u.phone,
            name=u.name,
            role=u.role,
            city=u.city,
            bac_option=u.bac_option,
            university=u.university,
            field=u.field,
            is_advisor=u.advisor_profile is not None,
            created_at=u.created_at,
        )
        for u in users
    ]


@router.patch("/users/{user_id}", response_model=AdminUserOut)
async def update_user_admin(
    user_id: str,
    body: AdminUserUpdate,
    db: AsyncSession = Depends(get_db),
):
    if body.role and body.role not in ("bachelier", "etudiant", "admin"):
        raise HTTPException(status_code=400, detail="Rôle invalide")

    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.advisor_profile))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    _apply_updates(user, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(user)

    return AdminUserOut(
        id=user.id,
        email=user.email,
        phone=user.phone,
        name=user.name,
        role=user.role,
        city=user.city,
        bac_option=user.bac_option,
        university=user.university,
        field=user.field,
        is_advisor=user.advisor_profile is not None,
        created_at=user.created_at,
    )


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db), admin: User = Depends(get_current_admin)):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Impossible de supprimer votre propre compte admin")
    user = await _get_or_404(db, User, user_id)
    await db.delete(user)
    await db.commit()


# ── Mentors ───────────────────────────────────────────────────────────────────

@router.get("/mentors", response_model=list[AdminMentorOut])
async def list_mentors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AdvisorProfile, User)
        .join(User, User.id == AdvisorProfile.user_id)
        .order_by(AdvisorProfile.created_at.desc())
    )
    rows = result.all()
    return [
        AdminMentorOut(
            user_id=adv.user_id,
            name=user.name,
            email=user.email,
            phone=user.phone,
            field=adv.field,
            university=adv.university,
            year=adv.year,
            description=adv.description,
            meet_link=adv.meet_link,
        )
        for adv, user in rows
    ]


@router.delete("/mentors/{user_id}", status_code=204)
async def remove_mentor(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdvisorProfile).where(AdvisorProfile.user_id == user_id))
    adv = result.scalar_one_or_none()
    if not adv:
        raise HTTPException(status_code=404, detail="Mentor introuvable")
    await db.delete(adv)
    await db.commit()


# ── Stages ────────────────────────────────────────────────────────────────────

@router.get("/stages", response_model=list[StageOfferOut])
async def admin_list_stages(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StageOffer).order_by(StageOffer.created_at.desc()))
    return result.scalars().all()


@router.post("/stages", response_model=StageOfferOut, status_code=201)
async def admin_create_stage(body: StageOfferCreate, db: AsyncSession = Depends(get_db)):
    offer = StageOffer(**body.model_dump())
    db.add(offer)
    await db.commit()
    await db.refresh(offer)
    return offer


@router.patch("/stages/{item_id}", response_model=StageOfferOut)
async def admin_update_stage(item_id: str, body: StageOfferUpdate, db: AsyncSession = Depends(get_db)):
    offer = await _get_or_404(db, StageOffer, item_id)
    _apply_updates(offer, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(offer)
    return offer


@router.delete("/stages/{item_id}", status_code=204)
async def admin_delete_stage(item_id: str, db: AsyncSession = Depends(get_db)):
    offer = await _get_or_404(db, StageOffer, item_id)
    await db.delete(offer)
    await db.commit()


# ── Success Stories ───────────────────────────────────────────────────────────

@router.get("/stories", response_model=list[SuccessStoryOut])
async def admin_list_stories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SuccessStory).order_by(SuccessStory.created_at.desc()))
    return result.scalars().all()


@router.post("/stories", response_model=SuccessStoryOut, status_code=201)
async def admin_create_story(body: SuccessStoryCreate, db: AsyncSession = Depends(get_db)):
    story = SuccessStory(**body.model_dump())
    db.add(story)
    await db.commit()
    await db.refresh(story)
    return story


@router.patch("/stories/{item_id}", response_model=SuccessStoryOut)
async def admin_update_story(item_id: str, body: SuccessStoryUpdate, db: AsyncSession = Depends(get_db)):
    story = await _get_or_404(db, SuccessStory, item_id)
    _apply_updates(story, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(story)
    return story


@router.delete("/stories/{item_id}", status_code=204)
async def admin_delete_story(item_id: str, db: AsyncSession = Depends(get_db)):
    story = await _get_or_404(db, SuccessStory, item_id)
    await db.delete(story)
    await db.commit()


# ── Scholarships ──────────────────────────────────────────────────────────────

@router.get("/scholarships", response_model=list[ScholarshipOut])
async def admin_list_scholarships(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scholarship).order_by(Scholarship.created_at.desc()))
    return result.scalars().all()


@router.post("/scholarships", response_model=ScholarshipOut, status_code=201)
async def admin_create_scholarship(body: ScholarshipCreate, db: AsyncSession = Depends(get_db)):
    item = Scholarship(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/scholarships/{item_id}", response_model=ScholarshipOut)
async def admin_update_scholarship(item_id: str, body: ScholarshipUpdate, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, Scholarship, item_id)
    _apply_updates(item, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/scholarships/{item_id}", status_code=204)
async def admin_delete_scholarship(item_id: str, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, Scholarship, item_id)
    await db.delete(item)
    await db.commit()


# ── Resources ─────────────────────────────────────────────────────────────────

@router.get("/resources", response_model=list[ResourceOut])
async def admin_list_resources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resource).order_by(Resource.created_at.desc()))
    return result.scalars().all()


@router.post("/resources", response_model=ResourceOut, status_code=201)
async def admin_create_resource(body: ResourceCreate, db: AsyncSession = Depends(get_db)):
    item = Resource(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/resources/{item_id}", response_model=ResourceOut)
async def admin_update_resource(item_id: str, body: ResourceUpdate, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, Resource, item_id)
    _apply_updates(item, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/resources/{item_id}", status_code=204)
async def admin_delete_resource(item_id: str, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, Resource, item_id)
    await db.delete(item)
    await db.commit()


# ── Calendar ──────────────────────────────────────────────────────────────────

@router.get("/calendar", response_model=list[CalendarEventOut])
async def admin_list_calendar(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CalendarEvent).order_by(CalendarEvent.start_date.desc()))
    return result.scalars().all()


@router.post("/calendar", response_model=CalendarEventOut, status_code=201)
async def admin_create_calendar(body: CalendarEventCreate, db: AsyncSession = Depends(get_db)):
    item = CalendarEvent(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/calendar/{item_id}", response_model=CalendarEventOut)
async def admin_update_calendar(item_id: str, body: CalendarEventUpdate, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, CalendarEvent, item_id)
    _apply_updates(item, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/calendar/{item_id}", status_code=204)
async def admin_delete_calendar(item_id: str, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, CalendarEvent, item_id)
    await db.delete(item)
    await db.commit()


# ── Entrepreneur ──────────────────────────────────────────────────────────────

@router.get("/entrepreneur", response_model=list[EntrepreneurProjectOut])
async def admin_list_entrepreneur(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EntrepreneurProject).order_by(EntrepreneurProject.created_at.desc()))
    return result.scalars().all()


@router.post("/entrepreneur", response_model=EntrepreneurProjectOut, status_code=201)
async def admin_create_entrepreneur(body: EntrepreneurProjectCreate, db: AsyncSession = Depends(get_db)):
    item = EntrepreneurProject(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/entrepreneur/{item_id}", response_model=EntrepreneurProjectOut)
async def admin_update_entrepreneur(item_id: str, body: EntrepreneurProjectUpdate, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, EntrepreneurProject, item_id)
    _apply_updates(item, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/entrepreneur/{item_id}", status_code=204)
async def admin_delete_entrepreneur(item_id: str, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, EntrepreneurProject, item_id)
    await db.delete(item)
    await db.commit()


# ── Forum ─────────────────────────────────────────────────────────────────────

@router.get("/forum", response_model=list[ForumPostOut])
async def admin_list_forum(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ForumPost).order_by(ForumPost.created_at.desc()))
    return result.scalars().all()


@router.post("/forum", response_model=ForumPostOut, status_code=201)
async def admin_create_forum(body: ForumPostCreate, db: AsyncSession = Depends(get_db)):
    item = ForumPost(**body.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch("/forum/{item_id}", response_model=ForumPostOut)
async def admin_update_forum(item_id: str, body: ForumPostUpdate, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, ForumPost, item_id)
    _apply_updates(item, body.model_dump(exclude_unset=True))
    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/forum/{item_id}", status_code=204)
async def admin_delete_forum(item_id: str, db: AsyncSession = Depends(get_db)):
    item = await _get_or_404(db, ForumPost, item_id)
    await db.delete(item)
    await db.commit()
