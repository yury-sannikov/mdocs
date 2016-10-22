/*
systype - system message type
empty or 'appointment' - appointment. Goes to appointment list
subscribe - subscription request from web site
message - patient message from web site
reviews - web site reviews
*/
(function(init) {
  init(window.jQuery, window, document);
}(function($, window, document) {

  var isLocalhost = window.location.hostname === 'localhost';
  var apiUrl = isLocalhost ? 'http://localhost:3030/app/api/appointment' : 'https://app.mdocs.co/app/api/appointment'
  function submitForm(event) {

    event.preventDefault();

    var form = $(this).closest('form');

    // If we have jquery.validate installed, check for form validity
    if (form.valid && !form.valid()) {
      console.log('is not valid!');
      return;
    }

    var inputs = ['firstname', 'lastname', 'fullname', 'isnew', 'profileId',
      'email', 'phone', 'zip', 'comment', 'description', 'systype', 'dob', 'visitdate', 'rate'];
    var data = {};
    $.each(inputs, function(i, v) {
      var inp = $('[name="' + v + '"]', form);
      if (inp.length === 1) {
        data[v] = inp.val();
      }
    });

    var profileId = $('script[data-profileid]').data('profileid');
    profileId = data.profileId || profileId
    if (!profileId) {
      invokeFormCallback(form, 'Unable to find account information.');
      return;
    }
    data.profileId = profileId;
    invokeFormCallback(form, data, '-beforesubmit')

    $.ajax({
      url: apiUrl,
      type: 'POST',
      data: JSON.stringify(data),
      crossDomain: true,
      contentType: 'application/json',
      dataType: 'json',
      success: function(d) {
        $('input.js-bookonline-submit').attr('value','This request successfully sent!');
        $('input.js-bookonline-submit').attr('disabled',true);
        invokeFormCallback(form, null);
      },
      error: function(d) {
        $('input.js-bookonline-submit').attr('value','Some error occured...');
        $('input.js-bookonline-submit').attr('disabled',true);
        invokeFormCallback(form, d);
      }
    });
  }

  function invokeFormCallback(form, data, postfix) {
    postfix = postfix || ''
    var callbackName = form.data('callback'+postfix);
    if (callbackName && window[callbackName]) {
      window[callbackName].call(form, data)
    }
  }

  function attachForm() {
    var f$ = $(this);
    if (f$.attr('js-form-attached')) {
      return;
    }
    f$.attr('js-form-attached', true);
    $('.js-bookonline-submit', f$).on('click', submitForm);
  }

  $(function() {
    $('.js-bookonline-form').each(attachForm);
  });
}));
