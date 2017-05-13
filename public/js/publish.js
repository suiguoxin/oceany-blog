function uploadPost() {
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
            $('#postContent').val(res.content);
        },
        error: function (res) {
            alert(res);
        }
    });
}

function changeSection() {
    var section = $('#post-section').val();
    alert(section);
    if(section.toLowerCase() === "cfd" || section.toLowerCase() === "openfoam"){
        $('#form-group-index').show();
    }
    else $('#form-group-index').hide();
}