<?php $model = $this->session->userdata('model'); ?>
<!-- Select2 -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/select2/select2.min.css">
 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Update Coupon </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/coupon'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Coupon List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/coupon/edit/'.$coupon['_id']), 'class="form-horizontal" id="couponForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                <div class=" row">          
                    <label for="title" class="col-sm-6 control-label">Coupon Code <span class="red">*</span></label><div class="form-control"><?=$coupon['title']; ?></div>
                    <input type="hidden" name="title" value="<?= set_value('title',$coupon['title']); ?>">
                  </div> 
                </div>
                 <div class="col-sm-6">
                  <label for="franchise_id" class="col-sm-6 control-label">Franchise Name<span class="red">*</span></label>
                   <select name="franchise_id" class="form-control select2" id="franchise_id" >
                    <option value="">Select Franchise</option>
                    <?php foreach ($franchise as $key => $value) { ?>
                      <option  <?php if(set_value('franchise_id',$coupon['franchise_id'])==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                    <?php } ?>
                  </select>
                  <label id="franchise_id-error" class="error" for="franchise_id"></label>
                </div>
              </div>

              <div class="form-group row">  
                <div class="col-6">
                  <label for="user_id" class="col-sm-6 control-label">User <span class="red">*</span></label> 
                   <input type="text" name="user_name" value="<?=@$userName?>" placeholder="User Name" id="user_name" class="form-control" />
                  <input type="hidden" name="user_id" id="user_id" value="<?=$coupon['user_id']; ?>">
                   
                </div>                  
                <div class="col-6">
                  <label for="has_expiry" class="col-sm-6 control-label">Select Will be Expire? <span class="red">*</span></label>                  
                  <select name="has_expiry" id="has_expiry" class="form-control">
                    <option value="">Select Option</option>
                    <option value="true" <?= (set_value('has_expiry',$coupon['has_expiry']) == true)?'selected': '' ?>>Yes</option>
                    <option value="false" <?= (set_value('has_expiry',$coupon['has_expiry']) == false)?'selected': '' ?>>Yearly</option>
                  </select>
                </div> 
               
              </div> 

              <div class="form-group row selDate">                   
                <div class="col-6">
                  <label for="start_date" class="col-sm-6 control-label">Start Date <span class="red">*</span></label>   
                  <input type="date" name="start_date" class="form-control" id="start_date" placeholder="Enter start date of offer." value="<?= set_value('start_date',date('Y-m-d',strtotime($coupon['start_date']))); ?>">
                </div>
                 <div class="col-6">
                  <label for="end_date" class="col-sm-6 control-label">End Date <span class="red">*</span></label>   
                  <input type="date" name="end_date" class="form-control" id="end_date" placeholder="Enter end date of Offer." value="<?= set_value('end_date',date('Y-m-d',strtotime($coupon['end_date']))); ?>">
                </div>
              </div>

               <div class="form-group row">                   
                <div class="col-6">
                  <label for="reuse_by_same_user" class="col-sm-6 control-label">Can user reuse by same code? <span class="red">*</span></label>   
                  <select name="reuse_by_same_user" class="form-control">
                    <option value="">Select Option</option>
                    <option value="true" <?= (set_value('reuse_by_same_user', $coupon['reuse_by_same_user']) == true)?'selected': '' ?>>Yes</option>
                    <option value="false" <?= (set_value('reuse_by_same_user', $coupon['reuse_by_same_user']) == false)?'selected': '' ?>>No</option>
                  </select>
                </div>
                 <div class="col-6">
                  <label for="uses_number" class="col-sm-6 control-label">Number of uses <span class="red">*</span></label>   
                   <input type="text" name="uses_number" class="form-control" id="uses_number" placeholder="Enter maximum number of uses, (0 for unlimited)." value="<?= set_value('uses_number',$coupon['uses_number']); ?>">
                </div>
              </div>

               <div class="form-group row">                   
                <div class="col-6">
                  <label for="disc_in" class="col-sm-6 control-label">Discount Manner <span class="red">*</span></label>   
                  <select name="disc_in" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('disc_in',$coupon['disc_in']) == '1')?'selected': '' ?>>Percentage</option>
                    <option value="2" <?= (set_value('disc_in',$coupon['disc_in']) == '2')?'selected': '' ?>>Rupees</option>
                  </select>
                </div>
                 <div class="col-6">
                  <label for="disc_value" class="col-sm-6 control-label">Discount Value <span class="red">*</span></label>   
                  <input type="text" name="disc_value" class="form-control" id="disc_value" placeholder="Enter discount value" value="<?= set_value('disc_value',$coupon['disc_value']); ?>">
                </div>
              </div>

              <div class="form-group row">   
                <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Coupon Image <span class="red">*</span></label>  
                   <div class="row">
                  <div class="col-6">   
                  <input type="file" class="form-control" name="coupon_image" id="coupon_image" >
                   <input type="hidden" name="couponimg" value="<?=$coupon['coupon']; ?>">
                  </div>
                  <div class="col-6"> 
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>offer_banners/<?=$coupon['coupon']; ?>" class="logosmallimg"></p>   
                  </div>
                </div>
                </div>
                <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$coupon['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$coupon['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div>  
              </div>     
              <div class="form-group">
                <div class="col-md-12">
                  <input type="hidden" name="_id" value="<?=$coupon['_id']?>">
                  <input type="submit" name="submit" value="Update Coupon" class="btn btn-info pull-right btn-submit">
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
    var URL = "<?=base_url($model."/coupon/getuserbyName")?>";

    $("body").on("click",".generatecoupon",function(){
      ///console.log('checked');
      $.post('<?=base_url($model."/coupon/generatecoupon")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>', 
      },
      function(response){
        var data = JSON.parse(response);
         $('#title').val(data.data);
      });
    });  

    $("body").on("change","#has_expiry",function(){
      var isexpire = $("#has_expiry  option:selected").val();
      if(isexpire=='true'){
        $('.selDate').show();
      }else{
        $('.selDate').hide();
        $('#start_date').val('');
        $('#end_date').val('');
      }
    });
    $("body").on("keyup","#user_name",function(){
        var uname = $(this).val();
        if(uname==''){
          $('#user_id').val('');
        }
    });
    $('input[name=\'user_name\']').autocomplete({
      'source': function(request, response) {  
        $.ajax({
          url: URL+'/'+ encodeURIComponent(request.term),
          dataType: 'json',
          success: function(json) {            
            response($.map(json, function(item) { 
              return {
                label: item['fname']+' '+item['lname']+' ('+item['phone_no']+') ',
                value: item['_id']
              }
            }));
          }
        });
      },
      'select': function(event, ui) {
        var label = ui.item.label;
        var value = ui.item.value; 
        setTimeout(function () {
          $('#user_name').val(label);
          $('#user_id').val(value);
        }, 1);       
      },
      focus: function( event, ui ) {
        var label = ui.item.label;
        var value = ui.item.value; 
        setTimeout(function () {
          $('#user_name').val(label);
          $('#user_id').val(value);
        }, 1);  
      }
    }); 
    $('#has_expiry').trigger('change');

    $("#couponForm").validate({
      rules: {
          title: {required: true, minlength: 5, maxlength:15 },
          franchise_id: "required", 
          has_expiry: "required",
          reuse_by_same_user: "required",
          uses_number:"required",
          disc_in: "required",
          disc_value: "required",
          is_active: "required", 
          coupon_image: { 
                  extension:"jpg|png|gif|jpeg",
                  },
      },
      messages: {
          title:  {
                  "required": "Please Enter Coupon Code", 
                  "minlength": "Min Coupon Code Should Be 5 Digits",
                  "maxlength": "Max Coupon Code Should Be 15 Digits",
              },
          franchise_id: "Please Select Franchise",
          has_expiry: "Please Select Will be Expire?", 
          reuse_by_same_user: "Please Enter Can user reuse by same code?", 
          disc_in : "Please Select Discount Manner",
          disc_value : "Please Enter Discount Value",
          is_active: "Please Select Status",  
          coupon_image:{ 
                    extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                  },
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#couponForm").valid()){
          $("#couponForm").submit();
      }
  });

  });
</script> 