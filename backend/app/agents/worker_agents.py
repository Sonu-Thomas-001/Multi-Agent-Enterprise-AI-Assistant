from langgraph.prebuilt import create_react_agent
from app.services.llm_service import LLMService
from app.tools.research_tools import search_kb_documents
from app.tools.document_tools import parse_enterprise_policy
from app.tools.email_tools import draft_corporate_email
from app.tools.coding_tools import execute_python_code
from app.tools.analytics_tools import query_financial_sql
from app.tools.report_tools import generate_markdown_report
from app.tools.memory_tools import recall_memory
from app.prompts.agent_prompts import (
    PLANNER_PROMPT,
    RESEARCH_PROMPT,
    DOCUMENT_PROMPT,
    EMAIL_PROMPT,
    CODING_PROMPT,
    ANALYTICS_PROMPT,
    REPORT_PROMPT,
    MEMORY_PROMPT
)

def create_worker_agents():
    llm_service = LLMService()
    base_llm = llm_service.get_llm()

    # Wrap LLM with exponential backoff retry logic (max 3 attempts)
    llm = base_llm.with_retry(
        retry_if_exception_type=(Exception,),
        stop_after_attempt=3,
        wait_exponential_jitter=True
    )

    planner_agent = create_react_agent(
        llm,
        tools=[],
        state_modifier=PLANNER_PROMPT
    )

    research_agent = create_react_agent(
        llm,
        tools=[search_kb_documents],
        state_modifier=RESEARCH_PROMPT
    )

    document_agent = create_react_agent(
        llm,
        tools=[parse_enterprise_policy],
        state_modifier=DOCUMENT_PROMPT
    )

    email_agent = create_react_agent(
        llm,
        tools=[draft_corporate_email],
        state_modifier=EMAIL_PROMPT
    )

    coding_agent = create_react_agent(
        llm,
        tools=[execute_python_code],
        state_modifier=CODING_PROMPT
    )

    analytics_agent = create_react_agent(
        llm,
        tools=[query_financial_sql],
        state_modifier=ANALYTICS_PROMPT
    )

    report_agent = create_react_agent(
        llm,
        tools=[generate_markdown_report],
        state_modifier=REPORT_PROMPT
    )

    memory_agent = create_react_agent(
        llm,
        tools=[recall_memory],
        state_modifier=MEMORY_PROMPT
    )

    return {
        "Planner": planner_agent,
        "Research": research_agent,
        "Document": document_agent,
        "Email": email_agent,
        "Coding": coding_agent,
        "Analytics": analytics_agent,
        "Report": report_agent,
        "Memory": memory_agent,
    }
