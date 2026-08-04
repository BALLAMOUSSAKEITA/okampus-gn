"""Tests pour /entrepreneur (CRUD, filtres)."""

from tests.conftest import auth_header


class TestListProjects:
    async def test_list_projects(self, client):
        resp = await client.get("/entrepreneur")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_filter_by_category(self, client):
        resp = await client.get("/entrepreneur", params={"category": "tech"})
        assert resp.status_code == 200

    async def test_filter_by_status(self, client):
        resp = await client.get("/entrepreneur", params={"status": "en cours"})
        assert resp.status_code == 200


class TestCreateProject:
    PAYLOAD = {
        "title": "EduTech Guinee",
        "description": "Plateforme d'apprentissage en ligne adaptee au contexte guineen.",
        "category": "tech",
        "status": "en cours",
        "team_size": 3,
        "seeking": "Developpeur mobile",
        "contact_info": "contact@edutech.gn",
    }

    async def test_create_as_user(self, client, test_user):
        _, token = test_user
        resp = await client.post("/entrepreneur", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "EduTech Guinee"
        assert data["team_size"] == 3
        assert data["likes"] == 0

    async def test_create_without_auth(self, client):
        resp = await client.post("/entrepreneur", json=self.PAYLOAD)
        assert resp.status_code in (401, 403)

    async def test_create_missing_fields(self, client, test_user):
        _, token = test_user
        resp = await client.post("/entrepreneur", json={"title": "Incomplet"}, headers=auth_header(token))
        assert resp.status_code == 422

    async def test_create_invalid_team_size(self, client, test_user):
        _, token = test_user
        payload = {**self.PAYLOAD, "team_size": 0}
        resp = await client.post("/entrepreneur", json=payload, headers=auth_header(token))
        assert resp.status_code == 422
