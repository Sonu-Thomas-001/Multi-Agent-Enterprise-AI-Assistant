"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, ChatMessage } from "@/store/useAppStore";
import { api, CitationHighlight } from "@/lib/api";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { StreamingDots } from "@/components/chat/TypingAnimation";
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
  Image as ImageIcon,
  Upload,
  File,
  RotateCcw,
  Copy,
  Check,
  Share2,
  MessageSquare,
  X,
  Clock,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react";

/* ─────────── Demo Markdown Response ─────────── */
const DEMO_RESPONSE = `## Remote Work Policy Summary

According to **Acme HR Policy #17** (Document ID: \`DOC-1017\`), the following guidelines apply:

### Core Working Hours
- **Standard Hours**: 9:00 AM – 5:00 PM EST
- **Flexible Window**: ±1 hour with manager approval
- Employees must be available on Slack during core hours

### Equipment & Expense Policy

| Category | Monthly Limit | Approval Required |
|----------|--------------|-------------------|
| Home Office Setup | $500 (one-time) | Yes |
| Internet Reimbursement | $75/month | No |
| Software Licenses | $150/month | Manager |
| Ergonomic Equipment | $300/year | HR + Manager |

### Code Example: Expense Submission

\`\`\`python
from acme.hr import ExpenseReport

report = ExpenseReport(
    employee_id="EMP-042",
    category="home_office",
    amount=149.99,
    description="Ergonomic keyboard for remote setup"
)
report.submit()  # Auto-routes to manager for approval
\`\`\`

> **Note**: All remote work arrangements must be documented in the HR portal within 5 business days of approval.

For more details, refer to the [Full Remote Work Policy Document](#).`;

/* ─────────── Agent Status Steps ─────────── */
const AGENT_STEPS = [
  { label: "Supervisor Agent analyzing intent", delay: 400 },
  { label: "Routing to Research & Document Agents", delay: 1200 },
  { label: "Executing BM25 + Vector RAG search", delay: 2200 },
  { label: "Parsing 3 enterprise documents", delay: 3000 },
  { label: "Synthesizing executive response", delay: 3800 },
];

/* ─────────── Suggested Prompts ─────────── */
const SUGGESTED_PROMPTS = [
  { label: "📋 HR Policy", text: "What is our remote work policy and monthly expense limit?" },
  { label: "📊 Q3 Budget", text: "Calculate Q3 engineering project budget breakdown by team" },
  { label: "🔧 IT Support", text: "Search the knowledge base for VPN connection troubleshooting" },
  { label: "✉️ Email Draft", text: "Draft an email to the engineering team about the upcoming sprint retrospective" },
  { label: "🐍 Code Help", text: "Write a Python function to parse and analyze our CSV employee data" },
  { label: "📈 Analytics", text: "Show me project completion rates and resource utilization metrics" },
];

/* ─────────── Conversation History ─────────── */
const CONVERSATION_HISTORY = [
  { id: "conv-1", title: "Remote Work Policy Query", time: "2 min ago", msgs: 4 },
  { id: "conv-2", title: "Q3 Budget Analysis", time: "1 hour ago", msgs: 8 },
  { id: "conv-3", title: "VPN Troubleshooting Guide", time: "3 hours ago", msgs: 6 },
  { id: "conv-4", title: "Sprint Retrospective Email", time: "Yesterday", msgs: 3 },
  { id: "conv-5", title: "Employee Data Analytics", time: "Yesterday", msgs: 12 },
];

/* ─────────── File Upload Item ─────────── */
interface UploadedFile {
  id: string;
  name: string;
  type: "image" | "pdf" | "file";
  size: string;
}

