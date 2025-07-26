// Import the bundled widget script as a string
import widgetScript from "../dist/widget.js";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight requests for the API
    if (request.method === "OPTIONS" && url.pathname === "/api/chat") {
      return handleOptions(request);
    }

    // Route 1: Serve the widget.js file
    if (url.pathname === "/widget.js") {
      return new Response(widgetScript, {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=86400", // Cache for 1 day
        },
      });
    }

    // Route 2: Proxy API requests to Ollama
    if (url.pathname === "/api/chat") {
      // Re-create the request to forward to Ollama
      const ollamaRequest = new Request("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: request.body,
      });

      // The 'fetch' function in a worker with a tunnel automatically routes this
      const ollamaResponse = await fetch(ollamaRequest);

      // Create a new response with CORS headers to send back to the browser
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
    }

    // If no route matches, return 404
    return new Response("Not found", { status: 404 });
  },
};

// Standard CORS preflight handler
function handleOptions(request: Request) {
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, POST, OPTIONS",
      },
    });
  }
}

interface Env {
  // This interface is kept for future environment variables if needed
}
