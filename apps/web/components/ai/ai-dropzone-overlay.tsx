"use client";

import { Upload, Mic, Link as LinkIcon, Files } from "lucide-react";
import { motion } from "motion/react";

export interface AiDropzoneOverlayProps {
  onBrowseClick?: () => void;
}

const ICONS = [
  { icon: Upload, label: "Subir archivo" },
  { icon: Mic, label: "Audio" },
  { icon: LinkIcon, label: "Enlace" },
  { icon: Files, label: "Documentos" },
];

/**
 * `<AiDropzoneOverlay />`
 * Overlay visual activo de Dropzone con micro-animaciones fluidas.
 */
export function AiDropzoneOverlay({ onBrowseClick }: AiDropzoneOverlayProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-5 px-6 gap-3 select-none pointer-events-none">
      {/* Título & Subtítulo */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.05 }}
        className="text-center space-y-1"
      >
        <p className="text-sm font-semibold text-zinc-100 tracking-tight">
          Suelta lo que quieras aquí
        </p>
        <p className="text-xs text-zinc-400">
          PDF, Word, Excel, ODT, Fotos y Facturas
        </p>
      </motion.div>

      {/* 4 Botones Circulares Decorativos con entrada escalonada */}
      <div className="flex items-center gap-2.5 pt-1">
        {ICONS.map(({ icon: Icon, label }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.7, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 25,
              delay: idx * 0.03,
            }}
            className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 flex items-center justify-center shadow-md backdrop-blur-sm"
          >
            <Icon className="h-4 w-4" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

