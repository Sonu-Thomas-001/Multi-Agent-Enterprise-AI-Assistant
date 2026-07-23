"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, BookOpen, FileText, Bot, ShieldCheck, Sparkles } from "lucide-react";

export function DemoScreenshots() {
  const [activeTab, setActiveTab] = useState<"chat" | "dashboard" | "knowledge">("chat");

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Top Tab Switcher */}
      <div className="flex items-center justify-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "chat"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Multi-Agent Chat Console
        </button>

        <button
          onClick={() => setActiveTab("knowledge")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "knowledge"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Hybrid RAG Search
        </button>

        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "dashboard"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Enterprise Dashboard
        </button>
      </div>

      {/* Mockup Preview Body */}
      <div className="bg-slate-950 rounded-2xl p-6 border border-white/10 shadow-2xl min-h-[340px] flex flex-col justify-between">
        {activeTab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" /> Active Session: HR & Legal Compliance Query
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Parallel Execution Online
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-white/5 text-slate-300">
                <span className="text-indigo-400 font-bold">User:</span> What is our core remote working hours policy and employee expense limit?
              </div>

              <div className="glass-card p-4 rounded-xl border border-indigo-500/30 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-indigo-300 font-bold border-b border-white/10 pb-1">
                  <span>Supervisor Agent &rarr; Routed to Research &amp; Analytics Subagents</span>
                  <span>142ms</span>
                </div>
                <p className="text-xs leading-relaxed font-sans">
                  According to <strong className="text-indigo-300">Acme HR Policy #17 (Doc ID: DOC-1017)</strong>, core remote working hours are 9:00 AM to 5:00 PM EST. The max monthly expense limit for home office supplies is <strong className="text-emerald-400">$150.00</strong>.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    Cited: hr_policies/doc_17.md (Score: 94.2%)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "knowledge" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-white/10 text-xs">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-slate-200 font-mono">Query: "Microservices Docker deployment SOP"</span>
              <span className="ml-auto text-[10px] font-mono text-indigo-400">BM25 + Vector RRF</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="glass-card p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-white">
                  <span>Engineering SOP #12</span>
                  <span className="text-[10px] text-emerald-400">96.5% Match</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono line-clamp-2">"Docker containers must utilize multi-stage builds with minimal alpine base images..."</p>
              </div>

              <div className="glass-card p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold text-white">
                  <span>Architecture Spec #04</span>
                  <span className="text-[10px] text-indigo-400">92.0% Match</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono line-clamp-2">"Kubernetes pod deployment specifications and zero-downtime rolling update strategy..."</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-lg font-extrabold text-white">100</span>
                <p className="text-[10px] text-slate-400">Employees (SQL DB)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-lg font-extrabold text-indigo-400">50</span>
                <p className="text-[10px] text-slate-400">Projects Tracked</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-lg font-extrabold text-emerald-400">230</span>
                <p className="text-[10px] text-slate-400">RAG Documents</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs flex items-center justify-between font-mono text-slate-300">
              <span>9 Agents Online Telemetry</span>
              <span className="text-emerald-400">Graph Memory Active</span>
            </div>
          </motion.div>
        )}

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500">
          <span>Real-time Live Demonstration View</span>
          <span>FastAPI + LangGraph + Next.js 16</span>
        </div>
      </div>
    </div>
  );
}
