"""
Application configuration management using Pydantic Settings.
Reads environment variables with fallback defaults.
"""

from typing import List, Union
import json
import os
from pydantic import Field

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    _USE_PYDANTIC_SETTINGS = True
except ImportError:
    from pydantic import BaseModel as BaseSettings
    _USE_PYDANTIC_SETTINGS = False


class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    APP_NAME: str = Field(default="PitchCraft AI Backend")
    APP_VERSION: str = Field(default="1.0.0")
    API_PREFIX: str = Field(default="/api")

    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)

    # CORS configuration
    CORS_ORIGINS: Union[List[str], str] = Field(
        default=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "*"]
    )

    # Database configuration (default to local SQLite file)
    DATABASE_URL: str = Field(default="sqlite:///./pitchcraft.db")

    # Ollama service configuration
    OLLAMA_BASE_URL: str = Field(default="http://127.0.0.1:11434")
    OLLAMA_MODEL: str = Field(default="qwen3:4b")
    OLLAMA_TIMEOUT: float = Field(default=120.0)
    OLLAMA_TIMEOUT_SECONDS: float = Field(default=120.0)

    # Single-user MVP mode flag
    SINGLE_USER_MODE: bool = Field(default=True)

    if _USE_PYDANTIC_SETTINGS:
        model_config = SettingsConfigDict(
            env_file=".env",
            env_file_encoding="utf-8",
            extra="ignore",
            case_sensitive=True,
        )

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        if isinstance(self.CORS_ORIGINS, str):
            try:
                parsed = json.loads(self.CORS_ORIGINS)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return ["*"]


settings = Settings()
