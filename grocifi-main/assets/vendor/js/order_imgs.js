$(document).ready(function() {
    $("#user_pre").change(function() {
        var fd = new FormData();
        var files = $('#user_pre')[0].files;

        if (files.length > 0) {
            $("#loadingDiv").fadeIn("slow");
            fd.append('q', "uploadorderimage");

            for (var i = 0; i < $(this).get(0).files.length; ++i) {
                fd.append('file[]', $(this).get(0).files[i]);
            }

            $.ajax({
                url: SITEPATH+'ajax_data.php',
                type: 'POST',
                data: fd,
                dataType: 'JSON',
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.success == 200) {
                        $("#submitBtn").removeAttr("disabled");
                        $("#loadingDiv").fadeOut("slow");
                        if ($("#order_imgs").val() == "") {
                            $("#order_imgs").val(res.imgs);
                        } else {
                            $("#order_imgs").val(res.imgs + "," + $("#order_imgs").val());
                        }

                        var imgs = res.imgs.split(",");

                        imgs.forEach(element => {
                            $("#order-imgs-container").append('<div id="div' + element + '" class="product col-md-4"><div class="product-header"><img id="user-img-nav1" alt="logo" src="' + USERORDERIMG + element + '"></div><div class="product-footer"><button id="' + element + '" type="button" class="btn btn-danger btn-sm del-order-img float-right"><i class="mdi mdi-delete"></i> Delete</button></div></div>');

                            //$("#order-imgs-container").append('<div id="div' + element + '" class="order-img-div"><i class="mdi mdi-close-box-outline del-order-img" id="' + element + '"></i><img id="user-img-nav1" alt="logo" src="./image.php?image=' + USERORDERIMG + element + '&amp;height=100&amp;width=100"></div>');
                        });

                    } else {
                        alert('file not uploaded');
                    }
                },
            });
        } else {
            alert("Please select a file.");
        }
    });

    $(document).on("click", ".del-order-img", function() {
        var name = $(this).attr("id");
        var $this = $(this);
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: SITEPATH+"ajax_data.php",
            data: { q: "delorderimg", name: name },
            success: function(res) {
                if (res.success == 200) {
                    var imgNames = $("#order_imgs").val();
                    imgNames = imgNames.split(",");
                    imgNames = imgNames.filter(ele => {
                        return ele != name;
                    });
                    if (imgNames == "") {
                        $("#submitBtn").attr({ "disabled": "disabled" });
                    }
                    $("#order_imgs").val(imgNames);
                    $this.parent().parent().remove();
                }
            }
        });
    });

});