"use client";

import React from "react";
import { CornerDownRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AiAttachedFilesRow } from "../files/ai-attached-files-row";
import {
  AiAttachButton,
  AiMicButton,
  AiSubmitButton,
  AiClearButton,
  AiMinimizeButton,
  AiExpandButton,
} from "./ai-action-buttons";

export interface AiInputState {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  ref: React.RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
  onClear?: () => void;
}

export interface AiFilesState {
  items: File[];
  onRemove: (index: number) => void;
  onBrowse: () => void;
}

export interface AiQuoteState {
  text: string;
  onRemove: () => void;
}

export interface AiActionsState {
  onSubmit: () => void;
  onToggleVoice: () => void;
  onMinimize?: () => void;
  onExpand?: () => void;
}

export interface AiCommandInputDockProps {
  variant?: "compact" | "expanded";
  input: AiInputState;
  files: AiFilesState;
  quote?: AiQuoteState | null;
  actions: AiActionsState;
  dragProps?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
}

/**
 * `<AiCommandInputDock />`
 * Dock de entrada unificado y de alta velocidad para la barra de comandos de IA.
 * Estructurado mediante contratos de dominio semánticos (`input`, `files`, `quote`, `actions`).
 */
export function AiCommandInputDock({
  variant = "compact",
  input,
  files,
  quote,
  actions,
  dragProps,
  className = "",
}: AiCommandInputDockProps) {
  const isExpanded = variant === "expanded";
  const hasSubmitContent = Boolean(
    input.value.trim() || files.items.length > 0 || quote?.text
  );

  const resolvedPlaceholder = quote?.text
    ? "Escribe tu instrucción para la cita adjunta..."
    : files.items.length > 0
    ? "Escribe una instrucción para los archivos adjuntos..."
    : input.placeholder || "Preguntale al Asistente IA sobre el POS, stock, ventas...";

  const containerClasses = isExpanded
    ? "w-full rounded-[26px] bg-[#1c1c22] border border-white/[0.08] hover:border-white/[0.14] focus-within:border-white/[0.22] p-3 shadow-md flex flex-col gap-1.5 transition-colors"
    : "w-full max-w-2xl rounded-[28px] px-4 pt-3.5 pb-3 bg-[#101014] border border-white/[0.09] focus-within:border-white/[0.18] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col gap-1.5";

  return (
    <div {...dragProps} className={`${containerClasses} ${className}`}>
      {/* ─── 1. CHIP DE CITA CONTEXTUAL (REPLY) ─── */}
      <AnimatePresence>
        {quote?.text && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 mb-1"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CornerDownRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="truncate font-medium">{quote.text}</span>
            </div>
            <button
              type="button"
              onClick={quote.onRemove}
              className="p-0.5 rounded-lg hover:bg-blue-500/20 text-blue-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Quitar cita"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. ÁREA DE TEXTO CON ACCIONES SUPERIORES ─── */}
      <div className="w-full flex items-start justify-between gap-2 px-0.5 py-0.5">
        <textarea
          ref={input.ref}
          rows={1}
          value={input.value}
          onChange={(e) => input.onChange(e.target.value)}
          onKeyDown={input.onKeyDown}
          placeholder={resolvedPlaceholder}
          className="block w-full bg-transparent border-0 p-0 text-[14px] leading-snug text-zinc-100 placeholder:text-zinc-500 focus:ring-0 focus:outline-none resize-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        />

        {/* Botón de expandir conversación en modo compacto */}
        {!isExpanded && actions.onExpand && (
          <AiExpandButton onExpand={actions.onExpand} />
        )}
      </div>

      {/* ─── 3. TOOLBAR INFERIOR DE ACCIONES ─── */}
      <div className="flex items-center justify-between gap-2.5 pt-1.5 border-t border-white/[0.05]">
        {/* Lado izquierdo: Botón de adjuntar y carrusel de archivos */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="shrink-0 flex items-center justify-center p-0.5">
            <AiAttachButton onClick={files.onBrowse} />
          </div>

          <AiAttachedFilesRow
            files={files.items}
            onRemoveFile={files.onRemove}
          />
        </div>

        {/* Lado derecho: Atajos, Botón Limpiar, Minimizar, Micrófono y Enviar */}
        <div className="flex items-center gap-2 shrink-0">
          {input.onClear && (
            <AiClearButton
              isVisible={input.value.length > 0}
              onClear={input.onClear}
            />
          )}

          {!isExpanded && actions.onMinimize && (
            <AiMinimizeButton onMinimize={actions.onMinimize} />
          )}

          <kbd className="hidden sm:inline-flex items-center text-[11px] font-mono text-zinc-500 bg-white/[0.02] border border-white/[0.05] px-2 py-0.5 rounded select-none">
            Ctrl+K
          </kbd>

          <AiMicButton onClick={actions.onToggleVoice} />

          <AiSubmitButton
            onClick={actions.onSubmit}
            hasContent={hasSubmitContent}
          />
        </div>
      </div>
    </div>
  );
}
