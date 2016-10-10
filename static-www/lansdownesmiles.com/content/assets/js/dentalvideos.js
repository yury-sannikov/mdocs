var language = "ENGLISH";
var xmldata;

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function loadVideo() {

}

function loadXML(xml) {
    xmldata = xml;
    showCategories();
}

function contactUs() {
    pausevid("form");
    $("#contactus").toggleClass('hide');
    $('.iframevid').toggle('hide');

}

function emailFriend() {
    pausevid("form");
    $("#emailus").toggleClass('hide');
    $('.iframevid').toggle('hide');

}

function thxToggle() {
    // pausevid("form");
    $("#thankyou").toggleClass('hide');
    $('.iframevid').toggle('hide');

}

function showCategories() {
    $("#pager").hide();
    $("#Categories").html("");
    $("#vids").html("");
    var ic = 0;
    var bg = $(xmldata).find("settings").attr("preview_image_url");
    $("#vidplay").css("display", "block");
    $("#vidplay").attr("poster", bg);
    $("#vidplay").load();
    //  alert(xmldata);
    $(xmldata).find("sections").find(language).find("section").each(function () {
        if (ic == 0) {
            $("#vids").html("");
            $("#pager").hide();
            var i = 0;
            $(xmldata).find("section[ name = '" + $(this).attr("name") + "' ]").each(function () {
                $(this).find("button").each(function () {
                    i++;
                    $("#vids").append('<div class="vid"><a onclick="playVideo(\'' + $(this).attr("file") + '\')"><img class="vidthumb" src="http://content.prosites.com/images/mediamed/thumbs/' + $(this).attr("thumb") + '"><div class="label">' + $(this).attr("name") + "</div></a>");

                });
                if (i > 4) {
                    $("#pager").show();
                }
            });
        }
        $output = "<li class=\"category\" onmouseover=\"this.setAttribute('class','category hilight')\" onmouseout=\"this.setAttribute('class','category')\" onclick=\"showCatVidsDiv(\'" + $(this).attr("name") + "\')\"><a onclick=\"showCatVids(this)\">" + $(this).attr("name") + "</a></li>";
        $("#Categories").append($output);
        ic++;
    });
}

function showCatVids(category) {
    backPage();
    $categ = category.innerHTML;
    $("#vids").html("");
    $("#pager").hide();
    var i = 0;
    $(xmldata).find("section[ name = '" + $categ + "' ]").each(function () {
        $(this).find("button").each(function () {
            i++;
            $("#vids").append('<div class="vid" onclick="playVideo(\'' + $(this).attr("file") + '\')"><a><img  src="http://content.prosites.com/images/mediamed/thumbs/' + $(this).attr("thumb") + '"><div class="label">' + $(this).attr("name") + "</div></a>");

        });
        if (i > 4) {
            $("#pager").show();
        }
    });
}

function showCatVidsDiv(category) {
    backPage();
    $categ = category;
    $("#vids").html("");
    $("#pager").hide();
    var i = 0;
    $(xmldata).find("section[ name = '" + $categ + "' ]").each(function () {
        $(this).find("button").each(function () {
            i++;
            $("#vids").append('<div class="vid" onclick="playVideo(\'' + $(this).attr("file") + '\')"><a><img src="http://content.prosites.com/images/mediamed/thumbs/' + $(this).attr("thumb") + '">' +
                '<div class="label">' + $(this).attr("name") + "</div></a>");

        });
        if (i > 4) {
            $("#pager").show();
        }
    });
}

