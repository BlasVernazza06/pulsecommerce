"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export interface AiCollapsedCapsuleProps {
  onExpand: () => void;
  className?: string;
}

/**
 * `<AiCollapsedCapsule />`
 * Cápsula flotante minimalista que se muestra cuando la barra de IA ha sido colapsada.
 */
export function AiCollapsedCapsule({
  onExpand,
  className = "",
}: AiCollapsedCapsuleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={onExpand}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121216]/90 hover:bg-[#1a1a22] border border-white/[0.12] hover:border-white/[0.22] text-xs font-medium text-zinc-300 hover:text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer transition-all ${className}`}
      aria-label="Abrir asistente de IA (Ctrl+K)"
    >
      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
      <span>Asistente IA</span>
      <kbd className="text-[10px] font-mono text-zinc-400 bg-white/[0.08] px-1.5 py-0.5 rounded">
        Ctrl+K
      </kbd>
    </motion.button>
  );
}
