<?php

if (!defined('ABSPATH')) {
    exit;
}

$option_name = 'viola_custom_cakes_settings';
$occasions = [
    'all' => 'All Custom Cakes',
    'wedding' => 'Wedding',
    'birthday' => 'Birthday',
    'anniversary' => 'Anniversary',
];

function viola_custom_cakes_image_field(string $label, string $id, string $name, int $image_id): void
{
    $preview_url = $image_id > 0 ? (wp_get_attachment_image_url($image_id, 'medium') ?: '') : '';

    echo '<tr>';
    echo '<th scope="row"><label for="' . esc_attr($id) . '">' . esc_html($label) . '</label></th>';
    echo '<td>';
    echo '<input type="hidden" id="' . esc_attr($id) . '" name="' . esc_attr($name) . '" value="' . esc_attr((string) $image_id) . '" />';
    echo '<button type="button" class="button viola-media-button" data-target="#' . esc_attr($id) . '" data-preview="#' . esc_attr($id) . '-preview">Select image</button>';
    echo '<br /><img id="' . esc_attr($id) . '-preview" src="' . esc_url($preview_url) . '" alt="" style="max-width:220px;margin-top:12px;' . ($preview_url === '' ? 'display:none;' : '') . '" />';
    echo '</td>';
    echo '</tr>';
}

function viola_custom_cakes_gallery_preview(int $image_id): string
{
    if ($image_id <= 0) {
        return '';
    }

    return wp_get_attachment_image_url($image_id, 'medium') ?: '';
}

