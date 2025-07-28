// API wrapper for WordPress AJAX
export class WordPressOllamaAPI {
  private ajaxUrl: string;
  private nonce: string;

  constructor() {
    this.ajaxUrl = window.ocwData.ajaxUrl;
    this.nonce = window.ocwData.nonce;
  }

  async chat(model: string, messages: any[], stream: boolean = true) {
    const formData = new FormData();
    formData.append("action", "ocw_proxy_ollama");
    formData.append("nonce", this.nonce);
    formData.append("endpoint", "chat");
    formData.append(
      "data",
      JSON.stringify({
        model,
        messages,
        stream,
      })
    );

    const response = await fetch(this.ajaxUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.data || "API request failed");
    }

    return result.data;
  }

  async getModels() {
    const formData = new FormData();
    formData.append("action", "ocw_proxy_ollama");
    formData.append("nonce", this.nonce);
    formData.append("endpoint", "tags");
    formData.append("data", "{}");

    const response = await fetch(this.ajaxUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result.success ? JSON.parse(result.data) : { models: [] };
  }
}
