$(document).ready(function(){
	$("#location-bound").each(function(){
		$("#locb-country").change(function(){
			if($("#locb-country").val() == ""){
				$("#locb-state").html('<option value="">Select State</option>');
				$("#locb-city").html('<option value="">Select City</option>');
				$("#locb-area").html('<option value="">Select Area</option>');
				$("#locb-subarea").html('<option value="">Select Sub Area</option>');
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxloc.php",
					data:{q:"getstate",id:$("#locb-country").val() },
					success:function(data) {
						$("#locb-state").html(data);
					}
				});
			}
		});
	
		$("#locb-state").change(function(){
			if($("#locb-state").val() == ""){
				$("#locb-city").html('<option value="">Select City</option>');
				$("#locb-area").html('<option value="">Select Area</option>');
				$("#locb-subarea").html('<option value="">Select Sub Area</option>');
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxloc.php",
					data:{q:"getcity",id:$("#locb-state").val() },
					success:function(data) {
						$("#locb-city").html(data);
					}
				});
			}
		});
	
		$("#locb-city").change(function(){
			if($("#locb-city").val() == ""){
				$("#locb-area").html('<option value="">Select Area</option>');
				$("#locb-subarea").html('<option value="">Select Sub Area</option>');
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxloc.php",
					data:{ q:"getarea", id:$("#locb-city").val() },
					success:function(data) {
						$("#locb-area").html(data);
					}
				});
			}
		});
	
		$("#locb-area").change(function(){
			if($("#locb-area").val() == ""){
				$("#locb-subarea").html('<option value="">Select Sub Area</option>');
			}else{
				$.ajax( {
					type:"GET",
					dataType:"html",
					url: SITEPATH+"ajaxloc.php",
					data:{q:"getsubarea",id:$("#locb-area").val()},
					success:function(data) {
						//$("#locb-subarea").html(data);
						window.location.reload();
					}
				});
			}
		});
	
		$("#locb-subarea").change(function(){
			$.ajax( {
				type:"GET",
				dataType:"html",
				url: SITEPATH+"ajaxloc.php",
				data:{q:"setsubarea",id:$("#locb-subarea").val()},
				success:function() {
					window.location.reload();
				}
			});
		});
	});
});