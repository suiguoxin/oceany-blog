(function ($) {
    // $(".updatePost").click(function (e) {
    //     e.preventDefault();
    //
    //     let url = $(this).data("url");
    //     console.log(url);
    //
    //     $.ajax({
    //         method: "get",
    //         url: url
    //     }).done(function (result) {
    //         //set post content and comments
    //         $("#content").html(result);
    //         //highlight code block
    //         $('pre > code').each(function () {
    //             hljs.highlightBlock(this);
    //         });
    //     });
    // });

    $(document).ready(function () {
        $('#back-to-top').backToTop($('#main'));
    });

    $('#sidebar')
        .on('show.bs.collapse', function () {
            $("#main").toggleClass("col-9 col-12");
        })
        .on('hidden.bs.collapse', function () {
            $("#main").toggleClass("col-9 col-12");
        });

})(jQuery);