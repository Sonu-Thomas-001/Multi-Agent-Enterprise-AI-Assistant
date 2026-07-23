from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.rag_service import RAGService

class SearchITKBInput(BaseModel):
    query: str = Field(description="Search query string regarding IT troubleshooting, VPN, or password reset")

@tool("search_it_knowledge_base", args_schema=SearchITKBInput)
def search_it_knowledge_base(query: str) -> str:
    """
    Search the IT support knowledge base using Hybrid RAG search (BM25 + Dense RRF).
    """
    rag_service = RAGService()
    response = rag_service.search(query=query, domain_filter="IT", top_k=2)
    if not response.citations:
        return "No relevant IT support documents found."
    
    results = [f"IT Guide: {c.title}\n{c.snippet}\nSource: {c.source_file}" for c in response.citations]
    return "\n\n".join(results)
