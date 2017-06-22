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
        $('#sidebar').outerHeight($(window).height() - 56);
    });

    $(window).resize(function () {
        $('#sidebar').outerHeight($(window).height() - 56);
    });

    $('#sidebar')
        .on('show.bs.collapse', function () {
            $("#main").toggleClass("col-9 col-12");
        })
        .on('hidden.bs.collapse', function () {
            setTimeout(
                function () {
                    $("#main").toggleClass("col-9 col-12");
                }, 350);
        });


})(jQuery);