import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  selectedModel: string;
  availableModels: string[];

  // Actions
  addMessage: (message: Omit<Message, "id">) => void;
  toggleChat: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedModel: (model: string) => void;
  setAvailableModels: (models: string[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  selectedModel: "llama3.2",
  availableModels: ["llama3.2"],

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  toggleChat: () => {
    set((state) => ({
      isOpen: !state.isOpen,
    }));
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setSelectedModel: (model) => {
    set({ selectedModel: model });
  },

  setAvailableModels: (models) => {
    set({ availableModels: models });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
