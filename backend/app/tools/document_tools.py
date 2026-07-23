from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.rag_service import RAGService

class ParsePolicyInput(BaseModel):
    policy_name: str = Field(description="Policy or contract title to retrieve and parse")

@tool("parse_enterprise_policy", args_schema=ParsePolicyInput)
def parse_enterprise_policy(policy_name: str) -> str:
    """
    Parses and extracts key terms from corporate handbook policies and contracts using Hybrid RAG search.
    """
    rag_service = RAGService()
    response = rag_service.search(query=policy_name, domain_filter="HR", top_k=2)
    if not response.citations:
        return f"Policy '{policy_name}' not found."
    
    results = [f"Policy Document: {c.title}\n{c.snippet}\nSource: {c.source_file}" for c in response.citations]
    return "\n\n".join(results)
