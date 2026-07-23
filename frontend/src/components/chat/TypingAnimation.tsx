"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingAnimation({ text, speed = 8, onComplete }: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    setDone(false);

    const timer = setInterval(() => {
      if (idx.current < text.length) {
        const chunkSize = Math.min(3, text.length - idx.current);
        setDisplayed((prev) => prev + text.slice(idx.current, idx.current + chunkSize));
        idx.current += chunkSize;
      } else {
        setDone(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayed}
      {!done && (
        <span className="inline-block w-1.5 h-4 bg-indigo-400 rounded-sm ml-0.5 animate-pulse align-text-bottom" />
      )}
    </span>
  );
}

interface StreamingDotsProps {
  label?: string;
}

export function StreamingDots({ label = "Thinking" }: StreamingDotsProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-indigo-300">
      <span className="font-medium">{label}</span>
      <span className="flex gap-1">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
        />
      </span>
    </div>
  );
}
