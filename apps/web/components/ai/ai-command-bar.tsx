"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, ArrowUp, Plus, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { type NavTabId } from "@/components/layout/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pulsecommerce/ui";
import { AiVoicePill } from "./ai-voice-pill";
import { AiShortcutCarousel } from "./ai-shortcut-carousel";
import { AiAttachedFilesRow } from "./ai-attached-files-row";
import { AiDropzoneOverlay } from "./ai-dropzone-overlay";
import { AiCollapsedCapsule } from "./ai-collapsed-capsule";
import { useAiDropzone, ACCEPTED_MIME_TYPES, ACCEPTED_EXTENSIONS } from "./use-ai-dropzone";
import { CONTEXT_PLACEHOLDERS } from "./ai-constants";

export interface AiCommandBarProps {
  /** Pestaña activa para adaptar el placeholder contextual y shortcuts */
  activeTab?: NavTabId;
}

/**
 * `<AiCommandBar />`
 * Barra de Comandos Contextual de IA con coreografía de movimiento fluido (Motion).
 * - Transición orgánica con spring entre cápsula colapsada y barra expandida.
 * - Morphing visual fluido hacia el grabador de voz (Voice POS) y dropzone.
 * - Micro-interacciones con feedback háptico/visual en todos los controles interactivos.
 */
