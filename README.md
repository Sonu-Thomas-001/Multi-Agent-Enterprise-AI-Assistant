<div align="center">

# 🚀 Multi-Agent Enterprise AI Assistant

### Autonomous Multi-Agent Orchestration Platform for Enterprise Intelligence

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://github.com/langchain-ai/langgraph)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6F00?style=for-the-badge)](https://www.trychroma.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Orchestrate 9 specialized AI agents** in parallel and sequential graph workflows. Powered by FastAPI, LangGraph state machines, ChromaDB Hybrid RAG with BM25 Reciprocal Rank Fusion, and 10 executable Pydantic-typed tools.

[Explore Dashboard](#-frontend-pages) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [API Docs](#-api-endpoints)

</div>

---

## ✨ Key Features

| Feature | Description |
|:--------|:------------|
| 🤖 **9 Autonomous Agents** | Supervisor, Planner, Research, Document, Email, Coding, Analytics, Report Generator, Memory |
| 🔀 **LangGraph State Machine** | Conditional parallel/sequential routing with deterministic execution graphs |
| 🔍 **Hybrid RAG Pipeline** | BM25 sparse keyword + ChromaDB dense vector search with Reciprocal Rank Fusion (RRF, k=60) |
| 🛠️ **10 Typed Tools** | Calculator, Document Search, Employee Search, SQL Tool, Python Interpreter, CSV Analysis, and more |
| 📄 **230 Enterprise Documents** | HR Policies, SOPs, Incident Reports, Architecture Specs, Financial Reports, Meeting Notes |
| 🗄️ **Synthetic Enterprise DB** | SQLite with 100 employees, 50 projects, departments, and financial records |
| 🎨 **Apple-Grade UI** | Next.js 16 with glassmorphism, Framer Motion animations, and dark theme |
| 📊 **Real-Time Analytics** | Agent monitoring, execution timelines, tool call inspection, and ROI tracking |
| 🔒 **Air-Gapped Ready** | 100% local deployment with HuggingFace embeddings and Ollama LLM support |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 Frontend                         │
│  Landing · Dashboard · Chat · Knowledge · Docs · Agents · Analytics │
├─────────────────────────────────────────────────────────────────────┤
│                     FastAPI REST API (Port 8000)                    │
│              /api/v1/chat · /api/v1/agents · /api/v1/rag           │
├──────────────────┬──────────────────┬───────────────────────────────┤
│  LangGraph Engine │   RAG Pipeline   │    Tool Execution Layer       │
│  ┌─────────────┐ │ ┌──────────────┐ │ ┌───────────────────────────┐ │
│  │ Supervisor   │ │ │ BM25 Keyword │ │ │ document_search           │ │
│  │ Planner      │ │ │ Vector Dense │ │ │ sql_tool (read-only)      │ │
│  │ Research     │ │ │ RRF Fusion   │ │ │ python_interpreter        │ │
│  │ Document     │ │ │ ChromaDB     │ │ │ employee_search           │ │
│  │ Email        │ │ │ Embeddings   │ │ │ csv_analysis              │ │
│  │ Coding       │ │ └──────────────┘ │ │ send_email                │ │
│  │ Analytics    │ │                  │ │ calculator                │ │
│  │ Report Gen   │ │                  │ │ knowledge_search          │ │
│  │ Memory       │ │                  │ │ weather_tool              │ │
│  └─────────────┘ │                  │ └───────────────────────────┘ │
├──────────────────┴──────────────────┴───────────────────────────────┤
│              SQLite DB           │           ChromaDB               │
│   100 employees · 50 projects    │    230 enterprise documents      │
└──────────────────────────────────┴──────────────────────────────────┘
```

### Data Flow

```
User Query → Supervisor Agent → Planner (Task Decomposition)
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
              Research Agent   Analytics Agent  Document Agent
              (Hybrid RAG)    (SQL Queries)    (PDF Parsing)
                    ↓               ↓               ↓
                    └───────────────┼───────────────┘
                                    ↓
                          Report Generator → Cited Response
```

---

## 📁 Project Structure

```
Multi-Agent-Enterprise-AI-Assistant/
├── backend/                          # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py                   # FastAPI application entry point
│   │   ├── settings.py               # Pydantic Settings (env vars)
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── chat.py           # POST /api/v1/chat/invoke
│   │   │       ├── agents.py         # GET  /api/v1/agents
│   │   │       └── rag.py            # POST /api/v1/rag/search
│   │   ├── agents/                   # LangGraph Agent Definitions
│   │   │   ├── supervisor.py         # Graph Router Agent
│   │   │   ├── planner.py            # Task Decomposition Agent
│   │   │   ├── research.py           # Hybrid RAG Search Agent
│   │   │   ├── document.py           # Document Parser Agent
│   │   │   ├── email_agent.py        # Email Composition Agent
│   │   │   ├── coding.py             # Python Interpreter Agent
│   │   │   ├── analytics.py          # SQL Analytics Agent
│   │   │   ├── report_generator.py   # Executive Report Agent
│   │   │   └── memory.py             # Conversation Memory Agent
│   │   ├── services/
│   │   │   ├── llm_service.py        # LLM Provider Factory
│   │   │   ├── vector_service.py     # ChromaDB Vector Store
│   │   │   └── database_service.py   # SQLite Query Engine
│   │   ├── rag/
│   │   │   ├── pipeline.py           # Hybrid RAG Pipeline
│   │   │   ├── loaders.py            # Universal Document Loader
│   │   │   ├── chunker.py            # Recursive Text Splitter
│   │   │   └── retriever.py          # BM25 + Vector RRF Retriever
│   │   ├── tools/                    # 10 Pydantic-Typed Tools
│   │   ├── prompts/                  # System Prompt Templates
│   │   ├── models/                   # Pydantic Data Models
│   │   ├── schemas/                  # API Request/Response Schemas
│   │   └── utils/                    # Logging, Helpers
│   └── data/                         # Synthetic Enterprise Data
│       ├── documents/                # 230 MD/PDF/CSV/JSON files
│       ├── sql/                      # SQLite schema & seed data
│       └── generate_enterprise_data.py
│
├── frontend/                         # Next.js 16 TypeScript Frontend
│   ├── src/
│   │   ├── app/                      # App Router Pages
│   │   │   ├── page.tsx              # World-Class Landing Page (10 sections)
│   │   │   ├── layout.tsx            # Root Layout (Inter font, Toast, SEO)
│   │   │   ├── globals.css           # Design System (Glass, Animations)
│   │   │   ├── dashboard/page.tsx    # Control Dashboard
│   │   │   ├── chat/page.tsx         # Enterprise AI Chat
│   │   │   ├── knowledge/page.tsx    # RAG Knowledge Search
│   │   │   ├── documents/page.tsx    # Document Library
│   │   │   ├── agents/page.tsx       # Agent Monitoring Dashboard
│   │   │   ├── analytics/page.tsx    # Analytics Dashboard
│   │   │   └── settings/page.tsx     # System Settings
│   │   ├── components/
│   │   │   ├── layout/               # Sidebar, Header
│   │   │   ├── landing/              # HeroGraph, AgentsShowcase, FAQ, etc.
│   │   │   ├── chat/                 # MarkdownRenderer, TypingAnimation
│   │   │   └── ui/                   # Skeleton, Toast, EmptyState, ErrorBoundary
│   │   ├── lib/                      # API Client, Utilities
│   │   ├── store/                    # Zustand Global State
│   │   └── hooks/                    # Custom React Hooks
│   └── package.json
│
├── data/                             # Generated Enterprise Documents
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+** with `uv` package manager
- **Node.js 18+** with `npm`
- **Git**

### 1. Clone & Setup Backend

```bash
git clone https://github.com/Sonu-Thomas-001/Multi-Agent-Enterprise-AI-Assistant.git
cd Multi-Agent-Enterprise-AI-Assistant

# Backend setup
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1          # Windows
# source venv/bin/activate           # macOS/Linux

pip install -r requirements.txt

# Generate synthetic enterprise data
python data/generate_enterprise_data.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

### 2. Setup Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev                          # http://localhost:3000
```

### 3. Environment Variables

Create `backend/.env`:
```env
GEMINI_API_KEY=your-api-key-here
LLM_PROVIDER=gemini               # gemini | openai | ollama
LLM_MODEL=gemini-2.5-flash
EMBEDDING_MODEL=all-MiniLM-L6-v2  # Local zero-cost embeddings
CHROMA_PERSIST_DIR=./chroma_db
DATABASE_URL=sqlite:///./data/sql/enterprise.db
LOG_LEVEL=INFO
CORS_ORIGINS=http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `GET` | `/health` | System health check |
| `GET` | `/api/v1/agents` | List all 9 registered agents |
| `POST` | `/api/v1/chat/invoke` | Invoke multi-agent chat orchestration |
| `POST` | `/api/v1/rag/search` | Hybrid RAG document search |

### Chat Invoke Request

```json
{
  "message": "What is our remote work policy?",
  "session_id": "session-001",
  "agent_id": "Supervisor Agent"
}
```

### Chat Invoke Response

```json
{
  "session_id": "session-001",
  "agent_used": "Research Agent",
  "response": "According to HR Policy #17...",
  "thought_trace": [
    "1. Supervisor: Routing to Research Agent (RAG)",
    "2. Research: BM25 + Vector RRF search executed",
    "3. Document: Parsed hr_policies/doc_17.md"
  ],
  "citations": [
    {
      "source_file": "hr_policies/doc_17.md",
      "title": "HR Policy #17: Remote Work Guidelines",
      "category": "hr_policies",
      "domain": "HR",
      "page_or_section": "Section 2",
      "score": 0.94,
      "snippet": "Core working hours are 9:00 AM to 5:00 PM EST."
    }
  ]
}
```

---

## 🎨 Frontend Pages

| Page | Route | Features |
|:-----|:------|:---------|
| **Landing** | `/` | 10-section hero with interactive agent graph, features, AI agents showcase, architecture diagram, FAQ |
| **Dashboard** | `/dashboard` | KPI cards, agent workload bars, recent document ingestion feed |
| **Chat** | `/chat` | Markdown rendering, code highlighting, file upload, agent status, citations, copy/regenerate |
| **Knowledge** | `/knowledge` | Hybrid BM25 + Vector search with domain category filters |
| **Documents** | `/documents` | 230 enterprise documents with format badges and viewer |
| **Agents** | `/agents` | Workflow graph, execution timeline, tool calls, reasoning steps, animated charts |
| **Analytics** | `/analytics` | Request volume, latency distribution, agent/tool usage, top prompts, sparklines |
| **Settings** | `/settings` | LLM provider switcher, API keys, ChromaDB Top-K slider |

---

## 🤖 Agent Specifications

| Agent | Role | Tools | Description |
|:------|:-----|:------|:------------|
| **Supervisor** | Graph Router | `graph_router` | Routes requests to subagents in parallel or sequential mode |
| **Planner** | Task Decomposer | `task_breakdown` | Decomposes complex queries into ordered sub-tasks |
| **Research** | Hybrid RAG | `document_search`, `knowledge_search` | BM25 + Vector RRF across 230 enterprise documents |
| **Document** | Metadata Parser | `parse_policy` | Parses PDF, MD, CSV, JSON with section awareness |
| **Email** | Communications | `send_email` | Composes and dispatches enterprise emails |
| **Coding** | Python Executor | `python_interpreter`, `calculator` | Sandboxed code execution with stdout capture |
| **Analytics** | SQL Telemetry | `sql_tool`, `employee_search`, `csv_analysis` | Read-only SQL queries on enterprise.db |
| **Report Gen** | PDF Synthesizer | `generate_report` | Executive summaries with citations |
| **Memory** | Context Buffer | `conversation_memory` | Sliding-window session state management |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | Next.js 16, TypeScript 5, Tailwind CSS v4 | App Router, Turbopack, glassmorphism design |
| **Animations** | Framer Motion | Scroll effects, page transitions, accordion |
| **State** | Zustand | Global client state management |
| **Backend** | FastAPI, Python 3.12, Pydantic v2 | Async API with typed validation |
| **Agents** | LangGraph, LangChain | Stateful multi-agent graph workflows |
| **Vector DB** | ChromaDB | Persistent vector embeddings store |
| **Embeddings** | Sentence-Transformers (all-MiniLM-L6-v2) | Local zero-cost embedding generation |
| **Database** | SQLite | Relational enterprise data storage |
| **LLM** | Google Gemini 2.5 Flash | Default language model provider |

---

## 📊 Enterprise Data

The platform ships with realistic synthetic data for **Acme Digital Solutions**:

- **100 Employees** across 8 departments (Engineering, Product, HR, Finance, Legal, IT, QA, Management)
- **50 Active Projects** with budgets, timelines, and team allocations
- **230 Documents**: HR Policies, Engineering SOPs, Incident Reports, Architecture Specs, Financial Reports, Meeting Notes, Email Conversations, Support Tickets, Change Requests, Knowledge Base Articles, Product Roadmaps

---

## 📝 License

This project is for educational and demonstration purposes.

---

<div align="center">

**Built with ❤️ by [Sonu Thomas](https://github.com/Sonu-Thomas-001)**

FastAPI · LangGraph · Next.js 16 · ChromaDB · Pydantic v2

</div>
