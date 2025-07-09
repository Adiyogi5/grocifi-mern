$(document).ready(function() {
    var validate = false;
    $(".pencile-edit-div-i").click(function() {
        $("#user_img").click();
    });

    $("#rcode-btn").click(function(e) {
        if (!validate) {
            return;
        }
        if ($("#refer_code").val().trim() == $("#r_code").val().trim()) {
            $('#rcode-modal').modal('hide');
            return;
        }

        $.ajax({
            url: SITEPATH+'ajax_data.php',
            type: 'POST',
            data: { q: 'check_and_update_refer_code', refer_code: $("#refer_code").val().trim() },
            dataType: 'JSON',
            success: function(res) {
                validate = false;
                if (res.flag == true) {
                    $("#r_code").val($("#refer_code").val().trim());
                    showSuccessAlert(res.msg);
                } else {
                    showErrorAlert(res.msg);
                }
                $('#rcode-modal').modal('hide');
            }
        });
    });

    $("#refer_code").blur(function(e) {
        $("#rcode-err").addClass("hide");
        if ($(this).val().trim() == "") {
            $("#rcode-err").removeClass("hide").html("Refer code is required");
            return;
        }

        if ($(this).val().trim() == $("#r_code").val().trim()) {
            return;
        }

        if ($(this).val().trim().length < 6 || !isAlphaNumeric($(this).val().trim())) {
            $("#rcode-err").removeClass("hide").html("A valid refer code is required. It should be 6 - 10 and alphanumeric.");
            return;
        }
        validate = true;
    });

    $('#rcode-modal').on('show.bs.modal', function(e) {
        $("#rcode-err").addClass("hide");
        $("#refer_code").val($("#r_code").val().trim());
    })

    $("#user_img").change(function() {
        var fd = new FormData();
        var files = $('#user_img')[0].files;

        // Check file selected or not
        if (files.length > 0) {
            fd.append('q', "uploadimage");
            fd.append('file', files[0]);

            $.ajax({
                url: SITEPATH+'ajax_data.php',
                type: 'POST',
                data: fd,
                dataType: 'JSON',
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.success == 200) {
                        $("#user-img-nav1").attr("src", USERIMAGEPATH + res.img);
                        $("#user-img").attr("src", USERIMAGEPATH + res.img);
                    } else {
                        alert('file not uploaded');
                    }
                },
            });
        } else {
            alert("Please select a file.");
        }
    });
});