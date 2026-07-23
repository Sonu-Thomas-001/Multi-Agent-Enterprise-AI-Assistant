/**
 * Skeleton Loader Component
 *
 * Provides shimmer-animated placeholder blocks for loading states.
 * Accepts className for custom sizing and shape overrides.
 *
 * @example
 * <Skeleton className="w-40 h-4" />              // Text line
 * <Skeleton className="w-10 h-10 rounded-full" /> // Avatar circle
 * <SkeletonCard />                                 // Full card placeholder
 */
"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-800/60",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Pre-composed skeleton card for dashboard/list loading states */
export function SkeletonCard() {
  return (
    <div className="glass-card p-5 rounded-2xl space-y-3" role="status" aria-label="Loading card">
      <div className="flex items-center justify-between">
        <Skeleton className="w-28 h-3" />
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>
      <Skeleton className="w-20 h-7" />
      <Skeleton className="w-36 h-2.5" />
    </div>
  );
}

/** Skeleton row for table/list loading */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl" role="status" aria-label="Loading row">
      <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-48 h-3" />
        <Skeleton className="w-32 h-2.5" />
      </div>
      <Skeleton className="w-16 h-5 rounded-full" />
    </div>
  );
}

/** Skeleton for chat message bubbles */
export function SkeletonMessage() {
  return (
    <div className="flex gap-4" role="status" aria-label="Loading message">
      <Skeleton className="w-9 h-9 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-1 max-w-2xl">
        <Skeleton className="w-32 h-3" />
        <Skeleton className="w-full h-20 rounded-2xl" />
        <Skeleton className="w-48 h-3" />
      </div>
    </div>
  );
}
