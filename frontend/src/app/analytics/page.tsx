"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Cpu,
  Zap,
  Clock,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  Bot,
  FileText,
  Search,
  Mail,
  Code,
  Calculator,
  Database,
  Filter,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Users,
  Globe,
} from "lucide-react";

/* ════════════════════════════════════════════════
   ANALYTICS DATA
   ════════════════════════════════════════════════ */

const DAILY_USAGE = [
  { day: "Mon", requests: 312, tokens: 48200, latency: 138 },
  { day: "Tue", requests: 428, tokens: 62400, latency: 142 },
  { day: "Wed", requests: 387, tokens: 55800, latency: 135 },
  { day: "Thu", requests: 502, tokens: 74100, latency: 148 },
  { day: "Fri", requests: 465, tokens: 68900, latency: 140 },
  { day: "Sat", requests: 198, tokens: 28400, latency: 128 },
  { day: "Sun", requests: 156, tokens: 22100, latency: 124 },
];

const HOURLY_REQUESTS = [
  { hour: "6am", value: 12 }, { hour: "7am", value: 28 }, { hour: "8am", value: 64 },
  { hour: "9am", value: 142 }, { hour: "10am", value: 186 }, { hour: "11am", value: 198 },
  { hour: "12pm", value: 164 }, { hour: "1pm", value: 152 }, { hour: "2pm", value: 178 },
  { hour: "3pm", value: 192 }, { hour: "4pm", value: 168 }, { hour: "5pm", value: 124 },
  { hour: "6pm", value: 86 }, { hour: "7pm", value: 52 }, { hour: "8pm", value: 34 },
];

const AGENT_USAGE = [
  { name: "Research Agent", invocations: 1842, percentage: 28.4, tokens: 284200, avgLatency: 142, color: "from-indigo-500 to-blue-500" },
  { name: "Analytics Agent", invocations: 1356, percentage: 20.9, tokens: 198400, avgLatency: 38, color: "from-purple-500 to-indigo-500" },
  { name: "Supervisor Agent", invocations: 1204, percentage: 18.6, tokens: 142800, avgLatency: 18, color: "from-emerald-500 to-teal-500" },
  { name: "Document Agent", invocations: 892, percentage: 13.8, tokens: 156200, avgLatency: 210, color: "from-amber-500 to-orange-500" },
  { name: "Coding Agent", invocations: 524, percentage: 8.1, tokens: 98400, avgLatency: 85, color: "from-rose-500 to-pink-500" },
  { name: "Email Agent", invocations: 312, percentage: 4.8, tokens: 42800, avgLatency: 24, color: "from-cyan-500 to-blue-500" },
  { name: "Report Generator", invocations: 198, percentage: 3.1, tokens: 68200, avgLatency: 320, color: "from-violet-500 to-purple-500" },
  { name: "Memory Agent", invocations: 148, percentage: 2.3, tokens: 18400, avgLatency: 8, color: "from-slate-500 to-zinc-500" },
];

const TOOL_USAGE = [
  { name: "document_search", calls: 2486, successRate: 99.2, avgDuration: 142, icon: Search },
  { name: "sql_tool", calls: 1842, successRate: 98.8, avgDuration: 34, icon: Database },
  { name: "employee_search", calls: 1124, successRate: 99.6, avgDuration: 18, icon: Users },
  { name: "knowledge_search", calls: 982, successRate: 97.4, avgDuration: 128, icon: FileText },
  { name: "python_interpreter", calls: 624, successRate: 96.2, avgDuration: 85, icon: Code },
  { name: "csv_analysis", calls: 498, successRate: 99.0, avgDuration: 42, icon: BarChart3 },
  { name: "send_email", calls: 312, successRate: 100.0, avgDuration: 24, icon: Mail },
  { name: "calculator", calls: 286, successRate: 100.0, avgDuration: 4, icon: Calculator },
];

