<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_delivery_defaults(): array
{
    return [
        'serviceable_pincodes' => array_map(
            static fn(int $pincode): string => (string) $pincode,
            range(400001, 400104)
        ),
        'lead_time_days' => 1,
        'cutoff_hour' => 18,
        'time_slots' => [
            ['id' => '10:00-13:00', 'label' => '10:00 AM – 1:00 PM'],
            ['id' => '13:00-16:00', 'label' => '1:00 PM – 4:00 PM'],
            ['id' => '16:00-19:00', 'label' => '4:00 PM – 7:00 PM'],
        ],
        'blackout_dates' => [],
    ];
}

function viola_commerce_get_delivery_settings(): array
{
    $stored = get_option('viola_delivery_settings', []);

    if (!is_array($stored)) {
        $stored = [];
    }

    return array_replace_recursive(viola_commerce_delivery_defaults(), $stored);
}

function viola_commerce_validate_pincode(string $pincode): array
{
    $settings = viola_commerce_get_delivery_settings();
    $normalized = preg_replace('/\D+/', '', $pincode) ?? '';

    if (strlen($normalized) !== 6) {
        return [
            'serviceable' => false,
            'zone' => '',
            'message' => 'Please enter a valid 6-digit pincode.',
        ];
    }

    $serviceable = in_array($normalized, $settings['serviceable_pincodes'], true);

    return [
        'serviceable' => $serviceable,
        'zone' => $serviceable ? 'mumbai' : '',
        'message' => $serviceable
            ? 'Great news! We deliver to your area.'
            : 'Sorry, we do not deliver to this pincode yet.',
    ];
}

function viola_commerce_get_delivery_slots(string $pincode, string $from = ''): array
{
    $validation = viola_commerce_validate_pincode($pincode);

    if (!$validation['serviceable']) {
        return [
            'dates' => [],
            'min_date' => '',
            'max_date' => '',
            'blackout_dates' => [],
            'time_slots' => [],
        ];
    }

    $settings = viola_commerce_get_delivery_settings();
    $timezone = wp_timezone();
    $now = new DateTimeImmutable('now', $timezone);
    $after_cutoff = (int) $now->format('G') >= (int) $settings['cutoff_hour'];
    $offset = (int) $settings['lead_time_days'] + ($after_cutoff ? 1 : 0);
    $first_available = $now->setTime(0, 0)->modify('+' . $offset . ' days');
    $max_date = $first_available->modify('+59 days');
    $requested = $from !== '' ? date_create_immutable($from, $timezone) : false;
    $start = $requested instanceof DateTimeImmutable ? $requested->setTime(0, 0) : $first_available;

    if ($start < $first_available) {
        $start = $first_available;
    }

    $time_slots = [];

    foreach ($settings['time_slots'] as $slot) {
        $time_slots[] = [
            'id' => (string) $slot['id'],
            'label' => (string) $slot['label'],
            'available' => true,
        ];
    }

    $dates = [];
    $cursor = $start;
    $guard = 0;

    while (count($dates) < 7 && $cursor <= $max_date && $guard < 90) {
        $date_key = $cursor->format('Y-m-d');

        if (!in_array($date_key, $settings['blackout_dates'], true)) {
            $dates[] = [
                'date' => $date_key,
                'label' => $cursor->format('j M'),
                'slots' => $time_slots,
            ];
        }

        $cursor = $cursor->modify('+1 day');
        $guard++;
    }

    return [
        'dates' => $dates,
        'min_date' => $first_available->format('Y-m-d'),
        'max_date' => $max_date->format('Y-m-d'),
        'blackout_dates' => $settings['blackout_dates'],
        'time_slots' => $time_slots,
    ];
}
