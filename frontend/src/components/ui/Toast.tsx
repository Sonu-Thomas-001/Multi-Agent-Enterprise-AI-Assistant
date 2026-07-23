/**
 * Toast Notification System
 *
 * Provides a global toast notification system using Zustand store + Framer Motion.
 * Supports success, error, warning, and info variants with auto-dismiss.
 *
 * @example
 * // In any component:
 * import { useToast } from "@/components/ui/Toast";
 * const { toast } = useToast();
 * toast({ title: "Saved!", variant: "success" });
 */
"use client";

import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useEffect } from "react";

/* ─── Toast Types ─── */
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

/* ─── Toast Store ─── */
interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `toast-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/** Hook for consuming toasts in components */
export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  return {
    toast: (opts: Omit<ToastItem, "id">) => addToast(opts),
    success: (title: string, description?: string) => addToast({ title, description, variant: "success" }),
    error: (title: string, description?: string) => addToast({ title, description, variant: "error" }),
    warning: (title: string, description?: string) => addToast({ title, description, variant: "warning" }),
    info: (title: string, description?: string) => addToast({ title, description, variant: "info" }),
  };
}

/* ─── Variant Styles ─── */
const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof CheckCircle2; bg: string; border: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bg: "bg-emerald-500/10", border: "border-emerald-500/30", iconColor: "text-emerald-400" },
  error: { icon: XCircle, bg: "bg-rose-500/10", border: "border-rose-500/30", iconColor: "text-rose-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10", border: "border-amber-500/30", iconColor: "text-amber-400" },
  info: { icon: Info, bg: "bg-indigo-500/10", border: "border-indigo-500/30", iconColor: "text-indigo-400" },
};

/* ─── Single Toast Item ─── */
function ToastNotification({ toast }: { toast: ToastItem }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const config = VARIANT_CONFIG[toast.variant];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl max-w-sm ${config.bg} ${config.border}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white">{toast.title}</p>
        {toast.description && <p className="text-[11px] text-slate-300 mt-0.5">{toast.description}</p>}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-white transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/* ─── Toast Container (mount in layout) ─── */
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed top-20 right-6 z-[100] flex flex-col gap-2"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
