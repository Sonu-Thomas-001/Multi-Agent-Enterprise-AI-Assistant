import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Acme Digital Solutions | Multi-Agent Enterprise AI Assistant",
  description: "Next.js Multi-Agent Enterprise Intelligence Platform powered by FastAPI, LangGraph, and Hybrid RAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b0f17] text-slate-100 min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
        <Sidebar />
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
