"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import {
  Search,
  Bell,
  Cpu,
  ShieldCheck,
  ChevronDown,
  User,
} from "lucide-react";

const AGENTS_LIST = [
  "Supervisor Agent",
  "Planner Agent",
  "Research Agent",
  "Document Agent",
  "Email Agent",
  "Coding Agent",
  "Analytics Agent",
  "Report Generator",
  "Memory Agent",
];

export function Header() {
  const pathname = usePathname();
  const { selectedAgent, setSelectedAgent, activeSearchQuery, setActiveSearchQuery } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hide header on landing page
  if (pathname === "/") return null;

  const pageTitles: Record<string, string> = {
    "/dashboard": "Enterprise Control Dashboard",
    "/chat": "Multi-Agent Neural Chat Workspace",
    "/knowledge": "RAG Knowledge Base & Search",
    "/documents": "Enterprise Document Library",
    "/agents": "Agent Directory & System Inspector",
    "/analytics": "System Performance & Cost Analytics",
    "/settings": "System & API Configuration",
  };

  const currentTitle = pageTitles[pathname] || "Acme Digital Assistant";

  return (
    <header className="h-16 fixed top-0 right-0 left-64 z-30 glass-nav px-6 flex items-center justify-between border-b border-white/10">
      {/* Title & Status */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-white tracking-wide">{currentTitle}</h2>
        <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Acme Enterprise Confidential
        </span>
      </div>

      {/* Center Search Bar */}
      <div className="relative w-72 hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={activeSearchQuery}
          onChange={(e) => setActiveSearchQuery(e.target.value)}
          placeholder="Search 230 docs, employees, SOPs..."
          className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Agent Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 text-xs text-slate-200 transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{selectedAgent}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl py-1.5 border border-white/10 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-white/10">
                Active Agent Switcher
              </div>
              {AGENTS_LIST.map((agent) => (
                <button
                  key={agent}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedAgent === agent
                      ? "bg-indigo-600/20 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  {agent}
                  {selectedAgent === agent && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl bg-slate-900/90 border border-white/10 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
            <User className="w-4 h-4 text-indigo-300" />
          </div>
        </div>
      </div>
    </header>
  );
}
