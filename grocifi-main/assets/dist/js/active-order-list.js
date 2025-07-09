(function($) {
    $().ready(function() {        
        var base_url = $("#active-order-list").data("url");
        var token_name = $("#active-order-list").attr("token-name");
        var token_value = $("#active-order-list").attr("token-value");

        var table = $('#active-order-list-datatable').DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": base_url + "order/active_order_json/?franchise_id="+$('#search_franchise_id').val(),
            "order": [
                [6, 'asc']
            ], 
            "columnDefs": [{
                    "targets": 0,
                    "name": "id",
                    'searchable': false,
                    'orderable': false
                },
                {
                    "targets": 1,
                    "name": "username",
                    'searchable': true,
                    'orderable': true
                },
                {
                    "targets": 2,
                    "name": "phone_no",
                    'searchable': true,
                    'orderable': true
                },
                {
                    "targets": 3,
                    "name": "area",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 4,
                    "name": "delivery_boy",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 5,
                    "name": "final_total",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 6,
                    "name": "created",
                    'searchable': false,
                    'orderable': true,
                },
                {
                    "targets": 7,
                    "name": "delivery_date",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 8,
                    "name": "Action",
                    'searchable': false,
                    'orderable': false
                }
            ],
            drawCallback: function (data) {
                var flterOrderId = data.json['flterOrderId'];
                $('#flterOrderId').val(flterOrderId);
            }
        });
 

        $("#external-filter").click(function(e) {
            e.preventDefault();
            $("#lodingalert").show(); 
            table.on('preXhr.dt', function(e, settings, data) {
                var external_search = false;
                var location_search_added = false;
                if ($("#search_dd_from").val() != "" && $("#search_dd_to").val() != "") {
                    data.delivery_date_from = $("#search_dd_from").val();
                    data.delivery_date_to = $("#search_dd_to").val();
                    external_search = true
                }

                if ($("#search_order_status").val() != 0) {
                    data.is_active = $("#search_order_status").val();
                    external_search = true
                }

                if ($("#search_payment_status").val() != 0) {
                    data.payment_method = $("#search_payment_status").val();
                    external_search = true
                }

                if ($("#search_area").val() != 0 && !location_search_added) {
                    data.area = $("#search_area").val();
                    location_search_added = true
                    external_search = true
                }
                if ($("#search_area_group").val() != 0 && !location_search_added) {
                    let area_ids = [];
                    $("#search_area option").each(function() {
                        if ($(this).val() != 0) {
                            area_ids.push($(this).val());
                        }
                    });

                    data.area_group = area_ids.join(",");
                    location_search_added = true
                    external_search = true
                }
                if ($("#search_city").val() != 0 && !location_search_added) {
                    data.city = $("#search_city").val();
                    location_search_added = true
                    external_search = true
                }
                if ($("#search_state").val() != 0 && !location_search_added) {
                    data.state = $("#search_state").val();
                    location_search_added = true
                    external_search = true
                }
                if ($("#search_order_delivery_time").val() != 0 && !location_search_added) {
                    data.delivery_time_id = $("#search_order_delivery_time").val();
                    location_search_added = true
                    external_search = true
                }
                if ($("#search_country").val() != 0 && !location_search_added) {
                    data.country = $("#search_country").val();
                    location_search_added = true
                    external_search = true
                }
                if ($("#search_franchise_id").val() != "") {
                    data.franchise_id = $("#search_franchise_id").val(); 
                    external_search = true
                }
                if ($("#search_is_wholesaler").val() != "") {
                    data.is_wholesaler = $("#search_is_wholesaler").val(); 
                    external_search = true
                }

                data.external_search = external_search;
            });
            table.draw();
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });

        $("#external-filter-reset").click(function(e) {
            e.preventDefault();
            $("#lodingalert").show(); 
            $("#search_country").val("0");
            $("#search_state").val("0");
            $("#search_city").val("0");
            $("#search_area").val("0");
            $("#search_area_group").val("0");
            $("#search_order_status").val("0");
            $("#search_payment_status").val("0");
            $("#search_order_delivery_time").val("0");
            $("#search_dd_from").val("");
            $("#search_dd_to").val("");
            $("#search_is_wholesaler").val("");

            table.on('preXhr.dt', function(e, settings, data) {
                delete data.area;
                delete data.city;
                delete data.state;
                delete data.country;
                delete data.is_active;
                delete data.payment_method;
                delete data.area_group;
                delete data.external_search;
                delete data.delivery_date_to;
                delete data.delivery_time_id;
                delete data.delivery_date_from;
                delete data.is_wholesaler;
            });
            table.draw();
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });

        $("#new-update-status").click(function(e) {
            e.preventDefault();
            $("#lodingalert").show(); 
            if ($("#new-order-status").val() == "") { 
                alert('Please select the orders status!!');
                return false;
            }
            if($('#flterOrderId').val()==""){
                alert('No order list found!!');
                return false;
            }
            if ($("#new-order-status").val() != "") { 
                if(confirm("Are you sure? Do you want to change the status of all filtered orders.")){                     
                    let data = {
                        [token_name]: token_value,
                        new_status: $("#new-order-status").val(),
                        filter_val: $("#active-order-list-datatable_filter :input").val(),
                        is_active: $("#new-order-status").val(),
                        search_country: $("#search_country").val(),
                        search_state: $("#search_state").val(),
                        search_city: $("#search_city").val(),
                        search_area: $("#search_area").val(),
                        search_area_group: $("#search_area_group").val(),
                        search_order_status: $("#search_order_status").val(),
                        search_payment_status: $("#search_payment_status").val(),
                        search_order_delivery_time: $("#search_order_delivery_time").val(),
                        search_dd_from: $("#search_dd_from").val(),
                        search_dd_to: $("#search_dd_to").val(),
                        search_is_wholesaler: $("#search_is_wholesaler").val(),
                        search_franchise_id: $("#search_franchise_id").val(),
                    }; 
                    let req_url = base_url + "order/updatestatusall";
                    $.post(req_url, data,
                    function(response) {
                        var data = JSON.parse(response);
                        $('#orderStatusAllModal').modal('toggle');
                        table.draw();
                    }); 
                }
            }
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });
 
        $('.dataTable').delegate('.editOrder', 'click', function(e) {    
            e.preventDefault();
            if(confirm("Are you sure? Do you want to edit this order, because before edit Order was auto canceled and you should recreate this!!!")){ 
                var url = $(this).attr('href');
                window.location.href = url;
            }
        });

        $("#print_bills").click(function(e) { 
            e.preventDefault();
            if(confirm("Are you sure? Do you want to Print Bill of all filtered orders.")){ 
                $("#lodingalert").show();    
                $('#pmode').val('1');
                $('#xlsexportorder').submit();
                setTimeout(function(){ $("#lodingalert").hide(); }, 2000);
            }
        });

        $("#export_xls").click(function(e) { 
            e.preventDefault();
            if(confirm("Are you sure? Do you want to Export CSV of all filtered orders.")){ 
                $("#lodingalert").show(); 
                $('#pmode').val('2'); 
                $('#xlsexportorder').submit(); 
                setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
            }
        });

        $("#delivery-boy").click(function(e){
            e.preventDefault();
            $("#lodingalert").show(); 
            var franchise_id = $("#search_franchise_id").val();
            let req_url = base_url + "order/getfranchisedeliveryboys/"+franchise_id;
            $.get(req_url, 
            function(response) { 
                var items = JSON.parse(response);
                $.each(items.dboys, function (key, item) {
                    $('#delivery_boy').append($('<option>', { 
                        value: item.val,
                        text : item.name 
                    }));
                });
            });    
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);         
        })

        $("#update-delivery-boy").click(function(e) {
            e.preventDefault();
            $("#lodingalert").show(); 
            if ($("#delivery_boy").val() == "") { 
                alert('Please select the Delivery boy for orders!!');
                return false;
            } 
            if($('#flterOrderId').val()==""){
                alert('No order list found!!');
                return false;
            }
            if ($("#delivery_boy").val() != "") { 
                if(confirm("Are you sure? Do you want to assign the delivery boy of all filtered orders.")){
                    let data = {
                        [token_name]: token_value,
                        new_status: $("#new-order-status").val(),
                        filter_val: $("#active-order-list-datatable_filter :input").val(),
                        DeliveryBoyId: $("#delivery_boy").val(),
                        search_country: $("#search_country").val(),
                        search_state: $("#search_state").val(),
                        search_city: $("#search_city").val(),
                        search_area: $("#search_area").val(),
                        search_area_group: $("#search_area_group").val(),
                        search_order_status: $("#search_order_status").val(),
                        search_payment_status: $("#search_payment_status").val(),
                        search_order_delivery_time: $("#search_order_delivery_time").val(),
                        search_dd_from: $("#search_dd_from").val(),
                        search_dd_to: $("#search_dd_to").val(),
                        search_is_wholesaler: $("#search_is_wholesaler").val(),
                        search_franchise_id: $("#search_franchise_id").val(),
                    }; 
                    let req_url = base_url + "order/updatedeliveryboyall";
                    $.post(req_url, data,
                    function(response) { 
                        var data = JSON.parse(response);
                        $('#deliveryboyAllModal').modal('toggle');
                    }); 
                }
            }
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });  
        
    });
})(window.jQuery);