"use client";

import React, { useState } from "react";
import { Sparkles, Download, Eye } from "lucide-react";
import { type ChatAttachment } from "../ai-types";
import { AiFileIcon } from "../files/ai-file-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@pulsecommerce/ui";

export interface AiChatAttachmentCardProps {
  attachment: ChatAttachment;
}

export function AiChatAttachmentCard({ attachment }: AiChatAttachmentCardProps) {
  const isImage =
    attachment.type.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(attachment.name);
  const isPdf =
    attachment.type === "application/pdf" ||
    attachment.name.toLowerCase().endsWith(".pdf");

  const [imageError, setImageError] = useState(false);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="group relative flex flex-col rounded-2xl bg-[#1c1c22]/90 border border-white/[0.08] hover:border-white/[0.18] shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden max-w-[240px] select-none">
        {/* Caso 1: Previsualización de Imagen embebida */}
        {isImage && attachment.url && !imageError && (
          <div className="relative w-full h-28 bg-black/40 overflow-hidden flex items-center justify-center">
            <img
              src={attachment.url}
              alt={attachment.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
              <span className="text-[10px] text-zinc-300 font-mono">
                {attachment.size}
              </span>
              <div className="flex items-center gap-1">
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md bg-black/70 hover:bg-black text-zinc-300 hover:text-white transition-colors"
                >
                  <Eye className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Ficha principal con icono y metadatos */}
        <div className="flex items-center gap-2.5 p-2.5">
          <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
            <AiFileIcon file={attachment} className="h-4 w-4" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-zinc-100 truncate leading-snug">
              {attachment.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-zinc-400">
                {attachment.size}
              </span>
              {isPdf && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[8px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  <Sparkles className="h-2 w-2" />
                  OCR
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
