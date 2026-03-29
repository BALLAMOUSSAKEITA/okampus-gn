"""
Fixtures partagees pour tous les tests.
Chaque test utilise des emails uniques pour eviter les conflits.
"""

import uuid

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.config import settings
from app.database import Base, get_db
from app.auth import hash_password, create_access_token

import app.models as models  # noqa: F401

# Desactiver le rate limiting AVANT tout test
from app.main import limiter as _limiter
_limiter.enabled = False

_db_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://", 1)


def _uid() -> str:
    return uuid.uuid4().hex[:8]


@pytest.fixture(scope="session")
async def engine():
    """Engine cree une seule fois dans le bon event loop."""
    eng = create_async_engine(_db_url, pool_pre_ping=True)
    async with eng.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield eng
    await eng.dispose()


@pytest.fixture(autouse=True)
async def setup_db(engine):
    """Override get_db pour chaque test avec une session du bon event loop."""
    session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async def override_get_db():
        async with session_factory() as session:
            yield session

    from app.main import app
    app.dependency_overrides[get_db] = override_get_db
    yield session_factory
    app.dependency_overrides.clear()


@pytest.fixture
async def client(engine):
    """Client HTTP async pour tester l'API."""
    import app.database as db_mod
    original_engine = db_mod.engine
    db_mod.engine = engine
    original_session = db_mod.AsyncSessionLocal
    db_mod.AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    from app.main import app, limiter
    limiter.enabled = False
    limiter._limiter.storage.reset()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    db_mod.engine = original_engine
    db_mod.AsyncSessionLocal = original_session


@pytest.fixture
async def test_user(setup_db):
    """Cree un utilisateur etudiant de test avec email unique."""
    uid = _uid()
    session_factory = setup_db
    async with session_factory() as session:
        user = models.User(
            email=f"test-{uid}@okampus.gn",
            name="Test User",
            password=hash_password("TestPassword123"),
            role="etudiant",
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        token = create_access_token({"sub": user.id, "role": user.role})
        return user, token


@pytest.fixture
async def admin_user(setup_db):
    """Cree un utilisateur admin de test avec email unique."""
    uid = _uid()
    session_factory = setup_db
    async with session_factory() as session:
        user = models.User(
            email=f"admin-{uid}@okampus.gn",
            name="Admin Test",
            password=hash_password("AdminPassword123"),
            role="admin",
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        token = create_access_token({"sub": user.id, "role": user.role})
        return user, token


def auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}
