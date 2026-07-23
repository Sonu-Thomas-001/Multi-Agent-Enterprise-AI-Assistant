"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  ShieldCheck,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

const DEMO_DOCUMENTS = [
  { name: "doc_1.md", title: "HR Policy #1: Remote Work Guidelines", format: "Markdown", size: "12 KB", category: "HR Policies", status: "Indexed" },
  { name: "sop_12.pdf", title: "Engineering SOP #12: Microservices Deployment", format: "PDF", size: "450 KB", category: "Engineering SOPs", status: "Indexed" },
  { name: "inc_08.md", title: "Incident Report #08: Database Failover Post-Mortem", format: "Markdown", size: "18 KB", category: "Incident Reports", status: "Indexed" },
  { name: "arch_04.pdf", title: "Architecture Spec: Parallel Multi-Agent Graph", format: "PDF", size: "1.2 MB", category: "Architecture", status: "Indexed" },
  { name: "employees.csv", title: "Acme Employee Directory (100 Employees)", format: "CSV", size: "85 KB", category: "Relational DB", status: "SQL Ready" },
  { name: "projects.csv", title: "Acme Project Tracker (50 Projects)", format: "CSV", size: "64 KB", category: "Relational DB", status: "SQL Ready" },
  { name: "fin_q3.json", title: "Financial Report Q3 2026 Summary", format: "JSON", size: "32 KB", category: "Financials", status: "Indexed" },
];

export default function DocumentsPage() {
  const [filter, setFilter] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All Formats");

  const filteredDocs = DEMO_DOCUMENTS.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(filter.toLowerCase()) || doc.category.toLowerCase().includes(filter.toLowerCase());
    const matchesFormat = selectedFormat === "All Formats" || doc.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white p-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Enterprise Document Library <FolderOpen className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">230 Synthetic Enterprise Documents (PDF, MD, CSV, JSON) indexed in ChromaDB vector store.</p>
        </div>

        <button className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 self-start md:self-auto">
          <Upload className="w-4 h-4" /> Upload New Document
        </button>
      </div>

      {/* Filter Controls */}
      <div className="glass-card p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search documents by title or category..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {["All Formats", "Markdown", "PDF", "CSV", "JSON"].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                selectedFormat === fmt
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-white/10 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Format</th>
                <th className="p-4">Size</th>
                <th className="p-4">Indexing Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocs.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{doc.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{doc.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{doc.category}</td>
                  <td className="p-4">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {doc.format}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{doc.size}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
