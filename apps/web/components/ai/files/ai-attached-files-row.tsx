"use client";

import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@pulsecommerce/ui";
import { AiFilePreviewCard } from "./ai-file-preview-card";
import { AiAttachedFileChip } from "./ai-attached-file-chip";

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
        className="flex items-center gap-1.5 overflow-x-auto py-0.5 px-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full select-none"
      >
        <AnimatePresence initial={false}>
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="shrink-0"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <AiAttachedFileChip
                      file={file}
                      onRemove={() => onRemoveFile(index)}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="p-1.5 bg-[#121216]/95 border border-white/[0.12] shadow-[0_12px_32px_rgba(0,0,0,0.85)] rounded-xl backdrop-blur-xl"
                >
                  <AiFilePreviewCard file={file} />
                </TooltipContent>
              </Tooltip>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Botón scroll a la derecha */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute right-0 z-10 h-6 w-6 rounded-full bg-zinc-950/90 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center shadow-md backdrop-blur-sm transition-all active:scale-90 shrink-0"
            aria-label="Desplazar archivos a la derecha"
          >
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
