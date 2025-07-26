export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    // URL of your Ollama service
    const OLLAMA_URL = env.OLLAMA_URL;

    if (!OLLAMA_URL) {
      return new Response("OLLAMA_URL environment variable not set", {
        status: 500,
      });
    }

    // Forward the request to the Ollama API
    const ollamaRequest = new Request(OLLAMA_URL + "/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: request.body,
    });

    const ollamaResponse = await fetch(ollamaRequest);

    // Create a new response with CORS headers
    const response = new Response(ollamaResponse.body, {
      status: ollamaResponse.status,
      statusText: ollamaResponse.statusText,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

    return response;
  },
};

function handleOptions(request: Request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS preflight requests.
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: "POST, OPTIONS",
      },
    });
  }
}

interface Env {
  OLLAMA_URL: string;
}
