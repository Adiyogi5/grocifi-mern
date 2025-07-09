(function($) { 
    $().ready(function() {
        $("#location-filter").each(function() {
            var base_url = $(this).data("url");
            var token_name = $(this).attr("token-name");
            var token_value = $(this).attr("token-value");

            $("#search_country").change(function() {
                let req_url = base_url + `locations/fetch_state_list_by_country_id/${$(this).val()}`;
                $("#search_state").html('<option value="0">Select State</option>');
                $("#search_city").html('<option value="0">Select City</option>');
                $("#search_area_group").html('<option value="0">Select Group of Area</option>');
                $("#search_area").html('<option value="0">Select Area</option>');

                if ($(this).val() == "") {
                    return;
                }

                $.get(req_url, {
                        [token_name]: token_value
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        let keys = Object.keys(data);
                        $("#search_state").html("");

                        keys.forEach((ele) => {
                            $("#search_state").append($('<option>').val(ele).text(data[ele]));
                        })
                    }
                );
            });

            $("#search_state").change(function() {
                let req_url = base_url + `locations/fetch_city_list_by_state_id/${$(this).val()}`;
                $("#search_city").html('<option value="0">Select City</option>');
                $("#search_area_group").html('<option value="0">Select Group of Area</option>');
                $("#search_area").html('<option value="0">Select Area</option>');

                if ($(this).val() == "") {
                    return;
                }

                $.get(req_url, {
                        [token_name]: token_value
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        let keys = Object.keys(data);
                        $("#search_city").html("");

                        keys.forEach((ele) => {
                            $("#search_city").append($('<option>').val(ele).text(data[ele]));
                        })
                    }
                );
            });

            $("#search_city").change(function() {
                let req_url = base_url + `locations/fetch_areagroup_list_by_city_id/${$(this).val()}`;
                $("#search_area_group").html('<option value="0">Select Group of Area</option>');
                $("#search_area").html('<option value="0">Select Area</option>');

                if ($(this).val() == "") {
                    return;
                }

                $.get(req_url, {
                        [token_name]: token_value
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        let keys = Object.keys(data);
                        $("#search_area_group").html("");

                        keys.forEach((ele) => {
                            $("#search_area_group").append($('<option>').val(ele).text(data[ele]));
                        })
                    });

                req_url = base_url + `locations/fetch_area_list_by_city_id/${$(this).val()}`;
                $.get(req_url, {
                        [token_name]: token_value
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        let keys = Object.keys(data);
                        $("#search_area").html("");

                        keys.forEach((ele) => {
                            $("#search_area").append($('<option>').val(ele).text(data[ele]));
                        })
                    });
            });

            //search_area_group
            $("#search_area_group").change(function() {
                let group_id = $(this).val();
                let req_url = base_url + `locations/fetch_area_list_by_group_id/${group_id}`;

                if (group_id == 0) {
                    group_id = $("#search_city").val();
                    req_url = base_url + `locations/fetch_area_list_by_city_id/${group_id}`;
                }

                $.get(req_url, {
                        [token_name]: token_value
                    },
                    function(response) {
                        var data = JSON.parse(response);
                        let keys = Object.keys(data);
                        $("#search_area").html("");

                        keys.forEach((ele) => {
                            $("#search_area").append($('<option>').val(ele).text(data[ele]));
                        })
                    });


            });

        });



    });
})(window.jQuery);