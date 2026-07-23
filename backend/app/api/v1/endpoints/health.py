from fastapi import APIRouter, Depends, status
from app.schemas.health import HealthResponse, ServiceStatus
from app.core.config import Settings
from app.api.deps import get_settings_dep, get_db_service, get_vector_service, get_llm_service
from app.services.db_service import DatabaseService
from app.services.vector_service import VectorDBService
from app.services.llm_service import LLMService

router = APIRouter(prefix="/health", tags=["System Health"])

@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Get System & Dependency Health Status"
)
async def check_health(
    settings: Settings = Depends(get_settings_dep),
    db_service: DatabaseService = Depends(get_db_service),
    vector_service: VectorDBService = Depends(get_vector_service),
    llm_service: LLMService = Depends(get_llm_service)
) -> HealthResponse:
    """
    Returns system status, active version, environment, and sub-service connection checks.
    """
    db_ok = db_service.check_health()
    vector_ok = vector_service.check_health()
    llm_ok = llm_service.is_configured()

    overall_status = "healthy" if (db_ok and vector_ok) else "degraded"

    return HealthResponse(
        status=overall_status,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        services=ServiceStatus(
            database=db_ok,
            vector_db=vector_ok,
            llm_configured=llm_ok
        )
    )
