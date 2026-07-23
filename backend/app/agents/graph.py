import operator
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
import json
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from app.agents.worker_agents import llm, hr_agent, finance_agent, it_agent

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str

# Supervisor node to route requests
def supervisor_node(state: AgentState):
    system_prompt = (
        "You are a supervisor managing the following worker agents: HR, Finance, IT. "
        "Given the user's request, decide which agent should act next. "
        "If the user is asking about HR (policies, benefits, remote work), route to 'HR'. "
        "If the user is asking about Finance (budgets, expenses), route to 'Finance'. "
        "If the user is asking about IT (troubleshooting, VPN, passwords), route to 'IT'. "
        "If the request has been fully answered, or if it doesn't fit any category, output 'FINISH'. "
        "Your response MUST be valid JSON with a single key 'next' and the value being one of: 'HR', 'Finance', 'IT', 'FINISH'."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="messages"),
    ])
    
    # Force JSON output for the routing decision
    chain = prompt | llm.with_structured_output({"type": "object", "properties": {"next": {"type": "string", "enum": ["HR", "Finance", "IT", "FINISH"]}}})
    result = chain.invoke({"messages": state["messages"]})
    return {"next": result.get("next", "FINISH")}

def hr_node(state: AgentState):
    result = hr_agent.invoke({"messages": state["messages"]})
    return {"messages": result["messages"][-1]}

def finance_node(state: AgentState):
    result = finance_agent.invoke({"messages": state["messages"]})
    return {"messages": result["messages"][-1]}

def it_node(state: AgentState):
    result = it_agent.invoke({"messages": state["messages"]})
    return {"messages": result["messages"][-1]}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("Supervisor", supervisor_node)
workflow.add_node("HR", hr_node)
workflow.add_node("Finance", finance_node)
workflow.add_node("IT", it_node)

workflow.add_edge("HR", "Supervisor")
workflow.add_edge("Finance", "Supervisor")
workflow.add_edge("IT", "Supervisor")

# The supervisor decides who goes next
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
graph = workflow.compile()
