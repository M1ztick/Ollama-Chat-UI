// Types for WordPress integration
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

export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
}

export interface ChatResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}
