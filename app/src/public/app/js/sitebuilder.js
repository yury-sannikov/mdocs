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
          $(self.input).froalaEditor(options)
          .on('froalaEditor.blur', function (e, editor) {
            e.preventDefault();
            e.stopPropagation();
            self.input.value = editor.html.get(false)
            self.refreshValue();
            self.onChange(true);
          })
          //- .on('froalaEditor.file.beforeUpload', function (e, editor, files) {
          //-   // Return false if you want to stop the file upload.
          //- })
          .on('froalaEditor.file.uploaded', function (e, editor, response) {
            // File was uploaded to the server.
            console.log('uploaded: ' + response);
            // response.link gets the link
          })
          .on('froalaEditor.file.inserted', function (e, editor, $file, response) {
            // File was inserted in the editor.
            console.log('inserted: ' + response);
            // response.link gets the link
          })
          .on('froalaEditor.file.error', function (e, editor, error, response) {
            console.log(error);
            alert(error.message);
          })
          //- .on('froalaEditor.image.beforeUpload', function (e, editor, images) {
          //-   // Return false if you want to stop the image upload.
          //- })
          .on('froalaEditor.image.uploaded', function (e, editor, response) {
            // Image was uploaded to the server.
            console.log('uploaded: ' + response);
            // response.link gets the link
          })
          .on('froalaEditor.image.inserted', function (e, editor, $img, response) {
            // Image was inserted in the editor.
            console.log('inserted: ' + response);
            // response.link gets the link
          })
          .on('froalaEditor.image.replaced', function (e, editor, $img, response) {
            // Image was replaced in the editor.
            console.log('replaced: ' + response);
            // response.link gets the link
          })
          .on('froalaEditor.image.error', function (e, editor, error, response) {
            console.log(error);
            alert(error.message);
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

