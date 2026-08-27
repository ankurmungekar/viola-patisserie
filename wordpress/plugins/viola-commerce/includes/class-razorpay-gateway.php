<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_get_razorpay_key_id(): string
{
    if (defined('RAZORPAY_KEY_ID')) {
        return (string) RAZORPAY_KEY_ID;
    }

    return (string) get_option('viola_razorpay_key_id', '');
}

function viola_commerce_get_razorpay_key_secret(): string
{
    if (defined('RAZORPAY_KEY_SECRET')) {
        return (string) RAZORPAY_KEY_SECRET;
    }

    return (string) get_option('viola_razorpay_key_secret', '');
}

function viola_commerce_get_razorpay_webhook_secret(): string
{
    if (defined('RAZORPAY_WEBHOOK_SECRET')) {
        return (string) RAZORPAY_WEBHOOK_SECRET;
    }

    return (string) get_option('viola_razorpay_webhook_secret', '');
}

function viola_commerce_register_razorpay_gateway(array $gateways): array
{
    $gateways[] = 'Viola_Commerce_Razorpay_Gateway';
    return $gateways;
}

function viola_commerce_register_razorpay_gateway_class(): void
{
    if (!class_exists('WC_Payment_Gateway')) {
        return;
    }

    if (class_exists('Viola_Commerce_Razorpay_Gateway', false)) {
        add_filter('woocommerce_payment_gateways', 'viola_commerce_register_razorpay_gateway');
        return;
    }

    class Viola_Commerce_Razorpay_Gateway extends WC_Payment_Gateway
    {
        public function __construct()
        {
            $this->id = 'razorpay';
            $this->method_title = 'Razorpay';
            $this->method_description = 'Accept payments via Razorpay for the headless storefront.';
            $this->has_fields = false;
            $this->supports = ['products'];

            $this->init_form_fields();
            $this->init_settings();

            $this->title = $this->get_option('title', 'Razorpay');
            $this->description = $this->get_option('description', 'Pay securely with Razorpay.');
            $this->enabled = $this->get_option('enabled', 'yes');

            add_action(
                'woocommerce_update_options_payment_gateways_' . $this->id,
                [$this, 'process_admin_options']
            );
        }

        public function init_form_fields(): void
        {
            $this->form_fields = [
                'enabled' => [
                    'title' => 'Enable/Disable',
                    'type' => 'checkbox',
                    'label' => 'Enable Razorpay',
                    'default' => 'yes',
                ],
                'title' => [
                    'title' => 'Title',
                    'type' => 'text',
                    'default' => 'Razorpay',
                ],
                'description' => [
                    'title' => 'Description',
                    'type' => 'textarea',
                    'default' => 'Pay securely with Razorpay.',
                ],
            ];
        }

        public function process_payment($order_id)
        {
            $order = wc_get_order($order_id);

            if (!$order) {
                return [
                    'result' => 'failure',
                ];
            }

            $order->update_status('pending', 'Awaiting Razorpay payment.');

            return [
                'result' => 'success',
                'redirect' => '',
            ];
        }
    }

    add_filter('woocommerce_payment_gateways', 'viola_commerce_register_razorpay_gateway');
}

add_action('plugins_loaded', 'viola_commerce_register_razorpay_gateway_class', 20);
