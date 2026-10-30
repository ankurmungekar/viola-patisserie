<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Product_Meta
{
    private const META_ALLERGENS = '_viola_allergens';
    private const META_CONSUMPTION = '_viola_consumption';
    private const META_STORAGE_INFO = '_viola_storage_info';
    private const META_COLOR_OPTIONS = '_viola_color_options';
    private const META_FLAVOR_OPTIONS = '_viola_flavor_options';

    public const FIELD_ALLERGENS = 'viola_allergens';
    public const FIELD_CONSUMPTION = 'viola_consumption';
    public const FIELD_STORAGE_INFO = 'viola_storage_info';
    public const FIELD_COLOR_OPTIONS = 'viola_color_options';
    public const FIELD_FLAVOR_OPTIONS = 'viola_flavor_options';

    public function register(): void
    {
        add_action('woocommerce_product_options_general_product_data', [$this, 'render_fields']);
        add_action('woocommerce_admin_process_product_object', [$this, 'save_product_object']);
    }

    public function render_fields(): void
    {
        echo '<div class="options_group viola-commerce-product-meta">';

        woocommerce_wp_textarea_input(
            [
                'id' => self::FIELD_ALLERGENS,
                'label' => __('Allergens', 'viola-commerce'),
                'description' => __('Shown on the product page, e.g. Nuts, Dairy, Gluten.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_ALLERGENS),
            ]
        );

        woocommerce_wp_textarea_input(
            [
                'id' => self::FIELD_CONSUMPTION,
                'label' => __('Consumption', 'viola-commerce'),
                'description' => __('How to serve the product after delivery.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_CONSUMPTION),
            ]
        );

        woocommerce_wp_textarea_input(
            [
                'id' => self::FIELD_STORAGE_INFO,
                'label' => __('Storage info', 'viola-commerce'),
                'description' => __('How long and where to store the product.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_STORAGE_INFO),
            ]
        );

        woocommerce_wp_textarea_input(
            [
                'id' => self::FIELD_COLOR_OPTIONS,
                'label' => __('Color options', 'viola-commerce'),
                'description' => __('One color per line. Shown as a dropdown on the product page when set.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_COLOR_OPTIONS),
            ]
        );

        woocommerce_wp_textarea_input(
            [
                'id' => self::FIELD_FLAVOR_OPTIONS,
                'label' => __('Flavor options', 'viola-commerce'),
                'description' => __('One flavor per line. Shown as a dropdown on the product page when set.', 'viola-commerce'),
                'desc_tip' => true,
                'value' => $this->get_meta_value(self::META_FLAVOR_OPTIONS),
            ]
        );

        echo '</div>';
    }

    public function save_product_object($product): void
    {
        if (!is_object($product) || !method_exists($product, 'get_id')) {
            return;
        }

        $this->persist_field($product, self::FIELD_ALLERGENS, self::META_ALLERGENS);
        $this->persist_field($product, self::FIELD_CONSUMPTION, self::META_CONSUMPTION);
        $this->persist_field($product, self::FIELD_STORAGE_INFO, self::META_STORAGE_INFO);
        $this->persist_field($product, self::FIELD_COLOR_OPTIONS, self::META_COLOR_OPTIONS);
        $this->persist_field($product, self::FIELD_FLAVOR_OPTIONS, self::META_FLAVOR_OPTIONS);
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

    public static function get_color_options(int $product_id): array
    {
        return self::parse_option_list(self::read_meta(self::META_COLOR_OPTIONS, $product_id));
    }

    public static function get_flavor_options(int $product_id): array
    {
        return self::parse_option_list(self::read_meta(self::META_FLAVOR_OPTIONS, $product_id));
    }

    public static function parse_option_list(string $raw): array
    {
        if ($raw === '') {
            return [];
        }

        $parts = preg_split('/[\r\n,]+/', $raw) ?: [];
        $options = [];

        foreach ($parts as $part) {
            $value = sanitize_text_field(trim((string) $part));

            if ($value !== '') {
                $options[] = $value;
            }
        }

        return array_values(array_unique($options));
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

    private function persist_field($product, string $field, string $meta_key): void
    {
        if (!method_exists($product, 'update_meta_data')) {
            return;
        }

        if (!isset($_POST[$field]) || !is_string($_POST[$field])) {
            $product->delete_meta_data($meta_key);
            return;
        }

        $value = sanitize_textarea_field(wp_unslash($_POST[$field]));

        if ($value === '') {
            $product->delete_meta_data($meta_key);
            return;
        }

        $product->update_meta_data($meta_key, $value);
    }
}
