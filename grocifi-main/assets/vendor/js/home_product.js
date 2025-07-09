function toCart(varid, qty) {
    // $("#loadingDiv").fadeIn();
    // $(".cart-sidebar").append('<img class="img-fluid loadingImg" src="./img/ajax-loader.gif" alt="">');
    $.ajax({
        type: "post",
        async: false,
        dataType: "json",
        url: SITEPATH + "cart/addtocart/",
        data: {'csrf_test_name' :Token, q: "tocart", varid: varid, qty: qty },
        success: function (data) {
            if (data.status == 200) {
                if ($("div").hasClass("accordion")) {
                    window.location.reload();
                    return;
                }
            }
            if (data.status != "200") {
                $("#loadingDiv").fadeOut(1000);
                showAlert(data.message);
                $(".cart-sidebar > .loadingImg").remove();
                return;
            }
            $(".cart-value").html(data.data.qty);
            $(".cart-value-div").html('(' + data.data.qty + ' item)');
            $(".cart-sidebar-body").remove();
            $(".cart-sidebar-footer").remove();

            $.ajax({
                type: "post",
                dataType: "json",
                url: SITEPATH + "cart/my_cart",
                data: {'csrf_test_name' :Token},
                success: function (data) {
                    edited_order();
                    $(".cart-sidebar > .loadingImg").remove();
                    $(".cart-sidebar").append(data);
                    
                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: SITEPATH + "cart/check_min_pay",
                        success: function (data) {
                            if (data.place_order == true) {
                                $("#card-pay-btn").removeClass("hidden-div");
                                $("#card-pay-btn").addClass("show-div");

                                $("#card-msg-btn").addClass("hidden-div");
                                $("#card-msg-btn").removeClass("show-div");
                            } else {
                                $("#card-pay-btn").addClass("hidden-div");
                                $("#card-pay-btn").removeClass("show-div");

                                $("#card-msg-btn").addClass("show-div");
                                $("#card-msg-btn").removeClass("hidden-div");
                            }
                            if (!$(".cart-onpage-div").length) { $("#loadingDiv").fadeOut(1000); }
                        }
                    });
                }
            });

            if ($(".cart-onpage-div").length) {
                $.ajax({
                    type: "post",
                    dataType: "html",
                    url: SITEPATH + "cart/showCart",
                    data: {'csrf_test_name' :Token},
                    success: function (data) {
                        console.log(data);
                        // $("#loadingDiv").fadeOut(1000);
                        // $(".cart-onpage-div").html(data);
                    }
                });
            }
        }
    });
}


function removeItem(cartid, qty) {
    var ans = "Are you sure to remove item from cart!!";
    if (confirm(ans) == true) {
        $("#loadingDiv").fadeIn();
        $(".cart-sidebar").append('<img class="img-fluid loadingImg" src="./img/ajax-loader.gif" alt="">');
        $.ajax({
            type: "post",
            async: false,
            dataType: "json",
            url: SITEPATH + "cart/removeItem",
            data: { 'csrf_test_name' :Token, cartid: cartid, qty: qty },
            success: function (data) {
                if (data.status == 200) {
                    if ($("div").hasClass("accordion")) {
                        window.location.reload();
                        return;
                    }
                }
                if (data.status != "200") {
                    $("#loadingDiv").fadeOut(1000);
                    showAlert(data.message);
                    $(".cart-sidebar > .loadingImg").remove();
                    return;
                }

                $(".cart-value").html(data.data.qty);
                $(".cart-value-div").html('(' + data.data.qty + ' item)');
                $(".cart-sidebar-body").remove();
                $(".cart-sidebar-footer").remove();

                $.ajax({
                    type: "post",
                    dataType: "html",
                    url: SITEPATH + "cart/my_cart",
                    data: { 'csrf_test_name' :Token },
                    success: function (data) {
                        data = JSON.parse(data);
                        edited_order();
                        $(".cart-sidebar > .loadingImg").remove();
                        $(".cart-sidebar").append(data);

                        $.ajax({
                            type: "get",
                            dataType: "json",
                            url: SITEPATH + "cart/check_min_pay",
                            data: {},
                            success: function (data) {
                                if (data.place_order == true) {
                                    $("#card-pay-btn").removeClass("hidden-div");
                                    $("#card-pay-btn").addClass("show-div");

                                    $("#card-msg-btn").addClass("hidden-div");
                                    $("#card-msg-btn").removeClass("show-div");
                                } else {
                                    $("#card-pay-btn").addClass("hidden-div");
                                    $("#card-pay-btn").removeClass("show-div");

                                    $("#card-msg-btn").addClass("show-div");
                                    $("#card-msg-btn").removeClass("hidden-div");
                                }
                                if (!$(".cart-onpage-div").length) { $("#loadingDiv").fadeOut(1000); }
                            }
                        });
                    }
                });

                // if ($(".cart-onpage-div").length) {
                //     $.ajax({
                //         type: "post",
                //         dataType: "html",
                //         url: SITEPATH + "ajax_checkout_my_cart.php",
                //         data: {},
                //         success: function (data) {
                //             $("#loadingDiv").fadeOut(1000);
                //             $(".cart-onpage-div").html(data);
                //         }
                //     });
                // }

            }
        });
    }
}

