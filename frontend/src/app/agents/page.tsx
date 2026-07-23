"use client";

import { useState } from "react";
import {
  Bot,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  FileCode,
  CheckCircle2,
  Sliders,
} from "lucide-react";

const AGENT_CARDS = [
  { id: "supervisor", name: "Supervisor Agent", role: "Orchestrator & Graph Router", tools: ["graph_router", "merge_outputs"], prompt: "Directs incoming enterprise queries to appropriate specialized subagents, enabling parallel & sequential executions.", status: "Online" },
  { id: "planner", name: "Planner Agent", role: "Task Decomposer", tools: ["task_breakdown"], prompt: "Decomposes complex requests into actionable sequential sub-tasks with strict execution ordering.", status: "Online" },
  { id: "research", name: "Research Agent", role: "Hybrid RAG Search", tools: ["document_search", "knowledge_search"], prompt: "Executes BM25 keyword and dense vector similarity search across 230 enterprise documents.", status: "Online" },
  { id: "document", name: "Document Agent", role: "Document Parser", tools: ["parse_enterprise_policy"], prompt: "Parses PDF, Markdown, CSV, and JSON documents with metadata awareness and citation highlights.", status: "Online" },
  { id: "email", name: "Email Agent", role: "Communications Dispatcher", tools: ["send_email"], prompt: "Composes and dispatches internal enterprise emails and updates project stakeholders.", status: "Online" },
  { id: "coding", name: "Coding Agent", role: "Python Code Interpreter", tools: ["python_interpreter", "calculator"], prompt: "Executes sandboxed Python calculations, data transformations, and math formulas safely.", status: "Online" },
  { id: "analytics", name: "Analytics Agent", role: "Relational SQL Data Telemetry", tools: ["sql_tool", "employee_search", "project_search", "csv_analysis"], prompt: "Queries SQLite enterprise.db (employees, projects, budgets) and executes CSV analytics.", status: "Online" },
  { id: "report", name: "Report Generator", role: "Executive PDF & JSON Synthesizer", tools: ["generate_pdf_report"], prompt: "Synthesizes multi-agent research into structured executive summaries and downloadable PDF files.", status: "Online" },
  { id: "memory", name: "Memory Agent", role: "Session Context Manager", tools: ["conversation_buffer_memory"], prompt: "Maintains session state and sliding-window conversation memory across multi-turn interactions.", status: "Online" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(AGENT_CARDS[0]);

  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Enterprise Agent Hub & System Inspector <Bot className="w-5 h-5 text-indigo-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">9 Autonomous Agents configured with system prompts, structured outputs, and retry logic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Cards List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AGENT_CARDS.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`glass-card p-5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? "border-indigo-500/50 bg-indigo-600/10 shadow-xl shadow-indigo-500/10"
                    : "border-white/10 hover:border-indigo-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                      <p className="text-[10px] text-slate-400">{agent.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {agent.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {agent.prompt}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
                  {agent.tools.map((t) => (
                    <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-indigo-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Inspector */}
        <div className="glass-card p-6 rounded-2xl h-fit border border-indigo-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" /> {selectedAgent.name}
              </h3>
              <p className="text-[11px] text-slate-400">{selectedAgent.role}</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              LangGraph Node
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-purple-400" /> System Prompt Specification
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-300 leading-relaxed">
              "{selectedAgent.prompt}"
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Associated Tools & Capabilities
            </h4>
            <div className="space-y-2">
              {selectedAgent.tools.map((tool) => (
                <div key={tool} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                  <span className="font-mono text-indigo-300">{tool}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Pydantic v2 Output</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
