"use client";

import React from "react";
import { CornerDownRight, ArrowUpRight } from "lucide-react";
import { type ChatMessage } from "../ai-types";
import { AiChatAttachmentCard } from "./ai-chat-attachment-card";

export interface AiChatMessageItemProps {
  message: ChatMessage;
  onQuoteSelection: (text?: string) => void;
}

/**
 * `<AiChatMessageItem />`
 * Componente atómico para renderizar una burbuja o bloque de mensaje individual
 * en el feed de conversación.
 */
export function AiChatMessageItem({
  message,
  onQuoteSelection,
}: AiChatMessageItemProps) {
  if (message.sender === "user") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {/* Texto citado si existe */}
        {message.quotedText && (
          <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg max-w-lg truncate">
            <CornerDownRight className="h-3.5 w-3.5 shrink-0" />
            <span className="italic truncate">&quot;{message.quotedText}&quot;</span>
          </div>
        )}

        {/* Archivos adjuntos renderizados en la conversación */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap justify-end gap-2 max-w-lg">
            {message.attachments.map((att) => (
              <AiChatAttachmentCard key={att.id} attachment={att} />
            ))}
          </div>
        )}

        {/* Mensaje de texto */}
        {message.content ? (
          <div className="px-4 py-2.5 rounded-2xl bg-blue-600 text-white text-sm max-w-lg shadow-md font-medium">
            {message.content}
          </div>
        ) : null}

        <span className="text-[10px] text-zinc-500 px-1 font-mono">{message.timestamp}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Indicador de estado de procesamiento */}
      {message.statusText && (
        <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-medium">
          <div className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </div>
          <span>{message.statusText}</span>
        </div>
      )}

      {/* Título de sección si existe */}
      {message.sectionTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
            <h2 className="text-sm font-semibold text-zinc-100 tracking-tight truncate">
              {message.sectionTitle}
            </h2>
            {message.sourceBadge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-zinc-300 ml-1">
                <span>{message.sourceBadge.time}</span>
                <ArrowUpRight className="h-3 w-3 text-zinc-400" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cuerpo del mensaje con soporte para texto citado interactivo */}
      <div className="text-sm leading-relaxed text-zinc-300 space-y-2.5 pl-3 border-l-2 border-white/[0.08]">
        <p>
          {message.highlightedText && message.content.includes(message.highlightedText) ? (
            <>
              {message.content.split(message.highlightedText)[0]}
              <span
                onClick={() => onQuoteSelection(message.highlightedText)}
                className="bg-blue-500/20 text-blue-200 px-1 py-0.5 rounded border-b border-blue-400/50 cursor-pointer hover:bg-blue-500/35 transition-colors"
                title="Click para citar este fragmento"
              >
                {message.highlightedText}
              </span>
              {message.content.split(message.highlightedText)[1]}
            </>
          ) : (
            message.content
          )}
        </p>
      </div>
    </div>
  );
}
