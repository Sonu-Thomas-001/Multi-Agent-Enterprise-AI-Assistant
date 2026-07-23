from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.services.llm_service import LLMService
from app.prompts.agent_prompts import SUPERVISOR_SYSTEM_PROMPT
from app.agents.state import AgentState
from app.utils.logger import logger

def make_supervisor_node():
    llm_service = LLMService()
    llm = llm_service.get_llm()

    prompt = ChatPromptTemplate.from_messages([
        ("system", SUPERVISOR_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="messages"),
    ])

    structured_llm = llm.with_structured_output({
        "type": "object",
        "properties": {
            "next": {
                "type": "string",
                "enum": ["HR", "Finance", "IT", "FINISH"]
            }
        },
        "required": ["next"]
    })

    supervisor_chain = prompt | structured_llm

    def supervisor_node(state: AgentState) -> dict:
        try:
            result = supervisor_chain.invoke({"messages": state["messages"]})
            next_agent = result.get("next", "FINISH")
            logger.info(f"Supervisor routed request to: '{next_agent}'")
            return {"next": next_agent}
        except Exception as e:
            logger.error(f"Supervisor node execution failed: {str(e)}")
            return {"next": "FINISH"}

    return supervisor_node
