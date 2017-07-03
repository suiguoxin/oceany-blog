(function ($) {
    $(document).ajaxStart(function () {
        $('#wait-loading').modal('show');
    }).ajaxStop(function () {
        $('#wait-loading').modal('hide');
    });

    // confirm delete modal
    $('#confirm-delete').on('show.bs.modal', function (e) {
        $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
    });
}(jQuery));