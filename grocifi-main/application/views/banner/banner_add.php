 <!-- Content Wrapper. Contains page content -->
 <?php $model = $this->session->userdata('model'); ?>
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Add New Banner </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/banner'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Banner List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/banner/add'), 'class="form-horizontal" id="bannerForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Banner Name <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title'); ?>">
                </div>
                 <div class="col-sm-6">
                  <label for="holiday_date" class="col-sm-6 control-label">Franchise Name<span class="red">*</span></label>
                   <select name="franchise_id" class="form-control" id="franchise_id" >
                    <option value="">Select Franchise</option>
                    <?php foreach ($franchise as $key => $value) { ?>
                      <option  <?php if(set_value('franchise_id')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                    <?php } ?>
                  </select>
                </div>
              </div>
              <div class="form-group row">   
                <div class="col-6">
                  <label for="is_active" class="col-sm-12 control-label">Banner <span class="red">*</span></label>     
                  <input type="file" class="form-control"  name="banner_img" id="banner_img" >
                  <small>Banner size should be 1920X605 px</small>
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
                  <input type="submit" name="submit" value="Add Banner" class="btn btn-info pull-right btn-submit">
                </div>
              </div>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>
<script type="text/javascript">
$(document).ready(function(){   
  $("#bannerForm").validate({
      rules: {
          title:"required",
          franchise_id: "required",  
          is_active: "required", 
          banner_img: {
                  required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
      },
      messages: {
          title: "Please Enter Banner Name",
          franchise_id: "Please Select Franchise", 
          is_active: "Please Select Status",   
          banner_img:{
                    required:"Please Select Photo",
                    extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                     },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#bannerForm").valid()){
          $("#bannerForm").submit();
      }
  });
});  
</script>    