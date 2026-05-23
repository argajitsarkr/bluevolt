from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    full_name: str
    phone: str
    is_admin: bool
    created_at: datetime


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    full_name: str = ""
    phone: str = ""


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ProfileUpdateIn(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None


class CategoryIn(BaseModel):
    name: str
    kind: str  # product | service


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    slug: str
    kind: str


class ProductIn(BaseModel):
    name: str
    description: str = ""
    category_id: Optional[int] = None
    brand: str = ""
    sku: str = ""
    pack_size: str = ""
    mrp_paise: int = 0
    our_price_paise: int = 0
    in_stock: bool = True
    image_url: str = ""


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    description: str
    category_id: Optional[int]
    brand: str
    sku: str
    pack_size: str
    mrp_paise: int
    our_price_paise: int
    in_stock: bool
    image_url: str
    created_at: datetime


class ServiceIn(BaseModel):
    name: str
    description: str = ""
    category_id: Optional[int] = None
    indicative_price_paise: Optional[int] = None
    turnaround_days: Optional[int] = None
    image_url: str = ""


class ServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name: str
    description: str
    category_id: Optional[int]
    indicative_price_paise: Optional[int]
    turnaround_days: Optional[int]
    image_url: str
    created_at: datetime


class OrderItemIn(BaseModel):
    kind: str  # product | service | custom
    product_id: Optional[int] = None
    service_id: Optional[int] = None
    custom_text: str = ""
    quantity: int = 1


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    kind: str
    product_id: Optional[int]
    service_id: Optional[int]
    custom_text: str
    name_snapshot: str
    quantity: int
    unit_price_paise: Optional[int]


class OrderIn(BaseModel):
    contact_name: str
    contact_phone: str
    notes: str = ""
    items: list[OrderItemIn]


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    status: str
    contact_name: str
    contact_phone: str
    notes: str
    created_at: datetime
    items: list[OrderItemOut]


class OrderAdminOut(OrderOut):
    user_email: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str  # pending | confirmed | cancelled | fulfilled
