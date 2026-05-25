from datetime import datetime
from sqlalchemy import String, Integer, Boolean, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    brand: Mapped[str] = mapped_column(String(120), default="")
    sku: Mapped[str] = mapped_column(String(60), default="", index=True)
    pack_size: Mapped[str] = mapped_column(String(60), default="")
    mrp_paise: Mapped[int] = mapped_column(Integer, default=0)
    our_price_paise: Mapped[int] = mapped_column(Integer, default=0)
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), default="")
    spec_sheet_url: Mapped[str] = mapped_column(String(500), default="")
    safety_sheet_url: Mapped[str] = mapped_column(String(500), default="")
    usage_url: Mapped[str] = mapped_column(String(500), default="")
    coa_url: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
