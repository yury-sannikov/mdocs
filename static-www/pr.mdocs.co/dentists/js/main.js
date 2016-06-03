(function($) {

  "use strict";
  
  var formValidateBlock = {
    submitHandler: function(form) {
      var form_btn = $(form).find('button[type="submit"]');
      var button_default_msg = "Request Now";
      var success_msg = form_btn.data('success-msg');
      var error_msg = form_btn.data('error-msg');
      var loading_msg = form_btn.data('loading-msg');

      form_btn.attr("disabled","disabled");
      form_btn.text(loading_msg);

      $.ajax({
        url:'https://axc0hldmja.execute-api.us-east-1.amazonaws.com/prod/mdocsappointment',
        type: 'POST',
        data: JSON.stringify($(form).serializeArray()),
        contentType: 'application/json',
        dataType: 'json',
        success: function(d) {
              form_btn.text(success_msg);
              form_btn.addClass("success");
              setTimeout(function() {
                form_btn.text(button_default_msg);
                form.reset();
                form_btn.attr("disabled", false);
                form_btn.removeClass("success");
              }, 5000);
          },
          error: function(d) {
            form_btn.text(error_msg);
            form_btn.addClass("error");
            setTimeout(function() {
              form_btn.text(button_default_msg);
              form_btn.attr("disabled", false);
              form_btn.removeClass("error");
            }, 5000);
          }
      });
    }
  };

  // Contact Forms
  $("#demo_form").validate(formValidateBlock);

})(jQuery);
