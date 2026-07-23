"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bot,
  Cpu,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Layers,
  Terminal,
  FileText,
  Database,
  Code,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Timer,
  Play,
  Circle,
  Sparkles,
  Search,
  Mail,
  Calculator,
  RefreshCw,
} from "lucide-react";

/* ════════════════════════════════════════════════
   MOCK DATA — Realistic Enterprise Agent Telemetry
   ════════════════════════════════════════════════ */

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: "running" | "idle" | "completed" | "error";
  currentTask: string;
  executionTime: number;
  tokensUsed: number;
  toolCalls: number;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  status: "completed" | "running" | "pending" | "error";
  duration: number;
}

interface ToolCallLog {
  id: string;
  tool: string;
  agent: string;
  input: string;
  output: string;
  status: "success" | "error" | "running";
  duration: number;
  timestamp: string;
}

interface ReasoningStep {
  id: string;
  agent: string;
  step: number;
  thought: string;
  action: string;
  observation: string;
  timestamp: string;
}

const AGENTS: AgentStatus[] = [
  { id: "supervisor", name: "Supervisor Agent", role: "Graph Router", status: "running", currentTask: "Routing multi-agent workflow for budget analysis query", executionTime: 42, tokensUsed: 1284, toolCalls: 2 },
  { id: "research", name: "Research Agent", role: "Hybrid RAG Search", status: "running", currentTask: "Executing BM25 + Vector RRF across 230 enterprise documents", executionTime: 138, tokensUsed: 3847, toolCalls: 4 },
  { id: "analytics", name: "Analytics Agent", role: "SQL Data Telemetry", status: "completed", currentTask: "SELECT budget, spent FROM projects WHERE quarter='Q3'", executionTime: 38, tokensUsed: 1092, toolCalls: 3 },
  { id: "coding", name: "Coding Agent", role: "Python Interpreter", status: "idle", currentTask: "Awaiting sandboxed code execution request", executionTime: 0, tokensUsed: 0, toolCalls: 0 },
  { id: "document", name: "Document Agent", role: "Metadata Parser", status: "completed", currentTask: "Parsed financial_reports/q3_budget.pdf (42 pages)", executionTime: 210, tokensUsed: 5120, toolCalls: 2 },
  { id: "email", name: "Email Agent", role: "Communications", status: "idle", currentTask: "Awaiting email composition request", executionTime: 0, tokensUsed: 0, toolCalls: 0 },
  { id: "report", name: "Report Generator", role: "PDF Synthesizer", status: "running", currentTask: "Synthesizing executive summary from 3 agent outputs", executionTime: 85, tokensUsed: 2340, toolCalls: 1 },
  { id: "memory", name: "Memory Agent", role: "Context Buffer", status: "completed", currentTask: "Session context loaded (12 turns, 4.2K tokens)", executionTime: 8, tokensUsed: 420, toolCalls: 1 },
  { id: "planner", name: "Planner Agent", role: "Task Decomposer", status: "completed", currentTask: "Decomposed request into 4 parallel sub-tasks", executionTime: 22, tokensUsed: 890, toolCalls: 1 },
];

