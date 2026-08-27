<?php

if (!defined('ABSPATH')) {
    exit;
}

$option_name = 'viola_about_settings';

function viola_about_image_field(string $label, string $id_name, int $image_id, string $image_url = ''): void
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
  <h1>Viola About Page</h1>
  <p>Update About Us page text and images. Layout and styling are controlled by the storefront.</p>

  <form method="post" action="options.php">
    <?php settings_fields('viola_about_settings_group'); ?>

    <h2>Our Story</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="about_story_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="about_story_eyebrow" name="<?php echo esc_attr($option_name); ?>[story][eyebrow]" value="<?php echo esc_attr($settings['story']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_story_title_line_1">Title line 1</label></th>
        <td><input class="regular-text" id="about_story_title_line_1" name="<?php echo esc_attr($option_name); ?>[story][title_line_1]" value="<?php echo esc_attr($settings['story']['title_line_1']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_story_title_accent">Title accent</label></th>
        <td><input class="regular-text" id="about_story_title_accent" name="<?php echo esc_attr($option_name); ?>[story][title_accent]" value="<?php echo esc_attr($settings['story']['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_story_paragraph_1">Paragraph 1</label></th>
        <td><textarea class="large-text" rows="4" id="about_story_paragraph_1" name="<?php echo esc_attr($option_name); ?>[story][paragraph_1]"><?php echo esc_textarea($settings['story']['paragraph_1']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_story_paragraph_2">Paragraph 2</label></th>
        <td><textarea class="large-text" rows="4" id="about_story_paragraph_2" name="<?php echo esc_attr($option_name); ?>[story][paragraph_2]"><?php echo esc_textarea($settings['story']['paragraph_2']); ?></textarea></td>
      </tr>
      <?php viola_about_image_field('Story image', $option_name . '[story][image_id]', (int) $settings['story']['image_id']); ?>
    </table>

    <h2>Highlight Banner</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="about_highlight_paragraph_1">Paragraph 1</label></th>
        <td><textarea class="large-text" rows="4" id="about_highlight_paragraph_1" name="<?php echo esc_attr($option_name); ?>[highlight][paragraph_1]"><?php echo esc_textarea($settings['highlight']['paragraph_1']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_highlight_paragraph_2">Paragraph 2</label></th>
        <td><textarea class="large-text" rows="4" id="about_highlight_paragraph_2" name="<?php echo esc_attr($option_name); ?>[highlight][paragraph_2]"><?php echo esc_textarea($settings['highlight']['paragraph_2']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_highlight_stat_value">Stat value</label></th>
        <td><input class="regular-text" id="about_highlight_stat_value" name="<?php echo esc_attr($option_name); ?>[highlight][stat_value]" value="<?php echo esc_attr($settings['highlight']['stat_value']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_highlight_stat_label">Stat label</label></th>
        <td><input class="regular-text" id="about_highlight_stat_label" name="<?php echo esc_attr($option_name); ?>[highlight][stat_label]" value="<?php echo esc_attr($settings['highlight']['stat_label']); ?>" /></td>
      </tr>
      <?php viola_about_image_field('Side image', $option_name . '[highlight][image_id]', (int) $settings['highlight']['image_id']); ?>
    </table>

    <h2>Meet the Founder</h2>
    <table class="form-table" role="presentation">
      <tr>
        <th scope="row"><label for="about_founder_eyebrow">Eyebrow</label></th>
        <td><input class="regular-text" id="about_founder_eyebrow" name="<?php echo esc_attr($option_name); ?>[founder][eyebrow]" value="<?php echo esc_attr($settings['founder']['eyebrow']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_title_line_1">Title line 1</label></th>
        <td><input class="regular-text" id="about_founder_title_line_1" name="<?php echo esc_attr($option_name); ?>[founder][title_line_1]" value="<?php echo esc_attr($settings['founder']['title_line_1']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_title_accent">Title accent</label></th>
        <td><input class="regular-text" id="about_founder_title_accent" name="<?php echo esc_attr($option_name); ?>[founder][title_accent]" value="<?php echo esc_attr($settings['founder']['title_accent']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_paragraph_1">Paragraph 1</label></th>
        <td><textarea class="large-text" rows="3" id="about_founder_paragraph_1" name="<?php echo esc_attr($option_name); ?>[founder][paragraph_1]"><?php echo esc_textarea($settings['founder']['paragraph_1']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_paragraph_2">Paragraph 2</label></th>
        <td><textarea class="large-text" rows="4" id="about_founder_paragraph_2" name="<?php echo esc_attr($option_name); ?>[founder][paragraph_2]"><?php echo esc_textarea($settings['founder']['paragraph_2']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_paragraph_3">Paragraph 3</label></th>
        <td><textarea class="large-text" rows="4" id="about_founder_paragraph_3" name="<?php echo esc_attr($option_name); ?>[founder][paragraph_3]"><?php echo esc_textarea($settings['founder']['paragraph_3']); ?></textarea></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_signature">Signature</label></th>
        <td><input class="regular-text" id="about_founder_signature" name="<?php echo esc_attr($option_name); ?>[founder][signature]" value="<?php echo esc_attr($settings['founder']['signature']); ?>" /></td>
      </tr>
      <tr>
        <th scope="row"><label for="about_founder_signature_title">Signature title</label></th>
        <td><input class="regular-text" id="about_founder_signature_title" name="<?php echo esc_attr($option_name); ?>[founder][signature_title]" value="<?php echo esc_attr($settings['founder']['signature_title']); ?>" /></td>
      </tr>
      <?php viola_about_image_field('Founder image', $option_name . '[founder][image_id]', (int) $settings['founder']['image_id']); ?>
    </table>

    <?php submit_button('Save about page content'); ?>
  </form>
</div>
