$(document).ready(function(){ 
   $("body").on("keyup","#user_name",function(){
        var uname = $(this).val();
        if(uname==''){
          $('#user_id').val('');
        }
    });    
    $('input[name=\'user_name\']').autocomplete({
      'source': function(request, response) {   
        $.ajax({
          url: URL+'/'+ encodeURIComponent(request.term),
          dataType: 'json',
          success: function(json) {            
            response($.map(json, function(item) { 
              return {
                label: item['fname']+' '+item['lname']+' ('+item['phone_no']+') ',
                value: item['_id'],
                walamt: item['wallet_balance'],
                wholesaler:item['is_wholesaler']
              }
            }));
          }
        });
      },
      'select': function(event, ui) {
        var label = ui.item.label;
        var value = ui.item.value;
        var walamt = ui.item.walamt; 
        var wholesaler = ui.item.wholesaler;
        setTimeout(function () {
          $('#user_name').val(label);
          $('#user_id').val(value);
          $('#userwalletbal').html(walamt.toFixed(2));
          $('#user_wallet_balance').val(walamt.toFixed(2));
          $('#is_wholesaler').val(wholesaler);
          $('#user_name').prop('readonly',true)
          getdefaultaddressuser();
        }, 1);       
      },
      focus: function( event, ui ) {
        var label = ui.item.label;
        var value = ui.item.value; 
        setTimeout(function () {
          $('#user_name').val(label);
          $('#user_id').val(value);
        }, 1);  
      }
    });  

    $("body").on("click","#applycoupon",function(){
           var coupon = $('#promocode').val();
           var userId = $('#user_id').val();
           if(userId!=''){           
               $.post(applycouponcode,
            {
                csrf_test_name : csrf_hash,
                fid : $('#franchiseId').val(),
                uid : $('#user_id').val(), 
                code : $('#promocode').val() 
            },
            function(response){
                var data = JSON.parse(response);
                if(data.status==1){
                    var carttotal = data.data;
                    $('#ctotal').html(carttotal.total);
                    $('#cdisc').html(carttotal.disc);
                    $('#cusedwallet').html(carttotal.user_wallet);
                    $('#cprodisc').html(carttotal.promo_disc);
                    $('#cdelivery').html(carttotal.delivery_charge);
                    $('#cfinaltotal').html(carttotal.final_total);
                    $.notify(data.msg, "success");
                }else{
                    var carttotal = data.data;
                    $('#ctotal').html(carttotal.total);
                    $('#cdisc').html(carttotal.disc);
                    $('#cusedwallet').html(carttotal.user_wallet);
                    $('#cprodisc').html(carttotal.promo_disc);
                    $('#cdelivery').html(carttotal.delivery_charge);
                    $('#cfinaltotal').html(carttotal.final_total);
                      $.notify(data.msg, "error");
                  }
            }); 
           }else{ 
               $.notify("Please select user first!!!", "error");                
           }
    }); 

    $("body").on("click",".addCart",function(){
        var pvid = $(this).attr('pvid'); 
        var mode = 1; ///add cart
        var userId = $('#user_id').val();
        if(userId!=''){  
          manageUserCart(pvid,mode);        
        }else{
           $.notify("Please select user first!!!", "error");  
        }
    }); 

    $("body").on("click",".minusCart",function(){
        var pvid = $(this).attr('pvid'); 
        var mode = 2; ///minus cart
        manageUserCart(pvid,mode);
    }); 
    
    $("body").on("click",".removeCart",function(){
        var pvid = $(this).attr('pvid'); 
        var mode = 3; ///remove cart
        manageUserCart(pvid,mode);
    }); 

    $("body").on("change","#franchiseId",function(){
        var franchiseId = $(this).val();
        $.post(getfranchisecategorycoupon,
        {
            csrf_test_name : csrf_hash,
            fid : $('#franchiseId').val() 
        },
        function(response){
            var data = JSON.parse(response);
            $('#catagory_id').html(data.catagory);
            $('#promocode').html(data.procode);
        }); 
    }); 

   $("body").on("change","#catagory_id",function(){
        var catId = $(this).val();        
        var userId = $('#user_id').val();
        if(userId!=''){
          if(catId!=''){
              $.post(getproductbycategory,
              {
                  csrf_test_name : csrf_hash,
                  fid : $('#franchiseId').val(),
                  cid : $(this).val(),
                  iswholesaler : $('#is_wholesaler').val(), 
              },
              function(response){
                  var data = JSON.parse(response);
                  $('#productData').html(data.html);
                  $('#prolist').show(); 
              }); 
          }else{
              $.notify("Please select category to get products!!!", "error");
          }
        }else{
            $.notify("Please select user first!!!", "error");
        }
    }); 

    $("body").on("keyup","#searchproduct",function(){  
        filter = $('#searchproduct').val().toUpperCase();  
          // Loop through all list items, and hide those who don't match the search query
         $( ".product-header" ).each(function( i ) {
          var txtValue = $(this).text(); 
          var pro_main = $(this).parent().parent();
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            pro_main.css("display","");  
          } else {
            pro_main.css("display","none");  
          } 
        })
    });
    
    $("body").on("click","#use_wallet",function(){
        var userwallet = $('#user_wallet_balance').val();
        var userId = $('#user_id').val();
        if(userId==''){
            $('#use_wallet').prop('checked', false);
            $.notify('Please select User first!!!', "error");
            return false;
        } 
        if(userwallet<=0){
            $.notify("User wallet have zero ballance!!", "error");
        }else{
            if($(this).prop('checked') == true){
                var mode = 1;
            }else{
                var mode = 2;
            }
            $.post(updateusewallet,
            {
                csrf_test_name : csrf_hash,
                uid : userId,
                mode : mode 
            },
            function(response){
                var data = JSON.parse(response);
                var carttotal = data.data;
                if(data.status==1){ 
                    $('#ctotal').html(carttotal.total);
                    $('#cdisc').html(carttotal.disc);
                    $('#cusedwallet').html(carttotal.user_wallet);
                    $('#cprodisc').html(carttotal.promo_disc);
                    $('#cdelivery').html(carttotal.delivery_charge);
                    $('#cfinaltotal').html(carttotal.final_total);
                    $('#cartqty').html(carttotal.cartqty);
                    $('#cartvalue').val(carttotal.total);
                    $.notify(data.msg, "success"); 
                }else if(data.status==2){
                    $('#use_wallet').prop('checked', false);
                    $('#ctotal').html(carttotal.total);
                    $('#cdisc').html(carttotal.disc);
                    $('#cusedwallet').html(carttotal.user_wallet);
                    $('#cprodisc').html(carttotal.promo_disc);
                    $('#cdelivery').html(carttotal.delivery_charge);
                    $('#cfinaltotal').html(carttotal.final_total);
                    $('#cartqty').html(carttotal.cartqty);
                    $('#cartvalue').val(carttotal.total);
                    $.notify(data.msg, "error");
                }
            }); 
        }
    }); 
 
    $("body").on("change", "#delivery_date", function(e){ 
        $.post(checkorderdeliverydata,
        {
        csrf_test_name : csrf_hash,
        user_id : $('#user_id').val(),
        delivery_date: $('#delivery_date').val(),
        delivery_time: $('#delivery_time').val(),
        fid : $('#franchiseId').val(),
        },
        function(response){
            e.preventDefault();    
            var data = JSON.parse(response); 
            var d = new Date();
            var month = d.getMonth()+1;
            var day = d.getDate(); 
            var today = d.getFullYear() + '-' +
                (month<10 ? '0' : '') + month + '-' +
                (day<10 ? '0' : '') + day; 
            var delDate = $('#delivery_date').val(); 
            if(data.status=='1'){   
              $('#isorder').val('');
            }else{
              $('#isorder').val(data.msg);
              $.notify(data.msg, "error");     
            } 
            // $('#delivery_time option[value=1]').prop('disabled', false);
            // $('#delivery_time option[value=2]').prop('disabled', false);
            // if(today == delDate){
            //   $('#delivery_time').val(0);
            //   $('#delivery_time option[value=1]').prop('disabled', true);
            //   $('#delivery_time option[value=2]').prop('disabled', true);
            // } 
        }); 
     }); 

    $("body").on("click", ".placeorder", function(e){
        var cartvalue = $('#cartvalue').val();
        var minOrder = $('#minOrder').val();
        var minOrderwholesaler = $('#minOrderwholesaler').val();
        var acceptMinOrder = $('#acceptMinOrder').val();
        var delivery_address = $('#delivery_address').val();
        var farm = $('#farmName').val(); 
        var is_wholesaler = $('#is_wholesaler').val(); 
        if(cartvalue==0){
            $.notify(farm+" can not accept zero order value!!", "error");
            return false;
        }
        if(is_wholesaler=='true'){
          if(acceptMinOrder==false && parseFloat(cartvalue)<parseFloat(minOrderwholesaler)){
              $.notify(farm+" accepts minimum order amount Rs. "+minOrderwholesaler+"/-", "error");
              return false;
          }
        }else{
          if(acceptMinOrder==false && parseFloat(cartvalue)<parseFloat(minOrder)){
              $.notify(farm+" accepts minimum order amount Rs. "+minOrder+"/-", "error");
              return false;
          }
        } 

        if(delivery_address==''){
            $.notify("Delivery address can not define!!", "error");
            return false;
        }else if($('#delivery_date').val()==''){
            $.notify("Delivery Date can not define!!", "error");
            return false;    
        }else if($('#isorder').val()!=''){
            $.notify($('#isorder').val(), "error");
            return false;    
        }else{             
            $("#placeorderForm").validate({
                rules: {
                  user_name: "required", 
                  delivery_date: "required", 
                  delivery_time: "required", 
                },
                messages: { 
                  user_name: "Please Select User",
                  delivery_date: "Please Select Delivery Date", 
                  delivery_time: "Please Enter Delivery Time",   
                }
            });     
            $("#placeorderForm").submit();
        }
    });

$("body").on("click",".updateDefault",function(e){
  e.preventDefault();
  var aid = $(this).attr('aid'); 
  $.post(setdefaultaddressofuser,
  {
    csrf_test_name : csrf_hash,
    user_id : $('#user_id').val(),
    address_id: aid, 
    default_address: true
  },
  function(response){
    var data = JSON.parse(response);
    if(data.sucess=='200'){
      $.notify("Delivery Address Set Default Successfully", "success");
      getdefaultaddressuser(); 
    }else{
      $.notify(data.msg, "error");
    }
    $("#ajax-modal .close").click()
  }); 
});  
 
$("body").on("click","#change_address",function(e){
  e.preventDefault(); 
  var uid = $('#user_id').val();
  if(uid!=''){
      var url = getuseraddress+uid; 
      $modal = $('#ajax-modal');  
      $('#ajax-modal').html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><img style="width:200px;" src="'+loading+'"></br><h5>Please be patient while data loading.....</h5></center></div></div></div>');
        $modal.modal('show'); 
        $modal.load(url, '', function(){
        $modal.modal();         
      });      
      return false; 
    }else{ 
        $.notify("Please select the customer!!!", "error");    
    }
});

$("body").on("click","#add_address",function(e){
  e.preventDefault(); 
  var uid = $('#user_id').val();
  if(uid!=''){
      var url = adduseraddress+uid; 
      $modal = $('#ajax-modal');  
      $('#ajax-modal').html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><img style="width:200px;" src="'+loading+'"></br><h5>Please be patient while data loading.....</h5></center></div></div></div>');
        $modal.modal('show'); 
        $modal.load(url, '', function(){
        $modal.modal();         
      });      
      return false; 
    }else{ 
        $.notify("Please select the customer!!!", "error");    
    }
});

$("body").on("change","#countryId",function(){ 
  $.post(getstatebycountry,
  {
    csrf_test_name : csrf_hash,
    country_id : $(this).val(),
  },
  function(response){  
      $('#stateId').html(response);         
  });
});

$("body").on("change","#stateId",function(){ 
  $.post(getcitybystate,
  {
    csrf_test_name : csrf_hash,
    state_id : $(this).val(),
  },
  function(response){  
      $('#cityId').html(response);         
  });
});

$("body").on("change","#cityId",function(){ 
  $.post(getareabycity,
  {
    csrf_test_name : csrf_hash,
    city_id : $(this).val(),
  },
  function(response){  
      $('#areaId').html(response);         
  });
});

$("body").on("click","#addressSubmitBtn",function(){
    var address_type = $('#address_type').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var countryId = $('#countryId').val();
    var stateId = $('#stateId').val();
    var cityId = $('#cityId').val();
    var areaId = $('#areaId').val();
    var pincode = $('#pincode').val();

    var error = '';
    $("#error_address_type").html('');
    $("#error_address1").html('');
    $("#error_address2").html('');
    $("#error_countryId").html('');
    $("#error_stateId").html('');
    $("#error_cityId").html('');
    $("#error_areaId").html('');    
    $("#error_pincode").html('');

    if (address_type == ''){  
      var error='Select Delivery Address Type';
      $("#error_address_type").show();
      $("#error_address_type").html(error); 
    }
    if (address1 == ''){  
      var error='Enter Address Line 1';
      $("#error_address1").show();
      $("#error_address1").html(error); 
    }
    if (address2 == ''){  
      var error='Enter Address Line 2';
      $("#error_address2").show();
      $("#error_address2").html(error); 
    }
    if (countryId == ''){  
      var error='Select Country';
      $("#error_countryId").show();
      $("#error_countryId").html(error); 
    }
    if (stateId == ''){  
      var error='Select State';
      $("#error_stateId").show();
      $("#error_stateId").html(error); 
    }
    if (cityId == ''){  
      var error='Select City';
      $("#error_cityId").show();
      $("#error_cityId").html(error); 
    }
    if (areaId == ''){  
      var error='Select Area';
      $("#error_areaId").show();
      $("#error_areaId").html(error); 
    }
    if (pincode == ''){  
      var error='Enter Pincode';
      $("#error_pincode").show();
      $("#error_pincode").html(error); 
    }
    if (error==''){
      $.post(add_deliveryaddress,
      {
        csrf_test_name : csrf_hash,
        userId : $('#add_user_id').val(),
        address_type : $('#address_type').val(), 
        address1 : $('#address1').val(), 
        address2 : $('#address2').val(),
        countryId : $('#countryId').val(),
        stateId : $('#stateId').val(),
        cityId : $('#cityId').val(),
        areaId : $('#areaId').val(),
        pincode : $('#pincode').val(),  
        phone_no: $('#add_user_phone').val(),  
      },
      function(response){
        var data = JSON.parse(response); 
        if(data.sucess=='200'){
            $.notify("Delivery Address Add Successfully", "success");
            getdefaultaddressuser();              
        }else{
          $.notify(data.msg, "error");
        } 
        $("#ajax-modal .close").click()
      });
    }
  });

function getdefaultaddressuser(){   
  $.post(getdefaultaddressofuser,
  {
    csrf_test_name : csrf_hash,
    uid : $('#user_id').val(),
    fid : $('#franchiseId').val(),
  },
  function(response){
    var data = JSON.parse(response);

    if(data.sucess=='200'){   
        var addData = data.address[0]; 
        var address= '<b>Address Type:</b> '+address_type[addData['address_type']]+'<br>';
        address+= '<b>Street:</b> '+addData['address1']+''+addData['address2']+'<br>';
        address+= '<b>Country/State/City:</b> '+addData['country'][0]['title']+',  '+addData['state'][0]['title']+',  '+addData['city'][0]['title']+'<br>';
        address+= '<b>Area:</b> '+addData['area'][0]['title']+'<br>';
        address+= '<b>Pincode:</b> '+addData['pincode'];
        address+= '<b>Mobile:</b> '+addData['phone_no'];
        var delivery_address= 'Address Type: '+address_type[addData['address_type']]+'\n';
        delivery_address+= 'Street: '+addData['address1']+''+addData['address2']+'\n';
        delivery_address+= 'Country/State/City: '+addData['country'][0]['title']+',  '+addData['state'][0]['title']+',  '+addData['city'][0]['title']+'\n';
        delivery_address+= 'Area: '+addData['area'][0]['title']+'\n';
        delivery_address+= 'Pincode: '+addData['pincode']+'\n';
        delivery_address+= 'Mobile: '+addData['phone_no']+'\n';

        $('#addresserror').html('');
        $('#user_address').html(address); 
        $('#deliveryareaId').val(addData.areaId);
        $('#delivery_address').val(delivery_address);
        $('#latitude').val(addData['lat']);
        $('#longitude').val(addData['long']);
    }else{
      $('#user_address').html('');   
      $('#deliveryareaId').val('');  
      $('#delivery_address').val('');
      $('#latitude').val('');
      $('#longitude').val('');
      $('#addresserror').html('Customer address not found!!!')
    } 

    $('#delivery_date').attr('min', data.delivery_max_day);
    $('#delivery_date').attr('max', data.delivery_day_after_order);

    var carttotal = data.carttotal; 
    $('#ctotal').html(carttotal.total);
    $('#cdisc').html(carttotal.disc);
    $('#cusedwallet').html(carttotal.user_wallet);
    $('#cprodisc').html(carttotal.promo_disc);
    $('#cdelivery').html(carttotal.delivery_charge);
    $('#cfinaltotal').html(carttotal.final_total);
    $('#cartqty').html(carttotal.cartqty);
    $('#cartvalue').val(carttotal.total);
    if(carttotal.user_wallet=='0.00'){
        $('#use_wallet').prop('checked', false);
    }
  }); 
}

function manageUserCart(pvid, mode){ 
    $.post(addcartinsession,
    {
        csrf_test_name : csrf_hash,
        fid : $('#franchiseId').val(),
        uid : $('#user_id').val(), 
        pvid : pvid, 
        mode : mode, 
    },
    function(response){
        var data = JSON.parse(response);
        if(data.status==1){
            var usercart = data.data.UserCart;
            var carttotal = data.data.CartTotal;
            $('.orderlist').html(usercart);
            $('#ctotal').html(carttotal.total);
            $('#cdisc').html(carttotal.disc);
            $('#cusedwallet').html(carttotal.user_wallet);
            $('#cprodisc').html(carttotal.promo_disc);
            $('#cdelivery').html(carttotal.delivery_charge);
            $('#cfinaltotal').html(carttotal.final_total);
            $('#cartqty').html(carttotal.cartqty);
            $('#cartvalue').val(carttotal.total);
        }
        if(data.status==0){
          $.notify(data.msg, "error");
        }
        if(carttotal.user_wallet=='0.00'){
            $('#use_wallet').prop('checked', false);
        }
        
    }); 
}

}); 