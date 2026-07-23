"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Terminal, FileCode, CheckCircle2, Cpu } from "lucide-react";

const AGENTS = [
  { id: "supervisor", name: "Supervisor Agent", role: "Graph Router", tools: ["graph_router", "merge_outputs"], prompt: "Directs enterprise requests to specialized subagents in parallel or sequential graph modes." },
  { id: "planner", name: "Planner Agent", role: "Task Decomposer", tools: ["task_breakdown"], prompt: "Decomposes complex requests into actionable sub-tasks with strict execution dependency ordering." },
  { id: "research", name: "Research Agent", role: "Hybrid RAG Search", tools: ["document_search", "knowledge_search"], prompt: "Executes BM25 keyword and dense vector similarity search across 230 enterprise documents." },
  { id: "document", name: "Document Agent", role: "Metadata Parser", tools: ["parse_enterprise_policy"], prompt: "Parses PDF, Markdown, CSV, and JSON documents with metadata awareness and citation highlights." },
  { id: "email", name: "Email Agent", role: "Communications", tools: ["send_email"], prompt: "Composes and dispatches internal enterprise emails and updates project stakeholders." },
  { id: "coding", name: "Coding Agent", role: "Python Interpreter", tools: ["python_interpreter", "calculator"], prompt: "Executes sandboxed Python calculations, data transformations, and math formulas safely." },
  { id: "analytics", name: "Analytics Agent", role: "SQL Data Telemetry", tools: ["sql_tool", "employee_search", "project_search", "csv_analysis"], prompt: "Queries SQLite enterprise.db (employees, projects, budgets) and executes CSV analytics." },
  { id: "report", name: "Report Generator", role: "PDF/JSON Synthesizer", tools: ["generate_pdf_report"], prompt: "Synthesizes multi-agent research into structured executive summaries and downloadable PDF files." },
  { id: "memory", name: "Memory Agent", role: "Context Buffer", tools: ["conversation_buffer_memory"], prompt: "Maintains session state and sliding-window conversation memory across multi-turn interactions." },
];

export function AgentsShowcase() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Agent List */}
        <div className="space-y-2 lg:col-span-1 max-h-[420px] overflow-y-auto pr-2">
          {AGENTS.map((agent) => {
            const isSelected = selectedAgent.id === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10 font-bold"
                    : "bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{agent.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{agent.role}</p>
                  </div>
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
              </button>
            );
          })}
        </div>

        {/* Right Inspector Box */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-indigo-500/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-indigo-300 font-mono">{selectedAgent.role}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> LangGraph Node Ready
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-400" /> System Prompt Instructions
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-white/10 text-xs font-mono text-slate-200 leading-relaxed">
                "{selectedAgent.prompt}"
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-400" /> Bound Pydantic Executable Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.tools.map((t) => (
                  <span key={t} className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 text-indigo-300 border border-indigo-500/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Structured Output: Pydantic v2 Schema</span>
            <span>Retry Logic: Exponential Backoff (3 attempts)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
