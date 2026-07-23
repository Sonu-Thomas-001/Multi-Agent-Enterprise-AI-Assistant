"use client";

import { useState } from "react";
import { api, CitationHighlight } from "@/lib/api";
import {
  Search,
  BookOpen,
  Sparkles,
  FileText,
  Filter,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const CATEGORIES = [
  "All Domains",
  "HR Policies",
  "Engineering SOPs",
  "Incident Reports",
  "Architecture Docs",
  "Financial Reports",
  "IT Knowledge Base",
];

export default function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All Domains");
  const [results, setResults] = useState<CitationHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    const domainFilter = selectedDomain === "All Domains" ? undefined : selectedDomain;
    const res = await api.searchRAG(query, domainFilter, 6);
    setResults(res.citations || []);
    setLoading(false);
  };

  return (
    <div className="pl-64 pt-16 min-h-screen bg-[#0b0f17] text-white p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Hybrid BM25 + Vector Similarity (RRF) Engine
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">Acme Enterprise Knowledge Base</h1>
        <p className="text-xs text-slate-400">Search across 230 indexed HR policies, engineering SOPs, incident post-mortems, and financial reports.</p>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="max-w-3xl mx-auto space-y-4 mb-10">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any search query (e.g. Remote work guidelines, VPN troubleshooting)..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-12 pr-32 py-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 shadow-xl"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-1.5"
          >
            {loading ? "Searching..." : "Hybrid Search"} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedDomain(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedDomain === cat
                  ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="text-center py-16">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Computing reciprocal rank fusion scores across vector store...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300 mb-1">No Matching Documents Found</h3>
            <p className="text-xs text-slate-500">Try broadening your query keywords or selecting 'All Domains'.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-2">
              <span>Retrieved {results.length} Citations with Reciprocal Rank Fusion</span>
              <span>Sorted by RRF Relevance</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((item, idx) => (
                <div key={idx} className="glass-card glass-card-hover p-5 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                        <span className="text-[10px] text-slate-400">{item.category} • {item.domain}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {Math.round(item.score * 100)}% RRF
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/5 leading-relaxed font-mono text-[11px]">
                    "{item.snippet}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="truncate max-w-[200px]">{item.source_file}</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Verified Source
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
