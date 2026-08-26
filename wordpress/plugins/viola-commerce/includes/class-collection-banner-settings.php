<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Collection_Banner_Settings
{
    private const OPTION_NAME = 'viola_collection_banner_settings';

    public function register(): void
    {
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public function register_menu(): void
    {
        add_submenu_page(
            'viola-homepage',
            'Viola Collection Banner',
            'Collection Banner',
            'manage_options',
            'viola-collection-banner',
            [$this, 'render_page']
        );
    }

    public function register_settings(): void
    {
        register_setting(
            'viola_collection_banner_settings_group',
            self::OPTION_NAME,
            [
                'type' => 'array',
                'sanitize_callback' => [$this, 'sanitize_settings'],
                'default' => viola_commerce_collection_banner_defaults(),
            ]
        );
    }

    public function sanitize_settings($input): array
    {
        if (!is_array($input)) {
            return viola_commerce_collection_banner_defaults();
        }

        return viola_commerce_merge_collection_banner_defaults($input);
    }

    public function enqueue_assets(string $hook): void
    {
        if ($hook !== 'viola_page_viola-collection-banner') {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_script(
            'viola-collection-banner-settings',
            plugins_url('admin/collection-banner-settings.js', VIOLA_COMMERCE_PLUGIN_FILE),
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

        $settings = viola_commerce_get_collection_banner_settings();
        include VIOLA_COMMERCE_PLUGIN_DIR . 'admin/collection-banner-settings-page.php';
    }
}
