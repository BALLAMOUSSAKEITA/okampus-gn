"""Tests pour /success-stories (CRUD, filtres)."""

from tests.conftest import auth_header


class TestListStories:
    async def test_list_stories(self, client):
        resp = await client.get("/success-stories")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_filter_by_category(self, client):
        resp = await client.get("/success-stories", params={"category": "tech"})
        assert resp.status_code == 200

    async def test_filter_by_featured(self, client):
        resp = await client.get("/success-stories", params={"featured": True})
        assert resp.status_code == 200


class TestCreateStory:
    PAYLOAD = {
        "title": "De Conakry a la Silicon Valley",
        "content": "Mon parcours depuis l'universite de Conakry jusqu'a un poste chez Google.",
        "category": "tech",
        "author_name": "Ibrahima Sow",
        "author_role": "Software Engineer",
        "university": "UGANC",
        "graduation_year": "2020",
    }

    async def test_create_as_user(self, client, test_user):
        _, token = test_user
        resp = await client.post("/success-stories", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "De Conakry a la Silicon Valley"
        assert data["likes"] == 0
        assert data["is_featured"] is False

    async def test_create_without_auth(self, client):
        resp = await client.post("/success-stories", json=self.PAYLOAD)
        assert resp.status_code in (401, 403)

    async def test_create_missing_fields(self, client, test_user):
        _, token = test_user
        resp = await client.post("/success-stories", json={"title": "Incomplet"}, headers=auth_header(token))
        assert resp.status_code == 422
