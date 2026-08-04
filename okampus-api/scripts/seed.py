"""
Seed script - Peuple la base avec des donnees reelles du contexte guineen.
Usage : python -m scripts.seed  (depuis okampus-api/)
Idempotent : peut etre relance sans creer de doublons.
"""

import asyncio
from datetime import datetime, timezone

from sqlalchemy import select

from app.auth import hash_password
from app.database import AsyncSessionLocal
from app.models import (
    CalendarEvent,
    Scholarship,
    StageOffer,
    User,
)


# ──────────────────────────────────────────────
# Donnees
# ──────────────────────────────────────────────

ADMIN = {
    "email": "admin@okampus.gn",
    "name": "Administrateur O'Kampus",
    "password": "OkampusAdmin2025!",
    "role": "admin",
}

SCHOLARSHIPS = [
    {
        "title": "Bourse d'Excellence du Gouvernement Guineen",
        "type": "nationale",
        "organization": "Ministere de l'Enseignement Superieur - Guinee",
        "description": "Bourse d'excellence accordee aux meilleurs etudiants guineans dans les universites publiques. Couvre les frais de scolarite et une allocation mensuelle.",
        "eligibility": "Etudiant guineens inscrit dans une universite publique, moyenne >= 14/20",
        "amount": "1 500 000 GNF / an",
        "deadline": datetime(2025, 9, 30, tzinfo=timezone.utc),
        "apply_link": None,
        "contact_info": "Direction Nationale des Bourses, Conakry",
        "domain": "Tous domaines",
        "location": "Guinee",
    },
    {
        "title": "Bourse Mastercard Foundation Scholars Program",
        "type": "internationale",
        "organization": "Mastercard Foundation",
        "description": "Programme de bourses completes pour les jeunes africains talentueux mais economiquement defavorises. Couvre scolarite, logement, livres et allocation.",
        "eligibility": "Jeune africain, excellence academique, engagement communautaire, besoin financier demontre",
        "amount": "Bourse complete (scolarite + vie)",
        "deadline": datetime(2025, 11, 15, tzinfo=timezone.utc),
        "apply_link": "https://mastercardfdn.org/all/scholars/",
        "contact_info": "mastercardfdn.org",
        "domain": "Tous domaines",
        "location": "Afrique / International",
    },
    {
        "title": "Campus France - Guinee",
        "type": "internationale",
        "organization": "Campus France / Ambassade de France en Guinee",
        "description": "Bourse du gouvernement francais pour les etudiants guineens souhaitant poursuivre leurs etudes en France. Couvre frais de scolarite et allocation mensuelle.",
        "eligibility": "Etudiant guineen, bon dossier academique, projet d'etudes en France",
        "amount": "615 EUR / mois + exoneration frais",
        "deadline": datetime(2025, 3, 31, tzinfo=timezone.utc),
        "apply_link": "https://www.guinee.campusfrance.org/",
        "contact_info": "Espace Campus France Conakry, Kaloum",
        "domain": "Tous domaines",
        "location": "France",
    },
    {
        "title": "Bourse de la BAD (Banque Africaine de Developpement)",
        "type": "internationale",
        "organization": "Banque Africaine de Developpement",
        "description": "Programme de bourses Japan Africa Dream pour des etudes de master dans des universites japonaises partenaires. Domaines prioritaires : energie, agriculture, sante.",
        "eligibility": "Ressortissant d'un pays membre de la BAD, moins de 35 ans, licence obtenue",
        "amount": "Bourse complete (Japon)",
        "deadline": datetime(2025, 4, 30, tzinfo=timezone.utc),
        "apply_link": "https://www.afdb.org/fr",
        "contact_info": "Bureau BAD Conakry",
        "domain": "Energie, Agriculture, Sante, Ingenierie",
        "location": "Japon",
    },
    {
        "title": "Bourse de l'Union Africaine",
        "type": "internationale",
        "organization": "Union Africaine",
        "description": "Programme Mwalimu Nyerere de bourses de l'Union Africaine pour les etudes de master et doctorat dans des universites africaines.",
        "eligibility": "Citoyen d'un Etat membre de l'UA, moins de 35 ans (master) ou 40 ans (doctorat)",
        "amount": "Bourse complete intra-Afrique",
        "deadline": datetime(2025, 6, 30, tzinfo=timezone.utc),
        "apply_link": "https://au.int/fr",
        "contact_info": "Commission de l'Union Africaine, Addis-Abeba",
        "domain": "Sciences, Technologies, Ingenierie, Sante",
        "location": "Afrique",
    },
    {
        "title": "Bourse DAAD (Allemagne)",
        "type": "internationale",
        "organization": "DAAD - Office allemand d'echanges universitaires",
        "description": "Bourses pour des etudes de master ou doctorat en Allemagne. Programmes en anglais ou allemand disponibles.",
        "eligibility": "Licence obtenue, moins de 6 ans d'experience professionnelle, bonne maitrise de l'anglais ou allemand",
        "amount": "934 EUR / mois (master), 1 300 EUR / mois (doctorat)",
        "deadline": datetime(2025, 10, 15, tzinfo=timezone.utc),
        "apply_link": "https://www.daad.de/en/",
        "contact_info": "DAAD Bureau Regional Afrique de l'Ouest, Accra",
        "domain": "Tous domaines",
        "location": "Allemagne",
    },
    {
        "title": "Bourse Chevening (Royaume-Uni)",
        "type": "internationale",
        "organization": "Foreign, Commonwealth & Development Office (UK)",
        "description": "Bourse prestigieuse du gouvernement britannique pour un master d'un an au Royaume-Uni. Couvre tous les frais.",
        "eligibility": "Citoyen guineen, 2 ans d'experience professionnelle minimum, retour en Guinee apres les etudes",
        "amount": "Bourse complete (scolarite + vie + voyages)",
        "deadline": datetime(2025, 11, 5, tzinfo=timezone.utc),
        "apply_link": "https://www.chevening.org/",
        "contact_info": "Ambassade du Royaume-Uni, Conakry",
        "domain": "Tous domaines",
        "location": "Royaume-Uni",
    },
    {
        "title": "Bourse Turkiye Burslari (Turquie)",
        "type": "internationale",
        "organization": "Presidence de la Republique de Turquie - YTB",
        "description": "Programme de bourses du gouvernement turc couvrant licence, master et doctorat. Inclut cours de turc gratuit d'un an.",
        "eligibility": "Etudiants internationaux, bon dossier academique",
        "amount": "Bourse complete + 1 000-3 000 TRY / mois",
        "deadline": datetime(2025, 2, 20, tzinfo=timezone.utc),
        "apply_link": "https://turkiyeburslari.gov.tr/",
        "contact_info": "Ambassade de Turquie, Conakry",
        "domain": "Tous domaines",
        "location": "Turquie",
    },
    {
        "title": "Bourse OIF (Organisation Internationale de la Francophonie)",
        "type": "internationale",
        "organization": "Agence Universitaire de la Francophonie (AUF)",
        "description": "Bourses de mobilite pour des etudes de master dans une universite francophone partenaire de l'AUF.",
        "eligibility": "Etudiant d'un pays membre de la Francophonie, inscrit en master",
        "amount": "Allocation mensuelle + frais de voyage",
        "deadline": datetime(2025, 5, 31, tzinfo=timezone.utc),
        "apply_link": "https://www.auf.org/",
        "contact_info": "Campus Numerique Francophone de Conakry",
        "domain": "Tous domaines francophones",
        "location": "Pays francophones",
    },
    {
        "title": "Concours d'entree ENA Guinee",
        "type": "nationale",
        "organization": "Ecole Nationale d'Administration (ENA) de Guinee",
        "description": "Concours annuel d'entree a l'ENA pour la formation des cadres de l'administration publique guineenne.",
        "eligibility": "Nationalite guineenne, licence minimum, moins de 35 ans",
        "amount": "Formation gratuite + allocation",
        "deadline": datetime(2025, 8, 31, tzinfo=timezone.utc),
        "apply_link": None,
        "contact_info": "ENA Guinee, Conakry",
        "domain": "Administration publique, Droit, Economie",
        "location": "Guinee",
    },
    {
        "title": "Concours Ecoles d'Ingenieurs (Senegal, Maroc, Tunisie)",
        "type": "regionale",
        "organization": "Ecoles d'ingenieurs partenaires",
        "description": "Concours communs d'entree dans les ecoles d'ingenieurs d'Afrique de l'Ouest et du Maghreb : ESP Dakar, ENSEM Casablanca, ENIT Tunis, etc.",
        "eligibility": "Bac scientifique ou technique, age limite selon les ecoles",
        "amount": "Variable selon bourses associees",
        "deadline": datetime(2025, 7, 15, tzinfo=timezone.utc),
        "apply_link": None,
        "contact_info": "Direction Nationale des Bourses, Conakry",
        "domain": "Ingenierie, Sciences, Technologies",
        "location": "Senegal, Maroc, Tunisie",
    },
]

