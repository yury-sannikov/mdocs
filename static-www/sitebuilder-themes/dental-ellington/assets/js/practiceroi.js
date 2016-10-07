
var ipapp = function proiPhone(flarescript, phoneImageSource, imageflarePhone1, patientRoiAccount,defaultNumber) {
    var self = this;

    self.changePhone = function (number, phoneControlId) {
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            url: '/lssvc.asmx/flarephone',
            data: JSON.stringify({ script: this.fs, number: number, phimg: this.phimg }),
            success: function(msg) {
                $('#' + phoneControlId)[0].src = msg.hasOwnProperty("d") ? msg.d : msg;
                if ($('#' + phoneControlId).parents('a')[0].protocol == "tel:") {
                    $('#' + phoneControlId).parents('a')[0].href = ('tel:' + number);
                }
                    
                $('#phspan').show();
            },
            error: function (a) {
                $('#phspan').show();
            }
        });
    };
    

    self.fs = $('#' + flarescript)[0].value;
    self.phimg = $('#' + phoneImageSource)[0].value;
    self.account_id = patientRoiAccount;
    self.default_number = defaultNumber;

    self.formatter = function(text) {
        return text.substr(1, 3) + '-' + text.substr(4, 3) + '-' + text.substr(7, 4);
    };
    self.elevenDigitPhone = function() {
        if (self.default_number.length == 10) {
            return '1' + self.default_number;
        }
    };
    new jQuery.localpatient('.number', {
        account_id: self.account_id,
        default_number: self.elevenDigitPhone(),
        formatter: self.formatter,
        referrer: 'http://bing.com/?q=something',
        isPremium: true,
        didPrintNumber: function (number) {
                self.changePhone($('#fs')[0].innerHTML, imageflarePhone1);
        }

    });
}

var ipappText = function proiPhone(patientRoiAccount, defaultNumber) {
    var self = this;
    self.account_id = patientRoiAccount;
    self.default_number = defaultNumber;

    self.formatter = function (text) {
        return text.substr(1, 3) + '-' + text.substr(4, 3) + '-' + text.substr(7, 4);
    };
    self.elevenDigitPhone = function () {
        if (self.default_number.length == 10) {
            return '1' + self.default_number;
        }
    };
    new jQuery.localpatient('.number', {
        account_id: self.account_id,
        default_number: self.elevenDigitPhone(),
        formatter: self.formatter,
        referrer: 'http://bing.com/?q=something',
        isPremium: true,
        didPrintNumber: function (number) {

            //self.changePhone($('#fs')[0].innerHTML, imageflarePhone1);
        }

    });
}