<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Homepage_Rest_Api
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/homepage',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_homepage'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function get_homepage(): WP_REST_Response
    {
        return rest_ensure_response(viola_commerce_format_homepage_response());
    }
}
