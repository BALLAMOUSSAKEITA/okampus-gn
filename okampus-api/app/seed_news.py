from sqlalchemy import func, select

from app.database import AsyncSessionLocal
from app.models import PlatformNews

UNG_ARTICLE_CONTENT = """Par décret rendu public à la RTG, la République de Guinée s'est dotée de l'Université Numérique de Guinée (UNG), née de la transformation de l'Institut Supérieur de Formation à Distance (ISFAD).

Cette réforme s'inscrit dans la modernisation de l'enseignement supérieur guinéen. L'UNG a pour mission d'élargir l'accès à des formations de qualité, de développer l'enseignement à distance, de renforcer la formation continue et de promouvoir l'innovation pédagogique par le numérique.

Pour les bacheliers et étudiants, c'est une nouvelle option à considérer si tu cherches un parcours flexible, des formations à distance ou une montée en compétences numériques. Les modalités d'inscription et les filières proposées seront à suivre dans les prochaines annonces officielles."""

DEFAULT_NEWS = {
    "title": "Guinée : lancement de l'Université Numérique (UNG)",
    "summary": (
        "L'Université Numérique de Guinée (UNG) succède à l'ISFAD "
        "(Institut Supérieur de Formation à Distance). Cette réforme vise à "
        "élargir l'accès aux études supérieures, développer l'enseignement à "
        "distance, la formation continue et l'innovation pédagogique par le "
        "numérique. Une piste à suivre si tu envisages un parcours flexible "
        "ou des formations en ligne après le bac."
    ),
    "content": UNG_ARTICLE_CONTENT,
    "category": "Actualité",
    "link": "/universites",
    "is_active": True,
}


async def seed_default_news() -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(func.count()).select_from(PlatformNews))
        if (result.scalar() or 0) > 0:
            return

        db.add(PlatformNews(**DEFAULT_NEWS))
        await db.commit()
        print("[SEED] Actualité par défaut UNG insérée")
