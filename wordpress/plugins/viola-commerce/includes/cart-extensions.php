<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_register_cart_extension(): void
{
    if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
        return;
    }

    woocommerce_store_api_register_endpoint_data(
        [
            'endpoint' => \Automattic\WooCommerce\StoreApi\Schemas\V1\CartItemSchema::IDENTIFIER,
            'namespace' => 'viola_commerce',
            'schema_callback' => static function (): array {
                return [
                    'cake_message' => [
                        'description' => 'Cake message for the order line item.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'delivery_pincode' => [
                        'description' => 'Delivery pincode.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'delivery_date' => [
                        'description' => 'Requested delivery date.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'delivery_slot' => [
                        'description' => 'Requested delivery time slot.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'delivery_zone' => [
                        'description' => 'Delivery zone.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                ];
            },
            'data_callback' => static function (array $cart_item): array {
                return [
                    'cake_message' => (string) ($cart_item['viola_cake_message'] ?? ''),
                    'delivery_pincode' => (string) ($cart_item['viola_delivery_pincode'] ?? ''),
                    'delivery_date' => (string) ($cart_item['viola_delivery_date'] ?? ''),
                    'delivery_slot' => (string) ($cart_item['viola_delivery_slot'] ?? ''),
                    'delivery_zone' => (string) ($cart_item['viola_delivery_zone'] ?? ''),
                ];
            },
        ]
    );
}

function viola_commerce_store_api_add_to_cart_data(array $add_to_cart_data, $request): array
{
    $extensions = null;

    if (is_object($request) && method_exists($request, 'get_param')) {
        $extensions = $request->get_param('extensions');
    } elseif (is_array($request)) {
        $extensions = $request['extensions'] ?? null;
    }

    $viola_extensions = is_array($extensions) ? ($extensions['viola_commerce'] ?? null) : null;

    if (!is_array($viola_extensions)) {
        return $add_to_cart_data;
    }

    if (!empty($viola_extensions['cake_message'])) {
        $add_to_cart_data['viola_cake_message'] = sanitize_text_field((string) $viola_extensions['cake_message']);
    }

    if (!empty($viola_extensions['delivery_pincode'])) {
        $add_to_cart_data['viola_delivery_pincode'] = sanitize_text_field((string) $viola_extensions['delivery_pincode']);
    }

    if (!empty($viola_extensions['delivery_date'])) {
        $add_to_cart_data['viola_delivery_date'] = sanitize_text_field((string) $viola_extensions['delivery_date']);
    }

    if (!empty($viola_extensions['delivery_slot'])) {
        $add_to_cart_data['viola_delivery_slot'] = sanitize_text_field((string) $viola_extensions['delivery_slot']);
    }

    if (!empty($viola_extensions['delivery_zone'])) {
        $add_to_cart_data['viola_delivery_zone'] = sanitize_text_field((string) $viola_extensions['delivery_zone']);
    }

    return $add_to_cart_data;
}

function viola_commerce_build_store_image(int $attachment_id): ?array
{
    if ($attachment_id <= 0) {
        return null;
    }

    $src = wp_get_attachment_image_url($attachment_id, 'full');

    if (!is_string($src) || $src === '') {
        return null;
    }

    $thumbnail = wp_get_attachment_image_url($attachment_id, 'woocommerce_thumbnail');

    return [
        'id' => $attachment_id,
        'src' => $src,
        'thumbnail' => is_string($thumbnail) && $thumbnail !== '' ? $thumbnail : $src,
        'alt' => (string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true),
        'name' => get_the_title($attachment_id),
    ];
}

function viola_commerce_get_product_gallery_images($product): array
{
    if (!is_object($product) || !method_exists($product, 'get_id')) {
        return [];
    }

    $wc_product = $product;

    if (method_exists($wc_product, 'is_type') && $wc_product->is_type('variation') && method_exists($wc_product, 'get_parent_id')) {
        $parent = wc_get_product($wc_product->get_parent_id());

        if ($parent) {
            $wc_product = $parent;
        }
    }

    if (!method_exists($wc_product, 'get_image_id') || !method_exists($wc_product, 'get_gallery_image_ids')) {
        return [];
    }

    $ordered_ids = [];
    $thumbnail_id = (int) $wc_product->get_image_id();

    if ($thumbnail_id > 0) {
        $ordered_ids[] = $thumbnail_id;
    }

    foreach ($wc_product->get_gallery_image_ids() as $gallery_id) {
        $ordered_ids[] = (int) $gallery_id;
    }

    $ordered_ids = array_values(array_unique(array_filter($ordered_ids)));
    $images = [];

    foreach ($ordered_ids as $attachment_id) {
        $image = viola_commerce_build_store_image($attachment_id);

        if ($image !== null) {
            $images[] = $image;
        }
    }

    return $images;
}

function viola_commerce_store_api_product_response(array $response, $product): array
{
    $storage = get_post_meta($product->get_id(), '_storage_instructions', true);

    if (is_string($storage) && $storage !== '') {
        $response['storage_instructions'] = $storage;
    }

    $gallery_images = viola_commerce_get_product_gallery_images($product);

    if (count($gallery_images) > 0) {
        $response['images'] = $gallery_images;
    }

    return $response;
}

function viola_commerce_persist_order_line_item_meta($item, string $cart_item_key, array $values): void
{
    $meta_map = [
        'viola_cake_message' => 'Cake Message',
        'viola_delivery_pincode' => 'Delivery Pincode',
        'viola_delivery_date' => 'Delivery Date',
        'viola_delivery_slot' => 'Delivery Slot',
        'viola_delivery_zone' => 'Delivery Zone',
    ];

    foreach ($meta_map as $key => $label) {
        if (!empty($values[$key])) {
            $item->add_meta_data($label, $values[$key], true);
        }
    }
}

function viola_commerce_register_cart_hooks(): void
{
    add_action('woocommerce_blocks_loaded', 'viola_commerce_register_cart_extension');
    add_filter('woocommerce_store_api_add_to_cart_data', 'viola_commerce_store_api_add_to_cart_data', 10, 2);
    add_filter('woocommerce_store_api_product_response', 'viola_commerce_store_api_product_response', 10, 2);
    add_action('woocommerce_checkout_create_order_line_item', 'viola_commerce_persist_order_line_item_meta', 10, 3);
}
