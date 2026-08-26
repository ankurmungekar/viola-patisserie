<?php

if (!defined('ABSPATH')) {
    exit;
}

$option_name = 'viola_homepage_settings';

function viola_admin_image_field(string $label, string $id_name, int $image_id, string $image_url = ''): void
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
  <h1>Viola Homepage Content</h1>
  <p>Update homepage text and images. Layout and styling are controlled by the storefront.</p>

  <form method="post" action="options.php">
    <?php settings_fields('viola_homepage_settings_group'); ?>

    <h2>Hero</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="hero_eyebrow_tags">Eyebrow tags</label></th>
        <td><input class="regular-text" id="hero_eyebrow_tags" name="<?php echo esc_attr($option_name); ?>[hero][eyebrow_tags]" value="<?php echo esc_attr($settings['hero']['eyebrow_tags']); ?>" /><p class="description">Separate with |</p></td>
      </tr>
      <tr>
        <th scope="row"><label for="hero_title_line_1">Title line 1</label></th>
        <td><input class="regular-text" id="hero_title_line_1" name="<?php echo esc_attr($option_name); ?>[hero][title_line_1]" value="<?php echo esc_attr($settings['hero']['title_line_1']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="hero_title_line_2">Title line 2 (accent)</label></th>
        <td><input class="regular-text" id="hero_title_line_2" name="<?php echo esc_attr($option_name); ?>[hero][title_line_2]" value="<?php echo esc_attr($settings['hero']['title_line_2']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="hero_description">Description</label></th>
        <td><textarea class="large-text" rows="3" id="hero_description" name="<?php echo esc_attr($option_name); ?>[hero][description]"><?php echo esc_textarea($settings['hero']['description']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="hero_cta_label">Button label</label></th>
        <td><input class="regular-text" id="hero_cta_label" name="<?php echo esc_attr($option_name); ?>[hero][cta_label]" value="<?php echo esc_attr($settings['hero']['cta_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="hero_cta_url">Button URL</label></th>
        <td><input class="regular-text" id="hero_cta_url" name="<?php echo esc_attr($option_name); ?>[hero][cta_url]" value="<?php echo esc_attr($settings['hero']['cta_url']); ?>" /></td>
      </tr>
      <?php viola_admin_image_field('Hero image', $option_name . '[hero][image_id]', (int) $settings['hero']['image_id']); ?>
    </table>

    <h2>Our Story</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="story_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="story_eyebrow" name="<?php echo esc_attr($option_name); ?>[our_story][eyebrow]" value="<?php echo esc_attr($settings['our_story']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_title_dark">Title (dark)</label></th>
        <td><input class="regular-text" id="story_title_dark" name="<?php echo esc_attr($option_name); ?>[our_story][title_dark]" value="<?php echo esc_attr($settings['our_story']['title_dark']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_title_accent">Title (accent)</label></th>
        <td><input class="regular-text" id="story_title_accent" name="<?php echo esc_attr($option_name); ?>[our_story][title_accent]" value="<?php echo esc_attr($settings['our_story']['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_paragraph_1">Paragraph 1</label></th>
        <td><textarea class="large-text" rows="4" id="story_paragraph_1" name="<?php echo esc_attr($option_name); ?>[our_story][paragraph_1]"><?php echo esc_textarea($settings['our_story']['paragraph_1']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_paragraph_2">Paragraph 2</label></th>
        <td><textarea class="large-text" rows="3" id="story_paragraph_2" name="<?php echo esc_attr($option_name); ?>[our_story][paragraph_2]"><?php echo esc_textarea($settings['our_story']['paragraph_2']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_signature">Signature</label></th>
        <td><input class="regular-text" id="story_signature" name="<?php echo esc_attr($option_name); ?>[our_story][signature]" value="<?php echo esc_attr($settings['our_story']['signature']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_signature_title">Signature title</label></th>
        <td><input class="regular-text" id="story_signature_title" name="<?php echo esc_attr($option_name); ?>[our_story][signature_title]" value="<?php echo esc_attr($settings['our_story']['signature_title']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_cta_label">Button label</label></th>
        <td><input class="regular-text" id="story_cta_label" name="<?php echo esc_attr($option_name); ?>[our_story][cta_label]" value="<?php echo esc_attr($settings['our_story']['cta_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="story_cta_url">Button URL</label></th>
        <td><input class="regular-text" id="story_cta_url" name="<?php echo esc_attr($option_name); ?>[our_story][cta_url]" value="<?php echo esc_attr($settings['our_story']['cta_url']); ?>" /></td>
      </tr>
      <?php viola_admin_image_field('Story image', $option_name . '[our_story][image_id]', (int) $settings['our_story']['image_id']); ?>
    </table>

    <h2>Value Props</h2>
    <?php foreach ($settings['value_props'] as $index => $value_prop) : ?>
      <h3>Value prop <?php echo esc_html((string) ($index + 1)); ?></h3>
      <table class="form-table" role="presentation">
        <tr>
          <th scope="row"><label>Icon key</label></th>
          <td>
            <select name="<?php echo esc_attr($option_name); ?>[value_props][<?php echo esc_attr((string) $index); ?>][icon]">
              <?php foreach (['badge', 'mixer', 'truck', 'gift-box'] as $icon_key) : ?>
                <option value="<?php echo esc_attr($icon_key); ?>" <?php selected($value_prop['icon'], $icon_key); ?>><?php echo esc_html($icon_key); ?></option>
              <?php endforeach; ?>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row"><label>Title</label></th>
          <td><input class="regular-text" name="<?php echo esc_attr($option_name); ?>[value_props][<?php echo esc_attr((string) $index); ?>][title]" value="<?php echo esc_attr($value_prop['title']); ?>" /></td>
        </tr>
        <tr>
          <th scope="row"><label>Description</label></th>
          <td><textarea class="large-text" rows="2" name="<?php echo esc_attr($option_name); ?>[value_props][<?php echo esc_attr((string) $index); ?>][description]"><?php echo esc_textarea($value_prop['description']); ?></textarea></td>
        </tr>
      </table>
    <?php endforeach; ?>

    <h2>Custom Cakes</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="cakes_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="cakes_eyebrow" name="<?php echo esc_attr($option_name); ?>[custom_cakes][eyebrow]" value="<?php echo esc_attr($settings['custom_cakes']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cakes_title_dark">Title (dark)</label></th>
        <td><input class="regular-text" id="cakes_title_dark" name="<?php echo esc_attr($option_name); ?>[custom_cakes][title_dark]" value="<?php echo esc_attr($settings['custom_cakes']['title_dark']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cakes_title_accent">Title (accent)</label></th>
        <td><input class="regular-text" id="cakes_title_accent" name="<?php echo esc_attr($option_name); ?>[custom_cakes][title_accent]" value="<?php echo esc_attr($settings['custom_cakes']['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cakes_description">Description</label></th>
        <td><textarea class="large-text" rows="3" id="cakes_description" name="<?php echo esc_attr($option_name); ?>[custom_cakes][description]"><?php echo esc_textarea($settings['custom_cakes']['description']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="cakes_cta_label">Button label</label></th>
        <td><input class="regular-text" id="cakes_cta_label" name="<?php echo esc_attr($option_name); ?>[custom_cakes][cta_label]" value="<?php echo esc_attr($settings['custom_cakes']['cta_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="cakes_cta_url">Button URL</label></th>
        <td><input class="regular-text" id="cakes_cta_url" name="<?php echo esc_attr($option_name); ?>[custom_cakes][cta_url]" value="<?php echo esc_attr($settings['custom_cakes']['cta_url']); ?>" /></td>
      </tr>
      <?php viola_admin_image_field('Background image', $option_name . '[custom_cakes][image_id]', (int) $settings['custom_cakes']['image_id']); ?>
    </table>

    <h2>Instagram</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="instagram_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="instagram_eyebrow" name="<?php echo esc_attr($option_name); ?>[instagram][eyebrow]" value="<?php echo esc_attr($settings['instagram']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="instagram_handle">Handle</label></th>
        <td><input class="regular-text" id="instagram_handle" name="<?php echo esc_attr($option_name); ?>[instagram][handle]" value="<?php echo esc_attr($settings['instagram']['handle']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="instagram_description">Description</label></th>
        <td><textarea class="large-text" rows="2" id="instagram_description" name="<?php echo esc_attr($option_name); ?>[instagram][description]"><?php echo esc_textarea($settings['instagram']['description']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="instagram_cta_label">Button label</label></th>
        <td><input class="regular-text" id="instagram_cta_label" name="<?php echo esc_attr($option_name); ?>[instagram][cta_label]" value="<?php echo esc_attr($settings['instagram']['cta_label']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="instagram_cta_url">Button URL</label></th>
        <td><input class="regular-text" id="instagram_cta_url" name="<?php echo esc_attr($option_name); ?>[instagram][cta_url]" value="<?php echo esc_attr($settings['instagram']['cta_url']); ?>" /></td>
      </tr>
    </table>

    <?php foreach ($settings['instagram']['posts'] as $index => $post) : ?>
      <h3>Instagram post <?php echo esc_html((string) ($index + 1)); ?></h3>
      <table class="form-table" role="presentation">
        <tr>
          <th scope="row"><label>Views</label></th>
          <td><input class="regular-text" name="<?php echo esc_attr($option_name); ?>[instagram][posts][<?php echo esc_attr((string) $index); ?>][views]" value="<?php echo esc_attr($post['views']); ?>" /></td>
        </tr>
        <tr>
          <th scope="row"><label>Post URL</label></th>
          <td><input class="regular-text" name="<?php echo esc_attr($option_name); ?>[instagram][posts][<?php echo esc_attr((string) $index); ?>][url]" value="<?php echo esc_attr($post['url']); ?>" /></td>
        </tr>
        <?php viola_admin_image_field('Image', $option_name . '[instagram][posts][' . $index . '][image_id]', (int) $post['image_id']); ?>
      </table>
    <?php endforeach; ?>

    <h2>Site / Footer</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="site_name">Site name</label></th>
        <td><input class="regular-text" id="site_name" name="<?php echo esc_attr($option_name); ?>[site][name]" value="<?php echo esc_attr($settings['site']['name']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_tagline">Tagline</label></th>
        <td><textarea class="large-text" rows="2" id="site_tagline" name="<?php echo esc_attr($option_name); ?>[site][tagline]"><?php echo esc_textarea($settings['site']['tagline']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_address">Address</label></th>
        <td><input class="regular-text" id="site_address" name="<?php echo esc_attr($option_name); ?>[site][address]" value="<?php echo esc_attr($settings['site']['address']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_phone_display">Phone display</label></th>
        <td><input class="regular-text" id="site_phone_display" name="<?php echo esc_attr($option_name); ?>[site][phone_display]" value="<?php echo esc_attr($settings['site']['phone_display']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_phone">Phone (tel link)</label></th>
        <td><input class="regular-text" id="site_phone" name="<?php echo esc_attr($option_name); ?>[site][phone]" value="<?php echo esc_attr($settings['site']['phone']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_instagram">Instagram handle</label></th>
        <td><input class="regular-text" id="site_instagram" name="<?php echo esc_attr($option_name); ?>[site][instagram]" value="<?php echo esc_attr($settings['site']['instagram']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_instagram_url">Instagram URL</label></th>
        <td><input class="regular-text" id="site_instagram_url" name="<?php echo esc_attr($option_name); ?>[site][instagram_url]" value="<?php echo esc_attr($settings['site']['instagram_url']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="site_top_bar_message">Top bar message</label></th>
        <td><input class="regular-text" id="site_top_bar_message" name="<?php echo esc_attr($option_name); ?>[site][top_bar_message]" value="<?php echo esc_attr($settings['site']['top_bar_message']); ?>" /></td>
      </tr>
    </table>

    <?php submit_button('Save homepage content'); ?>
  </form>
</div>
