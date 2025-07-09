<?php $model = $this->session->userdata('model'); ?>
 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Update Group Area </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/locations/area_group'); ?>" class="btn btn-success"><i class="fa fa-list"></i> Group Area List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open(base_url($model.'/locations/editarea_group'), 'class="form-horizontal" id="groupareaForm"');  ?> 
              <div class="form-group row">                
                <div class="col-6">
                  <label for="title" class="col-sm-6 control-label">Area Name <span class="red">*</span></label>
                  <input type="text" name="title" class="form-control" id="title" placeholder="" value="<?= set_value('title',$area_group['title']); ?>">
                </div>  
                <div class="col-sm-6">
                  <label for="countryId" class="col-sm-6 control-label">Country Name <span class="red">*</span></label>
                  <select name="countryId" class="form-control" id="countryId" >
                    <option value="">Select Country</option>
                    <?php foreach ($country as $key => $value) { ?>
                      <option <?php if(set_value('countryId',$countryId)==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                    <?php } ?>
                  </select>
                </div> 
              </div> 

              <div class="form-group row"> 
                <div class="col-sm-6">
                  <label for="stateId" class="col-sm-6 control-label">State Name <span class="red">*</span></label>
                  <select name="stateId" class="form-control" id="stateId" >
                     <option value="">Select State</option>
                  </select>
                </div> 
                <div class="col-6">
                  <label for="cityId" class="col-sm-6 control-label">City Name <span class="red">*</span></label>
                  <select name="cityId" class="form-control" id="cityId" >
                     <option value="">Select City</option>
                  </select>
                </div>    
              </div>
              <div class="form-group row">                 
                <div class="col-sm-12">
                  <label for="is_active" class="col-sm-6 control-label"> Areas : <span class="red">*</span></label>   
                    <div class="div-control row autoarealist" id="arealist">
                      
                    </div>
                </div>
              </div>
              <div class="form-group row">                 
                <div class="col-sm-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$area_group['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$area_group['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <div class="col-md-12">
                  <input type="hidden" name="_id" value="<?=$area_group['_id']?>">
                  <input type="submit" name="submit" value="Add Group Area" class="btn btn-info pull-right btn-submit">
                </div>
              </div>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>
  <script type="text/javascript">
  $(document).ready(function(){       
    $("body").on("change","#countryId",function(){ 
      $.post('<?=base_url($model."/locations/getstatebycountry")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        country_id : $(this).val(),
      },
      function(response){  
          $('#stateId').html(response);         
      });
    });
    $("body").on("change","#stateId",function(){ 
      $.post('<?=base_url($model."/locations/getcitybystate")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        state_id : $(this).val(),
      },
      function(response){  
          $('#cityId').html(response);         
      });
    });
     $("body").on("change","#cityId",function(){ 
      $.post('<?=base_url($model."/locations/getareabycity")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        city_id : $(this).val(),
        groupareaId : '<?=$area_group['_id']?>',
        mode:1,
      },
      function(response){  
          $('#arealist').html(response);         
      });
    });
    $("#countryId").trigger('change');
    setTimeout(function(){ 
      $("#stateId").val('<?= set_value('stateId', $stateId); ?>'); 
      $("#stateId").trigger('change'); 
    }, 1000);
    setTimeout(function(){ 
      $("#cityId").val('<?= set_value('cityId', $area_group['city_id']); ?>'); 
      $("#cityId").trigger('change'); 
    }, 1500); 

    $("#groupareaForm").validate({
      rules: {
          title: {required: true, minlength: 3, maxlength:50 },
          countryId:"required",
          stateId:"required",  
          cityId:"required",  
         /// areaId:"required",  
          is_active: "required",  
      },
      messages: {
          title: {
                  "required": "Please Enter Group Area Name", 
                  "minlength": "Min Group Area Name Should Be 3 Digits",
                  "maxlength": "Max Group Area Name Should Be 50 Digits",
              },  
          countryId: "Please Select Country Name", 
          stateId: "Please Select State Name", 
          cityId: "Please Select City Name", 
          //areaId: "Please Select Area Name", 
          is_active: "Please Select Status",  
      }
    });
    $("body").on("click", ".btn-submit", function(e){
        if ($("#groupareaForm").valid()){
            $("#groupareaForm").submit();
        }
    });
});
</script> 