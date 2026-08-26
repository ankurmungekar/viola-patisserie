<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_homepage_defaults(): array
{
    return [
        'hero' => [
            'eyebrow_tags' => 'Artisanal|Elegant|Unforgettable',
            'title_line_1' => 'Sweet Moments,',
            'title_line_2' => 'Beautifully Crafted',
            'description' => 'Exquisite patisserie, crafted with finest ingredients and a touch of love',
            'cta_label' => 'Explore Collections',
            'cta_url' => '/collections',
            'image_id' => 0,
            'image_url' => '',
        ],
        'our_story' => [
            'eyebrow' => 'our Story',
            'title_dark' => 'Meet the Heart Behind',
            'title_accent' => 'Viola',
            'paragraph_1' => 'Every dessert at Viola Patisserie begins with a passion for craftsmanship, thoughtful design, and creating moments worth celebrating. Founded by Chef Aishwarya, Viola brings together classic pastry techniques and modern elegance to create handcrafted desserts that are as memorable as the occasions they celebrate.',
            'paragraph_2' => 'From intimate celebrations to grand milestones, every creation reflects the care, creativity, and dedication that define the brand.',
            'signature' => 'Aishwarya Sinkar',
            'signature_title' => 'Founder & Pastry Chef',
            'cta_label' => 'Discover Our Story',
            'cta_url' => '/about',
            'image_id' => 0,
            'image_url' => '',
        ],
        'value_props' => [
            [
                'icon' => 'badge',
                'title' => 'Premium Ingredients',
                'description' => 'We use the finest ingredients sourced from trusted artisans worldwide',
            ],
            [
                'icon' => 'mixer',
                'title' => 'Artisan Craftsmanship',
                'description' => 'Each creation is handcrafted with precision, passion and artistic touch',
            ],
            [
                'icon' => 'truck',
                'title' => 'Fresh & Reliable Delivery',
                'description' => 'Timely delivery with the utmost care to ensure freshness and perfection',
            ],
            [
                'icon' => 'gift-box',
                'title' => 'Beautiful Packaging',
                'description' => 'Elegantly packaged to make every moment extra special',
            ],
        ],
        'custom_cakes' => [
            'eyebrow' => 'Custom Cake Orders',
            'title_dark' => 'Made Just for Your',
            'title_accent' => 'Celebration',
            'description' => "Every celebration is unique and your cake should be too. Share your ideas, theme, flavours, and inspiration, and we'll create a handcrafted cake designed exclusively for your special occasion",
            'cta_label' => 'Contact Us for a Custom Order',
            'cta_url' => '/contact',
            'image_id' => 0,
            'image_url' => '',
        ],
        'instagram' => [
            'eyebrow' => 'Follow Our journey',
            'handle' => '@_violapatisserie_',
            'description' => 'Join our growing community on Instagram. Tag us to be featured',
            'cta_label' => 'Follow Us',
            'cta_url' => 'https://instagram.com/_violapatisserie_',
            'posts' => [
                [
                    'views' => '2,186',
                    'image_id' => 0,
                    'image_url' => '',
                    'url' => 'https://instagram.com/_violapatisserie_',
                ],
                [
                    'views' => '1,599',
                    'image_id' => 0,
                    'image_url' => '',
                    'url' => 'https://instagram.com/_violapatisserie_',
                ],
                [
                    'views' => '18.1K',
                    'image_id' => 0,
                    'image_url' => '',
                    'url' => 'https://instagram.com/_violapatisserie_',
                ],
            ],
        ],
        'site' => [
            'name' => 'Viola Patisserie',
            'tagline' => "Handcrafted cakes & desserts, thoughtfully created to celebrate life's sweetest moments.",
            'address' => 'Malad East, Mumbai, Maharashtra',
            'phone' => '+91 70198 42601',
            'phone_display' => 'For Pr-orders: +91 70198 42601',
            'instagram' => '@_violapatisserie_',
            'instagram_url' => 'https://instagram.com/_violapatisserie_',
            'top_bar_message' => 'Visit Our Store',
        ],
    ];
}

function viola_commerce_merge_defaults(array $settings): array
{
    $defaults = viola_commerce_homepage_defaults();

    return array_replace_recursive($defaults, $settings);
}

