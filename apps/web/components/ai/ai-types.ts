export interface ChatSourceCard {
  id: string;
  title: string;
  type: "meeting" | "doc" | "sheet" | "drive";
  date?: string;
  duration?: string;
  url?: string;
}

export interface ChatSuggestion {
  id: string;
  prompt: string;
  description?: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  statusText?: string;
  isStreaming?: boolean;
  sectionTitle?: string;
  sourceBadge?: {
    time: string;
    url?: string;
  };
  content: string;
  highlightedText?: string;
  sources?: ChatSourceCard[];
  suggestions?: ChatSuggestion[];
  quotedText?: string;
  attachments?: ChatAttachment[];
}
