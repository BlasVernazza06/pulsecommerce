"use client";

import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type NavTabId } from "@/components/layout/sidebar";
import { CONTEXT_SHORTCUTS, type ShortcutItem } from "./ai-constants";

export interface AiShortcutCarouselProps {
  /** Pestaña o módulo activo */
  activeTab?: NavTabId;
  /** Callback al hacer clic en un atajo para poblar el input */
  onSelectShortcut: (prompt: string) => void;
  className?: string;
}

/**
 * `<AiShortcutCarousel />`
 * Carrusel horizontal de píldoras / atajos contextuales con máscara de desvanecimiento alfa
 * y botones de desplazamiento fluido en los extremos.
 */
export function AiShortcutCarousel({
  activeTab = "home",
  onSelectShortcut,
  className = "",
}: AiShortcutCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const shortcuts = CONTEXT_SHORTCUTS[activeTab] || [];

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
    const scrollAmount = 220;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const getMaskStyle = useCallback((): CSSProperties => {
    if (canScrollLeft && canScrollRight) {
      return {
        maskImage: "linear-gradient(to right, transparent, black 36px, black calc(100% - 48px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 36px, black calc(100% - 48px), transparent 100%)",
      };
    }
    if (canScrollRight) {
      return {
        maskImage: "linear-gradient(to right, black calc(100% - 48px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, black calc(100% - 48px), transparent 100%)",
      };
    }
    if (canScrollLeft) {
      return {
        maskImage: "linear-gradient(to left, black calc(100% - 48px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, black calc(100% - 48px), transparent 100%)",
      };
    }
    return {};
  }, [canScrollLeft, canScrollRight]);

  if (shortcuts.length === 0) return null;

  return (
    <div className={`relative max-w-2xl w-full flex items-center ${className}`}>
      {/* Botón Desplazamiento Izquierda */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-20 h-7 w-7 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.15] text-zinc-300 hover:text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-90 pointer-events-auto animate-in fade-in duration-150"
          aria-label="Desplazar a la izquierda"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}

      {/* Contenedor Horizontal con Máscara de Desvanecimiento */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={getMaskStyle()}
        className="flex items-center gap-2 w-full overflow-x-auto no-scrollbar scroll-smooth px-1 py-0.5 animate-in fade-in slide-in-from-bottom-1 duration-200"
      >
        {shortcuts.map((sc: ShortcutItem) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => onSelectShortcut(sc.prompt)}
            className="text-xs text-zinc-400 hover:text-zinc-100 bg-black hover:bg-zinc-900/90 border border-white/[0.08] hover:border-white/[0.2] px-3 py-1.5 rounded-full backdrop-blur-md transition-all shadow-sm flex items-center gap-1.5 shrink-0 pointer-events-auto select-none active:scale-95"
          >
            <span>{sc.label}</span>
          </button>
        ))}
      </div>

      {/* Botón Desplazamiento Derecha */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-20 h-7 w-7 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.15] text-zinc-300 hover:text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all active:scale-90 pointer-events-auto animate-in fade-in duration-150"
          aria-label="Desplazar a la derecha"
        >
          <ChevronRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
