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
        success: function (returndata) {
            alert(returndata);
        },
        error: function (returndata) {
            alert(returndata);
        }
    });
}