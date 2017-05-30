(function ($) {
    $(".updatePost").click(function () {
        let url = $(this).data("url");
        console.log(url);

        $.ajax({
            method: "get",
            url: url
        }).done(function (result) {
            $("#content").html(result);
        });
    });

})(jQuery);