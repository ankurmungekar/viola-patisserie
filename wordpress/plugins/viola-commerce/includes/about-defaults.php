<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_about_defaults(): array
{
    return [
        'story' => [
            'eyebrow' => 'our Story',
            'title_line_1' => 'A Story of Passion,',
            'title_accent' => 'Craftsmanship & Sweet Memories',
            'paragraph_1' => 'Founded in 2021, Viola Patisserie was born from a passion for creating desserts that bring joy, spark connection, and turn everyday moments into lasting memories. What began as a love for baking has grown into a destination for handcrafted cakes and desserts that celebrate both exceptional flavour and thoughtful design.',
            'paragraph_2' => 'At the heart of everything we create is a commitment to craftsmanship. Every dessert is made in small batches using carefully selected ingredients, time-honoured baking techniques, and meticulous attention to detail.',
            'image_id' => 0,
            'image_url' => '',
        ],
        'highlight' => [
            'paragraph_1' => "Our style blends artisanal baking with modern elegance, resulting in creations that feel timeless yet contemporary. Whether it's a bespoke celebration cake, a box of delicate pastries, or a dessert shared over coffee, every piece is crafted with the same care and dedication.",
            'paragraph_2' => "Since opening our doors, we've had the privilege of delivering over 6,000 orders, becoming a part of birthdays, weddings, anniversaries, festive celebrations, and countless everyday indulgences. Every order is a reminder of the trust our customers place in us, and it inspires us to continue creating desserts that make every occasion a little more special.",
            'stat_value' => '6,000+',
            'stat_label' => 'Orders Delivered',
            'image_id' => 0,
            'image_url' => '',
        ],
        'founder' => [
            'eyebrow' => 'Meet the founder',
            'title_line_1' => 'The Heart',
            'title_accent' => 'Behind Viola',
            'paragraph_1' => "Not every engineer ends up covered in flour—but that's exactly how Chef Aishwarya found her calling.",
            'paragraph_2' => "After graduating in engineering, she chose to follow her passion for pastry and trained at the Academy of Pastry Arts, where she discovered that creating desserts brought her far more joy than solving equations. What followed were over three years of hands-on experience at some of Mumbai's renowned hotels and patisseries, refining her craft and learning from some of the industry's best.",
            'paragraph_3' => "In 2021, she turned that dream into Viola Patisserie, a space where classic techniques meet modern creativity, and every dessert is made with intention. From developing new flavours to perfecting the tiniest finishing touches, she's involved in every step of the process, ensuring each creation reflects the quality and care that define the brand. Through Viola Patisserie, she hopes to create desserts that become a part of family traditions, heartfelt celebrations, and memories that people look back on with a smile.",
            'signature' => 'Aishwarya Sinkar',
            'signature_title' => 'Founder & Pastry Chef',
            'image_id' => 0,
            'image_url' => '',
        ],
    ];
}

function viola_commerce_merge_about_defaults(array $settings): array
{
    $defaults = viola_commerce_about_defaults();

    return array_replace_recursive($defaults, $settings);
}

function viola_commerce_get_about_settings(): array
{
    $stored = get_option('viola_about_settings', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return viola_commerce_merge_about_defaults($stored);
}

function viola_commerce_format_about_response(): array
{
    $settings = viola_commerce_get_about_settings();
    $story = $settings['story'];
    $highlight = $settings['highlight'];
    $founder = $settings['founder'];

    return [
        'story' => [
            'eyebrow' => (string) $story['eyebrow'],
            'titleLine1' => (string) $story['title_line_1'],
            'titleAccent' => (string) $story['title_accent'],
            'paragraphs' => [
                (string) $story['paragraph_1'],
                (string) $story['paragraph_2'],
            ],
            'image' => viola_commerce_resolve_image(
                (int) $story['image_id'],
                (string) $story['image_url'],
                'Chef decorating a celebration cake at Viola Patisserie'
            ),
        ],
        'highlight' => [
            'paragraphs' => [
                (string) $highlight['paragraph_1'],
                (string) $highlight['paragraph_2'],
            ],
            'statValue' => (string) $highlight['stat_value'],
            'statLabel' => (string) $highlight['stat_label'],
            'image' => viola_commerce_resolve_image(
                (int) $highlight['image_id'],
                (string) $highlight['image_url'],
                'Gift-boxed cakes from Viola Patisserie'
            ),
        ],
        'founder' => [
            'eyebrow' => (string) $founder['eyebrow'],
            'titleLine1' => (string) $founder['title_line_1'],
            'titleAccent' => (string) $founder['title_accent'],
            'paragraphs' => [
                (string) $founder['paragraph_1'],
                (string) $founder['paragraph_2'],
                (string) $founder['paragraph_3'],
            ],
            'signature' => (string) $founder['signature'],
            'signatureTitle' => (string) $founder['signature_title'],
            'image' => viola_commerce_resolve_image(
                (int) $founder['image_id'],
                (string) $founder['image_url'],
                (string) $founder['signature']
            ),
        ],
    ];
}
