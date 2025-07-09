<!-- Select2 -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/select2/select2.min.css">
<?php $model = $this->session->userdata('model'); ?>
 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Edit Order </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/order/index'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Order List</a>
          </div>
        </div>
        <div class="card-body"> 
        <?php 
        $status = $order['status'][0];
        $user = $order['user'][0];
        ?>  
          <!-- For Messages -->
          <?php $this->load->view('includes/_messages.php') ?> 
          <?php echo form_open(base_url($model.'/order/edit/'.$userid.'/'.$orderid.''), 'class="form-horizontal" id="placeorderForm"' )?>
              <div class="form-group row"> 
              	<div class="col-6"> 
              		<label for="franchiseId" class="col-sm-6 control-label">Franchise <span class="red">*</span></label> 
                	<select name="franchiseId" class="form-control" id="franchiseId" >  
	                    <?php foreach ($franchise as $key => $value) { ?>
	                      <option  <?php if(set_value('franchiseId', $order['franchiseId'])==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
	                    <?php } ?>
                    </select>	
                </div> 
                <div class="col-6">
                  <label for="user_id" class="col-sm-6 control-label">Customer <span class="red">*</span></label> 
                   <input type="text" name="user_name" value="<?=$user['fname'].' '.$user['lname'].' ('.$user['phone_no'].')'; ?>" placeholder="Customer Name" id="user_name" readonly="readonly" class="form-control" />
                  <input type="hidden" name="user_id" id="user_id" value="<?=$user['_id']?>">  
                  <input type="hidden" name="User_phone" id="User_phone" value="<?=$user['phone_no']?>">
                  <input type="hidden" name="is_wholesaler" id="is_wholesaler" value="<?=$user['is_wholesaler']?>">
                </div>
              </div> 
              <div class="form-group row">  
                <div class="col-12"> <label class="col-sm-12 control-label">&nbsp;</label> 
                	<button title="Add Delivery Address" id="add_address" class="btn btn-info btn-sm float-right" style="margin-left:10px;"><i class="fa fa-home" aria-hidden="true"></i> Add Delivery Address</button>

                    <button title="Change Delivery Address" id="change_address" class="btn btn-primary btn-sm float-right" style="margin-left:10px;"><i class="fa fa-home" aria-hidden="true"></i> Change Delivery Address</button>

                	<label for="user_address" class="col-sm-6 control-label">Customer Address</label> 
                	<div id="user_address" class="form-control txtdisable txtheight" ><?=nl2br($order['delivery_address'])?></div>
                	<input type="hidden" name="delivery_address" id="delivery_address" value="<?=$order['delivery_address']?>">
                	<input type="hidden" name="latitude" id="latitude" value="<?=$order['latitude']?>">
                	<input type="hidden" name="longitude" id="longitude" value="<?=$order['longitude']?>">
                	<input type="hidden" name="isorder" id="isorder">
                	<span id="addresserror" class="error"></span>
                </div>
               </div>   
              <div class="form-group row">  
                <div class="col-6">
                	<label class="col-sm-6 control-label">Wallet Balance : &nbsp;<span id="userwalletbal" >00.00</span></label> 
                </div>
               <div class="col-6">
                	<label for="use_wallet" class="col-sm-6 control-label"> <input type="checkbox" name="use_wallet" id="use_wallet"> &nbsp; Use Wallet </label> 
                	<input type="hidden" name="user_wallet_balance" id="user_wallet_balance" value="0">
                </div> 
               </div>  
               <fieldset>

               <legend> Order Details </legend> 
	            <div class="form-group row">
	             <div class="col-sm-4">
                  <label for="delivery_date" class="col-sm-6 control-label">Delivery Date <span class="red">*</span></label>
                  <input type="date" name="delivery_date" class="form-control" id="delivery_date" placeholder="" value="<?= set_value('delivery_date', date('Y-m-d',strtotime($order['delivery_date'])) ); ?>">
                 </div>
                 <div class="col-sm-4">
                  <label for="delivery_time" class="col-sm-6 control-label">Delivery Time <span class="red">*</span></label> 
                   <select name="delivery_time" class="form-control" id="delivery_time" >
	                    <option value="">Select Delivery Time</option> 
	                    <?php foreach ($delivery_time as $key => $value) { ?>
	                      <option  <?php if(set_value('delivery_time',$order['delivery_time_id'])==$key){ echo "selected='selected'"; }  ?> value="<?=$key?>"><?=$value?></option>
	                    <?php } ?>
                    </select>
                 </div>
                 <div class="col-sm-4">
                  <label for="promocode" class="col-sm-6 control-label">Coupon Code <span class="red">*</span></label>
                   <select name="promocode" class="form-control" id="promocode" style="width: 79%; float: left;" >
	                    <option value="">Select Coupon Code</option> 
	                    <?php foreach ($promocode as $key => $value) { ?>
	                      <option  <?php if(set_value('promocode')==$value['id']){ echo "selected='selected'"; }  ?> value="<?=$value['id']?>"><?=$value['title']?></option>
	                    <?php } ?>
                    </select>
                    <input type="button" name="applycoupon" id="applycoupon" value="Apply" style="float: right;" class="btn btn-success pull-right">
                 </div>
	            </div> 
	            <div class="form-group row">
		            <div class="col-sm-8">
			            <div class="col-sm-12">
		                  <label for="catagory_id" class="col-sm-6 control-label">Category <span class="red">*</span></label>  
		                   <select name="catagory_id" class="form-control select2" id="catagory_id" >
		                    <option value="">Select Category</option> 
		                    <?php foreach ($maincategory as $key => $value) { ?>
		                      <option  <?php if(set_value('catagory_id')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
		                    <?php } ?>
		                  </select>
		              	</div>
		              	<div class="col-md-12">
		              	<div class="row" id="prolist" style="display: none; margin-top:10px;">
		              		<div class="col-sm-12"  style="margin-bottom: 10px;">  <input type="text" name="product" class="form-control" id="searchproduct" placeholder="Search Product" ></div>
		              		<div class="row" id="productData" style="width: 100%;">
		              			
		              		</div>
		              	</div>
		              	</div>
	                </div> 
	                <div class="col-sm-4 cartlist" >
	                	<h5 class="header">Cart Item (<span id="cartqty">0</span>)</h5>
	                	<div class="row">
	                	<div class="col-sm-12" style="padding-right: 15px;"><input type="submit" name="submit" value="Place Order" class="btn btn-success pull-right placeorder"></div>
	                	<div class="col-sm-12">
		                	<div class="totallist">
		                		<div class="col-sm-12"><b>Total:</b>&nbsp;<span id="ctotal"> <?=$carttotal['total']?></span></div>
		                		<div class="col-sm-12"><b>Discount:</b>&nbsp;<span id="cdisc">  <?=$carttotal['disc']?></span></div>
		                		<div class="col-sm-12"><b>Promo. Discount:</b>&nbsp;<span id="cprodisc">  <?=$carttotal['promo_disc']?></span></div>
		                		<div class="col-sm-12"><b>Wallet Used:</b>&nbsp;<span id="cusedwallet">  <?=$carttotal['user_wallet']?></span></div>
		                		<div class="col-sm-12"><b>Final Total:</b>&nbsp;<span id="cfinaltotal">  <?=$carttotal['final_total']?></span></div>
		                		<input type="hidden" name="cartvalue" id="cartvalue" value="<?=$carttotal['total']?>">
		                		<input type="hidden" name="acceptMinOrder" id="acceptMinOrder" value="<?=$this->general_settings['accept_minimum_order']?>">
		                		<input type="hidden" name="minOrder" id="minOrder" value="<?=$this->general_settings['min_order']?>">
		                		<input type="hidden" name="tax" id="tax" value="<?=$this->general_settings['tax']?>">
		                		<input type="hidden" name="min_delivery_date" id="min_delivery_date" value="<?=$this->general_settings['delivery_day_after_order']?>">
		                		<input type="hidden" name="delivery_max_day" id="delivery_max_day" value="<?=$this->general_settings['delivery_max_day']?>"> 

		                		<input type="hidden" name="farmName" id="farmName" value="<?=$this->general_settings['site_name']?>"> 
		                		
		                	</div>
                      <div class="orderlist">
                        <?php 
                        $UserCart = '';
                        foreach ($_SESSION['UserCart'] as $ovkey => $ovvalue) {  
                        $UserCart.= '<div class="col-sm-12 " style="position: relative;" id="cartrow'.$ovvalue['frproductvarId'].'">'; 
                        $UserCart.= '<div class="card" style="margin-bottom: .5rem !important;">';
                        $UserCart.= '<div class="row" style="padding: 5px;">';
                        $UserCart.= '<div class="col-sm-3">';
                         if(!empty($ovvalue['image_url'])){
                              $UserCart.= '<img id="user-img-nav1" alt="'.$ovvalue['title'].'" src="'.$this->config->item('APIIMAGES').'product_img/'.@$ovvalue['image_url'].'" width="50" height="50" />';
                            }else{
                              $UserCart.= '<img id="user-img-nav1" alt="'.$ovvalue['title'].'" src="'.$this->config->item('APIIMAGES').'noimage.png" width="50" height="50" />';  
                            } 
                        $UserCart.= '</div>';
                        $UserCart.= '<div class="col-sm-6" style="font-size:14px;"><div>'.$ovvalue['title'].'</div>';
                        $UserCart.= '<div>Price(₹):'.$ovvalue['price'].'</div>';
                        $UserCart.= '<div>Available In: '.$ovvalue['measurement'].' '.$this->config->item('smallunits')[$ovvalue['unit']].'</div>'; 
                        $UserCart.= '<div>Amount(₹):'.$ovvalue['price']*$ovvalue['qty'].'</div>';
                        $UserCart.= '</div>';
                        $UserCart.= '<div class="col-sm-3" style="padding: 0px;"><span class="form-control" style="width:50%; margin-top: 20px;padding: 8px 2px;">'.$ovvalue['qty'].'</span>
                           <i aria-hidden="true" style="position: absolute; top: 20px; right: 25px;color: #018601!important;cursor:pointer;" pvid="'.$ovvalue['frproductvarId'].'" class="fa fa-plus float-right inc-btn addCart"></i> <br> <i aria-hidden="true" pvid="'.$ovvalue['frproductvarId'].'"  style="position: absolute; top: 50px; right: 25px; color: #f90202!important;cursor:pointer;" class="fa fa-minus float-right inc-btn minusCart"></i>';
                        $UserCart.= '<div pvid="'.$ovvalue['frproductvarId'].'" style="position: absolute; top: -8px; right: 8px; cursor:pointer;" class="removeCart"><i class="fa fa-times"></i></div></div>';
                        $UserCart.= '</div></div></div>';
                        }
                        echo $UserCart; ?>
                       
		                	

		                	</div>
	                	</div>
	                	</div>
	                </div>
	            </div>
              
          </fieldset>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>
    <!-- Select2 -->
<script src="<?= base_url() ?>assets/plugins/select2/select2.full.min.js"></script>

<script type="text/javascript"> 
var URL = "<?=base_url($model."/coupon/getuserbyName")?>";
var address_type = <?=json_encode($address_type);?>;
var applycouponcode = '<?=base_url($model."/order/applycouponcode")?>';
var getfranchisecategorycoupon = '<?=base_url($model."/order/getfranchisecategorycoupon")?>';
var getproductbycategory = '<?=base_url($model."/order/getproductbycategory")?>';
var updateusewallet ='<?=base_url($model."/order/updateusewallet")?>';
var checkorderdeliverydata = '<?=base_url($model."/order/checkorderdeliverydata")?>';
var setdefaultaddressofuser = '<?=base_url($model."/order/setdefaultaddressofuser")?>';
var getuseraddress = '<?=base_url($model."/order/getuseraddress/")?>';
var adduseraddress = '<?=base_url($model."/order/adduseraddress/")?>';
var getstatebycountry = '<?=base_url($model."/locations/getstatebycountry")?>';
var getcitybystate = '<?=base_url($model."locations/getcitybystate")?>';
var getareabycity = '<?=base_url($model."/locations/getareabycity")?>';
var add_deliveryaddress = '<?=base_url($model."/order/add_deliveryaddress")?>';
var getdefaultaddressofuser = '<?=base_url($model."/order/getdefaultaddressofuser")?>';
var addcartinsession = '<?=base_url($model."/order/addcartinsession")?>';
 
//csrf_test_name
var csrf_hash = '<?php echo $this->security->get_csrf_hash(); ?>'; 
var loading = '<?=base_url("assets/img/loading.gif")?>';
</script>  
<script src="<?= base_url() ?>assets/dist/js/placeorder.js"></script>
<script type="text/javascript">
$(document).ready(function(){     
  //Initialize Select2 Elements
    $('.select2').select2();
     	
    $("#countryId").trigger('change');
	setTimeout(function(){ 
	  $("#stateId").val('<?= set_value('stateId'); ?>'); 
	  $("#stateId").trigger('change'); 
	}, 1000);
	setTimeout(function(){ 
	  $("#cityId").val('<?= set_value('cityId'); ?>'); 
	  $("#cityId").trigger('change'); 
	}, 1500);
	setTimeout(function(){ $("#areaId").val('<?= set_value('areaId'); ?>'); }, 2000);

  var username = $('#User_phone').val();
  $.post(URL+'/'+username,
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>'
    },
    function(response){
      var item = JSON.parse(response);
      var walamt = item[0]['wallet_balance'];
      var wholesaler = item[0]['is_wholesaler'];
      $('#userwalletbal').html(walamt.toFixed(2));
      $('#user_wallet_balance').val(walamt.toFixed(2));
      $('#is_wholesaler').val(wholesaler);
    });

}); 	
</script>