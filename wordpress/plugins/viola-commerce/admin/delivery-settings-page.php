<?php

if (!defined('ABSPATH')) {
    exit;
}

$option_name = 'viola_delivery_settings';
$pincodes_text = implode(', ', $settings['serviceable_pincodes']);
$blackout_dates_text = implode(', ', $settings['blackout_dates']);

?>
<div class="wrap">
  <h1>Viola Delivery Settings</h1>
  <p>Configure Mumbai pincode serviceability and delivery slot rules.</p>

  <form method="post" action="options.php">
    <?php settings_fields('viola_delivery_settings_group'); ?>

    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="serviceable_pincodes_text">Serviceable pincodes</label></th>
        <td>
          <textarea class="large-text" rows="6" id="serviceable_pincodes_text" name="<?php echo esc_attr($option_name); ?>[serviceable_pincodes_text]"><?php echo esc_textarea($pincodes_text); ?></textarea>
          <p class="description">Comma or space separated 6-digit pincodes.</p>
        </td>
      </tr>
      <tr>
        <th scope="row"><label for="lead_time_days">Lead time (days)</label></th>
        <td>
          <input class="small-text" type="number" min="0" id="lead_time_days" name="<?php echo esc_attr($option_name); ?>[lead_time_days]" value="<?php echo esc_attr((string) $settings['lead_time_days']); ?>" />
        </td>
      </tr>
      <tr>
        <th scope="row"><label for="cutoff_hour">Cut-off hour (24h)</label></th>
        <td>
          <input class="small-text" type="number" min="0" max="23" id="cutoff_hour" name="<?php echo esc_attr($option_name); ?>[cutoff_hour]" value="<?php echo esc_attr((string) $settings['cutoff_hour']); ?>" />
          <p class="description">Orders after this hour add an extra lead day.</p>
        </td>
      </tr>
      <tr>
        <th scope="row"><label for="blackout_dates_text">Blackout dates</label></th>
        <td>
          <textarea class="large-text" rows="3" id="blackout_dates_text" name="<?php echo esc_attr($option_name); ?>[blackout_dates_text]"><?php echo esc_textarea($blackout_dates_text); ?></textarea>
          <p class="description">YYYY-MM-DD values, comma separated.</p>
        </td>
      </tr>
    </table>

    <?php submit_button('Save delivery settings'); ?>
  </form>
</div>
