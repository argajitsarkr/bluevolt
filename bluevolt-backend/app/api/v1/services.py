from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.database import get_db
from app.models.service import Service
from app.schemas.common import ServiceOut

router = APIRouter()


@router.get("", response_model=list[ServiceOut])
async def list_services(
    db: AsyncSession = Depends(get_db),
    category_id: int | None = Query(None),
    search: str | None = Query(None),
    limit: int = Query(60, le=200),
    offset: int = 0,
):
    q = select(Service)
    if category_id:
        q = q.where(Service.category_id == category_id)
    if search:
        pat = f"%{search}%"
        q = q.where(or_(Service.name.ilike(pat), Service.description.ilike(pat)))
    q = q.order_by(Service.created_at.desc()).limit(limit).offset(offset)
    rows = (await db.execute(q)).scalars().all()
    return [ServiceOut.model_validate(r) for r in rows]


@router.get("/{slug}", response_model=ServiceOut)
async def get_service(slug: str, db: AsyncSession = Depends(get_db)):
    row = (await db.execute(select(Service).where(Service.slug == slug))).scalar_one_or_none()
    if not row:
        raise HTTPException(404, "Not found")
    return ServiceOut.model_validate(row)