?>
<div class="wrap">
  <h1>Viola Custom Cakes</h1>
  <p>Update Custom Cakes page text and gallery images. Layout and styling are controlled by the storefront.</p>

  <form method="post" action="options.php">
    <?php settings_fields('viola_custom_cakes_settings_group'); ?>

    <h2>Banner</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="cc_banner_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="cc_banner_eyebrow" name="<?php echo esc_attr($option_name); ?>[banner][eyebrow]" value="<?php echo esc_attr($settings['banner']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_banner_title_lead">Title (dark)</label></th>
        <td><input class="regular-text" id="cc_banner_title_lead" name="<?php echo esc_attr($option_name); ?>[banner][title_lead]" value="<?php echo esc_attr($settings['banner']['title_lead']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_banner_title_accent">Title (accent)</label></th>
        <td><input class="regular-text" id="cc_banner_title_accent" name="<?php echo esc_attr($option_name); ?>[banner][title_accent]" value="<?php echo esc_attr($settings['banner']['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_banner_description">Description</label></th>
        <td><textarea class="large-text" rows="3" id="cc_banner_description" name="<?php echo esc_attr($option_name); ?>[banner][description]"><?php echo esc_textarea($settings['banner']['description']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_banner_cta_label">Button label</label></th>
        <td><input class="regular-text" id="cc_banner_cta_label" name="<?php echo esc_attr($option_name); ?>[banner][cta_label]" value="<?php echo esc_attr($settings['banner']['cta_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_banner_cta_url">Button URL</label></th>
        <td><input class="regular-text" id="cc_banner_cta_url" name="<?php echo esc_attr($option_name); ?>[banner][cta_url]" value="<?php echo esc_attr($settings['banner']['cta_url']); ?>" /></td>
      </tr>
      <?php viola_custom_cakes_image_field('Banner image', 'cc_banner_image', $option_name . '[banner][image_id]', (int) $settings['banner']['image_id']); ?>
    </table>

    <h2>Highlights</h2>
    <p class="description">Icons stay the same. You can change the titles and descriptions.</p>
    <table class="form-table" role="presentation">
      <?php foreach ($settings['highlights'] as $index => $highlight) : ?>
        <tr>
          <th scope="row"><?php echo esc_html(ucfirst((string) $highlight['icon'])); ?> title</th>
          <td><input class="regular-text" name="<?php echo esc_attr($option_name); ?>[highlights][<?php echo esc_attr((string) $index); ?>][title]" value="<?php echo esc_attr($highlight['title']); ?>" /></td>
        </tr>
        <tr>
          <th scope="row">Description</th>
          <td><input class="large-text" name="<?php echo esc_attr($option_name); ?>[highlights][<?php echo esc_attr((string) $index); ?>][description]" value="<?php echo esc_attr($highlight['description']); ?>" /></td>
        </tr>
      <?php endforeach; ?>
    </table>

    <h2>Gallery</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="cc_gallery_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="cc_gallery_eyebrow" name="<?php echo esc_attr($option_name); ?>[gallery][eyebrow]" value="<?php echo esc_attr($settings['gallery']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_gallery_title">Title (dark)</label></th>
        <td><input class="regular-text" id="cc_gallery_title" name="<?php echo esc_attr($option_name); ?>[gallery][title]" value="<?php echo esc_attr($settings['gallery']['title']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_gallery_title_accent">Title (accent)</label></th>
        <td><input class="regular-text" id="cc_gallery_title_accent" name="<?php echo esc_attr($option_name); ?>[gallery][title_accent]" value="<?php echo esc_attr($settings['gallery']['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_gallery_view_more">View more label</label></th>
        <td><input class="regular-text" id="cc_gallery_view_more" name="<?php echo esc_attr($option_name); ?>[gallery][view_more_label]" value="<?php echo esc_attr($settings['gallery']['view_more_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cc_gallery_empty">Empty message</label></th>
        <td><input class="regular-text" id="cc_gallery_empty" name="<?php echo esc_attr($option_name); ?>[gallery][empty_message]" value="<?php echo esc_attr($settings['gallery']['empty_message']); ?>" /></td>
      </tr>
    </table>

    <p>
      <button type="button" class="button button-secondary" id="viola-add-gallery-images">Add images</button>
    </p>

    <div id="viola-custom-cakes-gallery">
      <?php foreach ($settings['gallery']['items'] as $index => $item) :
          $image_id = (int) $item['image_id'];
          $preview_url = viola_custom_cakes_gallery_preview($image_id);
          $field_id = 'cc_gallery_item_' . $index;
          ?>
        <div class="viola-gallery-row" style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;padding:12px;border:1px solid #dcdcde;background:#fff;max-width:720px;">
          <div>
            <input type="hidden" id="<?php echo esc_attr($field_id); ?>" class="viola-gallery-image-id" name="<?php echo esc_attr($option_name); ?>[gallery][items][<?php echo esc_attr((string) $index); ?>][image_id]" value="<?php echo esc_attr((string) $image_id); ?>" />
            <button type="button" class="button viola-media-button" data-target="#<?php echo esc_attr($field_id); ?>" data-preview="#<?php echo esc_attr($field_id); ?>-preview">Change image</button>
            <br />
            <img id="<?php echo esc_attr($field_id); ?>-preview" src="<?php echo esc_url($preview_url); ?>" alt="" style="max-width:140px;margin-top:8px;<?php echo $preview_url === '' ? 'display:none;' : ''; ?>" />
          </div>
          <div style="flex:1;">
            <p>
              <label>Occasion<br />
                <select name="<?php echo esc_attr($option_name); ?>[gallery][items][<?php echo esc_attr((string) $index); ?>][occasion]">
                  <?php foreach ($occasions as $value => $label) : ?>
                    <option value="<?php echo esc_attr($value); ?>" <?php selected($item['occasion'], $value); ?>><?php echo esc_html($label); ?></option>
                  <?php endforeach; ?>
                </select>
              </label>
            </p>
            <p>
              <label>Alt text<br />
                <input class="regular-text" name="<?php echo esc_attr($option_name); ?>[gallery][items][<?php echo esc_attr((string) $index); ?>][alt]" value="<?php echo esc_attr($item['alt']); ?>" />
              </label>
            </p>
            <p><button type="button" class="button-link-delete viola-remove-gallery-item">Remove</button></p>
          </div>
        </div>
      <?php endforeach; ?>
    </div>

    <template id="viola-gallery-row-template">
      <div class="viola-gallery-row" style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;padding:12px;border:1px solid #dcdcde;background:#fff;max-width:720px;">
        <div>
          <input type="hidden" id="cc_gallery_item___INDEX__" class="viola-gallery-image-id" name="<?php echo esc_attr($option_name); ?>[gallery][items][__INDEX__][image_id]" value="" />
          <button type="button" class="button viola-media-button" data-target="#cc_gallery_item___INDEX__" data-preview="#cc_gallery_item___INDEX__-preview">Change image</button>
          <br />
          <img id="cc_gallery_item___INDEX__-preview" src="" alt="" style="max-width:140px;margin-top:8px;display:none;" />
        </div>
        <div style="flex:1;">
          <p>
            <label>Occasion<br />
              <select name="<?php echo esc_attr($option_name); ?>[gallery][items][__INDEX__][occasion]">
                <?php foreach ($occasions as $value => $label) : ?>
                  <option value="<?php echo esc_attr($value); ?>"><?php echo esc_html($label); ?></option>
                <?php endforeach; ?>
              </select>
            </label>
          </p>
          <p>
            <label>Alt text<br />
              <input class="regular-text" name="<?php echo esc_attr($option_name); ?>[gallery][items][__INDEX__][alt]" value="" />
            </label>
          </p>
          <p><button type="button" class="button-link-delete viola-remove-gallery-item">Remove</button></p>
        </div>
      </div>
    </template>

    <?php submit_button('Save custom cakes content'); ?>
  </form>
</div>
