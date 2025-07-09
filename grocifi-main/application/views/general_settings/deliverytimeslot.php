<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
<?php $model = $this->session->userdata('model'); ?>  
    <!-- Main content -->
    <section class="content">
        <div class="card card-default color-palette-bo">
            <div class="card-header">
              <div class="d-inline-block">
                  <h3 class="card-title"> <i class="fa fa-pencil"></i>
                  Delivery Time Slot </h3>
              </div>
            </div>
            <div class="card-body">   
                 <!-- For Messages -->
                <?php $this->load->view('includes/_messages.php') ?>

                <?php echo form_open(base_url($model.'/settings/delivery_time_slot'), 'class="form-horizontal" id="dtForm"'); ?>	
                <!-- Tab panes -->
                <div class="tab-content">  
                  <div class="form-group">
                    <div class="statics-info-box col-md-12">
                    <p class="text-left">
                      <i class="fa fa-file"></i> &nbsp; <strong> <span style="color: red;">Note:</span> Few instruction for setting the delivery limit of per day orders.</strong>
                    </p>
                   <p class="text-left">
                    <ol style="line-height: 28px; font-size: 14px;">
                      <li> Set value '0' (Zero), If you don't want to set any limit for that time slot (that means Unlimited Orders).</li>
                      <li>Set a negetive number like '-1', If you don't want any order for that time slot.</li>
                      <li>Set any positive number like 1, 2 or 3..., For a limit of delivery order for that time slot.</li>
                    </ol>
                    </p>

                    </div>  
                 </div> 
                 <div class="form-group row">
                    <div class="col-sm-6">
                      <label class="control-label">Any Time</label>
                      <input type="text" class="form-control" name="time_slot_0" id="time_slot_0" placeholder="Enter order limit for Any Time" value="<?php echo html_escape($delivery_time['time_slot_0']); ?>"> 
                    </div>
                    <div class="col-sm-6">
                      <label class="control-label">06:00 AM - 10:00 AM</label>
                      <input type="text" class="form-control" name="time_slot_1" id="time_slot_1" placeholder="Enter order limit for 06:00 AM - 10:00 AM" value="<?php echo html_escape($delivery_time['time_slot_1']); ?>"> 
                    </div>
                  </div> 
                  <div class="form-group row">
                    <div class="col-sm-6">
                      <label class="control-label">10:00 AM - 02:00 PM</label>
                      <input type="text" class="form-control" name="time_slot_2" id="time_slot_2" placeholder="Enter order limit for 10:00 AM - 02:00 PM" value="<?php echo html_escape($delivery_time['time_slot_2']); ?>"> 
                    </div>
                    <div class="col-sm-6">
                      <label class="control-label">02:00 PM - 10:00 PM</label>
                      <input type="text" class="form-control" name="time_slot_3" id="time_slot_3" placeholder="Enter order limit for 02:00 PM - 10:00 PM" value="<?php echo html_escape($delivery_time['time_slot_3']); ?>"> 
                    </div>
                 </div> 
                </div> 
                <div class="box-footer"> 
                  <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['delivery_time_slot']['is_edit']) && $this->general_user_premissions['delivery_time_slot']['is_edit']==1)){ ?>  
                    <input type="hidden" name="_id" value="<?=$delivery_time['_id']?>">
                    <input type="submit" name="submit" value="Save Changes" class="btn btn-primary pull-right">
                  <?php } ?>
                </div>	
                <?php echo form_close(); ?>
            </div>
        </div>
    </section>
</div> 
<script type="text/javascript">
 $(document).ready(function(){   
  $("#dtForm").validate({
      rules: {
          time_slot_0:"required",
          time_slot_1: "required",  
          time_slot_2: "required", 
          time_slot_3:"required", 
      },
      messages: {
          time_slot_0: "Please Enter Any Time",
          time_slot_1: "Please Enter 06:00 AM - 08:00 AM",
          time_slot_2: "Please Enter 08:00 AM - 10:00 AM",   
          time_slot_3: "Please Enter 10:00 AM - 12:00 PM", 
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#dtForm").valid()){
          $("#dtForm").submit();
      }
  });
});  
</script>   