from pydantic import BaseModel, Field
from typing import Literal

class AgentInfoSchema(BaseModel):
    id: str = Field(example="hr_agent")
    name: str = Field(example="HR Specialist Agent")
    role: str = Field(example="Human Resources")
    description: str = Field(example="Answers questions regarding employee handbook, benefits, and remote work policies.")
    capabilities: list[str] = Field(example=["Vector RAG Search", "Policy Analysis"])
    tools: list[str] = Field(example=["search_hr_documents"])

class AgentListResponse(BaseModel):
    agents: list[AgentInfoSchema]

class SupervisorDecision(BaseModel):
    execution_type: Literal["sequential", "parallel", "finish"] = Field(
        default="sequential",
        description="Routing pattern: 'sequential' for single worker, 'parallel' for concurrent execution, or 'finish'."
    )
    next_agent: str = Field(
        default="FINISH",
        description="Target worker agent if sequential (e.g. 'Planner', 'Research', 'Document', 'Email', 'Coding', 'Analytics', 'Report', 'Memory', 'FINISH')"
    )
    parallel_agents: list[str] = Field(
        default_factory=list,
        description="List of agent names to execute concurrently if execution_type is 'parallel'"
    )
    reasoning: str = Field(
        default="",
        description="Supervisor rationale for the routing choice"
    )

class AgentResultPayload(BaseModel):
    agent_name: str
    status: Literal["success", "error", "retry"] = "success"
    content: str
    artifacts: dict = Field(default_factory=dict)
    retry_count: int = 0
