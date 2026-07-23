"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { api, CitationHighlight } from "@/lib/api";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileText,
  Paperclip,
  Trash2,
  Cpu,
  Layers,
  Search,
} from "lucide-react";

export default function ChatPage() {
  const { selectedAgent, messages, addMessage, clearMessages, setSelectedCitation } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    // User Message
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    addMessage(userMsg);
    setLoading(true);

    // Call FastAPI Backend / Chat invoke
    const response = await api.invokeChat({
      message: userText,
      agent_id: selectedAgent
    });

    const agentMsg = {
      id: `msg-${Date.now() + 1}`,
      sender: "agent" as const,
      agentName: response.agent_used || selectedAgent,
      content: response.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      thoughtTrace: response.thought_trace,
      citations: response.citations
    };

    addMessage(agentMsg);
    setLoading(false);
  };

  return (
    <div className="pl-64 pt-16 h-screen bg-[#0b0f17] text-white flex flex-col">
      {/* Top Console Bar */}
      <div className="px-6 py-3 border-b border-white/10 glass-card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              Orchestrating {selectedAgent}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Parallel Mode</span>
            </h3>
            <p className="text-[11px] text-slate-400">Session ID: session-enterprise-001</p>
          </div>
        </div>

        <button
          onClick={clearMessages}
          className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-white/10 hover:border-rose-500/40 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Session
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 max-w-3xl ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold text-slate-200">
                  {msg.sender === "user" ? "You" : msg.agentName || "Supervisor Agent"}
                </span>
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white font-medium shadow-xl"
                    : "glass-card border border-white/10 text-slate-200"
                }`}
              >
                {msg.content}
              </div>

              {/* Agent Thought Trace Accordion */}
              {msg.thoughtTrace && msg.thoughtTrace.length > 0 && (
                <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                  <button
                    onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                    className="w-full px-3 py-2 text-[11px] font-mono text-indigo-300 bg-indigo-500/10 flex items-center justify-between hover:bg-indigo-500/20 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-indigo-400" /> Agent Thought Execution Trace ({msg.thoughtTrace.length} steps)
                    </span>
                    {expandedTraceId === msg.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>

                  {expandedTraceId === msg.id && (
                    <div className="p-3 space-y-1.5 font-mono text-[10px] text-slate-300 bg-slate-950/80 border-t border-white/5">
                      {msg.thoughtTrace.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-400 font-bold">›</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Citation Highlights */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-purple-400" /> Cited Enterprise Documents
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.citations.map((citation: CitationHighlight, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(citation)}
                        className="p-2.5 rounded-xl glass-card hover:border-indigo-500/40 text-left transition-all group"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200 mb-1">
                          <span className="truncate group-hover:text-indigo-300">{citation.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {Math.round(citation.score * 100)}% Match
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{citation.snippet}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 max-w-xl items-center">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl text-xs text-indigo-300 flex items-center gap-2 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" /> Orchestrating LangGraph agent flow & retrieving RAG citations...
            </div>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="p-4 border-t border-white/10 glass-card">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Quick Prompt Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <span className="text-slate-500 font-medium">Quick Prompts:</span>
            {[
              "What is our HR Remote Work policy?",
              "Calculate Q3 engineering project budget breakdown",
              "Search IT KB for VPN connection issue resolution",
              "Draft an email to Taylor Rodriguez regarding incident #08",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Textarea Input Bar */}
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Ask ${selectedAgent} anything about Acme Digital Solutions...`}
              className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-4 pr-24 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 shadow-inner"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center gap-1 shadow-lg shadow-indigo-500/25"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
