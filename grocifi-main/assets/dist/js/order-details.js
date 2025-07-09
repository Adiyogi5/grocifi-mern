(function($) {
    var adityom = window.adityom || {};
    window.adityom = adityom;
    $().ready(function() {
        $("#order-details").each(function() {
            var order_id = $(this).data("id");
            var base_url = $(this).data("url");
            var token_name = $(this).attr("token-name");
            var token_value = $(this).attr("token-value");

            $("#delivery_boy_id").change(function(e) {
                let req_url = base_url + "order/update_delivery_boy";
                $.post(req_url, {
                        [token_name]: token_value,
                        _id: order_id,
                        delivery_boy_id: $(this).val(),
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        if (data.sucess == "200") {
                            $.notify("Delivery Boy Assigned Successfully", "success");
                        } else {
                            $.notify(data.msg, "error");
                        }
                    }
                );
            });

            $("#revised_amout").click(function(e) {
                if($('#revised_total').val()==''){
                    alert('Please enter Revised Amount!!');
                    return false;
                }
                if (confirm("Are you sure! Do you want to Revised Amount of this order?")) {
                let req_url = base_url + "order/order_revised";
                $.post(req_url, {
                        [token_name]: token_value,
                        _id: order_id,
                        opm_total: $('#revised_total').val(),
                        delivery_total: $('#revised_total').val(),
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        if (data.sucess == "200") {
                            $.notify("Order Amount Revised", "success");
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            $.notify(data.msg, "error");
                        }
                    }
                );
                }
            });

            $("#change-status").click(function(e) {
                if($(this).data("val")=='3' && $('#delivery_boy_id').val()==''){
                    alert('Please select the Delivery Boy form Shipped!!');
                    return false;
                }
                if (confirm("Are you sure! Do you want to change status of this order?")) {
                let req_url = base_url + "order/updatestatus";
                $.post(req_url, {
                        [token_name]: token_value,
                        _id: order_id,
                        is_active: $(this).data("val"),
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        if (data.sucess == "200") {
                            $.notify("Order status changed", "success");
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            $.notify(data.msg, "error");
                        }
                    }
                );
                }
            });

            $("#cancel-order").click(function(e) {
                if (confirm("Are you sure! Do you want to cancel this order?")) {
                    let req_url = base_url + "order/updatestatus";
                    $.post(req_url, {
                            [token_name]: token_value,
                            _id: order_id,
                            is_active: 6,
                        },
                        function(response) {
                            var data = JSON.parse(response);
                            if (data.sucess == "200") {
                                $.notify("Order cancelled successfully", "success");
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            } else {
                                $.notify(data.msg, "error");
                            }
                        }
                    );
                }
            });
        });
    });
})(window.jQuery);