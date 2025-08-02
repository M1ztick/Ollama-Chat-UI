#!/bin/bash

# Ollama Chat Widget - WordPress Deployment Script
echo "🚀 Deploying Ollama Chat Widget to WordPress..."

# Build the project first
echo "📦 Building project..."
NODE_ENV=production npm run build

# Check if build was successful
if [ ! -f "dist/index.js" ] || [ ! -f "dist/index.css" ]; then
    echo "❌ Build failed - missing required files"
    exit 1
fi

# Copy built files to WordPress plugin directory
echo "📁 Copying files to WordPress plugin directory..."
cp dist/index.js wordpress-plugin/
cp dist/index.css wordpress-plugin/

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Upload the entire 'wordpress-plugin' folder to your WordPress site: mistykmedia.com"
echo "   wp-content/plugins/ollama-chat-widget/"
echo ""
echo "2. Activate the plugin in WordPress admin"
echo ""
echo "3. Clean up any previous modifications:"
echo "   - Remove any Ollama-related code from functions.php"
echo "   - Remove any Ollama-related code from footer.php"
echo ""
echo "📊 Files ready for deployment:"
echo "   - ollama-chat-widget.php ($(wc -c < wordpress-plugin/ollama-chat-widget.php) bytes)"
echo "   - index.js ($(wc -c < wordpress-plugin/index.js 2>/dev/null || echo "0") bytes)"
echo "   - index.css ($(wc -c < wordpress-plugin/index.css 2>/dev/null || echo "0") bytes)"
