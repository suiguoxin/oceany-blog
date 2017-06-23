(function ($) {

    $.fn.backToTop = function (parent) {
        //button back to top
        let $btt = this;
        parent.scroll(function () {
            if ($(this).scrollTop() > 50) {
                $btt.fadeIn();
            } else {
                $btt.fadeOut();
            }
        });
        // scroll body to 0px on click
        $btt.click(function () {
            $(this).tooltip('hide');
            parent.animate({
                scrollTop: 0
            }, 500);
            return false;
        });

        $btt.tooltip('show');
    };

}(jQuery));