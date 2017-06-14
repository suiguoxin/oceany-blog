function uploadAvatar() {
    let formData = new FormData();
    //why this line doesn't work
    //let avatar = $('#avatar').files[0];
    let avatar = document.getElementById("avatar").files[0];
    formData.append("avatar", avatar);

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