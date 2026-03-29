"""Tests pour /resources (CRUD, achat, filtres)."""

from tests.conftest import auth_header


class TestListResources:
    async def test_list_resources(self, client):
        resp = await client.get("/resources")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_filter_by_category(self, client):
        resp = await client.get("/resources", params={"category": "cours"})
        assert resp.status_code == 200

    async def test_filter_by_subject(self, client):
        resp = await client.get("/resources", params={"subject": "maths"})
        assert resp.status_code == 200


class TestCreateResource:
    PAYLOAD = {
        "title": "Cours Algorithmes",
        "description": "Cours complet d'algorithmique pour les etudiants en L2 informatique.",
        "category": "cours",
        "subject": "Informatique",
        "file_url": "https://example.com/algo.pdf",
        "file_type": "pdf",
        "file_size": 2048000,
        "price": 0,
        "is_premium": False,
    }

    async def test_create_as_user(self, client, test_user):
        _, token = test_user
        resp = await client.post("/resources", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Cours Algorithmes"
        assert data["downloads"] == 0

    async def test_create_without_auth(self, client):
        resp = await client.post("/resources", json=self.PAYLOAD)
        assert resp.status_code in (401, 403)

    async def test_create_missing_fields(self, client, test_user):
        _, token = test_user
        resp = await client.post("/resources", json={"title": "Incomplet"}, headers=auth_header(token))
        assert resp.status_code == 422

    async def test_create_file_too_large(self, client, test_user):
        _, token = test_user
        payload = {**self.PAYLOAD, "file_size": 200_000_000}
        resp = await client.post("/resources", json=payload, headers=auth_header(token))
        assert resp.status_code == 422


class TestPurchaseResource:
    async def test_purchase_resource(self, client, test_user):
        _, token = test_user
        # Creer la ressource
        create_resp = await client.post("/resources", json={
            "title": "Ressource Premium",
            "description": "Un document premium pour les etudiants avances en informatique.",
            "category": "examen",
            "subject": "Maths",
            "file_url": "https://example.com/premium.pdf",
            "file_type": "pdf",
            "file_size": 1024,
            "price": 5000,
            "is_premium": True,
        }, headers=auth_header(token))
        resource_id = create_resp.json()["id"]

        resp = await client.post(f"/resources/{resource_id}/purchase", json={}, headers=auth_header(token))
        assert resp.status_code == 201

    async def test_purchase_duplicate(self, client, test_user):
        _, token = test_user
        create_resp = await client.post("/resources", json={
            "title": "Ressource Dup",
            "description": "Un document pour tester l'achat en double des ressources.",
            "category": "cours",
            "subject": "Physique",
            "file_url": "https://example.com/dup.pdf",
            "file_type": "pdf",
            "file_size": 512,
            "price": 1000,
        }, headers=auth_header(token))
        resource_id = create_resp.json()["id"]

        await client.post(f"/resources/{resource_id}/purchase", json={}, headers=auth_header(token))
        resp2 = await client.post(f"/resources/{resource_id}/purchase", json={}, headers=auth_header(token))
        assert resp2.status_code == 400

    async def test_purchase_nonexistent(self, client, test_user):
        _, token = test_user
        resp = await client.post("/resources/fake-id/purchase", json={}, headers=auth_header(token))
        assert resp.status_code == 404
