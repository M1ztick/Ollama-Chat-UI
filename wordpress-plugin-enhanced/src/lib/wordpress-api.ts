export class WordPressAPI {
  private ajaxUrl: string;
  private nonce: string;

  constructor() {
    this.ajaxUrl = window.ocwData?.ajaxUrl || "/wp-admin/admin-ajax.php";
    this.nonce = window.ocwData?.nonce || "";
  }

  async proxyRequest(endpoint: string, data: any): Promise<any> {
    const formData = new FormData();
    formData.append("action", "ocw_proxy_ollama");
    formData.append("nonce", this.nonce);
    formData.append("endpoint", endpoint);
    formData.append("data", JSON.stringify(data));

    const response = await fetch(this.ajaxUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.data || "Request failed");
    }

    try {
      return JSON.parse(result.data);
    } catch (error) {
      throw new Error("Failed to parse JSON response: " + error.message);
    }
  }

  async getModels(): Promise<string[]> {
    try {
      const data = await this.proxyRequest("tags", {});
      return data.models?.map((model: any) => model.name) || [];
    } catch (error) {
      console.error("Failed to fetch models:", error);
      return ["llama3.2"]; // fallback
    }
  }

  async sendMessage(model: string, messages: any[]): Promise<ReadableStream> {
    const data = {
      model,
      messages,
      stream: true,
    };

    // For streaming, we need to handle it differently
    return this.streamRequest("chat", data);
  }

  private async streamRequest(
    endpoint: string,
    data: any
  ): Promise<ReadableStream> {
    const formData = new FormData();
    formData.append("action", "ocw_proxy_ollama");
    formData.append("nonce", this.nonce);
    formData.append("endpoint", endpoint);
    formData.append("data", JSON.stringify(data));

    const response = await fetch(this.ajaxUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Create a custom readable stream for WordPress proxy response
    return new ReadableStream({
      start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        function pump(): any {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          });
        }

        return pump();
      },
    });
  }
}

export const wpApi = new WordPressAPI();
