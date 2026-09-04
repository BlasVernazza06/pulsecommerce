"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  ChevronDown,
  ChevronUp,
  SquarePen,
  Scan,
  PanelRight,
  Maximize2,
  MoreHorizontal,
  X,
  ArrowUpRight,
  ArrowRight,
  CornerDownRight,
  Paperclip,
  Sparkles,
  Globe,
  AudioLines,
  ArrowUp,
  Quote,
  Loader2,
} from "lucide-react";
import { useSimulatedChat } from "./use-simulated-chat";
import { AiChatSourceCards } from "./ai-chat-source-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pulsecommerce/ui";

export interface AiChatLayoutProps {
  onClose?: () => void;
  className?: string;
}

/**
 * `<AiChatLayout />`
 * Layout envolvente de Chat IA de Nivel Tier-1.
 * Encapsula la vista de chat hacia arriba junto con la barra de comando y sugerencias en la base.
 */
export function AiChatLayout({ onClose, className = "" }: AiChatLayoutProps) {
  const {
    messages,
    inputValue,
    setInputValue,
    quotedText,
    removeQuote,
    isPersonalized,
    setIsPersonalized,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    isGenerating,
    selectionTooltip,
    handleMouseUp,
    quoteSelection,
    sendMessage,
    handleKeyDown,
    activeSuggestions,
  } = useSimulatedChat();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al recibir o generar mensajes
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Ajuste automático de altura del input
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 24), 140);
    textarea.style.height = `${nextHeight}px`;
  }, [inputValue]);

  const latestAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.sender === "assistant");

  return (
    <TooltipProvider delayDuration={200}>
      <div
        onMouseUp={handleMouseUp}
        className={`w-full max-w-4xl h-[92vh] max-h-[920px] flex flex-col bg-[#141417] border border-white/[0.08] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden relative select-text text-zinc-200 font-sans ${className}`}
      >
        {/* ─── 1. HEADER ESTRUCTURAL SUPERIOR ─── */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#141417]/80 backdrop-blur-xl z-20 shrink-0 select-none">
          {/* Lado izquierdo: Selector de sesión / Nuevo Chat */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.06] text-sm font-medium text-zinc-200 transition-colors cursor-pointer group"
            >
              <div className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors flex items-center justify-center">
                <MessageSquare className="h-4 w-4" />
              </div>
              <span>New AI chat</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>
          </div>

          {/* Lado derecho: Toggle Personalize + Acciones estructurales de ejemplo */}
          <div className="flex items-center gap-3">
            {/* Toggle Personalize */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400">Personalize</span>
              <button
                type="button"
                role="switch"
                aria-checked={isPersonalized}
                onClick={() => setIsPersonalized((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPersonalized ? "bg-blue-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isPersonalized ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Separador vertical */}
            <div className="h-4 w-[1px] bg-white/[0.08]" />

            {/* Iconos de la barra superior (ejemplos estructurales sin acción rígida) */}
            <div className="flex items-center gap-1 text-zinc-400">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Nuevo documento / nota
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <Scan className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Enfoque y captura de pantalla
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <PanelRight className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Panel lateral
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Pantalla completa
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Más opciones
                </TooltipContent>
              </Tooltip>

              {onClose && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-red-400 transition-colors cursor-pointer ml-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Cerrar
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </header>

        {/* ─── 2. ÁREA PRINCIPAL DE CONVERSACIÓN (SCROLL HACIA ARRIBA) ─── */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
        >
          {/* Tarjetas de fuentes apiladas en la esquina superior derecha */}
          {latestAssistantMessage?.sources && (
            <div className="w-full flex justify-end">
              <AiChatSourceCards
                sources={latestAssistantMessage.sources}
                onGetReport={() => sendMessage("Generate a comprehensive summary report")}
              />
            </div>
          )}

          {/* Historial de Mensajes */}
          {messages.map((msg) => {
            if (msg.sender === "user") {
              return (
                <div key={msg.id} className="flex flex-col items-end gap-1.5">
                  {msg.quotedText && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg max-w-lg truncate">
                      <CornerDownRight className="h-3.5 w-3.5 shrink-0" />
                      <span className="italic truncate">&quot;{msg.quotedText}&quot;</span>
                    </div>
                  )}
                  <div className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white text-sm max-w-lg shadow-md font-medium">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-zinc-500 px-1">{msg.timestamp}</span>
                </div>
              );
            }

            return (
              <div key={msg.id} className="space-y-4">
                {/* Indicador de estado animado (Status step) */}
                {msg.statusText && (
                  <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-medium">
                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                    </div>
                    <span>{msg.statusText}</span>
                  </div>
                )}

                {/* Encabezado de la sección con bullet + badge de tiempo + chevron */}
                {msg.sectionTitle && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                      <h2 className="text-base font-semibold text-zinc-100 tracking-tight truncate">
                        {msg.sectionTitle}
                      </h2>
                      {msg.sourceBadge && (
                        <a
                          href={msg.sourceBadge.url || "#"}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-mono text-zinc-300 transition-colors ml-1"
                        >
                          <span>{msg.sourceBadge.time}</span>
                          <ArrowUpRight className="h-3 w-3 text-zinc-400" />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-md hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Cuerpo del mensaje con texto enriquecido y selección interactiva */}
                <div className="text-sm leading-relaxed text-zinc-300 space-y-3 pl-3.5 border-l border-white/[0.08]">
                  <p>
                    {msg.highlightedText && msg.content.includes(msg.highlightedText) ? (
                      <>
                        {msg.content.split(msg.highlightedText)[0]}
                        <span
                          onClick={() => quoteSelection(msg.highlightedText)}
                          className="bg-blue-500/25 text-blue-200 px-1 py-0.5 rounded border-b border-blue-400/50 cursor-pointer hover:bg-blue-500/40 transition-colors"
                          title="Click para citar este fragmento"
                        >
                          {msg.highlightedText}
                        </span>
                        {msg.content.split(msg.highlightedText)[1]}
                      </>
                    ) : (
                      msg.content
                    )}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Indicador de procesamiento en tiempo real */}
          {isGenerating && (
            <div className="flex items-center gap-2.5 text-xs text-blue-400 font-medium pl-3.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Gemini 3 Pro sintetizando respuesta...</span>
            </div>
          )}
        </div>

        {/* ─── 3. TOOLTIP FLOTANTE DE CITAS AL SELECCIONAR TEXTO ("Reply") ─── */}
        <AnimatePresence>
          {selectionTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 5 }}
              className="fixed z-50 pointer-events-auto"
              style={{
                left: `${selectionTooltip.x}px`,
                top: `${selectionTooltip.y}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <button
                type="button"
                onClick={() => quoteSelection()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-[0_4px_16px_rgba(59,130,246,0.6)] cursor-pointer transition-transform active:scale-95"
              >
                <Quote className="h-3 w-3 fill-white" />
                <span>Reply</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── 4. DOCK DE SUGERENCIAS Y NAVEGACIÓN POR TECLADO ─── */}
        <div className="px-5 pb-3 flex flex-col gap-2 shrink-0 select-none">
          {activeSuggestions.length > 0 && (
            <div className="rounded-2xl bg-[#1d1d22]/95 border border-white/[0.08] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-2">
              {/* Header de Atajos de Teclado */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium px-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300 font-mono text-[10px]">
                      ▲ ▼
                    </kbd>
                    <span>to navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-zinc-300 font-mono text-[10px]">
                      ↵
                    </kbd>
                    <span>to select</span>
                  </span>
                </div>
                <span className="flex items-center gap-1 text-zinc-500">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] font-mono text-[10px]">
                    esc
                  </kbd>
                  <span>to close</span>
                </span>
              </div>

              {/* Lista de Sugerencias Interactivas */}
              <div className="space-y-1">
                {activeSuggestions.map((suggestion, index) => {
                  const isSelected = index === selectedSuggestionIndex;
                  return (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => sendMessage(suggestion.prompt)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-[#2d2d35] text-zinc-100 border border-white/[0.12] shadow-sm scale-[1.005]"
                          : "text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{suggestion.prompt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 5. BARRA DE COMANDO Y ENTRADA INFERIOR ─── */}
          <div className="rounded-2xl bg-[#1a1a1e] border border-white/[0.1] focus-within:border-blue-500/50 p-2.5 shadow-xl flex flex-col gap-2 transition-colors">
            {/* Chip de Cita / Contexto Seleccionado */}
            <AnimatePresence>
              {quotedText && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -4 }}
                  className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CornerDownRight className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span className="truncate font-medium">{quotedText}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeQuote}
                    className="p-0.5 rounded hover:bg-blue-500/20 text-blue-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Textarea Principal */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                } else {
                  handleKeyDown(e);
                }
              }}
              placeholder="Ask AI anything"
              className="w-full bg-transparent border-0 px-2 py-1 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-0 resize-none overflow-y-auto"
            />

            {/* Barra de Herramientas Inferior */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              {/* Controles del Lado Izquierdo */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Adjuntar archivo"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

                {/* Pill Selector de Modelo */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-medium text-zinc-200 cursor-pointer transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Gemini 3 Pro</span>
                </div>

                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Búsqueda web"
                >
                  <Globe className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Más herramientas"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Controles del Lado Derecho: Audio y Envío */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Voice POS / Audio"
                >
                  <AudioLines className="h-4 w-4" />
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() && !quotedText}
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    inputValue.trim() || quotedText
                      ? "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.5)] cursor-pointer"
                      : "bg-blue-500/30 text-white/50 cursor-not-allowed"
                  }`}
                  title="Enviar"
                >
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
