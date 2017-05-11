function uploadAvatar() {
    var formData = new FormData();
    //如何得到文件的值
    var avatar = $('#avatar').val();
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