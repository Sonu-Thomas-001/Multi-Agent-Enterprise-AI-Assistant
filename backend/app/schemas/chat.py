from pydantic import BaseModel, Field
from datetime import datetime

class ChatMessageRequest(BaseModel):
    session_id: str = Field(..., description="Unique session UUID identifier for thread context", example="sess-12345")
    message: str = Field(..., min_length=1, description="User prompt or question", example="What is our Q3 marketing budget?")

class SourceMetadata(BaseModel):
    title: str = Field(description="Document or table title")
    domain: str = Field(description="Domain category (HR, Finance, IT)")
    type: str = Field(description="Source type (Policy, Benefits, SQL, Guide)")

class ChatMessageResponse(BaseModel):
    session_id: str
    response: str
    agent_used: str = Field(default="Supervisor", description="Agent that generated the response")
    sources: list[SourceMetadata] = Field(default_factory=list)
    execution_time_ms: float = Field(default=0.0, description="Graph execution time in milliseconds")

class MessageItemSchema(BaseModel):
    id: int
    session_id: str
    role: str
    content: str
    agent_used: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    session_id: str
    total_messages: int
    messages: list[MessageItemSchema]
