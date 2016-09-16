/*
 * Revised: Dec 17, 2014
 *          Jan 12, 2015
 */

if (typeof(tsmb2b)=="undefined") tsmb2b = new Object();
if (typeof(tsmb2b._the_list)=="undefined") tsmb2b._the_list = new Object();
if (typeof(tsmb2b._the_list.fe)=="undefined") tsmb2b._the_list.fe = new Object();
if (typeof(tsmb2b._the_list.fe.sorteable)=="undefined") tsmb2b._the_list.fe.sorteable = new Object();

tsmb2b._the_list.fe.addNew = function(o) {
    var o = jQuery(o),
        slug = o.attr("data-slug"),
        code = o.attr("data-code");
    tsmb2b._the_list.fe.admin({
        "slug":slug,
        "module_col":0,
        "module_id":tsmb2b.UUID(),
        "module_page":b2b.post_id,
        "module_page_type":b2b.isFrontPage?"home":"",
        "module_code":code
    });
}

tsmb2b._the_list.fe.admin = function(args) {
    goTo = "plugins.php?page="+args.slug;
    goTo += "&module_col="+args.module_col+"&module_id="+args.module_id+"&module_page="+args.module_page+"&module_page_type="+args.module_page_type+"&module_code="+args.module_code;
    tsmb2b.page.set(goTo);
}

tsmb2b._the_list.fe.sorteable.done = function() {
    jQuery("#_the_list_wrapper ._the_list").each(function () {
        var e = jQuery(this)
            isMovable = e.hasClass("movable");
        if (isMovable) {
            // Restore its original width after moving
            e.attr("style","").removeClass("movable").find("._the_list_item.mod_1").each(function () {
                var o = jQuery(this),
                    margin = parseInt(o.css("margin-right"),10)+2;
                o.css("margin-right",margin);
            });
        }
    });
    tsmb2b._the_list.fe.sorteable.destroy();
}

tsmb2b._the_list.fe.sorteable.init = function() {
    jQuery("#_the_list_wrapper .connectedColumn").sortable({
        connectWith: ".connectedColumn",
        stop: function(event, ui) { tsmb2b._the_list.fe.sorteable.stop() },
        start: function(event, ui) { tsmb2b._the_list.fe.sorteable.start() }
    }).disableSelection();
    tsmb2b._the_list.fe.sorteable.active = true;
}

tsmb2b._the_list.fe.sorteable.destroy = function() {
    //jQuery("#_the_list_wrapper .connectedColumn").sortable("destroy");
}

tsmb2b._the_list.fe.sorteable.enable = function() {
    jQuery("#_the_list_wrapper .connectedColumn").sortable("enable");
}

tsmb2b._the_list.fe.sorteable.start = function() {

}

tsmb2b._the_list.fe.sorteable.stop = function() {

    var data = {"modules":{}};
    jQuery("#_the_list_wrapper .connectedColumn").each(function () {
        var column = jQuery(this),
            module_col = column.attr("id").replace("column","");
        column.find("._the_list").each(function () {
            var module = jQuery(this),
                module_id = module.attr("id").replace("_the_list_module_","");
            if (typeof(data.modules[module_col]) == "undefined") data.modules[module_col] = new Array();
            data.modules[module_col].push(module_id);
            module.attr("data-module_col",module_col);
        });
    });

    jQuery.post(b2b.admin_url+"admin-ajax.php", {
        action: "save_order",
        module_page: b2b.post_id,
        data: data
    }, function(retval) {

    });

}

tsmb2b._the_list.fe.after = function(columns, module_code) {
    if (module_code=="grid") {
        tsmb2b._the_list.fe.grid(columns, module_code);
    } else if (module_code=="team") {
        tsmb2b._the_list.fe.team(columns, module_code);
    } else if (module_code=="eflyer") {
        tsmb2b._the_list.fe.eflyer(columns, module_code);
    } else if (module_code=="events") {
        tsmb2b._the_list.fe.events(columns, module_code);
    } else if (module_code=="services") {
        tsmb2b._the_list.fe.services(columns, module_code);
    } else {
        tsmb2b._the_list.fe.menu(columns, module_code)
    }
}

