# Ollama Chat UI

A modern, user-friendly web interface for interacting with Ollama language models.

## Features

- Clean and intuitive chat interface
- Support for multiple Ollama models
- Real-time streaming responses
- Conversation history
- Dark/Light theme support

## Prerequisites

- [Ollama](https://ollama.ai/) installed and running
- Node.js 18+ and npm/yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/M1ztick/Ollama-Chat-UI.git
cd Ollama-Chat-UI

# Install dependencies
npm install
# or
yarn install
```

## Configuration

1. Create a `.env` file in the root directory:

```env
OLLAMA_API_URL=http://localhost:11434
PORT=3000
```

2. Ensure Ollama is running on your system

## Usage

```bash
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
# or
yarn build
yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
