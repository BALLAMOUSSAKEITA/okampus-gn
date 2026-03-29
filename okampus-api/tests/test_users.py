"""Tests pour /users (profil, update, acces)."""

from tests.conftest import auth_header


class TestGetUser:
    async def test_get_user_success(self, client, test_user):
        user, _ = test_user
        resp = await client.get(f"/users/{user.id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["email"] == user.email
        assert data["name"] == "Test User"
        assert data["role"] == "etudiant"

    async def test_get_user_not_found(self, client):
        resp = await client.get("/users/nonexistent-id")
        assert resp.status_code == 404


class TestUpdateUser:
    async def test_update_advisor_profile(self, client, test_user):
        user, token = test_user
        resp = await client.patch(
            f"/users/{user.id}",
            json={"is_advisor": True, "advisor_profile": {
                "field": "Informatique",
                "university": "UGANC",
                "year": "Master 2",
                "description": "Expert en dev web",
            }},
            headers=auth_header(token),
        )
        assert resp.status_code == 200
        # Verifier via GET que le profil est bien cree
        get_resp = await client.get(f"/users/{user.id}")
        data = get_resp.json()
        assert data["is_advisor"] is True
        assert data["advisor_profile"]["field"] == "Informatique"

    async def test_update_cv_profile(self, client, test_user):
        user, token = test_user
        resp = await client.patch(
            f"/users/{user.id}",
            json={"cv_profile": {
                "phone": "+224 622 00 00 00",
                "location": "Conakry",
                "headline": "Developpeur Full Stack",
                "skills": ["Python", "React"],
            }},
            headers=auth_header(token),
        )
        assert resp.status_code == 200
        # Verifier via GET
        get_resp = await client.get(f"/users/{user.id}")
        data = get_resp.json()
        assert data["cv_profile"]["phone"] == "+224 622 00 00 00"
        assert "Python" in data["cv_profile"]["skills"]

    async def test_update_other_user_forbidden(self, client, test_user, admin_user):
        user, _ = test_user
        _, admin_token = admin_user
        resp = await client.patch(
            f"/users/{user.id}",
            json={"is_advisor": True, "advisor_profile": {
                "field": "Droit",
                "university": "UGLC",
                "year": "L3",
                "description": "Conseils juridiques",
            }},
            headers=auth_header(admin_token),
        )
        assert resp.status_code == 403

    async def test_update_without_auth(self, client, test_user):
        user, _ = test_user
        resp = await client.patch(
            f"/users/{user.id}",
            json={"is_advisor": False},
        )
        assert resp.status_code in (401, 403)