tsmb2b._the_list.fe.menu = function(columns, module_code) {
    var isMobile = jQuery("body.isMobile").length == 0 ? false : true,
        columns = isMobile ? 1 : columns,
        content = jQuery("#content"),
        cnt = 1,
        vars = {};

    vars.module_code = module_code;
    vars.columns = columns;
    vars.pageWidth = content.width();
    vars.colGapWidth = 30;
    vars.innGapWidth = 20;
    vars.gapQty = columns - 1;
    vars.colWidth = parseInt((vars.pageWidth-(vars.gapQty*vars.colGapWidth)) / columns, 10);

    // Column Width based on column qty
    jQuery("#_the_list_wrapper .connectedColumn").each(function () {
        var ele = jQuery(this);
        marginRight = (cnt<columns)?vars.colGapWidth:0;
        ele.css({
            "width":vars.colWidth+"px",
            "margin-right":marginRight+"px",
            "padding-bottom":vars.colGapWidth+"px" 
        }).find("li").css({"margin-bottom":vars.colGapWidth+"px"});
        ++cnt;
    });

    // Image, Text Block and subheader width based on column with
    jQuery("#_the_list_wrapper .connectedColumn ._the_list").each(function () {
        var obj = jQuery(this);
        if (!isMobile) obj.parent().parent().addClass("page_cols_"+columns);
        tsmb2b._the_list.fe.menuModule(obj, vars)
    });

}

tsmb2b._the_list.fe.menuModule = function(module, vars) {
    var isMobile = jQuery("body.isMobile").length == 0 ? false : true,
        txtblqWidth = 0,
        imgWidth = 0,
        subheaderWidth = 0,
        isAlignRight = module.hasClass("items_align_right");

    module.find("._the_list_item_subheader").each(function () {
        var ele = jQuery(this),
            width = ele.width();
        if (width>subheaderWidth) subheaderWidth = width;
    });

    if (isMobile) subheaderWidth = 0;

    if (subheaderWidth!=0) {
        subheaderWidth += 5;
        module.find("._the_list_item_subheader").css({"width":subheaderWidth+"px"});
        module.find("._the_list_item_txtblq").css({"margin-right":vars.innGapWidth+"px"});
    }

    module.find("._the_list_item_image img").each(function () {
        if (jQuery(this).attr("data-src")!="") imgWidth = 1;
    });
    if (imgWidth!=0) {
        parts = (subheaderWidth!=0) ? 4 : 3;
        imgWidth = parseInt((vars.colWidth-vars.innGapWidth)/parts,10);
        imgWidth = (vars.columns == 2) ? 104 : ((vars.columns == 1) ? ((vars.module_code == "events") ? 104 : 300) : imgWidth);
        module.find("._the_list_item_image").css({"width":imgWidth+"px","margin-right":vars.innGapWidth+"px"}).find("img").attr("width",imgWidth+"px");
        module.find("._the_list_item_image img").each(function () {
            var img = jQuery(this);
            if (img.attr("data-src")=="") {
                img.parent().html("&nbsp;");
            } else {
                tsmb2b._the_list.imgSize(img, imgWidth, "menu");
            }
        });
    } else {
        module.remove("._the_list_item_image")
    }

    txtblqWidth = vars.colWidth - imgWidth - ((imgWidth==0)?0:vars.innGapWidth) - subheaderWidth - ((subheaderWidth==0)?0:vars.innGapWidth);
    module.find("._the_list_item_txtblq").css({"width":(txtblqWidth-2)+"px"});

    if (isAlignRight) {
        if (subheaderWidth==0) {
            module.find("._the_list_item_txtblq").css({"margin-left":"","margin-right":vars.innGapWidth+"px"});
        }
    }

    //console.log(module.html() + " -> " + vars.colWidth + ", " + imgWidth + ", " + subheaderWidth + " = " + txtblqWidth)
}

tsmb2b._the_list.fe.services = function(columns, module_code) {
    tsmb2b._the_list.fe.menu(columns, module_code);
}

tsmb2b._the_list.fe.grid = function(columns, module_code) {
    jQuery("#_the_list_global_grid .connectedColumn ._the_list").each(function () {
        tsmb2b._the_list.fe.gridItem(jQuery(this))
    });
}

