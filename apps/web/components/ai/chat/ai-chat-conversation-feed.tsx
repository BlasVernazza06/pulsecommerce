"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, Quote, Loader2 } from "lucide-react";
import { type ChatMessage } from "../ai-types";
import { AiChatSourceCards } from "./ai-chat-source-card";
import { AiChatHeader } from "./ai-chat-header";
import { AiChatMessageItem } from "./ai-chat-message-item";
import { type NavTabId } from "@/components/layout/sidebar";

export interface AiChatConversationFeedProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  selectionTooltip: { text: string; x: number; y: number } | null;
  onQuoteSelection: (text?: string) => void;
  onCloseChat: () => void;
  onNewChat?: () => void;
  onGetReport?: () => void;
  activeTab?: NavTabId;
  onSelectShortcut?: (prompt: string) => void;
}

/**
 * `<AiChatConversationFeed />`
 * Área de conversación del Chat IA envolvente.
 */
export function AiChatConversationFeed({
  messages,
  isGenerating,
  selectionTooltip,
  onQuoteSelection,
  onCloseChat,
  onNewChat,
  onGetReport,
  activeTab = "home",
  onSelectShortcut,
}: AiChatConversationFeedProps) {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const handleScroll = () => {
    const el = chatScrollRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 80);
  };

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 60);
    return () => clearTimeout(timeout);
  }, [messages, isGenerating]);

  const latestAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.sender === "assistant");

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden select-text font-sans">
      {/* ─── 1. HEADER MODULAR CON ACCIONES Y ATAJOS ─── */}
      <AiChatHeader
        activeTab={activeTab}
        onSelectShortcut={onSelectShortcut}
        onNewChat={onNewChat}
        onCloseChat={onCloseChat}
      />

      {/* ─── 2. FEED SCROLLEABLE DE MENSAJES & ADJUNTOS ─── */}
      <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col bg-[#131317]">
        <div
          ref={chatScrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 pt-4 pb-8 space-y-4 bg-[#131317] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
        >
          {/* Tarjetas de fuentes apiladas */}
          {latestAssistantMessage?.sources && latestAssistantMessage.sources.length > 0 && (
            <div className="w-full flex justify-end">
              <AiChatSourceCards
                sources={latestAssistantMessage.sources}
                onGetReport={onGetReport}
              />
            </div>
          )}

          {/* Historial de Mensajes */}
          {messages.map((msg) => (
            <AiChatMessageItem
              key={msg.id}
              message={msg}
              onQuoteSelection={onQuoteSelection}
            />
          ))}

          {/* Indicador de procesamiento / streaming */}
          {isGenerating && (
            <div className="flex items-center gap-2.5 text-xs text-blue-400 font-medium pl-3 py-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Sintetizando respuesta de IA...</span>
            </div>
          )}
        </div>

        {/* Botón flotante para scroll al final */}
        <AnimatePresence>
          {showScrollBottom && (
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center z-30 pointer-events-none">
              <motion.button
                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                type="button"
                onClick={scrollToBottom}
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c22]/95 hover:bg-[#25252e] border border-white/[0.14] hover:border-white/[0.24] text-xs font-medium text-zinc-200 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer select-none ring-1 ring-black/40 active:scale-95"
              >
                <ArrowDown className="h-3.5 w-3.5 text-blue-400 stroke-[2.5]" />
                <span>Ir al final</span>
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── 3. TOOLTIP FLOTANTE DE CITAS ("Reply") ─── */}
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
              onClick={() => onQuoteSelection()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-[0_4px_16px_rgba(59,130,246,0.6)] cursor-pointer transition-transform active:scale-95"
            >
              <Quote className="h-3 w-3 fill-white" />
              <span>Reply</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
