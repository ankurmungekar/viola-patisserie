<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_collection_banner_defaults(): array
{
    return [
        'eyebrow' => 'Custom Cake Orders',
        'title_prefix' => 'Made Just for Your',
        'title_accent' => 'Celebration',
        'cta_label' => 'Contact Us for a Custom Order',
        'cta_url' => '/contact',
        'image_id' => 0,
        'image_url' => '',
        'insert_after_row' => 3,
    ];
}

function viola_commerce_merge_collection_banner_defaults(array $settings): array
{
    $defaults = viola_commerce_collection_banner_defaults();

    return array_replace_recursive($defaults, $settings);
}

function viola_commerce_get_collection_banner_settings(): array
{
    $stored = get_option('viola_collection_banner_settings', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return viola_commerce_merge_collection_banner_defaults($stored);
}

function viola_commerce_format_collection_banner_response(): array
{
    $settings = viola_commerce_get_collection_banner_settings();

    return [
        'eyebrow' => (string) $settings['eyebrow'],
        'titlePrefix' => (string) $settings['title_prefix'],
        'titleAccent' => (string) $settings['title_accent'],
        'ctaLabel' => (string) $settings['cta_label'],
        'ctaUrl' => (string) $settings['cta_url'],
        'image' => viola_commerce_resolve_image(
            (int) $settings['image_id'],
            (string) $settings['image_url'],
            'Custom celebration cake'
        ),
        'insertAfterRow' => max(1, (int) $settings['insert_after_row']),
    ];
}
