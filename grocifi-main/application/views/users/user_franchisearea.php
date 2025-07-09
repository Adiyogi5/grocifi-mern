  <!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>  
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-list"></i>
              <?=$title?> of <?=$franchise['firmname']?></h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/users/franchise_detail/'.$franchise['userId']); ?>" class="btn btn-success"><i class="fa fa-list"></i> Franchise Detail</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>  
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="countryId" class="col-sm-6 control-label">Country Name <span class="red">*</span></label>
                  <select name="countryId" class="form-control" id="countryId" >
                    <option value="">Select Country</option>
                    <?php foreach ($country as $key => $value) { ?>
                      <option <?php if(set_value('countryId')==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                    <?php } ?>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label for="stateId" class="col-sm-6 control-label">State Name <span class="red">*</span></label>
                  <select name="stateId" class="form-control" id="stateId" >
                     <option value="">Select State</option>
                  </select>
                </div>   
              </div> 
              <div class="form-group row"> 
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
          <!-- /.box-body -->
        </div>
    </section> 
  </div>    
 <script type="text/javascript">
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
      $.post('<?=base_url($model."/locations/getfranchiseareabycity")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        city_id : $(this).val(),
        franchiseId: '<?php echo $id ?>',
      },
      function(response){  
         $('#arealist').html(response);          
      });
    });
    $("#countryId").trigger('change');
    setTimeout(function(){ 
      $("#stateId").val('<?= set_value('stateId'); ?>'); 
      $("#stateId").trigger('change'); 
    }, 1000);
    setTimeout(function(){ 
      $("#cityId").val('<?= set_value('cityId'); ?>'); 
      $("#cityId").trigger('change'); 
    }, 1500); 

    $('body').delegate('.updateArea', 'click', function() {
      if($(this).is(":checked")) {
        var ttype = 'save';
      }else{
        var ttype = 'delete';
      } 
      $.post('<?=base_url($model."/users/updatefranchisearea")?>',
        {
          '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
          franchiseId : '<?php echo $id ?>',
          areaId: $(this).val(),
          type : ttype,
        },
        function(response){
          var data = JSON.parse(response);
          if(data.sucess=='200'){  
            $.notify(data.msg, "success");
          }else{
            $.notify(data.msg, "error");
          }
        });

    });
</script> 