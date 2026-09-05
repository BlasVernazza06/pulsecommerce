"use client";

import { motion } from "motion/react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { type NavTabId } from "@/components/layout/sidebar";
import {
  CONTEXT_SHORTCUTS,
  ALL_SYSTEM_SHORTCUTS,
  type ShortcutItem,
} from "../ai-constants";

export interface AiShortcutCarouselProps {
  activeTab?: NavTabId;
  onSelectShortcut: (prompt: string) => void;
  className?: string;
}

/**
 * `<AiShortcutCarousel />`
 * Fila de píldoras / chips interactivos con sugerencias contextuales
 * adaptadas a la pestaña activa en el POS.
 */
export function AiShortcutCarousel({
  activeTab = "home",
  onSelectShortcut,
  className = "",
}: AiShortcutCarouselProps) {
  const shortcuts: ShortcutItem[] =
    CONTEXT_SHORTCUTS[activeTab] || ALL_SYSTEM_SHORTCUTS;

  return (
    <div
      className={`w-full max-w-2xl flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      <div className="flex items-center gap-1.5 shrink-0 px-0.5">
        <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full shrink-0">
          <Sparkles className="h-3 w-3 text-blue-400" />
          <span>Sugerencias</span>
        </span>

        {shortcuts.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSelectShortcut(item.prompt)}
            className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium text-zinc-300 hover:text-white shadow-sm transition-all duration-150 shrink-0 cursor-pointer"
          >
            <span>{item.label}</span>
            <ArrowUpRight className="h-3 w-3 text-zinc-500 group-hover:text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
