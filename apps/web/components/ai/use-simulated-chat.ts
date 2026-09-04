"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { type ChatMessage, type ChatSuggestion } from "./ai-chat-types";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-initial",
    sender: "assistant",
    timestamp: "1:40",
    statusText: "Getting a detailed report...",
    sectionTitle: "Shaping the AI Chat Experience",
    sourceBadge: {
      time: "1:40",
      url: "#",
    },
    sources: [
      {
        id: "src-1",
        title: "Onboarding Meeting...",
        type: "doc",
        date: "Dec 15, 2025",
      },
      {
        id: "src-2",
        title: "Project Kickoff Meet...",
        type: "meeting",
        date: "Dec 16, 2025",
      },
    ],
    content:
      "During the meeting, the project vision was presented: to design a modern, intuitive, and trustworthy AI chat interface that emphasizes clarity, usability, and intelligent interaction. Key design principles discussed included minimalism, accessibility, conversational flow, and visual cues that enhance user confidence in AI-driven responses. The project scope was outlined, covering the creation of initial wireframes, visual design concepts, color schemes, typography, and UI components specific to chat-based interactions. It was agreed that seamless integration with real-time hardware telemetry and HITL safety checks will be paramount.",
    highlightedText: "enhance user confidence in AI-driven responses.",
    suggestions: [
      {
        id: "sug-1",
        prompt: "How should AI show uncertainty?",
      },
      {
        id: "sug-2",
        prompt: "Which UI elements build trust in AI responses?",
      },
      {
        id: "sug-3",
        prompt: "What signals make AI responses feel reliable?",
      },
    ],
  },
];

const SIMULATED_RESPONSES: Record<
  string,
  {
    sectionTitle: string;
    content: string;
    highlightedText?: string;
    suggestions: ChatSuggestion[];
  }
> = {
  "how should ai show uncertainty?": {
    sectionTitle: "Calibrated Uncertainty & Confidence Indicators",
    content:
      "To display uncertainty effectively without degrading user trust, modern POS & AI interfaces use calibrated confidence tiers (High > 95%, Medium 80-95%, Low < 80%), visual badges, and fallback options. Instead of presenting uncertain outputs as definitive facts, the system highlights alternative suggestions and explicitly prompts the human operator with a Quick Confirm / Edit modal.",
    highlightedText: "calibrated confidence tiers (High > 95%, Medium 80-95%, Low < 80%)",
    suggestions: [
      { id: "s1", prompt: "Show example of a confidence badge widget" },
      { id: "s2", prompt: "How to handle OCR low confidence items in POS?" },
      { id: "s3", prompt: "Explain Human-in-the-Loop approval thresholds" },
    ],
  },
  "which ui elements build trust in ai responses?": {
    sectionTitle: "Trust-Building Design Elements in Enterprise AI",
    content:
      "The most effective trust-building elements are: 1) Inline citation badges linking directly to raw audio/doc timestamps; 2) Human-in-the-Loop review diff cards showing before/after mutations; 3) Transparent latency and model source pills (e.g. Gemini 3 Pro with reasoning traces); and 4) Clear reversible undo actions for any state change in stock or pricing.",
    highlightedText: "Inline citation badges linking directly to raw audio/doc timestamps",
    suggestions: [
      { id: "s1", prompt: "What signals make AI responses feel reliable?" },
      { id: "s2", prompt: "How do undo actions work with Outbox sync?" },
      { id: "s3", prompt: "Display sample ticket preview modal" },
    ],
  },
  "what signals make ai responses feel reliable?": {
    sectionTitle: "Perceptual Reliability Signals in High-Speed POS",
    content:
      "Sub-50ms visual responsiveness, deterministic confirmation states, tactile keyboard shortcuts (F4, Enter), and contextual quoted replies create an undeniable sense of system stability. Operators feel in control when they can seamlessly inspect the context chip and trace every proposed action back to its source.",
    highlightedText: "deterministic confirmation states and tactile keyboard shortcuts",
    suggestions: [
      { id: "s1", prompt: "Which UI elements build trust in AI responses?" },
      { id: "s2", prompt: "How should AI show uncertainty?" },
      { id: "s3", prompt: "Test POS invoice reconciliation flow" },
    ],
  },
};

export function useSimulatedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [quotedText, setQuotedText] = useState<string | null>(
    "enhance user confidence in AI-driven responses."
  );
  const [isPersonalized, setIsPersonalized] = useState(true);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(1);
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

  // Enviar mensaje o sugerencia simulada
  const sendMessage = useCallback((overrideText?: string) => {
    const text = (overrideText || inputValue).trim();
    if (!text && !quotedText) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      content: text || "Detalle sobre la cita adjunta",
      quotedText: quotedText || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setQuotedText(null);
    setIsGenerating(true);

    // Simulación de respuesta de IA con streaming/retraso realista
    setTimeout(() => {
      const lower = text.toLowerCase();
      const match =
        SIMULATED_RESPONSES[lower] ||
        SIMULATED_RESPONSES["which ui elements build trust in ai responses?"];

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        statusText: "Analyzing context & synthesizing insights...",
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
            title: "PulseCommerce Core Architecture Docs",
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
