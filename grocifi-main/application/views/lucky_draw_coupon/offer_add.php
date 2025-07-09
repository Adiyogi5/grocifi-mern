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
              Add New Lucky Draw Coupon </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/lucky_draw_coupon'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Offer List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/lucky_draw_coupon/add'), 'class="form-horizontal" id ="offerForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Offer Name <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title'); ?>">
                </div>
                 <div class="col-sm-6">
                  <label for="franchise_id" class="col-sm-6 control-label">Franchise Name<span class="red">*</span></label>
                   <select name="franchise_id" class="form-control select2" id="franchise_id" >
                    <option value="">Select Franchise</option>
                    <?php foreach ($franchise as $key => $value) { ?>
                      <option  <?php if(set_value('franchise_id')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                    <?php } ?>
                  </select>
                  <label id="franchise_id-error" class="error" for="franchise_id"></label>
                </div>
              </div> 

              <div class="form-group row">                   
                <div class="col-6">
                  <label for="start_date" class="col-sm-6 control-label">Start Date <span class="red">*</span></label>   
                  <input type="date" name="start_date" class="form-control" id="start_date" placeholder="" value="<?= set_value('start_date'); ?>">
                </div>
                 <div class="col-6">
                  <label for="expiry_date" class="col-sm-6 control-label">End Date <span class="red">*</span></label>   
                  <input type="date" name="expiry_date" class="form-control" id="expiry_date" placeholder="" value="<?= set_value('expiry_date'); ?>">
                </div>
              </div>

               <div class="form-group row">                   
                <div class="col-6">
                  <label for="offer_order" class="col-sm-6 control-label">Offer Priority <span class="red">*</span></label>   
                  <input type="number" name="offer_order" class="form-control" id="offer_order" placeholder="" value="<?= set_value('offer_order'); ?>">
                </div>
                <div class="col-6">
                  <label for="offer_winner" class="col-sm-6 control-label">Lucky Draw Count <span class="red">*</span></label>   
                 <input type="number" name="offer_winner" class="form-control" id="offer_winner" placeholder="" value="<?= set_value('offer_winner'); ?>">
                </div>
              </div>
              <div class="form-group row">     
                <div class="col-12">
                  <label for="description" class="col-sm-6 control-label">Description <span class="red">*</span></label>   
                  <textarea name="description" class="form-control" id="description" ><?= set_value('description'); ?></textarea>
                </div>
              </div>
              <div class="form-group row">   
                <div class="col-6">
                  <label for="is_active" class="col-sm-12 control-label">Offer Image <span class="red">*</span></label>     
                  <input type="file" class="form-control"  name="offer_image" id="offer_image" >
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
              <div class="form-group">
                <div class="col-md-12">
                  <input type="submit" name="submit" value="Add Offer" class="btn btn-info pull-right btn-submit">
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

  $("#offerForm").validate({
      rules: {
          title:{required: true, minlength: 3, maxlength:50 },
          franchise_id: "required",   
          offer_order : "required",  
          start_date  : "required",  
          expiry_date : "required",  
          description : "required",  
          is_active: "required", 
          offer_winner : {required: true, number: true },      
          offer_image: {
                  required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
      },
      messages: {
          title: {
                  "required": "Please Enter Offer Banner Name", 
                  "minlength": "Min Offer Banner Name Should Be 3 Digits",
                  "maxlength": "Max Offer Banner Name Should Be 50 Digits",
              },
          franchise_id: "Please Select Franchise", 
          start_date: "Please Select Start Date",
          expiry_date: "Please Select End Date",
          offer_order: "Please Enter Offer Priority",
          description: "Please Enter Description", 
          is_active: "Please Select Status",   
          offer_winner: {
                        "required": "Please Enter Lucky Draw Count",
                        "number": "Please Enter Valid Lucky Draw Count", 
                    }, 
          offer_image:{
                    required:"Please Select offer Image",
                    extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                     },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#offerForm").valid()){
          $("#offerForm").submit();
      }
  });
});  
</script> 