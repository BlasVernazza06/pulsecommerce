"use client";

import { motion } from "motion/react";

export interface AiCollapsedCapsuleProps {
  onExpand: () => void;
  className?: string;
}

/**
 * `<AiCollapsedCapsule />`
 * Cápsula colapsada minimalista de alta gama para la Barra de Comandos IA.
 * - Diseño sobrio, limpio y sin íconos genéricos.
 * - Indicador de pulso activo de precisión (Glowing Core).
 * - Micro-bordes luminosos con glassmorphism de alta densidad (`backdrop-blur-2xl`).
 * - Micro-interacciones táctiles y spring transitions fluidas con Motion.
 */
export function AiCollapsedCapsule({
  onExpand,
  className = "",
}: AiCollapsedCapsuleProps) {
  return (
    <motion.button
      type="button"
      onClick={onExpand}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group relative h-9 px-3.5 rounded-full bg-[#101014]/90 hover:bg-[#15151b]/95 border border-white/[0.1] hover:border-white/[0.22] shadow-[0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex items-center gap-3 text-xs text-zinc-300 hover:text-white pointer-events-auto select-none outline-none cursor-pointer ${className}`}
      aria-label="Abrir asistente de comandos IA (Ctrl+K)"
    >
      {/* Indicador de estado de pulso operativo (Sin íconos genéricos) */}
      <div className="flex items-center justify-center shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 duration-1000" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
        </span>
      </div>

      {/* Label descriptivo minimalista */}
      <span className="font-medium text-[13px] text-zinc-300 group-hover:text-zinc-100 transition-colors tracking-tight">
        Preguntale a la IA...
      </span>

      {/* Badge de atajo de teclado */}
      <kbd className="inline-flex items-center text-[10px] font-mono text-zinc-400 group-hover:text-zinc-300 bg-white/[0.04] group-hover:bg-white/[0.08] border border-white/[0.08] group-hover:border-white/[0.16] px-1.5 py-0.5 rounded transition-colors select-none">
        Ctrl+K
      </kbd>
    </motion.button>
  );
}


