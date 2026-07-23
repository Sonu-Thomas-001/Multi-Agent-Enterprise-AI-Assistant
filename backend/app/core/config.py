from functools import lru_cache
from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    """
    Enterprise Application Settings using Pydantic Settings v2.
    Loads variables from environment or .env file with strict validation.
    """
    PROJECT_NAME: str = "Multi-Agent Enterprise AI Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # LLM Settings
    LLM_PROVIDER: Literal["gemini", "openai"] = "gemini"
    LLM_MODEL: str = "gemini-1.5-pro"
    LLM_TEMPERATURE: float = 0.0
    
    GOOGLE_API_KEY: str | None = Field(default=None, alias="GOOGLE_API_KEY")
    OPENAI_API_KEY: str | None = Field(default=None, alias="OPENAI_API_KEY")

    # Storage Paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    SQLITE_DB_PATH: str = Field(default="data/enterprise.db")
    CHROMA_PERSIST_DIR: str = Field(default="data/chroma")

    # CORS Configuration
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

    @property
    def absolute_sqlite_db_path(self) -> str:
        if os.path.isabs(self.SQLITE_DB_PATH):
            return self.SQLITE_DB_PATH
        return os.path.join(self.BASE_DIR, self.SQLITE_DB_PATH)

    @property
    def absolute_chroma_dir(self) -> str:
        if os.path.isabs(self.CHROMA_PERSIST_DIR):
            return self.CHROMA_PERSIST_DIR
        return os.path.join(self.BASE_DIR, self.CHROMA_PERSIST_DIR)


@lru_cache
def get_settings() -> Settings:
    """
    Returns cached settings instance.
    """
    return Settings()
