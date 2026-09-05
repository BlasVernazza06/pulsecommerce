"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { type NavTabId } from "@/components/layout/sidebar";
import { TooltipProvider } from "@pulsecommerce/ui";
import {
  AiVoicePill,
  AiShortcutCarousel,
  AiCollapsedCapsule,
  AiCommandInputDock,
} from "./dock";
import { AiDropzoneOverlay } from "./files";
import { AiChatConversationFeed } from "./chat";
import { useSimulatedChat, useAiDropzone } from "./hooks";
import { CONTEXT_PLACEHOLDERS } from "./ai-constants";

export interface AiCommandBarProps {
  /** Pestaña activa para adaptar el placeholder contextual y shortcuts */
  activeTab?: NavTabId;
}

/**
 * `<AiCommandBar />`
 * Barra de Comandos Contextual de IA con contenedor envolvente ascendente.
 * Orquesta los estados de:
 * 1. Dropzone en pantalla completa (al arrastrar archivos).
 * 2. Cápsula colapsada minimalista.
 * 3. Dictado por voz (Voice POS).
 * 4. Modal de conversación expandido (con feed scrolleable y dock anidado).
 * 5. Barra de comando compacta habitual.
 */
export function AiCommandBar({ activeTab = "home" }: AiCommandBarProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hook de simulación conversacional rica (mensajes, citas, status, fuentes)
  const {
    messages,
    isGenerating,
    quotedText,
    removeQuote,
    selectionTooltip,
    handleMouseUp,
    quoteSelection,
    sendMessage,
  } = useSimulatedChat();

  const {
    attachedFiles,
    isDraggingOver,
    fileInputRef,
    openFileDialog,
    removeFile,
    clearFiles,
    handleFileInputChange,
    dragProps,
  } = useAiDropzone();

  const toggleCollapse = (collapsed?: boolean) => {
    setIsCollapsed((prev) => (collapsed !== undefined ? collapsed : !prev));
  };

  // 1. Listener global para atajo Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCollapsed(false);
        localStorage.setItem("pulse_ai_bar_collapsed", "false");
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 60);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // 2. Auto-ajuste dinámico de altura del textarea
  useEffect(() => {
    if (isCollapsed) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 22), isChatOpen ? 120 : 180);
    textarea.style.height = `${nextHeight}px`;
  }, [query, isCollapsed, isChatOpen]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const handleConfirmVoice = () => {
    setIsListening(false);
  };

  const handleSubmit = () => {
    if (!query.trim() && attachedFiles.length === 0 && !quotedText) return;
    sendMessage(query, attachedFiles);
    setQuery("");
    clearFiles();
    setIsChatOpen(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = "22px";
    }
  };

  const handleClearQuery = () => {
    setQuery("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "22px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() || attachedFiles.length > 0 || quotedText) {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (quotedText) {
        removeQuote();
      } else if (query.length > 0) {
        handleClearQuery();
      } else if (isChatOpen) {
        setIsChatOpen(false);
      } else {
        toggleCollapse(true);
      }
    }
  };

  const placeholder =
    CONTEXT_PLACEHOLDERS[activeTab] ||
    "Preguntale a la IA sobre cualquier módulo... (Ctrl+K)";

  return (
    <TooltipProvider delayDuration={200}>
      {/* Input nativo oculto para selección de archivos múltiples */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      <div
        onMouseUp={handleMouseUp}
        className="absolute bottom-5 inset-x-0 flex flex-col items-center justify-end px-6 pointer-events-none z-30"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* ─── ESTADO A: DROPZONE ACTIVO AL ARRASTRAR (SOLO SI EL CHAT NO ESTÁ ABIERTO) ─── */}
          {isDraggingOver && !isChatOpen ? (
            <motion.div
              key="dropzone-card"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.85 }}
              {...dragProps}
              className="pointer-events-auto w-full max-w-2xl rounded-[28px] border-2 border-dashed border-blue-400/50 bg-[#101014] ring-4 ring-blue-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-3"
            >
              <AiDropzoneOverlay onBrowseClick={openFileDialog} />
            </motion.div>
          ) : isCollapsed ? (
            /* ─── ESTADO B: CÁPSULA MINIMALISTA COLAPSADA ─── */
            <motion.div
              key="collapsed-capsule"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.85 }}
              className="pointer-events-auto"
            >
              <AiCollapsedCapsule
                onExpand={() => {
                  toggleCollapse(false);
                  setIsChatOpen(false);
                  setTimeout(() => textareaRef.current?.focus(), 80);
                }}
              />
            </motion.div>
          ) : isListening ? (
            /* ─── ESTADO C: CAPTURA DE VOZ (Voice POS Pill) ─── */
            <motion.div
              key="voice-pill"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.85 }}
              className="pointer-events-auto w-full max-w-[320px] rounded-full bg-[#101014] border border-white/[0.12] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.75)] ring-1 ring-white/5"
            >
              <AiVoicePill
                onCancel={toggleListening}
                onConfirm={handleConfirmVoice}
              />
            </motion.div>
          ) : isChatOpen ? (
            /* ─── ESTADO D: MODAL DE CHAT EXPANDIDO ELEVADO ─── */
            <motion.div
              key="chat-modal-view"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
              className="pointer-events-auto w-full max-w-3xl h-[min(68vh,560px)] rounded-[36px] bg-[#131317] border border-white/[0.09] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            >
              {/* 1. Header y Feed de conversación superior */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#131317] relative">
                <AiChatConversationFeed
                  messages={messages}
                  isGenerating={isGenerating}
                  selectionTooltip={selectionTooltip}
                  onQuoteSelection={quoteSelection}
                  onCloseChat={() => setIsChatOpen(false)}
                  onNewChat={() => {
                    sendMessage("Reiniciar sesión y analizar ventas actuales");
                  }}
                  onGetReport={() => sendMessage("Generar reporte detallado de auditoría")}
                  activeTab={activeTab}
                  onSelectShortcut={(prompt: string) => {
                    setQuery(prompt);
                    textareaRef.current?.focus();
                  }}
                />
              </div>

              {/* 2. Dock de entrada inferior anidado */}
              <div className="relative p-4 pt-2 pb-3.5 bg-[#131317] flex flex-col gap-2 shrink-0 select-none z-10">
                <div className="absolute -top-10 inset-x-0 h-10 bg-gradient-to-t from-[#131317] via-[#131317]/80 to-transparent pointer-events-none" />

                <AnimatePresence mode="wait" initial={false}>
                  {isDraggingOver ? (
                    <motion.div
                      key="open-chat-dropzone"
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6, transition: { duration: 0.1 } }}
                      transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.85 }}
                      className="w-full rounded-[26px] border-2 border-dashed border-blue-400/50 bg-[#101014] ring-4 ring-blue-500/10 shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-3 select-none"
                    >
                      <AiDropzoneOverlay onBrowseClick={openFileDialog} />
                    </motion.div>
                  ) : (
                    <AiCommandInputDock
                      variant="expanded"
                      input={{
                        value: query,
                        onChange: setQuery,
                        onKeyDown: handleKeyDown,
                        ref: textareaRef,
                      }}
                      files={{
                        items: attachedFiles,
                        onRemove: removeFile,
                        onBrowse: openFileDialog,
                      }}
                      quote={
                        quotedText
                          ? { text: quotedText, onRemove: removeQuote }
                          : null
                      }
                      actions={{
                        onSubmit: handleSubmit,
                        onToggleVoice: toggleListening,
                      }}
                      dragProps={dragProps}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* ─── ESTADO E: BARRA DE COMANDOS COMPACTA HABITUAL ─── */
            <motion.div
              key="compact-bar-view"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
              className="w-full flex flex-col items-center gap-2.5 pointer-events-auto"
            >
              {/* Carrusel de atajos contextuales */}
              <div className="w-full flex justify-center">
                <AiShortcutCarousel
                  activeTab={activeTab}
                  onSelectShortcut={(prompt: string) => {
                    setQuery(prompt);
                    textareaRef.current?.focus();
                  }}
                />
              </div>

              {/* Dock de comando unificado con contratos semánticos */}
              <AiCommandInputDock
                variant="compact"
                input={{
                  value: query,
                  onChange: setQuery,
                  onKeyDown: handleKeyDown,
                  ref: textareaRef,
                  placeholder,
                  onClear: handleClearQuery,
                }}
                files={{
                  items: attachedFiles,
                  onRemove: removeFile,
                  onBrowse: openFileDialog,
                }}
                quote={
                  quotedText
                    ? { text: quotedText, onRemove: removeQuote }
                    : null
                }
                actions={{
                  onSubmit: handleSubmit,
                  onToggleVoice: toggleListening,
                  onMinimize: () => toggleCollapse(true),
                  onExpand: () => setIsChatOpen(true),
                }}
                dragProps={dragProps}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
