<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-pencil"></i>
              &nbsp; General Notification  </h3>
          </div> 
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>

            <?php echo form_open_multipart(base_url($model.'/notification'), 'class="form-horizontal" id="notificationForm"' )?> 
              <div class="form-group row">
                <div class="col-sm-6">
                  <label for="title" class="col-sm-12 control-label">Franchise <span class="red">*</span></label>
                  <div class="col-md-12">
                    <select name="franchiseId" class="form-control" id="franchiseId" >  
                      <option value="">All</option>
                      <?php foreach ($franchise as $key => $value) { ?>
                        <option  <?php if(set_value('franchiseId')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                      <?php } ?>
                    </select> 
                  </div>
                </div>
                <div class="col-sm-6">
                  <label for="lname" class="col-sm-12 control-label">Image </label>  
                  <input type="file" id="notify_img" name="notify_img" > 
                </div>
              </div>  
              <div class="form-group row">
                <div class="col-sm-6">
                <label for="title" class="col-sm-12 control-label">Message Title <span class="red">*</span></label>
                <div class="col-md-12">
                  <input type="text" name="title" value="<?= set_value('title'); ?>" class="form-control" id="title" placeholder="">
                </div>
                </div>
                <div class="col-sm-6">
                  <label for="email" class="col-sm-12 control-label">Message Body <span class="red">*</span></label>
                  <div class="col-md-12">
                    <textarea name="mbody" class="form-control" id="mbody"><?= set_value('mbody'); ?></textarea>
                  </div>
                </div> 
              </div>
              <div class="form-group">
                <div class="col-md-12"> 
                  <input type="submit" name="submit" value="Send Notification" class="btn btn-info pull-right">
                </div>
              </div>
            <?php echo form_close(); ?>
        </div>
        <!-- /.box-body -->
      </div>
    </section>
  </div> 
<script type="text/javascript">
$(document).ready(function(){   
  $("#notificationForm").validate({
      rules: {
          title:"required",
          mbody: "required",   
          notify_img: { 
                  extension:"jpg|png|gif|jpeg",
                  },
      },
      messages: {
          title: "Please Enter Message Title",
          mbody: "Please Enter Message",  
          notify_img:{ 
                    extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                     },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#notificationForm").valid()){
          $("#notificationForm").submit();
      }
  });
});  
</script> 
