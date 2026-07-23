from langchain_core.tools import tool
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from app.db.vectorstore import get_collection

@tool
def search_hr_documents(query: str) -> str:
    """
    Search the HR document knowledge base.
    Use this tool to find information about HR policies, benefits, remote work, etc.
    """
    collection = get_collection("enterprise_docs")
    results = collection.query(
        query_texts=[query],
        n_results=2,
        where={"domain": "HR"}
    )
    
    docs = results.get('documents', [[]])[0]
    if not docs:
        return "No relevant HR documents found."
    return "\n\n".join(docs)

@tool
def search_it_knowledge_base(query: str) -> str:
    """
    Search the IT knowledge base.
    Use this tool to find information about IT troubleshooting, passwords, VPNs, etc.
    """
    collection = get_collection("enterprise_docs")
    results = collection.query(
        query_texts=[query],
        n_results=2,
        where={"domain": "IT"}
    )
    
    docs = results.get('documents', [[]])[0]
    if not docs:
        return "No relevant IT documents found."
    return "\n\n".join(docs)
