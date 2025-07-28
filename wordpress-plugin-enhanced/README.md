# Ollama Chat Widget - Enhanced WordPress Plugin

A professional WordPress plugin that integrates the RebelDev AI chat widget with your WordPress site. This enhanced version includes modern development workflow, security features, and administrative controls.

## Features

- **RebelDev AI Personality**: Sarcastic but helpful AI assistant
- **Secure WordPress Integration**: AJAX proxy with nonce verification
- **Modern React Interface**: Built with TypeScript and Tailwind CSS
- **Administrative Controls**: WordPress admin panel for configuration
- **Model Selection**: Dynamic model switching capability
- **Responsive Design**: Works on desktop and mobile devices
- **Security Features**: XSS protection, nonce verification, sanitized inputs

## Installation

### Method 1: WordPress Admin (Recommended)
1. Zip the entire `wordpress-plugin-enhanced` folder
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Upload the zip file and activate

### Method 2: FTP Upload
1. Upload the `wordpress-plugin-enhanced` folder to `/wp-content/plugins/`
2. Rename it to `ollama-chat-widget`
3. Activate in WordPress Admin → Plugins

## Development Setup

### Prerequisites
- Node.js 16+ and npm
- WordPress 5.0+
- PHP 7.4+

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode (watch for changes)
npm run dev

# Clean build directory
npm run clean
```

### File Structure
```
wordpress-plugin-enhanced/
├── ollama-chat-widget.php    # Main plugin file
├── package.json              # Node.js dependencies
├── webpack.config.js         # Build configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── src/                     # Source files
│   ├── index.tsx           # React entry point
│   ├── styles.css          # Global styles
│   ├── components/         # React components
│   │   └── ChatWidget.tsx
│   └── lib/                # Utility libraries
│       ├── chat-store.ts   # Zustand state management
│       ├── wordpress-api.ts # WordPress AJAX API
│       └── utils.ts        # Helper functions
└── build/                  # Compiled assets (generated)
    ├── index.js
    └── index.css
```

## Configuration

### WordPress Admin Settings
1. Go to **Settings → Ollama Chat** in WordPress admin
2. Configure:
   - **Ollama API URL**: Your Ollama instance URL (default: https://ollama-chat-ui-e52.pages.dev)
   - **Default Model**: Default AI model to use (default: llama3.2)

### Customization

#### CSS Customization
The widget respects WordPress themes and includes CSS reset to prevent conflicts:
- Positioned as fixed overlay (bottom-right)
- Avoids WordPress admin bar interference
- Custom CSS variables for theming

#### PHP Hooks
Available WordPress hooks for customization:
- `ocw_before_proxy_request` - Filter proxy requests
- `ocw_after_proxy_response` - Modify proxy responses
- `ocw_widget_settings` - Customize widget settings

## Security Features

- **Nonce Verification**: All AJAX requests verified with WordPress nonces
- **Input Sanitization**: All user inputs sanitized using WordPress functions
- **XSS Protection**: Security headers and content validation
- **CSRF Protection**: WordPress built-in CSRF protection
- **SSL Verification**: API requests use SSL verification

## API Integration

The plugin proxies requests to your Ollama instance through WordPress AJAX:
- Endpoint: `/wp-admin/admin-ajax.php`
- Action: `ocw_proxy_ollama`
- Authentication: WordPress nonce system

### Supported Ollama Endpoints
- `/api/tags` - Get available models
- `/api/chat` - Chat with streaming support

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## WordPress Compatibility

- WordPress 5.0+
- PHP 7.4+
- MySQL 5.6+

## Troubleshooting

### Common Issues

1. **Widget not appearing**
   - Check if JavaScript is enabled
   - Verify plugin is activated
   - Check browser console for errors

2. **API connection failed**
   - Verify Ollama URL in settings
   - Check server connectivity
   - Review WordPress error logs

3. **Build errors**
   - Run `npm install` to install dependencies
   - Check Node.js version (16+ required)
   - Clear build directory: `npm run clean`

### Debug Mode
Add to wp-config.php for debugging:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Performance

- **Optimized Bundle**: ~50KB gzipped
- **External React**: Uses WordPress-included React when available
- **Lazy Loading**: Chat interface loads on demand
- **CSS Extraction**: Separate CSS file for better caching

## License

GPL v2 or later - Same as WordPress

## Support

For support and updates, visit: https://mistykmedia.org

## Changelog

### Version 1.0.0
- Initial enhanced WordPress plugin release
- Modern React/TypeScript build system
- WordPress admin integration
- Security enhancements
- Professional plugin architecture
