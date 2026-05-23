from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://bluevolt:bluevolt@db:5432/bluevolt"
    REDIS_URL: str = "redis://redis:6379/0"
    FRONTEND_URL: str = "http://localhost:3000"
    CORS_ORIGINS: str = "http://localhost:3000"
    ADMIN_EMAILS: str = ""
    NEXTAUTH_SECRET: str = "change-me"
    DB_PASSWORD: str = "bluevolt"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def admin_emails_set(self) -> set[str]:
        return {e.strip().lower() for e in self.ADMIN_EMAILS.split(",") if e.strip()}

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
