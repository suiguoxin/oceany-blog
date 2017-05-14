function uploadAvatar() {
    var formData = new FormData();
    //why this line doesn't work
    //var avatar = $('#avatar').files[0];
    var avatar = document.getElementById("avatar").files[0];
    formData.append("avatar", avatar);
    formData.append("test","content of body test");

    $.ajax({
        url: "/profile/uploadAvatar",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            $('#avatarPreview').attr("src",res.src);
        }
    });
}