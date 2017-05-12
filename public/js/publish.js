function uploadPost() {
    var formData = new FormData();
    var postFile = $("#postFile").val();
    formData.append("postFile", postFile);
    formData.append("test", "content of test");

    $.ajax({
        url: '/publish/uploadPost',
        type: "POST",
        data: formData,
        processData: false,
        contentType: false
        // success: function (returndata) {
        //     alert(returndata);
        // },
        // error: function (returndata) {
        //     alert(returndata);
        // }
    });
}