tsmb2b._the_list.fe.gridItem = function(item, whatIsIt) {
    var isMobile = jQuery("body.isMobile").length == 0 ? false : true,
        whatIsIt = whatIsIt || "isGrid",
        content = jQuery("#content"),
        columns = isMobile ? 1 : parseInt(item.attr('data-itemcols'),10),
        txtblqWidth = 0,
        imgWidth = 0,
        rowWidth = 0,
        cnt = 1,
        vars = {};

    vars.pageWidth = content.width();
    vars.colGapWidth = 30;
    vars.gapQty = columns - 1;
    vars.colWidth = parseInt((vars.pageWidth-(vars.gapQty*vars.colGapWidth)) / columns, 10);

    imgWidth = columns<=2 ? 464 : (columns==3 ? 300 : (columns==4 ? 212 : vars.colWidth)) //(isMobile && whatIsIt=="isTeam") ? parseInt(vars.colWidth/2, 10) : vars.colWidth;
    imgWidth = isMobile ? 300 : imgWidth;

    item.addClass("_the_list_"+whatIsIt).find("._the_list_item").css({"width":vars.colWidth+"px"}).find("._the_list_item_image").css({"width":imgWidth+"px"}).find("img").each(function () {
        var img = jQuery(this);
        if (img.attr("data-src")=="") {
            img.parent().html("&nbsp;");
        } else {
            tsmb2b._the_list.imgSize(img, imgWidth, "grid");
        }
    });

    item.find("._the_list_item").each(function () {
        var item = jQuery(this),
            mod = cnt % columns,
            marginRight = (mod!=0)?vars.colGapWidth:0;
        item.addClass("mod_"+mod).css({"margin-right":marginRight+"px","margin-bottom":vars.colGapWidth+"px"});
        if (cnt <= columns) rowWidth += marginRight + vars.colWidth;
        ++cnt;
    });

    if (item.find("._the_list_item").length < columns) {
        item.wrap('<div style="margin:0 auto;width:'+rowWidth+'px" />').parent().parent().css("width",vars.pageWidth+"px");
    }
}

tsmb2b._the_list.fe.team = function(columns, module_code) {
    jQuery("#_the_list_global_team .connectedColumn ._the_list").each(function () {
        tsmb2b._the_list.fe.teamItem(jQuery(this))
    });
}

tsmb2b._the_list.fe.teamItem = function(item) {
    var isMobile = jQuery("body.isMobile").length == 0 ? false : true,
        content = jQuery("#content"),
        columns = isMobile ? 1 : parseInt(item.attr('data-itemcols'),10),
        txtblqWidth = 0,
        imgWidth = 0,
        numItems = item.find("._the_list_item").length,
        cnt = 1,
        vars = {};

    if (isMobile || columns!=2) {
        // Same format as Photo Grid
        tsmb2b._the_list.fe.gridItem(item, 'isTeam');
    } else {
        vars.pageWidth = content.width();
        vars.colGapWidth = 30;
        vars.gapQty = columns - 1;
        vars.colWidth = (numItems==1) ? vars.pageWidth : parseInt((vars.pageWidth-(vars.gapQty*vars.colGapWidth)) / columns, 10);

        item.find("._the_list_item").each(function () {
            var item = jQuery(this),
                mod = cnt % columns
                marginRight = (mod!=0 && numItems!=1) ? vars.colGapWidth : 0,
                intPadding = parseInt(vars.colGapWidth / 2,10),
                imgWidth = parseInt(vars.colWidth * ((numItems==1) ? 0.25 : 0.413), 10),
                imgWidth = (columns == 2) ? 192 : imgWidth;
                txtblqWidth = vars.colWidth - intPadding - imgWidth;

            item.append("<div style='clear:both'></div>").addClass("mod_"+mod).css({"width":vars.colWidth+"px","margin-right":marginRight+"px","margin-bottom":vars.colGapWidth+"px"});
            item.find("._the_list_item_txtblq").css({"width":txtblqWidth+"px"})
            item.find("._the_list_item_image").css({"width":imgWidth+"px","margin-right":intPadding+"px"}).find("img").each(function () {
                var img = jQuery(this);
                if (img.attr("data-src")=="") {
                    img.parent().html("&nbsp;");
                } else {
                    tsmb2b._the_list.imgSize(img, imgWidth, "team");
                }
            });

            ++cnt;
        });
    }
}

tsmb2b._the_list.fe.eflyer = function(columns, module_code) {
    jQuery("#_the_list_global_eflyer .connectedColumn ._the_list").each(function () {
        tsmb2b._the_list.fe.gridItem(jQuery(this), 'isFlyer');
    });
}

tsmb2b._the_list.fe.events = function(columns, module_code) {
    tsmb2b._the_list.fe.menu(columns, module_code);
    jQuery("#_the_list_global_events ._the_list_item").css("margin-bottom","30px");
}

