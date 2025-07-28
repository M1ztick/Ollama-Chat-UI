<?php

/**
 * Plugin Name: Ollama Chat Widget - RebelDev AI
 * Plugin URI: https://mistykmedia.org
 * Description: The RebelDev AI Chat Widget - A sarcastic, witty AI assistant for MistykMedia.org
 * Version: 1.0.0
 * Author: Misty (M1ztick)
 * Author URI: https://mistykmedia.org
 * License: GPL v2 or later
 * Text Domain: ollama-chat-widget
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('OCW_VERSION', '1.0.0');
define('OCW_PLUGIN_URL', plugin_dir_url(__FILE__));
define('OCW_PLUGIN_PATH', plugin_dir_path(__FILE__));

class OllamaChatWidget
{

    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_footer', array($this, 'add_widget_container'));
        add_action('wp_ajax_ocw_proxy_ollama', array($this, 'proxy_ollama_request'));
        add_action('wp_ajax_nopriv_ocw_proxy_ollama', array($this, 'proxy_ollama_request'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function enqueue_scripts()
    {
        if (!is_admin()) {
            // React build files
            wp_enqueue_style(
                'ollama-chat-widget-css',
                OCW_PLUGIN_URL . 'build/index.css',
                array(),
                OCW_VERSION
            );

            wp_enqueue_script(
                'ollama-chat-widget-js',
                OCW_PLUGIN_URL . 'build/index.js',
                array(),
                OCW_VERSION,
                true
            );

            // Pass data to JavaScript
            wp_localize_script('ollama-chat-widget-js', 'ocwData', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('ocw_nonce'),
                'ollamaUrl' => get_option('ocw_ollama_url', 'https://ollama-chat-ui-e52.pages.dev'),
                'siteName' => get_bloginfo('name'),
                'siteUrl' => home_url(),
            ));
        }
    }

    public function add_widget_container()
    {
?>
        <div id="ollama-chat-widget-root"></div>
        <noscript>
            <style>
                .ocw-noscript {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #333;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: Arial, sans-serif;
                    z-index: 9999;
                }
            </style>
            <div class="ocw-noscript">
                Enable JavaScript to chat with RebelDev AI
            </div>
        </noscript>
    <?php
    }

    public function proxy_ollama_request()
    {
        // Verify nonce for security
        if (!wp_verify_nonce($_POST['nonce'], 'ocw_nonce')) {
            wp_die('Security check failed');
        }

        $ollama_url = get_option('ocw_ollama_url', 'https://ollama-chat-ui-e52.pages.dev');
        $endpoint = sanitize_text_field($_POST['endpoint']);
        $data = json_decode(stripslashes($_POST['data']), true);

        // Add security headers
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('X-XSS-Protection: 1; mode=block');

        // Make request to Ollama API
        $response = wp_remote_post($ollama_url . '/api/' . $endpoint, array(
            'body' => json_encode($data),
            'headers' => array(
                'Content-Type' => 'application/json',
                'User-Agent' => 'WordPress-OllamaWidget/' . OCW_VERSION
            ),
            'timeout' => 30,
            'sslverify' => true,
        ));

        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        }

        $body = wp_remote_retrieve_body($response);
        $status_code = wp_remote_retrieve_response_code($response);

        if ($status_code !== 200) {
            wp_send_json_error('API request failed with status: ' . $status_code);
        }

        wp_send_json_success($body);
    }

    public function add_admin_menu()
    {
        add_options_page(
            'Ollama Chat Widget Settings',
            'Ollama Chat',
            'manage_options',
            'ollama-chat-widget',
            array($this, 'settings_page')
        );
    }

    public function register_settings()
    {
        register_setting('ocw_settings', 'ocw_ollama_url', array(
            'sanitize_callback' => 'esc_url_raw'
        ));
        register_setting('ocw_settings', 'ocw_default_model', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
    }

    public function settings_page()
    {
    ?>
        <div class="wrap">
            <h1>Ollama Chat Widget Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('ocw_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">Ollama API URL</th>
                        <td>
                            <input type="url" name="ocw_ollama_url"
                                value="<?php echo esc_attr(get_option('ocw_ollama_url', 'https://ollama-chat-ui-e52.pages.dev')); ?>"
                                class="regular-text" />
                            <p class="description">URL to your Ollama instance or Cloudflare Pages deployment</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Default Model</th>
                        <td>
                            <input type="text" name="ocw_default_model"
                                value="<?php echo esc_attr(get_option('ocw_default_model', 'llama3.2')); ?>"
                                class="regular-text" />
                            <p class="description">Default Ollama model to use</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>

            <div class="notice notice-info">
                <p><strong>RebelDev AI Chat Widget v<?php echo OCW_VERSION; ?></strong></p>
                <p>This widget adds an AI-powered chat assistant to your site. The RebelDev AI has a unique personality - sarcastic, witty, but helpful!</p>
            </div>
        </div>
<?php
    }
}

// Initialize the plugin
OllamaChatWidget::get_instance();
