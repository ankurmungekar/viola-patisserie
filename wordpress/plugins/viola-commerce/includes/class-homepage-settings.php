<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Homepage_Settings
{
    private const OPTION_NAME = 'viola_homepage_settings';

    public function register(): void
    {
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function register_menu(): void
    {
        add_menu_page(
            'Viola Homepage',
            'Viola',
            'manage_options',
            'viola-homepage',
            [$this, 'render_page'],
            'dashicons-store',
            58
        );
    }

    public function register_settings(): void
    {
        register_setting(
            'viola_homepage_settings_group',
            self::OPTION_NAME,
            [
                'type' => 'array',
                'sanitize_callback' => [$this, 'sanitize_settings'],
                'default' => viola_commerce_homepage_defaults(),
            ]
        );
    }

    public function sanitize_settings($input): array
    {
        if (!is_array($input)) {
            return viola_commerce_homepage_defaults();
        }

        return viola_commerce_merge_defaults($input);
    }

    public function enqueue_assets(string $hook): void
    {
        if ($hook !== 'toplevel_page_viola-homepage') {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_script(
            'viola-homepage-settings',
            plugins_url('admin/homepage-settings.js', VIOLA_COMMERCE_PLUGIN_FILE),
            ['jquery'],
            VIOLA_COMMERCE_VERSION,
            true
        );
    }

    public function render_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $settings = viola_commerce_get_homepage_settings();
        include VIOLA_COMMERCE_PLUGIN_DIR . 'admin/homepage-settings-page.php';
    }
}
