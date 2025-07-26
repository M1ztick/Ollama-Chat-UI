# WordPress Cleanup Instructions

## 🧹 Cleaning Up Previous Modifications

Since you modified `functions.php` and `footer.php` previously, here's exactly what to look for and remove:

### 📝 **In `functions.php` - Remove These:**

Look for and **DELETE** any code blocks that contain:

```php
// Look for any of these patterns and remove the entire code block:

// 1. Ollama-related enqueue scripts
function add_ollama_chat_widget() {
    // ... any code here ...
}
add_action('wp_enqueue_scripts', 'add_ollama_chat_widget');

// 2. Direct script/style inclusion
wp_enqueue_style('ollama-chat-css', /* ... */);
wp_enqueue_script('ollama-chat-js', /* ... */);

// 3. Any function with "ollama" in the name
function ollama_* // Remove these functions

// 4. Any hooks related to chat widget
add_action('wp_footer', 'any_ollama_function');
add_action('wp_head', 'any_ollama_function');
```

### 📝 **In `footer.php` - Remove These:**

Look for and **DELETE** any HTML/JavaScript that contains:

```html
<!-- Remove any of these: -->

<!-- 1. Chat widget container -->
<div id="ollama-chat-widget-root"></div>
<div id="chat-widget"></div>
<div class="ollama-chat"></div>

<!-- 2. Direct script includes -->
<script src="path/to/ollama/script.js"></script>
<link rel="stylesheet" href="path/to/ollama/style.css">

<!-- 3. Inline JavaScript for chat -->
<script>
// Any code that creates or initializes chat widget
</script>

<!-- 4. React/Chat related scripts -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

## ✅ **How to Verify Clean Removal:**

1. **Check for conflicts**: After removing old code, visit your site
2. **Look for errors**: Check browser console (F12) for JavaScript errors
3. **Multiple chat widgets**: If you see duplicate chat buttons, you missed some old code

## 🚀 **Fresh Plugin Installation:**

1. **Upload plugin folder** to: `wp-content/plugins/ollama-chat-widget/`
2. **Activate plugin** in WordPress Admin → Plugins
3. **Test**: Visit any page - you should see the purple/pink bot icon in bottom-right corner

## 🔧 **If Something Goes Wrong:**

- **No chat widget appears**: Check that the plugin is activated
- **JavaScript errors**: Ensure all old code was removed from functions.php/footer.php
- **Duplicate widgets**: Old code still exists somewhere - keep looking
- **Styling issues**: Clear any caching plugins

## 📋 **Plugin Files Structure:**
```
wp-content/plugins/ollama-chat-widget/
├── ollama-chat-widget.php  (1.4KB - Main plugin file)
├── index.js               (268KB - React chat widget)
└── index.css              (2.1KB - Styling)
```

Your plugin is **self-contained** and **doesn't need** any theme modifications!
