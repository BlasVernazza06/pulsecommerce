"use client";

import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@pulsecommerce/ui";
import { AiFileIcon } from "./ai-file-icon";
import { AiFilePreviewCard } from "./ai-file-preview-card";

export interface AiAttachedFilesRowProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  className?: string;
}

/**
 * `<AiAttachedFilesRow />`
 * Hilera horizontal scrolleable de archivos adjuntos con botones de desplazamiento integrados,
 * íconos distintivos por formato, animaciones fluidas con Motion y Tooltip de Previsualización Rica.
 */
export function AiAttachedFilesRow({
  files,
  onRemoveFile,
  className = "",
}: AiAttachedFilesRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const timeout = setTimeout(checkScroll, 100);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkScroll);
    };
  }, [files, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 140;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const getMaskStyle = useCallback((): CSSProperties => {
    if (canScrollLeft && canScrollRight) {
      return {
        maskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent 100%)",
      };
    }
    if (canScrollRight) {
      return {
        maskImage: "linear-gradient(to right, black calc(100% - 16px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black calc(100% - 16px), transparent 100%)",
      };
    }
    if (canScrollLeft) {
      return {
        maskImage: "linear-gradient(to left, black calc(100% - 16px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, black calc(100% - 16px), transparent 100%)",
      };
    }
    return {};
  }, [canScrollLeft, canScrollRight]);

  if (files.length === 0) return null;

  return (
    <div className={`relative flex items-center min-w-0 flex-1 overflow-hidden ${className}`}>
      {/* Botón scroll a la izquierda */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute left-0 z-10 h-6 w-6 rounded-full bg-zinc-950/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all active:scale-90 shrink-0"
            aria-label="Desplazar archivos a la izquierda"
          >
            <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contenedor scrolleable con pills y tooltips enriquecidos */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={getMaskStyle()}
        className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth w-full py-0.5 px-0.5"
      >
        <AnimatePresence mode="popLayout">
          {files.map((file, index) => {
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

            return (
              <motion.div
                key={`${file.name}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: -8, transition: { duration: 0.12 } }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className="shrink-0"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 pl-2.5 pr-2 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] rounded-full text-xs text-zinc-200 shrink-0 select-none transition-all shadow-sm group cursor-pointer">
                      {/* Ícono de formato especializado (PDF, DOCX, ODT, XLSX, etc.) */}
                      <AiFileIcon file={file} className="h-4 w-4" />

                      {/* Nombre del archivo */}
                      <span className="max-w-[120px] sm:max-w-[160px] truncate font-medium text-[11px] text-zinc-200 group-hover:text-white transition-colors">
                        {file.name}
                      </span>

                      {/* Peso */}
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {sizeMb}MB
                      </span>

                      {/* Botón de eliminar archivo (stop propagation para evitar activar el tooltip trigger) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFile(index);
                        }}
                        className="h-4 w-4 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/15 transition-all outline-none ml-0.5"
                        aria-label={`Eliminar ${file.name}`}
                      >
                        <X className="h-3 w-3 stroke-[2.5]" />
                      </button>
                    </div>
                  </TooltipTrigger>

                  {/* Contenido flotante con previsualización híbrida */}
                  <TooltipContent
                    side="top"
                    sideOffset={10}
                    className="p-1 bg-[#101014]/95 border-white/[0.12] shadow-2xl backdrop-blur-2xl"
                  >
                    <AiFilePreviewCard file={file} />
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Botón scroll a la derecha */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-10 h-6 w-6 rounded-full bg-zinc-950/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all active:scale-90 shrink-0"
          aria-label="Desplazar archivos a la derecha"
        >
          <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}

