from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import or_, select

from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models import User
from app.phone import looks_like_email
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_out(user: User) -> UserOut:
    return UserOut(
        id=user.id,
        email=user.email,
        phone=user.phone,
        name=user.name,
        role=user.role,
        city=user.city,
        bac_option=user.bac_option,
        university=user.university,
        field=user.field,
        is_advisor=False,
    )


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    if body.role not in ("bachelier", "etudiant"):
        raise HTTPException(status_code=400, detail="Rôle invalide")

    filters = []
    if body.email:
        filters.append(User.email == body.email)
    if body.phone:
        filters.append(User.phone == body.phone)

    if filters:
        result = await db.execute(select(User).where(or_(*filters)))
        existing = result.scalar_one_or_none()
        if existing:
            if body.email and existing.email == body.email:
                raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
            raise HTTPException(status_code=400, detail="Ce numéro est déjà utilisé")

    try:
        user = User(
            name=body.name,
            email=body.email,
            phone=body.phone,
            password=hash_password(body.password),
            role=body.role,
            city=body.city,
            bac_option=body.bac_option,
            university=body.university,
            field=body.field,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    except Exception as e:
        await db.rollback()
        print(f"[REGISTER ERROR] {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {type(e).__name__}")

    return _user_out(user)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    identifier = body.identifier or ""
    if looks_like_email(identifier):
        result = await db.execute(select(User).where(User.email == identifier))
    else:
        result = await db.execute(select(User).where(User.phone == identifier))

    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")

    token = create_access_token({"sub": user.id, "role": user.role})

    return TokenResponse(
        access_token=token,
        user=_user_out(user),
    )
