from pydantic import BaseModel, Field
from datetime import datetime, timezone

class ServiceStatus(BaseModel):
    database: bool = Field(description="SQLite connection status")
    vector_db: bool = Field(description="ChromaDB connection status")
    llm_configured: bool = Field(description="LLM provider API key configuration status")

class HealthResponse(BaseModel):
    status: str = Field(example="healthy")
    version: str = Field(example="1.0.0")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    environment: str = Field(example="development")
    services: ServiceStatus
