/**
 * Main App component - Router configuration for Ollama Chat
 */
import { ChatWidget } from "./components/ChatWidget";

export default function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* This would be your main website content */}
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">My Awesome Website</h1>
        <p className="text-lg text-gray-400">
          This is where the main content of the website would go. The chat
          widget will float on top of this.
        </p>
      </div>

      <ChatWidget />
    </div>
  );
}