const TOP_PROMPTS = [
  { prompt: "What is our remote work policy?", count: 84, category: "HR", trend: "up" as const },
  { prompt: "Calculate Q3 engineering budget breakdown", count: 67, category: "Finance", trend: "up" as const },
  { prompt: "Search VPN troubleshooting guide", count: 52, category: "IT Support", trend: "down" as const },
  { prompt: "List all active projects and their status", count: 48, category: "Operations", trend: "up" as const },
  { prompt: "Draft email to engineering team", count: 41, category: "Communications", trend: "stable" as const },
  { prompt: "Analyze employee satisfaction survey results", count: 38, category: "HR", trend: "up" as const },
  { prompt: "Show incident reports from last month", count: 35, category: "Engineering", trend: "down" as const },
  { prompt: "Generate quarterly performance report", count: 29, category: "Management", trend: "up" as const },
];

const LATENCY_BUCKETS = [
  { range: "0–50ms", count: 2842, percentage: 38.2 },
  { range: "50–100ms", count: 1956, percentage: 26.3 },
  { range: "100–200ms", count: 1684, percentage: 22.6 },
  { range: "200–500ms", count: 742, percentage: 10.0 },
  { range: "500ms+", count: 216, percentage: 2.9 },
];

/* ════════════════════════════════════════════════
   CHART COMPONENTS
   ════════════════════════════════════════════════ */

