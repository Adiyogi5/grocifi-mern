<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-pencil"></i>
              &nbsp; Change Password </h3>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
           
            <?php echo form_open(base_url($model.'/profile/change_pwd'), 'class="form-horizontal" id="chanpassForm"');  ?> 
              <div class="form-group">
                <label for="password" class="col-sm-3 control-label">Old Password</label>

                <div class="col-md-12">
                  <input type="password" name="oldpassword" class="form-control" id="oldpassword" placeholder="">
                </div>
              </div>
              <div class="form-group">
                <label for="password" class="col-sm-3 control-label">New Password</label>

                <div class="col-md-12">
                  <input type="password" name="password" class="form-control" value="<?= set_value('password'); ?>"id="password" placeholder="">
                </div>
              </div>

              <div class="form-group">
                <label for="confirm_pwd" class="col-sm-3 control-label">Confirm Password</label>

                <div class="col-md-12">
                  <input type="password" name="confirm_pwd" class="form-control" id="confirm_pwd" placeholder="" value="<?= set_value('confirm_pwd'); ?>">
                </div>
              </div>

              <div class="form-group">
                <div class="col-md-12">
                  <input type="submit" name="submit" value="Change Password" class="btn btn-info pull-right">
                </div>
              </div>
            <?php echo form_close( ); ?>
        </div>
          <!-- /.box-body -->
      </div>
    </section> 
  </div>
<script type="text/javascript">
  $(document).ready(function(){     
     $("#chanpassForm").validate({
        rules: {
            oldpassword:"required", 
            password:{
                        required: true,
                        minlength: 5
                    },
            confirm_pwd:{
                        required: true,
                        minlength: 5,
                        equalTo: "#password"
                    }, 
        },
        messages: {
          oldpassword:"Please Enter Old Password",
           password: {
                "required": "Please Enter New Password",
            },
            confirm_pwd: {
                "required": "Please Enter Confirm Password",
                "equalTo": "New Password And Confirm Password Should be Same",
            },
        }
    });
    $("body").on("click", ".btn-submit", function(e){
        if ($("#chanpassForm").valid()){
            $("#chanpassForm").submit();
        }
    });
  });  
</script>