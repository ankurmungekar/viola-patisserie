<?php

if (!defined('ABSPATH')) {
    exit;
}

use Automattic\WooCommerce\StoreApi\SessionHandler;
use Automattic\WooCommerce\StoreApi\Utilities\CartController;
use Automattic\WooCommerce\StoreApi\Utilities\CartTokenUtils;

class Viola_Commerce_Cart_Rest_Api
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/cart/delivery-schedule',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'update_delivery_schedule'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function update_delivery_schedule(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        if (!function_exists('WC')) {
            return new WP_Error('woocommerce_missing', 'WooCommerce is not available.', ['status' => 500]);
        }

        $body = $request->get_json_params();
        $delivery_date = is_array($body) ? sanitize_text_field((string) ($body['delivery_date'] ?? '')) : '';
        $delivery_slot = is_array($body) ? sanitize_text_field((string) ($body['delivery_slot'] ?? '')) : '';
        $delivery_pincode = is_array($body) ? sanitize_text_field((string) ($body['delivery_pincode'] ?? '')) : '';
        $delivery_zone = is_array($body) ? sanitize_text_field((string) ($body['delivery_zone'] ?? '')) : '';

        if ($delivery_date === '' || $delivery_slot === '') {
            return new WP_Error(
                'invalid_delivery_schedule',
                'Delivery date and time slot are required.',
                ['status' => 400]
            );
        }

        $cart_controller = $this->load_store_cart();

        if (!$cart_controller) {
            return new WP_Error('invalid_cart', 'Unable to load cart session.', ['status' => 400]);
        }

        $cart = WC()->cart;

        if (!$cart || $cart->is_empty()) {
            return new WP_Error('empty_cart', 'Cart is empty.', ['status' => 400]);
        }

        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            $cart->cart_contents[$cart_item_key]['viola_delivery_date'] = $delivery_date;
            $cart->cart_contents[$cart_item_key]['viola_delivery_slot'] = $delivery_slot;

            if ($delivery_pincode !== '') {
                $cart->cart_contents[$cart_item_key]['viola_delivery_pincode'] = $delivery_pincode;
            }

            if ($delivery_zone !== '') {
                $cart->cart_contents[$cart_item_key]['viola_delivery_zone'] = $delivery_zone;
            }
        }

        $cart->set_session();

        return rest_ensure_response([
            'success' => true,
            'delivery_date' => $delivery_date,
            'delivery_slot' => $delivery_slot,
            'delivery_pincode' => $delivery_pincode,
            'delivery_zone' => $delivery_zone,
        ]);
    }

    private function load_store_cart(): ?CartController
    {
        if (!class_exists(CartController::class)) {
            return null;
        }

        if (CartTokenUtils::validate_cart_token(CartTokenUtils::get_request_cart_token())) {
            add_filter(
                'woocommerce_session_handler',
                static function () {
                    return SessionHandler::class;
                }
            );
        }

        $cart_controller = new CartController();

        try {
            $cart_controller->load_cart();
            $cart_controller->normalize_cart();
        } catch (Exception $exception) {
            return null;
        }

        return $cart_controller;
    }
}
