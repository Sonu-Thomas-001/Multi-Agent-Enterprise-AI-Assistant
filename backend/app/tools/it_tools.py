from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.vector_service import VectorDBService

class SearchITKBInput(BaseModel):
    query: str = Field(description="Search query string regarding IT troubleshooting, VPN, or password reset")

@tool("search_it_knowledge_base", args_schema=SearchITKBInput)
def search_it_knowledge_base(query: str) -> str:
    """
    Search the IT support knowledge base using vector similarity search.
    """
    vector_service = VectorDBService()
    docs = vector_service.search_documents(query=query, domain_filter="IT", top_k=2)
    if not docs:
        return "No relevant IT support documents found."
    return "\n\n".join(docs)
