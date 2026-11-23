import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Automatically load environment variables from backend/.env if present
env_file = os.path.join(BASE_DIR, ".env")
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k not in os.environ:
                    os.environ[k] = v

class Settings:
    PROJECT_NAME: str = "FoodSave – Save Food, Share Hope"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "foodsave-super-secret-jwt-key-2026-secure-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    BASE_DIR: str = BASE_DIR
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")

    # Cloud PostgreSQL database (e.g. Supabase, Neon.tech, Render)
    # If not set, defaults to local SQLite file for zero-setup local dev
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'foodsave.db')}")

settings = Settings()
