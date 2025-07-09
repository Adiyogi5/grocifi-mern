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
              Add New Voucher </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/voucher'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Voucher List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/voucher/addvoucher'), 'class="form-horizontal"  id="voucherForm"');  ?> 
              <div class="form-group row">   
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
                 <div class="col-sm-6">
                  <label for="franchise_id" class="col-sm-6 control-label">Delivery Boy<span class="red">*</span></label>
                   <select name="user_id" class="form-control select2" id="user_id" >
                    <option value="">Select Delivery Boy</option> 
                  </select>
                  <label id="user_id-error" class="error" for="user_id"></label>
                </div>
              </div>     
              <div class="form-group row">   
                <div class="col-sm-6">
                  <label for="amount" class="col-sm-6 control-label">Amount <span class="red">*</span></label>
                  <input type="text" name="amount" class="form-control" id="amount" placeholder=""  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')" value="<?= set_value('amount'); ?>">
                </div>
                 
              </div>  
              <div class="form-group">
                <div class="col-md-12">
                  <input type="submit" name="submit" value="Add Voucher" class="btn btn-info pull-right btn-submit">
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

  $("body").on("change","#franchise_id",function(){ 
      $.post('<?=base_url($model."/users/getdeliveryboys")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        franchise_id : $(this).val(),
      },
      function(response){  
          $('#user_id').html(response);         
      });
    });

  $("#voucherForm").validate({
      rules: { 
          franchise_id: "required", 
          user_id: "required",
          amount: "required", 
      },
      messages: { 
          franchise_id: "Please Select Franchise",
          user_id: "Please Select Delivery Boy", 
          amount: "Please Enter Amount",  
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#voucherForm").valid()){
          $("#voucherForm").submit();
      }
  });
});  
</script>  