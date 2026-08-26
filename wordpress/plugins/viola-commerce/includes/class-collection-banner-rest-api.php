<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Collection_Banner_Rest_Api
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/collection-banner',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_collection_banner'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function get_collection_banner(): WP_REST_Response
    {
        return rest_ensure_response(viola_commerce_format_collection_banner_response());
    }
}