tsmb2b._the_list.imgSize = function(img, imgWidth, code) {
	if( jQuery.sonar !== undefined ){	//rishi - check if the lazy load JS file is present. in case it fails to load, the images will load normal, without the laziness.
		var sonarClass = img.parents( '._the_feature_item' ).length?'._the_feature_item':'._the_list_item';
		img.parents( sonarClass ).bind( 'scrollin._b2b_the_list', function(){	//rishi - add a scroll in event here. this event gets triggered when the elements come on screen. we bind the event to the item instead of image, because image is display:none
			var $elem = jQuery(this),
				img = $elem.find( 'img' );

			$elem.unbind( 'scrollin._b2b_the_list' );		//rishi - unbind the scrollin event to prevent refiring. 
			tsmb2b._the_list.imgSize_Intermediate( img, imgWidth, code );
		});
	}
	else{	//rishi - simply load the images if lazy load file is not present.
		tsmb2b._the_list.imgSize_Intermediate( img, imgWidth, code );
	}
}

tsmb2b._the_list.imgSize_Intermediate = function(img, imgWidth, code){	//rishi - moved the imgSize to imgSize_Intermediate
	img.attr({
        "width":imgWidth+"px",
        "data-code":code
    }).load(function() {
    	var img = jQuery(this),
    		badge = img.parents( '._the_feature_item_image' ).find( '.b2b-badge' );
    	
    		tsmb2b._the_list.imgSizeCalculate( img );
    		img.unbind( 'load' ).fadeIn( 200 );
    		badge.fadeIn( 200 );
    }).attr( 'src', img.attr( 'data-src' ) );
}

tsmb2b._the_list.imgSizeCalculate = function(img) {
	
	var imgSrc = img.attr( 'src' ),
		imgWidth = parseInt(img.attr("width"),10),
        code = img.attr("data-code"),
        imgsize = img.hasClass("imgsize_scale") ? "scale" : (img.hasClass("imgsize_trim") ? "trim" : "original"),

        ratio_4_3 = function() { return Math.round(imgWidth * 0.75); }, // 300 x 226 - 122 x 92
        sizeV = function() { return Math.round(imgWidth * 1.5); },      // 300 x 450
        sizeF = function() { return Math.round(imgWidth * 1.06); },     // 300 x 318
        sizeS = function() { return Math.round(imgWidth * 1.153); },    // 190 x 219

        maxW = imgWidth,
        maxH = ratio_4_3(), //code=="team" ? sizeS() : ratio_4_3(); //(code=="menu"||code=="events") ? ratio_4_3() : ((code=="team") ? sizeS() : sizeF());
        css = {};
        
    if (imgsize=="scale") {
        /*
         * SCALE TO FIT
         */
        imgWidth = 0;
        imgHeight = 0;
        maxH = maxW;

        img.parents("._the_list_item_image, ._the_feature_item_image").css({
            "width":maxW+"px",
            "height":maxH+"px"
        });

        if (img.height() > img.width()) {
            imgHeight = maxH; // Vertical
            imgWidth = Math.round(img.width() * (maxH / img.height()));
        } else {
            imgWidth = maxW; // Horizontal
        }


    } else if (imgsize=="trim") {
        /*
         * TRIM & CROP
         */
        img.parents("._the_list_item_image, ._the_feature_item_image").css({
            "width":maxW+"px",
            "height":maxH+"px",
            "overflow":"hidden"
        });

        //imgHeight = img.height() > maxH ? maxH : 0;
        imgHeight = maxH;


    } else {
        /*
         * ORIGINAL
         */
        imgHeight = 0; // Ignore


    }
    css = {};
    if (imgWidth!=0) { img.attr("width",imgWidth+"px"); css.width = imgWidth; }
    if (imgHeight!=0) { img.attr("height",imgHeight+"px"); css.height = imgHeight; }
    //img.attr("src",(img.attr("src")+"?"+((imgWidth!=0)?"&w="+imgWidth:"")+(imgHeight!=0?"&h="+imgHeight:"")).replace("?&","?"));
    if( imgWidth > 464 ){
    	imgSrc = imgSrc.split( '?' )[0];
    	img.attr( 'src', imgSrc + '?w=' + imgWidth );
    }
    //img.removeClass( 'list-lazy-load' ).attr("src",(imgSrc+"?"+((imgWidth!=0)?"&w="+imgWidth:"")+(imgHeight!=0?"&h="+imgHeight:"")).replace("?&","?"));
    img.css( css );
}