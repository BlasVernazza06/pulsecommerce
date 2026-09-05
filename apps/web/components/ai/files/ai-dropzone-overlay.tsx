"use client";

import React from "react";
import { UploadCloud } from "lucide-react";

export interface AiDropzoneOverlayProps {
  onBrowseClick: () => void;
  className?: string;
}

/**
 * `<AiDropzoneOverlay />`
 * Overlay visual interactivo con feedback visual de arrastre de archivos.
 */
export function AiDropzoneOverlay({
  onBrowseClick,
  className = "",
}: AiDropzoneOverlayProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-[22px] bg-gradient-to-r from-blue-950/40 via-[#121218] to-blue-950/40 border border-blue-500/30 select-none ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <UploadCloud className="h-5 w-5 animate-pulse" />
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-zinc-100">
            Soltá tus comprobantes o documentos aquí
          </p>
          <p className="text-[10px] text-zinc-400">
            PDF, Word, Excel, CSV, ODT o fotos para extracción con OCR IA
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onBrowseClick}
        className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-xs font-medium text-zinc-200 hover:text-white transition-colors cursor-pointer shrink-0"
      >
        Explorar
      </button>
    </div>
  );
}
