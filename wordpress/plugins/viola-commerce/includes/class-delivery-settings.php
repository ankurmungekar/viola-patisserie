<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Delivery_Settings
{
    private const OPTION_NAME = 'viola_delivery_settings';

    public function register(): void
    {
        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function register_menu(): void
    {
        add_submenu_page(
            'viola-homepage',
            'Viola Delivery',
            'Delivery',
            'manage_options',
            'viola-delivery',
            [$this, 'render_page']
        );
    }

    public function register_settings(): void
    {
        register_setting(
            'viola_delivery_settings_group',
            self::OPTION_NAME,
            [
                'type' => 'array',
                'sanitize_callback' => [$this, 'sanitize_settings'],
                'default' => viola_commerce_delivery_defaults(),
            ]
        );
    }

    public function sanitize_settings($input): array
    {
        if (!is_array($input)) {
            return viola_commerce_delivery_defaults();
        }

        $defaults = viola_commerce_delivery_defaults();
        $pincodes = isset($input['serviceable_pincodes_text'])
            ? preg_split('/[\s,]+/', (string) $input['serviceable_pincodes_text'])
            : [];

        $pincodes = array_values(array_filter(array_map(
            static fn(string $pincode): string => preg_replace('/\D+/', '', $pincode) ?? '',
            is_array($pincodes) ? $pincodes : []
        )));

        $blackout_dates = isset($input['blackout_dates_text'])
            ? preg_split('/[\s,]+/', (string) $input['blackout_dates_text'])
            : [];

        $blackout_dates = array_values(array_filter(
            is_array($blackout_dates) ? $blackout_dates : []
        ));

        return [
            'serviceable_pincodes' => $pincodes ?: $defaults['serviceable_pincodes'],
            'lead_time_days' => max(0, (int) ($input['lead_time_days'] ?? $defaults['lead_time_days'])),
            'cutoff_hour' => min(23, max(0, (int) ($input['cutoff_hour'] ?? $defaults['cutoff_hour']))),
            'time_slots' => $defaults['time_slots'],
            'blackout_dates' => $blackout_dates,
        ];
    }

    public function render_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $settings = viola_commerce_get_delivery_settings();
        $option_name = self::OPTION_NAME;
        include VIOLA_COMMERCE_PLUGIN_DIR . 'admin/delivery-settings-page.php';
    }
}
