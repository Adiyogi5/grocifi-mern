 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
<?php $model = $this->session->userdata('model'); ?>    
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Update Role </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/settings/rolemanager'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Role List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open(base_url($model.'/settings/editrole/'.$role['_id']), 'class="form-horizontal" id="roleForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Title <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title',$role['title']); ?>">
                </div>
                  <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$role['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$role['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div> 
                
              </div>     
              <div class="form-group">
                <div class="col-md-12">
                  <input type="hidden" name="_id" value="<?=$role['_id']?>">
                  <input type="submit" name="submit" value="Update Role" class="btn btn-info pull-right">
                </div>
              </div>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div> 
<script type="text/javascript">
 $(document).ready(function(){   
   
  $("#roleForm").validate({
      rules: {
          title:"required",  
          is_active: "required",  
      },
      messages: {
          title: "Please Enter Role name", 
          is_active: "Please Select Status",    
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#roleForm").valid()){
          $("#roleForm").submit();
      }
  });
});  
</script>   