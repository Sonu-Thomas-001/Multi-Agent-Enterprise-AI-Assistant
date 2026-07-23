from pydantic import BaseModel, Field

class AgentInfoSchema(BaseModel):
    id: str = Field(example="hr_agent")
    name: str = Field(example="HR Specialist Agent")
    role: str = Field(example="Human Resources")
    description: str = Field(example="Answers questions regarding employee handbook, benefits, and remote work policies.")
    capabilities: list[str] = Field(example=["Vector RAG Search", "Policy Analysis"])
    tools: list[str] = Field(example=["search_hr_documents"])

class AgentListResponse(BaseModel):
    agents: list[AgentInfoSchema]
