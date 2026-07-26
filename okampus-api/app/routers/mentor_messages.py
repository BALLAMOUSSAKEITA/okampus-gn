from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import AdvisorProfile, MentorMessage, PushSubscription, User
from app.push import send_push_notifications
from app.schemas import MentorMessageCreate, MentorMessageOut, PushSubscriptionCreate

router = APIRouter(tags=["mentor-messages"])


def _message_out(msg: MentorMessage, sender_name: str) -> MentorMessageOut:
    return MentorMessageOut(
        id=msg.id,
        sender_id=msg.sender_id,
        sender_name=sender_name,
        advisor_id=msg.advisor_id,
        content=msg.content,
        read=msg.read,
        created_at=msg.created_at,
    )


@router.post("/mentor-messages", response_model=MentorMessageOut, status_code=status.HTTP_201_CREATED)
async def send_mentor_message(
    body: MentorMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.advisor_id == current_user.id:
        raise HTTPException(status_code=400, detail="Tu ne peux pas t'envoyer un message")

    advisor_result = await db.execute(
        select(AdvisorProfile, User)
        .join(User, User.id == AdvisorProfile.user_id)
        .where(AdvisorProfile.user_id == body.advisor_id)
    )
    row = advisor_result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Conseiller introuvable")

    _, advisor_user = row

    message = MentorMessage(
        sender_id=current_user.id,
        advisor_id=body.advisor_id,
        content=body.content,
    )
    db.add(message)
    await db.flush()

    subs_result = await db.execute(
        select(PushSubscription).where(PushSubscription.user_id == body.advisor_id)
    )
    subscriptions = subs_result.scalars().all()

    preview = body.content[:120] + ("..." if len(body.content) > 120 else "")
    send_push_notifications(
        subscriptions,
        title=f"Nouveau message de {current_user.name}",
        body=preview,
        url="/profil",
    )

    await db.commit()
    await db.refresh(message)

    return _message_out(message, current_user.name)


@router.get("/mentor-messages/inbox", response_model=list[MentorMessageOut])
async def mentor_inbox(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    advisor = await db.execute(
        select(AdvisorProfile).where(AdvisorProfile.user_id == current_user.id)
    )
    if not advisor.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Reserve aux conseillers")

    result = await db.execute(
        select(MentorMessage, User)
        .join(User, User.id == MentorMessage.sender_id)
        .where(MentorMessage.advisor_id == current_user.id)
        .order_by(MentorMessage.created_at.desc())
    )
    rows = result.all()
    return [_message_out(msg, sender.name) for msg, sender in rows]


@router.patch("/mentor-messages/{message_id}/read", response_model=MentorMessageOut)
async def mark_message_read(
    message_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(MentorMessage, User)
        .join(User, User.id == MentorMessage.sender_id)
        .where(MentorMessage.id == message_id, MentorMessage.advisor_id == current_user.id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Message introuvable")

    message, sender = row
    message.read = True
    await db.commit()
    await db.refresh(message)
    return _message_out(message, sender.name)


@router.post("/push-subscriptions", status_code=status.HTTP_201_CREATED)
async def save_push_subscription(
    body: PushSubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = await db.execute(
        select(PushSubscription).where(
            PushSubscription.user_id == current_user.id,
            PushSubscription.endpoint == body.endpoint,
        )
    )
    sub = existing.scalar_one_or_none()
    if sub:
        sub.p256dh = body.keys["p256dh"]
        sub.auth = body.keys["auth"]
    else:
        sub = PushSubscription(
            user_id=current_user.id,
            endpoint=body.endpoint,
            p256dh=body.keys["p256dh"],
            auth=body.keys["auth"],
        )
        db.add(sub)

    await db.commit()
    return {"ok": True}
