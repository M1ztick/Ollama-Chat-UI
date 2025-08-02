import { useState } from "react";
import { Button } from "./ui/button";
import { Bot, X } from "lucide-react";
import { Card } from "./ui/card";
import HomePage from "../pages/Home";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card className="w-[400px] h-[600px] bg-black/80 backdrop-blur-lg border-white/20 overflow-hidden flex flex-col">
          <HomePage />
        </Card>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-16 h-16 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg transform hover:scale-110"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
      </Button>
    </div>
  );
}
