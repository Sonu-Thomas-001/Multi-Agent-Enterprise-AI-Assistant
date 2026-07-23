from fastapi import APIRouter, HTTPException, status
from app.schemas.agent import AgentListResponse, AgentInfoSchema

router = APIRouter(prefix="/agents", tags=["Agent Registry & Capabilities"])

AVAILABLE_AGENTS: list[dict] = [
    {
        "id": "supervisor",
        "name": "Supervisor Orchestrator Agent",
        "role": "Network Orchestration",
        "description": "Evaluates task progress, selects single or parallel execution paths, and merges worker outputs.",
        "capabilities": ["Intent Classification", "Parallel Fan-Out Routing", "Output Merging"],
        "tools": []
    },
    {
        "id": "planner",
        "name": "Execution Planner Agent",
        "role": "Planning & Task Decomposition",
        "description": "Decomposes complex user goals into structured, ordered sub-task lists.",
        "capabilities": ["Goal Decomposition", "DAG Planning"],
        "tools": []
    },
    {
        "id": "research",
        "name": "Research Specialist Agent",
        "role": "Knowledge Retrieval",
        "description": "Searches vector databases and enterprise documents to gather verified facts.",
        "capabilities": ["Vector RAG Search", "Knowledge Retrieval"],
        "tools": ["search_kb_documents"]
    },
    {
        "id": "document",
        "name": "Document Analysis Agent",
        "role": "Document Processing",
        "description": "Parses, summarizes, and extracts key terms from corporate policies and contracts.",
        "capabilities": ["Policy Parsing", "Contract Clause Extraction"],
        "tools": ["parse_enterprise_policy"]
    },
    {
        "id": "email",
        "name": "Corporate Email Agent",
        "role": "Communication",
        "description": "Drafts, formats, and prepares professional executive emails.",
        "capabilities": ["Executive Email Drafting", "Notification Formatting"],
        "tools": ["draft_corporate_email"]
    },
    {
        "id": "coding",
        "name": "Software & Automation Agent",
        "role": "Code Engineering",
        "description": "Generates, inspects, and validates Python scripts & SQL database utilities.",
        "capabilities": ["Python Code Execution", "Syntax Validation"],
        "tools": ["execute_python_code"]
    },
    {
        "id": "analytics",
        "name": "Data & Financial Analytics Agent",
        "role": "Analytics & Finance",
        "description": "Executes SQL queries against relational databases to compute budget and expense metrics.",
        "capabilities": ["Text-to-SQL", "Financial Aggregation"],
        "tools": ["query_financial_sql"]
    },
    {
        "id": "report",
        "name": "Executive Report Generator",
        "role": "Report Synthesis",
        "description": "Synthesizes multi-source research, analytics, and code outputs into structured Markdown reports.",
        "capabilities": ["Executive Report Compilation", "Markdown Formatting"],
        "tools": ["generate_markdown_report"]
    },
    {
        "id": "memory",
        "name": "Context & Memory Agent",
        "role": "State & Context Management",
        "description": "Manages persistent organizational memory, user preferences, and session context.",
        "capabilities": ["Session Context Recall", "Memory Storage"],
        "tools": ["recall_memory"]
    }
]

@router.get(
    "",
    response_model=AgentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Registered 9 Agents & Capabilities"
)
async def list_agents() -> AgentListResponse:
    """
    Returns metadata detailing all 9 active agents, roles, capabilities, and assigned tool definitions.
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
    Returns metadata for a specific agent ID.
    """
    for agent in AVAILABLE_AGENTS:
        if agent["id"] == agent_id:
            return AgentInfoSchema.model_validate(agent)
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Agent with ID '{agent_id}' not found."
    )
