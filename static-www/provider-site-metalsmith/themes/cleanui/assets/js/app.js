var MDOCS = (function() {
    var initModule = function() {
        if ($(window).scrollTop() + $(window).height() == $(document).height())
            $('.nofollow').nofollow();
        if ($('body.VERMEER').length) {
            $('.nav-full > ul').clone().appendTo('.nav-optimal');
            $('.nav-optimal').on('click', '.fa-plus', function() {
                $(this).toggleClass('clicked').siblings('.dropdownContain, .sideNavContain').slideToggle('fast')
            });
            $('.nav-toggle').click(function() {
                $(this).toggleClass('expanded');
                $('.nav-optimal').slideToggle('fast')
            });
            $('.nav-optimal a.nav-item').click(function() {
                $('.nav-toggle').click()
            });
            var checkVermeer = function() {
                if ($('div.nav-full').outerWidth() >= ($("nav").outerWidth() - $('.navbar-info').outerWidth())) {
                    $('nav').addClass('show-optimal');
                    $('nav').removeClass('show-full')
                } else {
                    $('nav').addClass('show-full');
                    $('nav').removeClass('show-optimal');
                    $('.nav-optimal').hide();
                    $('.nav-toggle').removeClass('expanded')
                }
            };
            
            $(window).resize(checkVermeer);
            checkVermeer()
        };

        // $('#location-map').lazyLoadGoogleMaps({
        //     callback: function(container, map) {
        //         var address = $(container).data('address')
        //           , geocoder = new google.maps.Geocoder();
        //         geocoder.geocode({
        //             address: address
        //         }, function(results, status) {
        //             if (status == google.maps.GeocoderStatus.OK) {
        //                 var styles = [{
        //                     stylers: []
        //                 }];
        //                 if ($('body.VERMEER').length) {
        //                     styles = [{
        //                         stylers: [{
        //                             hue: "#363534"
        //                         }, {
        //                             saturation: -90
        //                         }]
        //                     }]
        //                 } else if ($('body.VINCI').length > 0)
        //                     styles = [{
        //                         stylers: [{
        //                             hue: "#3d4148"
        //                         }, {
        //                             saturation: -90
        //                         }]
        //                     }];
        //                 map.setCenter(results[0].geometry.location);
        //                 map.setOptions({
        //                     scrollwheel: false,
        //                     disableDefaultUI: true,
        //                     zoomControl: true,
        //                     styles: styles
        //                 });
        //                 var marker = new google.maps.Marker({
        //                     map: map,
        //                     position: results[0].geometry.location
        //                 });
        //                 google.maps.event.addDomListener(window, 'resize', function() {
        //                     map.setCenter(results[0].geometry.location)
        //                 });
        //                 var infowindow = new google.maps.InfoWindow({
        //                     content: $("#location-info").html()
        //                 });
        //                 google.maps.event.addListener(marker, 'click', function() {
        //                     infowindow.open(map, marker)
        //                 });
        //                 google.maps.event.trigger(marker, 'click')
        //             }
        //         })
        //     }
        // });

        $('.location-map').each(MDOCS.loadMaps);
        var shownMap = false;
        if ($(document).scrollTop() > 180) {
            $('body.VERMEER header').addClass('scrolling');
            if ($('.language-bar').length) {
                $('body').removeClass('eyebrow');
                $('.language-bar').hide()
            }
        };

        $(window).scroll(function() {
            if ($(document).scrollTop() > 180) {
                $("nav ul li.action-book").addClass("scrolling");
                $('body.VERMEER header').addClass('scrolling')
            } else {
                $("nav ul li.action-book").removeClass("scrolling");
                $('body.VERMEER header').removeClass('scrolling')
            }
            ;if ($(window).scrollTop() + $(window).height() == $(document).height())
                $('.nofollow').nofollow();
            if ($('.language-bar').length)
                if ($(document).scrollTop() > 180) {
                    $('body').removeClass('eyebrow');
                    $('.language-bar').slideUp('fast')
                } else {
                    $('.language-bar').slideDown('fast');
                    $('body').addClass('eyebrow')
                }
        });
        
        if ($('#rating-slider').length > 0)
            $('#rating-slider').flexslider({
                animation: "swing",
                controlNav: false,
                directionNav: true,
                prevText: '',
                nextText: '',
                randomize: true
            });
        
        if ($('#testimonial-slider').length > 0)
            $('#testimonial-slider').flexslider({
                animation: "swing",
                controlsContainer: ".flex-container"
            });
        
        $(".navbar-toggle").click(function() {
            $(".navbar-collapse").slideToggle('fast')
        });
        
        var rtime = new Date(1,1,2e3,12,00,00)
          , timeout = false
          , delta = 100;
        
        $(window).resize(function() {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta)
            }
        })

        function resizeend() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta)
            } else {
                timeout = false;
                if ($(window).width() >= 940)
                    $(".navbar-collapse").css({
                        display: ""
                    })
            }
        };

        $(".btn-call.multi").on("click", function() {
            if ($("section.locations").length > 0)
                $("html, body").animate({
                    scrollTop: $("section.locations").offset().top - 78
                }, "slow")
        });
        
        $(".call-btn").on("click", function() {
            if (typeof ga !== "undefined")
                ga('send', 'event', 'button', 'click', 'phone call')
        });
        
        $(".btn-call").on("click", function() {
            if (typeof ga !== "undefined")
                ga('send', 'event', 'button', 'click', 'phone call')
        });
        
        $("li.action-book").on("click", function() {
            if (typeof ga !== "undefined")
                ga('send', 'event', 'button', 'click', 'book online button')
        });
        
        // $("#main-slider").thumbScroller();
        // $("#modal-slider").thumbScroller({
        //     modal: true
        // });

        // $("#hero-slider").thumbScroller();
        // $("a.read-more-link").each(function() {
        //     data = $(this).data();
        //     data = _.defaults(data, {
        //         parent: 'section'
        //     });
        //     var $content = $(this).closest('.inner').find('.type-overflow')
        //       , $short = $(this).parents(data.parent).find('.type-short')
        //       , $more = $short.find('.read-more-link')
        //       , $less = $short.find('.read-less-link');
        //     if ($content.outerHeight() > $(this).closest('.inner').find('.type-wrapper').outerHeight()) {
        //         $(this).css({
        //             display: "inline-block"
        //         }).click(function() {
        //             $(this).closest('.inner').find('.type-wrapper').addClass('full-height');
        //             $more.hide();
        //             $less.show();
        //             return false
        //         });
        //         $less.click(function() {
        //             $(this).closest('.inner').find('.type-wrapper').removeClass('full-height');
        //             $less.hide();
        //             $more.show();
        //             return false
        //         })
        //     } else
        //         $(this).closest('.inner').find('.type-wrapper').css({
        //             height: "auto"
        //         })
        // });

        $("a.read-more-review-link").each(function() {
            data = $(this).data();
            data = _.defaults(data, {
                parent: 'section'
            });
            var $content = $(this).closest('.inner').find('.type-overflow')
              , $full = $(this).parents(data.parent).find('.type-full')
              , $short = $(this).parents(data.parent).find('.type-short')
              , $more = $short.find('.read-more-review-link')
              , $less = $short.find('.read-less-review-link');
            if ($content.outerHeight() > $(this).closest('.inner').find('.type-wrapper').outerHeight()) {
                $(this).css({
                    display: "inline-block"
                }).click(function() {
                    $short.hide();
                    $full.show();
                    $more.hide();
                    return false
                })
            } else
                $(this).closest('.inner').find('.type-wrapper').css({
                    height: "auto"
                })
        });
        $("div.promo-slider").each(function() {
            $(this).carouselize(parseInt($(this).data('delay')) > 0 ? {
                scrollDelay: $(this).data('delay') + '000'
            } : {})
        });
        if ($('body.VERMEER').length) {
            $("section.promo:odd").addClass('odd')
        } else
            $("section.pinstripe:odd").css({
                "background-color": "#f5f9f9"
            });
        $('section.contact-form #contact-form').submit(function() {
            var error_message = '';
            if (!$('section.contact-form .ack_medical_condition input[type="checkbox"]').prop('checked'))
                error_message = 'Please agree to our contact form acknowledgement';
            if ($("section.contact-form .terms_confirm").length && !$('section.contact-form .terms_confirm input[type="checkbox"]').prop('checked'))
                if (error_message != '') {
                    error_message = error_message + ', terms of use, and privacy policy'
                } else
                    error_message = 'Please agree to our terms of use and privacy policy';
            if (error_message != '') {
                error_message = error_message + ' to send your question.';
                $('#contact-us-modal .modal-body p').text(error_message);
                $('#contact-us-modal').modal('show');
                return false
            }
            ;$("section.contact-form .btn-submit").data('origText', $("section.contact-form .btn-submit").text());
            $("section.contact-form .btn-submit").html('<i class="fa fa-cog fa-spin"></i> Sending').prop("disabled", true);
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: $(this).serialize()
            }).done(function(data) {
                if (data.status == 'success') {
                    if (typeof ga !== "undefined")
                        ga('send', 'event', 'button', 'click', 'contact us - comment');
                    grecaptcha.reset()
                }
                ;$('#contact-us-modal .modal-body p').text(data.message);
                $('#contact-us-modal').modal('show');
                $("section.contact-form .btn-submit").html($("section.contact-form .btn-submit").data('origText')).prop("disabled", false)
            }).error(function(jqXHR, textStatus, errorThrown) {
                $('#contact-us-modal .modal-body p').text(jqXHR.responseJSON.error.message ? jqXHR.responseJSON.error.message : 'Sorry, sending the message failed. Please try again.');
                $('#contact-us-modal').modal('show');
                $("section.contact-form .btn-submit").html($("section.contact-form .btn-submit").data('origText')).prop("disabled", false)
            });
            return false
        });
        $('#ask-form').submit(function() {
            var error_message = '';
            if (!$('section.contact .ack_medical_condition input[type="checkbox"]').prop('checked'))
                error_message = 'Please agree to our contact form acknowledgement';
            if ($('section.contact .terms_confirm').length && !$('section.contact .terms_confirm input[type="checkbox"]').prop('checked'))
                if (error_message != '') {
                    error_message = error_message + ', terms of use, and privacy policy'
                } else
                    error_message = 'Please agree to our terms of use and privacy policy';
            if (error_message != '') {
                error_message = error_message + ' to send your question.';
                $('section.contact .contact-msg').addClass('error');
                $('section.contact .contact-msg').text(error_message);
                return false
            }
            ;$(".ask-submit").data('origText', $(".ask-submit").text());
            $(".ask-submit").html('<i class="fa fa-cog fa-spin"></i> Sending').prop("disabled", true);
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: $(this).serialize()
            }).done(function(data) {
                if (data.status == 'error')
                    $('section.contact .contact-msg').addClass('error');
                if (data.status == 'success') {
                    $('section.contact .contact-msg').removeClass('error');
                    if (typeof ga !== "undefined")
                        ga('send', 'event', 'button', 'click', 'contact us - comment');
                    grecaptcha.reset(widgetIdRecaptcha)
                }
                ;$('section.contact .contact-msg').text(data.message);
                if (data.message == 'Your message was sent.') {
                    $('section.contact .contact-msg').addClass('success');
                    $('section.contact .txt-input').val('')
                }
                ;$(".ask-submit").html('Submit').prop("disabled", false)
            }).error(function() {
                $('section.contact .contact-msg').text('Sorry, sending the message failed. Please try again.');
                $(".ask-submit").html($(".ask-submit").data('origText')).prop("disabled", false)
            });
            return false
        });
        
        // $(window).hashchange(MDOCS.swingToHash);
        // $('a.jump-link').click(function() {
        //     $target = $('section.' + $(this).data('target'));
        //     $offset = $(this).data('offset');
        //     if ($(window).width() >= 940) {
        //         $("html, body").animate({
        //             scrollTop: $target.offset().top - $offset
        //         }, "slow")
        //     } else
        //         $("html, body").animate({
        //             scrollTop: $target.offset().top - 50
        //         }, "slow");
        //     return false
        // });
        // var closeYTPlayer = function() {
        //     $('.yt-player').find('iframe').attr('src', '');
        //     $('.yt-player').hide()
        // }
        // ;
        // $('button.play-vid').click(function() {
        //     $('.yt-player').find('iframe').attr('src', 'https://www.youtube.com/embed/' + $(this).data('video-id') + '?wmode=transparent&amp;version=3&amp;enablejsapi=1&amp;modestbranding=1&amp;rel=0;autoplay=1');
        //     $('.yt-player').show()
        // });
        // $('button.close-yt-player').click(closeYTPlayer);
        // $('.yt-player').click(closeYTPlayer)
    }
    ;
    return {
        initModule: initModule
    }
}());

