from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.config import settings
from app.database import get_db
from app.models import AssistantMessage, AssistantUsage, User
from app.rate_limit import check_rate_limit
from app.schemas import AssistantConsumeOut, AssistantLogIn, AssistantModeRequest, AssistantQuotaOut

router = APIRouter(prefix="/assistant", tags=["assistant"])

VALID_MODES = ("chat", "orientation")


def _period_key(mode: str, now: datetime | None = None) -> str:
    current = now or datetime.now(timezone.utc)
    if mode == "chat":
        return current.strftime("%Y-%m-%d")
    return current.strftime("%Y-%m")


def _period_label(mode: str) -> str:
    return "aujourd'hui" if mode == "chat" else "ce mois-ci"


def _limit_for_mode(mode: str) -> int:
    if mode == "chat":
        return settings.assistant_chat_daily_limit
    return settings.assistant_orientation_monthly_limit


def _is_unlimited(user: User) -> bool:
    return user.role == "admin"


async def _get_or_create_usage(
    db: AsyncSession, user_id: str, mode: str, period_key: str
) -> AssistantUsage:
    result = await db.execute(
        select(AssistantUsage)
        .where(
            AssistantUsage.user_id == user_id,
            AssistantUsage.mode == mode,
            AssistantUsage.period_key == period_key,
        )
        .with_for_update()
    )
    usage = result.scalar_one_or_none()
    if usage is None:
        usage = AssistantUsage(user_id=user_id, mode=mode, period_key=period_key, count=0)
        db.add(usage)
        await db.flush()
    return usage


def _quota_response(mode: str, usage: AssistantUsage, unlimited: bool) -> AssistantQuotaOut:
    if unlimited:
        return AssistantQuotaOut(
            mode=mode,
            limit=None,
            used=usage.count,
            remaining=None,
            unlimited=True,
            period_label=_period_label(mode),
        )

    limit = _limit_for_mode(mode)
    remaining = max(0, limit - usage.count)
    return AssistantQuotaOut(
        mode=mode,
        limit=limit,
        used=usage.count,
        remaining=remaining,
        unlimited=False,
        period_label=_period_label(mode),
    )


@router.get("/quota", response_model=AssistantQuotaOut)
async def get_quota(
    mode: str = "chat",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if mode not in VALID_MODES:
        mode = "chat"

    period_key = _period_key(mode)
    usage = await _get_or_create_usage(db, current_user.id, mode, period_key)
    await db.commit()
    return _quota_response(mode, usage, _is_unlimited(current_user))


@router.post("/consume", response_model=AssistantConsumeOut)
async def consume_quota(
    body: AssistantModeRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    check_rate_limit(request, "assistant_consume", max_calls=30, window_seconds=3600)
    mode = body.mode
    period_key = _period_key(mode)
    usage = await _get_or_create_usage(db, current_user.id, mode, period_key)

    if _is_unlimited(current_user):
        usage.count += 1
        await db.commit()
        quota = _quota_response(mode, usage, unlimited=True)
        return AssistantConsumeOut(allowed=True, **quota.model_dump())

    limit = _limit_for_mode(mode)
    if usage.count >= limit:
        await db.commit()
        quota = _quota_response(mode, usage, unlimited=False)
        return AssistantConsumeOut(allowed=False, **quota.model_dump())

    usage.count += 1
    await db.commit()
    quota = _quota_response(mode, usage, unlimited=False)
    return AssistantConsumeOut(allowed=True, **quota.model_dump())


@router.post("/log", status_code=204)
async def log_messages(
    body: AssistantLogIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    for message in body.messages:
        db.add(
            AssistantMessage(
                user_id=current_user.id,
                mode=body.mode,
                role=message.role,
                content=message.content,
            )
        )
    await db.commit()
