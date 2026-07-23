from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

class EnterpriseConversationMemory:
    """
    Session-based conversation memory manager with context compression.
    """
    def __init__(self, window_size: int = 5) -> None:
        self.window_size = window_size
        self._history: dict[str, list[BaseMessage]] = {}

    def add_message(self, session_id: str, message: BaseMessage) -> None:
        if session_id not in self._history:
            self._history[session_id] = []
        self._history[session_id].append(message)
        # Apply sliding window
        if len(self._history[session_id]) > self.window_size * 2:
            self._history[session_id] = self._history[session_id][-self.window_size * 2:]

    def get_context_buffer(self, session_id: str) -> str:
        messages = self._history.get(session_id, [])
        if not messages:
            return "No previous conversation context."
        
        lines = []
        for msg in messages:
            role = "User" if isinstance(msg, HumanMessage) else "Assistant"
            lines.append(f"{role}: {msg.content}")
        return "\n".join(lines)
