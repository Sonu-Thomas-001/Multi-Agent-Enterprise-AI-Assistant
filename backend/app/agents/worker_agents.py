from langgraph.prebuilt import create_react_agent
from app.services.llm_service import LLMService
from app.tools.hr_tools import search_hr_documents
from app.tools.finance_tools import query_financial_database
from app.tools.it_tools import search_it_knowledge_base
from app.prompts.agent_prompts import (
    HR_AGENT_SYSTEM_PROMPT,
    FINANCE_AGENT_SYSTEM_PROMPT,
    IT_AGENT_SYSTEM_PROMPT
)

def create_worker_agents():
    llm_service = LLMService()
    llm = llm_service.get_llm()

    hr_agent = create_react_agent(
        llm,
        tools=[search_hr_documents],
        state_modifier=HR_AGENT_SYSTEM_PROMPT
    )

    finance_agent = create_react_agent(
        llm,
        tools=[query_financial_database],
        state_modifier=FINANCE_AGENT_SYSTEM_PROMPT
    )

    it_agent = create_react_agent(
        llm,
        tools=[search_it_knowledge_base],
        state_modifier=IT_AGENT_SYSTEM_PROMPT
    )

    return hr_agent, finance_agent, it_agent
