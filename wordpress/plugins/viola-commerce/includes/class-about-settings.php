<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_About_Settings
{
    private const OPTION_NAME = 'viola_about_settings';

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
            'Viola About Page',
            'About Page',
            'manage_options',
            'viola-about',
            [$this, 'render_page']
        );
    }

    public function register_settings(): void
    {
        register_setting(
            'viola_about_settings_group',
            self::OPTION_NAME,
            [
                'type' => 'array',
                'sanitize_callback' => [$this, 'sanitize_settings'],
                'default' => viola_commerce_about_defaults(),
            ]
        );
    }

    public function sanitize_settings($input): array
    {
        if (!is_array($input)) {
            return viola_commerce_about_defaults();
        }

        return viola_commerce_merge_about_defaults($input);
    }

    public function enqueue_assets(string $hook): void
    {
        if ($hook !== 'viola_page_viola-about') {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_script(
            'viola-about-settings',
            plugins_url('admin/about-settings.js', VIOLA_COMMERCE_PLUGIN_FILE),
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

        $settings = viola_commerce_get_about_settings();
        include VIOLA_COMMERCE_PLUGIN_DIR . 'admin/about-settings-page.php';
    }
}
