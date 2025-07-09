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
              Add New Holiday </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/settings/holiday'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Holiday List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open(base_url($model.'/settings/addhoilday'), 'class="form-horizontal" id="holidayForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="holiday_date" class="col-sm-6 control-label">Franchise Name<span class="red">*</span></label>
                   <select name="franchiseId" class="form-control select2" id="franchiseId" >
                    <option value="">Select Franchise</option>
                    <?php foreach ($franchise as $key => $value) { ?>
                      <option  <?php if(set_value('franchiseId')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                    <?php } ?>
                  </select>
                  <label id="franchiseId-error" class="error" for="franchiseId"></label>
                </div>
              </div>
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="holiday_date" class="col-sm-6 control-label">Holiday Date <span class="red">*</span></label>
                  <input type="date" name="holiday_date" class="form-control" id="holiday_date" placeholder="" value="<?= set_value('holiday_date'); ?>">
                </div>
                  <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active') == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active') == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div> 
                
              </div>    
              <div class="form-group row"> 
                <div class="col-sm-12">
                <label for="description" class="col-sm-6 control-label">Description <span class="red">*</span></label>  
                <textarea name="description" class="form-control" id="description" ><?= set_value('description'); ?></textarea> 
                </div>
              </div>
              <div class="form-group">
                <div class="col-md-12">
                  <input type="submit" name="submit" value="Add Holiday" class="btn btn-info pull-right">
                </div>
              </div>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>
    <!-- Select2 -->
<script src="<?= base_url() ?>assets/plugins/select2/select2.full.min.js"></script>
<script type="text/javascript">
 $(document).ready(function(){  
    //Initialize Select2 Elements
  $('.select2').select2();
   
  $("#holidayForm").validate({
      rules: {
          holiday_date:"required",
          franchiseId: "required",  
          is_active: "required", 
          description:"required", 
      },
      messages: {
          holiday_date: "Please Enter Holiday Date",
          franchiseId: "Please Select Franchise", 
          is_active: "Please Select Status",   
          description: "Please Enter Description", 
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#holidayForm").valid()){
          $("#holidayForm").submit();
      }
  });
});  
</script>   