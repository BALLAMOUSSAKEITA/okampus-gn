"""
Tests d'integration - flux complets bout en bout.
Chaque test simule un parcours utilisateur reel.
"""

import uuid

from tests.conftest import auth_header


def _email() -> str:
    return f"integ-{uuid.uuid4().hex[:8]}@test.gn"


class TestFlowInscriptionRessourceAchat:
    """Flux : Inscription -> Login -> Creer ressource -> Acheter."""

    async def test_full_resource_flow(self, client):
        email = _email()

        # 1. Inscription
        reg = await client.post("/auth/register", json={
            "name": "Aissatou Bah",
            "email": email,
            "password": "MonMotDePasse123!",
            "role": "etudiant",
        })
        assert reg.status_code == 201
        user_id = reg.json()["id"]

        # 2. Login
        login = await client.post("/auth/login", json={
            "email": email,
            "password": "MonMotDePasse123!",
        })
        assert login.status_code == 200
        token = login.json()["access_token"]
        headers = auth_header(token)

        # 3. Creer une ressource
        create = await client.post("/resources", json={
            "title": "Cours de Maths L1",
            "description": "Cours complet de mathematiques pour les etudiants en premiere annee.",
            "category": "cours",
            "subject": "Mathematiques",
            "file_url": "https://example.com/maths-l1.pdf",
            "file_type": "pdf",
            "file_size": 5000000,
            "price": 2000,
            "is_premium": True,
        }, headers=headers)
        assert create.status_code == 201
        resource = create.json()
        assert resource["author_id"] == user_id
        assert resource["downloads"] == 0
        resource_id = resource["id"]

        # 4. Verifier que la ressource apparait dans la liste
        listing = await client.get("/resources")
        assert listing.status_code == 200
        ids = [r["id"] for r in listing.json()]
        assert resource_id in ids

        # 5. Acheter la ressource
        purchase = await client.post(
            f"/resources/{resource_id}/purchase",
            json={},
            headers=headers,
        )
        assert purchase.status_code == 201

        # 6. Verifier que le re-achat est interdit
        dup = await client.post(
            f"/resources/{resource_id}/purchase",
            json={},
            headers=headers,
        )
        assert dup.status_code == 400


class TestFlowInscriptionAdvisor:
    """Flux : Inscription -> Login -> Devenir advisor -> Verifier profil."""

    async def test_become_advisor_flow(self, client, test_user):
        user, token = test_user
        headers = auth_header(token)

        # 1. Verifier que le user n'est pas advisor
        profile = await client.get(f"/users/{user.id}")
        assert profile.status_code == 200
        assert profile.json()["is_advisor"] is False

        # 2. Devenir advisor
        update = await client.patch(f"/users/{user.id}", json={
            "is_advisor": True,
            "advisor_profile": {
                "field": "Informatique",
                "university": "UGANC",
                "year": "Master 2",
                "description": "Expert en developpement web et mobile",
                "meetLink": "https://meet.google.com/abc-def-ghi",
                "availableSlots": ["Lundi 10h-12h", "Mercredi 14h-16h"],
            },
        }, headers=headers)
        assert update.status_code == 200

        # 3. Verifier le profil advisor via GET
        profile2 = await client.get(f"/users/{user.id}")
        data = profile2.json()
        assert data["is_advisor"] is True
        assert data["advisor_profile"]["field"] == "Informatique"
        assert data["advisor_profile"]["university"] == "UGANC"

        # 4. Retirer le statut advisor
        remove = await client.patch(f"/users/{user.id}", json={
            "is_advisor": False,
        }, headers=headers)
        assert remove.status_code == 200

        # 5. Verifier que le profil advisor est supprime
        profile3 = await client.get(f"/users/{user.id}")
        assert profile3.json()["is_advisor"] is False
        assert profile3.json()["advisor_profile"] is None


