(function($) { 
    $().ready(function() { 
        
        var base_url = $("#order-list").data("url");
        var token_name = $("#order-list").attr("token-name");
        var token_value = $("#order-list").attr("token-value");

        var table = $('#order-list-datatable').DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": base_url + "order/order_index_json/?franchise_id="+$('#search_franchise_id').val(),
            "order": [
                [7, 'desc']
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
                    "name": "total",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 4,
                    "name": "key_wallet_balance",
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
                    "name": "firmname",
                    'searchable': true,
                    'orderable': false
                },
                {
                    "targets": 7,
                    "name": "created",
                    'searchable': false,
                    'orderable': true,
                },
                {
                    "targets": 8,
                    "name": "delivery_date",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 9,
                    "name": "is_active",
                    'searchable': false,
                    'orderable': false
                },
                {
                    "targets": 10,
                    "name": "payment_method",
                    'searchable': false,
                    'orderable': false
                },
                {
                    "targets": 11,
                    "name": "ordered_by",
                    'searchable': false,
                    'orderable': false
                },
                {
                    "targets": 12,
                    "name": "Action",
                    'searchable': false,
                    'orderable': false,
                    'width': '100px'
                }

            ], 
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
                if ($("#search_created_from").val() != "" && $("#search_created_to").val() != "") {
                    data.created_from = $("#search_created_from").val();
                    data.created_to = $("#search_created_to").val();
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
            $("#search_dd_from").val("");
            $("#search_dd_to").val("");
            $("#is_wholesaler").val("");

            table.on('preXhr.dt', function(e, settings, data) {
                delete data.external_search;
                delete data.delivery_date_from;
                delete data.delivery_date_to;
                delete data.is_active;
                delete data.payment_method;
                delete data.area;
                delete data.area_group;
                delete data.city;
                delete data.state;
                delete data.country; 
                delete data.is_wholesaler;
            });
            table.draw();
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });
         
        // $('.dataTable').delegate('.editOrder', 'click', function(e) {    
        //     e.preventDefault();
        //     if(confirm("Are you sure? Do you want to edit this order, because before edit Order was auto canceled and you should recreate this!!!")){ 
        //         var url = $(this).attr('href');
        //         window.location.href = url;
        //     }
        // });
        
        $("#export_xls").click(function(e) { 
            e.preventDefault();
            if(confirm("Are you sure? Do you want to Export CSV of all filtered orders.")){ 
               $("#lodingalert").show(); 
               $('#xlsexportorder').submit(); 
               setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
            }
        });
         
    });
})(window.jQuery);