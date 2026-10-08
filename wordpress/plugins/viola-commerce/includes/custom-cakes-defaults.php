<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_custom_cakes_occasions(): array
{
    return ['all', 'wedding', 'birthday', 'anniversary'];
}

function viola_commerce_custom_cakes_defaults(): array
{
    return [
        'banner' => [
            'eyebrow' => 'Custom Cake Orders',
            'title_lead' => 'Have a',
            'title_accent' => 'Unique Idea?',
            'description' => 'From sketches to inspiration photos, share your thoughts with us we’d love to create something extraordinary just for you',
            'cta_label' => 'Chat on Whatsapp',
            'cta_url' => 'https://wa.me/917019842601',
            'image_id' => 0,
            'image_url' => '',
        ],
        'highlights' => [
            [
                'icon' => 'cake',
                'title' => 'Personalized Design',
                'description' => 'Share your theme,colors and ideas',
            ],
            [
                'icon' => 'badge',
                'title' => 'Premium Ingredients',
                'description' => 'Delicious, handcrafted with care',
            ],
            [
                'icon' => 'heart',
                'title' => 'Perfect for Every Occasion',
                'description' => 'Birthdays, anniversaries, weddings & more',
            ],
            [
                'icon' => 'chat',
                'title' => 'Quick & Easy Process',
                'description' => 'Chat with us on WhatsApp to get started',
            ],
        ],
        'gallery' => [
            'eyebrow' => 'our Creations',
            'title' => 'Custom Cakes',
            'title_accent' => 'Gallery',
            'view_more_label' => 'View More',
            'empty_message' => 'More custom cakes for this occasion are coming soon.',
            'items' => [],
        ],
    ];
}

function viola_commerce_sanitize_custom_cakes_settings(array $input): array
{
    $defaults = viola_commerce_custom_cakes_defaults();
    $banner_in = is_array($input['banner'] ?? null) ? $input['banner'] : [];
    $highlights_in = is_array($input['highlights'] ?? null) ? $input['highlights'] : [];
    $gallery_in = is_array($input['gallery'] ?? null) ? $input['gallery'] : [];
    $items_in = is_array($gallery_in['items'] ?? null) ? $gallery_in['items'] : [];
    $occasions = viola_commerce_custom_cakes_occasions();

    $highlights = [];

    foreach ($defaults['highlights'] as $index => $highlight) {
        $incoming = is_array($highlights_in[$index] ?? null) ? $highlights_in[$index] : [];

        $highlights[] = [
            'icon' => $highlight['icon'],
            'title' => sanitize_text_field((string) ($incoming['title'] ?? $highlight['title'])),
            'description' => sanitize_text_field((string) ($incoming['description'] ?? $highlight['description'])),
        ];
    }

    $items = [];

    foreach ($items_in as $item) {
        if (!is_array($item)) {
            continue;
        }

        $image_id = absint($item['image_id'] ?? 0);

        if ($image_id <= 0) {
            continue;
        }

        $occasion = sanitize_key((string) ($item['occasion'] ?? 'all'));

        if (!in_array($occasion, $occasions, true)) {
            $occasion = 'all';
        }

        $items[] = [
            'image_id' => $image_id,
            'alt' => sanitize_text_field((string) ($item['alt'] ?? '')),
            'occasion' => $occasion,
        ];
    }

    $cta_url = esc_url_raw((string) ($banner_in['cta_url'] ?? $defaults['banner']['cta_url']));

    if ($cta_url === '') {
        $cta_url = $defaults['banner']['cta_url'];
    }

    return [
        'banner' => [
            'eyebrow' => sanitize_text_field((string) ($banner_in['eyebrow'] ?? $defaults['banner']['eyebrow'])),
            'title_lead' => sanitize_text_field((string) ($banner_in['title_lead'] ?? $defaults['banner']['title_lead'])),
            'title_accent' => sanitize_text_field((string) ($banner_in['title_accent'] ?? $defaults['banner']['title_accent'])),
            'description' => sanitize_textarea_field((string) ($banner_in['description'] ?? $defaults['banner']['description'])),
            'cta_label' => sanitize_text_field((string) ($banner_in['cta_label'] ?? $defaults['banner']['cta_label'])),
            'cta_url' => $cta_url,
            'image_id' => absint($banner_in['image_id'] ?? 0),
            'image_url' => '',
        ],
        'highlights' => $highlights,
        'gallery' => [
            'eyebrow' => sanitize_text_field((string) ($gallery_in['eyebrow'] ?? $defaults['gallery']['eyebrow'])),
            'title' => sanitize_text_field((string) ($gallery_in['title'] ?? $defaults['gallery']['title'])),
            'title_accent' => sanitize_text_field((string) ($gallery_in['title_accent'] ?? $defaults['gallery']['title_accent'])),
            'view_more_label' => sanitize_text_field((string) ($gallery_in['view_more_label'] ?? $defaults['gallery']['view_more_label'])),
            'empty_message' => sanitize_text_field((string) ($gallery_in['empty_message'] ?? $defaults['gallery']['empty_message'])),
            'items' => $items,
        ],
    ];
}

function viola_commerce_get_custom_cakes_settings(): array
{
    $stored = get_option('viola_custom_cakes_settings', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return viola_commerce_sanitize_custom_cakes_settings($stored);
}

function viola_commerce_format_custom_cakes_response(): array
{
    $settings = viola_commerce_get_custom_cakes_settings();
    $banner = $settings['banner'];
    $gallery = $settings['gallery'];
    $items = [];

    foreach ($gallery['items'] as $index => $item) {
        $image = viola_commerce_resolve_image(
            (int) $item['image_id'],
            '',
            (string) $item['alt']
        );

        if ($image['src'] === '') {
            continue;
        }

        $items[] = [
            'id' => $index + 1,
            'src' => $image['src'],
            'alt' => $item['alt'] !== '' ? $item['alt'] : ($image['alt'] ?: 'Custom cake'),
            'occasion' => $item['occasion'],
        ];
    }

    $highlights = [];

    foreach ($settings['highlights'] as $index => $highlight) {
        $highlights[] = [
            'id' => $highlight['icon'] . '-' . $index,
            'icon' => $highlight['icon'],
            'title' => (string) $highlight['title'],
            'description' => (string) $highlight['description'],
        ];
    }

    return [
        'banner' => [
            'eyebrow' => (string) $banner['eyebrow'],
            'titleLead' => (string) $banner['title_lead'],
            'titleAccent' => (string) $banner['title_accent'],
            'description' => (string) $banner['description'],
            'ctaLabel' => (string) $banner['cta_label'],
            'ctaUrl' => (string) $banner['cta_url'],
            'image' => viola_commerce_resolve_image(
                (int) $banner['image_id'],
                (string) $banner['image_url'],
                'Floral three-tier custom celebration cake'
            ),
        ],
        'highlights' => $highlights,
        'gallery' => [
            'eyebrow' => (string) $gallery['eyebrow'],
            'title' => (string) $gallery['title'],
            'titleAccent' => (string) $gallery['title_accent'],
            'viewMoreLabel' => (string) $gallery['view_more_label'],
            'emptyMessage' => (string) $gallery['empty_message'],
            'items' => $items,
        ],
    ];
}
