<?php

if (!defined('ABSPATH')) {
    exit;
}

function viola_commerce_get_site_url(): string
{
    $site = 'https://violapatisserie.in';

    if (defined('VIOLA_SITE_URL')) {
        $configured = rtrim((string) VIOLA_SITE_URL, '/');
        if ($configured !== '' && !str_contains($configured, 'localhost')) {
            $site = $configured;
        }
    }

    return $site;
}

function viola_commerce_get_order_tracking_url(WC_Order $order): string
{
    return viola_commerce_get_site_url() . '/track-order?order=' . rawurlencode((string) $order->get_order_number());
}

class Viola_Commerce_Order_Email
{
    private const BRAND_NAME = 'Viola Patisserie';
    private const WHATSAPP_DISPLAY = '+91 70198 42601';
    private const WHATSAPP_URL = 'https://wa.me/917019842601';
    private const INSTAGRAM_HANDLE = '@_violapatisserie_';
    private const INSTAGRAM_URL = 'https://instagram.com/_violapatisserie_';
    private const ADDRESS = 'Malad East, Mumbai, Maharashtra';

    public function register(): void
    {
        add_action('woocommerce_payment_complete', [$this, 'send_confirmation'], 20);
        add_filter('woocommerce_email_enabled_customer_processing_order', '__return_false');
    }

    public function send_confirmation($order_id): void
    {
        $order = wc_get_order($order_id);

        if (!$order instanceof WC_Order) {
            return;
        }

        if ($order->get_meta('_viola_confirmation_sent') === 'yes') {
            return;
        }

        $to = $order->get_billing_email();

        if (!is_email($to)) {
            return;
        }

        $order->update_meta_data('_viola_confirmation_sent', 'yes');
        $order->save();

        $from = $this->from_address();
        $subject = sprintf('Your %s order #%s is confirmed', self::BRAND_NAME, $order->get_order_number());
        $headers = ['Content-Type: text/html; charset=UTF-8'];

        if ($from !== '') {
            $headers[] = 'From: ' . self::BRAND_NAME . ' <' . $from . '>';
            $headers[] = 'Reply-To: ' . self::BRAND_NAME . ' <' . $from . '>';
        }

        $sent = wp_mail($to, $subject, $this->render($order), $headers);

        if (!$sent) {
            $order->delete_meta_data('_viola_confirmation_sent');
            $order->add_order_note('Viola Patisserie confirmation email could not be sent.');
            $order->save();
            return;
        }

        $order->add_order_note('Viola Patisserie order confirmation email sent to ' . $to . '.');
        $order->save();
    }

    private function from_address(): string
    {
        foreach (['VIOLA_ORDER_EMAIL_FROM', 'VIOLA_CONTACT_EMAIL'] as $constant) {
            if (defined($constant) && is_string(constant($constant)) && is_email(constant($constant))) {
                return (string) constant($constant);
            }
        }

        $admin_email = (string) get_option('admin_email');

        return is_email($admin_email) ? $admin_email : '';
    }

