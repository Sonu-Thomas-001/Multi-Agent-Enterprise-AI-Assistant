from collections.abc import Generator
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.config import Settings, get_settings
from app.db.session import get_db_session
from app.services.llm_service import LLMService
from app.services.vector_service import VectorDBService
from app.services.db_service import DatabaseService

def get_settings_dep() -> Settings:
    """
    Injects cached Application Settings.
    """
    return get_settings()

def get_llm_service(settings: Settings = Depends(get_settings_dep)) -> LLMService:
    """
    Injects LLM Service factory.
    """
    return LLMService(settings=settings)

def get_vector_service(settings: Settings = Depends(get_settings_dep)) -> VectorDBService:
    """
    Injects Vector Database Service.
    """
    return VectorDBService(settings=settings)

def get_db_service(settings: Settings = Depends(get_settings_dep)) -> DatabaseService:
    """
    Injects Relational Database Service.
    """
    return DatabaseService(settings=settings)
