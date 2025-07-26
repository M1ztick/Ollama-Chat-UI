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
        // The widget creates its own container, so we don't need to add HTML
        // But we can add a noscript fallback
        echo '<noscript><p>Please enable JavaScript to use the chat widget.</p></noscript>';
    }
}

// Initialize the plugin
new OllamaChatWidget();
