import { Bot, ChevronDown, Trash2, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface OllamaModel {
  name: string
  size: number
  modified_at: string
}

interface ChatHeaderProps {
  isLoadingModels: boolean
  selectedModel: string
  availableModels: OllamaModel[]
  handleModelSelect: (modelName: string) => void
  clearMessages: () => void
  formatModelSize: (size: number) => string
}

export function ChatHeader({
  isLoadingModels,
  selectedModel,
  availableModels,
  handleModelSelect,
  clearMessages,
  formatModelSize,
}: ChatHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Ollama Chat</h1>
            <p className="text-gray-300">Local AI Assistant • Streaming Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 min-w-[160px]"
                disabled={isLoadingModels}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isLoadingModels ? 'Loading...' : selectedModel}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-slate-800 border-slate-700">
              {availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <DropdownMenuItem
                    key={model.name}
                    onClick={() => handleModelSelect(model.name)}
                    className="flex flex-col items-start py-3 text-white hover:bg-slate-700"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{model.name}</span>
                      {model.name === selectedModel && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatModelSize(model.size)} •{' '}
                      {new Date(model.modified_at).toLocaleDateString()}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-gray-400">
                  No models found
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={clearMessages}
            variant="outline"
            size="sm"
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
