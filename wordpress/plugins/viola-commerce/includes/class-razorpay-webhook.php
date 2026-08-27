<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Razorpay_Webhook
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/webhooks/razorpay',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'handle_webhook'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function handle_webhook(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $webhook_secret = viola_commerce_get_razorpay_webhook_secret();
        $payload = (string) $request->get_body();

        if ($webhook_secret !== '') {
            $signature = (string) $request->get_header('x-razorpay-signature');
            $expected = hash_hmac('sha256', $payload, $webhook_secret);

            if ($signature === '' || !hash_equals($expected, $signature)) {
                return new WP_Error('invalid_webhook', 'Invalid webhook signature.', ['status' => 400]);
            }
        }

        $event = json_decode($payload, true);

        if (!is_array($event) || ($event['event'] ?? '') !== 'payment.captured') {
            return rest_ensure_response(['received' => true]);
        }

        $payment = is_array($event['payload']['payment']['entity'] ?? null)
            ? $event['payload']['payment']['entity']
            : null;

        if ($payment === null) {
            return rest_ensure_response(['received' => true]);
        }

        $razorpay_order_id = (string) ($payment['order_id'] ?? '');
        $razorpay_payment_id = (string) ($payment['id'] ?? '');

        if ($razorpay_order_id === '' || $razorpay_payment_id === '') {
            return rest_ensure_response(['received' => true]);
        }

        $orders = wc_get_orders([
            'limit' => 1,
            'meta_key' => '_razorpay_order_id',
            'meta_value' => $razorpay_order_id,
        ]);

        $order = $orders[0] ?? null;

        if (!$order instanceof WC_Order || $order->is_paid()) {
            return rest_ensure_response(['received' => true]);
        }

        $order->payment_complete($razorpay_payment_id);
        $order->update_meta_data('_razorpay_payment_id', $razorpay_payment_id);
        $order->add_order_note('Razorpay payment captured via webhook.');
        $order->save();

        return rest_ensure_response(['received' => true]);
    }
}
