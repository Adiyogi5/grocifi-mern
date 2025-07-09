function validate_form(){
	$("#address1").removeAttr("style");
	$("#address2").removeAttr("style");
	$("#addr-country").removeAttr("style");
	$("#addr-state").removeAttr("style");
	$("#addr-city").removeAttr("style");
	$("#addr-area").removeAttr("style");
	$("#addr-subarea").removeAttr("style");
	$("#pincode").removeAttr("style");
	
	var ret = true;
	if($("#address1").val().trim() == ""){
		$("#address1").css({"border":"red solid 1px"})
		$("#address1").focus();
		ret = false;
	}

	if($("#address2").val().trim() == ""){
		$("#address2").css({"border":"red solid 1px"})
		$("#address2").focus();
		ret = false;
	}

	if($("#addr-country").val().trim() == ""){
		$("#addr-country").css({"border":"red solid 1px"})
		$("#addr-country").focus();
		ret = false;
	}

	if($("#addr-state").val().trim() == ""){
		$("#addr-state").css({"border":"red solid 1px"})
		$("#addr-state").focus();
		ret = false;
	}

	if($("#addr-city").val().trim() == ""){
		$("#addr-city").css({"border":"red solid 1px"})
		$("#addr-city").focus();
		ret = false;
	}

	if($("#addr-area").val().trim() == ""){
		$("#addr-area").css({"border":"red solid 1px"})
		$("#addr-area").focus();
		ret = false;
	}

	if($("#addr-subarea").val().trim() == ""){
		$("#addr-subarea").css({"border":"red solid 1px"})
		$("#addr-subarea").focus();
		ret = false;
	}

	if($("#pincode").val().trim() == ""){
		$("#pincode").css({"border":"red solid 1px"})
		$("#pincode").focus();
		ret = false;
	}	return ret;
}

$(document).ready(function(){
	
	$(".make-default-adderss").click(function(){
		var flag = true;
		var id = $(this).data("id");
		var userId = $(this).data("user-id");
		var cart = 0;
		$.ajax({
			type:"GET",
			dataType:"json",
			url: SITEPATH+"ajax_data.php",
			data:{ q:"check_before_set_default_address", id:id, userId:userId },
			success:function(data) {
				
				flag = data.flag;
				cart = data.cart;
				if(flag == true){
					$.ajax({
						type:"post",
						dataType:"json",
						url: SITEPATH+"ajax_data.php",
						data:{ q:"setdefaultaddress", id:id, userId:userId, flag:"true", cart:cart },
						success:function(data) {
							if(data.success == 200){
								if(cart != 0){
									window.location = SITEPATH+"checkout.php";
								}else{
									window.location.reload();
								}
							}
						}
					});
				}else{
					if(cart == 0){
						$.ajax( {
							type:"post",
							dataType:"json",
							url: SITEPATH+"ajax_data.php",
							data:{ q:"setdefaultaddress", id:id, userId:userId, flag:"false", cart:0 },
							success:function(data) {
								if(data.success == 200){
									window.location.reload();
								}
							}
						});
					}else{
						if(confirm("If you select this address your cart will be empty.")){
							$.ajax( {
								type:"post",
								dataType:"json",
								url: SITEPATH+"ajax_data.php",
								data:{ q:"setdefaultaddress", id:id, userId:userId, flag:"false", cart:cart },
								success:function(data) {
									if(data.success == 200){
										window.location = SITEPATH;
									}
								}
							});
						}
					}
				}

			}
		});
	})
	

	$("#myaddress").each(function(){
		$("#addr-country").change(function(){
			$("#addr-state").html('<option value="">Select State</option>');
			$("#addr-city").html('<option value="">Select City</option>');
			$("#addr-area").html('<option value="">Select Area</option>');
			$("#addr-subarea").html('<option value="">Select Sub Area</option>');

			if($("#addr-country").val() == ""){
				//------------
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxaddress.php",
					data:{q:"getstate",id:$("#addr-country").val() },
					success:function(data) {
						$("#addr-state").html(data);
					}
				});
			}
		});
	
		$("#addr-state").change(function(){
			$("#addr-city").html('<option value="">Select City</option>');
			$("#addr-area").html('<option value="">Select Area</option>');
			$("#addr-subarea").html('<option value="">Select Sub Area</option>');
			if($("#addr-state").val() == ""){
					//-------------
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxaddress.php",
					data:{q:"getcity",id:$("#addr-state").val() },
					success:function(data) {
						$("#addr-city").html(data);
					}
				});
			}
		});
	
		$("#addr-city").change(function(){
			$("#addr-area").html('<option value="">Select Area</option>');
				$("#addr-subarea").html('<option value="">Select Sub Area</option>');
			if($("#addr-city").val() == ""){
				//---------
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxaddress.php",
					data:{ q:"getarea", id:$("#addr-city").val() },
					success:function(data) {
						$("#addr-area").html(data);
					}
				});
			}
		});
	
		$("#addr-area").change(function(){
			$("#addr-subarea").html('<option value="">Select Sub Area</option>');
			if($("#addr-area").val() == ""){
				//----------
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxaddress.php",
					data:{q:"getsubarea",id:$("#addr-area").val()},
					success:function(data) {
						$("#addr-subarea").html(data);
					}
				});
			}
		});
	});


	 $("#search_country").change(function () {
        if ($("#search_country").val() == "") {
            $("#search_state").html('<option value="">Select State</option>');
            $("#search_city").html('<option value="">Select City</option>');
            $("#search_area").html('<option value="">Select Area</option>');
            $("#search_subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getstate", id: $("#search_country").val() },
                success: function (data) {
                    $("#search_state").html(data);                    
                }
            });
        }
    });

    $("#search_state").change(function () {
        if ($("#search_state").val() == "") {
            $("#search_city").html('<option value="">Select City</option>');
            $("#search_area").html('<option value="">Select Area</option>');
            $("#search_subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getcity", id: $("#search_state").val() },
                success: function (data) {
                    $("#search_city").html(data);
                }
            });
        }
    });

    $("#search_city").change(function () {
        if ($("#search_city").val() == "") {
            $("#search_area").html('<option value="">Select Area</option>');
            $("#search_subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getarea", id: $("#search_city").val() },
                success: function (data) {
                    $("#search_area").html(data);
                }
            });
        }
    });

    $("#search_area").change(function () {
        if ($("#search_area").val() == "") {
            $("#search_subarea").html('<option value="">Select Sub Area</option>');
        } else {
            $.ajax({
                type: "GET",
                dataType: "html",
                url: SITEPATH + "home/ajaxlocation",
                data: { q: "getsubarea", id: $("#search_area").val() },
                success: function (data) {
                    
                }
            });
        }
    });

});