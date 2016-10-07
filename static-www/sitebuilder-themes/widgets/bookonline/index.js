(function(init) {
  init(window.jQuery, window, document);
}(function($, window, document) {

  function submitForm(event) {
    event.preventDefault();

    var form = $(this).closest('form');

    // If we have jquery.validate installed, check for form validity
    if (form.valid && !form.valid()){
      return;
    }

    var inputs = ['firstname', 'lastname', 'fullname', 'isnew',
      'email', 'phone', 'zip', 'comment', 'description', 'systype', 'dob', 'visitdate'];
    var data = {}
    $.each(inputs, function(i, v) {
      var inp = $('[name="' + v + '"]', form)
      if (inp.length === 1) {
        data[v] = inp.val()
      }
    })

    var profileId = $('script[data-profileid]').data('profileid');
    if (!profileId) {
      invokeFormCallback(form, 'Unable to find account information.')
      return;
    }
    data.profileId = profileId;

    $.ajax({
      url:'https://app.mdocs.co/app/api/appointment',
      type: 'POST',
      data: JSON.stringify(data),
      crossDomain: true,
      contentType: 'application/json',
      dataType: 'json',
      success: function(d) {
        invokeFormCallback(form, null)
      },
      error: function(d) {
        invokeFormCallback(form, d)
      }
    });
  }

  function invokeFormCallback(form, data) {
    var callbackName = form.data('callback');
    if (callbackName && window[callbackName]) {
      window[callbackName].call(data, data)
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
