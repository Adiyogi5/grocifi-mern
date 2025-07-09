<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
<?php $model = $this->session->userdata('model'); ?>  
    <!-- Main content -->
    <section class="content">
        <div class="card card-default color-palette-bo">
            <div class="card-header">
              <div class="d-inline-block">
                  <h3 class="card-title"> <i class="fa fa-pencil"></i>
                  Add Manager </h3>
              </div>
            </div>
            <div class="card-body">   
                 <!-- For Messages -->
                <?php $this->load->view('includes/_messages.php') ?>

                <?php echo form_open_multipart(base_url($model.'/settings/admanager'), 'class="form-horizontal" id="adForm"'); ?>	
                <!-- Nav tabs -->               

                <!-- Tab panes -->
                <div class="tab-content">  
                      <div class="form-group">
                          <label class="control-label">Ads Image</label><br/> 
                             <p><img src="<?= $this->config->item('APIIMAGES') ?>setting_img/<?=$ad_img; ?>" class="logosmallimg"></p> 
                         <input type="file" class="form-control" id="add_img" name="add_img" > 
                         <p><small class="text-success">Allowed Types: gif, jpg, png, jpeg</small></p> 
                     </div> 

                </div> 
                <div class="box-footer"> 
                  <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['admanager']['is_edit']) && $this->general_user_premissions['admanager']['is_edit']==1)){ ?> 
                    <input type="submit" name="submit" value="Save Changes" class="btn btn-primary pull-right btn-submit">
                  <?php } ?>
                </div>	
                <?php echo form_close(); ?>
            </div>
        </div>
    </section>
</div> 
<script type="text/javascript">
$(document).ready(function(){   
  $("#adForm").validate({
      rules: { 
          add_img: {
                  required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
      },
      messages: {   
          add_img:{
                    required:"Please Select Ads Banner",
                    extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                     },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#adForm").valid()){
          $("#adForm").submit();
      }
  });
});  
</script>   