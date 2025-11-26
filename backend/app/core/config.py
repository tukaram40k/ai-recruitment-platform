import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "AI Recruitment Platform"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://postgres:admin@localhost:5432/recruitment_db"

    # JWT Settings
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # NVIDIA API for AI features
    NVIDIA_API_KEY: str = ""

    # CORS - allow frontend origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:80",
        "http://localhost",
        "http://frontend",
        "http://frontend:80"
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
