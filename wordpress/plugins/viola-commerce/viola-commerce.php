<?php
/**
 * Plugin Name: Viola Commerce
 * Description: Viola Patisserie custom delivery and order functionality.
 * Version: 0.1.0
 * Author: Viola Patisserie
 * Text Domain: viola-commerce
 */

if (!defined('ABSPATH')) {
    exit;
}

define('VIOLA_COMMERCE_VERSION', '0.1.0');

/**
 * Homepage phase stub — delivery APIs and custom tables will be added in a later phase.
 */
function viola_commerce_init(): void
{
    // Reserved for delivery pincode, slots, and order meta hooks.
}

add_action('init', 'viola_commerce_init');