function VerticalBarChart({ data, color, unit }: { data: { label: string; value: number }[]; color: string; unit: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-1 h-[140px] pt-4">
      {data.map((d, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[8px] font-mono text-slate-500 mb-1">{d.value}{unit}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(d.value / max) * 100}%` }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
            className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t ${color} min-h-[4px]`}
          />
          <span className="text-[9px] text-slate-400 font-medium mt-1">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8 }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
      />
    </div>
  );
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

/* ════════════════════════════════════════════════
   MAIN ANALYTICS DASHBOARD
   ════════════════════════════════════════════════ */

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [agentFilter, setAgentFilter] = useState("all");

  const totalRequests = DAILY_USAGE.reduce((s, d) => s + d.requests, 0);
  const totalTokens = DAILY_USAGE.reduce((s, d) => s + d.tokens, 0);
  const avgLatency = Math.round(DAILY_USAGE.reduce((s, d) => s + d.latency, 0) / DAILY_USAGE.length);

  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white">
      <div className="p-6 space-y-6">
        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Enterprise Analytics <BarChart3 className="w-5 h-5 text-indigo-400" />
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Multi-agent performance metrics, token utilization, and enterprise usage patterns.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Filter */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none bg-slate-900 border border-white/10 rounded-xl px-3 py-2 pr-8 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last Quarter</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Agent Filter */}
            <div className="relative">
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="appearance-none bg-slate-900 border border-white/10 rounded-xl px-3 py-2 pr-8 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                <option value="all">All Agents</option>
                <option value="research">Research Agent</option>
                <option value="analytics">Analytics Agent</option>
                <option value="supervisor">Supervisor Agent</option>
                <option value="document">Document Agent</option>
                <option value="coding">Coding Agent</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Total Requests</span>
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">{totalRequests.toLocaleString()}</h3>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last week</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Avg Latency</span>
              <Clock className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">{avgLatency}ms</h3>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-semibold">-6.2% improved</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Tokens Used</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">{(totalTokens / 1000).toFixed(0)}K</h3>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-semibold">+12.1% usage</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Active Agents</span>
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">9 / 9</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-emerald-400 font-semibold">100% operational</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Tool Success</span>
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">98.9%</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] text-indigo-400 font-semibold">Pydantic v2 typed</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-400 font-medium">Cost Savings</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-400">$42.8K</h3>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-semibold">Automated research</span>
            </div>
          </div>
        </div>

        {/* Charts Row 1: Daily Requests + Hourly Heatmap + Latency Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Request Volume */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> Daily Request Volume
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">7-day trend</span>
            </div>
            <VerticalBarChart
              data={DAILY_USAGE.map((d) => ({ label: d.day, value: d.requests }))}
              color="from-indigo-500 to-purple-500"
              unit=""
            />
          </div>

          {/* Hourly Traffic Pattern */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" /> Hourly Traffic Pattern
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Today</span>
            </div>
            <VerticalBarChart
              data={HOURLY_REQUESTS.map((h) => ({ label: h.hour, value: h.value }))}
              color="from-purple-500 to-pink-500"
              unit=""
            />
          </div>

          {/* Latency Distribution */}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Latency Distribution
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">P50: 82ms · P99: 420ms</span>
            </div>
            <div className="space-y-3 pt-2">
              {LATENCY_BUCKETS.map((bucket, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-slate-300">{bucket.range}</span>
                    <span className="text-slate-400">{bucket.count.toLocaleString()} ({bucket.percentage}%)</span>
                  </div>
                  <HorizontalBar value={bucket.percentage} max={40} color="from-emerald-500 to-teal-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Agent Usage + Tool Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Usage Breakdown */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" /> Agent Invocation Breakdown
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">{AGENT_USAGE.reduce((s, a) => s + a.invocations, 0).toLocaleString()} total</span>
            </div>

            <div className="space-y-3">
              {AGENT_USAGE.map((agent, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{agent.name}</span>
                      <span className="text-[9px] font-mono text-slate-500">{agent.avgLatency}ms avg</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-400">{agent.invocations.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-indigo-300 w-12 text-right">{agent.percentage}%</span>
                    </div>
                  </div>
                  <HorizontalBar value={agent.percentage} max={30} color={agent.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Tool Usage Table */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Tool Usage & Performance
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">{TOOL_USAGE.reduce((s, t) => s + t.calls, 0).toLocaleString()} total calls</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-white/10">
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tool</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calls</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Success</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TOOL_USAGE.map((tool, idx) => {
                    const Icon = tool.icon;
                    return (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span className="font-mono font-semibold text-slate-200">{tool.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-300">{tool.calls.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right">
                          <span className={`font-mono font-bold ${tool.successRate >= 99 ? "text-emerald-400" : tool.successRate >= 97 ? "text-amber-400" : "text-rose-400"}`}>
                            {tool.successRate}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-400">{tool.avgDuration}ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Row 3: Top Prompts + Token Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Prompts */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> Top Enterprise Prompts
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">By frequency</span>
            </div>

            <div className="space-y-2">
              {TOP_PROMPTS.map((prompt, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-all">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-200 font-medium truncate">{prompt.prompt}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{prompt.category}</span>
                      <span className="text-[9px] font-mono text-slate-500">{prompt.count} uses</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {prompt.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />}
                    {prompt.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />}
                    {prompt.trend === "stable" && <Activity className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Token & Latency Breakdown */}
          <div className="glass-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Daily Token &amp; Latency Trends
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-white/10">
                    <th className="text-left px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requests</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tokens</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Latency</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {DAILY_USAGE.map((day, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2.5 font-semibold text-slate-200">{day.day}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-slate-300">{day.requests}</td>
                      <td className="px-3 py-2.5 text-right font-mono text-amber-300">{(day.tokens / 1000).toFixed(1)}K</td>
                      <td className="px-3 py-2.5 text-right">
                        <span className={`font-mono ${day.latency <= 135 ? "text-emerald-400" : day.latency <= 145 ? "text-amber-400" : "text-rose-400"}`}>
                          {day.latency}ms
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <MiniSparkline
                          values={DAILY_USAGE.slice(Math.max(0, idx - 2), idx + 1).map((d) => d.requests)}
                          color={day.requests >= 400 ? "#34d399" : "#818cf8"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
              <span>Avg Daily: {Math.round(totalRequests / 7)} requests</span>
              <span>Peak Day: Thursday ({DAILY_USAGE[3].requests} requests)</span>
              <span>Total: {(totalTokens / 1000).toFixed(0)}K tokens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
