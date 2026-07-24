"""Nettoyage complet de la base : supprime tout le contenu et les utilisateurs sauf l'admin principal.

Usage:
  cd okampus-api
  .\\venv\\Scripts\\python.exe scripts/cleanup_db.py
  .\\venv\\Scripts\\python.exe scripts/cleanup_db.py --dry-run
  .\\venv\\Scripts\\python.exe scripts/cleanup_db.py --keep-email ballamou38@gmail.com
"""
import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import delete, func, select

from app.database import AsyncSessionLocal
from app.models import (
    Appointment,
    CalendarEvent,
    EntrepreneurProject,
    ForumPost,
    Resource,
    ResourcePurchase,
    Scholarship,
    StageApplication,
    StageOffer,
    SuccessStory,
    User,
)


async def cleanup(dry_run: bool = False, keep_email: str = "ballamou38@gmail.com") -> None:
    keep_email = keep_email.strip().lower()
    async with AsyncSessionLocal() as db:
        admin_result = await db.execute(select(User).where(User.email == keep_email))
        admin = admin_result.scalar_one_or_none()
        if not admin:
            print(f"ERREUR — Utilisateur introuvable: {keep_email}")
            sys.exit(1)
        if admin.role != "admin":
            print(f"ATTENTION — {keep_email} n'est pas admin (role={admin.role}). Promotion recommandee.")

        counts = {
            "forum_posts": await db.scalar(select(func.count()).select_from(ForumPost)) or 0,
            "success_stories": await db.scalar(select(func.count()).select_from(SuccessStory)) or 0,
            "stage_offers": await db.scalar(select(func.count()).select_from(StageOffer)) or 0,
            "stage_applications": await db.scalar(select(func.count()).select_from(StageApplication)) or 0,
            "scholarships": await db.scalar(select(func.count()).select_from(Scholarship)) or 0,
            "resources": await db.scalar(select(func.count()).select_from(Resource)) or 0,
            "resource_purchases": await db.scalar(select(func.count()).select_from(ResourcePurchase)) or 0,
            "calendar_events": await db.scalar(select(func.count()).select_from(CalendarEvent)) or 0,
            "entrepreneur_projects": await db.scalar(select(func.count()).select_from(EntrepreneurProject)) or 0,
            "appointments": await db.scalar(select(func.count()).select_from(Appointment)) or 0,
        }
        users_total = await db.scalar(select(func.count()).select_from(User)) or 0
        users_to_delete = users_total - 1

        print("=== Nettoyage O'Kampus ===")
        print(f"Admin conserve: {admin.email} ({admin.name})")
        print(f"Utilisateurs a supprimer: {users_to_delete}")
        for key, value in counts.items():
            print(f"  {key}: {value}")

        if dry_run:
            print("\nMode dry-run — aucune modification.")
            return

        await db.execute(delete(StageApplication))
        await db.execute(delete(ResourcePurchase))
        await db.execute(delete(Appointment))
        await db.execute(delete(ForumPost))
        await db.execute(delete(SuccessStory))
        await db.execute(delete(StageOffer))
        await db.execute(delete(Scholarship))
        await db.execute(delete(Resource))
        await db.execute(delete(CalendarEvent))
        await db.execute(delete(EntrepreneurProject))

        await db.execute(delete(User).where(User.email != keep_email))
        await db.commit()
        print("\nOK — Base nettoyee.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nettoyer la base O'Kampus")
    parser.add_argument("--dry-run", action="store_true", help="Afficher sans modifier")
    parser.add_argument("--keep-email", default="ballamou38@gmail.com", help="Email admin a conserver")
    args = parser.parse_args()
    asyncio.run(cleanup(dry_run=args.dry_run, keep_email=args.keep_email))
