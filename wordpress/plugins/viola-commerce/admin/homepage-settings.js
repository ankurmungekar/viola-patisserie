(function ($) {
  function openMediaPicker(button) {
    const targetSelector = button.data("target");
    const $target = $(targetSelector);

    const frame = wp.media({
      title: "Select image",
      button: { text: "Use image" },
      multiple: false,
    });

    frame.on("select", function () {
      const attachment = frame.state().get("selection").first().toJSON();
      $target.val(attachment.id);

      const previewSelector = button.data("preview");
      if (previewSelector) {
        const $preview = $(previewSelector);
        if (attachment.url) {
          $preview.attr("src", attachment.url).show();
        }
      }
    });

    frame.open();
  }

  $(document).on("click", ".viola-media-button", function (event) {
    event.preventDefault();
    openMediaPicker($(this));
  });
})(jQuery);
