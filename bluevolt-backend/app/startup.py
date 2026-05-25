"""Seed admin accounts on first boot.

Creates one user row per email in ADMIN_EMAILS using DEFAULT_ADMIN_PASSWORD
(default: "BlueVolt@2026") if that email does not already exist. Idempotent -
safe to run on every container boot.
"""
import os
import logging
from sqlalchemy import select

from app.database import SessionLocal
from app.config import settings
from app.models.user import User
from app.auth import hash_password

DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "BlueVolt@2026")
log = logging.getLogger("bluevolt.startup")


async def seed_admins() -> None:
    emails = settings.admin_emails_set
    if not emails:
        return
    async with SessionLocal() as db:
        for email in emails:
            existing = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
            if existing:
                # Ensure admin flag if ADMIN_EMAILS was updated later
                if not existing.is_admin:
                    existing.is_admin = True
                    await db.commit()
                continue
            db.add(
                User(
                    email=email,
                    password_hash=hash_password(DEFAULT_ADMIN_PASSWORD),
                    full_name="Admin",
                    phone="",
                    is_admin=True,
                )
            )
            await db.commit()
            log.warning(
                "Seeded admin user %s with default password %r - change it from the profile screen after first login.",
                email,
                DEFAULT_ADMIN_PASSWORD,
            )
