from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import AdvisorProfile, MentorMessage, PushSubscription, User
from app.push import send_push_notifications
from app.schemas import (
    MentorConversationOut,
    MentorMessageCreate,
    MentorMessageOut,
    PushSubscriptionCreate,
)

router = APIRouter(tags=["mentor-messages"])


def _message_out(msg: MentorMessage, sender_name: str) -> MentorMessageOut:
    return MentorMessageOut(
        id=msg.id,
        sender_id=msg.sender_id,
        sender_name=sender_name,
        advisor_id=msg.advisor_id,
        student_id=msg.student_id,
        content=msg.content,
        read=msg.read,
        created_at=msg.created_at,
    )


async def _is_advisor(user_id: str, db: AsyncSession) -> bool:
    result = await db.execute(select(AdvisorProfile).where(AdvisorProfile.user_id == user_id))
    return result.scalar_one_or_none() is not None


async def _notify_user(db: AsyncSession, user_id: str, title: str, body: str) -> None:
    subs_result = await db.execute(select(PushSubscription).where(PushSubscription.user_id == user_id))
    subscriptions = subs_result.scalars().all()
    send_push_notifications(subscriptions, title=title, body=body, url="/messages")


@router.post("/mentor-messages", response_model=MentorMessageOut, status_code=status.HTTP_201_CREATED)
async def send_mentor_message(
    body: MentorMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    is_advisor = await _is_advisor(current_user.id, db)

    if is_advisor:
        if body.advisor_id != current_user.id:
            raise HTTPException(status_code=400, detail="Identifiant conseiller invalide")
        if not body.student_id:
            raise HTTPException(status_code=400, detail="Identifiant étudiant requis pour répondre")
        student_id = body.student_id
        advisor_id = current_user.id
        notify_user_id = student_id

        prior = await db.execute(
            select(MentorMessage.id).where(
                MentorMessage.advisor_id == advisor_id,
                or_(
                    MentorMessage.student_id == student_id,
                    MentorMessage.sender_id == student_id,
                ),
            ).limit(1)
        )
        if not prior.scalar_one_or_none():
            raise HTTPException(status_code=403, detail="Aucune conversation avec cet étudiant")
    else:
        if body.advisor_id == current_user.id:
            raise HTTPException(status_code=400, detail="Tu ne peux pas t'envoyér un message")
        advisor_result = await db.execute(
            select(AdvisorProfile).where(AdvisorProfile.user_id == body.advisor_id)
        )
        if not advisor_result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Conseiller introuvable")
        student_id = current_user.id
        advisor_id = body.advisor_id
        notify_user_id = advisor_id

    message = MentorMessage(
        sender_id=current_user.id,
        advisor_id=advisor_id,
        student_id=student_id,
        content=body.content,
    )
    db.add(message)
    await db.flush()

    preview = body.content[:120] + ("..." if len(body.content) > 120 else "")
    await _notify_user(
        db,
        notify_user_id,
        title=f"Nouveau message de {current_user.name}",
        body=preview,
    )

    await db.commit()
    await db.refresh(message)

    return _message_out(message, current_user.name)


@router.get("/mentor-messages/conversations", response_model=list[MentorConversationOut])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(MentorMessage, User.name)
        .join(User, User.id == MentorMessage.sender_id)
        .where(
            or_(
                MentorMessage.advisor_id == current_user.id,
                MentorMessage.student_id == current_user.id,
                MentorMessage.sender_id == current_user.id,
            )
        )
        .order_by(MentorMessage.created_at.desc())
    )
    rows = result.all()

    grouped: dict[tuple[str, str], dict] = defaultdict(
        lambda: {
            "last_message": "",
            "last_message_at": None,
            "unread_count": 0,
            "other_user_id": "",
            "other_user_name": "",
        }
    )
    user_ids_to_fetch: set[str] = set()

    for msg, sender_name in rows:
        student_id = msg.student_id or (msg.sender_id if msg.sender_id != msg.advisor_id else "")
        if not student_id:
            continue
        key = (msg.advisor_id, student_id)
        entry = grouped[key]

        if entry["last_message_at"] is None:
            entry["last_message"] = msg.content
            entry["last_message_at"] = msg.created_at

        if msg.sender_id != current_user.id and not msg.read:
            entry["unread_count"] += 1

        if current_user.id == msg.advisor_id:
            other_id = student_id
        else:
            other_id = msg.advisor_id
        entry["other_user_id"] = other_id
        user_ids_to_fetch.add(other_id)

    if user_ids_to_fetch:
        users_result = await db.execute(select(User).where(User.id.in_(user_ids_to_fetch)))
        names = {u.id: u.name for u in users_result.scalars().all()}
        for key, entry in grouped.items():
            oid = entry["other_user_id"]
            if oid in names:
                entry["other_user_name"] = names[oid]

    conversations = [
        MentorConversationOut(
            advisor_id=key[0],
            student_id=key[1],
            other_user_id=entry["other_user_id"],
            other_user_name=entry["other_user_name"] or "Utilisateur",
            last_message=entry["last_message"],
            last_message_at=entry["last_message_at"],
            unread_count=entry["unread_count"],
        )
        for key, entry in grouped.items()
        if entry["last_message_at"] is not None
    ]
    conversations.sort(key=lambda c: c.last_message_at, reverse=True)
    return conversations


@router.get("/mentor-messages/thread", response_model=list[MentorMessageOut])
async def get_thread(
    advisor_id: str = Query(...),
    student_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    is_advisor = await _is_advisor(current_user.id, db)

    if is_advisor:
        if current_user.id != advisor_id:
            raise HTTPException(status_code=403, detail="Accès refusé")
        if not student_id:
            raise HTTPException(status_code=400, detail="Identifiant étudiant requis")
    else:
        student_id = current_user.id
        if current_user.id == advisor_id:
            raise HTTPException(status_code=400, detail="Conversation invalide")

        advisor_check = await db.execute(
            select(AdvisorProfile).where(AdvisorProfile.user_id == advisor_id)
        )
        if not advisor_check.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Conseiller introuvable")

    result = await db.execute(
        select(MentorMessage, User.name)
        .join(User, User.id == MentorMessage.sender_id)
        .where(
            MentorMessage.advisor_id == advisor_id,
            or_(
                MentorMessage.student_id == student_id,
                (MentorMessage.student_id.is_(None) & (MentorMessage.sender_id == student_id)),
            ),
        )
        .order_by(MentorMessage.created_at.asc())
    )
    rows = result.all()

    await db.execute(
        update(MentorMessage)
        .where(
            MentorMessage.advisor_id == advisor_id,
            or_(
                MentorMessage.student_id == student_id,
                (MentorMessage.student_id.is_(None) & (MentorMessage.sender_id == student_id)),
            ),
            MentorMessage.sender_id != current_user.id,
            MentorMessage.read.is_(False),
        )
        .values(read=True)
    )
    await db.commit()

    return [_message_out(msg, sender_name) for msg, sender_name in rows]


@router.get("/mentor-messages/inbox", response_model=list[MentorMessageOut])
async def mentor_inbox(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not await _is_advisor(current_user.id, db):
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
