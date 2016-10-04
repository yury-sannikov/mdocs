
if(typeof(_the_theme.menu) == "undefined") _the_theme.menu = new Object();

jQuery(function() {
    _the_theme.menus();
});

_the_theme.menu = function() {
    var menu = jQuery(".menu"),
    	mapMenu = jQuery( ".map-menu" );
    
    //rishi - change code to animation on 9th may 2012
    mapMenu.slideUp( 100 );
    if( menu.is( ':visible' ) ){
    	menu.stop( true, true ).slideUp( 100 );
    }else{
    	menu.stop( true, true ).slideDown( 300, 'easeOutExpo' );
    }
}

_the_theme.navigation = function() {
    setTimeout("_the_theme.menus()",1000);
}

_the_theme.menuSlug = "primary-menu";

_the_theme.moreTabHtml = '<span class="more-menu-arrow"> &rsaquo;</span>';

_the_theme.menus = function(times) {

    jQuery("#access .menu").attr("id","_the_navigation");

    if (jQuery("#left_column").length==1 || jQuery("body.beacon .admin_bar_b2b").length==1) {
        jQuery("#access .menu").addClass("_is_plugin").attr("slug","_the_navigation");
        if (jQuery("#left_column").length==1) return;
    }

    var times = times || 0,
        menuObj = jQuery("#menu-"+_the_theme.menuSlug);

    menuObj.find(".menu-item").first().show();

    var ah = jQuery("#_the_navigation").height(), // jQuery("#access").height(),
        moreTab = false,
        prev = null;

    menuObj.find(".menu-item").each(function () {
        var item = jQuery(this);
        if (item.parent().attr("id") == "menu-"+_the_theme.menuSlug) {
            if (!moreTab) {
                item.show();
                nh = menuObj.height();
                if (ah < nh) {
                    jQuery(item).attr("style","").addClass("moreMenu-item");
                    jQuery(prev).attr("style","").addClass("moreMenu-item");
                    moreTab = true;
                }
                prev = item;
            } else {
                item.addClass("moreMenu-item");
            }
            if (item.find(".sub-menu:first").length==1) {
                var tabLnk = item.find("a:first");
                tabLnk.find(".more-menu-arrow").remove();
                tabLnk.append(_the_theme.moreTabHtml);
            }
        }
    });

    menuObj.find("ul a").addClass("bgcolor_theme");

    if (menuObj.height() > ah && times == 0) {
        menuObj.find("li").hide();
        _the_theme.menus(++times);
    }

    menuObj.find("li").show();

    if (jQuery("#access.original_access").length==1) {
        _the_theme.menu.start();
    }

    if (typeof(_the_theme.menus.customEnd)!="undefined") _the_theme.menus.customEnd();
    if (typeof(_the_theme.afterMenu)!="undefined") _the_theme.afterMenu();

}

_the_theme.menuColorOver = function(color) {
    jQuery(".menu-item a").mouseover(function(){
        if (!jQuery(this).parent().hasClass("current_page_item")) jQuery(this).attr("style","color:"+color+" !important");
    }).mouseout(function(){
        jQuery(this).attr("style","");
    });
}

_the_theme.menu.start = function() {
    jQuery(".sf-menu ul").attr("style","visibility:hidden;display:none;");
    jQuery(".sf-menu li").mouseover(function(){
        _the_theme.menu.hide();
        _the_theme.menu.show(jQuery(this));
    }).mouseout(function(){

    });
}

_the_theme.menu.hide = function(tab) {
    jQuery("#menu-holder").remove();
}

_the_theme.menu.show = function(e) {
    var tab = e.clone();
        menu = tab.find("ul:first"),
        cols = tab.find("ul").length;
    if (cols!=0) {
        _the_theme.menu.addHolder(tab, e);
        _the_theme.menu.open(menu, tab.attr("id"), 2);
        _the_theme.menu.addArrows();
        _the_theme.menu.hideElements();
        _the_theme.menu.fixColumns();
        _the_theme.menu.makeCollapse();
    }
}

_the_theme.menu.makeCollapse = function() {
    jQuery("#menu-holder").find("div.menu-link").mouseover(function(){
        var li = jQuery(this).parent(),
            menu_id = li.attr("id") ? li.attr("id").replace("menu-item-","") : 0,
            inner_menu = jQuery("#menu-holder #menu-"+menu_id);
        if (inner_menu.length==1) {
            var column = parseInt(li.parent().attr("data-column"),10)+1,
                level = parseInt(li.parent().attr("data-level"),10),
                mod = level%2;
            if (mod==0) {
                for (c=column;c<=10;++c) jQuery("#column-"+c+" .inner-menu").hide();
            }
            inner_menu.show().find(".inner-menu").show();
        }
    })
}