    private function render(WC_Order $order): string
    {
        $name = trim($order->get_billing_first_name());
        if ($name === '') {
            $name = 'there';
        }

        $rows = '';
        foreach ($order->get_items() as $item) {
            if (!$item instanceof WC_Order_Item_Product) {
                continue;
            }

            $cake_message = trim((string) $item->get_meta('Cake Message'));
            $message_line = $cake_message !== ''
                ? '<br><span style="font-size:13px;color:#7a6880;">Message: “' . esc_html($cake_message) . '”</span>'
                : '';

            $rows .= sprintf(
                '<tr>
                    <td style="padding:12px 0;border-bottom:1px solid #f0e4dd;font-size:14px;line-height:1.5;color:#240630;">%s <span style="color:#7a6880;">× %d</span>%s</td>
                    <td style="padding:12px 0;border-bottom:1px solid #f0e4dd;font-size:14px;color:#240630;text-align:right;white-space:nowrap;vertical-align:top;">%s</td>
                </tr>',
                esc_html($item->get_name()),
                (int) $item->get_quantity(),
                $message_line,
                wp_kses_post($order->get_formatted_line_subtotal($item))
            );
        }

        $order_number = esc_html($order->get_order_number());
        $total = wp_kses_post($order->get_formatted_order_total());
        $track_url = esc_url(viola_commerce_get_order_tracking_url($order));
        $site_url = viola_commerce_get_site_url();
        $site_host = esc_html((string) wp_parse_url($site_url, PHP_URL_HOST));
        $delivery = viola_commerce_get_order_delivery_details($order);

        $delivery_block = '';
        if ($delivery !== null) {
            $delivery_when = trim($delivery['date'] . ($delivery['slot'] !== '' ? ' · ' . $delivery['slot'] : ''), ' ·');
            $delivery_block = '<tr>
                  <td style="padding:0 20px 16px;">
                    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8d0ca2;">Delivery</p>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#240630;">' . esc_html($delivery_when) . '</p>
                  </td>
                </tr>';
        }

        $intro = $delivery !== null && $delivery['date'] !== ''
            ? 'Thank you for choosing ' . self::BRAND_NAME . '. Our kitchen will handcraft your treats fresh for delivery on ' . esc_html($delivery['date']) . ', and we\'ll keep you posted when they\'re on their way.'
            : 'Thank you for choosing ' . self::BRAND_NAME . '. Our kitchen will handcraft your treats fresh, and we\'ll keep you posted when they\'re on their way.';

        return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your order is confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f4f0f2;font-family:\'Source Sans 3\',Helvetica,Arial,sans-serif;color:#240630;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0f2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #f0e4dd;">
          <tr>
            <td style="background:#6a1f87;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif;font-size:26px;letter-spacing:0.06em;color:#ffffff;font-weight:600;">' . self::BRAND_NAME . '</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;">
              <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#240630;">Dear ' . esc_html($name) . ',</p>
              <h1 style="margin:0 0 16px;font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif;font-size:32px;line-height:1.2;font-weight:600;color:#240630;">Sweet news! Your order is confirmed.</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a3a52;">' . $intro . '</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#4a3a52;">Follow us on <a href="' . esc_url(self::INSTAGRAM_URL) . '" style="color:#6a1f87;font-weight:600;text-decoration:none;">' . esc_html(self::INSTAGRAM_HANDLE) . '</a> for new bakes, seasonal specials, and a peek behind the scenes.</p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#4a3a52;">We can\'t wait for you to celebrate with every bite!</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf7f5;border:1px solid #f0e4dd;">
                <tr>
                  <td style="padding:20px 20px 8px;">
                    <p style="margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8d0ca2;">Order #' . $order_number . '</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 20px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $rows . '</table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 20px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:15px;font-weight:600;color:#240630;">Total</td>
                        <td style="font-size:15px;font-weight:600;color:#240630;text-align:right;">' . $total . '</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ' . $delivery_block . '
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;text-align:center;">
              <a href="' . $track_url . '" style="display:inline-block;background:#6a1f87;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.04em;padding:14px 32px;">Track your order</a>
              <p style="margin:12px 0 0;font-size:12px;line-height:1.6;color:#7a6880;">Use order #' . $order_number . ' and this email address.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 36px;">
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4a3a52;">Questions about your order? WhatsApp us at <a href="' . esc_url(self::WHATSAPP_URL) . '" style="color:#6a1f87;font-weight:600;text-decoration:none;">' . esc_html(self::WHATSAPP_DISPLAY) . '</a>.</p>
              <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:#240630;">With love,</p>
              <p style="margin:0;font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif;font-size:20px;font-weight:600;color:#6a1f87;">Team ' . self::BRAND_NAME . '</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px 24px;border-top:1px solid #f0e4dd;background:#f2e7e1;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#7a6880;">' . self::BRAND_NAME . ' · ' . esc_html(self::ADDRESS) . '<br><a href="' . esc_url($site_url) . '" style="color:#7a6880;text-decoration:none;">' . $site_host . '</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
    }
}
