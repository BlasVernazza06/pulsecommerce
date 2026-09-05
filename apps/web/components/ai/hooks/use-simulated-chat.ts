"use client";

import { useState, useCallback } from "react";
import { type ChatMessage, type ChatSuggestion } from "../ai-types";

const INITIAL_MESSAGES: ChatMessage[] = [];

const SIMULATED_RESPONSES: Record<
  string,
  {
    sectionTitle: string;
    content: string;
    highlightedText?: string;
    suggestions: ChatSuggestion[];
  }
> = {
  ventas: {
    sectionTitle: "Resumen de Rendimiento & Ventas del Turno",
    content:
      "Durante el turno actual se han procesado 142 transacciones con un ticket promedio de $8.450. El volumen total acumulado asciende a $1.200.000 con un 68% cobrado mediante QR/Tarjetas y 32% en Efectivo. No se registran discrepancias en el arqueo de caja preliminar.",
    highlightedText: "volumen total acumulado asciende a $1.200.000",
    suggestions: [
      { id: "s1", prompt: "¿Cuáles son los 3 productos más vendidos hoy?" },
      { id: "s2", prompt: "Ver desglose de medios de pago en tesorería" },
      { id: "s3", prompt: "Proyectar cierre de caja estimado" },
    ],
  },
  stock: {
    sectionTitle: "Alertas de Inventario & Reposición Crítica",
    content:
      "Se detectaron 4 SKUs por debajo del punto de reorden en la sucursal Central (ej. Gaseosa Cola 2.25L y Café Grano 1kg). El asistente sugiere generar una orden de compra consolidada con entrega para mañana a las 09:00.",
    highlightedText: "4 SKUs por debajo del punto de reorden",
    suggestions: [
      { id: "s1", prompt: "Generar borrador de orden de compra sugerida" },
      { id: "s2", prompt: "¿Qué proveedor tiene el mejor costo histórico?" },
      { id: "s3", prompt: "Verificar stock en depósito secundario" },
    ],
  },
  default: {
    sectionTitle: "Análisis Operativo Asistido por IA",
    content:
      "He procesado tu consulta contra el catálogo en tiempo real, el estado del turno de caja y los registros locales de Dexie.js. Todas las operaciones se encuentran sincronizadas mediante el Outbox Pattern y listas para su confirmación.",
    highlightedText: "sincronizadas mediante el Outbox Pattern",
    suggestions: [
      { id: "s1", prompt: "¿Cómo está el estado del arqueo de caja?" },
      { id: "s2", prompt: "Verificar productos con stock bajo" },
      { id: "s3", prompt: "¿Cuál fue el medio de pago más usado hoy?" },
    ],
  },
};

export function useSimulatedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [quotedText, setQuotedText] = useState<string | null>(null);
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectionTooltip, setSelectionTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // Escuchar selección de texto dentro del chat
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionTooltip(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 3) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionTooltip({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setSelectionTooltip(null);
    }
  }, []);

  const quoteSelection = useCallback((textToQuote?: string) => {
    const text = textToQuote || selectionTooltip?.text;
    if (text) {
      setQuotedText(text);
      setSelectionTooltip(null);
      window.getSelection()?.removeAllRanges();
    }
  }, [selectionTooltip]);

  const removeQuote = useCallback(() => {
    setQuotedText(null);
  }, []);

  // Enviar mensaje o sugerencia simulada con archivos adjuntos opcionales
  const sendMessage = useCallback((overrideText?: string, rawFiles?: File[]) => {
    const text = (overrideText || inputValue).trim();
    const hasFiles = rawFiles && rawFiles.length > 0;
    if (!text && !quotedText && !hasFiles) return;

    const formattedAttachments = rawFiles?.map((file, idx) => {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)}MB`
          : `${Math.round(file.size / 1024)}KB`;

      let url: string | undefined = undefined;
      if (file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(file.name)) {
        try {
          url = URL.createObjectURL(file);
        } catch {
          url = undefined;
        }
      }

      return {
        id: `att-${Date.now()}-${idx}`,
        name: file.name,
        size: sizeStr,
        type: file.type || "application/octet-stream",
        url,
      };
    });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: text,
      quotedText: quotedText || undefined,
      attachments: formattedAttachments,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setQuotedText(null);
    setIsGenerating(true);

    // Simulación de respuesta de IA con streaming/retraso realista
    setTimeout(() => {
      const lower = text.toLowerCase();
      let match = SIMULATED_RESPONSES.default;
      if (hasFiles) {
        match = {
          sectionTitle: "Extracción Inteligente de Documento (OCR Multimodal)",
          content:
            "He procesado el archivo adjunto mediante el modelo de visión. Se detectaron 6 ítems conciliados contra el catálogo de precios y stock. Las cantidades y costos unitarios están listos para ser confirmados en el inventario.",
          highlightedText: "6 ítems conciliados contra el catálogo",
          suggestions: [
            { id: "s1", prompt: "Conciliar ítems y actualizar stock" },
            { id: "s2", prompt: "Ver desglose de impuestos y percepciones" },
            { id: "s3", prompt: "Guardar borrador de remito" },
          ],
        };
      } else if (lower.includes("venta") || lower.includes("rendimiento") || lower.includes("factura") || lower.includes("caja")) {
        match = SIMULATED_RESPONSES.ventas;
      } else if (lower.includes("stock") || lower.includes("inventario") || lower.includes("reorden") || lower.includes("proveedor")) {
        match = SIMULATED_RESPONSES.stock;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        statusText: hasFiles ? "Processing document vision OCR & reconciling items..." : "Analyzing context & synthesizing insights...",
        sectionTitle: match.sectionTitle,
        sourceBadge: {
          time: "0:45",
          url: "#",
        },
        content: match.content,
        highlightedText: match.highlightedText,
        suggestions: match.suggestions,
        sources: [
          {
            id: `src-${Date.now()}-1`,
            title: hasFiles ? "OCR Invoice Vision Engine" : "PulseCommerce Core Architecture Docs",
            type: "doc",
            date: "Today",
          },
          {
            id: `src-${Date.now()}-2`,
            title: "POS HITL Session Telemetry",
            type: "meeting",
            date: "Today",
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
      setSelectedSuggestionIndex(0);
    }, 1100);
  }, [inputValue, quotedText]);

  // Navegación por teclado en las sugerencias activas
  const activeSuggestions = messages[messages.length - 1]?.suggestions || [];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
      if (!activeSuggestions.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % activeSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev - 1 < 0 ? activeSuggestions.length - 1 : prev - 1
        );
      } else if (e.key === "Enter" && !e.shiftKey && !inputValue.trim()) {
        e.preventDefault();
        const selected = activeSuggestions[selectedSuggestionIndex];
        if (selected) {
          sendMessage(selected.prompt);
        }
      }
    },
    [activeSuggestions, selectedSuggestionIndex, inputValue, sendMessage]
  );

  return {
    messages,
    inputValue,
    setInputValue,
    quotedText,
    setQuotedText,
    removeQuote,
    isPersonalized,
    setIsPersonalized,
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
    isGenerating,
    selectionTooltip,
    handleMouseUp,
    quoteSelection,
    sendMessage,
    handleKeyDown,
    activeSuggestions,
  };
}
