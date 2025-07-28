import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ChatWidget } from "./components/ChatWidget";

// WordPress globals
declare global {
  interface Window {
    ocwData: {
      ajaxUrl: string;
      nonce: string;
      ollamaUrl: string;
      siteName: string;
      siteUrl: string;
    };
  }
}

// Initialize the chat widget when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("ollama-chat-widget-root");
  if (container) {
    const root = createRoot(container);
    root.render(<ChatWidget />);
  }
});
