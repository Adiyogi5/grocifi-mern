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
              Update Lucky Draw Coupon </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/lucky_draw_coupon'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Offer List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/lucky_draw_coupon/editofferdate/'.$offer['_id']), 'class="form-horizontal" id="offerForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="title" class="col-sm-6 control-label">Offer Name </label>
                  <div class="form-control" style="background:#eee"><?=$offer['title']; ?></div>
                </div> 
              </div> 

              <div class="form-group row">                   
                <div class="col-6">
                  <label for="start_date" class="col-sm-6 control-label">Start Date <span class="red">*</span></label>   
                  <div class="form-control" style="background:#eee"><?= date('d/m/Y', strtotime($offer['start_date'])); ?>
                  </div>
                </div>
                 <div class="col-6">
                  <label for="expiry_date" class="col-sm-6 control-label">End Date <span class="red">*</span></label>   
                  <input type="date" name="expiry_date" class="form-control" id="expiry_date" placeholder="" value="<?= set_value('expiry_date', date('Y-m-d', strtotime($offer['expiry_date']))); ?>">
                </div>
              </div> 
              <div class="form-group row"> 
              <div class="col-6">
                  <label for="description" class="col-sm-6 control-label">Description <span class="red">*</span></label>   
                  <textarea name="description" class="form-control" id="description" ><?= set_value('description', $offer['description']); ?></textarea>
                </div>
              </div> 
              <div class="form-group">
                <div class="col-md-12">
                  <input type="hidden" name="_id" value="<?=$offer['_id']?>">                  
                  <input type="hidden" name="title" value="<?= $offer['title']; ?>">
                  <input type="hidden" name="start_date" value="<?= date('Y-m-d', strtotime($offer['start_date'])); ?>">
                  <input type="hidden" name="offerimg" value="<?=$offer['offer_img']; ?>">
                  <input type="submit" name="submit" value="Update Offer" class="btn btn-info pull-right btn-submit">
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
  $(function () { 
    //Initialize Select2 Elements
    $('.select2').select2();
    $("body").on("change","#is_expiry",function(){
      var isexpire = $("#is_expiry  option:selected").val();
      if(isexpire=='true'){
        $('.selDate').show();
      }else{
        $('.selDate').hide();
        $('#start_date').val('');
        $('#expiry_date').val('');
      }
    });
    $('#is_expiry').trigger('change');

    $("#offerForm").validate({
      rules: {  
        expiry_date : "required",  
        description : "required",
      },
      messages: {
        expiry_date: "Please Select End Date", 
        description: "Please Enter Description", 
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#offerForm").valid()){
          $("#offerForm").submit();
      }
  });

  })
</script>  