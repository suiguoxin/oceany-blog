function uploadAvatar() {
    var formData = new FormData();
    //why this line doesn't work
    //var avatar = $('#avatar').files[0];
    avatar = document.getElementById("avatar").files[0];
    formData.append("avatar", avatar);

    formData.append("test","content of test");

    $.ajax({
        url: "/profile/uploadAvatar",
        type: "POST",
        data: formData,
        processData: false, /* 告诉jQuery不要去处理发送的数据*/
        contentType: false   /* 告诉jQuery不要去设置Content-Type请求头*/
    });
}