const TIMELINE: TimelineEvent[] = [
  { id: "t1", timestamp: "10:24:01.042", agent: "Supervisor", action: "Received user query: 'Analyze Q3 engineering budget vs actual spend'", status: "completed", duration: 12 },
  { id: "t2", timestamp: "10:24:01.054", agent: "Planner", action: "Decomposed into 4 sub-tasks: SQL query, RAG search, PDF parse, synthesis", status: "completed", duration: 22 },
  { id: "t3", timestamp: "10:24:01.076", agent: "Memory", action: "Loaded session context (12 previous turns, sliding window)", status: "completed", duration: 8 },
  { id: "t4", timestamp: "10:24:01.084", agent: "Supervisor", action: "Dispatched Research + Analytics + Document agents in PARALLEL", status: "completed", duration: 18 },
  { id: "t5", timestamp: "10:24:01.102", agent: "Analytics", action: "Executing SQL: SELECT project_name, budget, spent FROM projects WHERE quarter='Q3'", status: "completed", duration: 38 },
  { id: "t6", timestamp: "10:24:01.102", agent: "Research", action: "BM25 keyword search: 'Q3 engineering budget' → 14 candidates", status: "completed", duration: 62 },
  { id: "t7", timestamp: "10:24:01.164", agent: "Research", action: "ChromaDB vector search → 9 candidates, RRF fusion → Top 4 documents", status: "running", duration: 76 },
  { id: "t8", timestamp: "10:24:01.102", agent: "Document", action: "Parsing financial_reports/q3_budget.pdf (42 pages, 18 tables)", status: "completed", duration: 210 },
  { id: "t9", timestamp: "10:24:01.312", agent: "Report Gen", action: "Synthesizing executive summary with citations and tables", status: "running", duration: 85 },
  { id: "t10", timestamp: "10:24:01.397", agent: "Supervisor", action: "Merging parallel outputs into final structured response", status: "pending", duration: 0 },
];

const TOOL_CALLS: ToolCallLog[] = [
  { id: "tc1", tool: "sql_tool", agent: "Analytics Agent", input: "SELECT project_name, budget, actual_spent, (budget - actual_spent) as variance FROM projects WHERE quarter = 'Q3' ORDER BY variance DESC", output: "5 rows returned: [Phoenix Platform: $180K/$142K, Atlas Migration: $95K/$101K, ...]", status: "success", duration: 34, timestamp: "10:24:01.105" },
  { id: "tc2", tool: "document_search", agent: "Research Agent", input: "query='Q3 engineering budget allocation', top_k=4, search_type='hybrid'", output: "4 documents retrieved: q3_budget.pdf (96.2%), engineering_sops/budget_process.md (91.4%), ...", status: "success", duration: 142, timestamp: "10:24:01.102" },
  { id: "tc3", tool: "employee_search", agent: "Analytics Agent", input: "department='Engineering', fields=['name','role','project_allocation']", output: "28 engineering employees returned with project allocations", status: "success", duration: 18, timestamp: "10:24:01.140" },
  { id: "tc4", tool: "csv_analysis", agent: "Analytics Agent", input: "file='projects.csv', operation='group_by', columns=['department','sum(budget)']", output: "Engineering: $542K, Product: $318K, Infrastructure: $195K, QA: $89K", status: "success", duration: 22, timestamp: "10:24:01.158" },
  { id: "tc5", tool: "knowledge_search", agent: "Research Agent", input: "query='budget variance policy threshold', domain='Finance'", output: "2 results: finance_policies/doc_08.md (88.1%), change_requests/cr_12.md (74.3%)", status: "success", duration: 98, timestamp: "10:24:01.164" },
  { id: "tc6", tool: "generate_report", agent: "Report Generator", input: "format='markdown', sections=['summary','budget_table','variance_analysis','recommendations']", output: "Generating structured executive summary...", status: "running", duration: 85, timestamp: "10:24:01.312" },
];

