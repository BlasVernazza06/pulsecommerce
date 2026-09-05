"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  ChevronDown,
  SquarePen,
  Scan,
  PanelRight,
  Maximize2,
  MoreHorizontal,
  X,
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
import { useSimulatedChat } from "../hooks/use-simulated-chat";
import { AiChatSourceCards } from "./ai-chat-source-card";
import { AiChatMessageItem } from "./ai-chat-message-item";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pulsecommerce/ui";

export interface AiChatViewProps {
  onClose?: () => void;
  className?: string;
}

/**
 * `<AiChatView />`
 * Vista inmersiva y completa de Chat IA.
 */
export function AiChatView({ onClose, className = "" }: AiChatViewProps) {
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

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

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
        className={`w-full max-w-4xl h-[92vh] max-h-[900px] flex flex-col bg-[#141417] border border-white/[0.08] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden relative select-text text-zinc-200 font-sans ${className}`}
      >
        {/* ─── 1. TOP HEADER BAR ─── */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-[#141417]/80 backdrop-blur-xl z-20 shrink-0 select-none">
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

          <div className="flex items-center gap-3">
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

            <div className="h-4 w-[1px] bg-white/[0.08]" />

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
            </div>
          </div>
        </header>

        {/* ─── 2. CHAT SCROLL CONTENT AREA ─── */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
        >
          {latestAssistantMessage?.sources && (
            <div className="w-full flex justify-end">
              <AiChatSourceCards
                sources={latestAssistantMessage.sources}
                onGetReport={() => sendMessage("Generate a comprehensive summary report")}
              />
            </div>
          )}

          {messages.map((msg) => (
            <AiChatMessageItem
              key={msg.id}
              message={msg}
              onQuoteSelection={quoteSelection}
            />
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2.5 text-xs text-blue-400 font-medium pl-3.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Gemini 3 Pro procesando respuesta...</span>
            </div>
          )}
        </div>

        {/* ─── 3. FLOATING TEXT SELECTION TOOLTIP ("Reply") ─── */}
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

        {/* ─── 4. SUGGESTIONS DOCK & SHORTCUTS ─── */}
        <div className="px-5 pb-3 flex flex-col gap-2 shrink-0 select-none">
          {activeSuggestions.length > 0 && (
            <div className="rounded-2xl bg-[#1d1d22]/95 border border-white/[0.08] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl space-y-2">
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

          {/* ─── 5. INPUT BAR & CONTROLS DOCK ─── */}
          <div className="rounded-2xl bg-[#1a1a1e] border border-white/[0.1] focus-within:border-blue-500/50 p-2.5 shadow-xl flex flex-col gap-2 transition-colors">
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

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Adjuntar archivo"
                >
                  <Paperclip className="h-4 w-4" />
                </button>

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