export function AiCommandBar({ activeTab = "home" }: AiCommandBarProps) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    attachedFiles,
    isDraggingOver,
    fileInputRef,
    openFileDialog,
    removeFile,
    handleFileInputChange,
    dragProps,
  } = useAiDropzone();

  const toggleCollapse = (collapsed?: boolean) => {
    setIsCollapsed((prev) => (collapsed !== undefined ? collapsed : !prev));
  };

  // 2. Listener global para atajo Ctrl+K / Cmd+K
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

  // 3. Auto-ajuste dinámico de altura del textarea para expandir hacia arriba
  useEffect(() => {
    if (isCollapsed) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    // Reseteo a 0px para que scrollHeight mida exclusivamente el contenido real
    textarea.style.height = "0px";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 22), 180);
    textarea.style.height = `${nextHeight}px`;
  }, [query, isCollapsed]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const handleConfirmVoice = () => {
    // Pipeline de confirmación y procesamiento de audio
    setIsListening(false);
  };

  const handleSubmit = () => {
    if (!query.trim() && attachedFiles.length === 0) return;
    // Dispatch/procesamiento de la consulta
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (query.length > 0) {
        setQuery("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "22px";
        }
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
        accept={[...ACCEPTED_MIME_TYPES, ...ACCEPTED_EXTENSIONS].join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        aria-hidden="true"
      />

      <div className="absolute bottom-5 inset-x-0 flex flex-col items-center justify-end px-6 pointer-events-none z-30">
        <AnimatePresence mode="wait" initial={false}>
          {/* ─── ESTADO A: DROPZONE ACTIVO AL ARRASTRAR ─── */}
          {isDraggingOver ? (
            <motion.div
              key="dropzone-card"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.85 }}
              {...dragProps}
              className="pointer-events-auto w-full max-w-2xl rounded-2xl border-2 border-dashed border-blue-400/50 bg-[#101014]/95 ring-4 ring-blue-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-3"
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
              className="pointer-events-auto w-full max-w-[320px] rounded-full bg-[#101014]/95 border border-white/[0.12] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.75)] backdrop-blur-2xl ring-1 ring-white/5"
            >
              <AiVoicePill
                onCancel={toggleListening}
                onConfirm={handleConfirmVoice}
              />
            </motion.div>
          ) : (
            /* ─── ESTADO D: BARRA EXPANDIDA COMPLETA ─── */
            <motion.div
              key="expanded-bar"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.08 } }}
              transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.85 }}
              className="w-full flex flex-col items-center gap-2.5"
            >
              {/* 1. Carrusel de acciones rápidas superior */}
              <div className="w-full flex justify-center">
                <AiShortcutCarousel
                  activeTab={activeTab}
                  onSelectShortcut={(prompt: string) => setQuery(prompt)}
                />
              </div>

              {/* 2. Caja principal estructurada */}
              <div
                {...dragProps}
                className="w-full max-w-2xl rounded-2xl bg-[#101014]/90 hover:bg-[#101014]/95 border border-white/[0.09] focus-within:border-white/[0.2] px-3.5 pt-3 pb-2.5 flex flex-col gap-2 transition-colors duration-200 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
              >
                {/* VISTA PRINCIPAL DE COMANDOS */}
                <div className="flex flex-col w-full gap-1.5">
                  {/* Nivel 1: Textarea con auto-ajuste de altura hacia arriba */}
                  <div className="w-full px-0.5 py-0.5">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        attachedFiles.length > 0
                          ? "Escribe una instrucción para los archivos adjuntos..."
                          : placeholder
                      }
                      className="block w-full bg-transparent border-0 p-0 text-[14px] leading-snug text-zinc-100 placeholder:text-zinc-500 focus:ring-0 focus:outline-none resize-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    />
                  </div>


                    {/* Nivel 2: Toolbar inferior con botones y micro-animaciones */}
                    <div className="flex items-center justify-between gap-2.5 pt-1.5 border-t border-white/[0.05]">
                      {/* Lado izquierdo: Botón "+" con contenedor visible para evitar recorte y scroll de archivos */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="shrink-0 flex items-center justify-center p-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.button
                                whileHover={{ scale: 1.08, rotate: 90 }}
                                whileTap={{ scale: 0.92 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                type="button"
                                onClick={openFileDialog}
                                className="h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-100 flex items-center justify-center outline-none shadow-sm cursor-pointer"
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
                        </div>

                        {/* Pills de archivos adjuntos con animación Motion */}
                        <AiAttachedFilesRow
                          files={attachedFiles}
                          onRemoveFile={removeFile}
                        />
                      </div>

                      {/* Lado derecho: Limpiar, Minimizar, Atajo Ctrl+K, Micrófono y Botón de Envío */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Botón de limpiar texto si hay contenido escrito */}
                        <AnimatePresence>
                          {query.length > 0 && (
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
                                  onClick={() => {
                                    setQuery("");
                                    if (textareaRef.current) {
                                      textareaRef.current.style.height = "22px";
                                    }
                                  }}
                                  className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/40 flex items-center justify-center outline-none shadow-sm cursor-pointer"
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

                        {/* Botón Minimizar Barra a Cápsula */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              type="button"
                              onClick={() => toggleCollapse(true)}
                              className="h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-100 flex items-center justify-center outline-none shadow-sm cursor-pointer"
                              aria-label="Minimizar barra de IA"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs mb-1.5">
                            <span>Minimizar barra</span>
                            <kbd className="ml-1 text-[10px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Esc</kbd>
                          </TooltipContent>
                        </Tooltip>

                        <kbd className="hidden sm:inline-flex items-center text-[11px] font-mono text-zinc-500 bg-white/[0.02] border border-white/[0.05] px-2 py-0.5 rounded select-none">
                          Ctrl+K
                        </kbd>

                        {/* Botón Micrófono (Voice POS) */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              type="button"
                              onClick={toggleListening}
                              className="h-8 w-8 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.12] text-zinc-400 hover:text-zinc-100 flex items-center justify-center outline-none shadow-sm cursor-pointer"
                              aria-label="Dictar por voz"
                            >
                              <Mic className="h-4 w-4" />
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs mb-1.5">
                            <span>Dictar por voz</span>
                            <kbd className="ml-1.5 text-[10px] font-mono bg-white/10 px-1 py-0.5 rounded text-zinc-300">Voice POS</kbd>
                          </TooltipContent>
                        </Tooltip>

                        {/* Botón Enviar Consulta (Círculo blanco con micro-animación) */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.button
                              whileHover={query.trim() || attachedFiles.length > 0 ? { scale: 1.08 } : {}}
                              whileTap={query.trim() || attachedFiles.length > 0 ? { scale: 0.92 } : {}}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              type="button"
                              onClick={handleSubmit}
                              disabled={!query.trim() && attachedFiles.length === 0}
                              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 outline-none ${
                                query.trim() || attachedFiles.length > 0
                                  ? "bg-white text-zinc-950 hover:bg-zinc-200 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                  : "bg-white/[0.04] text-zinc-600 border border-white/[0.04] cursor-not-allowed"
                              }`}
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
                      </div>
                    </div>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}