const REASONING_STEPS: ReasoningStep[] = [
  { id: "r1", agent: "Supervisor", step: 1, thought: "User is asking for Q3 budget analysis. This requires both structured data (SQL) and unstructured data (documents). I need to dispatch multiple agents.", action: "Invoke Planner Agent to decompose the task", observation: "Planner returned 4 sub-tasks with dependency graph", timestamp: "10:24:01.042" },
  { id: "r2", agent: "Planner", step: 2, thought: "The request has independent data sources: SQL database for numbers, RAG for policy docs, PDF for detailed reports. These can run in parallel.", action: "Create parallel execution plan: [Analytics || Research || Document] → Report Generator", observation: "Execution plan validated, no circular dependencies detected", timestamp: "10:24:01.054" },
  { id: "r3", agent: "Analytics", step: 3, thought: "Need Q3 project budget data. The projects table has budget and actual_spent columns. I should also calculate variance.", action: "Execute SQL query with budget variance calculation", observation: "5 Q3 projects returned. Phoenix Platform is $38K under budget. Atlas Migration is $6K over budget.", timestamp: "10:24:01.102" },
  { id: "r4", agent: "Research", step: 4, thought: "Need budget policy documents to contextualize the numbers. Hybrid search will combine keyword matches with semantic understanding.", action: "Execute BM25 + Vector RRF hybrid search for 'Q3 engineering budget'", observation: "Top result: q3_budget.pdf with 96.2% confidence. Contains 18 budget tables across 42 pages.", timestamp: "10:24:01.102" },
  { id: "r5", agent: "Report Gen", step: 5, thought: "I have SQL data, RAG documents, and parsed PDF tables. I need to synthesize a clear executive summary with actionable recommendations.", action: "Generate markdown report with summary, budget table, variance analysis, and recommendations", observation: "Report generation in progress — combining 3 agent outputs into structured format", timestamp: "10:24:01.312" },
];

/* ════════════════════════════════════════════════
   GRAPH VISUALIZATION — Workflow State Machine
   ════════════════════════════════════════════════ */

