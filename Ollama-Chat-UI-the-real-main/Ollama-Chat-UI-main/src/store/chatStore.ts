import { create } from 'zustand'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

interface ChatState {
  messages: Message[]
  addMessage: (message: Message) => void
  updateMessage: (id: string, content: string, isStreaming: boolean) => void
  clearMessages: (initialMessage: Message) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, content, isStreaming) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content, isStreaming } : msg
      ),
    })),
  clearMessages: (initialMessage) => set({ messages: [initialMessage] }),
}))
