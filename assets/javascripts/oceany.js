(function ($) {
    $(document).ajaxStart(function () {
        $('#spinner').fadeIn();
    }).ajaxStop(function () {
        $('#spinner').fadeOut();
    });

    // confirm delete modal
    $('#confirm-delete').on('show.bs.modal', function (e) {
        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
    });
}(jQuery));