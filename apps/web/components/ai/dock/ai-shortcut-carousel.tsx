"use client";

import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { type NavTabId } from "@/components/layout/sidebar";
import {
  CONTEXT_SHORTCUTS,
  ALL_SYSTEM_SHORTCUTS,
  type ShortcutItem,
} from "../ai-constants";

export interface AiShortcutCarouselProps {
  activeTab?: NavTabId;
  onSelectShortcut: (prompt: string) => void;
  className?: string;
}

/**
 * `<AiShortcutCarousel />`
 * Fila horizontal interactiva de sugerencias rápidas contextuales adaptadas al POS.
 * Sin badges estáticos redundantes, con desplazamiento horizontal suave asistido por
 * botones reactivos (`ChevronLeft` / `ChevronRight`) y máscara de degradado en bordes.
 */
export function AiShortcutCarousel({
  activeTab = "home",
  onSelectShortcut,
  className = "",
}: AiShortcutCarouselProps) {
  const shortcuts: ShortcutItem[] =
    CONTEXT_SHORTCUTS[activeTab] || ALL_SYSTEM_SHORTCUTS;

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
  }, [shortcuts, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 200;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const getMaskStyle = useCallback((): CSSProperties => {
    if (canScrollLeft && canScrollRight) {
      return {
        maskImage:
          "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent 100%)",
      };
    }
    if (canScrollRight) {
      return {
        maskImage:
          "linear-gradient(to right, black calc(100% - 24px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, black calc(100% - 24px), transparent 100%)",
      };
    }
    if (canScrollLeft) {
      return {
        maskImage:
          "linear-gradient(to left, black calc(100% - 24px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to left, black calc(100% - 24px), transparent 100%)",
      };
    }
    return {};
  }, [canScrollLeft, canScrollRight]);

  return (
    <div
      className={`relative flex items-center w-full max-w-2xl min-w-0 ${className}`}
    >
      {/* Botón de desplazamiento hacia la izquierda */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => handleScroll("left")}
            className="absolute -left-1 z-10 h-6 w-6 rounded-full bg-zinc-900/95 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white flex items-center justify-center shadow-lg backdrop-blur-xl transition-all active:scale-90 shrink-0 cursor-pointer ring-1 ring-black/50"
            aria-label="Desplazar sugerencias a la izquierda"
          >
            <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contenedor scrolleable de atajos contextuales */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={getMaskStyle()}
        className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full select-none"
      >
        {shortcuts.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSelectShortcut(item.prompt)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/70 hover:bg-zinc-800/90 border border-white/[0.07] hover:border-white/[0.14] text-xs font-medium text-zinc-300 hover:text-white shadow-sm backdrop-blur-md transition-all duration-150 shrink-0 cursor-pointer"
          >
            <span>{item.label}</span>
            <ArrowUpRight className="h-3 w-3 text-zinc-500 group-hover:text-blue-400 opacity-60 group-hover:opacity-100 transition-all" />
          </motion.button>
        ))}
      </div>

      {/* Botón de desplazamiento hacia la derecha */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => handleScroll("right")}
            className="absolute -right-1 z-10 h-6 w-6 rounded-full bg-zinc-900/95 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white flex items-center justify-center shadow-lg backdrop-blur-xl transition-all active:scale-90 shrink-0 cursor-pointer ring-1 ring-black/50"
            aria-label="Desplazar sugerencias a la derecha"
          >
            <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
