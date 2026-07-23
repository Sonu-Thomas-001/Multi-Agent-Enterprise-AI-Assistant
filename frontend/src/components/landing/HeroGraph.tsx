"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Layers, Sparkles, Zap, Bot, ArrowRight } from "lucide-react";

export function HeroGraph() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "User Query Input", agent: "Supervisor Agent", desc: "Evaluating request intent & decomposing task graph...", color: "text-indigo-400" },
    { title: "Parallel Agent Routing", agent: "Research & Analytics Agents", desc: "Executing BM25+Vector RRF search & SQLite SQL queries in parallel...", color: "text-purple-400" },
    { title: "Tool Execution", agent: "Coding & Document Agents", desc: "Evaluating Python code snippets & parsing PDF citations...", color: "text-emerald-400" },
    { title: "Final Synthesis", agent: "Report Generator", desc: "Synthesizing executive summary & structured JSON response...", color: "text-amber-400" },
  ];

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-slate-400 ml-2">LangGraph State Machine Engine</span>
        </div>

        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Active Step {activeStep + 1}/4
        </span>
      </div>

      {/* Network Nodes Visual */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {steps.map((s, idx) => {
          const isActive = activeStep === idx;
          return (
            <motion.div
              key={idx}
              animate={{ scale: isActive ? 1.03 : 1 }}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900/60 border-white/10 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${s.color}`}>
                  Step 0{idx + 1}
                </span>
                {isActive && <Zap className="w-3 h-3 text-indigo-400 animate-pulse" />}
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{s.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono mb-2">{s.agent}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Step Status Live Terminal Log */}
      <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-indigo-300 font-semibold">{steps[activeStep].agent}:</span>
          <span className="text-slate-300 truncate max-w-md">{steps[activeStep].desc}</span>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">Execution Time: ~14ms</span>
      </div>
    </div>
  );
}