function updateItem(cartid, qty) {
    $("#loadingDiv").fadeIn();
    $(".cart-sidebar").append('<img class="img-fluid loadingImg" src="./img/ajax-loader.gif" alt="">');
    $.ajax({
        type: "post",
        async: false,
        dataType: "json",
        url: SITEPATH + "cart/update_cart",
        data: { 'csrf_test_name' :Token, cartid: cartid, qty: qty },
        success: function (data) {
           
            if (data.status == 200) {
                var has = $("div").has("#accordionExample");
                if (has.length) {
                    window.location.reload();
                    return;
                }
            }
            if (data.status != "200") {
                $("#loadingDiv").fadeOut(1000);
                showAlert(data.message);
                $(".cart-sidebar > .loadingImg").remove();
                return;
            }

            $(".cart-value").html(data.data.qty);
            $(".cart-value-div").html('(' + data.data.qty + ' item)');
            $(".cart-sidebar-body").remove();
            $(".cart-sidebar-footer").remove();

            $.ajax({
                type: "post",
                dataType: "html",
                url: SITEPATH + "cart/my_cart",
                data: { 'csrf_test_name' :Token },
                success: function (data) {
                    data = JSON.parse(data);
                    edited_order();
                    $(".cart-sidebar > .loadingImg").remove();
                    $(".cart-sidebar").append(data);

                    $.ajax({
                        type: "get",
                        dataType: "json",
                        url: SITEPATH + "cart/check_min_pay",
                        data: {'csrf_test_name' :Token },
                        success: function (data) {
                            if (data.place_order == true) {
                                $("#card-pay-btn").removeClass("hidden-div");
                                $("#card-pay-btn").addClass("show-div");

                                $("#card-msg-btn").addClass("hidden-div");
                                $("#card-msg-btn").removeClass("show-div");
                            } else {
                                $("#card-pay-btn").addClass("hidden-div");
                                $("#card-pay-btn").removeClass("show-div");

                                $("#card-msg-btn").addClass("show-div");
                                $("#card-msg-btn").removeClass("hidden-div");
                            }
                            $("#loadingDiv").fadeOut(1000); 
                            // if (!$(".cart-onpage-div").length) { $("#loadingDiv").fadeOut(1000); }
                        }
                    });
                }
            });

            // if ($(".cart-onpage-div").length) {
            //     $.ajax({
            //         type: "post",
            //         dataType: "html",
            //         url: SITEPATH + "ajax_checkout_my_cart.php",
            //         data: {},
            //         success: function (data) {
            //             $("#loadingDiv").fadeOut(1000);
            //             $(".cart-onpage-div").html(data);
            //         }
            //     });
            // }

        }
    });
}


