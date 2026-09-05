"use client";

import React from "react";
import { X } from "lucide-react";
import { AiFileIcon } from "./ai-file-icon";

export interface AiAttachedFileChipProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

/**
 * `<AiAttachedFileChip />`
 * Chip compacto para representar un archivo cargado en el dock de entrada.
 */
export function AiAttachedFileChip({
  file,
  onRemove,
  className = "",
}: AiAttachedFileChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-zinc-200 transition-colors select-none group shrink-0 ${className}`}
    >
      <AiFileIcon file={file} className="h-3.5 w-3.5" />
      <span className="truncate max-w-[120px] font-medium text-[11px] leading-none">
        {file.name}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        aria-label={`Eliminar ${file.name}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
