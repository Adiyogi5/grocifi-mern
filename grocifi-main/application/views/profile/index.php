<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-pencil"></i>
              &nbsp; Update Profile </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/profile/change_pwd'); ?>" class="btn btn-success"><i class="fa fa-list"></i> Change Password</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>

            <?php echo form_open(base_url($model.'/profile'), 'class="form-horizontal" id="profileForm"' )?> 
              <div class="form-group row">
                <div class="col-sm-6">
                <label for="fname" class="col-sm-12 control-label">First Name <span class="red">*</span></label>
                <div class="col-md-12">
                  <input type="text" name="fname" value="<?= set_value('fname',$admin['fname']); ?>" class="form-control" id="fname" placeholder="">
                </div>
                </div>
                <div class="col-sm-6">
                <label for="lname" class="col-sm-12 control-label">Last Name </label>
                <div class="col-md-12">
                  <input type="text" name="lname" value="<?= set_value('lname',$admin['lname']); ?>" class="form-control" id="lname" placeholder="">
                </div>
              </div>
              </div>  
              <div class="form-group row">
                <div class="col-sm-6">
                <label for="email" class="col-sm-12 control-label">Email <span class="red">*</span></label>
                <div class="col-md-12">
                  <input type="email" name="email" value="<?= set_value('email',$admin['email']); ?>" class="form-control" id="email" placeholder="">
                </div>
                </div>
                <div class="col-sm-6">
                <label for="phone_no" class="col-sm-12 control-label">Mobile No <span class="red">*</span></label>
                <div class="col-md-12">
                  <input type="number" name="phone_no" value="<?= set_value('phone_no',$admin['phone_no']); ?>" class="form-control" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')" id="phone_no" placeholder="">
                </div>
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12"> 
                  <input type="hidden" name="role_type" id="role_type" value="<?=$admin['role_type']?>">
                  <input type="submit" name="submit" value="Update Profile" class="btn btn-info pull-right">
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
     $("#profileForm").validate({
        rules: {
            fname: {required: true, minlength: 3, maxlength:50 },
            lname: { minlength: 3, maxlength:50 },
            email: {required: true, email: true},
            phone_no:{
                    required: true,
                    minlength:10,
                    maxlength:10,
                    number: true,
                },              
        },
        messages: {
            fname: {
                  "required": "Please Enter First Name", 
                  "minlength": "Min First Name Should Be 3 Digits",
                  "maxlength": "Max First Name Should Be 50 Digits",
              },
            lname: {
                 /// "required": "Please Enter Last Name", 
                  "minlength": "Min Last Name Should Be 3 Digits",
                  "maxlength": "Max Last Name Should Be 50 Digits",
              },
            email: "Please Enter Valid Email Address", 
            phone_no: {
                    "required": "Please Enter Mobile No",
                    "number": "Please Enter Valid Mobile No",
                    "minlength": "Mobile Should Be 10 Digits",
                    "maxlength": "Mobile Should Be 10 Digits",
                }, 
        }
    });
    $("body").on("click", ".btn-submit", function(e){
        if ($("#profileForm").valid()){
            $("#profileForm").submit();
        }
    });
  });  
</script>  