from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.rag_service import RAGService
from app.schemas.rag import RAGSearchResponse

class DocumentSearchInput(BaseModel):
    query: str = Field(..., description="Query string to search enterprise documents, policies, and SOPs", example="remote work policy")
    category_filter: str | None = Field(default=None, description="Optional category filter (e.g. hr_policies, engineering_sops, incident_reports)")
    top_k: int = Field(default=4, ge=1, le=10, description="Number of document citations to retrieve")

@tool("document_search", args_schema=DocumentSearchInput)
def document_search_tool(query: str, category_filter: str | None = None, top_k: int = 4) -> str:
    """
    Searches enterprise corporate documents (HR Policies, SOPs, Incident Reports, Architecture specs) using Hybrid RAG.
    """
    rag_service = RAGService()
    response: RAGSearchResponse = rag_service.search(
        query=query,
        domain_filter=category_filter,
        top_k=top_k
    )
    return response.model_dump_json()