MDOCS.loadMaps = function() {
    var $mapCont = $(this);
    $mapCont.lazyLoadGoogleMaps({
        callback: function(container, map) {
            var address = $(container).data('address')
              , geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var styles = [{
                        stylers: []
                    }];
                    if ($('body.VERMEER').length) {
                        styles = [{
                            stylers: [{
                                hue: "#363534"
                            }, {
                                saturation: -90
                            }]
                        }]
                    } else if ($('body.VINCI').length > 0)
                        styles = [{
                            stylers: [{
                                hue: "#3d4148"
                            }, {
                                saturation: -90
                            }]
                        }];
                    map.setCenter(results[0].geometry.location);
                    map.setOptions({
                        scrollwheel: false,
                        disableDefaultUI: true,
                        zoomControl: false,
                        draggable: false,
                        disableDoubleClickZoom: true,
                        styles: styles
                    });
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    })
                }
            })
        }
    })
};

MDOCS.swingToHash = function() {
    if (window.location.hash != '' && $("section." + window.location.hash.substring(1)).length > 0)
        if ($(window).width() >= 940) {
            $("html, body").animate({
                scrollTop: $("section." + window.location.hash.substring(1)).offset().top - 78
            }, "slow")
        } else
            $("html, body").animate({
                scrollTop: $("section." + window.location.hash.substring(1)).offset().top - 50
            }, "slow")
};

