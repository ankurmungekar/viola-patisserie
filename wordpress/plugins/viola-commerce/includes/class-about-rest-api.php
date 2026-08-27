<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_About_Rest_Api
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/about',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_about'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function get_about(): WP_REST_Response
    {
        return rest_ensure_response(viola_commerce_format_about_response());
    }
}
