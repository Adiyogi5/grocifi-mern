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
              Update Category </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/category'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Category List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/category/editcategory/'.$category['_id']), 'class="form-horizontal" id="categoryForm"');  ?> 
              <div class="form-group row">   
                 <div class="col-sm-6">
                  <label for="holiday_date" class="col-sm-6 control-label">Main Category <span class="red">*</span></label>  
                   <select name="catagory_id" class="form-control select2" id="catagory_id" >
                    <option value="">Select Category</option> 
                    <?php foreach ($maincategory as $key => $value) { ?>
                      <option  <?php if(set_value('catagory_id',$category['catagory_id'])==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                    <?php } ?>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Category Name <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title',$category['title']); ?>">
                </div>
              </div>
              <div class="form-group row">   
                <div class="col-6">
                  <label for="allow_upload" class="col-sm-6 control-label">Allow Upload <span class="red">*</span></label>     
                  <select name="allow_upload" id="allow_upload" class="form-control">
                    <option value="">Select Option</option>
                    <option value="true" <?= (set_value('allow_upload',$category['allow_upload']) == '1')?'selected': '' ?>>Allowed</option>
                    <option value="false" <?= (set_value('allow_upload',$category['allow_upload']) == '0')?'selected': '' ?>>Not Allowed</option>
                  </select>
                </div>
                <div class="col-6">
                  <label for="coming_soon" class="col-sm-6 control-label">Coming Soon <span class="red">*</span></label>                
                  <select name="coming_soon" id="coming_soon" class="form-control">
                    <option value="">Select Option</option>
                    <option value="true" <?= (set_value('coming_soon',$category['coming_soon']) == '1')?'selected': '' ?>>Yes</option>
                    <option value="false" <?= (set_value('coming_soon',$category['coming_soon']) == '0')?'selected': '' ?>>No</option>
                  </select>
                </div>  
              </div>     
              <div class="form-group row">   
                <div class="col-sm-6">
                  <label for="priority" class="col-sm-6 control-label">Priority <span class="red">*</span></label>
                  <input type="text" name="priority" class="form-control" id="priority" placeholder="" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" value="<?= set_value('priority',$category['priority']); ?>">
                </div>
                 <div class="col-sm-6">
                  <label for="slug" class="col-sm-12 control-label">Seo Url <span class="red">*</span>&nbsp; <small>Don't use space and special characters in seo url</small></label>
                  <input type="text" name="slug" class="form-control" id="slug" placeholder="" value="<?= set_value('slug',$category['slug']); ?>">
                </div> 
              </div> 
              <div class="form-group row">   
                <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" id="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$category['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$category['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div>  
                <div class="col-6">
                  <label for="is_feature" class="col-sm-6 control-label">Select Feature <span class="red">*</span></label>                  
                  <select name="is_feature" id="is_feature" class="form-control">
                    <option value="">Select Feature</option>
                    <option value="1" <?= (set_value('is_feature',$category['is_feature']) == '1')?'selected': '' ?>>Yes</option>
                    <option value="0" <?= (set_value('is_feature',$category['is_feature']) == '0')?'selected': '' ?>>No</option>
                  </select>
                </div>
              </div>

              <div class="form-group row">   
                <div class="col-6">
                  <label for="catagory_img" class="col-sm-6 control-label">Image <span class="red">*</span></label>   
                  <div class="row">
                  <div class="col-6">
                  <input type="file" name="catagory_img" id="catagory_img" >
                  <input type="hidden" name="cat_image" value="<?=@$category['catagory_img']; ?>">
                  </div>
                  <div class="col-6">
                  <?php if(@$category['catagory_img']!='No Image'){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>catagory_img/<?=@$category['catagory_img']; ?>" class="logosmallimg"></p>   
                  <?php } ?>
                  </div>
                  </div>
                </div>
              </div>    
              <div class="form-group row">   
                <div class="col-12">
                  <label for="description" class="col-sm-6 control-label">Description <span class="red">*</span></label>     
                  <textarea  name="description" class="form-control" id="description"><?= set_value('description',$category['description']); ?></textarea>
                  </div>
              </div> 
              <div class="form-group">
                <div class="col-md-12">
                  <input type="hidden" name="_id" value="<?=$category['_id']?>">
                  <input type="submit" name="submit" value="Update Category" class="btn btn-info pull-right">
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

  $("#categoryForm").validate({
      rules: {
          title: {required: true, minlength: 3, maxlength:50 },
          allow_upload: "required", 
          coming_soon: "required",
          slug: "required",
          priority: "required",
          is_active: "required",
          description: "required",
          catagory_img: {
                  extension:"jpg|png|gif|jpeg",
                  },
      },
      messages: {
          title: {
                  "required": "Please Enter Category Name", 
                  "minlength": "Min Category Name Should Be 3 Digits",
                  "maxlength": "Max Category Name Should Be 50 Digits",
              },
          allow_upload: "Please Select Allow Upload",
          coming_soon: "Please Select Comming Soon", 
          priority: "Please Enter Priority", 
          slug: "Please Enter SEO Url of Category", 
          is_active: "Please Select Status", 
          description: "Please Enter Description",  
          catagory_img:{
                    extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                     },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#categoryForm").valid()){
          $("#categoryForm").submit();
      }
  });
});  
</script> 