$(document).ready(function() {
    MDOCS.initModule();
    // MDOCS.launchCal = parseInt(getUrlParameter('book', false));
});



















$(window).load(function() {
    $('.hero-media').fadeIn('slow');
    if (window.location.hash != '')
        MDOCS.swingToHash();
    if (MDOCS.launchCal)
        $('a[data-target="#book-online"]').click()
});
;(function() {
    MDOCS.blog = {
        size: null ,
        showPer: null ,
        shown: null ,
        turnOn: function() {
            this.size = $("#blog-listings article").size();
            this.shown = this.showPer;
            $('#blog-listings article:lt(' + this.showPer + ')').fadeIn();
            if (this.size > this.showPer)
                return $("#load-more").show().click(function() {
                    MDOCS.blog.shown += MDOCS.blog.showPer;
                    $('#blog-listings article:lt(' + MDOCS.blog.shown + ')').fadeIn();
                    if (MDOCS.blog.shown >= MDOCS.blog.size)
                        return $(this).hide()
                })
        }
    }
}
).call(this);
;(function() {
    MDOCS.confirmAppointment = {
        turnOn: function() {
            var apptHash;
            apptHash = getUrlParameter('confirm', false);
            if (apptHash)
                return $("#patient-confirmation").modal().show()
        }
    }
}
).call(this);
;(function() {
    $(function() {
        $('#main-nav li.drop .fa-plus').on('click', function(event) {
            var dropdown;
            dropdown = $(this).parent().find($(this).data('drop'));
            $(this).parent().find($(this).data('partner')).addClass('active');
            $(this).removeClass('active');
            return dropdown.slideDown('fast', function() {
                dropdown.addClass('active');
                return dropdown.attr('style', null )
            })
        });
        return $('#main-nav li.drop .fa-minus').on('click', function(event) {
            var dropdown;
            dropdown = $(this).parent().find($(this).data('drop'));
            $(this).parent().find($(this).data('partner')).addClass('active');
            $(this).removeClass('active');
            return dropdown.slideUp('fast', function() {
                dropdown.attr('style', null );
                return dropdown.removeClass('active')
            })
        })
    })
}
).call(this);
;(function() {
    $(function() {
        return $('.section-nav-bar-item').on('click', function(event) {
            var section, sections;
            event.preventDefault();
            section = $(this).attr('href').replace(/\/#/gi, '');
            sections = $("section." + section);
            if (sections.length === 1) {
                return goToByScroll("section." + section)
            } else
                return window.location.href = $(this).attr('href')
        })
    })
}
).call(this);
;(function() {
    MDOCS.emailOptout = {
        types: [],
        optout: function(event) {
            $('#patient-email-optout .modal-header .modal-subtitle').addClass('hidden');
            $("#patient-email-optout .modal-body span.error").remove();
            $("#patient-email-optout .modal-body input").removeClass('required');
            if (!isValidEmailAddress($("#patient-email-optout .modal-body input[name='email']").val())) {
                $("#patient-email-optout .modal-body #email-label").append('<span class="error">* invalid email</span>');
                $("#patient-email-optout .modal-body input[name='email']").addClass('required')
            }
            ;if ($("#patient-email-optout .modal-body span.error").length === 0) {
                $(".btn-submit-optout").prop("disabled", true);
                $.ajax({
                    type: "POST",
                    url: $('#patient-email-optout-form').attr('action'),
                    data: $('#patient-email-optout-form').serialize(),
                    success: function(data) {
                        $('#patient-email-optout .modal-body .optout-details').slideUp();
                        $('#patient-email-optout .modal-body .optout-success').slideDown();
                        $('#patient-email-optout .modal-footer .btn-cancel').html("Close");
                        $('#patient-email-optout .modal-footer .btn-submit-optout').addClass("hidden");
                        return true
                    },
                    error: function(data) {
                        if (data.content != null )
                            $('#patient-email-optout .modal-header .modal-subtitle').html(data.content);
                        $('#patient-email-optout .modal-header .modal-subtitle').slideDown();
                        return true
                    }
                })
            }
            ;return false
        },
        turnOn: function() {
            var optoutType, showOptout;
            showOptout = getUrlParameter('optout', false);
            showOptout = !isNaN(parseInt(showOptout));
            optoutType = getUrlParameter('optouttype', null );
            if (showOptout && _.has(MDOCS.emailOptout.types, optoutType)) {
                $("#patient-email-optout .modal-body .patient-email-optout-type").val(optoutType);
                $('#patient-email-optout.modal').modal().show();
                $('#patient-email-optout.modal .modal-footer .btn-submit-optout').on('click', MDOCS.emailOptout.optout)
            }
        }
    }
}
).call(this);
;(function() {
    window.validateDate = function(date) {
        var pattern;
        pattern = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
        return pattern.test(date)
    }
    ;
    window.validatePhone = function(tel) {
        var error, stripped;
        error = "";
        stripped = tel.replace(/[\.\(\)\@\!\-\#\$\%\^\&\*\=\_\|\ ]/g, '');
        if (tel === "") {
            error = "Required\n"
        } else if (isNaN(parseInt(stripped))) {
            error = "Invalid Phone format\n"
        } else if (!(stripped.length === 10) && !(stripped.length === 11))
            error = "Invalid Phone format\n";
        return error
    }
    ;
    window.isValidEmailAddress = function(emailAddress) {
        var pattern;
        pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress)
    }
    ;
    window.timeInMinutes = function(time) {
        var hours, meridian, minutes, totalMinutes;
        meridian = time.split(' ')[1];
        hours = parseInt(time.split(':')[0]);
        minutes = parseInt(time.split(':')[1]);
        totalMinutes = 0;
        if (meridian === 'am') {
            if (hours === 12)
                hours = 0
        } else if (hours !== 12)
            hours += 12;
        return (hours * 60) + minutes
    }
    ;
    window.getUrlParameters = function(queryString) {
        var multiparam, parameters;
        if (queryString == null )
            queryString = window.location.search;
        if (!(queryString != null ) || queryString === null )
            queryString = "";
        queryString = queryString.replace("?", "");
        multiparam = /\[\]/;
        parameters = {};
        if (queryString && queryString.length > 0)
            $.each(queryString.split('&'), function(c, query) {
                var key, value, _ref;
                _ref = query.split('='),
                key = _ref[0],
                value = _ref[1];
                key = decodeURIComponent(key);
                value = decodeURIComponent(value).replace(/\+/g, " ");
                if (key.match(multiparam)) {
                    key = key.replace(multiparam, '');
                    if (parameters[key] == null )
                        parameters[key] = []
                }
                ;if (parameters[key]instanceof Array) {
                    return parameters[key].push(value)
                } else
                    return parameters[key] = value
            });
        return parameters
    }
    ;
    window.getUrlParameter = function(name, backup) {
        var param, params;
        if (backup == null )
            backup = null ;
        params = getUrlParameters();
        return param = _.has(params, name) ? params[name] : backup
    }
    ;
    window.clone = function(obj) {
        var flags, key, newInstance;
        if (!(obj != null ) || typeof obj !== 'object')
            return obj;
        if (obj instanceof Date)
            return new Date(obj.getTime());
        if (obj instanceof RegExp) {
            flags = '';
            if (obj.global != null )
                flags += 'g';
            if (obj.ignoreCase != null )
                flags += 'i';
            if (obj.multiline != null )
                flags += 'm';
            if (obj.sticky != null )
                flags += 'y';
            return new RegExp(obj.source,flags)
        }
        ;newInstance = new obj.constructor();
        for (key in obj)
            newInstance[key] = clone(obj[key]);
        return newInstance
    }
    ;
    window.isIE9OrBelow = function() {
        return /MSIE\s/.test(window.navigator.userAgent) && parseFloat(window.navigator.appVersion.split("MSIE")[1]) < 10
    }
    ;
    window.goToByScroll = function(jquerySelector) {
        return $('html,body').animate({
            scrollTop: $(jquerySelector).offset().top - $('header').height()
        }, 'slow')
    }
    ;
    (function($) {
        $.fn.nofollow = function(options) {
            return this.each(function() {
                var $this, elementData, i, newElementHtml;
                $this = $(this);
                elementData = $this.data('element');
                newElementHtml = '';
                i = 0;
                while (i < elementData.length) {
                    newElementHtml += String.fromCharCode(parseInt(elementData.substring(i, i + 2), 16));
                    i += 2
                }
                ;$this.replaceWith(newElementHtml)
            })
        }
    })(jQuery);
    window.brightenColor = function(code, brightness) {
        var b, g, num, r;
        num = parseInt(code, 16);
        r = (num >> 16) + brightness;
        if (r > 255) {
            r = 255
        } else if (r < 0)
            r = 0;
        b = ((num >> 8) & 0x00FF) + brightness;
        if (b > 255) {
            b = 255
        } else if (b < 0)
            b = 0;
        g = (num & 0x0000FF) + brightness;
        if (g > 255) {
            g = 255
        } else if (g < 0)
            g = 0;
        return (g | (b << 8) | (r << 16)).toString(16)
    }
    ;
    window.rgb2hex = function(rgb) {
        var hex;
        if (rgb.search("rgb") === -1) {
            return rgb
        } else {
            rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
            hex = function(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2)
            }
            ;
            return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
        }
    }
}
).call(this);
;(function() {
    MDOCS.reputationLanding = {
        turnOn: function() {
            $("section.practice-testimonials-landing .read-only-rating, .testimonials-reviews .read-only-rating, section.doctor-testimonials-landing .read-only-rating").rating({
                ratingClass: 'rating-fa',
                glyphicon: false,
                showClear: false,
                size: 'xs',
                step: 1,
                max: 5,
                min: 0,
                showCaption: false,
                readonly: true
            })
        }
    }
}
).call(this);
;(function() {
    MDOCS.createReview = {
        practice: null ,
        getDocName: function() {
            var doc, name;
            doc = _.find(MDOCS.createReview.practice.docs, function(doc) {
                if (doc.id === MDOCS.createReview.getDocId())
                    return doc
            });
            name = "";
            if (doc != null ) {
                if (doc.prefix)
                    name += doc.prefix + " ";
                if (doc.firstname)
                    name += doc.firstname + " ";
                if (doc.lastname)
                    name += doc.lastname;
                if (doc.suffix)
                    name += ", " + doc.suffix
            } else
                name = MDOCS.createReview.practice.name;
            return name
        },
        launchModal: function(apptId) {
            var appt, docid, locid;
            if (apptId == null )
                apptId = null ;
            appt = null ;
            if (apptId) {
                appt = MDOCS.appointment.setUp(apptId);
                appt.pull(false)
            } else if (MDOCS.appointment.pulled)
                appt = MDOCS.appointment;
            MDOCS.createReview.resetModal();
            docid = null ;
            locid = null ;
            if (appt && !appt.reviewed) {
                docid = appt.doctor_id;
                locid = appt.location_id;
                $('#leave-review.modal #review-form #review-email').val(appt.email);
                $('#leave-review.modal #review-form #review-first-name').val(appt.firstname);
                $('#leave-review.modal #review-form #review-last-name').val(appt.lastname);
                $('#leave-review.modal #review-form .appt_id').val(appt.id)
            }
            ;if (locid != null )
                if (_.contains(_.pluck(MDOCS.createReview.practice.locs, 'id'), parseInt(locid)))
                    $('#leave-review.modal #review-form .loc_id').val(locid);
            if (docid != null )
                if (_.contains(_.pluck(MDOCS.createReview.practice.docs, 'id'), parseInt(docid)))
                    $('#leave-review.modal #review-form .doc_id').val(docid);
            if (!MDOCS.createReview.getLocId()) {
                MDOCS.createReview.showLocSelector()
            } else if (!MDOCS.createReview.getDocId() && MDOCS.createReview.practice.docs.length > 0) {
                MDOCS.createReview.showDocSelector()
            } else
                MDOCS.createReview.showForm()
        },
        resetModal: function() {
            $("#leave-review.modal #review-form span.error").remove();
            $("#leave-review.modal #review-form input").removeClass('required');
            $('#leave-review.modal .selectloc').hide();
            $('#leave-review.modal .review-details').hide();
            $('#leave-review.modal .selectdoc').hide();
            $('#leave-review.modal #review-rating').hide();
            $('#leave-review.modal #positive-review').hide();
            $('#leave-review.modal #negative-review').hide();
            $('#leave-review.modal .btn-submit-review').hide();
            $('#leave-review.modal .modal-footer').hide();
            $('#leave-review.modal #leave-review-sublabel').html("");
            $('#leave-review.modal #disclaimer-reviewer').html("");
            $('#review-form').trigger('reset');
            if ($('#leave-review.modal #review-form .star-rating').length > 0)
                $("#leave-review.modal #review-form #review-rating-input").rating('clear');
            if (MDOCS.createReview.practice.docs.length > 1)
                $('#leave-review.modal #review-form .doc_id').val("");
            if (MDOCS.createReview.practice.locs.length > 1)
                $('#leave-review.modal #review-form .loc_id').val("");
            $('#leave-review.modal #review-form .appt_id').val("");
            $('#leave-review #review-medallions').empty()
        },
        getDocId: function() {
            return parseInt($('#leave-review.modal #review-form .doc_id').val())
        },
        getLocId: function() {
            return parseInt($('#leave-review.modal #review-form .loc_id').val())
        },
        getDisclaimerName: function() {
            var first, last;
            first = $("#leave-review.modal #review-form input[name='first_name']").val();
            last = $("#leave-review.modal #review-form input[name='last_name']").val();
            return first.toLowerCase() + " " + last.charAt(0).toLowerCase() + "."
        },
        showLocSelector: function() {
            $('#leave-review.modal #leave-review-label').html('Select Location');
            $('#leave-review.modal .selectdoc').hide();
            $('#leave-review.modal .selectloc').show();
            $(window).trigger('resize')
        },
        showDocSelector: function() {
            $('#leave-review.modal #leave-review-label').html('Select Provider');
            $('#leave-review.modal .selectloc').hide();
            $('#leave-review.modal .selectdoc').fadeIn();
            if (MDOCS.createReview.getLocId())
                $('#leave-review.modal #leave-review-sublabel').html($("#leave-review.modal .location-block[data-locid='" + (MDOCS.createReview.getLocId()) + "'] .location-name").html())
        },
        showForm: function() {
            $('#leave-review.modal #leave-review-label').html(MDOCS.createReview.getDocName());
            $('#leave-review.modal #leave-review-sublabel').html($("#leave-review.modal .location-block[data-locid='" + (MDOCS.createReview.getLocId()) + "'] .location-name").html());
            $('#leave-review.modal .selectdoc').hide();
            $('#leave-review.modal .selectloc').hide();
            $('#leave-review.modal .review-details').show();
            $('#leave-review.modal #reviewer-info').show();
            $('#leave-review.modal .modal-footer').show();
            $("#leave-review.modal .btn-next").show()
        },
        turnOn: function() {
            var apptBeingReviewed;
            apptBeingReviewed = getUrlParameter('pop_review');
            if (apptBeingReviewed != null )
                if (!isNaN(parseInt(apptBeingReviewed))) {
                    apptBeingReviewed = parseInt(apptBeingReviewed);
                    $('#leave-review.modal').modal().show();
                    MDOCS.createReview.launchModal(apptBeingReviewed)
                }
            ;$('input.btn-leave-review').on('click', function(event) {
                return MDOCS.createReview.launchModal()
            });
            $('#leave-review.modal .provider-block .doc-select, #leave-review.modal .provider-block .doc-select-hover').on('click', function(event) {
                $('#leave-review.modal #review-form .doc_id').val($(this).data().docid);
                if (!MDOCS.createReview.getLocId()) {
                    MDOCS.createReview.showLocSelector()
                } else
                    MDOCS.createReview.showForm()
            });
            $('#leave-review.modal .location-block .loc-select, #leave-review.modal .location-block .loc-select-hover').on('click', function(event) {
                $('#leave-review.modal #review-form .loc_id').val($(this).data().locid);
                if (!MDOCS.createReview.getDocId() && MDOCS.createReview.practice.docs.length > 0) {
                    MDOCS.createReview.showDocSelector()
                } else
                    MDOCS.createReview.showForm()
            });
            $('#leave-review.modal .modal-footer .btn-next').on('click', function(event) {
                var clearCaption, preSelectRating, starCaptions;
                preSelectRating = getUrlParameter('stars');
                if (preSelectRating)
                    preSelectRating = parseInt(preSelectRating);
                $("#leave-review.modal #review-form span.error").remove();
                $("#leave-review.modal #review-form input").removeClass('required');
                if ($("#leave-review.modal #review-form input[name='first_name']").val() === '' || $("#leave-review.modal #review-form input[name='first_name']").val().trim().length < 1) {
                    $("#leave-review.modal #review-form #first-name-label").append('<span class="error">* required</span>');
                    $("#leave-review.modal #review-form input[name='first_name']").addClass('required')
                }
                ;if ($("#leave-review.modal #review-form input[name='last_name']").val() === '' || $("#leave-review.modal #review-form input[name='last_name']").val().trim().length < 1) {
                    $("#leave-review.modal #review-form #last-name-label").append('<span class="error">* required</span>');
                    $("#leave-review.modal #review-form input[name='last_name']").addClass('required')
                }
                ;if (!isValidEmailAddress($("#leave-review.modal #review-form input[name='email']").val())) {
                    $("#leave-review.modal #review-form #email-label").append('<span class="error">* invalid email</span>');
                    $("#leave-review.modal #review-form input[name='email']").addClass('required')
                }
                ;if ($("#leave-review.modal #review-form span.error").length === 0) {
                    if ($('#leave-review.modal #review-form .star-rating').length === 0) {
                        if (MDOCS.createReview.practice.feedback_email_is_questionare === 1) {
                            starCaptions = {
                                1: "Very Unlikely",
                                2: "Unlikely",
                                3: "Unsure",
                                4: "Somewhat Likely",
                                5: "Very Likely"
                            };
                            clearCaption = "Likelihood of recommendation"
                        } else {
                            starCaptions = {
                                1: "Very Disappointed",
                                2: "Not Impressed",
                                3: "Okay Experience",
                                4: "Good Experience",
                                5: "Great Experience"
                            };
                            clearCaption = "Rate It"
                        }
                        ;$("#leave-review.modal #review-form #review-rating-input").rating({
                            ratingClass: 'rating-fa',
                            glyphicon: false,
                            showClear: false,
                            size: 'xs',
                            step: 1,
                            max: 5,
                            min: 0,
                            showCaption: true,
                            clearCaption: clearCaption,
                            starCaptionClasses: {
                                0: "raiting-label label-neutral",
                                1: "raiting-label label-danger",
                                2: "raiting-label label-danger",
                                3: "raiting-label label-neutral",
                                4: "raiting-label label-success",
                                5: "raiting-label label-success"
                            },
                            starCaptions: starCaptions
                        })
                    }
                    ;if (preSelectRating)
                        $('#leave-review.modal #review-form #review-rating-input').rating('update', preSelectRating);
                    $("#leave-review.modal #review-form #disclaimer-reviewer").html(MDOCS.createReview.getDisclaimerName());
                    $("#leave-review.modal #review-form #reviewer-info").slideUp();
                    $("#leave-review.modal #review-form #review-rating").slideDown();
                    $("#leave-review.modal .btn-next").hide();
                    $("#leave-review.modal .btn-submit-review").show()
                }
            });
            $("#leave-review.modal #review-form #review-rating-input").on('rating.change', function(event, value, caption) {
                $(this).val(value);
                if (value > 0)
                    return $("#leave-review.modal #review-form .star-rating span.error").remove()
            });
            $("#leave-review.modal #review-form textarea[name='quote']").on('change', function(event) {
                if ($(this).val().length > 0) {
                    $("#leave-review.modal #review-form #quote-label span.error").remove();
                    return $("#leave-review.modal #review-form textarea[name='quote']").removeClass('required')
                }
            });
            $("#leave-review.modal #review-form input[name='last_name']").on('change', function(event) {
                if ($(this).val().trim().length > 0) {
                    $("#leave-review.modal #review-form #last-name-label span.error").remove();
                    return $("#leave-review.modal #review-form input[name='last_name']").removeClass('required')
                }
            });
            $("#leave-review.modal #review-form input[name='first_name']").on('change', function(event) {
                if ($(this).val().trim().length > 0) {
                    $("#leave-review.modal #review-form #first-name-label span.error").remove();
                    return $("#leave-review.modal #review-form input[name='first_name']").removeClass('required')
                }
            });
            $('#review-medallions').on('click', '.review-medallion-link', function() {
                if (typeof ga !== "undefined" && ga !== null )
                    return ga('send', 'event', 'button', 'click', 'external review')
            });
            $('#leave-review.modal .modal-footer .btn-submit-review').on('click', function(event) {
                $("#leave-review.modal #review-form span.error").remove();
                $("#leave-review.modal #review-form textarea").removeClass('required');
                if (parseInt($("#leave-review.modal #review-form #review-rating-input").val()) === 0)
                    $('#leave-review.modal #review-form .star-rating').append('<span class="error">* required</span>');
                if ($("#leave-review.modal #review-form textarea[name='quote']").val() === '') {
                    $("#leave-review.modal #review-form #quote-label").append('<span class="error">* required</span>');
                    $("#leave-review.modal #review-form textarea[name='quote']").addClass('required')
                }
                ;if ($("#leave-review.modal #review-form span.error").length === 0) {
                    $('#leave-review.modal .modal-footer .btn-cancel').hide();
                    $("#leave-review.modal .modal-footer .btn-submit-review").html('<i class="fa fa-cog fa-spin"></i> Submitting').prop("disabled", true);
                    $.ajax({
                        type: "POST",
                        url: $("#leave-review.modal #review-form").attr('action'),
                        data: $("#leave-review.modal #review-form").serialize(),
                        success: function(data) {
                            var rowToInsert;
                            if (data.status === 'success') {
                                if (typeof ga !== "undefined" && ga !== null )
                                    ga('send', 'event', 'button', 'click', 'leave review');
                                if (data.content.positive) {
                                    rowToInsert = _.template(_.unescape($('#leave-review #medallion-template').html()));
                                    _.each(data.content.profiles, function(profile) {
                                        var elem, img;
                                        elem = $(rowToInsert(profile));
                                        img = elem.find('img');
                                        elem.find('img').attr('src', img.data().url);
                                        return $('#leave-review #review-medallions').append(elem)
                                    });
                                    $('#leave-review.modal .review-details').slideUp();
                                    $('#leave-review.modal .modal-footer').slideUp();
                                    $('#leave-review.modal #positive-review').slideDown()
                                } else {
                                    $('#leave-review.modal .review-details').slideUp();
                                    $('#leave-review.modal .modal-footer').slideUp();
                                    $('#leave-review.modal #review-signature').html(MDOCS.createReview.getDocName());
                                    $('#leave-review.modal #negative-review').slideDown()
                                }
                                ;$('#leave-review.modal .modal-footer .btn-cancel').show();
                                return $("#leave-review.modal .modal-footer .btn-submit-review").html('Submit').prop("disabled", false)
                            } else {
                                alert((data.content != null ) && data.content !== '' ? data.content : 'Sorry there was an error processing your request. Please try again.');
                                $('#leave-review.modal .modal-footer .btn-cancel').show();
                                return $("#leave-review.modal .modal-footer .btn-submit-review").html('Submit').prop("disabled", false)
                            }
                        },
                        error: function() {
                            alert('Sorry there was an error processing your request. Please try again.');
                            $('#leave-review.modal .modal-footer .btn-cancel').show();
                            return $("#leave-review.modal .modal-footer .btn-submit-review").html('Submit').prop("disabled", false)
                        }
                    })
                }
            })
        }
    }
}
).call(this);
;(function() {
    MDOCS.appointment = {
        url: "/widgets/appointment/get/",
        pulled: false,
        id: null ,
        setUp: function(id) {
            this.id = id;
            return this
        },
        pull: function(async) {
            if (async == null )
                async = true;
            if (!(this.id != null )) {
                alert('appointment id is missing');
                return
            }
            ;$.ajax({
                type: "POST",
                async: async,
                url: this.url + this.id,
                data: {
                    _token: MDOCS.csrf
                },
                success: function(data) {
                    if (data.status === 'success') {
                        _.each(data.content, function(value, key, object) {
                            return MDOCS.appointment[key] = value
                        });
                        MDOCS.appointment.pulled = true;
                        return MDOCS.appointment
                    } else {
                        alert((data.content != null ) && data.content !== '' ? data.content : 'Sorry there was an error retrieving the appointment. Please try again.');
                        return null
                    }
                },
                error: function() {
                    alert('Sorry there was an error retrieving the appointment. Please try again.');
                    return null
                }
            })
        },
        reset: function() {
            var pull, reset, setUp, url;
            pull = MDOCS.appointment.pull;
            reset = MDOCS.appointment.reset;
            setUp = MDOCS.appointment.setUp;
            url = MDOCS.appointment.url;
            MDOCS.appointment = {
                url: url,
                pulled: false,
                id: null ,
                pull: pull,
                reset: reset,
                setUp: setUp
            }
        }
    }
}
).call(this);
;(function() {
    var root;
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    if (typeof pop !== "undefined" && pop !== null )
        MDOCS.providers = {
            filterNewPatients: '',
            filterSpecialties: '',
            filterInsurance: '',
            filterGender: '',
            filterLangs: '',
            filterLocations: '',
            init: function() {
                return MDOCS.providers.turnOn()
            },
            turnOn: function() {
                $('.provider-list-filters select').on('change', MDOCS.providers.filter);
                $('.provider-list-filters input[type="checkbox"]').on('change', MDOCS.providers.filter)
            },
            turnOff: function() {
                $('.provider-list-filters select').off('change');
                $('.provider-list-filters input[type="checkbox"]').off('change')
            },
            filter: function() {
                var filterName, filterVal;
                filterName = $(this).attr('id');
                if (filterName === 'new_patients') {
                    filterVal = $(this).prop('checked') ? "1" : ""
                } else
                    filterVal = $(this).val();
                switch (filterName) {
                case 'new_patients':
                    MDOCS.providers.filterNewPatients = filterVal;
                    break;
                case 'specialties':
                    MDOCS.providers.filterSpecialties = filterVal;
                    break;
                case 'insurance':
                    MDOCS.providers.filterInsurance = filterVal;
                    break;
                case 'gender':
                    MDOCS.providers.filterGender = filterVal;
                    break;
                case 'languages':
                    MDOCS.providers.filterLangs = filterVal;
                    break;
                case 'locations':
                    MDOCS.providers.filterLocations = filterVal
                }
                ;MDOCS.providers.filterDoctors();
                return false
            },
            filterDoctors: function() {
                $('.provider-list-block').addClass('notfound');
                $('.provider-list-block').each(function() {
                    var found;
                    found = true;
                    if (MDOCS.providers.filterNewPatients !== '' && $(this).find('[data-newpatient="' + MDOCS.providers.filterNewPatients + '"]').length === 0)
                        found = false;
                    if (MDOCS.providers.filterSpecialties !== '' && $(this).find('[data-spec="' + MDOCS.providers.filterSpecialties + '"]').length === 0)
                        found = false;
                    if (MDOCS.providers.filterInsurance !== '' && $(this).find('[data-ins="' + MDOCS.providers.filterInsurance + '"]').length === 0)
                        found = false;
                    if (MDOCS.providers.filterGender !== '' && $(this).find('[data-gender="' + MDOCS.providers.filterGender + '"]').length === 0)
                        found = false;
                    if (MDOCS.providers.filterLangs !== '' && $(this).find('[data-lang="' + MDOCS.providers.filterLangs + '"]').length === 0)
                        found = false;
                    if (MDOCS.providers.filterLocations !== '' && $(this).find('[data-loc="' + MDOCS.providers.filterLocations + '"]').length === 0)
                        found = false;
                    if (found)
                        return $(this).removeClass('notfound')
                });
                $('.provider-list-block.notfound').hide('slow');
                $('.provider-list-block').not('.notfound').show('slow');
                if ($('.provider-list-block.notfound').length === $('.provider-list-block').length) {
                    return $('.provider-list-block-noresults').show('slow')
                } else
                    return $('.provider-list-block-noresults').hide()
            }
        }
}
).call(this);
;(function() {
    var root;
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    root.recaptchaCallback = function() {
        if ($('#recaptcha1').length)
            grecaptcha.render('recaptcha1', {
                sitekey: recaptcha_public_key
            });
        if ($('#recaptcha2').length)
            root.widgetIdRecaptcha = grecaptcha.render('recaptcha2', {
                sitekey: recaptcha_public_key
            })
    }
}
).call(this);
;
