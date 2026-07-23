"use client";

import Link from "next/link";
import {
  Users,
  Briefcase,
  FileText,
  Bot,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white p-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Acme Digital Control Center <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time telemetry and multi-agent coordination system.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Start Neural Chat
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Employees</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">100</h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Indexed in SQLite DB
          </p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Active Projects</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">50</h3>
          <p className="text-[11px] text-indigo-400 flex items-center gap-1 mt-1 font-medium">
            <Zap className="w-3 h-3" /> 12 High Priority
          </p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Knowledge Documents</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">230</h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <ShieldCheck className="w-3 h-3" /> ChromaDB Vector Collection
          </p>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Active Agents</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white">9 / 9</h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <Zap className="w-3 h-3" /> LangGraph Connected
          </p>
        </div>
      </div>

      {/* Main Grid: Activity Feed & Agent Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent RAG Ingestion & Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Recent RAG Ingestion Feed
              </h2>
              <Link href="/documents" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                View All 230 Docs <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { title: "HR Policy #17: Remote Work Guidelines", category: "HR Policy", date: "2026-05-09", score: "94.2% RRF" },
                { title: "Engineering SOP #12: Microservices Deployment", category: "Engineering SOP", date: "2026-06-14", score: "91.8% RRF" },
                { title: "Incident Post-Mortem #08: Database Failover", category: "Incident Report", date: "2026-04-20", score: "89.5% RRF" },
                { title: "Architecture Spec: Multi-Agent Parallel Graph", category: "Architecture", date: "2026-07-01", score: "96.0% RRF" },
              ].map((doc, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.category} • Ingested {doc.date}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {doc.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Agent Load Status */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" /> Agent Workload Telemetry
            </h2>

            <div className="space-y-4">
              {[
                { name: "Supervisor Agent", role: "Graph Routing", load: 88, status: "Active" },
                { name: "Research Agent", role: "RAG BM25 Retrieval", load: 76, status: "Active" },
                { name: "Coding Agent", role: "Python Execution", load: 64, status: "Standby" },
                { name: "Analytics Agent", role: "SQL Telemetry", load: 92, status: "Active" },
              ].map((agent, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{agent.name}</span>
                    <span className="text-[10px] font-mono text-indigo-300">{agent.load}% Load</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${agent.load}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
