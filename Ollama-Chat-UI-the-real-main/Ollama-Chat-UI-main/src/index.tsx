import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWidget } from "./components/ChatWidget";
import "./shadcn.css";

const widgetRoot = document.createElement("div");
widgetRoot.id = "ollama-chat-widget-root";
document.body.appendChild(widgetRoot);

ReactDOM.createRoot(widgetRoot).render(
  <React.StrictMode>
    <ChatWidget />
  </React.StrictMode>
);
