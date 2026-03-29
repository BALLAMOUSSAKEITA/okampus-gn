"""
Script CLI pour créer un compte administrateur.

Usage:
    python create_admin.py --name "Admin" --email admin@okampus.com --password secret123
"""

import argparse
import asyncio

from sqlalchemy import select

from app.auth import hash_password
from app.database import engine, AsyncSessionLocal, Base
from app.models import User


async def create_admin(name: str, email: str, password: str) -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none():
            print(f"ERREUR: Un utilisateur avec l'email {email} existe déjà.")
            return

        user = User(
            name=name,
            email=email,
            password=hash_password(password),
            role="admin",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        print(f"Admin créé avec succès : {user.name} ({user.email}) — id: {user.id}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Créer un compte administrateur Okampus")
    parser.add_argument("--name", required=True, help="Nom de l'administrateur")
    parser.add_argument("--email", required=True, help="Email de l'administrateur")
    parser.add_argument("--password", required=True, help="Mot de passe")
    args = parser.parse_args()

    asyncio.run(create_admin(args.name, args.email, args.password))
