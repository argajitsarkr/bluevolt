from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.auth import get_current_user
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.service import Service
from app.schemas.common import OrderIn, OrderOut

router = APIRouter()


@router.post("", response_model=OrderOut)
async def place_order(
    data: OrderIn,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not data.items:
        raise HTTPException(400, "Cart is empty")
    if not data.contact_phone.strip():
        raise HTTPException(400, "Phone number required")

    order = Order(
        user_id=user.id,
        contact_name=data.contact_name.strip() or user.full_name,
        contact_phone=data.contact_phone.strip(),
        notes=data.notes,
        status="pending",
    )
    db.add(order)
    await db.flush()

    for item in data.items:
        kind = item.kind
        if kind not in ("product", "service", "custom"):
            raise HTTPException(400, f"Invalid item kind: {kind}")
        oi = OrderItem(order_id=order.id, kind=kind, quantity=max(1, item.quantity))
        if kind == "product":
            if not item.product_id:
                raise HTTPException(400, "product_id required")
            p = (await db.execute(select(Product).where(Product.id == item.product_id))).scalar_one_or_none()
            if not p:
                raise HTTPException(400, f"Product {item.product_id} not found")
            oi.product_id = p.id
            oi.name_snapshot = p.name
            oi.unit_price_paise = p.our_price_paise
        elif kind == "service":
            if not item.service_id:
                raise HTTPException(400, "service_id required")
            s = (await db.execute(select(Service).where(Service.id == item.service_id))).scalar_one_or_none()
            if not s:
                raise HTTPException(400, f"Service {item.service_id} not found")
            oi.service_id = s.id
            oi.name_snapshot = s.name
            oi.unit_price_paise = s.indicative_price_paise
        else:  # custom
            if not item.custom_text.strip():
                raise HTTPException(400, "custom_text required for custom items")
            oi.custom_text = item.custom_text.strip()
            oi.name_snapshot = "Custom request"
        db.add(oi)

    await db.commit()
    await db.refresh(order)
    return OrderOut.model_validate(order)


@router.get("/me", response_model=list[OrderOut])
async def my_orders(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (
        await db.execute(select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc()))
    ).scalars().all()
    return [OrderOut.model_validate(r) for r in rows]
