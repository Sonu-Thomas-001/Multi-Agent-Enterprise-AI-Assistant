const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface AgentSchema {
  id: string;
  name: string;
  role: string;
  description: string;
  system_prompt: string;
  tools: string[];
}

export interface ChatInvokePayload {
  message: string;
  session_id?: string;
  agent_id?: string;
}

export interface CitationHighlight {
  source_file: string;
  title: string;
  category: string;
  domain: string;
  page_or_section: string;
  score: number;
  snippet: string;
}

export interface RAGSearchResponse {
  query: string;
  total_results: number;
  citations: CitationHighlight[];
}

class ApiClient {
  async fetchHealth(): Promise<{ status: string; service: string }> {
    try {
      const res = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
      return await res.json();
    } catch {
      return { status: "offline", service: "Multi-Agent Enterprise Backend" };
    }
  }

  async fetchAgents(): Promise<AgentSchema[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/agents`);
      const data = await res.json();
      return data.agents || [];
    } catch {
      return [];
    }
  }

  async searchRAG(query: string, domain?: string, top_k = 4): Promise<RAGSearchResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/rag/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, domain, top_k }),
      });
      return await res.json();
    } catch {
      return { query, total_results: 0, citations: [] };
    }
  }

  async invokeChat(payload: ChatInvokePayload): Promise<{
    session_id: string;
    agent_used: string;
    response: string;
    thought_trace: string[];
    citations: CitationHighlight[];
  }> {
    try {
      const res = await fetch(`${API_BASE_URL}/chat/invoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      return {
        session_id: payload.session_id || "demo-session",
        agent_used: payload.agent_id || "Supervisor Agent",
        response: `Enterprise Assistant Demo Mode: Unable to connect to FastAPI backend (${err}). Local fallback response provided.`,
        thought_trace: [
          "1. Received user message",
          "2. Evaluated fallback offline mode",
          "3. Processed mock multi-agent response"
        ],
        citations: [
          {
            source_file: "hr_policies/doc_1.md",
            title: "HR Policy #1: Remote Work Guidelines",
            category: "hr_policies",
            domain: "HR",
            page_or_section: "Section 2",
            score: 0.94,
            snippet: "Employees eligible for remote work must maintain core working hours from 9 AM to 5 PM EST."
          }
        ]
      };
    }
  }
}

export const api = new ApiClient();
