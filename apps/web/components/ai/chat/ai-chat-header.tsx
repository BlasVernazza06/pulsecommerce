"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  SquarePen,
  Share2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { type NavTabId } from "@/components/layout/sidebar";
import {
  CONTEXT_SHORTCUTS,
  ALL_SYSTEM_SHORTCUTS,
  type ShortcutItem,
} from "../ai-constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@pulsecommerce/ui";

export interface AiChatHeaderProps {
  activeTab?: NavTabId;
  onSelectShortcut?: (prompt: string) => void;
  onNewChat?: () => void;
  onCloseChat: () => void;
  className?: string;
}

/**
 * `<AiChatHeader />`
 * Header contextual para la vista de conversación de IA.
 */
export function AiChatHeader({
  activeTab = "home",
  onSelectShortcut,
  onNewChat,
  onCloseChat,
  className = "",
}: AiChatHeaderProps) {
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const shortcuts: ShortcutItem[] =
    CONTEXT_SHORTCUTS[activeTab] || ALL_SYSTEM_SHORTCUTS;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isActionsOpen) {
        setIsActionsOpen(false);
      }
    }
    if (isActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActionsOpen]);

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-[#131317] z-20 shrink-0 select-none relative ${className}`}
    >
      {/* Lado Izquierdo: Botón de Acciones con Menú Desplegable Minimalista */}
      <div ref={actionsMenuRef} className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsActionsOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
            isActionsOpen
              ? "bg-white/[0.12] text-white ring-1 ring-white/10"
              : "hover:bg-white/[0.06] text-zinc-200"
          }`}
          aria-expanded={isActionsOpen}
          aria-label="Desplegar menú de acciones y shortcuts"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          <span>Acciones</span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
              isActionsOpen ? "rotate-180 text-zinc-200" : ""
            }`}
          />
        </button>

        {/* Menú Desplegable de Atajos Rápidos */}
        <AnimatePresence>
          {isActionsOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="absolute top-full left-0 mt-2 z-50 w-72 rounded-2xl bg-[#16161c]/95 border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl p-1.5 flex flex-col gap-0.5 overflow-hidden ring-1 ring-white/5"
            >
              <div className="px-2.5 py-1.5 text-[11px] font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] mb-1">
                <span>Atajos Rápidos</span>
                <span className="text-[10px] text-zinc-500 font-mono">Acción directa</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
                {shortcuts.map((shortcut) => (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => {
                      onSelectShortcut?.(shortcut.prompt);
                      setIsActionsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer group text-left"
                  >
                    <span className="truncate pr-2 font-medium">{shortcut.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lado Derecho: Acciones (New Chat, Share Pill, More, Close) */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onNewChat || onCloseChat}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              aria-label="Nuevo chat"
            >
              <SquarePen className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Nuevo chat
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer ml-1 shadow-sm"
            >
              <Share2 className="h-3 w-3" />
              <span>Share</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Compartir resumen o conversación
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-full border border-border hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer ml-0.5"
              aria-label="Más opciones"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Más opciones
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onCloseChat}
              className="p-1.5 rounded-full border border-border hover:border-red-900/20 hover:bg-red-500/15 text-zinc-400 hover:text-red-300 transition-colors cursor-pointer ml-0.5"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <span>Cerrar</span>
            <kbd className="ml-1 text-[10px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Esc</kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
