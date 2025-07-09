$(document).ready(function () {
    $(".logout-link").click(() => {
        $.ajax({
            type: "GET",
            dataType: "html",
            url: SITEPATH + "ajax_data.php",
            data: { q: "logout" },
            success: function (data) {
                window.location.href = SITEPATH;
            }
        });
    });

    $("#save-rating").click(() => {
        $this = $(this);
        $("#save-rating").attr("disabled", true);
        if ($("#product_rate").val() < 1) {
            showAlert("Please select star(s) for the Products");
            $("#save-rating").removeAttr("disabled");
            return false;
        }

        if ($("#dboy_rate").val() < 1) {
            showAlert("Please select star(s) for the Delivery Boy");
            $("#save-rating").removeAttr("disabled");
            return false;
        }

        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: SITEPATH + "ajax_data.php",
            data: {
                q: "save_rating",
                order_id: $("#order-id").val(),
                product_rate: $("#product_rate").val(),
                dboy_rate: $("#dboy_rate").val(),
                comment: $("#review-comment").val(),
                why_low_rate: $("#why-low-rate").val()
            },
            success: function (data) {
                $("#save-rating").removeAttr("disabled");
                if (data.flag == true) {
                    $('#reviewModal').modal('hide');
                    if ($("#order-review-btn").length) {
                        $("#order-review-btn").remove();
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                    setTimeout(() => {
                        sessionStorage.removeItem("rating");
                    }, 1000);
                    showSuccessAlert("Thank you for your valuable review. This will help us to serve you better.");
                }
            }
        });
    });

    $(".order-time").change(
        function () {
            let m = $("#order-month").val();
            let y = $("#order-year").val();
            window.location.href = SITEPATH + "userprofile/myorders?month=" + m + '&year=' + y;
        }
    );

    $("#btn-search").click(function () {
        if ($("#InputSearch").val().trim() != "") {
            window.location = SITEPATH + "products/search?InputSearch=" + $("#InputSearch").val();
        }
    });
    $("#InputSearch").keyup(function (e) {
        if (e.which == 13 && $("#InputSearch").val().trim() != "") {
            window.location = SITEPATH + "products/search?InputSearch=" + $("#InputSearch").val();
        }
    });

    if ($("#cat-left-bar-search")) {
        $("#cat-left-bar-search").keyup(function () {
            var rows = $(".subcat-list").hide();
            var data = this.value.split(" ");

            $.each(data, function (i, v) {
                rows.filter(":contains('" + v + "')").show();
                rows.filter(":contains('" + v.toUpperCase() + "')").show();
                rows.filter(":contains('" + v.toLowerCase() + "')").show();
            });

            if (data == "") {
                $(".subcat-list").show();
            }
        });
    }

    if ($(".cb-filter-cat")) {
        $(".cb-filter-cat").change(function () {
            var allChecked = false;
            $(".product-div").show();
            $(".cb-filter-cat").each(function (e) {
                if ($(this).prop("checked") == true) {
                    $(".product-div").hide();
                    return;
                }
            });

            $(".cb-filter-cat").each(function (e) {
                if ($(this).prop("checked") == true) {
                    $(".cat-" + $(this).data("id")).show();
                }
            });
        });
    }

    $("#notification-types").change(function (e) {
        if ($(this).val() == "") {
            $(".general-notify").show();
            $(".personal-notify").show();
        }

        if ($(this).val() == "general") {
            $(".general-notify").show();
            $(".personal-notify").hide();
        }

        if ($(this).val() == "personal") {
            $(".general-notify").hide();
            $(".personal-notify").show();
        }
    });

    $('#stars-p li').on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
        $(this).parent().children('li.star-p').each(function (e) {
            if (e < onStar) {
                $(this).addClass('hover');
            } else {
                $(this).removeClass('hover');
            }
        });
    }).on('mouseout', function () {
        $(this).parent().children('li.star-p').each(function (e) {
            $(this).removeClass('hover');
        });
    });


    $('#stars-d li').on('mouseover', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
        $(this).parent().children('li.star-d').each(function (e) {
            if (e < onStar) {
                $(this).addClass('hover');
            } else {
                $(this).removeClass('hover');
            }
        });

    }).on('mouseout', function () {
        $(this).parent().children('li.star-d').each(function (e) {
            $(this).removeClass('hover');
        });
    });

    $('#stars-p li').on('click', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
        var stars = $(this).parent().children('li.star-p');

        for (i = 0; i < stars.length; i++) {
            $(stars[i]).removeClass('selected');
        }

        for (i = 0; i < onStar; i++) {
            $(stars[i]).addClass('selected');
        }

        var ratingValue = parseInt($('#stars-p li.selected').last().data('value'), 10);
        $("#product_rate").val(ratingValue);

        if ($("#product_rate").val() > 2 && $("#dboy_rate").val() > 2) {
            $("#why-low-comment").addClass("hide");
        } else {
            if ($("#product_rate").val() > 0 && $("#dboy_rate").val() > 0) {
                $("#why-low-comment").removeClass("hide");
            }
        }
    });

    /* 2. Action to perform on click */
    $('#stars-d li').on('click', function () {
        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
        var stars = $(this).parent().children('li.star-d');

        for (i = 0; i < stars.length; i++) {
            $(stars[i]).removeClass('selected');
        }

        for (i = 0; i < onStar; i++) {
            $(stars[i]).addClass('selected');
        }

        // JUST RESPONSE (Not needed)
        var ratingValue = parseInt($('#stars-d li.selected').last().data('value'), 10);
        $("#dboy_rate").val(ratingValue);
        if ($("#product_rate").val() > 2 && $("#dboy_rate").val() > 2) {
            $("#why-low-comment").addClass("hide");
        } else {
            if ($("#product_rate").val() > 0 && $("#dboy_rate").val() > 0) {
                $("#why-low-comment").removeClass("hide");
            }
        }
    });

    setTimeout(() => {
        $(".alert").fadeOut();
    }, 10000);

    if (!$("title").length) {
        $("head").prepend('<title>Adityom - Get Farm Fresh Vegitable And Fruits Delivered At Your Dootstep.</title>');
    }

    if ($("#reviewModal").length && $("#home-page").length && sessionStorage.getItem("rating") != 'not-now') {
        $('#reviewModal').modal('show');
        $('#reviewModal').on('shown.bs.modal', function (event) {
            $("#review-comment").val('');
            $("#why-low-comment").val('');
            $("#save-rating").removeAttr("disabled");
        })
    }

    $('#reviewModal').on('hidden.bs.modal', function (e) {
        sessionStorage.setItem("rating", "not-now");
    })


});

function showAlert(msg) {
    $(".alert").remove();
    var mBody = '<div class="alert alert-info alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('body').prepend(mBody);
    setTimeout(() => {
        $(".alert").fadeOut();
    }, 5000);
}

function showErrorAlert(msg) {
    $(".alert").remove();
    var mBody = '<div class="alert alert-danger alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('body').prepend(mBody);
    setTimeout(() => {
        $(".alert").fadeOut();
    }, 5000);
}

function showSuccessAlert(msg) {
    $(".alert").remove();
    var mBody = '<div class="alert alert-success alert-dismissible fade show" role="alert">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    $('body').prepend(mBody);
    setTimeout(() => {
        $(".alert").fadeOut();
    }, 5000);
}

function isAlphaNumeric(val) {
    var RegEx = /^[a-z0-9]+$/i;
    return RegEx.test(val);
}