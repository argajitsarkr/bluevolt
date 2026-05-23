from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.config import settings
from app.models.user import User
from app.schemas.common import RegisterIn, LoginIn, TokenOut, UserOut
from app.auth import hash_password, verify_password, create_token

router = APIRouter()


def _is_seed_admin(email: str) -> bool:
    return email.lower() in settings.admin_emails_set


@router.post("/register", response_model=TokenOut)
async def register(data: RegisterIn, db: AsyncSession = Depends(get_db)):
    email = data.email.lower()
    existing = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Email already registered")
    user = User(
        email=email,
        password_hash=hash_password(data.password),
        full_name=data.full_name or "",
        phone=data.phone or "",
        is_admin=_is_seed_admin(email),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return TokenOut(access_token=create_token(user.id, user.email), user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
async def login(data: LoginIn, db: AsyncSession = Depends(get_db)):
    email = data.email.lower()
    user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    # Self-heal admin flag when ADMIN_EMAILS is updated
    if _is_seed_admin(email) and not user.is_admin:
        user.is_admin = True
        await db.commit()
        await db.refresh(user)
    return TokenOut(access_token=create_token(user.id, user.email), user=UserOut.model_validate(user))
