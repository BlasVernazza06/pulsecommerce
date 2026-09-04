"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pulsecommerce/ui";

export interface AiVoicePillProps {
  /** Callback al cancelar o cerrar el modo de escucha */
  onCancel: () => void;
  /** Callback al confirmar y procesar la orden de voz */
  onConfirm: () => void;
  className?: string;
}

/**
 * `<AiVoicePill />`
 * Cápsula flotante minimalista de captura de voz (Voice POS).
 * - Ondas de audio en blanco puro con movimiento orgánico.
 * - Botones táctiles refinados con Tooltips accesibles.
 */
export function AiVoicePill({ onCancel, onConfirm, className = "" }: AiVoicePillProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>([
    20, 35, 60, 90, 50, 80, 100, 75, 45, 85, 60, 35, 20,
  ]);

  // Simulación orgánica de espectro de ondas de audio
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevels([
        Math.floor(Math.random() * 25 + 15),
        Math.floor(Math.random() * 45 + 20),
        Math.floor(Math.random() * 65 + 25),
        Math.floor(Math.random() * 90 + 30),
        Math.floor(Math.random() * 75 + 20),
        Math.floor(Math.random() * 100 + 35),
        Math.floor(Math.random() * 85 + 25),
        Math.floor(Math.random() * 100 + 30),
        Math.floor(Math.random() * 70 + 20),
        Math.floor(Math.random() * 85 + 25),
        Math.floor(Math.random() * 60 + 20),
        Math.floor(Math.random() * 40 + 15),
        Math.floor(Math.random() * 25 + 10),
      ]);
    }, 85);

    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <div className={`flex items-center justify-between gap-3 w-full px-1 py-0.5 select-none ${className}`}>
        {/* Botón Cancelar (X sutil) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              type="button"
              onClick={onCancel}
              className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center shrink-0 outline-none shadow-sm cursor-pointer"
              aria-label="Cancelar grabación"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs mb-1.5">
            <span>Cancelar grabación</span>
            <kbd className="ml-1.5 text-[9px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Esc</kbd>
          </TooltipContent>
        </Tooltip>

        {/* Visualizador de Ondas de Audio (Blanco Puro) */}
        <div className="flex items-center gap-[3px] h-6 px-3">
          {audioLevels.map((level, i) => (
            <div
              key={i}
              style={{ height: `${Math.max(level, 16)}%` }}
              className="w-[2.5px] min-h-[4px] rounded-full bg-white transition-all duration-75 ease-out"
            />
          ))}
        </div>

        {/* Botón Confirmar / Enviar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              type="button"
              onClick={onConfirm}
              className="h-8 w-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.25)] outline-none cursor-pointer"
              aria-label="Confirmar orden de voz"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs mb-1.5">
            <span>Confirmar y procesar</span>
            <kbd className="ml-1.5 text-[9px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Enter</kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}


