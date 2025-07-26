/**
 * Home page component - Enhanced Ollama chat interface with streaming and model selection
 */
import { useState, useRef, useEffect } from "react";
import { ChatHeader } from "../components/chat/ChatHeader";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { useChatStore } from "../store/chatStore";
import { systemPrompt } from "../lib/personality";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
}

export default function HomePage() {
  const {
    messages,
    addMessage,
    updateMessage,
    clearMessages: clearStoreMessages,
  } = useChatStore();
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem("ollama_selected_model") || "llama3.2";
  });
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("ollama_chat_messages");
    if (savedMessages && savedMessages !== "[]") {
      const parsedMessages = JSON.parse(savedMessages).map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      useChatStore.setState({ messages: parsedMessages });
    } else {
      addMessage({
        id: "1",
        content:
          "Hello! I'm your Ollama assistant. Send me a message to get started!",
        role: "assistant",
        timestamp: new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ollama_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("ollama_selected_model", selectedModel);
  }, [selectedModel]);

  /**
   * Scroll to bottom of messages
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Fetch available models from Ollama
   */
  const fetchAvailableModels = async () => {
    try {
      const response = await fetch("http://localhost:11434/api/tags");
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data.models || []);

        // Set first model as default if current selection isn't available
        if (data.models && data.models.length > 0) {
          const modelNames = data.models.map((m: OllamaModel) => m.name);
          if (!modelNames.includes(selectedModel)) {
            setSelectedModel(data.models[0].name);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
      // Set fallback models if API fails
      setAvailableModels([
        { name: "llama3.2", size: 0, modified_at: new Date().toISOString() },
        { name: "llama3", size: 0, modified_at: new Date().toISOString() },
      ]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchAvailableModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Format model size for display
   */
  const formatModelSize = (size: number) => {
    if (size === 0) return "Unknown size";
    const gb = size / (1024 * 1024 * 1024);
    return gb > 1
      ? `${gb.toFixed(1)}GB`
      : `${(size / (1024 * 1024)).toFixed(0)}MB`;
  };

  /**
   * Send message to Ollama with streaming
   */
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInputMessage("");
    setIsLoading(true);

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isStreaming: true,
    };

    addMessage(assistantMessage);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    const history = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Prepend the system prompt to the history
    const payload = {
      model: selectedModel,
      messages: [{ role: "system", content: systemPrompt }, ...history],
      stream: true,
    };

    try {
      const response = await fetch(
        "https://ollama-proxy.mistykmedia.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.response) {
              accumulatedContent += data.response;

              // Update the assistant message with new content
              updateMessage(assistantMessageId, accumulatedContent, true);
            }

            if (data.done) {
              // Mark streaming as complete
              updateMessage(assistantMessageId, accumulatedContent, false);
              break;
            }
          } catch (parseError) {
            console.warn("Failed to parse JSON:", line);
          }
        }
      }
    } catch (error) {
      console.error("Error calling Ollama:", error);

      if (error instanceof Error && error.name !== "AbortError") {
        const errorMessage = `❌ Connection Error: ${error.message}. Is Ollama running with model '${selectedModel}'?`;

        updateMessage(assistantMessageId, errorMessage, false);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  /**
   * Copy message content to clipboard
   */
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  /**
   * Clear all messages
   */
  const clearMessages = () => {
    clearStoreMessages({
      id: "1",
      content: `Hello! I'm your Ollama assistant running ${selectedModel}. Send me a message to get started!`,
      role: "assistant",
      timestamp: new Date(),
    });
  };

  /**
   * Stop current generation
   */
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  /**
   * Handle model selection
   */
  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);

    // Add system message about model switch
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: `🔄 Switched to model: ${modelName}`,
      role: "assistant",
      timestamp: new Date(),
    };

    addMessage(systemMessage);
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <ChatHeader
        isLoadingModels={isLoadingModels}
        selectedModel={selectedModel}
        availableModels={availableModels}
        handleModelSelect={handleModelSelect}
        clearMessages={clearMessages}
        formatModelSize={formatModelSize}
      />

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto">
        {/* Messages */}
        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              isStreaming={message.isStreaming}
              onCopy={copyMessage}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          sendMessage={sendMessage}
          isLoading={isLoading}
          stopGeneration={stopGeneration}
          selectedModel={selectedModel}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
