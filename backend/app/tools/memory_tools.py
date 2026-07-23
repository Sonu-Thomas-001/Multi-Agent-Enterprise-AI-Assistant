from pydantic import BaseModel, Field
from langchain_core.tools import tool

class MemoryInput(BaseModel):
    key: str = Field(description="Context key to recall or store")
    value: str | None = Field(default=None, description="Optional value to store in session memory")

_GLOBAL_SESSION_MEMORY: dict[str, str] = {
    "organization_name": "Acme Enterprise Corp",
    "primary_market": "North America",
    "fiscal_year_start": "January"
}

@tool("recall_memory", args_schema=MemoryInput)
def recall_memory(key: str, value: str | None = None) -> str:
    """
    Recalls or stores key-value pairs in session memory context.
    """
    if value:
        _GLOBAL_SESSION_MEMORY[key] = value
        return f"Stored memory: '{key}' = '{value}'"
    val = _GLOBAL_SESSION_MEMORY.get(key)
    if val:
        return f"Recalled memory for '{key}': {val}"
    return f"No memory found for key '{key}'."
