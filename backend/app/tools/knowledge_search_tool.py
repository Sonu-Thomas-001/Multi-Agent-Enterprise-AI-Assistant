from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.rag_service import RAGService
from app.schemas.rag import RAGSearchResponse

class KnowledgeSearchInput(BaseModel):
    topic: str = Field(..., description="Technical topic or troubleshooting issue to search in the knowledge base", example="VPN connection failure")
    top_k: int = Field(default=3, ge=1, le=10, description="Max number of knowledge articles to return")

@tool("knowledge_search", args_schema=KnowledgeSearchInput)
def knowledge_search_tool(topic: str, top_k: int = 3) -> str:
    """
    Searches the internal IT Knowledge Base & Engineering Troubleshooting Guides using Hybrid BM25 + Vector Search.
    """
    rag_service = RAGService()
    response: RAGSearchResponse = rag_service.search(
        query=topic,
        domain_filter="IT",
        top_k=top_k
    )
    return response.model_dump_json()
