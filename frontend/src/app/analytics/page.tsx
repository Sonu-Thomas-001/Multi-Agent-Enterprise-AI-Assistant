"use client";

import {
  BarChart3,
  TrendingUp,
  Cpu,
  Zap,
  Clock,
  DollarSign,
  Activity,
  Layers,
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Enterprise Analytics & Performance <BarChart3 className="w-5 h-5 text-indigo-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">Multi-agent execution metrics, token utilization, RAG search latency, and enterprise ROI.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Graph Invocations</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">1,482</h3>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">↑ 18.4% this week</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Avg RAG Latency</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">142 ms</h3>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">BM25 + Vector RRF</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Tool Execution Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">99.8%</h3>
          <p className="text-[10px] text-indigo-400 mt-1 font-semibold">Pydantic v2 Type Safe</p>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Enterprise ROI Saved</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">$42,850</h3>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">Automated Research</p>
        </div>
      </div>

      {/* Main Grid: Tool Utilization & Agent Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Tool Invocation Distribution
          </h2>

          <div className="space-y-3 pt-2">
            {[
              { name: "document_search (RAG)", count: "542 calls", share: 82 },
              { name: "sql_tool (Relational DB)", count: "318 calls", share: 64 },
              { name: "python_interpreter", count: "210 calls", share: 48 },
              { name: "send_email (Dispatcher)", count: "145 calls", share: 32 },
              { name: "calculator", count: "98 calls", share: 22 },
            ].map((tool, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-200">{tool.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{tool.count}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                    style={{ width: `${tool.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> Agent Response Latency Breakdown
          </h2>

          <div className="space-y-3 pt-2">
            {[
              { name: "Supervisor Agent", time: "18 ms", status: "Optimal" },
              { name: "Research Agent (Hybrid RAG)", time: "142 ms", status: "Optimal" },
              { name: "Analytics Agent (SQL DB)", time: "38 ms", status: "Optimal" },
              { name: "Coding Agent (Python Exec)", time: "85 ms", status: "Optimal" },
              { name: "Report Generator (PDF)", time: "210 ms", status: "Optimal" },
            ].map((agent, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{agent.name}</h4>
                  <span className="text-[10px] text-emerald-400">{agent.status}</span>
                </div>
                <span className="text-xs font-mono text-indigo-300 font-bold">{agent.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
