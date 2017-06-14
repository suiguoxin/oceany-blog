(function ($) {
    $(document).ajaxStart(function () {
        $('#spinner').fadeIn();
    }).ajaxStop(function () {
        $('#spinner').fadeOut();
    });
}(jQuery));