class TestFlowInscriptionCandidatureStage:
    """Flux : Inscription -> Login -> Parcours -> Chercher stage -> Postuler."""

    async def test_stage_application_flow(self, client, test_user, admin_user):
        user, token = test_user
        _, admin_token = admin_user
        headers = auth_header(token)
        admin_headers = auth_header(admin_token)

        # 1. Remplir le parcours academique
        parcours = await client.put(f"/parcours/{user.id}", json={
            "university": "UGANC",
            "filiere": "Informatique",
            "annee_en_cours": "L3",
            "objectifs": ["Trouver un stage", "Obtenir mon diplome"],
        }, headers=headers)
        assert parcours.status_code == 200
        assert parcours.json()["filiere"] == "Informatique"

        # 2. Admin cree une offre de stage
        stage = await client.post("/stages", json={
            "title": "Stage Fullstack - Startup Conakry",
            "company": "KonakryTech",
            "location": "Conakry, Kaloum",
            "type": "stage",
            "domain": "Informatique",
            "description": "Stage de developpement fullstack avec React et FastAPI pour une startup.",
            "duration": "4 mois",
            "remuneration": "1 500 000 GNF / mois",
            "contact_email": "stages@konakrytech.gn",
        }, headers=admin_headers)
        assert stage.status_code == 201
        offer_id = stage.json()["id"]

        # 3. Verifier que l'offre est visible
        stages_list = await client.get("/stages")
        ids = [s["id"] for s in stages_list.json()]
        assert offer_id in ids

        # 4. Postuler au stage
        apply = await client.post(f"/stages/{offer_id}/apply", json={
            "message": "Etudiant en L3 Informatique, motive pour ce stage.",
        }, headers=headers)
        assert apply.status_code == 201
        assert apply.json()["status"] == "pending"
        assert apply.json()["user_id"] == user.id

        # 5. Verifier les candidatures
        apps = await client.get(f"/stages/{offer_id}/apply", headers=headers)
        assert apps.status_code == 200
        assert len(apps.json()) >= 1

        # 6. Re-candidature impossible
        dup = await client.post(f"/stages/{offer_id}/apply", json={}, headers=headers)
        assert dup.status_code == 400


class TestFlowAdminContent:
    """Flux : Admin cree bourses + calendrier -> Etudiant consulte."""

    async def test_admin_creates_content_flow(self, client, admin_user):
        _, admin_token = admin_user
        admin_headers = auth_header(admin_token)

        # 1. Admin cree une bourse
        bourse = await client.post("/scholarships", json={
            "title": "Bourse Test Integration",
            "type": "nationale",
            "organization": "Ministere Test",
            "description": "Bourse de test pour verifier le flux complet d'integration.",
            "eligibility": "Etudiant guineen en L3",
            "amount": "2 000 000 GNF",
            "domain": "Informatique",
            "location": "Guinee",
        }, headers=admin_headers)
        assert bourse.status_code == 201
        bourse_id = bourse.json()["id"]

        # 2. Admin cree un evenement calendrier
        event = await client.post("/calendar", json={
            "title": "Examen Integration Test",
            "type": "academique",
            "start_date": "2025-06-20T08:00:00Z",
            "end_date": "2025-06-20T17:00:00Z",
            "description": "Examen de test d'integration.",
            "location": "Campus UGANC",
            "color": "#dc2626",
        }, headers=admin_headers)
        assert event.status_code == 201
        event_id = event.json()["id"]

        # 3. Consultation publique (sans auth) - bourses
        bourses = await client.get("/scholarships")
        assert bourses.status_code == 200
        bourse_ids = [b["id"] for b in bourses.json()]
        assert bourse_id in bourse_ids

        # 4. Consultation publique - calendrier
        events = await client.get("/calendar")
        assert events.status_code == 200
        event_ids = [e["id"] for e in events.json()]
        assert event_id in event_ids

        # 5. Filtrer par type
        filtered = await client.get("/calendar", params={"type": "academique"})
        assert filtered.status_code == 200
        assert any(e["id"] == event_id for e in filtered.json())


