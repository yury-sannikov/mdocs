(function(init) {
  init(window.jQuery, window, document);
}(function($, window, document) {
  $(function() {
    uiReset();
  });
  window.onresize = function() {
    uiReset();
  };
}));

var uiReset = function() {
    uiHelpers.uiHandleMain();
    uiHelpers.uiHandleHeader();
    uiHelpers.uiHandleScroll();
    uiHelpers.uiLoader();
    uiHelpers.uiBlocks();
}

var uiHelpers = {
  // Handles #main-container height resize to push footer to the bottom of the page
  uiHandleMain: function () {
      var lMain       = jQuery('#main-container');
      var hWindow     = jQuery(window).height();
      var hHeader     = jQuery('#header-navbar').outerHeight();
      var hFooter     = jQuery('#page-footer').outerHeight();

      if (jQuery('#page-container').hasClass('header-navbar-fixed')) {
          lMain.css('min-height', hWindow - hFooter);
      } else {
          lMain.css('min-height', hWindow - (hHeader + hFooter));
      }
  },
  // Handles transparent header functionality (solid on scroll - used in frontend pages)
  uiHandleHeader: function () {
      var lPage = jQuery('#page-container');

      if (lPage.hasClass('header-navbar-fixed') && lPage.hasClass('header-navbar-transparent')) {
          jQuery(window).on('scroll', function(){
              if (jQuery(this).scrollTop() > 20) {
                  lPage.addClass('header-navbar-scroll');
              } else {
                  lPage.removeClass('header-navbar-scroll');
              }
          });
      }
  },
  // Handles sidebar and side overlay custom scrolling functionality
  uiHandleScroll: function(mode) {
      var windowW            = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var lPage              = jQuery('#page-container');
      var lSidebar           = jQuery('#sidebar');
      var lSidebarScroll     = jQuery('#sidebar-scroll');
      var lSideOverlay       = jQuery('#side-overlay');
      var lSideOverlayScroll = jQuery('#side-overlay-scroll');

      // Init scrolling
      if (mode === 'init') {
          // Init scrolling only if required the first time
          uiHandleScroll();
      } else {
          // If screen width is greater than 991 pixels and .side-scroll is added to #page-container
          if (windowW > 991 && lPage.hasClass('side-scroll') && (lSidebar.length || lSideOverlay.length)) {
              // If sidebar exists
              if (lSidebar.length) {
                  // Turn sidebar's scroll lock off (slimScroll will take care of it)
                  jQuery(lSidebar).scrollLock('disable');

                  // If sidebar scrolling does not exist init it..
                  if (lSidebarScroll.length && (!lSidebarScroll.parent('.slimScrollDiv').length)) {
                      lSidebarScroll.slimScroll({
                          height: lSidebar.outerHeight(),
                          color: '#fff',
                          size: '5px',
                          opacity : .35,
                          wheelStep : 15,
                          distance : '2px',
                          railVisible: false,
                          railOpacity: 1
                      });
                  }
                  else { // ..else resize scrolling height
                      lSidebarScroll
                          .add(lSidebarScroll.parent())
                          .css('height', lSidebar.outerHeight());
                  }
              }

              // If side overlay exists
              if (lSideOverlay.length) {
                  // Turn side overlay's scroll lock off (slimScroll will take care of it)
                  jQuery(lSideOverlay).scrollLock('disable');

                  // If side overlay scrolling does not exist init it..
                  if (lSideOverlayScroll.length && (!lSideOverlayScroll.parent('.slimScrollDiv').length)) {
                      lSideOverlayScroll.slimScroll({
                          height: lSideOverlay.outerHeight(),
                          color: '#000',
                          size: '5px',
                          opacity : .35,
                          wheelStep : 15,
                          distance : '2px',
                          railVisible: false,
                          railOpacity: 1
                      });
                  }
                  else { // ..else resize scrolling height
                      lSideOverlayScroll
                          .add(lSideOverlayScroll.parent())
                          .css('height', lSideOverlay.outerHeight());
                  }
              }
          } else {
              // If sidebar exists
              if (lSidebar.length) {
                  // If sidebar scrolling exists destroy it..
                  if (lSidebarScroll.length && lSidebarScroll.parent('.slimScrollDiv').length) {
                      lSidebarScroll
                          .slimScroll({destroy: true});
                      lSidebarScroll
                          .attr('style', '');
                  }

                  // Turn sidebars's scroll lock on
                  jQuery(lSidebar).scrollLock();
              }

              // If side overlay exists
              if (lSideOverlay.length) {
                  // If side overlay scrolling exists destroy it..
                  if (lSideOverlayScroll.length && lSideOverlayScroll.parent('.slimScrollDiv').length) {
                      lSideOverlayScroll
                          .slimScroll({destroy: true});
                      lSideOverlayScroll
                          .attr('style', '');
                  }

                  // Turn side overlay's scroll lock on
                  jQuery(lSideOverlay).scrollLock();
              }
          }
      }
  },
  // Handles page loader functionality
  uiLoader: function (mode) {
      var lBody       = jQuery('body');
      var lpageLoader = jQuery('#page-loader');

      if (mode === 'show') {
          if (lpageLoader.length) {
              lpageLoader.fadeIn(250);
          } else {
              lBody.prepend('<div id="page-loader"></div>');
          }
      } else if (mode === 'hide') {
          if (lpageLoader.length) {
              lpageLoader.fadeOut(250);
          }
      }
  },
  // Handles blocks API functionality
  uiBlocks: function (block, mode, button) {
      // Set default icons for fullscreen and content toggle buttons
      var iconFullscreen         = 'si si-size-fullscreen';
      var iconFullscreenActive   = 'si si-size-actual';
      var iconContent            = 'si si-arrow-up';
      var iconContentActive      = 'si si-arrow-down';

      if (mode === 'init') {
          // Auto add the default toggle icons
          switch(button.data('action')) {
              case 'fullscreen_toggle':
                  button.html('<i class="' + (button.closest('.block').hasClass('block-opt-fullscreen') ? iconFullscreenActive : iconFullscreen) + '"></i>');
                  break;
              case 'content_toggle':
                  button.html('<i class="' + (button.closest('.block').hasClass('block-opt-hidden') ? iconContentActive : iconContent) + '"></i>');
                  break;
              default:
                  return false;
          }
      } else {
          // Get block element
          var elBlock = (block instanceof jQuery) ? block : jQuery(block);

          // If element exists, procceed with blocks functionality
          if (elBlock.length) {
              // Get block option buttons if exist (need them to update their icons)
              var btnFullscreen  = jQuery('[data-js-block-option][data-action="fullscreen_toggle"]', elBlock);
              var btnToggle      = jQuery('[data-js-block-option][data-action="content_toggle"]', elBlock);

              // Mode selection
              switch(mode) {
                  case 'fullscreen_toggle':
                      elBlock.toggleClass('block-opt-fullscreen');

                      // Enable/disable scroll lock to block
                      if (elBlock.hasClass('block-opt-fullscreen')) {
                          jQuery(elBlock).scrollLock();
                      } else {
                          jQuery(elBlock).scrollLock('disable');
                      }

                      // Update block option icon
                      if (btnFullscreen.length) {
                          if (elBlock.hasClass('block-opt-fullscreen')) {
                              jQuery('i', btnFullscreen)
                                  .removeClass(iconFullscreen)
                                  .addClass(iconFullscreenActive);
                          } else {
                              jQuery('i', btnFullscreen)
                                  .removeClass(iconFullscreenActive)
                                  .addClass(iconFullscreen);
                          }
                      }
                      break;
                  case 'fullscreen_on':
                      elBlock.addClass('block-opt-fullscreen');

                      // Enable scroll lock to block
                      jQuery(elBlock).scrollLock();

                      // Update block option icon
                      if (btnFullscreen.length) {
                          jQuery('i', btnFullscreen)
                              .removeClass(iconFullscreen)
                              .addClass(iconFullscreenActive);
                      }
                      break;
                  case 'fullscreen_off':
                      elBlock.removeClass('block-opt-fullscreen');

                      // Disable scroll lock to block
                      jQuery(elBlock).scrollLock('disable');

                      // Update block option icon
                      if (btnFullscreen.length) {
                          jQuery('i', btnFullscreen)
                              .removeClass(iconFullscreenActive)
                              .addClass(iconFullscreen);
                      }
                      break;
                  case 'content_toggle':
                      elBlock.toggleClass('block-opt-hidden');

                      // Update block option icon
                      if (btnToggle.length) {
                          if (elBlock.hasClass('block-opt-hidden')) {
                              jQuery('i', btnToggle)
                                  .removeClass(iconContent)
                                  .addClass(iconContentActive);
                          } else {
                              jQuery('i', btnToggle)
                                  .removeClass(iconContentActive)
                                  .addClass(iconContent);
                          }
                      }
                      break;
                  case 'content_hide':
                      elBlock.addClass('block-opt-hidden');

                      // Update block option icon
                      if (btnToggle.length) {
                          jQuery('i', btnToggle)
                              .removeClass(iconContent)
                              .addClass(iconContentActive);
                      }
                      break;
                  case 'content_show':
                      elBlock.removeClass('block-opt-hidden');

                      // Update block option icon
                      if (btnToggle.length) {
                          jQuery('i', btnToggle)
                              .removeClass(iconContentActive)
                              .addClass(iconContent);
                      }
                      break;
                  case 'refresh_toggle':
                      elBlock.toggleClass('block-opt-refresh');

                      // Return block to normal state if the demostration mode is on in the refresh option button - data-action-mode="demo"
                      if (jQuery('[data-js-block-option][data-action="refresh_toggle"][data-action-mode="demo"]', elBlock).length) {
                          setTimeout(function(){
                              elBlock.removeClass('block-opt-refresh');
                          }, 2000);
                      }
                      break;
                  case 'state_loading':
                      elBlock.addClass('block-opt-refresh');
                      break;
                  case 'state_normal':
                      elBlock.removeClass('block-opt-refresh');
                      break;
                  case 'close':
                      elBlock.hide();
                      break;
                  case 'open':
                      elBlock.show();
                      break;
                  default:
                      return false;
              }
          }
      }
  }
};
