from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.database import get_db
from app.models.product import Product
from app.schemas.common import ProductOut

router = APIRouter()


@router.get("", response_model=list[ProductOut])
async def list_products(
    db: AsyncSession = Depends(get_db),
    category_id: int | None = Query(None),
    search: str | None = Query(None),
    in_stock: bool | None = Query(None),
    limit: int = Query(60, le=200),
    offset: int = 0,
):
    q = select(Product)
    if category_id:
        q = q.where(Product.category_id == category_id)
    if in_stock is not None:
        q = q.where(Product.in_stock == in_stock)
    if search:
        pat = f"%{search}%"
        q = q.where(or_(Product.name.ilike(pat), Product.brand.ilike(pat), Product.sku.ilike(pat)))
    q = q.order_by(Product.created_at.desc()).limit(limit).offset(offset)
    rows = (await db.execute(q)).scalars().all()
    return [ProductOut.model_validate(r) for r in rows]


@router.get("/{slug}", response_model=ProductOut)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    row = (await db.execute(select(Product).where(Product.slug == slug))).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Not found")
    return ProductOut.model_validate(row)
