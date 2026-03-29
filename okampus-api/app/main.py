import time
import uuid
from contextlib import asynccontextmanager

_start_time: float = time.time()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from loguru import logger
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from sqlalchemy.exc import IntegrityError

from app.logging_config import setup_logging
from app.routers import auth, calendar, cv, entrepreneur, parcours, resources, scholarships, stages, success_stories, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("O'Kampus API demarree")
    yield
    logger.info("O'Kampus API arretee")


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="O'Kampus API", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter


# ── Gestion globale des erreurs ──────────────────────────────


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    retry_after = exc.detail.split(" ")[-1] if exc.detail else "60"
    return JSONResponse(
        status_code=429,
        content={"detail": "Trop de requêtes. Veuillez réessayer plus tard."},
        headers={"Retry-After": retry_after},
    )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    error_id = str(uuid.uuid4())
    logger.warning("IntegrityError [%s] %s %s: %s", error_id, request.method, request.url.path, exc.orig)
    return JSONResponse(
        status_code=409,
        content={"detail": "Conflit : cette ressource existe déjà ou viole une contrainte d'unicité.", "error_id": error_id},
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    error_id = str(uuid.uuid4())
    logger.warning("ValueError [%s] %s %s: %s", error_id, request.method, request.url.path, exc)
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "error_id": error_id},
    )


@app.exception_handler(TimeoutError)
async def timeout_error_handler(request: Request, exc: TimeoutError):
    error_id = str(uuid.uuid4())
    logger.error("TimeoutError [%s] %s %s", error_id, request.method, request.url.path)
    return JSONResponse(
        status_code=504,
        content={"detail": "Le serveur a mis trop de temps à répondre.", "error_id": error_id},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_id = str(uuid.uuid4())
    logger.exception("Unhandled exception [%s] %s %s", error_id, request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Une erreur interne est survenue.", "error_id": error_id},
    )


# CORS — autorise le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://okampus-gn-production.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Middleware de logging des requêtes ────────────────────────


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "{method} {path} -> {status} ({duration:.0f}ms)",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration=duration_ms,
    )
    return response


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


@app.get("/health")
async def health():
    from sqlalchemy import text
    from app.config import settings
    from app.database import AsyncSessionLocal

    # Verifier la connexion DB
    db_status = "connected"
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    # Verifier la cle OpenAI
    openai_status = "configured" if settings.openai_api_key else "not configured"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "version": app.version,
        "database": db_status,
        "openai": openai_status,
        "uptime_seconds": int(time.time() - _start_time),
    }
