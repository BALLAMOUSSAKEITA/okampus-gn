"""Tests pour /calendar (CRUD, filtres, admin)."""

from tests.conftest import auth_header


class TestListCalendar:
    async def test_list_events(self, client):
        resp = await client.get("/calendar")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_filter_by_type(self, client):
        resp = await client.get("/calendar", params={"type": "ferie"})
        assert resp.status_code == 200


class TestCreateCalendarEvent:
    PAYLOAD = {
        "title": "Examen Test",
        "type": "academique",
        "start_date": "2025-06-15T08:00:00Z",
        "description": "Examen de fin de semestre.",
        "location": "Campus UGANC",
        "color": "#dc2626",
    }

    async def test_create_as_admin(self, client, admin_user):
        _, token = admin_user
        resp = await client.post("/calendar", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Examen Test"

    async def test_create_as_regular_user_forbidden(self, client, test_user):
        _, token = test_user
        resp = await client.post("/calendar", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 403

    async def test_create_without_auth(self, client):
        resp = await client.post("/calendar", json=self.PAYLOAD)
        assert resp.status_code in (401, 403)

    async def test_create_missing_title(self, client, admin_user):
        _, token = admin_user
        resp = await client.post("/calendar", json={"type": "test", "start_date": "2025-06-15T08:00:00Z"}, headers=auth_header(token))
        assert resp.status_code == 422
