from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import or_, select

from app.auth import DUMMY_BCRYPT_HASH, create_accèss_token, hash_password, verify_password
from app.rate_limit import check_rate_limit
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
async def register(
    body: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    check_rate_limit(request, "auth_register", max_calls=5, window_seconds=3600)
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
            raise HTTPException(status_code=400, detail="Identifiant déjà utilisé")

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
        raise HTTPException(status_code=500, detail="Erreur serveur lors de l'inscription")

    return _user_out(user)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    check_rate_limit(request, "auth_login", max_calls=10, window_seconds=900)
    identifier = body.identifier or ""
    if looks_like_email(identifier):
        result = await db.execute(select(User).where(User.email == identifier))
    else:
        result = await db.execute(select(User).where(User.phone == identifier))

    user = result.scalar_one_or_none()

    password_hash = user.password if user else DUMMY_BCRYPT_HASH
    if not verify_password(body.password, password_hash):
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")
    if not user:
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")

    token = create_accèss_token({"sub": user.id, "role": user.role})

    return TokenResponse(
        accèss_token=token,
        user=_user_out(user),
    )