function viola_commerce_get_homepage_settings(): array
{
    $stored = get_option('viola_homepage_settings', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return viola_commerce_merge_defaults($stored);
}

function viola_commerce_resolve_image(int $attachment_id, string $fallback_url = '', string $alt = ''): array
{
    if ($attachment_id > 0) {
        $src = wp_get_attachment_image_url($attachment_id, 'full');

        if (is_string($src) && $src !== '') {
            return [
                'src' => $src,
                'alt' => (string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true),
            ];
        }
    }

    if ($fallback_url !== '') {
        return [
            'src' => $fallback_url,
            'alt' => $alt,
        ];
    }

    return [
        'src' => '',
        'alt' => $alt,
    ];
}

function viola_commerce_format_homepage_response(): array
{
    $settings = viola_commerce_get_homepage_settings();
    $hero = $settings['hero'];
    $our_story = $settings['our_story'];
    $custom_cakes = $settings['custom_cakes'];
    $instagram = $settings['instagram'];
    $site = $settings['site'];

    $posts = [];

    foreach ($instagram['posts'] as $index => $post) {
        $image = viola_commerce_resolve_image(
            (int) ($post['image_id'] ?? 0),
            (string) ($post['image_url'] ?? ''),
            'Instagram post ' . ($index + 1)
        );

        $posts[] = [
            'id' => $index + 1,
            'views' => (string) ($post['views'] ?? ''),
            'url' => (string) ($post['url'] ?? $instagram['cta_url']),
            'image' => $image,
        ];
    }

    return [
        'hero' => [
            'eyebrowTags' => array_values(array_filter(array_map(
                'trim',
                explode('|', (string) $hero['eyebrow_tags'])
            ))),
            'titleLine1' => (string) $hero['title_line_1'],
            'titleLine2' => (string) $hero['title_line_2'],
            'description' => (string) $hero['description'],
            'ctaLabel' => (string) $hero['cta_label'],
            'ctaUrl' => (string) $hero['cta_url'],
            'image' => viola_commerce_resolve_image(
                (int) $hero['image_id'],
                (string) $hero['image_url'],
                'Viola Patisserie hero'
            ),
        ],
        'ourStory' => [
            'eyebrow' => (string) $our_story['eyebrow'],
            'titleDark' => (string) $our_story['title_dark'],
            'titleAccent' => (string) $our_story['title_accent'],
            'paragraphs' => [
                (string) $our_story['paragraph_1'],
                (string) $our_story['paragraph_2'],
            ],
            'signature' => (string) $our_story['signature'],
            'signatureTitle' => (string) $our_story['signature_title'],
            'ctaLabel' => (string) $our_story['cta_label'],
            'ctaUrl' => (string) $our_story['cta_url'],
            'image' => viola_commerce_resolve_image(
                (int) $our_story['image_id'],
                (string) $our_story['image_url'],
                (string) $our_story['signature']
            ),
        ],
        'valueProps' => array_map(
            static function (array $item): array {
                return [
                    'icon' => (string) ($item['icon'] ?? 'badge'),
                    'title' => (string) ($item['title'] ?? ''),
                    'description' => (string) ($item['description'] ?? ''),
                ];
            },
            $settings['value_props']
        ),
        'customCakes' => [
            'eyebrow' => (string) $custom_cakes['eyebrow'],
            'titleDark' => (string) $custom_cakes['title_dark'],
            'titleAccent' => (string) $custom_cakes['title_accent'],
            'description' => (string) $custom_cakes['description'],
            'ctaLabel' => (string) $custom_cakes['cta_label'],
            'ctaUrl' => (string) $custom_cakes['cta_url'],
            'image' => viola_commerce_resolve_image(
                (int) $custom_cakes['image_id'],
                (string) $custom_cakes['image_url'],
                'Custom celebration cakes'
            ),
        ],
        'instagram' => [
            'eyebrow' => (string) $instagram['eyebrow'],
            'handle' => (string) $instagram['handle'],
            'description' => (string) $instagram['description'],
            'ctaLabel' => (string) $instagram['cta_label'],
            'ctaUrl' => (string) $instagram['cta_url'],
            'posts' => $posts,
        ],
        'site' => [
            'name' => (string) $site['name'],
            'tagline' => (string) $site['tagline'],
            'address' => (string) $site['address'],
            'phone' => (string) $site['phone'],
            'phoneDisplay' => (string) $site['phone_display'],
            'instagram' => (string) $site['instagram'],
            'instagramUrl' => (string) $site['instagram_url'],
            'topBarMessage' => (string) $site['top_bar_message'],
        ],
    ];
}
