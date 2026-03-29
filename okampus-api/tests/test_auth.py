"""Tests pour /auth (inscription, login, erreurs)."""

import uuid

from tests.conftest import auth_header


def _email() -> str:
    return f"auth-{uuid.uuid4().hex[:8]}@test.gn"


class TestRegisterValidation:
    """Tests de validation (pas de hit au rate limiter car 422 avant le decorateur)."""

    async def test_register_invalid_role(self, client):
        resp = await client.post("/auth/register", json={
            "name": "Test",
            "email": _email(),
            "password": "Secure123!",
            "role": "superadmin",
        })
        assert resp.status_code == 422

    async def test_register_short_password(self, client):
        resp = await client.post("/auth/register", json={
            "name": "Test",
            "email": _email(),
            "password": "abc",
            "role": "etudiant",
        })
        assert resp.status_code == 422

    async def test_register_missing_fields(self, client):
        resp = await client.post("/auth/register", json={"name": "Test"})
        assert resp.status_code == 422

    async def test_register_invalid_email(self, client):
        resp = await client.post("/auth/register", json={
            "name": "Test",
            "email": "not-an-email",
            "password": "Secure123!",
            "role": "etudiant",
        })
        assert resp.status_code == 422

    async def test_login_missing_fields(self, client):
        resp = await client.post("/auth/login", json={"email": "a@b.com"})
        assert resp.status_code == 422


class TestRegisterSuccess:
    """Tests d'inscription reussie (consomment le rate limiter)."""

    async def test_register_success(self, client):
        email = _email()
        resp = await client.post("/auth/register", json={
            "name": "Mamadou Diallo",
            "email": email,
            "password": "Secure123!",
            "role": "etudiant",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == email
        assert data["name"] == "Mamadou Diallo"
        assert data["role"] == "etudiant"
        assert "id" in data

    async def test_register_xss_sanitized(self, client):
        resp = await client.post("/auth/register", json={
            "name": "<script>alert('xss')</script>Mamadou",
            "email": _email(),
            "password": "Secure123!",
            "role": "etudiant",
        })
        assert resp.status_code == 201
        assert "<script>" not in resp.json()["name"]

    async def test_register_duplicate_email(self, client, test_user):
        """Utilise un user existant (cree par fixture) pour tester le doublon."""
        user, _ = test_user
        resp = await client.post("/auth/register", json={
            "name": "Doublon",
            "email": user.email,
            "password": "Secure123!",
            "role": "etudiant",
        })
        assert resp.status_code == 400
        assert "déjà utilisé" in resp.json()["detail"]


class TestLogin:
    async def test_login_success(self, client, test_user):
        """Utilise un user cree par fixture (pas de register => pas de rate limit)."""
        user, _ = test_user
        resp = await client.post("/auth/login", json={
            "email": user.email,
            "password": "TestPassword123",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == user.email

    async def test_login_wrong_password(self, client, test_user):
        user, _ = test_user
        resp = await client.post("/auth/login", json={
            "email": user.email,
            "password": "WrongPassword",
        })
        assert resp.status_code == 401

    async def test_login_nonexistent_email(self, client):
        resp = await client.post("/auth/login", json={
            "email": _email(),
            "password": "Secure123!",
        })
        assert resp.status_code == 401


class TestTokenAuth:
    async def test_invalid_token(self, client):
        resp = await client.get("/users/fakeid", headers=auth_header("invalid.token.here"))
        assert resp.status_code in (401, 403, 404)

    async def test_no_token_on_protected_route(self, client, test_user):
        user, _ = test_user
        resp = await client.patch(f"/users/{user.id}", json={"is_advisor": True})
        assert resp.status_code in (401, 403)
