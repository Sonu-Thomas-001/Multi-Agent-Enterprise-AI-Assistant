from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.vector_service import VectorDBService

class SearchKBInput(BaseModel):
    query: str = Field(description="Search query string for enterprise knowledge base")

@tool("search_kb_documents", args_schema=SearchKBInput)
def search_kb_documents(query: str) -> str:
    """
    Searches the enterprise vector database for relevant documents and knowledge articles.
    """
    vector_service = VectorDBService()
    docs = vector_service.search_documents(query=query, top_k=3)
    if not docs:
        return "No relevant enterprise documents found."
    return "\n\n".join(docs)