function WorkflowGraph() {
  const nodes = [
    { id: "user", label: "User Input", x: 10, y: 45, status: "completed" as const },
    { id: "supervisor", label: "Supervisor", x: 25, y: 45, status: "running" as const },
    { id: "planner", label: "Planner", x: 40, y: 20, status: "completed" as const },
    { id: "memory", label: "Memory", x: 40, y: 70, status: "completed" as const },
    { id: "research", label: "Research", x: 58, y: 15, status: "running" as const },
    { id: "analytics", label: "Analytics", x: 58, y: 45, status: "completed" as const },
    { id: "document", label: "Document", x: 58, y: 75, status: "completed" as const },
    { id: "report", label: "Report Gen", x: 78, y: 45, status: "running" as const },
    { id: "output", label: "Final Output", x: 93, y: 45, status: "pending" as const },
  ];

  const edges = [
    { from: "user", to: "supervisor" },
    { from: "supervisor", to: "planner" },
    { from: "supervisor", to: "memory" },
    { from: "planner", to: "research" },
    { from: "planner", to: "analytics" },
    { from: "planner", to: "document" },
    { from: "research", to: "report" },
    { from: "analytics", to: "report" },
    { from: "document", to: "report" },
    { from: "report", to: "output" },
  ];

  const statusColor = {
    completed: { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-300", dot: "bg-emerald-400" },
    running: { bg: "bg-indigo-500/20", border: "border-indigo-500/50", text: "text-indigo-300", dot: "bg-indigo-400" },
    pending: { bg: "bg-slate-800/60", border: "border-slate-600/50", text: "text-slate-400", dot: "bg-slate-500" },
    error: { bg: "bg-rose-500/20", border: "border-rose-500/50", text: "text-rose-300", dot: "bg-rose-400" },
  };

  return (
    <div className="relative w-full h-[200px] overflow-hidden">
      {/* Edges (SVG lines) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge, idx) => {
          const from = nodes.find((n) => n.id === edge.from)!;
          const to = nodes.find((n) => n.id === edge.to)!;
          return (
            <line
              key={idx}
              x1={`${from.x + 4}%`} y1={`${from.y}%`}
              x2={`${to.x - 4}%`} y2={`${to.y}%`}
              stroke="rgba(99, 102, 241, 0.3)"
              strokeWidth="0.4"
              strokeDasharray="2,2"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const colors = statusColor[node.status];
        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl ${colors.bg} border ${colors.border} ${colors.text} text-[10px] font-bold whitespace-nowrap z-10 flex items-center gap-1.5`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${node.status === "running" ? "animate-pulse" : ""}`} />
            {node.label}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════
   BAR CHART COMPONENT
   ════════════════════════════════════════════════ */

function BarChart({ data, label, unit }: { data: { name: string; value: number; color: string }[]; label: string; unit: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2.5">
      <h4 className="text-[11px] font-bold text-slate-300">{label}</h4>
      {data.map((d, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-300 font-medium truncate max-w-[120px]">{d.name}</span>
            <span className="text-slate-400 font-mono">{d.value}{unit}</span>
          </div>
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`h-full rounded-full ${d.color}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ════════════════════════════════════════════════ */

export default function AgentMonitoringDashboard() {
  const [activeTab, setActiveTab] = useState<"timeline" | "tools" | "reasoning">("timeline");
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Live tick counter for running agents
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const runningAgents = AGENTS.filter((a) => a.status === "running");
  const completedAgents = AGENTS.filter((a) => a.status === "completed");
  const idleAgents = AGENTS.filter((a) => a.status === "idle");
  const totalTokens = AGENTS.reduce((sum, a) => sum + a.tokensUsed, 0);
  const totalTools = AGENTS.reduce((sum, a) => sum + a.toolCalls, 0);

  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Agent Monitoring Dashboard <Activity className="w-5 h-5 text-indigo-400" />
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Live LangGraph Execution Telemetry — Session enterprise-{Date.now().toString(36).slice(-6)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Monitoring Active
            </span>
            <button className="px-3 py-1.5 rounded-xl text-[11px] text-slate-300 bg-slate-900 border border-white/10 hover:border-indigo-500/40 transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Running</span>
              <Play className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-indigo-400">{runningAgents.length}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">agents executing</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-400">{completedAgents.length}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">agents finished</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Tool Calls</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-amber-400">{totalTools}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">executions total</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Tokens Used</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-purple-400">{(totalTokens / 1000).toFixed(1)}K</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">input + output</p>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Total Time</span>
              <Timer className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-rose-400">{(AGENTS.reduce((s, a) => s + a.executionTime, 0) / 1000).toFixed(2)}s</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">wall clock</p>
          </div>
        </div>

        {/* Main Grid: Workflow Graph + Running Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Graph — 2 columns */}
          <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> LangGraph Workflow Execution
              </h2>
              <span className="text-[10px] font-mono text-slate-400">Parallel + Sequential Hybrid Mode</span>
            </div>
            <WorkflowGraph />
            <div className="flex items-center gap-4 text-[10px] text-slate-400 border-t border-white/10 pt-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Running</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" /> Pending</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Error</span>
            </div>
          </div>

          {/* Running Agents List */}
          <div className="glass-card p-5 rounded-2xl space-y-3 overflow-y-auto max-h-[380px]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" /> Agent Status ({AGENTS.length})
            </h2>
            <div className="space-y-2">
              {AGENTS.map((agent) => {
                const statusColors = {
                  running: { badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", dot: "bg-indigo-400 animate-pulse" },
                  completed: { badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" },
                  idle: { badge: "bg-slate-700/40 text-slate-400 border-slate-600/30", dot: "bg-slate-500" },
                  error: { badge: "bg-rose-500/20 text-rose-300 border-rose-500/30", dot: "bg-rose-400" },
                };
                const c = statusColors[agent.status];
                return (
                  <div key={agent.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-200">{agent.name}</span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${c.badge} flex items-center gap-1`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono truncate mb-1.5">{agent.currentTask}</p>
                    <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{agent.executionTime}ms</span>
                      <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />{agent.tokensUsed} tok</span>
                      <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5" />{agent.toolCalls} calls</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl">
            <BarChart
              label="Agent Execution Time"
              unit="ms"
              data={AGENTS.filter((a) => a.executionTime > 0).map((a) => ({
                name: a.name.replace(" Agent", ""),
                value: a.executionTime,
                color: a.status === "running" ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gradient-to-r from-emerald-500 to-teal-500",
              }))}
            />
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <BarChart
              label="Token Utilization"
              unit=""
              data={AGENTS.filter((a) => a.tokensUsed > 0).map((a) => ({
                name: a.name.replace(" Agent", ""),
                value: a.tokensUsed,
                color: "bg-gradient-to-r from-purple-500 to-pink-500",
              }))}
            />
          </div>

          <div className="glass-card p-5 rounded-2xl">
            <BarChart
              label="Tool Calls Per Agent"
              unit=""
              data={AGENTS.filter((a) => a.toolCalls > 0).map((a) => ({
                name: a.name.replace(" Agent", ""),
                value: a.toolCalls,
                color: "bg-gradient-to-r from-amber-500 to-orange-500",
              }))}
            />
          </div>
        </div>

        {/* Tabbed Logs Section: Timeline | Tool Calls | Reasoning */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Tab Bar */}
          <div className="flex items-center border-b border-white/10 px-2">
            {([
              { id: "timeline" as const, label: "Execution Timeline", icon: Clock },
              { id: "tools" as const, label: "Tool Calls", icon: Zap },
              { id: "reasoning" as const, label: "Reasoning Steps", icon: Cpu },
            ]).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-[11px] font-bold flex items-center gap-2 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-300"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-5 max-h-[420px] overflow-y-auto">
            {/* ─── Timeline ─── */}
            {activeTab === "timeline" && (
              <div className="space-y-1">
                {TIMELINE.map((event, idx) => {
                  const statusIcons = {
                    completed: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
                    running: <Activity className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />,
                    pending: <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
                    error: <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
                  };
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      {statusIcons[event.status]}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
                          <span className="text-[10px] font-bold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/20">{event.agent}</span>
                          {event.duration > 0 && (
                            <span className="text-[9px] font-mono text-slate-500">{event.duration}ms</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-200 font-mono truncate">{event.action}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ─── Tool Calls ─── */}
            {activeTab === "tools" && (
              <div className="space-y-2">
                {TOOL_CALLS.map((tc) => {
                  const isExpanded = expandedTool === tc.id;
                  const statusBadge = {
                    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                    error: "bg-rose-500/20 text-rose-300 border-rose-500/30",
                    running: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                  };
                  return (
                    <div key={tc.id} className="rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all">
                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : tc.id)}
                        className="w-full p-3.5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Zap className={`w-3.5 h-3.5 shrink-0 ${tc.status === "success" ? "text-emerald-400" : tc.status === "running" ? "text-indigo-400 animate-pulse" : "text-rose-400"}`} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-bold font-mono text-white">{tc.tool}</span>
                              <span className="text-[9px] text-slate-400 font-mono">via {tc.agent}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono truncate max-w-lg">{tc.input}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] font-mono text-slate-500">{tc.duration}ms</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${statusBadge[tc.status]}`}>{tc.status}</span>
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-slate-950/80 border-t border-white/5 space-y-3 font-mono text-[11px]">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Input</span>
                                <div className="p-3 bg-slate-900 rounded-xl text-slate-200 border border-white/5">{tc.input}</div>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Output</span>
                                <div className="p-3 bg-slate-900 rounded-xl text-emerald-300 border border-emerald-500/20">{tc.output}</div>
                              </div>
                              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                                <span>Timestamp: {tc.timestamp}</span>
                                <span>Duration: {tc.duration}ms</span>
                                <span>Agent: {tc.agent}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── Reasoning Steps ─── */}
            {activeTab === "reasoning" && (
              <div className="space-y-4">
                {REASONING_STEPS.map((rs, idx) => (
                  <motion.div
                    key={rs.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300">{rs.step}</span>
                        <span className="text-[11px] font-bold text-indigo-300">{rs.agent}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">{rs.timestamp}</span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase shrink-0 w-20">Thought</span>
                        <p className="text-slate-300">{rs.thought}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase shrink-0 w-20">Action</span>
                        <p className="text-slate-200 font-mono">{rs.action}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase shrink-0 w-20">Observation</span>
                        <p className="text-slate-300">{rs.observation}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
