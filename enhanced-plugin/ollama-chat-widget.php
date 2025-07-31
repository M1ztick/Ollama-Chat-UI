<?php

/**
 * Plugin Name: Ollama Chat Widget - Mistyk Media
 * Plugin URI: https://mistykmedia.com
 * Description: A sarcastic, witty AI assistant widget for MistykMedia.com
 * Version: 1.0.1
 * Author: Misty (M1ztick)
 * Author URI: https://mistykmedia.com
 * License: GPL v2 or later
 * Text Domain: ollama-chat-widget
 */

defined('ABSPATH') || exit;

// Plugin constants should be defined immediately since this file is loaded by WordPress
if (!defined('OCW_VERSION')) {
    define('OCW_VERSION', '1.0.1');
}
if (!defined('OCW_PLUGIN_URL')) {
    define('OCW_PLUGIN_URL', plugin_dir_url(__FILE__));
}
if (!defined('OCW_PLUGIN_PATH')) {
    define('OCW_PLUGIN_PATH', plugin_dir_path(__FILE__));
}

class OllamaChatWidget
{
    private static $instance = null;

    public static function initialize()
    {
        self::get_instance();
    }

    private function __construct()
    {
        // Constructor logic here
        if (defined('ABSPATH') && function_exists('add_action')) {
            $this->init_hooks();
        }
    }

    private function init_hooks()
    {
        if (function_exists('add_action')) {
            add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
            add_action('wp_footer', array($this, 'render_chat_widget'));
        }
    }

    public function enqueue_scripts()
    {
        // Enqueue necessary scripts and styles
    }

    public function render_chat_widget()
    {
        // Render the chat widget HTML
    }

    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}

// Initialize the plugin instance
add_action('plugins_loaded', ['OllamaChatWidget', 'initialize']);
