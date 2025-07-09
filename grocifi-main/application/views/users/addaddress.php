<?php $model = $this->session->userdata('model'); ?>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Add Delivery Address For <?=$user['fname'].' '.$user['lname']; ?></h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/users/customer'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Customer List</a>
          </div>
        </div>
        <div class="card-body">    
        <?php $this->load->view('includes/_messages.php') ?>
        <?php  
          echo form_open(base_url($model.'/users/addaddress/'.$user['_id']), 'class="form-horizontal" id="delivery-address-form"' )?> 
          <div class="form-group row"> 
            <label for="address_type" class="col-sm-12 control-label">Address Type <span class="red">*</span></label>
            <div class="col-md-12">
               <select name="address_type" class="form-control" id="address_type" >
                  <option value="">Select Category</option> 
                  <?php foreach ($address_type as $key => $value) { ?>
                    <option  <?php if(set_value('address_type')==$key){ echo "selected='selected'"; }  ?> value="<?=$key?>"><?=$value?></option>
                  <?php } ?>
                </select>
                <input type="hidden" name="add_user_id" id="add_user_id" value="<?=$user['_id']?>">
                <input type="hidden" name="add_user_phone" id="add_user_phone" value="<?=$user['phone_no']?>">
              <span id="error_address_type" class="error" ></span>
            </div> 
          </div>
          <div class="form-group row"> 
            <div class="col-sm-6"> 
            <label for="address1" class="col-sm-12 control-label">Address line 1 <span class="red">*</span></label>
            <div class="col-md-12">
               <input type="text"  name="address1" value="<?= set_value('address1'); ?>" class="form-control" id="address1" placeholder=""> 
            </div> 
            </div>
            <div class="col-sm-6">
            <label for="address2" class="col-sm-12 control-label">Address line 2 <span class="red">*</span></label>
            <div class="col-md-12">
               <input type="text"  name="address2" value="<?= set_value('address2'); ?>" class="form-control" id="address2" placeholder=""> 
            </div> 
            </div>
          </div>
          <div class="form-group row"> 
            <div class="col-sm-6">
              <label for="countryId" class="col-sm-6 control-label">Country Name <span class="red">*</span></label>
              <select name="countryId" class="form-control" id="countryId" >
                <option value="">Select Country</option>
                <?php foreach ($country as $key => $value) { ?>
                  <option <?php if(set_value('countryId')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                <?php } ?>
              </select> 
            </div>
            <div class="col-sm-6">
              <label for="stateId" class="col-sm-6 control-label">State Name <span class="red">*</span></label>
              <select name="stateId" class="form-control" id="stateId" >
                 <option value="">Select State</option>
              </select> 
            </div>   
          </div> 
          <div class="form-group row"> 
            <div class="col-6">
              <label for="cityId" class="col-sm-6 control-label">City Name <span class="red">*</span></label>
              <select name="cityId" class="form-control" id="cityId" >
                 <option value="">Select City</option>
              </select> 
            </div>                
            <div class="col-6">
              <label for="areaId" class="col-sm-6 control-label">Area Name <span class="red">*</span></label>
              <select name="areaId" class="form-control" id="areaId" >
                 <option value="">Select Area</option>
              </select> 
            </div>  
          </div>
          <div class="form-group row"> 
           <div class="col-sm-6">
            <label for="pincode" class="col-sm-12 control-label">Pincode <span class="red">*</span></label>
            <div class="col-md-12">
               <input type="text"  name="pincode" value="<?= set_value('pincode'); ?>" class="form-control" id="pincode" placeholder="">  
            </div> 
            </div>
          </div>
          <div class="form-group">
                <div class="col-md-12"> 
                  <input type="hidden" name="userId" value="<?=$user['_id']?>">
                  <input type="hidden" name="phone_no" value="<?=$user['phone_no']?>">

                  <input type="submit" name="submit" value="Submit" class="btn btn-info pull-right btn-submit" id="submitBtn">
                </div>
              </div>
          <?php echo form_close();  ?>
        </div>
      </div>
    </section> 
  </div>
<script type="text/javascript">
  $(document).ready(function(){ 
  var getstatebycountry = '<?=base_url($model."/locations/getstatebycountry")?>';
  var getcitybystate = '<?=base_url($model."/locations/getcitybystate")?>';
  var getareabycity = '<?=base_url($model."/locations/getareabycity")?>';  
  var csrf_hash = '<?php echo $this->security->get_csrf_hash(); ?>'; 

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

     $("#delivery-address-form").validate({
        rules: { 
            address_type: {required: true},
            address1: {required: true},
            address2: {required: true},
            countryId: {required: true},
            stateId: {required: true},
            areaId: {required: true}, 
            pincode: {required: true},             
        },
        messages: { 
            address_type: "Please Select Address Type", 
            address1: "Please Enter Address Line 1",
            address2: "Please Enter Address Line 2",
            countryId: "Please Select Country",
            stateId: "Please Select State",
            areaId: "Please Select Area", 
            pincode: "Please Enter Address Line 1",
        }
    });
    $("body").on("click", ".btn-submit", function(e){
        if ($("#delivery-address-form").valid()){
            $("#delivery-address-form").submit();
        }
    });
  });  
</script>       