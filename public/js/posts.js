(function ($) {
    $(".updatePost").click(function (e) {
        e.preventDefault();

        let url = $(this).data("url");
        console.log(url);

        $.ajax({
            method: "get",
            url: url
        }).done(function (result) {
            //set post content and comments
            $("#content").html(result);
            //highlight code block
            $('pre > code').each(function () {
                hljs.highlightBlock(this);
            });
        });
    });

})(jQuery);