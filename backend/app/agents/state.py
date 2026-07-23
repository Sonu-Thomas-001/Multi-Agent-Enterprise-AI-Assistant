import operator
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """
    Typed dictionary representing the shared state across the LangGraph multi-agent network.
    """
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str
