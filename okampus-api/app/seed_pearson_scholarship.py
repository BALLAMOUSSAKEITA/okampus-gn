from datetime import datetime, timezone

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import PlatformNews, Scholarship

PEARSON_TITLE = "Bourse Lester B. Pearson 2027 — Université de Toronto"

PEARSON_DESCRIPTION = (
    "Programme phare de l'Université de Toronto pour les étudiants internationaux d'excellence. "
    "Financement sur 4 ans : scolarité, livres, frais annexes et hébergement en résidence."
)

PEARSON_CONTENT = """La bourse internationale Lester B. Pearson rend hommage à l'ancien Premier ministre canadien et lauréat du prix Nobel de la paix. Chaque année, l'Université de Toronto accueille une trentaine d'étudiants internationaux aux parcours remarquables pour un cursus de licence entièrement pris en charge.

Le programme recherche des profils alliant excellence académique, créativité et leadership au service de la communauté. Les lauréats rejoignent une promotion internationale et bénéficient d'un accompagnement dédié via le Pearson Program Office, rattaché au Centre for International Experience.

Prise en charge sur 4 ans : frais de scolarité, manuels, frais accessoires et hébergement en résidence. La bourse s'applique uniquement aux programmes de premier cycle (licence) avec admission directe à l'Université de Toronto. Vous pouvez indiquer jusqu'à trois domaines sur votre demande d'admission, mais la bourse, si accordée, sera rattachée à votre premier choix.

Calendrier 2026-2027 :
• 6 juillet 2026 — ouverture des nominations pour les lycées déjà participants
• 9 octobre 2026 — date limite de nomination par l'établissement secondaire
• 16 octobre 2026 — date limite de candidature à l'Université de Toronto
• 6 novembre 2026 — date limite du dossier de bourse Pearson (lien privé)
• Fin janvier – avril 2027 — notification des décisions (selon le calendrier habituel)
• Septembre 2027 — rentrée universitaire

Procédure en 3 étapes :
1. Nomination par le lycée — un seul élève par établissement et par an. Les lycées non encore inscrits peuvent demander à participer avant midi (heure de l'Est) le 9 octobre 2026 via https://apply.adm.utoronto.ca/register/pearson-participate
2. Candidature à l'admission U of T — pour une rentrée en septembre 2027, au plus tard le 16 octobre 2026.
3. Dossier de bourse Pearson — formulaire transmis par lien privé après nomination, à compléter avant le 6 novembre 2026.

Points importants :
• Tu ne peux pas postuler seul : seule une nomination officielle de ton lycée ouvre la voie.
• L'usage d'outils d'intelligence artificielle générative (ChatGPT, etc.) dans le dossier entraîne une disqualification.
• Aucun frais ne doit être versé à un intermédiaire non affilié à l'université."""

PEARSON_ELIGIBILITY = """• Étudiant international nécessitant un permis d'études
• Dernière année de lycée en 2026-2027, ou diplôme obtenu au plus tôt en juin 2026
• Rentrée à l'Université de Toronto en septembre 2027
• Nomination obligatoire par l'établissement secondaire actuel
• Non éligible : étudiants déjà inscrits dans l'enseignement supérieur, ou rentrée en janvier 2027"""

PEARSON_NEWS_SUMMARY = (
    "Environ 37 bourses intégrales pour étudiants internationaux entrant en licence "
    "à l'Université de Toronto en septembre 2027. Nomination par le lycée avant "
    "le 9 octobre 2026 — candidature individuelle impossible sans nomination officielle."
)

PEARSON_NEWS_CONTENT = """L'Université de Toronto ouvre le cycle 2027-2028 de la bourse internationale Lester B. Pearson, l'une des distinctions les plus prestigieuses du Canada pour les étudiants internationaux.

Chaque année, une trentaine de lauréats issus du monde entier bénéficient d'un financement complet sur quatre ans : scolarité, livres, frais accessoires et hébergement en résidence. Le programme vise des jeunes qui excellent académiquement, font preuve de créativité et montrent un potentiel de leadership.

Attention : seuls les élèves nominés par leur lycée peuvent candidater. Si ton établissement participe déjà, il recevra le formulaire de nomination à partir du 6 juillet 2026. Sinon, l'administration peut demander à rejoindre le programme avant le 9 octobre 2026.

Consulte la fiche complète sur BacheliO pour le calendrier détaillé, les critères d'éligibilité et les liens officiels."""


async def seed_pearson_scholarship() -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Scholarship).where(Scholarship.title == PEARSON_TITLE)
        )
        existing = result.scalar_one_or_none()

        if existing is None:
            scholarship = Scholarship(
                title=PEARSON_TITLE,
                type="Bourse",
                organization="Université de Toronto",
                description=PEARSON_DESCRIPTION,
                content=PEARSON_CONTENT,
                eligibility=PEARSON_ELIGIBILITY,
                amount="Bourse intégrale sur 4 ans (scolarité, livres, frais, résidence)",
                deadline=datetime(2026, 10, 9, 23, 59, tzinfo=timezone.utc),
                apply_link="https://future.utoronto.ca/pearson/about",
                contact_info="pearson.scholarship@utoronto.ca",
                domain="Licence (premier cycle)",
                location="Canada",
                is_active=True,
            )
            db.add(scholarship)
            await db.flush()
            scholarship_id = scholarship.id
            print("[SEED] Bourse Pearson 2027 insérée")
        else:
            scholarship_id = existing.id
            print("[SEED] Bourse Pearson 2027 déjà présente")

        news_result = await db.execute(
            select(PlatformNews).where(PlatformNews.title == PEARSON_TITLE)
        )
        if news_result.scalar_one_or_none() is None:
            db.add(
                PlatformNews(
                    title=PEARSON_TITLE,
                    summary=PEARSON_NEWS_SUMMARY,
                    content=PEARSON_NEWS_CONTENT,
                    link=f"/bourses/{scholarship_id}",
                    category="Bourse",
                    is_active=True,
                )
            )
            print("[SEED] Actualité Pearson 2027 insérée")

        await db.commit()
