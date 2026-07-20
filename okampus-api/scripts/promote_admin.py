"""Promouvoir un utilisateur en admin par email.

Usage:
  cd okampus-api
  .\\venv\\Scripts\\python.exe scripts/promote_admin.py ballamou38@gmail.com
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import User


async def promote(email: str) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            print(f"Utilisateur introuvable: {email}")
            sys.exit(1)
        user.role = "admin"
        await db.commit()
        print(f"OK — {user.name} ({user.email}) est maintenant admin")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/promote_admin.py <email>")
        sys.exit(1)
    asyncio.run(promote(sys.argv[1].strip().lower()))
