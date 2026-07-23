from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.vector_service import VectorDBService

class SearchHRDocsInput(BaseModel):
    query: str = Field(description="Search query string regarding HR policies, remote work, or benefits")

@tool("search_hr_documents", args_schema=SearchHRDocsInput)
def search_hr_documents(query: str) -> str:
    """
    Search the HR document knowledge base using vector similarity search.
    """
    vector_service = VectorDBService()
    docs = vector_service.search_documents(query=query, domain_filter="HR", top_k=2)
    if not docs:
        return "No relevant HR policy documents found."
    return "\n\n".join(docs)
