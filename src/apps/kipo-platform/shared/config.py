import os
from pathlib import Path
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))


class BaseConfig:
    PROJECT_URL = os.environ.get("PROJECT_URL", "http://127.0.0.1:54321")
    DATABASE_URL = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:postgres@127.0.0.1:54321/postgres"
    )
    AUTH_KEY_PUBLISHABLE = os.environ.get("AUTH_KEY_PUBLISHABLE", "auth-key")
    AUTH_KEY_SECRET = os.environ.get("AUTH_KEY_SECRET", "auth-secret")

    STORAGE_URL = os.environ.get("STORAGE_URL", "http://127.0.0.1:54321/storage/v1/s3")
    STORAGE_ACCESS_KEY = os.environ.get("STORAGE_ACCESS_KEY", "access-key")
    STORAGE_ACCESS_KEY = os.environ.get("STORAGE_ACCESS_KEY", "access-key")
    STORAGE_SECRET = os.environ.get("STORAGE_SECRET_KEY", "access-secret")
    STORAGE_REGION = os.environ.get("STORAGE_REGION", "local")

    COOKIE_SECURE = False
    PROPAGATE_EXCEPTIONS = True

class DevelopmentConfig(BaseConfig):
    DEBUG = True

class ProductionConfig(BaseConfig):
    DEBUG = False
    TESTING = False
    COOKIE_SECURE = True

    def __init__(self):
        if not self.DATABASE_URL:
            raise ValueError("Missing dtabase url")


class TestingConfig(BaseConfig):
    TESTING = True
    DATABASE_URL = "sqlite:///:memory:"


config_mapping = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
