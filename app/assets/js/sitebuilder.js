 (function(init) {
    init(window.jQuery, window, document);
  }(function($, window, document) {

    JSONEditor.defaults.editors.froala = JSONEditor.defaults.editors.string.extend({
      afterInputReady: function() {
        var self = this;
        if (this.source_code) {
          var options = JSONEditor.defaults.editors.froala.options || {
            toolbarInline: false,
            iframe: true
          }
          var imageRx = new RegExp('/assets/img', 'g')
          var uploadsImageRx = new RegExp('/assets/uploads/images', 'g')
          var newVal = $(self.input).val().replace(uploadsImageRx, JSONEditor.defaults.editors.froala.options.SITEBUILDER_PREIVEW_URL + '/assets/uploads/images')
          newVal = $(self.input).val().replace(imageRx, JSONEditor.defaults.editors.froala.options.SITEBUILDER_PREIVEW_URL + '/assets/img')
          $(self.input).val(newVal)
          $(self.input).froalaEditor(options)
          .on('froalaEditor.blur', function (e, editor) {
            e.preventDefault();
            e.stopPropagation();
            self.input.value = editor.html.get(false)
            self.refreshValue();
            self.onChange(true);
          })
          .on('froalaEditor.html.get', function(e, editor, html) {
            var rx = new RegExp(JSONEditor.defaults.editors.froala.options.SITEBUILDER_PREIVEW_URL, 'g');
            return html.replace(rx, '')
          })
          .on('froalaEditor.image.removed', function (e, editor, img) {
            $.ajax({
              crossDomain: true,
              xhrFields: {
                  withCredentials: true
              },
              method: 'DELETE',
              url: img.attr('src')
            })
          });
        } else {
          this._super();
        }
      }
    });
    JSONEditor.defaults.resolvers.unshift(function(schema) {
      if(schema.type === "string" && schema.format === "html") {
        return "froala";
      }
    });

    $(function() {
    });

  }));

