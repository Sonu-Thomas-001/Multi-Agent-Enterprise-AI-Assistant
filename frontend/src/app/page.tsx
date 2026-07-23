"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Background Gradient Glowing Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Floating Glass Bar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass-card rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <span className="font-bold text-sm tracking-wide">Acme Digital Solutions</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#security" className="hover:text-white transition-colors">Enterprise Security</a>
          <a href="#agents" className="hover:text-white transition-colors">9 Agents</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-1.5"
          >
            Launch Assistant <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6 shadow-sm backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Next-Gen Enterprise Multi-Agent Graph Architecture
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
            Autonomous Multi-Agent AI Platform for <br />
            <span className="gradient-text">Enterprise Intelligence</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Orchestrate 9 specialized AI agents in parallel and sequential workflows. Powered by LangGraph, FastAPI, ChromaDB RAG, and BM25 Reciprocal Rank Fusion.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:opacity-95 text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              Explore Control Dashboard <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/chat"
              className="px-6 py-3.5 rounded-2xl text-sm font-semibold glass-card hover:bg-slate-800/80 text-slate-200 border border-white/10 transition-all hover:scale-105 flex items-center gap-2"
            >
              Try Neural Chat <Bot className="w-4 h-4 text-indigo-400" />
            </Link>
          </div>
        </motion.div>

        {/* Floating Interactive 3D Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl max-w-4xl mx-auto text-left relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">LangGraph Multi-Agent State Flow</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live RRF Search Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> Supervisor Agent
              </div>
              <p className="text-[11px] text-slate-400">Routes task in parallel to Research & Analytics agents.</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
              <div className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Hybrid RAG Engine
              </div>
              <p className="text-[11px] text-slate-300">BM25 + Vector similarity RRF scoring 230 docs.</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-white/10">
              <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Report Generator
              </div>
              <p className="text-[11px] text-slate-400">Synthesizes structured PDF & Executive JSON report.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Metrics Banner */}
      <section className="py-12 border-y border-white/10 bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-1">9</h3>
            <p className="text-xs text-slate-400">Specialized Agents</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-indigo-400 mb-1">230</h3>
            <p className="text-xs text-slate-400">RAG Documents Index</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-purple-400 mb-1">150+</h3>
            <p className="text-xs text-slate-400">Synthetic Database Records</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-emerald-400 mb-1">10</h3>
            <p className="text-xs text-slate-400">Executable LangChain Tools</p>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Capabilities Built Without Shortcuts</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Modular FastAPI backend, stateful LangGraph workflows, and strict Pydantic typed tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card glass-card-hover p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">9 Autonomous Agents</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Supervisor, Planner, Research, Document, Email, Coding, Analytics, Report, and Memory agents collaborating seamlessly.</p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Hybrid BM25 + Vector RAG</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Reciprocal Rank Fusion (RRF) algorithm indexing PDF, Markdown, CSV, and JSON documents with exact source citations.</p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Enterprise Security & DB</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Synthetic SQLite relational database with 100 employees, 50 projects, and read-only SQL evaluation tool protection.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-xs text-slate-500">
        <p>© 2026 Acme Digital Solutions. All Rights Reserved. Multi-Agent Enterprise Assistant System.</p>
      </footer>
    </div>
  );
}
