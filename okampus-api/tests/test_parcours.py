"""Tests pour /parcours (upsert, acces)."""

from tests.conftest import auth_header


class TestParcours:
    async def test_create_parcours(self, client, test_user):
        user, token = test_user
        resp = await client.put(f"/parcours/{user.id}", json={
            "university": "UGANC",
            "filiere": "Informatique",
            "annee_en_cours": "L3",
            "objectifs": ["Reussir les examens", "Trouver un stage"],
        }, headers=auth_header(token))
        assert resp.status_code == 200
        data = resp.json()
        assert data["university"] == "UGANC"
        assert data["filiere"] == "Informatique"

    async def test_update_parcours(self, client, test_user):
        user, token = test_user
        # Creer
        await client.put(f"/parcours/{user.id}", json={
            "university": "UGANC",
            "filiere": "Informatique",
            "annee_en_cours": "L3",
        }, headers=auth_header(token))
        # Update
        resp = await client.put(f"/parcours/{user.id}", json={
            "annee_en_cours": "M1",
        }, headers=auth_header(token))
        assert resp.status_code == 200
        assert resp.json()["annee_en_cours"] == "M1"

    async def test_get_parcours(self, client, test_user):
        user, token = test_user
        await client.put(f"/parcours/{user.id}", json={
            "university": "UGLCS",
            "filiere": "Droit",
        }, headers=auth_header(token))
        resp = await client.get(f"/parcours/{user.id}")
        assert resp.status_code == 200
        assert resp.json()["university"] == "UGLCS"

    async def test_get_parcours_not_found(self, client):
        resp = await client.get("/parcours/nonexistent-id")
        assert resp.status_code == 404

    async def test_update_other_user_forbidden(self, client, test_user, admin_user):
        user, _ = test_user
        _, admin_token = admin_user
        resp = await client.put(f"/parcours/{user.id}", json={
            "university": "Hack",
        }, headers=auth_header(admin_token))
        assert resp.status_code == 403

    async def test_update_without_auth(self, client, test_user):
        user, _ = test_user
        resp = await client.put(f"/parcours/{user.id}", json={"university": "UGANC"})
        assert resp.status_code in (401, 403)
