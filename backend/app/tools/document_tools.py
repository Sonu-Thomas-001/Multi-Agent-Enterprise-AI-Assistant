from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.vector_service import VectorDBService

class ParsePolicyInput(BaseModel):
    policy_name: str = Field(description="Policy or contract title to retrieve and parse")

@tool("parse_enterprise_policy", args_schema=ParsePolicyInput)
def parse_enterprise_policy(policy_name: str) -> str:
    """
    Parses and extracts key terms from corporate handbook policies and contracts.
    """
    vector_service = VectorDBService()
    docs = vector_service.search_documents(query=policy_name, domain_filter="HR", top_k=2)
    if not docs:
        return f"Policy '{policy_name}' not found."
    return f"Parsed Policy Content for '{policy_name}':\n" + "\n".join(docs)
