import { Bot, User } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Copy } from 'lucide-react'

interface MessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  onCopy: (content: string) => void
}

export function ChatMessage({ role, content, timestamp, isStreaming, onCopy }: MessageProps) {
  return (
    <div className={`flex gap-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="group relative max-w-lg">
        <Card
          className={`p-4 ${
            role === 'user'
              ? 'bg-blue-600/20 border-blue-400/20'
              : 'bg-white/10 border-white/20'
          } backdrop-blur-lg transition-all duration-200 hover:bg-opacity-30`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-white text-sm whitespace-pre-wrap flex-1">
              {content}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
              )}
            </p>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
            <span className="text-xs text-gray-400">{timestamp.toLocaleTimeString()}</span>

            <Button
              onClick={() => onCopy(content)}
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      </div>

      {role === 'user' && (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}
