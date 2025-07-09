<?php $model = $this->session->userdata('model'); ?>
 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Add New Country </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/locations/country'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Country List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open(base_url($model.'/locations/addcountry'), 'class="form-horizontal" id="countryForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Country Name <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title'); ?>">
                </div>
                  <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" id="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active') == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active') == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div>  
              </div>     
              <div class="form-group">
                <div class="col-md-12">
                  <input type="submit" name="submit" value="Add Country" class="btn btn-info pull-right btn-submit">
                </div>
              </div>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>
<script type="text/javascript">
$(document).ready(function(){   
  $("#countryForm").validate({
      rules: {
          title: {required: true, minlength: 3, maxlength:50 },
          is_active: "required",  
      },
      messages: {
          title: {
                  "required": "Please Enter Country Name", 
                  "minlength": "Min Country Name Should Be 3 Digits",
                  "maxlength": "Max Country Name Should Be 50 Digits",
              },   
          is_active: "Please Select Status",  
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#countryForm").valid()){
          $("#countryForm").submit();
      }
  });
});  
</script>    