$(document).ready(function() {

    formSubmit = false;
    $("#form-place-order").each(function() {
        $("#palce-order-button").click(function() {
           
            let is_wallet_use = ($("#wallet").val())?true:false;
            if ($("#razorpay").prop("checked")) {
                if (!isDeliveryTimeSelected()) {
                    formSubmit = false;
                    return;
                }
                $("#form-place-order").attr("action", SITEPATH+"checkout/online_pay");
                $("#form-place-order").submit();
                return;
            }

            if ($("#cod").prop("checked") || is_wallet_use) {
                var options = {
                    data: {'csrf_test_name':Token}, 
                    dataType: 'HTML',
                    beforeSubmit: function(data) {
                        if (!isDeliveryTimeSelected()) {
                            formSubmit = false;
                            return false;
                        }
                    },
                    type: 'post',
                    success: function(data) {
                        console.log(data);
                        if (data == 200) {
                            window.location.href =  SITEPATH+"order/order_confirm";
                        } else if (data == 211) {
                            window.location.reload();
                        } else {
                            showAlert(data);
                        }
                        formSubmit = false;
                    },
                    url: $("#form-place-order").data("url"), // post-submit callback 
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                        showAlert("Error in saving.");
                        formSubmit = false;
                    }
                };

                if (!formSubmit) {
                    formSubmit = true;
                    $("#form-place-order").ajaxSubmit(options);
                }
            }
        });
    });

 
    $("#key_wallet_used").click(function() {
        if($(this).is(":checked") == true){
            var wallet = 1;
        }else{
            var wallet = 0;
        } 
        $.ajax({
        type: "POST",
        dataType: "json",
        url: SITEPATH+"checkout/use_wallet",
        data: { 'csrf_test_name':Token, wallet: wallet },
            success: function(data) {
                if (data.success == 200) {
                     window.location.reload();
                }else {
                    showAlert(data.msg);
                }
            }
        });
    });

    $("#ccApplyBtn").click(function() {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: SITEPATH+"checkout/use_coupon",
            data: { 'csrf_test_name':Token, ccode: $("#promo-code").val().trim() },
            success: function(data) {
                if (data.success == 200) {
                    window.location.reload();
                } else {
                    showAlert(data.msg);
                }
            }
        });
    });

    // $(".cancel-link-btn").click(function() {
    //     if (confirm("Are you sure you want to cancel the order?")) {
    //         $.ajax({
    //             type: "POST",
    //             dataType: "json",
    //             url: SITEPATH+"ajax_data.php",
    //             data: { q: "cancel_order", oid: $(this).data("id") },
    //             success: function(data) {
    //                 if (data.success == "1") {
    //                     window.location.reload();
    //                 } else {
    //                     showAlert("Order can not be cancelled on this statge.");
    //                 }
    //             }
    //         });
    //     }
    // });

    $(".edit-link-btn").click(function() {
        //if (confirm("Are you sure you want to edit your order?")) {
        $this = $(this);
        $(this).find("i").removeClass("mdi-lead-pencil");
        $(this).find("i").addClass("mdi-spin mdi-loading");
        $(this).attr("disabled", "disabled");
        $("#loadingDiv").show();
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: SITEPATH+"ajax_data.php",
            data: { q: "edit_order", oid: $(this).data("id") },
            success: function(data) {
                if (data.length > 0) {
                    data.forEach(async(ele) => {
                        await toCart(ele.varid, ele.qty);
                    });
                    window.location = SITEPATH + "edit_order.php";
                }
                $($this).removeAttr("disabled");
                $($this).find("i").addClass("mdi-lead-pencil");
                $($this).find("i").removeClass("mdi-spin mdi-loading");
            }
        });
        // }
    });

    $(document).on("click", ".add-product", function(e) {
        addItem($(this).data("id"));
        //alert($(this).data("id"));
    });

    $("#order-edit-cancel").click(function() {
        //if (confirm("Are you sure you want to edit your order?")) {
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: SITEPATH+"ajax_data.php",
            data: { q: "order_edit_cancel" },
            success: function(data) {
                window.location = SITEPATH;
            }
        });
        //}
    });

    $(".check_time_slot_availability").change(function(e) {
        var slot_id = $(this).val();
        var $this = $(this);
       
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: SITEPATH+"cart/checkTimeslotAvailble",
            data: { 'csrf_test_name':Token, slot_id: slot_id, date: $("#delivery_date").val() },
            success: function(data) {
                if (data.status == false) {
                     console.log('asdsa');
                    $this.prop("checked", false);
                    $this.attr("disabled", "disabled");
                    $("#default_time_slot").prop("checked", true);
                    showAlert("This time slot is currently unavailable due to the high volume of order flow, please select another time slot for quick delivery.");
                }
            }
        });
    });

    if ($(".check_time_slot_availability").length == 1) {
        $(".check_time_slot_availability").prop("checked", "checked")
    }
});

function edited_order() {
    if ($("#edited_cart").length) {
        $.ajax({
            type: "POST",
            dataType: "JSON",
            url: SITEPATH+"cart/edit_order",
            data: { 'csrf_test_name':Token },
            success: function(result) {
                if (result.success) {
                    $("#edited_cart").replaceWith(result.data);
                }
            }
        });
    }
}

function isDeliveryTimeSelected() {
    var time_selected = false;
    $(".check_time_slot_availability").each(function() {
        if (!time_selected) {
            time_selected = $(this).prop("checked");
        }
    });

    if (!time_selected) {
        showAlert("Please select a Delivery Time.");
        $("#delivery_date").focus();
    }
    return time_selected;
}