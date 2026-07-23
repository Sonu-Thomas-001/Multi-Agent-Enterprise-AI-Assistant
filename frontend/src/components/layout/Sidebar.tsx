"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  FileText,
  Bot,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Multi-Agent Chat", icon: MessageSquare, badge: "9 Agents" },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen, badge: "RAG" },
  { href: "/documents", label: "Documents", icon: FileText, badge: "230 Docs" },
  { href: "/agents", label: "Agents Hub", icon: Bot },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  // Hide sidebar on landing page
  if (pathname === "/") return null;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-40 glass-sidebar flex flex-col justify-between p-4 border-r border-white/10">
      <div>
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-3 py-3 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
              Acme AI <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">v2.5</span>
            </h1>
            <p className="text-[11px] text-slate-400">Multi-Agent System</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/30 rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span
                    className={
                      isActive ? "text-white font-semibold" : "text-slate-300 group-hover:text-white"
                    }
                  >
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`relative z-10 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-indigo-500/30 text-indigo-200 border border-indigo-400/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Agent Health Status Pill */}
      <div className="glass-card p-3.5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200">System Online</span>
          </div>
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <p className="text-[11px] text-slate-400 mb-2">9 Agents Active & SQLite RAG Vector Online</p>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[94%]" />
        </div>
      </div>
    </aside>
  );
}
