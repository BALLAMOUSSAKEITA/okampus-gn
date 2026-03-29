from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.auth import get_current_user
from app.database import get_db
from app.models import AdvisorProfile, CvProfile, User
from app.schemas import AdvisorProfileOut, CvProfileOut, UpdateUserRequest, UserOut

router = APIRouter(prefix="/users", tags=["users"])


def _build_user_out(user: User) -> UserOut:
    cv = None
    if user.cv_profile:
        cv = CvProfileOut(
            id=user.cv_profile.id,
            phone=user.cv_profile.phone,
            location=user.cv_profile.location,
            headline=user.cv_profile.headline,
            about=user.cv_profile.about,
            skills=user.cv_profile.skills or [],
            languages=user.cv_profile.languages or [],
            education=user.cv_profile.education or [],
            experiences=user.cv_profile.experiences or [],
            projects=user.cv_profile.projects or [],
        )

    adv = None
    if user.advisor_profile:
        adv = AdvisorProfileOut(
            id=user.advisor_profile.id,
            field=user.advisor_profile.field,
            university=user.advisor_profile.university,
            year=user.advisor_profile.year,
            description=user.advisor_profile.description,
            meet_link=user.advisor_profile.meet_link,
            available_slots=user.advisor_profile.available_slots or [],
        )

    return UserOut(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        is_advisor=user.advisor_profile is not None,
        advisor_profile=adv,
        cv_profile=cv,
        created_at=user.created_at,
    )


@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.cv_profile), selectinload(User.advisor_profile))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return _build_user_out(user)


@router.patch("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: str,
    body: UpdateUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Accès refusé")

    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.cv_profile), selectinload(User.advisor_profile))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    # Profil conseiller
    if body.is_advisor is not None:
        if body.is_advisor and body.advisor_profile:
            if user.advisor_profile:
                for k, v in body.advisor_profile.items():
                    setattr(user.advisor_profile, k, v)
            else:
                adv_data = {_to_snake(k): v for k, v in body.advisor_profile.items()}
                adv = AdvisorProfile(user_id=user_id, **adv_data)
                db.add(adv)
        elif not body.is_advisor and user.advisor_profile:
            await db.delete(user.advisor_profile)

    # Profil CV
    if body.cv_profile:
        if user.cv_profile:
            for k, v in body.cv_profile.items():
                setattr(user.cv_profile, k, v)
        else:
            cv_data = {_to_snake(k): v for k, v in body.cv_profile.items()}
            cv = CvProfile(user_id=user_id, **cv_data)
            db.add(cv)

    await db.commit()

    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.cv_profile), selectinload(User.advisor_profile))
    )
    user = result.scalar_one()
    return _build_user_out(user)


def _to_snake(name: str) -> str:
    """Convert camelCase to snake_case for model attributes."""
    import re
    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", name)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()
