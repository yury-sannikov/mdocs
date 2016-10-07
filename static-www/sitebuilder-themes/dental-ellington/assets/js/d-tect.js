//var d_tect = (function () {
//    var d_d = new Date();
//    var d_n = d_d.getTime();
//    var d_s = d_n;
//    var d_p = 0;
//    var d_i = 7000;
//    var d_t = 0;
//    return function () {
//        var d_d2 = new Date();
//        var d_c = 0;
//        d_c = d_d2.getTime();
//        var t = (d_c - d_s) > d_i;
//        if (t) {
//            d_t = 1;
//        }
//        return d_t;
//    }
//})();
// function OnCaptchaValidate() {
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchaPanel']").find("[id$='invalidCaptcha']")[0].style.display = 'none';
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchCtrl']").find("[id$='btnSend']")[0].disabled = true;
//    }

//    function OnCaptchaCorrect() {
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchaPanel']").find("[id$='invalidCaptcha']")[0].style.display = 'none';
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchCtrl']").find("[id$='btnSend']")[0].disabled = false;
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchCtrl']").find("[id$='btnSend']")[0].click();
//    }

//    function OnCaptchaIncorrect() {
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchaPanel']").find("[id$='invalidCaptcha']")[0].style.display = 'none';
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchCtrl']").find("[id$='btnSend']")[0].disabled = false;
//    }
            
//    function OnAjaxError() {
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchCtrl']").find("[id$='btnSend']")[0].disabled = false;
//        $('#' + $(this)[0].Id + "_CaptchaDiv").closest("[id$='captchCtrl']").find("[id$='btnSend']")[0].click();
//    }
//    function handleHtml(data, status) {
//        var res = data.d;
//        return res;
//    }
//    function ajaxFailed(xmlRequest) {
//        alert(xmlRequest.status + ' \n\r ' +
//              xmlRequest.statusText + '\n\r' +
//              xmlRequest.responseText);
//    }
//    function getValCapRes(valData) {
//        var xyz = null

//         $.ajax({
//            type: "POST",
//            url: "/LsCaptcha.asmx/Validate",
//            async: false,
//            cache: false,
//            contentType: "application/json; charset=utf-8",
//            data: JSON.stringify(valData),
//            dataType: "json",
//            success: function (data) { xyz = handleHtml(data) },
//            error: ajaxFailed     
//        });
//         return xyz;

        
        
//    }

//$(function () {
//    $("#btnSend").click(function () {
//        if (!d_tect()) {
//            alert('Unable to submit the form, please try again');
//            return false;
//        }
//        else {
//            var valData = {
//                valcap : $(this).closest("#captchCtrl").find("input[id*='ValCap']").val(),
//                value: $(this).closest("#captchCtrl").find("input[id*='txtSecurityCode']").val()
//            }
//            var res = getValCapRes(valData);
//            $(this).closest("#captchCtrl").find("[id*='invalidCaptcha']").css("display", res ? "none" : "block");
            
//            return res;
//        }
//    });
//});
