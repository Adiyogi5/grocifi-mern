(function($) { 
    $().ready(function() { 
        
        var base_url = $("#dailycollection-list").data("url");
        var token_name = $("#dailycollection-list").attr("token-name");
        var token_value = $("#dailycollection-list").attr("token-value");

        var table = $('#dailycollection-list-datatable').DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": base_url + "users/dailycollection_datatable_json/",
            "order": [
                [2, 'desc']
            ],
            "columnDefs": [{
                    "targets": 0,
                    "name": "id",
                    'searchable': false,
                    'orderable': false
                },
                {
                    "targets": 1,
                    "name": "firmname",
                    'searchable': true,
                    'orderable': false
                }, 
                {
                    "targets": 2,
                    "name": "full_name",
                    'searchable': true,
                    'orderable': true
                },
                {
                    "targets": 3,
                    "name": "order_count",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 4,
                    "name": "recived",
                    'searchable': false,
                    'orderable': true
                },
                {
                    "targets": 5,
                    "name": "deposit",
                    'searchable': false,
                    'orderable': true
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
                if ($("#search_order_status").val() != 0) {
                    data.is_active = $("#search_order_status").val();
                    external_search = true
                }
                if ($("#search_franchise_id").val() != "") {
                    data.franchise_id = $("#search_franchise_id").val(); 
                    external_search = true
                } 
                if ($("#search_payment_status").val() != 0) {
                    data.payment_method = $("#search_payment_status").val();
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
            $("#search_order_status").val("0");
            $("#search_payment_status").val("0"); 

            table.on('preXhr.dt', function(e, settings, data) {
                delete data.external_search;
                delete data.delivery_date_from;
                delete data.delivery_date_to;
                delete data.is_active;
                delete data.payment_method; 
            });
            table.draw();
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        }); 
        
        /*$("#export_xls").click(function(e) { 
            e.preventDefault();
            if(confirm("Are you sure? Do you want to Export CSV of all filtered orders.")){ 
               $("#lodingalert").show(); 
               $('#xlsexportorder').submit(); 
               setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
            }
        });*/
         
    });
})(window.jQuery);