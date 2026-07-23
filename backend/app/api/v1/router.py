from fastapi import APIRouter
from app.api.v1.endpoints import health, chat, agents, rag

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(chat.router)
api_router.include_router(agents.router)
api_router.include_router(rag.router)
