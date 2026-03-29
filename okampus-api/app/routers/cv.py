from fastapi import APIRouter, HTTPException, Request
from openai import AsyncOpenAI
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import settings
from app.schemas import GenerateCvRequest

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/cv", tags=["cv"])


def _build_prompt(body: GenerateCvRequest) -> str:
    cv = body.cv_profile
    safe = lambda v: v.strip() if v and str(v).strip() else "—"

    skills = "\n".join(f"- {s}" for s in cv.get("skills", [])) or "—"
    languages = "\n".join(f"- {l}" for l in cv.get("languages", [])) or "—"

    education_lines = []
    for e in cv.get("education", []):
        line = f"- {e.get('degree')} — {e.get('school')} ({safe(e.get('startYear'))} - {safe(e.get('endYear'))})"
        if e.get("details"):
            line += f"\n  - {e['details']}"
        education_lines.append(line)

    exp_lines = []
    for x in cv.get("experiences", []):
        end = x.get("end", "").strip() or "Présent"
        line = f"- {x.get('title')} — {x.get('company')} ({safe(x.get('start'))} - {end})"
        bullets = "\n".join(f"  - {b}" for b in x.get("bullets", []) if b)
        if bullets:
            line += f"\n{bullets}"
        exp_lines.append(line)

    project_lines = []
    for p in cv.get("projects", []):
        line = f"- {p.get('name')}"
        if p.get("link"):
            line += f" ({p['link']})"
        if p.get("description"):
            line += f"\n  - {p['description']}"
        bullets = "\n".join(f"  - {b}" for b in p.get("bullets", []) if b)
        if bullets:
            line += f"\n{bullets}"
        project_lines.append(line)

    return f"""
Tu es un expert RH. Génère un CV **professionnel en français**, adapté au contexte guinéen.
Format de sortie: **Markdown** uniquement (pas de JSON).
Contraintes:
- 1 page idéalement (donc concis)
- Verbes d'action, résultats mesurables si possible
- Pas d'informations inventées (si donnée absente, ne pas l'ajouter)
- Ne pas inclure de photo

## Identité
- Nom: {safe(body.name)}
- Email: {safe(body.email)}
- Téléphone: {safe(cv.get('phone'))}
- Localisation: {safe(cv.get('location'))}
- Titre/Headline: {safe(cv.get('headline'))}
- Statut: {safe(body.role_label)}

## À propos
{safe(cv.get('about'))}

## Compétences
{skills}

## Langues
{languages}

## Formation
{chr(10).join(education_lines) or "—"}

## Expériences
{chr(10).join(exp_lines) or "—"}

## Projets
{chr(10).join(project_lines) or "—"}
"""


@router.post("")
@limiter.limit("10/hour")
async def generate_cv(request: Request, body: GenerateCvRequest):
    if not settings.openai_api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY manquant")

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    completion = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": "Tu es un assistant RH. Tu produis des CV clairs, modernes, et honnêtes. Tu n'inventes rien."},
            {"role": "user", "content": _build_prompt(body)},
        ],
        temperature=0.4,
    )

    content = completion.choices[0].message.content or ""
    if not content.strip():
        raise HTTPException(status_code=502, detail="Réponse vide du modèle")

    return {"markdown": content.strip()}