_the_theme.menu.fixColumns = function() {
    var holder = jQuery("#menu-holder"),
        h=0,w=0;
    holder.find(".menu-column").each(function(){
        // jQuery(this).css("width",jQuery(this).width()+"px");
    });
    holder.find(".inner-menu").each(function(){
        var height = jQuery(this).height();
        if (height > h) h = height;
    });
    for (c=2;c<=10;++c) jQuery("#column-"+c+" .inner-menu").hide();
    // holder.find(".menu-column").css("min-height",h+"px");
    _the_theme.menu.fixHolder();
}

_the_theme.menu.fixHolder = function() {
    var holder = jQuery("#menu-holder"),
        getHolderWidth = function() {
            hw = 0;
            holder.find(".menu-column").each(function(){ 
                hw += jQuery(this).width() + 1;
            })
            return hw;
        }
        ww = jQuery(window).width(),
        hw = getHolderWidth(),
        offset = holder.offset(),
        pos = offset.left+hw;
        bgColor = jQuery("#menu-holder-topBorder").css("background-color");

    if (pos >= ww) {
        holder.css("left",(ww-hw>=0?ww-hw:0)+"px");
    }
    if (bgColor == "rgb(255, 255, 255)") {
        jQuery("#menu-holder-topBorder").removeClass("activetab_bg").addClass("navigation_bg");
    }
}

_the_theme.menu.addArrows = function() {
    var holder = jQuery("#menu-holder");
    holder.find(".sub-menu").remove();
    holder.find("a").wrap("<div class='menu-link'>");
    holder.find(".inner-menu").each(function(){
        var menu_id = jQuery(this).attr("id").replace("menu","menu-item"),
            menu_item = holder.find("#"+menu_id),
            level = parseInt(menu_item.parent().attr("data-level"),10),
            mod = level%2;
        if (mod==0 && menu_item.find("a:first .more-menu-arrow").length==0) {
            var tabLnk = menu_item.find("a:first");
            tabLnk.find(".more-menu-arrow").remove();
			tabLnk.addClass("more-menu");
        }
    });
}

_the_theme.menu.hideElements = function() {
    var holder = jQuery("#menu-holder");
    holder.find("div.menu-link a").each(function(){
        if (jQuery(this).text()=="Order Status") jQuery(this).remove();
    });
}

_the_theme.menu.addHolder = function(tab, e) {
    var holder = jQuery("<div id='menu-holder'><div id='menu-holder-topBorder' class='activetab_bg'></div></div>"),
        nav = jQuery("#_the_navigation"),
        tab_pos = e.offset(),
        top = tab_pos.top + e.height() + parseInt(e.find("a").css("padding-bottom"),10) + parseInt(e.find("a").css("margin-bottom"),10),
        left = tab_pos.left;

    holder.mouseover(function(){
        jQuery(this).show();
    }).mouseout(function(){
        jQuery(this).hide();
    }).css({
        top:top,left:left
    });

    jQuery("body").append(holder);
}

_the_theme.menu.addColumn = function(holder, column) {
    if (holder.find("#column-"+column).length==0) {
        holder.append("<div id='column-"+column+"' class='menu-column'></div>");
    }
}

_the_theme.menu.addMenu = function(holder, column, level, menu_id) {
    if (holder.find("#menu-"+menu_id).length==0) {
        var mod = level%2,
            menu = "<ul id='menu-"+menu_id+"' class='inner-menu column-"+column+" level-"+level+"' data-column='"+column+"' data-level='"+level+"'></ul>";
        if (level==2 || mod==1) {
            jQuery("#column-"+column).append(menu);
        } else {
            jQuery("#menu-holder #menu-item-"+menu_id).append(menu);
        }
    }
}

_the_theme.menu.open = function(menu, menu_id, level) {
    var holder = jQuery("#menu-holder"),
        menu_id = menu_id.replace("menu-item-",""),
        children = menu.children("li"),
        qty = children.length, cnt = 1,
        column = (level<=2 ? 1 : (level<=4 ? 2 : (level<=6 ? 3 : (level<=8 ? 4 : 5))));

    _the_theme.menu.addColumn(holder, column);
    _the_theme.menu.addMenu(holder, column, level, menu_id);

    children.each(function() {
        var li = jQuery(this),
            ul = holder.find("#menu-"+menu_id),
            child = li.find("ul:first");

        li.find("a:first").addClass("level-"+level);
        if (cnt==1) li.addClass("first");
        if (cnt==qty) li.addClass("last");
        ul.append(li);

        if (child.length!=0) {
            _the_theme.menu.open(child, li.attr("id"), level+1);
        }

        ++cnt;
    })
}

