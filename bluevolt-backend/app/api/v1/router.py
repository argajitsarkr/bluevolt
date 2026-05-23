from fastapi import APIRouter
from . import health, auth, users, products, services, categories, orders, admin

router = APIRouter()
router.include_router(health.router, tags=["health"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(products.router, prefix="/products", tags=["products"])
router.include_router(services.router, prefix="/services", tags=["services"])
router.include_router(categories.router, prefix="/categories", tags=["categories"])
router.include_router(orders.router, prefix="/orders", tags=["orders"])
router.include_router(admin.router, prefix="/admin", tags=["admin"])
