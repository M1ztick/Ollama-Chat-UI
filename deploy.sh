#!/bin/bash

# Ollama Chat Widget - WordPress Deployment Script
# This script prepares your widget for WordPress deployment

echo "🚀 Preparing Ollama Chat Widget for WordPress deployment..."

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Please run 'npm run build' first."
    exit 1
fi

# Create deployment folder
DEPLOY_DIR="wordpress-deployment"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy plugin file
if [ -f "wordpress-plugin/ollama-chat-widget.php" ]; then
    cp wordpress-plugin/ollama-chat-widget.php $DEPLOY_DIR/
    echo "✅ Plugin PHP file copied"
else
    echo "❌ Error: Plugin PHP file not found"
    exit 1
fi

# Copy build files
if [ -f "dist/index.js" ] && [ -f "dist/index.css" ]; then
    cp dist/index.js $DEPLOY_DIR/
    cp dist/index.css $DEPLOY_DIR/
    echo "✅ Build files copied ($(du -h dist/index.js | cut -f1) JS, $(du -h dist/index.css | cut -f1) CSS)"
else
    echo "❌ Error: Build files not found. Please run 'npm run build' first."
    exit 1
fi

# Create README for deployment
cat > $DEPLOY_DIR/README.txt << EOF
Ollama Chat Widget - WordPress Plugin
=====================================

Upload all files in this folder to:
/wp-content/plugins/ollama-chat-widget/

Then activate the plugin in WordPress Admin.

Files included:
- ollama-chat-widget.php (WordPress plugin file)
- index.js (Chat widget JavaScript - $(du -h dist/index.js | cut -f1))
- index.css (Widget styles - $(du -h dist/index.css | cut -f1))

Support: https://rebeldev.mistykmedia.com
EOF

echo "✅ Deployment package created in '$DEPLOY_DIR' folder"
echo ""
echo "📋 Next steps:"
echo "1. Upload all files from '$DEPLOY_DIR' to /wp-content/plugins/ollama-chat-widget/"
echo "2. Go to WordPress Admin → Plugins"
echo "3. Activate 'Ollama Chat Widget'"
echo "4. Visit your website to see the chat widget!"
echo ""
echo "📊 Bundle info:"
echo "   JavaScript: $(du -h dist/index.js | cut -f1)"
echo "   CSS: $(du -h dist/index.css | cut -f1)"
echo "   Total: $(du -sh $DEPLOY_DIR | cut -f1)"
