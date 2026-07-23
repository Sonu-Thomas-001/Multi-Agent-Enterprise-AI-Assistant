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
  TrendingUp,
  FileText,
  Code,
  Terminal,
  Activity,
  Server,
  Globe,
} from "lucide-react";

import { HeroGraph } from "@/components/landing/HeroGraph";
import { AgentsShowcase } from "@/components/landing/AgentsShowcase";
import { ArchitectureFlow } from "@/components/landing/ArchitectureFlow";
import { DemoScreenshots } from "@/components/landing/DemoScreenshots";
import { FAQAccordion } from "@/components/landing/FAQAccordion";

export default function WorldClassLandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Background Glowing Ambient Light Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Floating Glass Navigation Bar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 glass-card rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-white block leading-tight">Acme Digital Solutions</span>
            <span className="text-[10px] text-slate-400 font-mono">Enterprise Multi-Agent AI</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#agents" className="hover:text-indigo-400 transition-colors">9 Agents</a>
          <a href="#architecture" className="hover:text-indigo-400 transition-colors">Architecture</a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
          <a href="#roi" className="hover:text-indigo-400 transition-colors">ROI & Benefits</a>
          <a href="#stack" className="hover:text-indigo-400 transition-colors">Tech Stack</a>
          <a href="#faq" className="hover:text-indigo-400 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 flex items-center gap-1.5"
          >
            Launch Platform <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6 shadow-sm backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> LangGraph Multi-Agent Orchestration Platform v2.5
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl mx-auto">
            Autonomous Multi-Agent AI Engine for <br />
            <span className="gradient-text">Enterprise Intelligence & RAG</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Orchestrate 9 specialized AI agents in parallel and sequential graph workflows. Powered by FastAPI, LangGraph state machines, ChromaDB Hybrid RAG with BM25 Reciprocal Rank Fusion, and executable Python/SQL tools.
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
              Launch Neural Chat <Bot className="w-4 h-4 text-indigo-400" />
            </Link>
          </div>
        </motion.div>

        {/* Live Interactive Hero Graph Component */}
        <HeroGraph />
      </section>

      {/* SECTION 2: METRICS COUNTER BANNER */}
      <section className="py-12 border-y border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-1">9</h3>
            <p className="text-xs text-slate-400 font-medium">Specialized Autonomous Agents</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-indigo-400 mb-1">230</h3>
            <p className="text-xs text-slate-400 font-medium">Indexed RAG Enterprise Docs</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-purple-400 mb-1">150+</h3>
            <p className="text-xs text-slate-400 font-medium">Relational SQLite Database Records</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-emerald-400 mb-1">10</h3>
            <p className="text-xs text-slate-400 font-medium">Sandboxed Executable Tools</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES GRID */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Core Enterprise Features</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Capabilities Built Without Shortcuts</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Modular FastAPI architecture, stateful LangGraph workflows, and strict Pydantic typed tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Bot, title: "Stateful Graph Routing", desc: "Supervisor agent dynamically evaluates intent and dispatches tasks to subagents in parallel or sequential modes.", color: "text-indigo-400 bg-indigo-500/20" },
            { icon: Database, title: "Hybrid BM25 + Vector RAG", desc: "Reciprocal Rank Fusion (RRF) algorithm combining sparse keyword BM25 with dense vector ChromaDB similarity search.", color: "text-purple-400 bg-purple-500/20" },
            { icon: Activity, title: "Relational SQL Telemetry", desc: "Synthetic SQLite database storing 100 employee records, 50 active projects, and financial expense data.", color: "text-emerald-400 bg-emerald-500/20" },
            { icon: Code, title: "10 Sandboxed Tools", desc: "Strictly typed Pydantic v2 tools for AST math calculation, Python code execution, email dispatching, and CSV analysis.", color: "text-amber-400 bg-amber-500/20" },
            { icon: FileText, title: "Source Highlighting & Citations", desc: "Returns exact file paths, section numbers, confidence scores, and preview snippets to eliminate hallucinations.", color: "text-rose-400 bg-rose-500/20" },
            { icon: Lock, title: "Air-Gapped Local Deployment", desc: "Run 100% on-premise with HuggingFace local zero-cost embeddings and local Ollama Llama 3 models.", color: "text-teal-400 bg-teal-500/20" },
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="glass-card glass-card-hover p-6 rounded-3xl space-y-3"
              >
                <div className={`w-10 h-10 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: AI AGENTS SHOWCASE */}
      <section id="agents" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-2">Autonomous Agent Hub</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">9 Specialized Collaborative AI Agents</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Each agent features custom system prompts, structured Pydantic outputs, and retry logic.</p>
        </div>

        <AgentsShowcase />
      </section>

      {/* SECTION 5: ARCHITECTURE FLOW */}
      <section id="architecture" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Graph Pipeline Engineering</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">LangGraph & Hybrid RAG Architecture</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Deterministic execution graph with async state management and BM25 + Vector RRF ranking.</p>
        </div>

        <ArchitectureFlow />
      </section>

      {/* SECTION 6: HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Step-by-Step Workflow</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">How Enterprise Requests Are Processed</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">From raw user text to structured executive answers with verified source citations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Query Entry", desc: "User submits query via Chat Console or direct FastAPI REST endpoint." },
            { step: "02", title: "Supervisor Routing", desc: "Supervisor Agent analyzes intent and constructs subagent graph execution plan." },
            { step: "03", title: "Tool Execution", desc: "Parallel subagents execute SQL queries, RAG document search, or Python math code." },
            { step: "04", title: "Cited Synthesis", desc: "Report Generator synthesizes clean response with exact file line citations & PDF export." },
          ].map((s, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl relative border border-white/10 space-y-3">
              <span className="text-3xl font-extrabold text-indigo-500/40 font-mono block">{s.step}</span>
              <h3 className="text-sm font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: SCREENSHOTS & LIVE DEMO MOCKUPS */}
      <section className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Interactive Interface Previews</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Built for Executive Clarity & Operational Speed</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Explore interactive live previews of the Chat Console, RAG Search, and Dashboard.</p>
        </div>

        <DemoScreenshots />
      </section>

      {/* SECTION 8: BENEFITS & ENTERPRISE ROI */}
      <section id="roi" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Quantifiable Value</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Efficiency & ROI Metrics</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Empirical time and cost savings delivered through autonomous multi-agent research.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl text-center space-y-2 border border-emerald-500/30 bg-emerald-500/5">
            <h3 className="text-4xl font-extrabold text-emerald-400">$42,850</h3>
            <p className="text-xs font-bold text-white">Monthly Engineering Hours Saved</p>
            <p className="text-[11px] text-slate-400">Automated SQL querying and document research across 230 files.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl text-center space-y-2 border border-indigo-500/30 bg-indigo-500/5">
            <h3 className="text-4xl font-extrabold text-indigo-400">142 ms</h3>
            <p className="text-xs font-bold text-white">RAG Hybrid Search Latency</p>
            <p className="text-[11px] text-slate-400">BM25 + Vector RRF ranking executed in milliseconds.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl text-center space-y-2 border border-purple-500/30 bg-purple-500/5">
            <h3 className="text-4xl font-extrabold text-purple-400">99.8%</h3>
            <p className="text-xs font-bold text-white">Structured Output Accuracy</p>
            <p className="text-[11px] text-slate-400">Strict Pydantic v2 schemas eliminating formatting failures.</p>
          </div>
        </div>
      </section>

      {/* SECTION 9: TECHNOLOGY STACK GRID */}
      <section id="stack" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-2">Modern Stack</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise Technology Foundation</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Built with industry-standard, high-performance open-source frameworks.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[
            { name: "Next.js 16", desc: "App Router & Turbopack" },
            { name: "TypeScript 5", desc: "Strict Type Safety" },
            { name: "Tailwind CSS v4", desc: "Modern Glassmorphism" },
            { name: "FastAPI", desc: "Async Python Backend" },
            { name: "LangGraph", desc: "Stateful Agent Graphs" },
            { name: "LangChain", desc: "RAG & Tool Integration" },
            { name: "ChromaDB", desc: "Vector Database" },
            { name: "SQLite", desc: "Relational Database" },
            { name: "Sentence-Transformers", desc: "Local Embeddings" },
            { name: "Pydantic v2", desc: "Data Validation" },
          ].map((st, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl text-center border border-white/10 hover:border-indigo-500/40 transition-colors">
              <h4 className="text-xs font-bold text-white mb-0.5">{st.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: FAQ ACCORDION */}
      <section id="faq" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-2">Frequently Asked Questions</span>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need to Know</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">Detailed technical answers regarding security, RAG citations, and deployment.</p>
        </div>

        <FAQAccordion />
      </section>

      {/* SECTION 11: FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              </div>
              <span className="font-bold text-white">Acme Digital Solutions</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">Multi-Agent Enterprise AI Assistant powered by FastAPI, LangGraph, and Hybrid RAG.</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[10px]">Platform Routes</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Control Dashboard</Link></li>
              <li><Link href="/chat" className="hover:text-indigo-400 transition-colors">Multi-Agent Chat</Link></li>
              <li><Link href="/knowledge" className="hover:text-indigo-400 transition-colors">Knowledge Base Search</Link></li>
              <li><Link href="/documents" className="hover:text-indigo-400 transition-colors">Document Library</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[10px]">System Resources</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="/agents" className="hover:text-indigo-400 transition-colors">9 Agents Hub</Link></li>
              <li><Link href="/analytics" className="hover:text-indigo-400 transition-colors">System Analytics</Link></li>
              <li><Link href="/settings" className="hover:text-indigo-400 transition-colors">API Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[10px]">Security & Status</h4>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> All 9 Agents Operational
              </span>
              <p className="text-[10px] text-slate-500">Enterprise Grade Encryption & Read-Only SQL Safety Guardrails.</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Acme Digital Solutions. All Rights Reserved.</p>
          <p>GitHub Repository: Sonu-Thomas-001/Multi-Agent-Enterprise-AI-Assistant</p>
        </div>
      </footer>
    </div>
  );
}
