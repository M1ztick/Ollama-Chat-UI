<?php

/**
 * Plugin Name: Ollama Chat Widget
 * Plugin URI: https://mistykmedia.com
 * Description: AI Chat Widget powered by Ollama for MistykMedia.com
 * Version: 1.0.0
 * Author: Misty
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class OllamaChatWidget
{

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_footer', array($this, 'add_widget_container'));
    }

    public function enqueue_scripts()
    {
        // Only load on frontend, not admin pages
        if (!is_admin()) {
            wp_enqueue_style(
                'ollama-chat-widget-css',
                plugin_dir_url(__FILE__) . 'index.css',
                array(),
                '1.0.0'
            );

            wp_enqueue_script(
                'ollama-chat-widget-js',
                plugin_dir_url(__FILE__) . 'index.js',
                array(),
                '1.0.0',
                true // Load in footer
            );
        }
    }

    public function add_widget_container()
    {
        // Output the Rebeldev widget container and script
?>
        <div id="rebeldev-widget">
            <textarea id="user-input" placeholder="Ask Rebeldev anything..."></textarea>
            <button onclick="askRebeldev()">Ask</button>
            <pre id="rebel-output"></pre>
        </div>
        <script>
            async function askRebeldev() {
                const input = document.getElementById("user-input").value;
                const output = document.getElementById("rebel-output");
                output.textContent = "Summoning Rebeldev...";
                try {
                    const res = await fetch("https://chat.mistykmedia.com/api/rebeldev", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            input
                        }),
                    });
                    const data = await res.json();
                    output.textContent = data.reply || "🤬 Error: No comeback generated.";
                } catch (err) {
                    output.textContent = "⚠️ Rebeldev exploded. Try again later.";
                }
            }
        </script>
        <noscript>
            <p>Please enable JavaScript to use the chat widget.</p>
        </noscript>
<?php
    }
}

// Initialize the plugin
new OllamaChatWidget();
