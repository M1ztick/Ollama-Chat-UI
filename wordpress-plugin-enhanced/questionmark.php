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

// Plugin constants
define('OCW_VERSION', '1.0.1');
define('OCW_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OCW_PLUGIN_PATH', plugin_dir_path(__FILE__));

class OllamaChatWidget
{
    private static $instance = null;

    private function __construct()
    {
        // Constructor logic here
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
add_action('plugins_loaded', ['OllamaChatWidget', 'get_instance']);
```

### Optimizations Made:
1. **Constant Initialization**: Moved `OCW_PLUGIN_URL` and `OCW_PLUGIN_PATH` to be defined immediately after checking `ABSPATH`, eliminating the need for a separate `add_action` call since these values don't rely on WordPress hooks.
   
2. **Singleton Pattern Improvements**: Changed the constructor to private to enforce the singleton pattern more strictly, ensuring that instances can only be created via the `get_instance` method.

3.Action Hook Correction**: The initialization of the plugin instance is correctly hooked into `plugins_loaded`, calling the `get_instance` method directly using an array syntax for better readability and understanding of the class context.
```