<div class="modal-dialog modal-lg" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Add Delivery Address For <?=$user['fname'].' '.$user['lname']; ?></h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <?php 
      $model = $this->session->userdata('model');
      $this->load->view('includes/_messages.php') ?>
        <?php  
          echo form_open(base_url($model.'/order/add_deliveryaddress'), 'class="form-horizontal" id="delivery-address-form"' )?> 
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
              <span id="error_address1" class="error" ></span>
            </div> 
            </div>
            <div class="col-sm-6">
            <label for="address2" class="col-sm-12 control-label">Address line 2 <span class="red">*</span></label>
            <div class="col-md-12">
               <input type="text"  name="address2" value="<?= set_value('address2'); ?>" class="form-control" id="address2" placeholder=""> 
              <span id="error_address2" class="error" ></span>
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
              <span id="error_countryId" class="error" ></span>
            </div>
            <div class="col-sm-6">
              <label for="stateId" class="col-sm-6 control-label">State Name <span class="red">*</span></label>
              <select name="stateId" class="form-control" id="stateId" >
                 <option value="">Select State</option>
              </select>
              <span id="error_stateId" class="error" ></span>
            </div>   
          </div> 

          <div class="form-group row"> 
            <div class="col-6">
              <label for="cityId" class="col-sm-6 control-label">City Name <span class="red">*</span></label>
              <select name="cityId" class="form-control" id="cityId" >
                 <option value="">Select City</option>
              </select>
              <span id="error_cityId" class="error" ></span>
            </div>                
            <div class="col-6">
              <label for="areaId" class="col-sm-6 control-label">Area Name <span class="red">*</span></label>
              <select name="areaId" class="form-control" id="areaId" >
                 <option value="">Select Area</option>
              </select>
              <span id="error_areaId" class="error" ></span>
            </div>  
          </div>
          <div class="form-group row"> 
           <div class="col-sm-6">
            <label for="pincode" class="col-sm-12 control-label">Pincode <span class="red">*</span></label>
            <div class="col-md-12">
               <input type="text"  name="pincode" value="<?= set_value('pincode'); ?>" class="form-control" id="pincode" placeholder=""> 
              <span id="error_pincode" class="error" ></span>
            </div> 
            </div>
          </div>
        <?php echo form_close();  ?>
    </div>
    <div class="modal-footer"> 
      <button type="submit" class="btn btn-primary" id="addressSubmitBtn"><i class="fa fa-save"></i> Save </button>
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
  </div>
</div>