"use client";

import { useState } from "react";
import {
  Settings,
  Key,
  Database,
  Sliders,
  ShieldCheck,
  Save,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [topK, setTopK] = useState(4);
  const [embeddingModel, setEmbeddingModel] = useState("all-MiniLM-L6-v2");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            System & API Configuration <Settings className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure LLM providers, ChromaDB vector parameters, and hybrid RAG search.</p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> {saved ? "Configuration Saved!" : "Save Settings"}
        </button>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Settings updated successfully in environment context.
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        {/* LLM Model Provider */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Language Model Orchestration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "gemini-2.5-flash", name: "Google Gemini 2.5 Flash", desc: "Default enterprise model" },
              { id: "gpt-4o", name: "OpenAI GPT-4o", desc: "High reasoning capacity" },
              { id: "ollama-local", name: "Ollama Llama 3 (Local)", desc: "100% On-Premise Air-gapped" },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  model === m.id
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                    : "bg-slate-900/60 border-white/10 text-slate-300 hover:border-indigo-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold">{m.name}</h4>
                  {model === m.id && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
                </div>
                <p className="text-[10px] text-slate-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys Configuration */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" /> Enterprise API Credentials
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">GEMINI_API_KEY</label>
              <input
                type="password"
                value="••••••••••••••••••••••••••••••••"
                readOnly
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">OPENAI_API_KEY (Optional Fallback)</label>
              <input
                type="password"
                placeholder="sk-proj-..."
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* RAG Vector Store Parameters */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> ChromaDB RAG Vector Store Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">RAG Top-K Document Retrieval</span>
                <span className="font-mono text-indigo-300">{topK} Citations</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Embedding Model</label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all-MiniLM-L6-v2">HuggingFace 'all-MiniLM-L6-v2' (Local Zero-Cost)</option>
                <option value="models/embedding-001">Google Generative AI Embedding</option>
                <option value="text-embedding-3-small">OpenAI Text Embedding 3 Small</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
