"use client";

import { motion } from "motion/react";
import { Video, FileText, ArrowUpRight } from "lucide-react";
import { type ChatSourceCard } from "../ai-types";

export interface AiChatSourceCardsProps {
  sources?: ChatSourceCard[];
  onGetReport?: () => void;
}

export function AiChatSourceCards({ sources, onGetReport }: AiChatSourceCardsProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      {/* Tarjetas superpuestas estilo Stack (efecto escalonado) */}
      <div className="relative flex flex-col items-end">
        {sources.map((source, index) => {
          const isFirst = index === 0;
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 350, damping: 25 }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#232328]/90 hover:bg-[#2c2c33] border border-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md cursor-pointer transition-all duration-200 select-none ${
                isFirst
                  ? "relative z-10 -mb-2 scale-[0.96] opacity-80"
                  : "relative z-20"
              }`}
              style={{ minWidth: "200px", maxWidth: "230px" }}
            >
              {/* Icono temático de fuente */}
              <div className="h-7 w-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                {source.type === "meeting" ? (
                  <Video className="h-3.5 w-3.5 text-blue-400" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-emerald-400" />
                )}
              </div>

              {/* Información de título y fecha */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-zinc-100 truncate">
                  {source.title}
                </span>
                {source.date && (
                  <span className="text-[10px] text-zinc-400 truncate">
                    {source.date}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Botón de acción: "Get a detailed report" */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onGetReport}
        className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-medium text-zinc-200 hover:text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
      >
        <span>Get a detailed report</span>
        <ArrowUpRight className="h-3 w-3 text-zinc-400" />
      </motion.button>
    </div>
  );
}