class TestFlowProfilComplet:
    """Flux : Inscription -> CV -> Parcours -> Projet entrepreneurial -> Success story."""

    async def test_complete_profile_flow(self, client, test_user):
        user, token = test_user
        headers = auth_header(token)

        # 1. Remplir le CV
        cv_update = await client.patch(f"/users/{user.id}", json={
            "cv_profile": {
                "phone": "+224 622 11 22 33",
                "location": "Conakry",
                "headline": "Etudiant en Informatique passione",
                "about": "Developpeur web autodidacte depuis 2 ans.",
                "skills": ["Python", "React", "PostgreSQL"],
                "languages": ["Francais", "Anglais", "Soussou"],
                "education": [{"school": "UGANC", "degree": "Licence 3"}],
                "experiences": [{"company": "FreelanceGN", "role": "Developpeur"}],
            },
        }, headers=headers)
        assert cv_update.status_code == 200

        # 2. Remplir le parcours
        parcours = await client.put(f"/parcours/{user.id}", json={
            "university": "UGANC",
            "filiere": "Informatique",
            "annee_en_cours": "L3",
            "objectifs": ["Stage", "Master"],
            "notes": {"semestre1": 14.5},
        }, headers=headers)
        assert parcours.status_code == 200

        # 3. Creer un projet entrepreneurial
        project = await client.post("/entrepreneur", json={
            "title": "StudyGN",
            "description": "Application de partage de notes et ressources pour les etudiants guineens.",
            "category": "edtech",
            "status": "en cours",
            "team_size": 2,
            "seeking": "Developpeur mobile",
            "contact_info": "contact@studygn.com",
        }, headers=headers)
        assert project.status_code == 201
        assert project.json()["author_id"] == user.id

        # 4. Publier une success story
        story = await client.post("/success-stories", json={
            "title": "Comment j'ai lance ma startup a Conakry",
            "content": "Apres 2 ans d'etudes en informatique, j'ai decide de lancer StudyGN pour aider les etudiants.",
            "category": "entrepreneuriat",
            "author_name": user.name,
            "university": "UGANC",
            "graduation_year": "2025",
        }, headers=headers)
        assert story.status_code == 201

        # 5. Verifier que tout est visible publiquement
        profile = await client.get(f"/users/{user.id}")
        data = profile.json()
        assert data["cv_profile"] is not None
        assert "Python" in data["cv_profile"]["skills"]

        projects = await client.get("/entrepreneur")
        assert any(p["title"] == "StudyGN" for p in projects.json())

        stories = await client.get("/success-stories")
        assert any(s["title"] == "Comment j'ai lance ma startup a Conakry" for s in stories.json())


class TestFlowSecuriteAcces:
    """Flux : Verifier que les contraintes d'acces sont respectees bout en bout."""

    async def test_access_control_flow(self, client, test_user, admin_user):
        user, token = test_user
        admin, admin_token = admin_user
        user_headers = auth_header(token)
        admin_headers = auth_header(admin_token)

        # 1. Un etudiant ne peut pas creer de bourse
        resp = await client.post("/scholarships", json={
            "title": "Bourse Hack",
            "type": "test",
            "organization": "Hack Corp",
            "description": "Tentative de creation non autorisee de bourse par un etudiant.",
        }, headers=user_headers)
        assert resp.status_code == 403

        # 2. Un etudiant ne peut pas creer de stage
        resp = await client.post("/stages", json={
            "title": "Stage Hack",
            "company": "Hack Corp",
            "location": "Nowhere",
            "type": "stage",
            "domain": "Hack",
            "description": "Tentative de creation non autorisee de stage par un etudiant.",
        }, headers=user_headers)
        assert resp.status_code == 403

        # 3. Un etudiant ne peut pas creer d'evenement
        resp = await client.post("/calendar", json={
            "title": "Event Hack",
            "type": "test",
            "start_date": "2025-12-01T08:00:00Z",
        }, headers=user_headers)
        assert resp.status_code == 403

        # 4. Un user ne peut pas modifier le profil d'un autre
        resp = await client.patch(f"/users/{admin.id}", json={
            "cv_profile": {"phone": "hacked"},
        }, headers=user_headers)
        assert resp.status_code == 403

        # 5. Un user ne peut pas modifier le parcours d'un autre
        resp = await client.put(f"/parcours/{admin.id}", json={
            "university": "Hacked University",
        }, headers=user_headers)
        assert resp.status_code == 403

        # 6. Sans token, pas d'acces aux routes protegees
        resp = await client.post("/resources", json={
            "title": "Sans Auth",
            "description": "Tentative sans authentification pour tester les controles.",
            "category": "test",
            "subject": "test",
            "file_url": "https://example.com/x.pdf",
            "file_type": "pdf",
            "file_size": 100,
        })
        assert resp.status_code in (401, 403)
