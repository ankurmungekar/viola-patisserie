<?php
/**
 * Plugin Name: Viola Commerce
 * Description: Viola Patisserie custom delivery and order functionality.
 * Version: 0.3.0
 * Author: Viola Patisserie
 * Text Domain: viola-commerce
 */

if (!defined('ABSPATH')) {
    exit;
}

define('VIOLA_COMMERCE_VERSION', '0.3.0');
define('VIOLA_COMMERCE_PLUGIN_FILE', __FILE__);
define('VIOLA_COMMERCE_PLUGIN_DIR', plugin_dir_path(__FILE__));

require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/homepage-defaults.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/class-homepage-rest-api.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/class-homepage-settings.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/collection-banner-defaults.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/class-collection-banner-rest-api.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/class-collection-banner-settings.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/delivery-defaults.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/class-delivery-rest-api.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/class-delivery-settings.php';
require_once VIOLA_COMMERCE_PLUGIN_DIR . 'includes/cart-extensions.php';

function viola_commerce_init(): void
{
    $homepage_api = new Viola_Commerce_Homepage_Rest_Api();
    $homepage_api->register();

    $collection_banner_api = new Viola_Commerce_Collection_Banner_Rest_Api();
    $collection_banner_api->register();

    $delivery_api = new Viola_Commerce_Delivery_Rest_Api();
    $delivery_api->register();

    viola_commerce_register_cart_hooks();

    if (is_admin()) {
        $homepage_settings = new Viola_Commerce_Homepage_Settings();
        $homepage_settings->register();

        $collection_banner_settings = new Viola_Commerce_Collection_Banner_Settings();
        $collection_banner_settings->register();

        $delivery_settings = new Viola_Commerce_Delivery_Settings();
        $delivery_settings->register();
    }
}

add_action('init', 'viola_commerce_init');
