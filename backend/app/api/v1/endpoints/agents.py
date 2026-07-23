from fastapi import APIRouter, HTTPException, status
from app.schemas.agent import AgentListResponse, AgentInfoSchema

router = APIRouter(prefix="/agents", tags=["Agent Registry & Capabilities"])

AVAILABLE_AGENTS: list[dict] = [
    {
        "id": "supervisor",
        "name": "Supervisor Router Agent",
        "role": "Orchestrator",
        "description": "Analyzes input intent and delegates workflow execution to specialized domain workers.",
        "capabilities": ["Intent Classification", "Workflow Routing", "Multi-Turn Dialogue"],
        "tools": []
    },
    {
        "id": "hr_agent",
        "name": "HR Specialist Agent",
        "role": "Human Resources",
        "description": "Answers questions regarding employee handbooks, health benefits, remote work, and company policies.",
        "capabilities": ["Vector RAG Search", "Policy Analysis"],
        "tools": ["search_hr_documents"]
    },
    {
        "id": "finance_agent",
        "name": "Finance Analytics Agent",
        "role": "Financial Services",
        "description": "Executes SQL queries against relational databases to answer budget and expense questions.",
        "capabilities": ["Text-to-SQL", "Financial Aggregation"],
        "tools": ["query_financial_database"]
    },
    {
        "id": "it_agent",
        "name": "IT Support Agent",
        "role": "Information Technology",
        "description": "Assists with technical troubleshooting, VPN configurations, and corporate password resets.",
        "capabilities": ["Vector RAG Search", "Technical Guide Retrieval"],
        "tools": ["search_it_knowledge_base"]
    }
]

@router.get(
    "",
    response_model=AgentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Registered Agents & Capabilities"
)
async def list_agents() -> AgentListResponse:
    """
    Returns metadata detailing all active worker agents, descriptions, and assigned tool definitions.
    """
    agents = [AgentInfoSchema.model_validate(agent) for agent in AVAILABLE_AGENTS]
    return AgentListResponse(agents=agents)


@router.get(
    "/{agent_id}",
    response_model=AgentInfoSchema,
    status_code=status.HTTP_200_OK,
    summary="Get Specific Agent Metadata"
)
async def get_agent(agent_id: str) -> AgentInfoSchema:
    """
    Returns detail for a single specified agent ID.
    """
    for agent in AVAILABLE_AGENTS:
        if agent["id"] == agent_id:
            return AgentInfoSchema.model_validate(agent)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Agent with ID '{agent_id}' not found."
    )
