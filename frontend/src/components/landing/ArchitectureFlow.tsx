"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Layers, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export function ArchitectureFlow() {
  const nodes = [
    { title: "1. User Input & Session", desc: "Sliding-window Memory Context", icon: Layers, color: "from-indigo-600 to-blue-600" },
    { title: "2. Supervisor Graph", desc: "LangGraph Conditional Routing", icon: Cpu, color: "from-purple-600 to-indigo-600" },
    { title: "3. Hybrid RAG Search", desc: "BM25 + Chroma Vector RRF", icon: Database, color: "from-emerald-600 to-teal-600" },
    { title: "4. Executable Tools", desc: "10 Sandboxed Pydantic Tools", icon: FileText, color: "from-amber-600 to-orange-600" },
    { title: "5. Executive Synthesis", desc: "PDF & Cited JSON Response", icon: ShieldCheck, color: "from-rose-600 to-pink-600" },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-2">LangGraph State Machine Flowchart</h3>
        <p className="text-xs text-slate-400">How an enterprise user request is processed asynchronously across multi-agent graph nodes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {nodes.map((n, idx) => {
          const Icon = n.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-4 rounded-2xl border border-white/10 text-center relative group hover:border-indigo-500/50 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${n.color} p-0.5 mx-auto mb-3 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{n.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{n.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* RRF Reciprocal Rank Fusion Explainer Formula Box */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold text-white block">Hybrid RAG Reciprocal Rank Fusion (RRF):</span>
            <span className="text-[11px] text-slate-400">Fuses BM25 sparse keyword scores with dense vector ChromaDB similarity search (k=60).</span>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px]">
          RRF_Score(d) = ∑ 1 / (60 + rank_m(d))
        </div>
      </div>
    </div>
  );
}