export default function EnterpriseChatPage() {
  const { selectedAgent, messages, addMessage, clearMessages, setSelectedCitation } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [agentStepIdx, setAgentStepIdx] = useState(-1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: UploadedFile[] = Array.from(files).map((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() || "";
      let type: "image" | "pdf" | "file" = "file";
      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) type = "image";
      if (ext === "pdf") type = "pdf";
      const size = f.size < 1024 * 1024
        ? `${(f.size / 1024).toFixed(1)} KB`
        : `${(f.size / (1024 * 1024)).toFixed(1)} MB`;
      return { id: `file-${Date.now()}-${Math.random()}`, name: f.name, type, size };
    });
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    setUploadedFiles([]);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    addMessage(userMsg);
    setLoading(true);
    setAgentStepIdx(0);

    // Simulate agent status steps
    for (let i = 0; i < AGENT_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, AGENT_STEPS[i].delay - (i > 0 ? AGENT_STEPS[i - 1].delay : 0)));
      setAgentStepIdx(i);
    }

    // Try real API or fallback to demo
    let response;
    try {
      response = await api.invokeChat({ message: userText, agent_id: selectedAgent });
    } catch {
      response = null;
    }

    const agentMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "agent",
      agentName: response?.agent_used || selectedAgent,
      content: response?.response || DEMO_RESPONSE,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      thoughtTrace: response?.thought_trace || [
        "1. Supervisor Agent: Received user request, analyzing intent classification",
        "2. Router: Dispatching to Research Agent (RAG) + Analytics Agent (SQL) in PARALLEL mode",
        "3. Research Agent: Executed BM25 keyword search → 12 candidates found",
        "4. Research Agent: Executed ChromaDB dense vector search → 8 candidates found",
        "5. RAG Pipeline: Applied Reciprocal Rank Fusion (k=60) → Top 4 documents selected",
        "6. Document Agent: Parsed hr_policies/doc_17.md (Section 2, Lines 14-47)",
        "7. Report Generator: Synthesized structured markdown response with citations",
      ],
      citations: response?.citations || [
        { source_file: "hr_policies/doc_17.md", title: "HR Policy #17: Remote Work Guidelines", category: "hr_policies", domain: "HR", page_or_section: "Section 2", score: 0.94, snippet: "Core working hours are 9:00 AM to 5:00 PM EST. Flexible arrangements require manager approval." },
        { source_file: "hr_policies/doc_23.md", title: "HR Policy #23: Equipment & Expense Reimbursement", category: "hr_policies", domain: "HR", page_or_section: "Section 4", score: 0.89, snippet: "Monthly internet reimbursement capped at $75. Ergonomic equipment up to $300/year with dual approval." },
        { source_file: "engineering_sops/sop_05.md", title: "SOP #5: Remote Development Environment Setup", category: "engineering_sops", domain: "Engineering", page_or_section: "Section 1", score: 0.82, snippet: "All remote engineers must configure VPN and 2FA before accessing internal repositories." },
      ],
    };

    addMessage(agentMsg);
    setLoading(false);
    setAgentStepIdx(-1);
  }, [input, loading, selectedAgent, addMessage]);

  const handleRegenerate = (msgId: string) => {
    // Find the user message before this agent message and resend
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex > 0 && messages[msgIndex - 1].sender === "user") {
      setInput(messages[msgIndex - 1].content);
    }
  };

  return (
    <div className="pl-64 pt-16 h-screen bg-[#0b0f17] text-white flex">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.csv,.json,.md,.txt,.py,.ts,.js"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Conversation History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full bg-slate-950/95 border-r border-white/10 flex flex-col overflow-hidden shrink-0"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Conversation History
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {CONVERSATION_HISTORY.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10"
                >
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">{conv.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {conv.time}
                    </span>
                    <span className="text-[10px] text-slate-500">{conv.msgs} messages</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Console Bar */}
        <div className="px-6 py-3 border-b border-white/10 glass-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                Orchestrating {selectedAgent}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">Session: enterprise-{Date.now().toString(36).slice(-6)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-xl text-[11px] text-slate-400 hover:text-white bg-slate-900/60 border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5">
              <Share2 className="w-3 h-3" /> Share
            </button>
            <button
              onClick={clearMessages}
              className="px-3 py-1.5 rounded-xl text-[11px] text-slate-400 hover:text-rose-300 bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Welcome state if no user messages */}
          {messages.length <= 1 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center pt-12 pb-8"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 p-0.5 shadow-2xl shadow-indigo-500/30 mb-6">
                <div className="w-full h-full bg-[#0b0f17] rounded-[22px] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Acme Enterprise AI Assistant</h2>
              <p className="text-xs text-slate-400 max-w-md text-center mb-8">
                9 specialized agents ready to research documents, analyze data, write code, and compose emails across your enterprise knowledge base.
              </p>

              {/* Suggested Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl w-full">
                {SUGGESTED_PROMPTS.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(sp.text)}
                    className="p-4 rounded-2xl glass-card text-left hover:border-indigo-500/40 transition-all group border border-white/10"
                  >
                    <span className="text-[11px] font-bold text-slate-300 group-hover:text-white block mb-1">{sp.label}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-300 line-clamp-2">{sp.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Message Bubbles */}
          {messages.map((msg, msgIdx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : ""}`}
            >
              {/* Agent Avatar */}
              {msg.sender === "agent" && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Bubble Body */}
              <div className={`space-y-2 ${msg.sender === "user" ? "max-w-xl" : "max-w-3xl flex-1 min-w-0"}`}>
                {/* Sender Info */}
                <div className={`flex items-center gap-2 px-1 ${msg.sender === "user" ? "justify-end" : ""}`}>
                  <span className="text-[11px] font-bold text-slate-300">
                    {msg.sender === "user" ? "You" : msg.agentName || "Supervisor Agent"}
                  </span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                {/* Message Content */}
                <div
                  className={`rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-indigo-600 p-4 text-xs text-white font-medium shadow-xl shadow-indigo-500/15"
                      : "glass-card border border-white/10 p-5"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <span className="text-xs leading-relaxed">{msg.content}</span>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>

                {/* Agent Message Actions Bar */}
                {msg.sender === "agent" && msgIdx > 0 && (
                  <div className="flex items-center gap-1.5 px-1">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleRegenerate(msg.id)}
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Regenerate
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors">
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                  </div>
                )}

                {/* Thought Trace Accordion */}
                {msg.thoughtTrace && msg.thoughtTrace.length > 0 && (
                  <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                    <button
                      onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                      className="w-full px-4 py-2.5 text-[11px] font-mono text-indigo-300 bg-indigo-500/10 flex items-center justify-between hover:bg-indigo-500/15 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        Agent Execution Trace ({msg.thoughtTrace.length} steps)
                      </span>
                      {expandedTraceId === msg.id ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    <AnimatePresence>
                      {expandedTraceId === msg.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 space-y-2 font-mono text-[11px] text-slate-300 bg-slate-950/80 border-t border-white/5">
                            {msg.thoughtTrace.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Source Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
                      <FileText className="w-3.5 h-3.5 text-purple-400" /> Sources &amp; Citations ({msg.citations.length} documents)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {msg.citations.map((citation: CitationHighlight, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCitation(citation)}
                          className="p-3 rounded-xl glass-card hover:border-indigo-500/40 text-left transition-all group border border-white/10"
                        >
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200 mb-1">
                            <span className="truncate group-hover:text-indigo-300 max-w-[140px]">{citation.title}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 shrink-0 ml-1">
                              {Math.round(citation.score * 100)}%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{citation.snippet}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="text-[9px] font-mono text-slate-500 truncate">{citation.source_file}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{citation.domain}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Loading State with Agent Status Steps */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse shadow-lg shadow-purple-500/20">
                <Bot className="w-4 h-4" />
              </div>
              <div className="glass-card p-5 rounded-2xl border border-indigo-500/30 max-w-md space-y-3">
                <StreamingDots label="Orchestrating multi-agent workflow" />
                <div className="space-y-1.5">
                  {AGENT_STEPS.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 text-[11px] font-mono transition-all duration-300 ${
                        idx <= agentStepIdx ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {idx < agentStepIdx ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : idx === agentStepIdx ? (
                        <Activity className="w-3 h-3 text-indigo-400 shrink-0 animate-pulse" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer Area */}
        <div className="p-4 border-t border-white/10 glass-card shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Uploaded Files Preview */}
            <AnimatePresence>
              {uploadedFiles.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs"
                    >
                      {file.type === "image" ? (
                        <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                      ) : file.type === "pdf" ? (
                        <FileText className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <File className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span className="text-slate-200 max-w-[120px] truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-500">{file.size}</span>
                      <button onClick={() => removeFile(file.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Prompts Pill Row (only show if no messages beyond welcome) */}
            {messages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
                <span className="text-slate-500 font-medium shrink-0">Quick:</span>
                {SUGGESTED_PROMPTS.slice(0, 4).map((sp, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(sp.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 whitespace-nowrap transition-colors shrink-0"
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            )}

            {/* Textarea Input Bar */}
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Ask ${selectedAgent} anything about Acme Digital Solutions...`}
                  rows={1}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-4 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 shadow-inner resize-none overflow-y-auto"
                  style={{ maxHeight: "160px" }}
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
                  title="Upload files (PDF, Image, CSV, Code)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.click();
                      fileInputRef.current.accept = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.csv,.json,.md,.txt,.py,.ts,.js";
                    }
                  }}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
                  title="Upload image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/25"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              Enterprise AI may produce inaccurate information. Always verify critical data against source documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
