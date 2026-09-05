"use client";

import React from "react";
import { Plus, Mic, ArrowUp, X, ChevronDown, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@pulsecommerce/ui";

export interface AiAttachButtonProps {
  onClick: () => void;
  className?: string;
}

export function AiAttachButton({ onClick, className = "" }: AiAttachButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.08, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          type="button"
          onClick={onClick}
          className={`h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-100 flex items-center justify-center outline-none shadow-sm cursor-pointer ${className}`}
          aria-label="Adjuntar comprobante o archivo"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs mb-1.5">
        <span>Adjuntar archivo o comprobante</span>
        <p className="text-[10px] text-zinc-400">PDF, Word, Excel, ODT, Fotos (OCR IA)</p>
      </TooltipContent>
    </Tooltip>
  );
}

export interface AiMicButtonProps {
  onClick: () => void;
  className?: string;
}

export function AiMicButton({ onClick, className = "" }: AiMicButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial="rest"
          whileHover="hover"
          animate="rest"
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={onClick}
          className={`h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-100 flex items-center justify-center outline-none shadow-sm cursor-pointer ${className}`}
          aria-label="Dictar por voz"
        >
          <motion.div
            variants={{
              hover: {
                rotate: [0, -15, 15, -8, 8, 0],
                x: [0, -2, 2, -1, 1, 0],
                transition: { duration: 0.48, ease: "easeInOut" },
              },
              rest: {
                rotate: 0,
                x: 0,
                transition: { duration: 0.2 },
              },
            }}
          >
            <Mic className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs mb-1.5">
        <span>Dictar por voz</span>
        <kbd className="ml-1.5 text-[10px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Voice POS</kbd>
      </TooltipContent>
    </Tooltip>
  );
}

export interface AiSubmitButtonProps {
  onClick: () => void;
  hasContent: boolean;
  className?: string;
}

export function AiSubmitButton({
  onClick,
  hasContent,
  className = "",
}: AiSubmitButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={hasContent ? { scale: 1.08 } : {}}
          whileTap={hasContent ? { scale: 0.92 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          type="button"
          onClick={onClick}
          disabled={!hasContent}
          className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 outline-none ${
            hasContent
              ? "bg-white text-zinc-950 hover:bg-zinc-200 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              : "bg-white/[0.04] text-zinc-600 border border-white/[0.04] cursor-not-allowed"
          } ${className}`}
          aria-label="Enviar consulta"
        >
          <ArrowUp className="h-4 w-4 stroke-[2.5]" />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs mb-1.5">
        <span>Enviar consulta</span>
        <kbd className="ml-1.5 text-[10px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Enter</kbd>
      </TooltipContent>
    </Tooltip>
  );
}

export interface AiClearButtonProps {
  onClear: () => void;
  isVisible: boolean;
  className?: string;
}

export function AiClearButton({ onClear, isVisible, className = "" }: AiClearButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              type="button"
              onClick={onClear}
              className={`h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/40 flex items-center justify-center outline-none shadow-sm cursor-pointer ${className}`}
              aria-label="Limpiar texto"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs py-0.5 px-2 mb-1.5">
            <span>Limpiar texto</span>
            <kbd className="ml-1 text-[9px] font-mono bg-white/10 px-1 py-0.2 rounded text-zinc-300">Esc</kbd>
          </TooltipContent>
        </Tooltip>
      )}
    </AnimatePresence>
  );
}

export interface AiMinimizeButtonProps {
  onMinimize: () => void;
  className?: string;
}

export function AiMinimizeButton({ onMinimize, className = "" }: AiMinimizeButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial="rest"
          whileHover="hover"
          animate="rest"
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={onMinimize}
          className={`h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-100 flex items-center justify-center outline-none shadow-sm cursor-pointer ${className}`}
          aria-label="Minimizar barra de IA"
        >
          <motion.div
            variants={{
              hover: {
                y: 3,
                transition: { type: "spring", stiffness: 450, damping: 18 },
              },
              rest: {
                y: 0,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              },
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs mb-1.5">
        <span>Minimizar barra</span>
        <kbd className="ml-1 text-[10px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Esc</kbd>
      </TooltipContent>
    </Tooltip>
  );
}

export interface AiExpandButtonProps {
  onExpand: () => void;
  className?: string;
}

export function AiExpandButton({ onExpand, className = "" }: AiExpandButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          initial="rest"
          whileHover="hover"
          animate="rest"
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onExpand}
          className={`p-1 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer shrink-0 ${className}`}
          aria-label="Desplegar conversación completa"
        >
          <motion.div
            variants={{
              hover: {
                scale: [1, 0.72, 1.25, 1],
                transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
              },
              rest: {
                scale: 1,
                transition: { duration: 0.2 },
              },
            }}
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </motion.div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs mb-1">
        <span>Desplegar conversación</span>
      </TooltipContent>
    </Tooltip>
  );
}
