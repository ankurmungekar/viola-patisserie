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
                    'order_note' => [
                        'description' => 'Customer note for the order line item.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'color' => [
                        'description' => 'Selected product color.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'flavor' => [
                        'description' => 'Selected product flavor.',
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
                    'order_note' => (string) ($cart_item['viola_order_note'] ?? ''),
                    'color' => (string) ($cart_item['viola_color'] ?? ''),
                    'flavor' => (string) ($cart_item['viola_flavor'] ?? ''),
                ];
            },
        ]
    );
}

function viola_commerce_resolve_product_meta_id($product): int
{
    if (!is_object($product) || !method_exists($product, 'get_id')) {
        return 0;
    }

    $product_id = (int) $product->get_id();

    if (
        method_exists($product, 'is_type')
        && $product->is_type('variation')
        && method_exists($product, 'get_parent_id')
    ) {
        $parent_id = (int) $product->get_parent_id();

        if ($parent_id > 0) {
            $product_id = $parent_id;
        }
    }

    return $product_id;
}

function viola_commerce_get_product_detail_fields(int $product_id): array
{
    if ($product_id <= 0) {
        return [
            'allergens' => '',
            'consumption' => '',
            'storage_info' => '',
            'color_options' => [],
            'flavor_options' => [],
        ];
    }

    return [
        'allergens' => Viola_Commerce_Product_Meta::get_allergens($product_id),
        'consumption' => Viola_Commerce_Product_Meta::get_consumption($product_id),
        'storage_info' => Viola_Commerce_Product_Meta::get_storage_info($product_id),
        'color_options' => Viola_Commerce_Product_Meta::get_color_options($product_id),
        'flavor_options' => Viola_Commerce_Product_Meta::get_flavor_options($product_id),
    ];
}

