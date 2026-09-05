"use client";

import { motion } from "motion/react";
import { Mic, X, Check } from "lucide-react";

export interface AiVoicePillProps {
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}

/**
 * `<AiVoicePill />`
 * Píldora animada de Voice POS para captura de audio en tiempo real.
 */
export function AiVoicePill({
  onCancel,
  onConfirm,
  className = "",
}: AiVoicePillProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-full bg-gradient-to-r from-blue-950/60 via-[#14141c] to-blue-950/60 border border-blue-500/40 shadow-xl select-none ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-3 w-3 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </div>

        {/* Waveform simulada */}
        <div className="flex items-center gap-1 h-4">
          {[0.4, 0.8, 0.3, 0.9, 0.6, 0.2, 0.7].map((h, i) => (
            <motion.span
              key={i}
              animate={{
                height: ["4px", `${Math.round(h * 16)}px`, "4px"],
              }}
              transition={{
                duration: 0.6 + (i % 3) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-0.5 rounded-full bg-blue-400"
            />
          ))}
        </div>

        <span className="text-xs font-medium text-blue-200">Escuchando...</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Cancelar grabación"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-colors cursor-pointer"
          aria-label="Confirmar dictado"
        >
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
