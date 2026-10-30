<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Product_Meta
{
    private const META_ALLERGENS = '_viola_allergens';
    private const META_CONSUMPTION = '_viola_consumption';
    private const META_STORAGE_INFO = '_viola_storage_info';

    public function register(): void
    {
        add_action('woocommerce_product_options_general_product_data', [$this, 'render_fields']);
        add_action('woocommerce_process_product_meta', [$this, 'save_fields']);
    }

    public function render_fields(): void
    {
        echo '<div class="options_group viola-commerce-product-meta">';

        woocommerce_wp_textarea_input(
            [
                'id' => self::META_ALLERGENS,
                'label' => __('Allergens', 'viola-commerce'),
                'description' => __('Shown on the product page, e.g. Nuts, Dairy, Gluten.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_ALLERGENS),
            ]
        );

        woocommerce_wp_textarea_input(
            [
                'id' => self::META_CONSUMPTION,
                'label' => __('Consumption', 'viola-commerce'),
                'description' => __('How to serve the product after delivery.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_CONSUMPTION),
            ]
        );

        woocommerce_wp_textarea_input(
            [
                'id' => self::META_STORAGE_INFO,
                'label' => __('Storage info', 'viola-commerce'),
                'description' => __('How long and where to store the product.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_STORAGE_INFO),
            ]
        );

        echo '</div>';
    }

    public function save_fields(int $post_id): void
    {
        $this->save_textarea_meta($post_id, self::META_ALLERGENS);
        $this->save_textarea_meta($post_id, self::META_CONSUMPTION);
        $this->save_textarea_meta($post_id, self::META_STORAGE_INFO);
    }

    public static function get_allergens(int $product_id): string
    {
        return self::read_meta(self::META_ALLERGENS, $product_id);
    }

    public static function get_consumption(int $product_id): string
    {
        return self::read_meta(self::META_CONSUMPTION, $product_id);
    }

    public static function get_storage_info(int $product_id): string
    {
        return self::read_meta(self::META_STORAGE_INFO, $product_id);
    }

    private function get_meta_value(string $key): string
    {
        global $post;

        if (!is_object($post) || !isset($post->ID)) {
            return '';
        }

        return self::read_meta($key, (int) $post->ID);
    }

    private static function read_meta(string $key, int $product_id): string
    {
        $value = get_post_meta($product_id, $key, true);

        return is_string($value) ? trim($value) : '';
    }

    private function save_textarea_meta(int $post_id, string $key): void
    {
        $raw = $_POST[$key] ?? null;

        if (!is_string($raw)) {
            delete_post_meta($post_id, $key);
            return;
        }

        $value = sanitize_textarea_field(wp_unslash($raw));

        if ($value === '') {
            delete_post_meta($post_id, $key);
            return;
        }

        update_post_meta($post_id, $key, $value);
    }
}
