<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Checkout_Rest_Api
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/checkout/razorpay/create',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'create_razorpay_order'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            'viola/v1',
            '/checkout/razorpay/verify',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'verify_razorpay_payment'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function create_razorpay_order(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $order_id = (int) $request->get_param('order_id');

        if ($order_id <= 0) {
            $body = $request->get_json_params();
            $order_id = is_array($body) ? (int) ($body['order_id'] ?? 0) : 0;
        }

        if ($order_id <= 0) {
            return new WP_Error('invalid_order', 'A valid order ID is required.', ['status' => 400]);
        }

        $order = wc_get_order($order_id);

        if (!$order) {
            return new WP_Error('invalid_order', 'Order not found.', ['status' => 404]);
        }

        $key_id = viola_commerce_get_razorpay_key_id();
        $key_secret = viola_commerce_get_razorpay_key_secret();

        if ($key_id === '' || $key_secret === '') {
            return new WP_Error(
                'razorpay_not_configured',
                'Razorpay credentials are not configured.',
                ['status' => 500]
            );
        }

        $existing_razorpay_order_id = (string) $order->get_meta('_razorpay_order_id');

        if ($existing_razorpay_order_id !== '') {
            return rest_ensure_response([
                'keyId' => $key_id,
                'razorpayOrderId' => $existing_razorpay_order_id,
                'amount' => (int) round(((float) $order->get_total()) * 100),
                'currency' => $order->get_currency(),
            ]);
        }

        $amount = (int) round(((float) $order->get_total()) * 100);
        $currency = $order->get_currency();

        $response = wp_remote_post(
            'https://api.razorpay.com/v1/orders',
            [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode($key_id . ':' . $key_secret),
                    'Content-Type' => 'application/json',
                ],
                'body' => wp_json_encode([
                    'amount' => $amount,
                    'currency' => $currency,
                    'receipt' => 'order_' . $order_id,
                    'notes' => [
                        'woocommerce_order_id' => (string) $order_id,
                    ],
                ]),
                'timeout' => 20,
            ]
        );

        if (is_wp_error($response)) {
            return new WP_Error(
                'razorpay_create_failed',
                $response->get_error_message(),
                ['status' => 500]
            );
        }

        $status_code = (int) wp_remote_retrieve_response_code($response);
        $body = json_decode((string) wp_remote_retrieve_body($response), true);

        if ($status_code >= 400 || !is_array($body) || empty($body['id'])) {
            $message = is_array($body) ? (string) ($body['error']['description'] ?? 'Unable to create Razorpay order.') : 'Unable to create Razorpay order.';

            return new WP_Error('razorpay_create_failed', $message, ['status' => 500]);
        }

        $order->update_meta_data('_razorpay_order_id', (string) $body['id']);
        $order->save();

        return rest_ensure_response([
            'keyId' => $key_id,
            'razorpayOrderId' => (string) $body['id'],
            'amount' => $amount,
            'currency' => $currency,
        ]);
    }

    public function verify_razorpay_payment(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $params = $request->get_json_params();
        $params = is_array($params) ? $params : [];

        $order_id = (int) ($params['order_id'] ?? $request->get_param('order_id'));
        $razorpay_order_id = (string) ($params['razorpay_order_id'] ?? $request->get_param('razorpay_order_id'));
        $razorpay_payment_id = (string) ($params['razorpay_payment_id'] ?? $request->get_param('razorpay_payment_id'));
        $razorpay_signature = (string) ($params['razorpay_signature'] ?? $request->get_param('razorpay_signature'));

        if ($order_id <= 0 || $razorpay_order_id === '' || $razorpay_payment_id === '' || $razorpay_signature === '') {
            return new WP_Error('invalid_payload', 'Missing payment verification data.', ['status' => 400]);
        }

        $key_secret = viola_commerce_get_razorpay_key_secret();

        if ($key_secret === '') {
            return new WP_Error(
                'razorpay_not_configured',
                'Razorpay credentials are not configured.',
                ['status' => 500]
            );
        }

        $generated_signature = hash_hmac(
            'sha256',
            $razorpay_order_id . '|' . $razorpay_payment_id,
            $key_secret
        );

        if (!hash_equals($generated_signature, $razorpay_signature)) {
            return new WP_Error('invalid_signature', 'Invalid payment signature.', ['status' => 400]);
        }

        $order = wc_get_order($order_id);

        if (!$order) {
            return new WP_Error('invalid_order', 'Order not found.', ['status' => 404]);
        }

        if ($order->is_paid()) {
            return rest_ensure_response([
                'success' => true,
                'orderId' => $order_id,
                'status' => $order->get_status(),
            ]);
        }

        $order->payment_complete($razorpay_payment_id);
        $order->update_meta_data('_razorpay_payment_id', $razorpay_payment_id);
        $order->update_meta_data('_razorpay_order_id', $razorpay_order_id);
        $order->add_order_note('Razorpay payment verified via headless checkout.');
        $order->save();

        return rest_ensure_response([
            'success' => true,
            'orderId' => $order_id,
            'status' => $order->get_status(),
        ]);
    }
}
