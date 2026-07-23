"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!className) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-mono text-[11px] border border-indigo-500/20">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-white/10 my-3 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/10">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{lang || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          {copied ? (
            <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
          ) : (
            <><Copy className="w-3 h-3" /> Copy</>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
        <code className={`${className} text-slate-200`}>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-enterprise">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ className, children, ...props }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-mono text-[11px] border border-indigo-500/20" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          h1: ({ children }) => <h1 className="text-base font-extrabold text-white mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-bold text-white mt-2 mb-1">{children}</h3>,
          p: ({ children }) => <p className="text-xs text-slate-200 leading-relaxed mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-xs text-slate-200 space-y-1 mb-2 pl-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-xs text-slate-200 space-y-1 mb-2 pl-1">{children}</ol>,
          li: ({ children }) => <li className="text-xs text-slate-200 leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-indigo-400 underline hover:text-indigo-300 transition-colors" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-indigo-500/50 pl-3 my-2 text-xs text-slate-300 italic bg-indigo-500/5 py-2 pr-3 rounded-r-xl">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-white/10">
              <table className="w-full text-xs text-left">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-900/80 text-slate-300 font-bold border-b border-white/10">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-white/5 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3 py-2 text-[11px] font-bold text-slate-300 uppercase tracking-wider">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 text-[11px] text-slate-200">{children}</td>,
          hr: () => <hr className="border-white/10 my-3" />,
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