function addItem(varId) {
    toCart(varId, '');
}

/*function removeItem(varId) {
    toCart(varId, '-1');
}*/

function deleteItem(varId) {
    toCart(varId, '0');
}

$(document).ready(function () {
    $(".change-product").change(function () {
        var eId = $(this).attr('id').split('-')[1];
        var vals = $('option:selected', this).attr('data-id').split('&');
        $(".prod-avail" + eId).html(vals[0]);
        $(".prod-price" + eId).html(vals[1]);
        $(".prod-mrp" + eId).html("MRP. " + vals[2]);

        if (vals[2] == '0.00') {
            $(".prod-mrp" + eId).addClass("hide");
        } else {
            $(".prod-mrp" + eId).removeClass("hide");
        }

        $(".btn-" + eId).attr("data-val", $(this).val());
        if ($("#stock-available")) {
            if (vals[3] == '0') {
                $("#stock-available").removeClass("badge-success").addClass("badge-danger").html("Not-Available");
            }

            if (vals[3] == '1') {
                $("#stock-available").removeClass("badge-danger").addClass("badge-success").html("In-Stock");
            }

            if (vals[3] == '2') {
                $("#stock-available").removeClass("badge-success").addClass("badge-danger").html("Not-Available");
            }
        }
    });

    $(".btn-tocart").click(function () {
        var imgtodrag = $(this).parent(".card-footer").parent(".card-body").parent(".product_card").find("img").eq(0);
        var has = $("body").has("#productDetails");
        // console.log($("body").has("#productDetails"));
        if (has.length) {
            imgtodrag = $(".img-fluid");
        }
        // console.log(imgtodrag);
        var cart = $('.cart-i');
        var imgclone = imgtodrag.clone()
        
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.5',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
            })
            .appendTo($('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000, 'easeInOutExpo');

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach()
        });

        $(this).attr("disabled", "disabled");
        $(this).children("i").removeClass("mdi-cart-outline").addClass("mdi-12px mdi-spin mdi-loading");
        toCart($(this).attr('data-val'), '');
        setTimeout(() => {
            $(this).children("i").removeClass("mdi-12px mdi-spin mdi-loading").addClass("mdi-cart-outline");
            $(this).removeAttr("disabled");
        }, 200);
    });

    $("#loc-country").change(function () {
        if ($("#loc-country").val() == "") {
            $("#loc-state").html('<option value="">Select State</option>');
            $("#loc-city").html('<option value="">Select City</option>');
            $("#loc-area").html('<option value="">Select Area</option>');
            $("#loc-subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getstate", id: $("#loc-country").val() },
                success: function (data) {
                    $("#loc-state").html(data);
                }
            });
        }
    });

   $("#loc-state").change(function () {
        if ($("#loc-state").val() == "") {
            $("#loc-city").html('<option value="">Select City</option>');
            $("#loc-area").html('<option value="">Select Area</option>');
            $("#loc-subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getcity", id: $("#loc-state").val() },
                success: function (data) {
                    $("#loc-city").html(data);
                }
            });
        }
    });

    $("#loc-city").change(function () {
        if ($("#loc-city").val() == "") {
            $("#loc-area").html('<option value="">Select Area</option>');
            $("#loc-subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getarea", id: $("#loc-city").val() },
                success: function (data) {
                    $("#loc-area").html(data);
                }
            });
        }
    });

    $("#loc-area").change(function () {
        if ($("#loc-area").val() == "") {
            $("#loc-subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getsubarea", id: $("#loc-area").val() },
                success: function (data) {
                    window.location = SITEPATH;
                }
            });
        }
    });

    $("#loc-subarea").change(function () {
        $.ajax({
            type: "GET",
            dataType: "html",
            url: SITEPATH + "home/ajaxlocation",
            data: { q: "setsubarea", id: $("#loc-subarea").val() },
            success: function () {
                //window.location = SITEPATH;//window.location.reload();
            }
        });
    });

});