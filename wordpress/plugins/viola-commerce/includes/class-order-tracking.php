<?php

if (!defined('ABSPATH')) {
    exit;
}

class Viola_Commerce_Order_Tracking
{
    public function register(): void
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes(): void
    {
        register_rest_route('viola/v1', '/orders/track', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [$this, 'track_order'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function track_order(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        if ($this->is_rate_limited()) {
            return new WP_Error('too_many_requests', 'Please wait a moment and try again.', ['status' => 429]);
        }

        $body = $request->get_json_params();
        $body = is_array($body) ? $body : [];
        $order_number = $this->clean_order_number((string) ($body['order_number'] ?? ''));
        $email = sanitize_email((string) ($body['email'] ?? ''));

        if ($order_number === '' || !is_email($email)) {
            return new WP_Error('invalid_lookup', 'Enter your order number and email.', ['status' => 400]);
        }

        $order = $this->find_order($order_number);

        if (!$order instanceof WC_Order || strtolower($order->get_billing_email()) !== strtolower($email)) {
            return new WP_Error(
                'order_not_found',
                'We couldn\'t find an order with those details.',
                ['status' => 404]
            );
        }

        return rest_ensure_response($this->present_order($order));
    }

    private function present_order(WC_Order $order): array
    {
        $notes = $this->note_text($order);
        $tracking = $this->extract_tracking($order, $notes);
        $status = $this->customer_status($order, $notes, $tracking);

        $items = [];
        foreach ($order->get_items() as $item) {
            if (!$item instanceof WC_Order_Item_Product) {
                continue;
            }
            $items[] = [
                'name' => $item->get_name(),
                'quantity' => (int) $item->get_quantity(),
                'cakeMessage' => trim((string) $item->get_meta('Cake Message')),
            ];
        }

        $created = $order->get_date_created();

        return [
            'orderNumber' => (string) $order->get_order_number(),
            'status' => $status['id'],
            'statusLabel' => $status['label'],
            'detail' => $status['detail'],
            'placedAt' => $created ? $created->date_i18n('j M Y') : '',
            'delivery' => viola_commerce_get_order_delivery_details($order),
            'items' => $items,
            'total' => html_entity_decode(wp_strip_all_tags($order->get_formatted_order_total()), ENT_QUOTES, 'UTF-8'),
            'tracking' => $tracking,
            'steps' => $this->steps($status['id']),
        ];
    }

    private function customer_status(WC_Order $order, string $notes, ?array $tracking): array
    {
        $wc_status = $order->get_status();

        if (in_array($wc_status, ['cancelled', 'refunded', 'failed'], true)) {
            return [
                'id' => 'cancelled',
                'label' => 'Order cancelled',
                'detail' => 'This order is no longer active. WhatsApp us at +91 70198 42601 if you need help.',
            ];
        }

        if (in_array($wc_status, ['pending', 'checkout-draft'], true) || !$order->is_paid()) {
            return [
                'id' => 'pending',
                'label' => 'Waiting for payment',
                'detail' => 'We have your order, and our kitchen will start on it once payment is confirmed.',
            ];
        }

        if ($wc_status === 'completed' || preg_match('/\bdelivered\b/i', $notes)) {
            return [
                'id' => 'delivered',
                'label' => 'Delivered',
                'detail' => 'Your treats have been delivered. We hope they made the moment sweeter!',
            ];
        }

        if ($tracking !== null || preg_match('/\b(out for delivery|dispatched)\b/i', $notes)) {
            return [
                'id' => 'out_for_delivery',
                'label' => 'Out for delivery',
                'detail' => $tracking && $tracking['url'] !== ''
                    ? 'Your order is on its way. Use the tracking link to follow your delivery partner.'
                    : 'Your order is on its way and will reach you within your delivery slot.',
            ];
        }

        return [
            'id' => 'preparing',
            'label' => 'We\'re baking your order',
            'detail' => 'Payment is confirmed. Our kitchen will prepare your order fresh for your delivery slot.',
        ];
    }

    /**
     * @return array<int, array{id: string, label: string, state: string}>
     */
    private function steps(string $status): array
    {
        $order = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        $labels = [
            'confirmed' => 'Confirmed',
            'preparing' => 'Baking',
            'out_for_delivery' => 'Out for delivery',
            'delivered' => 'Delivered',
        ];

        if ($status === 'cancelled') {
            return [];
        }

        $current = $status === 'pending' ? 'confirmed' : $status;
        $current_index = array_search($current, $order, true);
        if ($current_index === false) {
            $current_index = 1;
        }

        $steps = [];
        foreach ($order as $index => $id) {
            $state = 'upcoming';
            if ($index < $current_index) {
                $state = 'done';
            } elseif ($index === $current_index) {
                $state = 'current';
            }
            $steps[] = [
                'id' => $id,
                'label' => $labels[$id],
                'state' => $state,
            ];
        }

        return $steps;
    }

    private function extract_tracking(WC_Order $order, string $notes): ?array
    {
        $number = '';
        $url = '';

        foreach (['_tracking_number', 'tracking_number', 'awb', '_awb'] as $key) {
            $value = trim((string) $order->get_meta($key));
            if ($value !== '') {
                $number = $value;
                break;
            }
        }

        foreach (['_tracking_url', 'tracking_url'] as $key) {
            $value = trim((string) $order->get_meta($key));
            if ($value !== '' && wp_http_validate_url($value)) {
                $url = $value;
                break;
            }
        }

        $shipments = $order->get_meta('_wc_shipment_tracking_items');
        if (is_array($shipments) && isset($shipments[0]) && is_array($shipments[0])) {
            $number = $number !== '' ? $number : trim((string) ($shipments[0]['tracking_number'] ?? ''));
            $link = trim((string) ($shipments[0]['custom_tracking_link'] ?? $shipments[0]['tracking_link'] ?? ''));
            if ($url === '' && wp_http_validate_url($link)) {
                $url = $link;
            }
        }

        if ($number === '' && preg_match('/(?:tracking(?:\s+(?:number|id|no\.?))?|awb|waybill)\s*[:#-]?\s*([A-Z0-9][A-Z0-9\-]{5,})/i', $notes, $match)) {
            $number = $match[1];
        }

        if ($url === '' && preg_match('#https?://[^\s<]+#i', $notes, $match)) {
            $candidate = rtrim($match[0], '.,)');
            if (preg_match('/track|porter|borzo|dunzo|shadowfax|rapido|uber|delhivery|shiprocket/i', $candidate) && wp_http_validate_url($candidate)) {
                $url = $candidate;
            }
        }

        if ($number === '' && $url === '') {
            return null;
        }

        return [
            'number' => $number,
            'url' => $url,
            'carrier' => $this->carrier_from_url($url),
        ];
    }

    private function carrier_from_url(string $url): string
    {
        $host = strtolower((string) wp_parse_url($url, PHP_URL_HOST));
        $carriers = [
            'porter' => 'Porter',
            'borzo' => 'Borzo',
            'dunzo' => 'Dunzo',
            'shadowfax' => 'Shadowfax',
            'rapido' => 'Rapido',
            'uber' => 'Uber',
            'delhivery' => 'Delhivery',
            'shiprocket' => 'Shiprocket',
        ];

        foreach ($carriers as $needle => $label) {
            if (str_contains($host, $needle)) {
                return $label;
            }
        }

        return '';
    }

    private function note_text(WC_Order $order): string
    {
        if (!function_exists('wc_get_order_notes')) {
            return '';
        }

        $notes = wc_get_order_notes([
            'order_id' => $order->get_id(),
        ]);

        $text = '';
        foreach ($notes as $note) {
            $content = is_object($note) && isset($note->content) ? (string) $note->content : '';
            $text .= ' ' . wp_strip_all_tags($content);
        }

        return $text;
    }

    private function find_order(string $number): ?WC_Order
    {
        if (ctype_digit($number)) {
            $order = wc_get_order((int) $number);
            if ($order instanceof WC_Order) {
                return $order;
            }
        }

        $orders = wc_get_orders([
            'limit' => 1,
            'meta_key' => '_order_number',
            'meta_value' => $number,
            'return' => 'objects',
        ]);

        $order = $orders[0] ?? null;

        return $order instanceof WC_Order ? $order : null;
    }

    private function clean_order_number(string $value): string
    {
        $value = trim($value);
        $value = ltrim($value, '#');

        return preg_replace('/[^A-Za-z0-9\-]/', '', $value) ?? '';
    }

    private function is_rate_limited(): bool
    {
        $key = 'viola_track_' . md5($this->get_client_ip());
        $count = (int) get_transient($key);

        if ($count >= 30) {
            return true;
        }

        set_transient($key, $count + 1, 10 * MINUTE_IN_SECONDS);

        return false;
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
