import operator
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage

def reduce_list(current: list, new: list) -> list:
    """Reducer that appends new items to an existing list state."""
    return current + new

class AgentState(TypedDict):
    """
    LangGraph Shared State across all 9 enterprise agents.
    Uses explicit reducers for safe parallel execution state merging.
    """
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str
    execution_type: str  # 'sequential', 'parallel', 'finish'
    parallel_agents: list[str]
    agent_outputs: Annotated[list[dict], reduce_list]
    task_plan: list[str]
    session_memory: dict
    retry_count: int