function viola_commerce_register_product_extension(): void
{
    if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
        return;
    }

    if (!class_exists(\Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::class)) {
        return;
    }

    woocommerce_store_api_register_endpoint_data(
        [
            'endpoint' => \Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::IDENTIFIER,
            'namespace' => 'viola_commerce',
            'schema_callback' => static function (): array {
                return [
                    'allergens' => [
                        'description' => 'Product allergens.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'consumption' => [
                        'description' => 'Product consumption instructions.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'storage_info' => [
                        'description' => 'Product storage information.',
                        'type' => 'string',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'color_options' => [
                        'description' => 'Selectable color options.',
                        'type' => 'array',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                    'flavor_options' => [
                        'description' => 'Selectable flavor options.',
                        'type' => 'array',
                        'context' => ['view', 'edit'],
                        'readonly' => true,
                    ],
                ];
            },
            'data_callback' => static function ($product): array {
                $product_id = viola_commerce_resolve_product_meta_id($product);

                return viola_commerce_get_product_detail_fields($product_id);
            },
        ]
    );
}

function viola_commerce_register_store_api_extensions(): void
{
    viola_commerce_register_cart_extension();
    viola_commerce_register_product_extension();
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

    if (!isset($add_to_cart_data['cart_item_data']) || !is_array($add_to_cart_data['cart_item_data'])) {
        $add_to_cart_data['cart_item_data'] = [];
    }

    if (!empty($viola_extensions['cake_message'])) {
        $add_to_cart_data['cart_item_data']['viola_cake_message'] = sanitize_text_field((string) $viola_extensions['cake_message']);
    }

    if (!empty($viola_extensions['delivery_pincode'])) {
        $add_to_cart_data['cart_item_data']['viola_delivery_pincode'] = sanitize_text_field((string) $viola_extensions['delivery_pincode']);
    }

    if (!empty($viola_extensions['delivery_date'])) {
        $add_to_cart_data['cart_item_data']['viola_delivery_date'] = sanitize_text_field((string) $viola_extensions['delivery_date']);
    }

    if (!empty($viola_extensions['delivery_slot'])) {
        $add_to_cart_data['cart_item_data']['viola_delivery_slot'] = sanitize_text_field((string) $viola_extensions['delivery_slot']);
    }

    if (!empty($viola_extensions['delivery_zone'])) {
        $add_to_cart_data['cart_item_data']['viola_delivery_zone'] = sanitize_text_field((string) $viola_extensions['delivery_zone']);
    }

    if (!empty($viola_extensions['order_note'])) {
        $add_to_cart_data['cart_item_data']['viola_order_note'] = sanitize_textarea_field((string) $viola_extensions['order_note']);
    }

    if (!empty($viola_extensions['color'])) {
        $add_to_cart_data['cart_item_data']['viola_color'] = sanitize_text_field((string) $viola_extensions['color']);
    }

    if (!empty($viola_extensions['flavor'])) {
        $add_to_cart_data['cart_item_data']['viola_flavor'] = sanitize_text_field((string) $viola_extensions['flavor']);
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
    if (!is_object($product) || !method_exists($product, 'get_id')) {
        return $response;
    }

    $fields = viola_commerce_get_product_detail_fields(
        viola_commerce_resolve_product_meta_id($product),
    );

    if ($fields['allergens'] !== '') {
        $response['allergens'] = $fields['allergens'];
    }

    if ($fields['consumption'] !== '') {
        $response['consumption'] = $fields['consumption'];
    }

    if ($fields['storage_info'] !== '') {
        $response['storage_info'] = $fields['storage_info'];
    }

    if (count($fields['color_options']) > 0) {
        $response['color_options'] = $fields['color_options'];
    }

    if (count($fields['flavor_options']) > 0) {
        $response['flavor_options'] = $fields['flavor_options'];
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
        'viola_order_note' => 'Order Note',
        'viola_color' => 'Color',
        'viola_flavor' => 'Flavor',
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

function viola_commerce_copy_delivery_meta_to_order($order, $data): void
{
    if (!is_object($order) || !method_exists($order, 'get_id')) {
        return;
    }

    $pincode = '';
    $delivery_date = '';
    $delivery_slot = '';
    $delivery_zone = '';

    foreach ($order->get_items() as $item) {
        if (!is_object($item) || !method_exists($item, 'get_meta')) {
            continue;
        }

        $pincode = $pincode !== '' ? $pincode : (string) $item->get_meta('Delivery Pincode');
        $delivery_date = $delivery_date !== '' ? $delivery_date : (string) $item->get_meta('Delivery Date');
        $delivery_slot = $delivery_slot !== '' ? $delivery_slot : (string) $item->get_meta('Delivery Slot');
        $delivery_zone = $delivery_zone !== '' ? $delivery_zone : (string) $item->get_meta('Delivery Zone');
    }

    if ($pincode !== '') {
        $order->update_meta_data('_viola_delivery_pincode', $pincode);
    }

    if ($delivery_date !== '') {
        $order->update_meta_data('_viola_delivery_date', $delivery_date);
    }

    if ($delivery_slot !== '') {
        $order->update_meta_data('_viola_delivery_slot', $delivery_slot);
    }

    if ($delivery_zone !== '') {
        $order->update_meta_data('_viola_delivery_zone', $delivery_zone);
    }
}

function viola_commerce_register_cart_hooks(): void
{
    if (did_action('woocommerce_blocks_loaded')) {
        viola_commerce_register_store_api_extensions();
    } else {
        add_action('woocommerce_blocks_loaded', 'viola_commerce_register_store_api_extensions');
    }

    add_filter('woocommerce_store_api_add_to_cart_data', 'viola_commerce_store_api_add_to_cart_data', 10, 2);
    add_filter('woocommerce_store_api_product_response', 'viola_commerce_store_api_product_response', 10, 2);
    add_action('woocommerce_checkout_create_order_line_item', 'viola_commerce_persist_order_line_item_meta', 10, 3);
    add_action('woocommerce_checkout_create_order', 'viola_commerce_copy_delivery_meta_to_order', 10, 2);
}
