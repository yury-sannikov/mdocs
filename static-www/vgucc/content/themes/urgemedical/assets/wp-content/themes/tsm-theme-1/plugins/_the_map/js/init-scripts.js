var mapImg = {
		infoBoxClose:'/wp-content/themes/tsm-theme-1/plugins/_the_map/img/map-close-button.png',
		toolTipArrow:'/wp-content/themes/tsm-theme-1/plugins/_the_map/img/map-tooltip-arrow.png'	
	},
	smallPluginOptions = {
		showInfoWindow:1, 
		img:mapImg
	},
	smallMapMobileOptions = {
		draggable:false,
		panControl:true
	};
if( jQuery('.b2b-location.small').hasClass( 'mobile' ) ){
	smallPluginOptions.mapOptions = smallMapMobileOptions;
}

jQuery('.b2b-location.wide').googleMapsPlugin({img:mapImg});
jQuery('.b2b-location.medium').googleMapsPlugin({img:mapImg});
jQuery('.b2b-location.small').googleMapsPlugin( smallPluginOptions );