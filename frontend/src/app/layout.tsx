/**
 * Root Layout — Acme Digital Solutions Enterprise AI Platform
 *
 * Provides:
 * - Inter Google Font with display swap for performance
 * - Global dark theme (`<html lang="en" className="dark">`)
 * - Sidebar + Header shared navigation
 * - Toast notification container
 * - Comprehensive SEO meta tags
 * - Viewport configuration for mobile responsiveness
 */
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Acme Digital Solutions | Multi-Agent Enterprise AI Assistant",
  description:
    "Orchestrate 9 specialized AI agents for enterprise research, analytics, code execution, and document analysis. Powered by FastAPI, LangGraph, and Hybrid RAG with BM25 + Vector Reciprocal Rank Fusion.",
  keywords: [
    "enterprise AI",
    "multi-agent",
    "LangGraph",
    "RAG",
    "FastAPI",
    "ChromaDB",
    "LangChain",
  ],
  authors: [{ name: "Acme Digital Solutions" }],
  openGraph: {
    title: "Acme Digital Solutions | Enterprise AI Platform",
    description: "9-agent autonomous AI engine for enterprise intelligence and RAG.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0b0f17] text-slate-100 min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:text-xs focus:font-bold"
        >
          Skip to main content
        </a>
        <Sidebar />
        <Header />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
