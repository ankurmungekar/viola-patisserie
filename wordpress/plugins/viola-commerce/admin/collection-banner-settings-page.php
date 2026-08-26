<?php

if (!defined('ABSPATH')) {
    exit;
}

$option_name = 'viola_collection_banner_settings';

function viola_collection_banner_image_field(string $label, string $id_name, int $image_id, string $image_url = ''): void
{
    $preview_url = '';

    if ($image_id > 0) {
        $preview_url = wp_get_attachment_image_url($image_id, 'medium') ?: '';
    } elseif ($image_url !== '') {
        $preview_url = $image_url;
    }

    echo '<tr>';
    echo '<th scope="row"><label for="' . esc_attr($id_name) . '">' . esc_html($label) . '</label></th>';
    echo '<td>';
    echo '<input type="hidden" id="' . esc_attr($id_name) . '" name="' . esc_attr($id_name) . '" value="' . esc_attr((string) $image_id) . '" />';
    echo '<button type="button" class="button viola-media-button" data-target="#' . esc_attr($id_name) . '" data-preview="#' . esc_attr($id_name) . '_preview">Select image</button>';
    if ($preview_url !== '') {
        echo '<br /><img id="' . esc_attr($id_name) . '_preview" src="' . esc_url($preview_url) . '" style="max-width:220px;margin-top:12px;" alt="" />';
    } else {
        echo '<br /><img id="' . esc_attr($id_name) . '_preview" src="" style="max-width:220px;margin-top:12px;display:none;" alt="" />';
    }
    echo '</td>';
    echo '</tr>';
}

?>
<div class="wrap">
  <h1>Viola Collection Banner</h1>
  <p>Update the inline promo banner shown within collection product grids.</p>

  <form method="post" action="options.php">
    <?php settings_fields('viola_collection_banner_settings_group'); ?>

    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="banner_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="banner_eyebrow" name="<?php echo esc_attr($option_name); ?>[eyebrow]" value="<?php echo esc_attr($settings['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="banner_title_prefix">Title prefix</label></th>
        <td><input class="regular-text" id="banner_title_prefix" name="<?php echo esc_attr($option_name); ?>[title_prefix]" value="<?php echo esc_attr($settings['title_prefix']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="banner_title_accent">Title accent</label></th>
        <td><input class="regular-text" id="banner_title_accent" name="<?php echo esc_attr($option_name); ?>[title_accent]" value="<?php echo esc_attr($settings['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="banner_cta_label">Button label</label></th>
        <td><input class="regular-text" id="banner_cta_label" name="<?php echo esc_attr($option_name); ?>[cta_label]" value="<?php echo esc_attr($settings['cta_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="banner_cta_url">Button URL</label></th>
        <td><input class="regular-text" id="banner_cta_url" name="<?php echo esc_attr($option_name); ?>[cta_url]" value="<?php echo esc_attr($settings['cta_url']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="banner_insert_after_row">Insert after row</label></th>
        <td>
          <input class="small-text" type="number" min="1" id="banner_insert_after_row" name="<?php echo esc_attr($option_name); ?>[insert_after_row]" value="<?php echo esc_attr((string) $settings['insert_after_row']); ?>" />
          <p class="description">Number of product rows before the banner appears (4 products per row).</p>
        </td>
      </tr>
      <?php viola_collection_banner_image_field('Banner image', $option_name . '[image_id]', (int) $settings['image_id']); ?>
    </table>

    <?php submit_button(); ?>
  </form>
</div>
