"""Tests pour /scholarships (CRUD, filtres, admin)."""

from tests.conftest import auth_header


class TestListScholarships:
    async def test_list_scholarships(self, client):
        resp = await client.get("/scholarships")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_filter_by_type(self, client):
        resp = await client.get("/scholarships", params={"type": "nationale"})
        assert resp.status_code == 200

    async def test_filter_by_location(self, client):
        resp = await client.get("/scholarships", params={"location": "France"})
        assert resp.status_code == 200


class TestCreateScholarship:
    PAYLOAD = {
        "title": "Bourse Test",
        "type": "nationale",
        "organization": "Ministere Test",
        "description": "Une bourse de test pour les etudiants meritants.",
        "eligibility": "Etudiant guineen",
        "amount": "500 000 GNF",
        "domain": "Sciences",
        "location": "Guinee",
    }

    async def test_create_as_admin(self, client, admin_user):
        _, token = admin_user
        resp = await client.post("/scholarships", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Bourse Test"
        assert data["organization"] == "Ministere Test"

    async def test_create_as_regular_user_forbidden(self, client, test_user):
        _, token = test_user
        resp = await client.post("/scholarships", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 403

    async def test_create_without_auth(self, client):
        resp = await client.post("/scholarships", json=self.PAYLOAD)
        assert resp.status_code in (401, 403)

    async def test_create_missing_fields(self, client, admin_user):
        _, token = admin_user
        resp = await client.post("/scholarships", json={"title": "Incomplete"}, headers=auth_header(token))
        assert resp.status_code == 422
