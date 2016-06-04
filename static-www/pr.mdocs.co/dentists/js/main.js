(function($) {

  "use strict";
  var slack_url = 'https://hooks.slack.com/services/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';

  $(document).ready(function() {
    $.getJSON('https://freegeoip.net/json/', function(data) {
      // console.log(JSON.stringify(data, null, 2));
      /* Slack */
      $.ajax({
        url: slack_url,
        type: 'POST',
        data: JSON.stringify({"text": "NEW DEMO VISITOR.\nDETAILS: " + JSON.stringify(data, null, 2), "username": "moneybot", "icon_url": "http://icons.iconarchive.com/icons/icons-land/multiple-smiley/256/Emoticon-Money-icon.png"}),
        success: function(d) {
            // console.log('Succcess');
          },
        error: function(d) {
            // console.log('Error');
          }
        });
      /* End of Slack */
    });
    
  });

  
  var formValidateBlock = {
    submitHandler: function(form) {
      var form_btn = $(form).find('button[type="submit"]');
      var button_default_msg = "Request Now";
      var success_msg = form_btn.data('success-msg');
      var error_msg = form_btn.data('error-msg');
      var loading_msg = form_btn.data('loading-msg');
      var form_val = JSON.stringify($(form).serializeArray(), null, 2);

      form_btn.attr("disabled","disabled");
      form_btn.text(loading_msg);

      $.ajax({
        url:'https://axc0hldmja.execute-api.us-east-1.amazonaws.com/prod/mdocsappointment',
        type: 'POST',
        data: form_val,
        contentType: 'application/json',
        dataType: 'json',
        success: function(d) {

          /* Slack */
          $.ajax({
            url: slack_url,
            type: 'POST',
            data: JSON.stringify({"text": "NEW DEMO REQUEST!\nDETAILS: " + form_val, "username": "moneybot", "icon_url": "https://app.mdocs.co/favicon.png"}),
            success: function(d) {
                console.log('Succcess');
              },
            error: function(d) {
                console.log('Error');
              }
            });
          /* End of Slack */

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

  $("#demo_form").validate(formValidateBlock);

})(jQuery);
