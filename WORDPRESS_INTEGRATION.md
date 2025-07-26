# WordPress Integration Guide

This Ollama Chat Widget is ready for integration into your WordPress website.

## Files to Upload to Your WordPress Site

After running `npm run build`, upload these files to your WordPress site:

### Option 1: Direct HTML Integration
Add this to your WordPress theme's `functions.php` or use a code snippet plugin:

```php
function add_ollama_chat_widget() {
    // Only load on frontend, not admin
    if (!is_admin()) {
        wp_enqueue_style('ollama-chat-css', get_template_directory_uri() . '/assets/ollama/main.css', array(), '1.0.0');
        wp_enqueue_script('ollama-chat-js', get_template_directory_uri() . '/assets/ollama/main.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'add_ollama_chat_widget');
```

### Option 2: Plugin Creation
Create a simple WordPress plugin:

1. Create folder: `wp-content/plugins/ollama-chat-widget/`
2. Copy `dist/main.js` and `dist/main.css` to the plugin folder
3. Create `ollama-chat-widget.php`:

```php
<?php
/**
 * Plugin Name: Ollama Chat Widget
 * Description: AI Chat Widget for RebelDev.MistykMedia.com
 * Version: 1.0.0
 * Author: Misty
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

function ollama_chat_widget_enqueue_scripts() {
    wp_enqueue_style('ollama-chat-widget-css', plugin_dir_url(__FILE__) . 'main.css', array(), '1.0.0');
    wp_enqueue_script('ollama-chat-widget-js', plugin_dir_url(__FILE__) . 'main.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'ollama_chat_widget_enqueue_scripts');
```

## Important Notes

1. **Ollama Proxy**: Make sure your Cloudflare Worker at `https://ollama-proxy.mistykmedia.com/api/chat` is running
2. **CORS**: The widget is configured to use your proxy, so no additional CORS setup needed
3. **Positioning**: The widget automatically positions itself in the bottom-right corner
4. **Mobile Responsive**: Works on all screen sizes
5. **Performance**: Optimized bundle size (~268KB) with only necessary dependencies

## Testing

1. Upload the files to your WordPress site
2. Visit any page on your site
3. You should see the purple/pink bot icon in the bottom-right corner
4. Click it to open the chat interface
5. Select a model and start chatting!

## Customization

- **Colors**: Edit the gradient classes in the source code
- **Position**: Modify the `fixed bottom-4 right-4` classes in ChatWidget.tsx
- **Size**: Adjust the `w-[400px] h-[600px]` classes for the chat window
- **Personality**: Edit `src/lib/personality.ts` to change the AI's behavior

## Build Commands

- `npm run dev` - Development build with watch mode
- `npm run build` - Production build (minified)
- `npm run clean` - Clean build artifacts
