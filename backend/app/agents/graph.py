from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from app.agents.state import AgentState
from app.agents.supervisor import make_supervisor_node
from app.agents.worker_agents import create_worker_agents
from app.schemas.agent import AgentResultPayload
from app.utils.logger import logger

def build_enterprise_agent_graph():
    supervisor_node = make_supervisor_node()
    worker_agents = create_worker_agents()

    def create_agent_wrapper(agent_name: str, agent_obj):
        def node_fn(state: AgentState) -> dict:
            try:
                logger.info(f"Executing worker node: [{agent_name}]")
                res = agent_obj.invoke({"messages": state["messages"]})
                last_msg = res["messages"][-1]
                payload = AgentResultPayload(
                    agent_name=agent_name,
                    status="success",
                    content=last_msg.content,
                    artifacts={}
                ).model_dump()
                return {
                    "messages": [AIMessage(content=f"[{agent_name} Output]: {last_msg.content}")],
                    "agent_outputs": [payload]
                }
            except Exception as e:
                logger.error(f"Worker node [{agent_name}] error: {str(e)}", exc_info=True)
                payload = AgentResultPayload(
                    agent_name=agent_name,
                    status="error",
                    content=f"Error executing agent task: {str(e)}",
                    artifacts={}
                ).model_dump()
                return {
                    "messages": [AIMessage(content=f"[{agent_name} Error]: {str(e)}")],
                    "agent_outputs": [payload]
                }
        return node_fn

    # Merger node for parallel fan-in execution
    def merge_outputs_node(state: AgentState) -> dict:
        outputs = state.get("agent_outputs", [])
        logger.info(f"Merging outputs from {len(outputs)} executed agent steps.")
        summary_lines = [f"- {out.get('agent_name', 'Agent')}: {out.get('content', '')[:150]}..." for out in outputs[-3:]]
        summary_msg = "Parallel Output Summary:\n" + "\n".join(summary_lines)
        return {"messages": [AIMessage(content=summary_msg)]}

    workflow = StateGraph(AgentState)

    # Register Nodes
    workflow.add_node("Supervisor", supervisor_node)
    workflow.add_node("MergeOutputs", merge_outputs_node)

    for name, agent in worker_agents.items():
        workflow.add_node(name, create_agent_wrapper(name, agent))
        # Each worker node routes to MergeOutputs before supervisor evaluation
        workflow.add_edge(name, "MergeOutputs")

    workflow.add_edge("MergeOutputs", "Supervisor")

    # Dynamic Supervisor Routing Edge (Supports single next agent, parallel list, or FINISH)
    def route_supervisor_decision(state: AgentState):
        mode = state.get("execution_type", "sequential")
        nxt = state.get("next", "FINISH")
        parallel_list = state.get("parallel_agents", [])

        if mode == "finish" or nxt == "FINISH":
            return END
        elif mode == "parallel" and parallel_list:
            # Route to all parallel worker nodes concurrently
            valid_targets = [agent for agent in parallel_list if agent in worker_agents]
            return valid_targets if valid_targets else END
        else:
            return nxt if nxt in worker_agents else END

    workflow.add_conditional_edges(
        "Supervisor",
        route_supervisor_decision
    )

    workflow.set_entry_point("Supervisor")
    return workflow.compile()


# Global graph cache
_compiled_graph = None

def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_enterprise_agent_graph()
    return _compiled_graph


def run_agent_workflow(message: str, session_id: str) -> dict:
    """
    Executes the 9-agent LangGraph network with retry resilience & structured output parsing.
    """
    graph = get_graph()
    inputs = {
        "messages": [HumanMessage(content=message)],
        "agent_outputs": [],
        "task_plan": [],
        "session_memory": {},
        "retry_count": 0
    }
    config = {"configurable": {"thread_id": session_id}}

    result = graph.invoke(inputs, config=config)
    last_msg = result["messages"][-1].content
    return {
        "response": last_msg,
        "agent_used": "Supervisor Multi-Agent Graph",
        "agent_outputs": result.get("agent_outputs", [])
    }
