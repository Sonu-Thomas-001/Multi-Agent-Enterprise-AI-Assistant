from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.supervisor import make_supervisor_node
from app.agents.worker_agents import create_worker_agents
from langchain_core.messages import HumanMessage
from app.utils.logger import logger

def build_agent_graph():
    supervisor_node = make_supervisor_node()
    hr_agent, finance_agent, it_agent = create_worker_agents()

    def hr_node(state: AgentState) -> dict:
        res = hr_agent.invoke({"messages": state["messages"]})
        return {"messages": [res["messages"][-1]]}

    def finance_node(state: AgentState) -> dict:
        res = finance_agent.invoke({"messages": state["messages"]})
        return {"messages": [res["messages"][-1]]}

    def it_node(state: AgentState) -> dict:
        res = it_agent.invoke({"messages": state["messages"]})
        return {"messages": [res["messages"][-1]]}

    workflow = StateGraph(AgentState)

    workflow.add_node("Supervisor", supervisor_node)
    workflow.add_node("HR", hr_node)
    workflow.add_node("Finance", finance_node)
    workflow.add_node("IT", it_node)

    workflow.add_edge("HR", "Supervisor")
    workflow.add_edge("Finance", "Supervisor")
    workflow.add_edge("IT", "Supervisor")

    workflow.add_conditional_edges(
        "Supervisor",
        lambda x: x["next"],
        {
            "HR": "HR",
            "Finance": "Finance",
            "IT": "IT",
            "FINISH": END
        }
    )

    workflow.set_entry_point("Supervisor")
    return workflow.compile()


# Global graph instance
_compiled_graph = None

def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_agent_graph()
    return _compiled_graph


def run_agent_workflow(message: str, session_id: str) -> dict:
    """
    Executes the multi-agent graph with user prompt and session context.
    """
    graph = get_graph()
    inputs = {"messages": [HumanMessage(content=message)]}
    config = {"configurable": {"thread_id": session_id}}
    
    result = graph.invoke(inputs, config=config)
    last_msg = result["messages"][-1].content
    return {
        "response": last_msg,
        "agent_used": "Supervisor Routing"
    }
