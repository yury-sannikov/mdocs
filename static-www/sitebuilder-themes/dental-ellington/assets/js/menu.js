$(document).ready(
    function () {

    if ((navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {

        $('#nav a').click(function (event) {

            var $btn = $(this);
            var $img = $(this).find('img');
            if ($img.attr('hassubmenu') !== undefined) {
                var count = ($btn.data('click_count') || 0) + 1;
                $btn.data('click_count', count);
                if (count == 1)
                    event.preventDefault();
            }

        });
        $(document).on('mousedown touchstart', '[id*=mmlink]', function (e) {

            var $btn = $(this);
            var href = $btn.attr('href');
            var $btn2 = $(this).prev().find('a[href*=""' + href + '""]');
            var $tbl = $btn2.parent();
            //tbl id 'itd' == hassubmenu
            if ($tbl.attr('id').indexOf('sim') !== -1) {

                var count = ($btn.data('click_count') || 0) + 1;
                $btn.data('click_count', count);
                if (count == 1) {
                    $btn.click(function (v) {
                        v.stopImmediatePropagation();
                        return false;
                    });

                }
                else {
                    document.location.href = href;
                }
            }
        });
    }
});