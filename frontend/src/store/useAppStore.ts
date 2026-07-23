import { create } from "zustand";
import { CitationHighlight } from "@/lib/api";

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  agentName?: string;
  content: string;
  timestamp: string;
  thoughtTrace?: string[];
  citations?: CitationHighlight[];
}

interface AppState {
  selectedAgent: string;
  setSelectedAgent: (agent: string) => void;
  activeSessionId: string;
  setActiveSessionId: (id: string) => void;
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  selectedCitation: CitationHighlight | null;
  setSelectedCitation: (citation: CitationHighlight | null) => void;
  activeSearchQuery: string;
  setActiveSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedAgent: "Supervisor Agent",
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  activeSessionId: "session-enterprise-001",
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  messages: [
    {
      id: "msg-1",
      sender: "agent",
      agentName: "Supervisor Agent",
      content: "Welcome to Acme Digital Solutions Enterprise AI Assistant. How can I coordinate our 9 specialized agents (Research, Finance, Coding, HR, Legal, Analytics) for you today?",
      timestamp: "10:00 AM",
      thoughtTrace: [
        "Supervisor Agent initialized graph execution",
        "Memory agent loaded session context",
        "Ready to route user requests in parallel or sequential mode"
      ]
    }
  ],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  selectedCitation: null,
  setSelectedCitation: (citation) => set({ selectedCitation: citation }),
  activeSearchQuery: "",
  setActiveSearchQuery: (query) => set({ activeSearchQuery: query }),
}));
