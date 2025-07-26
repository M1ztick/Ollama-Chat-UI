import { Send } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'

interface ChatInputProps {
  inputMessage: string
  setInputMessage: (value: string) => void
  sendMessage: () => void
  isLoading: boolean
  stopGeneration: () => void
  selectedModel: string
  handleKeyPress: (e: React.KeyboardEvent) => void
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  stopGeneration,
  selectedModel,
  handleKeyPress,
}: ChatInputProps) {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-lg p-4">
      <div className="flex gap-3">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Ask ${selectedModel} anything...`}
          className="flex-1 bg-transparent border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
          disabled={isLoading}
        />

        {isLoading ? (
          <Button
            onClick={stopGeneration}
            className="bg-red-500 hover:bg-red-600 text-white px-4"
          >
            Stop
          </Button>
        ) : (
          <Button
            onClick={sendMessage}
            disabled={!inputMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="mt-3 flex items-center gap-2 text-gray-300 text-sm">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.1s]" />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span>{selectedModel} is thinking...</span>
        </div>
      )}
    </Card>
  )
}
