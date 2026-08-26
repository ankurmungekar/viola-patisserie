<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Delivery_Rest_Api
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/delivery/validate-pincode',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'validate_pincode'],
                'permission_callback' => '__return_true',
            ]
        );

        register_rest_route(
            'viola/v1',
            '/delivery/slots',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_slots'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function validate_pincode(WP_REST_Request $request): WP_REST_Response
    {
        $pincode = (string) $request->get_param('pincode');

        if ($pincode === '') {
            $body = $request->get_json_params();
            $pincode = is_array($body) ? (string) ($body['pincode'] ?? '') : '';
        }

        return rest_ensure_response(viola_commerce_validate_pincode($pincode));
    }

    public function get_slots(WP_REST_Request $request): WP_REST_Response
    {
        $pincode = (string) $request->get_param('pincode');
        $from = (string) $request->get_param('from');

        return rest_ensure_response(viola_commerce_get_delivery_slots($pincode, $from));
    }
}
