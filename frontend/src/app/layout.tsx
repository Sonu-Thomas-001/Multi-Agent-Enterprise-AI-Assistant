import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Agent Enterprise AI Assistant",
  description: "Enterprise AI platform demonstrating Agentic AI using LangGraph.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased h-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
