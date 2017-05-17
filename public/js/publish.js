(function ($) {
    // function found in stack overflow
    // insert content into text area at the position of caret
    // ref: http://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery/946556#946556
    $.fn.insertAtCaret = function (myValue) {
        return this.each(function (i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    };

    $("#post-img").change(function () {
        var formData = new FormData();
        var postImg = document.getElementById("post-img").files[0];
        formData.append("postImg", postImg);
        $.ajax({
            url: '/publish/uploadImg',
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                $('#post-content').insertAtCaret(res.content);
            },
            error: function (res) {
                alert(res);
            }
        });
    });

    $("#post-file").change(function () {
        var formData = new FormData();
        var postFile = document.getElementById("post-file").files[0];
        formData.append("postFile", postFile);

        $.ajax({
            url: '/publish/uploadPost',
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                $('#post-content').val(res.content);
            },
            error: function (res) {
                alert(res);
            }
        });
    });

    $("#post-section").change(function () {
        var section = $('#post-section').val();
        if (section.toLowerCase() === "cfd" || section.toLowerCase() === "openfoam") {
            $('#form-group-index').show();
        }
        else $('#form-group-index').hide();
    });

})(jQuery);