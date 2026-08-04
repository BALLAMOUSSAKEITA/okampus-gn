from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base
from app.security_headers import SecurityHeadersMiddleware
from app.seed_news import seed_default_news
from app.seed_pearson_scholarship import seed_pearson_scholarship
from app.routers import admin, assistant, auth, calendar, cv, entrepreneur, forum, mentor_messages, mentors, news, parcours, resources, scholarships, stages, stats, success_stories, users

# Importer tous les modèles pour que Base.metadata les connaisse
import app.models  # noqa: F401


async def _ensure_schema(conn) -> None:
    """Patches schema pour bases déjà deployees (create_all n'ajoute pas les colonnes)."""
    try:
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR"))
        await conn.execute(text("ALTER TABLE users ALTER COLUMN email DROP NOT NULL"))
        await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_users_phone ON users (phone)"))
        await conn.execute(text('ALTER TABLE mentor_messages ADD COLUMN IF NOT EXISTS "studentId" VARCHAR'))
        await conn.execute(
            text(
                'UPDATE mentor_messages SET "studentId" = "senderId" '
                'WHERE "studentId" IS NULL AND "senderId" != "advisorId"'
            )
        )
        # cv_profiles : colonne ASCII en prod (experiences), pas expériences
        await conn.execute(
            text(
                """
                DO $$
                BEGIN
                  IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = 'cv_profiles'
                      AND column_name = 'expériences'
                  ) AND NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = 'cv_profiles'
                      AND column_name = 'experiences'
                  ) THEN
                    ALTER TABLE cv_profiles RENAME COLUMN "expériences" TO experiences;
                  END IF;
                END $$;
                """
            )
        )
    except Exception as exc:
        print(f"[SCHEMA] ensure_schema skipped/failed: {type(exc).__name__}: {exc}")

    try:
        await conn.execute(text("ALTER TABLE platform_news ADD COLUMN IF NOT EXISTS content TEXT"))
    except Exception as exc:
        print(f"[SCHEMA] platform_news.content skipped/failed: {type(exc).__name__}: {exc}")

    try:
        await conn.execute(text('ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS content TEXT'))
        await conn.execute(text('ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0'))
        await conn.execute(text('ALTER TABLE platform_news ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0'))
    except Exception as exc:
        print(f"[SCHEMA] views/content columns skipped/failed: {type(exc).__name__}: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Créer toutes les tables au démarrage (si elles n'existent pas)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await _ensure_schema(conn)
    await seed_default_news()
    await seed_pearson_scholarship()
    yield


_is_dev = os.getenv("ENVIRONMENT", "development").lower() in ("development", "dev", "local")

app = FastAPI(
    title="BacheliO API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if _is_dev else None,
    redoc_url="/redoc" if _is_dev else None,
    openapi_url="/openapi.json" if _is_dev else None,
)

# CORS — autorise le frontend Next.js (tous ports localhost en dev)
_cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://okampus-gn-production.up.railway.app",
]
_extra_origins = os.getenv("CORS_ORIGINS", "")
if _extra_origins:
    _cors_origins.extend(origin.strip() for origin in _extra_origins.split(",") if origin.strip())

app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(admin.router)
app.include_router(assistant.router)
app.include_router(auth.router)
app.include_router(news.router)
app.include_router(users.router)
app.include_router(calendar.router)
app.include_router(cv.router)
app.include_router(entrepreneur.router)
app.include_router(parcours.router)
app.include_router(resources.router)
app.include_router(scholarships.router)
app.include_router(stages.router)
app.include_router(success_stories.router)
app.include_router(forum.router)
app.include_router(mentors.router)
app.include_router(mentor_messages.router)
app.include_router(stats.router)

# Les fichiers uploadés ne sont plus servis publiquement — voir GET /resources/{id}/download


@app.get("/health")
async def health():
    return {"status": "ok"}
