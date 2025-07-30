import React, { useEffect, useRef } from "react";
import { useChatStore } from "../lib/chat-store";
import { wpApi } from "../lib/wordpress-api";
import { formatTimestamp, scrollToBottom } from "../lib/utils";

import "./ChatWidget.css";

export const ChatWidget: React.FC = () => {
  const {
    messages,
    isOpen,
    isLoading,
    selectedModel,
    availableModels,
    addMessage,
    toggleChat,
    setLoading,
    setSelectedModel,
    setAvailableModels,
    clearMessages,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Load available models on mount
    wpApi.getModels().then(setAvailableModels);
  }, [setAvailableModels]);

  useEffect(() => {
    scrollToBottom(messagesEndRef.current);
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    addMessage({
      role: "user",
      content,
      timestamp: new Date(),
    });

    setLoading(true);

    try {
      // Prepare messages for API
      const chatMessages = [
        {
          role: "system",
          content: `You are RebelDev AI, a sarcastic but helpful AI assistant for ${
            window.ocwData?.siteName || "this website"
          }. You have a witty, slightly rebellious personality but you're ultimately helpful and knowledgeable. Keep responses concise and engaging.`,
        },
        ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: "user", content },
      ];

      const stream = await wpApi.sendMessage(selectedModel, chatMessages);
      const reader = stream.getReader();

      let assistantMessage = "";
      const startTime = new Date();

      // Add initial assistant message
      addMessage({
        role: "assistant",
        content: "",
        timestamp: startTime,
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              assistantMessage += data.message.content;

              // Update the last message
              const currentMessages = useChatStore.getState().messages;
              const lastMessage = currentMessages[currentMessages.length - 1];

              if (lastMessage?.role === "assistant") {
                useChatStore.setState({
                  messages: [
                    ...currentMessages.slice(0, -1),
                    { ...lastMessage, content: assistantMessage },
                  ],
                });
              }
            }
          } catch (error) {
            // Ignore parsing errors for partial chunks
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage({
        role: "assistant",
        content:
          "Sorry, I'm having some technical difficulties. Try again in a moment! 🤖",
        timestamp: new Date(),
      });
    }

    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
        aria-label="Open chat"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.3596 22 8.82922 21.6231 7.5 20.9556L2 22L3.04445 16.5C2.37688 15.1708 2 13.6404 2 12C2 6.47715 6.47715 2 12 2Z"
            fill="currentColor"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-semibold">RebelDev AI</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Accessible label for screen readers */}
          <label htmlFor="model-select" className="sr-only">
            Choose AI model
          </label>
          <select
            id="model-select"
            title="Choose AI model"
            aria-label="Choose AI model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-sm bg-blue-700 text-white border border-blue-500 rounded px-2 py-1"
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <button
            onClick={clearMessages}
            className="p-1 hover:bg-blue-700 rounded"
            title="Clear chat"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
            </svg>
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-blue-700 rounded"
            aria-label="Close chat"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">👋 Hey there!</p>
            <p className="text-sm">
              I'm RebelDev AI. What can I help you with today?
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 opacity-70 ${
                  message.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg flex space-x-1">
              {["0s", "0.1s", "0.2s"].map((delay, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: delay }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const message = formData.get("message") as string;
            if (message.trim()) {
              handleSendMessage(message);
              e.currentTarget.reset();
            }
          }}
          className="flex space-x-2"
        >
          <textarea
            ref={inputRef}
            name="message"
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) {
                  const formData = new FormData(form);
                  const message = formData.get("message") as string;
                  if (message.trim()) {
                    handleSendMessage(message);
                    form.reset();
                  }
                }
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Send message"
            title="Send message"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
