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
              Edit New Product </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/product'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Product List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/product/editproduct/'.$product['_id']), 'class="form-horizontal" id="productForm"');  ?> 
              <div class="form-group row">   
                 <div class="col-sm-6">
                  <label for="catId" class="col-sm-6 control-label">Main Category <span class="red">*</span></label>  
                   <select name="catId" class="form-control select2" id="catId" >
                    <option value="">Select Category</option> 
                    <?php foreach ($category as $key => $value) { ?>
                      <option  <?php if(set_value('catId',$product['catId'])==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                    <?php } ?>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Product Name <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title',$product['title']); ?>">
                </div>
              </div>
                 
              <div class="form-group row">   
                <div class="col-sm-6">
                  <label for="search_title" class="col-sm-6 control-label">Search By <span class="red">*</span></label>
                  <input type="search_title" name="search_title" class="form-control" id="search_title" placeholder="Enter Search By (with comma seprator)" value="<?= set_value('search_title', @$product['search_title']); ?>">
                </div>
                <div class="col-6">
                  <label for="imgs" class="col-sm-6 control-label">Image </label>     
                  <input type="file" name="imgs[]" id="imgs" multiple="" >
                </div>  
              </div> 
              <div class="form-group row">   
                
                <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" id="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$product['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$product['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div>  
                <div class="col-6">
                  <label for="is_global" class="col-sm-6 control-label">Select Global <span class="red">*</span></label>                  
                  <select name="is_global" id="is_global" class="form-control">
                    <option value="">Select option</option>
                    <option value="1" <?= (set_value('is_global', $product['is_global']) == true)?'selected': '' ?>>Yes</option>
                    <option value="0" <?= (set_value('is_global', $product['is_global']) == false)?'selected': '' ?>>No</option>
                  </select>
                </div> 

              </div>    
              <div class="form-group row">   
                <div class="col-12">
                  <label for="description" class="col-sm-6 control-label">Description <span class="red">*</span></label>     
                  <textarea  name="description" class="form-control" id="description"><?= set_value('description',$product['description']); ?></textarea>
                  </div>
              </div>  
              <hr>
          <div class="form-group row" style="margin-top: 5px;">  
            <?php 
            if(!empty($product['prodImg'])){
            foreach ($product['prodImg'] as $key => $value) { ?>
              <div class="col-sm-3 product-main"> 
                <div class="card"> 
                 
                  <div class="card-body"> <img id="user-img-nav1" src="<?= $this->config->item('APIIMAGES') ?>product_img/<?=$value['title']?>" width="150" height="200" /></div>
                  <div class="card-footer"> 
                   <?php if($value['isMain']==1){ ?> 
                      Default Image
                   <?php } ?>  
                  <?php if($value['isMain']!=1){ ?>   
                      <button type="button" id="<?=$value['_id']?>" pid="<?=$value['productId']?>" class="btn btn-success btn-sm float-left defaultImg"><i class="fa fa-plus"></i> Default </button>
                  <?php } ?>   
                      <button type="button" id="<?=$value['_id']?>" pid="<?=$value['productId']?>"  class="btn btn-danger btn-sm float-right removeImg"><i class="fa fa-trash"></i> Remove </button>
                    
                  </div>
                </div>
              </div>
              
            <?php } } ?>
          </div>

              <div class="form-group">
                <div class="col-md-12">
                  <input type="hidden" name="_id" value="<?=$product['_id']?>">
                  <input type="submit" name="submit" value="Update Product" class="btn btn-info pull-right">
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
    $("body").on("click",".defaultImg",function(){ 
      pid = $(this).attr('id');
      $.post('<?=base_url($model."/product/makedefaultimage")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        pid : $(this).attr('pid'),
        _id : $(this).attr('id'), 
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess=='200'){  
           window.location.reload();
        }else{
          $.notify(data.msg, "error");
        }
      });
    });
    $("body").on("click",".removeImg",function(){ 
      pid = $(this).attr('id');
      $.post('<?=base_url($model."/product/removeproductimage")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        pid : $(this).attr('pid'),
        _id : $(this).attr('id'),  
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess=='200'){  
           window.location.reload();
        }else{
          $.notify(data.msg, "error");
        }
      });
    });
  
  //Initialize Select2 Elements
  $('.select2').select2();

  $("#productForm").validate({
      rules: {
          catId:"required", 
          title: {required: true, minlength: 3, maxlength:50 },
          search_title: "required",  
          is_active: "required",
          description: "required",
          imgs: {
                  extension:"jpg|png|gif|jpeg",
                },
      },
      messages: {
          title: {
                  "required": "Please Enter Product Name", 
                  "minlength": "Min Product Name Should Be 3 Digits",
                  "maxlength": "Max Product Name Should Be 50 Digits",
              },
          search_title: "Please Enter Search Title", 
          is_active: "Please Select Status", 
          description: "Please Enter Description",  
          imgs:{
                extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
              },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#productForm").valid()){
          $("#productForm").submit();
      }
  });
});  
</script> 