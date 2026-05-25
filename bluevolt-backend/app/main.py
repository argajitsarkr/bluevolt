from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import router as v1_router
from app.startup import seed_admins

app = FastAPI(title="Blue Volt Scientific API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.on_event("startup")
async def on_startup() -> None:
    await seed_admins()


@app.get("/")
async def root():
    return {"service": "bluevolt-api", "status": "ok"}
