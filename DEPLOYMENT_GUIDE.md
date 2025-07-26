# 🚀 WordPress Deployment Instructions

## Prerequisites Checklist
- [ ] Ollama proxy running at `https://ollama-proxy.mistykmedia.com/api/chat`
- [ ] WordPress admin access
- [ ] FTP/cPanel file manager access
- [ ] Fresh build files (`npm run build` completed)

## 🎯 Method 1: WordPress Plugin (Recommended)

### Step 1: Create Plugin Directory
1. Connect to your WordPress site via FTP or cPanel File Manager
2. Navigate to `/wp-content/plugins/`
3. Create new folder: `ollama-chat-widget`

### Step 2: Upload Files
Upload these files to `/wp-content/plugins/ollama-chat-widget/`:
- `ollama-chat-widget.php` (from wordpress-plugin folder)
- `index.js` (from dist folder)
- `index.css` (from dist folder)

### Step 3: Activate Plugin
1. Go to WordPress Admin → Plugins
2. Find "Ollama Chat Widget"
3. Click "Activate"

### Step 4: Test
Visit any page on your website - you should see the purple bot icon in bottom-right corner!

---

## 🎯 Method 2: Theme Integration

### Add to functions.php:
```php
function add_ollama_chat_widget() {
    if (!is_admin()) {
        wp_enqueue_style('ollama-chat-css', get_template_directory_uri() . '/assets/ollama/index.css', array(), '1.0.0');
        wp_enqueue_script('ollama-chat-js', get_template_directory_uri() . '/assets/ollama/index.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'add_ollama_chat_widget');
```

### Upload Files:
- Create folder: `/wp-content/themes/your-theme/assets/ollama/`
- Upload `index.js` and `index.css` there

---

## 🎯 Method 3: Direct HTML (Quick Test)

Add to your theme's `footer.php` before `</body>`:
```html
<link rel="stylesheet" href="/path/to/index.css">
<script src="/path/to/index.js"></script>
```

---

## 🔧 Troubleshooting

### Widget Not Appearing?
1. Check browser console for errors (F12)
2. Verify files are loading (Network tab in DevTools)
3. Ensure proxy URL is accessible

### Styling Issues?
1. Check for CSS conflicts with your theme
2. Try adding `!important` to widget styles if needed
3. Verify CSS file is loading

### Chat Not Working?
1. Test proxy URL directly: `https://ollama-proxy.mistykmedia.com/api/chat`
2. Check Ollama server is running
3. Verify model is available

---

## 🧹 Undoing Previous Changes

To remove previous WordPress modifications:

### If you modified functions.php:
1. Go to Appearance → Theme Editor → functions.php
2. Remove any Ollama-related code you added
3. Save changes

### If you installed a previous plugin:
1. Go to Plugins → Installed Plugins
2. Deactivate and delete old Ollama plugin
3. Then install the new one

### If you added custom CSS/JS:
1. Remove from Customizer → Additional CSS
2. Remove any hardcoded `<script>` or `<link>` tags from theme files

---

## ⚡ Performance Notes

- **Bundle size**: 268KB (optimized for production)
- **Load time**: Loads in footer, won't block page rendering
- **Caching**: Files are versioned for cache busting
- **Mobile friendly**: Responsive design included

---

## 🎨 Customization Options

### Change Widget Position:
Edit `ChatWidget.tsx` and modify:
```tsx
<div className="fixed bottom-4 right-4 z-50">
```

### Change Colors:
Edit the gradient classes:
```tsx
className="bg-gradient-to-r from-purple-500 to-pink-500"
```

### Change Size:
Edit the card dimensions:
```tsx
className="w-[400px] h-[600px]"
```

### Change AI Personality:
Edit `src/lib/personality.ts` and rebuild.

---

## 🚀 Go Live Checklist

- [ ] Plugin uploaded and activated
- [ ] Widget appears on frontend
- [ ] Chat opens when clicked
- [ ] Can select models from dropdown
- [ ] Messages send and receive responses
- [ ] Works on mobile devices
- [ ] No console errors