function playVideo(a) {
    var lang = "";
    if (language == "ENGLISH") {
        lang = "";
    } else {
        lang = language.substr(0, 1) + language.substr(1).toLowerCase() + "_";
        a = a.replace("French_", "");
        a = a.replace("Spanish_", "");
    }
    var mvid = "http://video.prosites.com/vod/mediamed/" + lang + a.toUpperCase();

    if ($(".thankyou").is(":visible")) {
        $(".thankyou").toggleClass("hide");
    }

    if ($(".emuform,.playerform").is(":visible")) {
        $(".emuform").is(":visible") ? $(".emuform").toggleClass("hide") : $(".playerform");
        $(".playerform").is(":visible") ? $(".playerform").toggleClass("hide") : $(".emuform");
    }

    $("#vidplay").css("display", "block");
    $("#vidplay").attr("src", mvid);

    var video = document.getElementById("vidplay");
    if (video.hasAttribute('controls')) {
        //  video.removeAttribute("controls")
    } else {
        video.setAttribute("controls", "controls")
    }
    $('#vidwrap, #overlay').hover(function () {

        $('#overlay').show();

    }, function () {
        $('#overlay').hide();
    })

    video.load();
}

function shareVideo() {

    Page_ClientValidate();
    //if (Page_IsValid) {

    var videourl = $('#vidplay').attr('src').replace('http://video.prosites.com/vod/mediamed/', '').replace('MP4', 'mp4');

    var videotitle = $(xmldata).find("button[ file='" + videourl + "' ]").attr('name');


    var cnt = {
        Name: $('#em_name').val(),
        yourEmail: $('#em_email').val(),
        friendName: $('#em_fname').val(),
        friendEmail: $('#em_femail').val(),
        Message: $('#em_msg').val(),
        videopage: 'http://' + window.location.host + window.location.pathname,
        videourl: videourl,
        videotitle: videotitle
    };

    $.ajax({
        type: 'POST',
        url: '/lsSvc.asmx/ShareDentalVideo',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',


        data: JSON.stringify({ 'message': cnt }),
        success: function (msg) {
            // Replace the div's content with the page method's return.


            $(".emuform").is(":visible") ? $(".emuform").toggleClass("hide") : $(".playerform");
            $(".playerform").is(":visible") ? $(".playerform").toggleClass("hide") : $(".emuform");

            $(".thankyou").toggleClass("hide");

        },
        fail: function (jqXHR, textStatus) {



        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }

    });
    //    }
}

function submitForm() {

    Page_ClientValidate();
    if (Page_IsValid) {

        var cnt = {
            Name: $('#cu_name').val(),
            Phone: $('#cu_phone').val(),
            Email: $('.cu_email').val(),
            Message: $('#cu_msg').val()
        };
        $.ajax({
            type: 'POST',
            url: '/lsSvc.asmx/AddDVEmail',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',


            data: JSON.stringify({ 'message': cnt }),
            success: function (msg) {
                // Replace the div's content with the page method's return.


                $(".emuform").is(":visible") ? $(".emuform").toggleClass("hide") : $(".playerform");
                $(".playerform").is(":visible") ? $(".playerform").toggleClass("hide") : $(".emuform");

                $(".thankyou").toggleClass("hide");

            },
            fail: function (jqXHR, textStatus) {



            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

            }

        });
    }
}


function pausevid(form) {
    var vid = $('.iframevid').get(0);
    if (vid.paused) {
        if (form != "form") {
            $('#playtxt').text('Pause');
            $('.fa.fa-play').addClass('fa-pause').removeClass('fa-play');
            vid.play();
        }

    }
    else {
        $('#playtxt').text('Resume');
        $('.fa.fa-pause').addClass('fa-play').removeClass('fa-pause');
        vid.pause();
    }
    //   vid.paused ? vid.pause() : vid.play();
}

function nextPage() {
    $("#vidhtml5thumbs").scrollTop(215);
    $("#pager").text('<BACK');
    $("#pager").unbind();
    $("#pager").click(function () {
        backPage();
    });
}

function backPage() {
    $("#vidhtml5thumbs").scrollTop(0);
    $("#pager").text('MORE>');
    $("#pager").unbind();
    $("#pager").click(function () {
        nextPage();
    });
}

$('#lngsel').change(function () {
    language = $('#lngsel').val();
    showCategories();
});
