from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.auth import require_admin
from app.models.user import User
from app.models.order import Order
from app.models.product import Product
from app.models.service import Service
from app.schemas.common import (
    ProductIn, ProductOut, ServiceIn, ServiceOut,
    OrderAdminOut, OrderStatusUpdate,
)
from app.utils.slug import unique_slug

router = APIRouter(dependencies=[Depends(require_admin)])


# --- stats ---
@router.get("/stats")
async def stats(db: AsyncSession = Depends(get_db)):
    total_orders = (await db.execute(select(func.count(Order.id)))).scalar_one()
    pending_orders = (await db.execute(select(func.count(Order.id)).where(Order.status == "pending"))).scalar_one()
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_products = (await db.execute(select(func.count(Product.id)))).scalar_one()
    total_services = (await db.execute(select(func.count(Service.id)))).scalar_one()
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_users": total_users,
        "total_products": total_products,
        "total_services": total_services,
    }


# --- orders ---
@router.get("/orders", response_model=list[OrderAdminOut])
async def admin_orders(
    db: AsyncSession = Depends(get_db),
    status: str | None = Query(None),
    limit: int = Query(100, le=500),
):
    q = select(Order).order_by(Order.created_at.desc()).limit(limit)
    if status:
        q = q.where(Order.status == status)
    rows = (await db.execute(q)).scalars().all()
    out: list[OrderAdminOut] = []
    for r in rows:
        u = (await db.execute(select(User).where(User.id == r.user_id))).scalar_one_or_none()
        data = OrderAdminOut.model_validate(r).model_dump()
        data["user_email"] = u.email if u else None
        out.append(OrderAdminOut(**data))
    return out


@router.get("/orders/{order_id}", response_model=OrderAdminOut)
async def admin_order(order_id: int, db: AsyncSession = Depends(get_db)):
    r = (await db.execute(select(Order).where(Order.id == order_id))).scalar_one_or_none()
    if not r:
        raise HTTPException(404, "Not found")
    u = (await db.execute(select(User).where(User.id == r.user_id))).scalar_one_or_none()
    data = OrderAdminOut.model_validate(r).model_dump()
    data["user_email"] = u.email if u else None
    return OrderAdminOut(**data)


@router.patch("/orders/{order_id}", response_model=OrderAdminOut)
async def update_order_status(order_id: int, data: OrderStatusUpdate, db: AsyncSession = Depends(get_db)):
    if data.status not in ("pending", "confirmed", "cancelled", "fulfilled"):
        raise HTTPException(400, "Invalid status")
    r = (await db.execute(select(Order).where(Order.id == order_id))).scalar_one_or_none()
    if not r:
        raise HTTPException(404, "Not found")
    r.status = data.status
    await db.commit()
    await db.refresh(r)
    u = (await db.execute(select(User).where(User.id == r.user_id))).scalar_one_or_none()
    payload = OrderAdminOut.model_validate(r).model_dump()
    payload["user_email"] = u.email if u else None
    return OrderAdminOut(**payload)


# --- products ---
@router.post("/products", response_model=ProductOut)
async def create_product(data: ProductIn, db: AsyncSession = Depends(get_db)):
    p = Product(**data.model_dump(), slug=await unique_slug(db, Product, data.name))
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return ProductOut.model_validate(p)


@router.put("/products/{pid}", response_model=ProductOut)
async def update_product(pid: int, data: ProductIn, db: AsyncSession = Depends(get_db)):
    p = (await db.execute(select(Product).where(Product.id == pid))).scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Not found")
    payload = data.model_dump()
    if payload["name"] != p.name:
        p.slug = await unique_slug(db, Product, payload["name"], exclude_id=p.id)
    for k, v in payload.items():
        setattr(p, k, v)
    await db.commit()
    await db.refresh(p)
    return ProductOut.model_validate(p)


@router.delete("/products/{pid}", status_code=204)
async def delete_product(pid: int, db: AsyncSession = Depends(get_db)):
    p = (await db.execute(select(Product).where(Product.id == pid))).scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Not found")
    await db.delete(p)
    await db.commit()


# --- services ---
@router.post("/services", response_model=ServiceOut)
async def create_service(data: ServiceIn, db: AsyncSession = Depends(get_db)):
    s = Service(**data.model_dump(), slug=await unique_slug(db, Service, data.name))
    db.add(s)
    await db.commit()
    await db.refresh(s)
    return ServiceOut.model_validate(s)


@router.put("/services/{sid}", response_model=ServiceOut)
async def update_service(sid: int, data: ServiceIn, db: AsyncSession = Depends(get_db)):
    s = (await db.execute(select(Service).where(Service.id == sid))).scalar_one_or_none()
    if not s:
        raise HTTPException(404, "Not found")
    payload = data.model_dump()
    if payload["name"] != s.name:
        s.slug = await unique_slug(db, Service, payload["name"], exclude_id=s.id)
    for k, v in payload.items():
        setattr(s, k, v)
    await db.commit()
    await db.refresh(s)
    return ServiceOut.model_validate(s)


@router.delete("/services/{sid}", status_code=204)
async def delete_service(sid: int, db: AsyncSession = Depends(get_db)):
    s = (await db.execute(select(Service).where(Service.id == sid))).scalar_one_or_none()
    if not s:
        raise HTTPException(404, "Not found")
    await db.delete(s)
    await db.commit()
