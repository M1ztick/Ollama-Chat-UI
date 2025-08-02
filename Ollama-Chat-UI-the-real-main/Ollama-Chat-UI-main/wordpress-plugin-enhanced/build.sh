#!/bin/bash

# Enhanced WordPress Plugin Build Script
# This script prepares the plugin for deployment

echo "🚀 Building Ollama Chat Widget - Enhanced WordPress Plugin..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the plugin directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building production assets..."
npm run build

# Check if build was successful
if [ ! -f "build/index.js" ] || [ ! -f "build/index.css" ]; then
    echo "❌ Build failed! Missing output files."
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📋 Plugin is ready for deployment:"
echo "   - Main plugin file: ollama-chat-widget.php"
echo "   - JavaScript bundle: build/index.js"
echo "   - CSS bundle: build/index.css"
echo ""
echo "🎯 Deployment options:"
echo "   1. Zip this entire folder and upload via WordPress admin"
echo "   2. Upload folder to /wp-content/plugins/ via FTP"
echo "   3. Use version control to deploy to server"
echo ""
echo "⚙️  Configuration:"
echo "   - Go to WordPress Admin → Settings → Ollama Chat"
echo "   - Set your Ollama API URL"
echo "   - Configure default model"
echo ""
echo "🎉 Plugin build complete!"
