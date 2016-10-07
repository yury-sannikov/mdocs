/*
 * 
 * v10 25/11/2013
 *
 * Dependencies: jQuery and jQuery-cookie [https://github.com/carhartl/jquery-cookie]
 *
 * Requirements
 * 1. Capture the referring traffic source using document.cookie
 * 2. Send the source to LocalPaient Server, with correct data
 *   http://localpatient.my-online-check.com/lp_campaigns_get_did/{{account_id}}/
 *   {{source_machine}}?keyword={{keyword}}&callback={{callback}}
 *   where account_id is the office account eg. 1001, source_machine is the matched
 *   keyword from URL
 * 3. Recieve response from server and show URL. If response from server takes too long, show default
 * 4. Write number to cookie, this number should be used if the user comes again.
 *
 * Currently the default number shows first and then the secondary number is updated when it is fetched.
 * This has been done as a design choice, can be switched otherwise.
 *
 * Usage:
 *   Set the default properties and initialize (on document.ready)
 *   $.localpatient('.element_class', {
 *     account_id: 1182, // account id of the user
 *     default_number : '17273246283', //default number if nothing matches
 *     isPremium: false, // if it should select the "enhanced tags" or not
 *     didPrintNumber: function(number) { console.log(number); }, //Assign a function to get a callback on number render
 *     formatter: function(number) { return '+' + number; } //Assign a function to format your ouput in a particular way.
 *   });
 */
;(function($) {
  $.localpatient = function(el, options) {

    var plugin = this;
    plugin.settings = {};

    plugin.defaults = {
      /* Constants */
      base_url: 'http://localpatient.my-online-check.com/lp_campaigns_get_did',
      cookie_key: function() {
        return this.account_id + '_lp_number';
      },
      /* Default Properties */
      default_number: '17273246283',
      account_id: '1139',
      referrer: document.referrer,
      formatter: null,
      didPrintNumber: null,
      isPremium: false,
    };

   /* Supported Tags */
    var patterns_normal = {
      'google.[a-z.]+/url' : 'google_organic',
      'google.[a-z.]+/aclk' : 'google_paid',
      'google.[a-z.]+/maps' : 'google_places',
      'existing' : 'ex_patient',
      'bing.com' : 'bing_organic',
      'yahoo.com' : 'yahoo_organic',
      'yelp.com' : 'yelp'
    };

    var patterns_enhanced = {
      'angieslist.com': 'angies_list',
      'facebook.com' : 'facebook',
      'http://www.t.co' : 'twitter',
      'http://t.co' : 'twitter',
      'youtube.com' : 'youtube'
    };

    /* Dynamic Properties */
    var keyword = function() {
      // parse this.referrer for query variable q
      var word = extract_query_param('q');
      if(word.length === 0) {
        // Extracting the utmctr from the cookie
        var utmz = $.cookie('__utmz');
        if(typeof utmz !== "undefined") {
          var splitUtmz = utmz.split('|');
          $.each(splitUtmz, function(index, val) {
            if(val.match(/utmctr/) !== null) {
              word = val.split('=')[1];
            }
          });
        }
      }
      return word;
    };

    var source_machine = function() {
      // if the referrer is empty, simply assume
      if(plugin.settings.referrer === "")
        return "direct_refer";

      // match against the list of patterns
      var match = null;
      $.each(patterns_normal, function(key, value) {
        if(plugin.settings.referrer.match(key) !== null) {
          match = value;
          return;
        }
      });

      if(match === null && plugin.settings.isPremium) {
        $.each(patterns_enhanced, function(key, value) {
          if(plugin.settings.referrer.match(key) !== null) {
            match = value;
            return;
          }
        });
      }

      return match;
    };

    /* Methods */
    var extract_query_param = function(name) {
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(plugin.settings.referrer);
      if(results === null)
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    var generate_url = function() {
      var url = plugin.settings.base_url + '/' +
                plugin.settings.account_id + '/' +
                source_machine() +
                '/?';

      var keyw = keyword();
      if(keyw !== null && keyw !== '')
        url +=  'keyword=' + keyw + '&';

      url += 'callback=?';

      return url;
    };

    var fetch_from_server = function() {
      
      $.getJSON(generate_url(), function(data) {
        /*
         * Expected response
         * cb({ "did": "17273246572", "source_id": "11", "source_name": "Angies list",
         * "source_machine_name": "angies_list", "account_id": "1182", "campaign_id":
         * "335", "keyword": "" });
         */

        // set the number and then the cookie
       
        if(data.did.length > 0) {
          print_number(data.did, true);
          $.cookie(plugin.settings.cookie_key(), data.did, { path: '/', expires: 14 });
        }
        else {
          print_number(plugin.settings.default_number, true);
        }
      });
    };

    var print_number = function(number, triggerCallback) {
      if(plugin.settings.formatter !== null)
        number = plugin.settings.formatter(number);
      $(plugin.el).html(number);
      if(plugin.settings.didPrintNumber !== null && triggerCallback) {
        plugin.settings.didPrintNumber(number);
      }
    };

    var init = function() {
      plugin.settings = $.extend({}, plugin.defaults, options);
      plugin.el = el;

      var stored_value = $.cookie(plugin.settings.cookie_key());
      if(typeof stored_value === "undefined" && source_machine() !== null) {
        // if no cookie, show default + fetch from server
        print_number(plugin.settings.default_number, false);
        fetch_from_server();
      } else if(typeof stored_value === "undefined") {
        // cookie isnt there, so show the default
        print_number(plugin.settings.default_number, true);
      } else {
        // else show number from cookie and trigger the callback
        print_number(stored_value, true);
      }
    };

    init();
  };
})(jQuery);

