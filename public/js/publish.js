function uploadPost() {
    var formData = new FormData();
    var postFile = document.getElementById("postFile").files[0];
    formData.append("postFile", postFile);

    $.ajax({
        url: '/publish/uploadPost',
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            $('#postContent').val(res.content);
        },
        error: function (res) {
            alert(res);
        }
    });
}