CALENDAR_EVENTS = [
    # Rentree et examens
    {
        "title": "Rentree universitaire 2024-2025",
        "description": "Debut officiel de l'annee academique dans les universites publiques de Guinee.",
        "type": "academique",
        "start_date": datetime(2024, 10, 15, 8, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": "Universites de Guinee",
        "university": "Toutes",
        "is_recurrent": True,
        "color": "#2563eb",
    },
    {
        "title": "Examens du premier semestre",
        "description": "Periode d'examens de fin du premier semestre.",
        "type": "academique",
        "start_date": datetime(2025, 2, 17, 8, 0, tzinfo=timezone.utc),
        "end_date": datetime(2025, 3, 7, 17, 0, tzinfo=timezone.utc),
        "location": "Universites de Guinee",
        "university": "Toutes",
        "is_recurrent": True,
        "color": "#dc2626",
    },
    {
        "title": "Examens du second semestre",
        "description": "Periode d'examens de fin du second semestre.",
        "type": "academique",
        "start_date": datetime(2025, 6, 16, 8, 0, tzinfo=timezone.utc),
        "end_date": datetime(2025, 7, 4, 17, 0, tzinfo=timezone.utc),
        "location": "Universites de Guinee",
        "university": "Toutes",
        "is_recurrent": True,
        "color": "#dc2626",
    },
    {
        "title": "Session de rattrapage",
        "description": "Examens de rattrapage pour les etudiants ajournes.",
        "type": "academique",
        "start_date": datetime(2025, 9, 1, 8, 0, tzinfo=timezone.utc),
        "end_date": datetime(2025, 9, 15, 17, 0, tzinfo=timezone.utc),
        "location": "Universites de Guinee",
        "university": "Toutes",
        "is_recurrent": True,
        "color": "#f59e0b",
    },
    # Vacances
    {
        "title": "Vacances de fin d'annee",
        "description": "Pause academique de fin d'annee.",
        "type": "vacances",
        "start_date": datetime(2024, 12, 20, 0, 0, tzinfo=timezone.utc),
        "end_date": datetime(2025, 1, 6, 0, 0, tzinfo=timezone.utc),
        "location": None,
        "university": "Toutes",
        "is_recurrent": True,
        "color": "#16a34a",
    },
    {
        "title": "Vacances de Paques",
        "description": "Conge de Paques.",
        "type": "vacances",
        "start_date": datetime(2025, 4, 18, 0, 0, tzinfo=timezone.utc),
        "end_date": datetime(2025, 4, 28, 0, 0, tzinfo=timezone.utc),
        "location": None,
        "university": "Toutes",
        "is_recurrent": False,
        "color": "#16a34a",
    },
    {
        "title": "Grandes vacances",
        "description": "Vacances d'ete entre les deux annees academiques.",
        "type": "vacances",
        "start_date": datetime(2025, 7, 15, 0, 0, tzinfo=timezone.utc),
        "end_date": datetime(2025, 10, 14, 0, 0, tzinfo=timezone.utc),
        "location": None,
        "university": "Toutes",
        "is_recurrent": True,
        "color": "#16a34a",
    },
    # Jours feries guineens
    {
        "title": "Jour de l'An",
        "description": "Fete du Nouvel An.",
        "type": "ferie",
        "start_date": datetime(2025, 1, 1, 0, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": None,
        "university": None,
        "is_recurrent": True,
        "color": "#9333ea",
    },
    {
        "title": "Journee Internationale de la Femme",
        "description": "Celebration de la Journee internationale des droits des femmes. Jour ferie en Guinee.",
        "type": "ferie",
        "start_date": datetime(2025, 3, 8, 0, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": None,
        "university": None,
        "is_recurrent": True,
        "color": "#9333ea",
    },
    {
        "title": "Fete du Travail",
        "description": "Journee internationale des travailleurs.",
        "type": "ferie",
        "start_date": datetime(2025, 5, 1, 0, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": None,
        "university": None,
        "is_recurrent": True,
        "color": "#9333ea",
    },
    {
        "title": "Journee de l'OUA / Union Africaine",
        "description": "Celebration de la creation de l'Organisation de l'Unite Africaine.",
        "type": "ferie",
        "start_date": datetime(2025, 5, 25, 0, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": None,
        "university": None,
        "is_recurrent": True,
        "color": "#9333ea",
    },
    {
        "title": "Fete de l'Independance de la Guinee",
        "description": "Celebration de l'independance de la Republique de Guinee, le 2 octobre 1958.",
        "type": "ferie",
        "start_date": datetime(2025, 10, 2, 0, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": None,
        "university": None,
        "is_recurrent": True,
        "color": "#9333ea",
    },
    {
        "title": "Noel",
        "description": "Fete de Noel.",
        "type": "ferie",
        "start_date": datetime(2025, 12, 25, 0, 0, tzinfo=timezone.utc),
        "end_date": None,
        "location": None,
        "university": None,
        "is_recurrent": True,
        "color": "#9333ea",
    },
]

STAGE_OFFERS = [
    {
        "title": "Stage Developpeur Mobile - Orange Guinee",
        "company": "Orange Guinee",
        "location": "Conakry, Kaloum",
        "type": "stage",
        "domain": "Informatique / Telecom",
        "description": "Stage de 6 mois au sein de l'equipe digitale d'Orange Guinee. Developpement d'applications mobiles (Android/iOS) pour les services Orange Money et les offres client.",
        "requirements": "Licence ou Master en Informatique, maitrise de Java/Kotlin ou Swift, connaissance des APIs REST",
        "duration": "6 mois",
        "remuneration": "1 500 000 GNF / mois",
        "contact_email": "stages@orange-guinee.com",
        "contact_phone": None,
        "external_link": None,
    },
    {
        "title": "Stage Assistant Marketing Digital - MTN Guinee",
        "company": "MTN Guinee",
        "location": "Conakry, Ratoma",
        "type": "stage",
        "domain": "Marketing / Communication",
        "description": "Stage en marketing digital : gestion des reseaux sociaux, creation de contenu, analyse des campagnes publicitaires et support a l'equipe communication.",
        "requirements": "Etudiant en Marketing, Communication ou equivalent, maitrise des reseaux sociaux et outils d'analyse",
        "duration": "4 mois",
        "remuneration": "1 000 000 GNF / mois",
        "contact_email": "recrutement@mtn-guinee.com",
        "contact_phone": None,
        "external_link": None,
    },
    {
        "title": "Stage Analyste Financier - BCRG",
        "company": "Banque Centrale de la Republique de Guinee (BCRG)",
        "location": "Conakry, Kaloum",
        "type": "stage",
        "domain": "Finance / Economie",
        "description": "Stage au sein de la Direction des Etudes Economiques. Participation aux analyses macroeconomiques, redaction de notes de conjoncture et suivi des indicateurs monetaires.",
        "requirements": "Master en Economie, Finance ou Statistiques, maitrise d'Excel avance et logiciels statistiques (STATA, R)",
        "duration": "6 mois",
        "remuneration": "2 000 000 GNF / mois",
        "contact_email": "stages@bcrg.gov.gn",
        "contact_phone": None,
        "external_link": None,
    },
    {
        "title": "Stage Assistant Juridique - Societe Generale Guinee",
        "company": "Societe Generale Guinee",
        "location": "Conakry, Kaloum",
        "type": "stage",
        "domain": "Droit / Banque",
        "description": "Stage au service juridique : revue de contrats, conformite reglementaire, veille juridique bancaire et accompagnement des operations de credit.",
        "requirements": "Etudiant en Droit des Affaires ou Droit Bancaire (Master 1 minimum), rigueur et sens de la confidentialite",
        "duration": "3 mois",
        "remuneration": "1 200 000 GNF / mois",
        "contact_email": "rh@socgen-guinee.com",
        "contact_phone": None,
        "external_link": None,
    },
    {
        "title": "Stage Ingenieur HSE - TotalEnergies Guinee",
        "company": "TotalEnergies Guinee",
        "location": "Conakry, Matoto",
        "type": "stage",
        "domain": "Ingenierie / Environnement",
        "description": "Stage au departement Hygiene, Securite et Environnement. Suivi des normes HSE sur les sites de distribution, audits terrain et sensibilisation du personnel.",
        "requirements": "Etudiant en Ingenierie, Environnement ou HSE (Bac+3 minimum), connaissance des normes ISO 14001 appreciee",
        "duration": "6 mois",
        "remuneration": "1 800 000 GNF / mois",
        "contact_email": "stages.guinee@totalenergies.com",
        "contact_phone": None,
        "external_link": None,
    },
]


# ──────────────────────────────────────────────
# Fonctions de seed
# ──────────────────────────────────────────────

async def seed_admin(session):
    result = await session.execute(select(User).where(User.email == ADMIN["email"]))
    if result.scalar_one_or_none():
        print(f"  [skip] Admin {ADMIN['email']} existe deja")
        return
    user = User(
        email=ADMIN["email"],
        name=ADMIN["name"],
        password=hash_password(ADMIN["password"]),
        role=ADMIN["role"],
    )
    session.add(user)
    print(f"  [+] Admin cree : {ADMIN['email']}")


async def seed_scholarships(session):
    for data in SCHOLARSHIPS:
        result = await session.execute(
            select(Scholarship).where(Scholarship.title == data["title"])
        )
        if result.scalar_one_or_none():
            print(f"  [skip] Bourse : {data['title']}")
            continue
        session.add(Scholarship(**data))
        print(f"  [+] Bourse : {data['title']}")


async def seed_calendar(session):
    for data in CALENDAR_EVENTS:
        result = await session.execute(
            select(CalendarEvent).where(CalendarEvent.title == data["title"])
        )
        if result.scalar_one_or_none():
            print(f"  [skip] Evenement : {data['title']}")
            continue
        session.add(CalendarEvent(**data))
        print(f"  [+] Evenement : {data['title']}")


async def seed_stages(session):
    for data in STAGE_OFFERS:
        result = await session.execute(
            select(StageOffer).where(StageOffer.title == data["title"])
        )
        if result.scalar_one_or_none():
            print(f"  [skip] Stage : {data['title']}")
            continue
        session.add(StageOffer(**data))
        print(f"  [+] Stage : {data['title']}")


async def main():
    print("=== Seed O'Kampus DB ===\n")

    async with AsyncSessionLocal() as session:
        print("[Admin]")
        await seed_admin(session)

        print("\n[Bourses]")
        await seed_scholarships(session)

        print("\n[Calendrier]")
        await seed_calendar(session)

        print("\n[Stages]")
        await seed_stages(session)

        await session.commit()

    print("\n=== Seed termine ! ===")


if __name__ == "__main__":
    asyncio.run(main())
