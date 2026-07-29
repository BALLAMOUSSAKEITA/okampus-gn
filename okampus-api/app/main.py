from contextlib import asynccontextmanager
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.database import engine, Base
from app.routers import admin, assistant, auth, calendar, cv, entrepreneur, forum, mentor_messages, mentors, parcours, resources, scholarships, stages, stats, success_stories, users

# Importer tous les modèles pour que Base.metadata les connaisse
import app.models  # noqa: F401


async def _ensure_schema(conn) -> None:
    """Patches schema pour bases deja deployees (create_all n'ajoute pas les colonnes)."""
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
    except Exception as exc:
        print(f"[SCHEMA] ensure_schema skipped/failed: {type(exc).__name__}: {exc}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Créer toutes les tables au démarrage (si elles n'existent pas)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await _ensure_schema(conn)
    yield


app = FastAPI(title="BacheliO API", version="1.0.0", lifespan=lifespan)

# CORS — autorise le frontend Next.js (tous ports localhost en dev)
_cors_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://okampus-gn-production.up.railway.app",
]
_extra_origins = os.getenv("CORS_ORIGINS", "")
if _extra_origins:
    _cors_origins.extend(origin.strip() for origin in _extra_origins.split(",") if origin.strip())

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

_uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
_uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(_uploads_dir)), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}
