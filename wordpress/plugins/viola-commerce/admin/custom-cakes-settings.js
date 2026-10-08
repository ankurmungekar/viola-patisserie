(function ($) {
  function openMediaPicker(button, multiple) {
    const frame = wp.media({
      title: multiple ? "Select gallery images" : "Select image",
      button: { text: multiple ? "Add images" : "Use image" },
      multiple: Boolean(multiple),
    });

    frame.on("select", function () {
      const selection = frame.state().get("selection");

      if (multiple) {
        selection.each(function (attachmentModel) {
          const attachment = attachmentModel.toJSON();
          appendGalleryRow(attachment);
        });
        return;
      }

      const attachment = selection.first().toJSON();
      const targetSelector = button.data("target");
      const $target = $(targetSelector);
      $target.val(attachment.id);

      const previewSelector = button.data("preview");
      if (previewSelector && attachment.url) {
        $(previewSelector).attr("src", attachment.url).show();
      }
    });

    frame.open();
  }

  function nextGalleryIndex() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  function appendGalleryRow(attachment) {
    const template = document.getElementById("viola-gallery-row-template");
    const container = document.getElementById("viola-custom-cakes-gallery");

    if (!template || !container) {
      return;
    }

    const index = String(nextGalleryIndex());
    const html = template.innerHTML.replace(/__INDEX__/g, index);
    const $row = $(html);

    $row.find(".viola-gallery-image-id").val(attachment.id);

    if (attachment.url) {
      $row.find("img").attr("src", attachment.url).show();
    }

    if (attachment.alt) {
      $row.find('input[name*="[alt]"]').val(attachment.alt);
    }

    $(container).append($row);
  }

  $(document).on("click", ".viola-media-button", function (event) {
    event.preventDefault();
    openMediaPicker($(this), false);
  });

  $(document).on("click", "#viola-add-gallery-images", function (event) {
    event.preventDefault();
    openMediaPicker($(this), true);
  });

  $(document).on("click", ".viola-remove-gallery-item", function (event) {
    event.preventDefault();
    $(this).closest(".viola-gallery-row").remove();
  });
})(jQuery);
