from slugify import slugify as _s
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


async def unique_slug(db: AsyncSession, model, name: str, exclude_id: int | None = None) -> str:
    base = _s(name) or "item"
    slug = base
    n = 2
    while True:
        q = select(model).where(model.slug == slug)
        if exclude_id is not None:
            q = q.where(model.id != exclude_id)
        existing = (await db.execute(q)).scalar_one_or_none()
        if not existing:
            return slug
        slug = f"{base}-{n}"
        n += 1
