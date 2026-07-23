from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.services.llm_service import LLMService
from app.prompts.agent_prompts import SUPERVISOR_SYSTEM_PROMPT
from app.schemas.agent import SupervisorDecision
from app.agents.state import AgentState
from app.utils.logger import logger

def make_supervisor_node():
    llm_service = LLMService()
    base_llm = llm_service.get_llm()

    # Wrap Supervisor LLM with retry logic
    llm = base_llm.with_retry(
        retry_if_exception_type=(Exception,),
        stop_after_attempt=3,
        wait_exponential_jitter=True
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SUPERVISOR_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="messages"),
    ])

    supervisor_chain = prompt | llm.with_structured_output(SupervisorDecision)

    def supervisor_node(state: AgentState) -> dict:
        try:
            decision: SupervisorDecision = supervisor_chain.invoke({"messages": state["messages"]})
            logger.info(
                f"Supervisor Decision: mode='{decision.execution_type}', "
                f"next='{decision.next_agent}', parallel={decision.parallel_agents}, "
                f"reason='{decision.reasoning}'"
            )
            return {
                "next": decision.next_agent,
                "execution_type": decision.execution_type,
                "parallel_agents": decision.parallel_agents
            }
        except Exception as e:
            logger.error(f"Supervisor routing execution failed: {str(e)}", exc_info=True)
            return {
                "next": "FINISH",
                "execution_type": "finish",
                "parallel_agents": []
            }

    return supervisor_node
