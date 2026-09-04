"use client";

import { FileText, Image as ImageIcon, X } from "lucide-react";

export interface AiAttachedFileChipProps {
  /** Archivo binario adjuntado en staging */
  file: File;
  /** Callback para descartar el archivo adjunto */
  onRemove: () => void;
}

/**
 * `<AiAttachedFileChip />`
 * Chip interactivo de previsualización en staging (Human-in-the-Loop).
 * Muestra metadatos del comprobante cargado antes de ejecutar el análisis de OCR o prompt.
 */
export function AiAttachedFileChip({ file, onRemove }: AiAttachedFileChipProps) {
  const isPdf = file.type === "application/pdf";
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900/95 border border-emerald-500/40 rounded-lg text-xs text-zinc-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto select-none">
      {/* Icono diferenciado según tipo MIME */}
      <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 shrink-0">
        {isPdf ? <FileText className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
      </div>

      {/* Nombre y peso del documento */}
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="max-w-[180px] sm:max-w-[240px] truncate font-medium text-zinc-100">
          {file.name}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono shrink-0">
          ({sizeMb} MB)
        </span>
      </div>

      {/* Badge indicador de OCR listo */}
      <span className="px-1.5 py-0.2 text-[9px] font-semibold tracking-wider uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
        OCR
      </span>

      {/* Botón de descarte interactivo (HITL) */}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 p-0.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-white/[0.08] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-red-400"
        aria-label="Quitar archivo adjunto"
      >
        <X className="h-3.5 w-3.5 stroke-[2]" />
      </button>
    </div>
  );
}
