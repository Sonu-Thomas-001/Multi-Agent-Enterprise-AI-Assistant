/**
 * Empty State Component
 *
 * Renders a centered placeholder when a list, table, or container has no data.
 * Used across Documents, Knowledge, Chat, and Agents pages.
 *
 * @example
 * <EmptyState
 *   icon={FileText}
 *   title="No documents found"
 *   description="Upload enterprise documents to begin RAG indexing."
 *   actionLabel="Upload Documents"
 *   onAction={() => console.log("open upload")}
 * />
 */
"use client";

import { type LucideIcon, FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      role="status"
      aria-label={title}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-white/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-500" />
      </div>
      <h3 className="text-sm font-bold text-slate-300 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
