"""Tests pour /stages (CRUD, candidature, filtres)."""

from tests.conftest import auth_header


class TestListStages:
    async def test_list_stages(self, client):
        resp = await client.get("/stages")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    async def test_filter_by_domain(self, client):
        resp = await client.get("/stages", params={"domain": "Informatique"})
        assert resp.status_code == 200

    async def test_filter_by_type(self, client):
        resp = await client.get("/stages", params={"type": "stage"})
        assert resp.status_code == 200


class TestCreateStage:
    PAYLOAD = {
        "title": "Stage Dev Web",
        "company": "Tech Guinee",
        "location": "Conakry",
        "type": "stage",
        "domain": "Informatique",
        "description": "Stage de developpement web fullstack avec React et Python.",
        "duration": "3 mois",
        "remuneration": "1 000 000 GNF",
    }

    async def test_create_as_admin(self, client, admin_user):
        _, token = admin_user
        resp = await client.post("/stages", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Stage Dev Web"
        assert data["company"] == "Tech Guinee"

    async def test_create_as_regular_user_forbidden(self, client, test_user):
        _, token = test_user
        resp = await client.post("/stages", json=self.PAYLOAD, headers=auth_header(token))
        assert resp.status_code == 403

    async def test_create_without_auth(self, client):
        resp = await client.post("/stages", json=self.PAYLOAD)
        assert resp.status_code in (401, 403)


class TestApplyStage:
    async def test_apply_to_stage(self, client, admin_user, test_user):
        # Admin cree une offre
        _, admin_token = admin_user
        create_resp = await client.post("/stages", json={
            "title": "Stage pour candidature",
            "company": "Corp Test",
            "location": "Conakry",
            "type": "stage",
            "domain": "Finance",
            "description": "Stage en analyse financiere pour les etudiants en economie.",
        }, headers=auth_header(admin_token))
        assert create_resp.status_code == 201
        offer_id = create_resp.json()["id"]

        # Etudiant postule
        user, token = test_user
        resp = await client.post(
            f"/stages/{offer_id}/apply",
            json={"message": "Je suis motive pour ce stage."},
            headers=auth_header(token),
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["offer_id"] == offer_id
        assert data["status"] == "pending"

    async def test_apply_duplicate(self, client, admin_user, test_user):
        _, admin_token = admin_user
        create_resp = await client.post("/stages", json={
            "title": "Stage doublon",
            "company": "Corp Dup",
            "location": "Conakry",
            "type": "stage",
            "domain": "Marketing",
            "description": "Stage en marketing digital pour les etudiants en communication.",
        }, headers=auth_header(admin_token))
        offer_id = create_resp.json()["id"]

        _, token = test_user
        await client.post(f"/stages/{offer_id}/apply", json={}, headers=auth_header(token))
        resp2 = await client.post(f"/stages/{offer_id}/apply", json={}, headers=auth_header(token))
        assert resp2.status_code == 400

    async def test_apply_nonexistent_offer(self, client, test_user):
        _, token = test_user
        resp = await client.post("/stages/fake-id/apply", json={}, headers=auth_header(token))
        assert resp.status_code == 404
