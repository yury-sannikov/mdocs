(function($) {

  "use strict";



  /* ------------ PAGE LOADING ------------ */

  // hide header first
  $('.fadeInOnLoad').css('opacity', 0);

  // closing loading section on click
  // useful for bored users
  $('#loading').on('click', function() {
      $("#loading").fadeOut();
  });
  /*On Page Load, Fadecout Loading, Start Scroll Animation*/
  $(window).load(function() {
      $("#loading").fadeOut();
      $("#loading .object").delay(700).fadeOut("slow");
      // Show header on load
      $('.fadeInOnLoad').delay(700).fadeTo("slow", 1);

      /*Iniitate Scroll Animation*/
      bodyScrollAnimation()
  })


  /* ------------ ON SCROLL ANIMATION ------------ */


  function bodyScrollAnimation() {
      var scrollAnimate = $('body').data('scroll-animation');
      if (scrollAnimate === true) {
          new WOW({
              mobile: false
          }).init()
      }
  }


  /* ------------ SCROLL SPY ------------ */


  /*Scroll Spy*/
  $('body').scrollspy({
      target: '#main-navbar',
      offset: 100
  });



  /* ================================================
      Scroll Functions
      ================================================ */


  $('nav a[href^="#"]:not([href="#"]), .back_to_top, .explore').on('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 70
      }, 1500);
      event.preventDefault();
  });



  /* ---------- Nav BG ON Scroll---------- */

  $(window).scroll(function() {
      var scroll = $(window).scrollTop();

      if (scroll >= 99) {
          $(".navbar-default").addClass("is-scrolling");
      } else {
          $(".navbar-default").removeClass("is-scrolling");
      }
  });


  /* ---------- Back to Top ---------- */

  $(window).scroll(function() {
      if ($(window).scrollTop() > 1000) {
          $('.back_to_top').fadeIn('slow');
      } else {
          $('.back_to_top').fadeOut('slow');
      }
  });


  /* ---------- Background Video ---------- */

  if ($('#BGVideo').length) {
      $("#BGVideo").mb_YTPlayer();
  }


  /* ---------- Play Video POPUP ---------- */

  if ($('.video').length) {
      $('.video').magnificPopup({
          type: 'iframe',
          iframe: {
              markup: '<div class="mfp-iframe-scaler">' +
                  '<div class="mfp-close"></div>' +
                  '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                  '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

              patterns: {
                  youtube: {
                      index: 'youtube.com/', // String that detects type of video 

                      id: 'v=', // String that splits URL in a two parts, second part should be %id%
                      // Or null - full URL will be returned
                      // Or a function that should return %id%, for example:
                      // id: function(url) { return 'parsed id'; }

                      src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                  },
                  vimeo: {
                      index: 'vimeo.com/',
                      id: '/',
                      src: '//player.vimeo.com/video/%id%?autoplay=1'
                  },
                  gmaps: {
                      index: '//maps.google.',
                      src: '%id%&output=embed'
                  }


              },

              srcAction: 'iframe_src',
          }
      });

  }

  /* ---------- PRODUCT POPUP ---------- */

  if ($('a[href="#product-choose"]').length) {

      $('a[href="#product-choose"]').magnificPopup({
          type: 'inline',
          mainClass: 'mfp-fade',
          midClick: true // mouse middle button click
      });

  }

  /* ---------- CONTACT POPUP ---------- */

  if ($('a[href="#contact-popup"]').length) {

      $('a[href="#contact-popup"]').magnificPopup({
          type: 'inline',
          mainClass: 'mfp-fade',
          midClick: true // mouse middle button click
      });

  }

  /* ---------- SIGNUP POPUP ---------- */

  if ($('a[href="#signup-popup"]').length) {

      $('a[href="#signup-popup"]').magnificPopup({
          type: 'inline',
          mainClass: 'mfp-fade',
          midClick: true // mouse middle button click
      });

  }


  /* ---------- MAGNIFIC POPUP ---------- */

  $('.gallery').each(function() {

      $('.gallery').magnificPopup({
          delegate: 'a', // child items selector, by clicking on it popup will open
          type: 'image',
          gallery: { enabled: true },
          mainClass: 'mfp-fade'
      });

  });

  /* ---------- QUANTITY TOUCHSPIN ---------- */

  if ($('.quanity').length) {

      $('.quanity').TouchSpin({
          verticalbuttons: true,
          verticalupclass: 'glyphicon glyphicon-plus',
          verticaldownclass: 'glyphicon glyphicon-minus'
      });

  }

  /* ---------- SELECTPICKER ---------- */

  if ($('.selectpicker').length) {
      $('.selectpicker').selectpicker();
  }


  /*Feature Notes*/
  $('.feature-note .plus-icon .plus').on('click', function() {
      if ($(this).parents('.feature-note').hasClass('show-cont')) {
          $(this).parents('.feature-note').removeClass('show-cont')
      } else {
          $(this).parents('.feature-note').addClass('show-cont')
      }
  });


  /* ---------- CONTACT FORM FLIPBOX ---------- */

  $('.flip-contact-box').on('click', function() {
      if (!$('.flip-box-container').hasClass('show-form')) {
          $('.flip-box-container').addClass('show-form')
      }
  });

  $('.js-close-flip').on('click', function() {
      $('.flip-box-container').removeClass('show-form');
  });




  /* ================================================
      Paypal Form Validation
      ================================================ */

  /* ================================================
  jQuery Validate - Reset Defaults
  ================================================ */

  if ($.fn.validator) {

      $.validator.setDefaults({
          highlight: function(element) {
              $(element).closest('.form-group').addClass('has-error');
          },
          unhighlight: function(element) {
              $(element).closest('.form-group').removeClass('has-error');
          },
          errorPlacement: function(error, element) {}
      });
  }

  if ($.fn.validator) {
      // validate Registration Form
      $("#paypal-regn").validate({
          rules: {
              first_name: "required",
              last_name: "required",
              email: {
                  required: true,
                  email: true
              },
              os0: "required",
              quantity: "required",
              agree: "required"
          },
          messages: {
              first_name: "Your first name",
              last_name: "Your last name",
              email: "We need your email address",
              os0: "Choose your Pass",
              quantity: "How many seats",
              agree: "Please accept our terms and privacy policy"
          },
          submitHandler: function(form) {
              $("#reserve-btn").attr("disabled", true);
              form.submit();
              //console.log($(form).serialize())
          }
      });
  }

  /* ---------- INITIATE EXIT MODAL ---------- */

  var dataexitpopuop = $('body').data('exit-modal');

  if ($('#exit-modal').length && dataexitpopuop === true) {

      var _ouibounce = ouibounce($('#exit-modal')[0], {
          aggressive: true, // use false here to hide message once shown
          timer: 0,
          callback: function() { // if you need to do something, write here
          }
      });
      $('body').on('click', function() {
          $('#exit-modal').hide();
      });
      $('#exit-modal .modal-footer').on('click', function() {
          $('#exit-modal').hide();
      });
      $('#exit-modal .exit-modal').on('click', function(e) {
          e.stopPropagation();
      });

  }

  var formValidateBlock = {
    submitHandler: function(form) {
      var form_btn = $(form).find('button[type="submit"]');
      var form_result_div = '#js-contact-result';
      $(form_result_div).remove();
      form_btn.before('<div id="form-result" class="alert alert-success" role="alert" style="display: none;"></div>');
      var form_btn_old_msg = form_btn.html();
      form_btn.html(form_btn.prop('disabled', true).data("loading-text"));

      var success_msg = $('#js-contact-result').data('success-msg');
      var error_msg = $('#js-contact-result').data('error-msg');

      $.ajax({
        url:'https://axc0hldmja.execute-api.us-east-1.amazonaws.com/prod/mdocsappointment',
        type: 'POST',
        data: JSON.stringify($(form).serializeArray()),
        contentType: 'application/json',
        dataType: 'json',
        success: function(d) {
              $(".form-group").removeClass("has-success");
              $("#js-contact-btn").text(success_msg);
              setTimeout(function() {
                  $("#js-contact-btn").text('Submit Request');
              }, 2000);
              $('#home_appointment_form')[0].reset();
              $("#js-contact-btn").attr("disabled", false);
          },
          error: function(d) {
              $("#js-contact-btn").text('Cannot access Server');
              $("#js-contact-btn").attr("disabled", false);
              setTimeout(function() {
                  $("#js-contact-btn").text('Submit Request');
              }, 2000);
          }
      });
    }
  };

  // Contact Forms
  $("#home_appointment_form").validate(formValidateBlock);
  $("#contact_appointment_form").validate(formValidateBlock);

  // Auth0 Lock form
  var lock = new Auth0Lock('SdMQqjyMjjWAM2NbxfY8BJXK28JgQ2iB', 'movelmobile.auth0.com');

  window.auth0signin = function() {
    var l = window.location;
    lock.show({
        callbackURL: l.protocol + '//' + l.host + '/callback',
        responseType: 'code',
        authParams: {
          scope: 'openid profile'
        },
        icon: 'https://app.mdocs.co/images/pr-logo-square.png'
    });
  }
  
  // Sign UP Wizard
  $('.wizard-step-1').submit(function(event) {
    event.preventDefault();
    var formData = {
      _csrf: $('input[name=_csrf]', this).val(),
      name: $('input[name=name]', this).val(),
      email: $('input[name=email]', this).val(),
      pwd: $('input[name=pwd]', this).val()
    };

    $('.wizard-next').prop('disabled', true);

    $.ajax({
      type        : 'POST',
      url         : '/signup/user',
      data        : formData,
      dataType    : 'json',
      encode          : true
    })
    .complete(function() {
      $('.wizard-next').prop('disabled', false);
    })
    .error(function(err) {
      //TODO: Display error
      console.log(err);  
    })
    .success(function(data) {
      console.log(data);
      if (!data.success) {
        return;
      }
      //TODO: Fix names
      $('#schedule-tabs a[href="#tab-2"]').tab('show');
    });
  });
})(jQuery);
