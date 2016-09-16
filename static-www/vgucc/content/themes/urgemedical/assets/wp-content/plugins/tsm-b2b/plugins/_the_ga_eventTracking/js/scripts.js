(function($){
	window.b2b = window.b2b || {};
	window.b2b.GA = window.b2b.GA || {};
	window._gaq = window._gaq || [];
	
	var cat = 'B2BTrackingEvent',
		body = $( 'body' ),
		//callusMenu = $( '#mobile-callus-sub-menu' ).length?$( '#mobile-callus-sub-menu' ):$( '#btn_call' ),
		directionsMenu = $( '#mobile-address-sub-menu' ).length?$( '#mobile-address-sub-menu' ):$( '#btn_directions' ),
		accounts = window.b2b.GA.accounts,
		
		sendGATrackEvent = function( cat, action, label ){
			if( typeof accounts !== 'undefined' ){
				for( var i = 0; i < accounts.length; i++ ){
					if( window.location.search.search( 'gaqa' ) > -1 ){
						try{
							console.log( 
								[ '_setAccount', accounts[ i ] ], 
								[ '_trackEvent', cat, action, label ]
							);
						}catch(e){}
					}else{
						_gaq.push(
							[ '_setAccount', accounts[ i ] ],
							[ '_trackEvent', cat, action, label ]
						);
					}
				}
			}
		};
	
	body.on( 'click', 'a[href*="tel:"]', function(e){
		e.preventDefault();
		var self = this,
			item = $(this),
			action = 'call-click',
			label = this.href.replace( 'tel:', '' );
		sendGATrackEvent( cat, action, label );
		setTimeout(function(){
			document.location = self.href;
		}, 100 );
	}).on( 'click', '.tsi-address a', function(e){
		e.preventDefault();
		var self = this,
			item = $(this),
			action = 'directions-click',
			label = this.href.replace( 'http://maps.google.com/maps?daddr=', '' );
		sendGATrackEvent( cat, action, label );
		setTimeout(function(){
			document.location = self.href;
		}, 100 );
	});
	directionsMenu.on( 'click', 'a', function(e){
		e.preventDefault();
		var self = this,
			item = $(this),
			action = 'directions-click',
			label = this.href.replace( 'http://maps.google.com/maps?daddr=', '' );
		sendGATrackEvent( cat, action, label );
		setTimeout(function(){
			document.location = self.href;
		}, 100 );
	});
})( jQuery );