from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.auth import require_admin
from app.models.category import Category
from app.schemas.common import CategoryIn, CategoryOut
from app.utils.slug import unique_slug

router = APIRouter()


@router.get("", response_model=list[CategoryOut])
async def list_categories(kind: str | None = Query(None), db: AsyncSession = Depends(get_db)):
    q = select(Category)
    if kind:
        q = q.where(Category.kind == kind)
    rows = (await db.execute(q.order_by(Category.name))).scalars().all()
    return [CategoryOut.model_validate(r) for r in rows]


@router.post("", response_model=CategoryOut, dependencies=[Depends(require_admin)])
async def create_category(data: CategoryIn, db: AsyncSession = Depends(get_db)):
    if data.kind not in ("product", "service"):
        raise HTTPException(400, "kind must be 'product' or 'service'")
    cat = Category(name=data.name, kind=data.kind, slug=await unique_slug(db, Category, data.name))
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return CategoryOut.model_validate(cat)
