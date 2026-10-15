<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Contact_Rest_Api
{
    public function register(): void
    {
        $this->register_enquiry_post_type();
        add_action('rest_api_init', [$this, 'register_routes']);
        add_action('add_meta_boxes_viola_enquiry', [$this, 'register_meta_box']);
        add_filter('manage_viola_enquiry_posts_columns', [$this, 'enquiry_columns']);
        add_action('manage_viola_enquiry_posts_custom_column', [$this, 'render_enquiry_column'], 10, 2);
    }

    public function register_enquiry_post_type(): void
    {
        register_post_type(
            'viola_enquiry',
            [
                'labels' => [
                    'name' => 'Contact enquiries',
                    'singular_name' => 'Contact enquiry',
                    'add_new_item' => 'Add enquiry',
                    'edit_item' => 'View enquiry',
                    'search_items' => 'Search enquiries',
                    'not_found' => 'No enquiries found.',
                ],
                'public' => false,
                'show_ui' => true,
                'show_in_menu' => true,
                'menu_icon' => 'dashicons-email-alt',
                'supports' => ['title', 'editor'],
                'capability_type' => 'post',
            ]
        );
    }

    public function register_meta_box(): void
    {
        add_meta_box(
            'viola_enquiry_contact',
            'Contact details',
            [$this, 'render_meta_box'],
            'viola_enquiry',
            'side',
            'high'
        );
    }

    public function render_meta_box(WP_Post $post): void
    {
        $email = (string) get_post_meta($post->ID, '_viola_contact_email', true);
        $phone = (string) get_post_meta($post->ID, '_viola_contact_phone', true);

        echo '<p><strong>Email</strong><br />';
        if ($email !== '' && is_email($email)) {
            echo '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>';
        } else {
            echo esc_html($email !== '' ? $email : 'Not provided');
        }
        echo '</p>';

        echo '<p><strong>Phone</strong><br />';
        echo esc_html($phone !== '' ? $phone : 'Not provided');
        echo '</p>';
    }

    /**
     * @param array<string, string> $columns
     * @return array<string, string>
     */
    public function enquiry_columns(array $columns): array
    {
        $updated = [];

        foreach ($columns as $key => $label) {
            $updated[$key] = $label;

            if ($key === 'title') {
                $updated['viola_contact_email'] = 'Email';
                $updated['viola_contact_phone'] = 'Phone';
            }
        }

        return $updated;
    }

    public function render_enquiry_column(string $column, int $post_id): void
    {
        if ($column === 'viola_contact_email') {
            $email = (string) get_post_meta($post_id, '_viola_contact_email', true);
            if ($email !== '' && is_email($email)) {
                echo '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>';
                return;
            }

            echo esc_html($email !== '' ? $email : '—');
            return;
        }

        if ($column === 'viola_contact_phone') {
            $phone = (string) get_post_meta($post_id, '_viola_contact_phone', true);
            echo esc_html($phone !== '' ? $phone : '—');
        }
    }

    public function register_routes(): void
    {
        register_rest_route(
            'viola/v1',
            '/contact',
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'submit_enquiry'],
                'permission_callback' => '__return_true',
            ]
        );
    }

    public function submit_enquiry(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $body = $request->get_json_params();
        $body = is_array($body) ? $body : [];

        if (trim((string) ($body['website'] ?? '')) !== '') {
            return rest_ensure_response(['ok' => true]);
        }

        $ip = $this->get_client_ip();
        $rate_key = 'viola_contact_' . md5($ip);

        if ((int) get_transient($rate_key) >= 5) {
            return new WP_Error(
                'too_many_requests',
                'Please wait a little before sending another message.',
                ['status' => 429]
            );
        }

        $name = sanitize_text_field((string) ($body['name'] ?? ''));
        $email = sanitize_email((string) ($body['email'] ?? ''));
        $phone = sanitize_text_field((string) ($body['phone'] ?? ''));
        $message = sanitize_textarea_field((string) ($body['message'] ?? ''));

        if ($name === '' || $email === '' || !is_email($email) || $message === '') {
            return new WP_Error(
                'invalid_payload',
                'Please enter your name, a valid email, and a message.',
                ['status' => 400]
            );
        }

        $enquiry_id = wp_insert_post(
            [
                'post_type' => 'viola_enquiry',
                'post_status' => 'private',
                'post_title' => $name,
                'post_content' => $message,
                'meta_input' => [
                    '_viola_contact_email' => $email,
                    '_viola_contact_phone' => $phone,
                ],
            ],
            true
        );

        if (is_wp_error($enquiry_id)) {
            return new WP_Error(
                'save_failed',
                'Unable to save your message. Please try again.',
                ['status' => 500]
            );
        }

        $this->send_notification($name, $email, $phone, $message);
        set_transient($rate_key, (int) get_transient($rate_key) + 1, HOUR_IN_SECONDS);

        return rest_ensure_response(['ok' => true]);
    }

    private function send_notification(string $name, string $email, string $phone, string $message): void
    {
        $to = defined('VIOLA_CONTACT_EMAIL') && is_string(VIOLA_CONTACT_EMAIL) && VIOLA_CONTACT_EMAIL !== ''
            ? VIOLA_CONTACT_EMAIL
            : (string) get_option('admin_email');

        if ($to === '' || !is_email($to)) {
            return;
        }

        $phone_line = $phone !== '' ? $phone : 'Not provided';
        $body = "New enquiry from the Viola Patisserie website.\n\n"
            . "Name: {$name}\n"
            . "Email: {$email}\n"
            . "Phone: {$phone_line}\n\n"
            . "Message:\n{$message}\n";

        wp_mail(
            $to,
            'New contact enquiry from ' . $name,
            $body,
            [
                'Content-Type: text/plain; charset=UTF-8',
                'Reply-To: ' . $name . ' <' . $email . '>',
            ]
        );
    }

    private function get_client_ip(): string
    {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']) && is_string($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $parts = explode(',', wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR']));
            return sanitize_text_field(trim($parts[0]));
        }

        if (!empty($_SERVER['REMOTE_ADDR']) && is_string($_SERVER['REMOTE_ADDR'])) {
            return sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR']));
        }

        return 'unknown';
    }
}
