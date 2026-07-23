from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.rag_service import RAGService

class SearchKBInput(BaseModel):
    query: str = Field(description="Search query string for enterprise knowledge base")

@tool("search_kb_documents", args_schema=SearchKBInput)
def search_kb_documents(query: str) -> str:
    """
    Searches the enterprise vector database using Hybrid Search (BM25 + Dense RRF) for relevant documents and citations.
    """
    rag_service = RAGService()
    response = rag_service.search(query=query, top_k=3)
    if not response.citations:
        return "No relevant enterprise documents found."
    
    results = []
    for c in response.citations:
        results.append(f"[{c.title} ({c.category}) - Score: {c.score}]\n{c.snippet}\nSource: {c.source_file}")
    return "\n\n---\n\n".join(results)
