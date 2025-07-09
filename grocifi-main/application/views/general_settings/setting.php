<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
<div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
        <div class="card card-default color-palette-bo">
            <div class="card-header">
              <div class="d-inline-block">
                  <h3 class="card-title"> <i class="fa fa-pencil"></i>
                  General Settings </h3>
              </div>
            </div>
            <div class="card-body">   
                 <!-- For Messages -->
                <?php $this->load->view('includes/_messages.php') ?>

                <?php echo form_open_multipart(base_url($model.'/settings/updatesetting')); ?>	
                <!-- Nav tabs -->               

                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <?php  
                foreach ($parent_setting['type'] as $key => $value) {
                  if($key==1){
                    $istrue = 'true';
                    $isactive = 'active';
                  }else{
                    $istrue = 'false';
                    $isactive = '';   
                  }
                 ?>
                  <li class="nav-item">
                    <a class="nav-link <?php echo $isactive; ?>" id="pills-home-tab" data-toggle="pill" href="#<?php echo $value; ?>" role="tab" aria-controls="<?php echo $value; ?>" aria-selected="<?php echo $istrue; ?>"><?php echo $parent_setting['name'][$key]; ?></a>
                  </li> 
                 <?php } ?>  
                </ul>
                
                <!-- Tab panes -->
                <div class="tab-content"> 
                <?php  
                  foreach ($parent_setting['type'] as $key => $value) {
                    if($key==1){
                      $istrue = 'true';
                      $isactive = 'active';
                    }else{
                      $istrue = 'false';
                      $isactive = '';   
                    }
                   ?> 
                  <div role="tabpanel" class="tab-pane <?php echo $isactive; ?>" id="<?php echo $value; ?>">   
                  <div class="row"> 
                    <?php 
                    foreach ($general_settings[$key] as $skey => $svalue) { 
                      switch ($svalue['filed_type']) {
                      case "file":  ?>
                      <div class="col-sm-6">
                      <div class="form-group">
                          <label class="control-label"><?php echo ucwords(str_replace('_', ' ', $svalue['filed_label'])); ?></label><br/> 
                             <p><img src="<?= $this->config->item('APIIMAGES') ?>setting_img/<?=$svalue['filed_value']; ?>" class="<?=$svalue['filedval']?>smallimg" style="max-width:100px"></p> 
                         <input type="file" name="<?php echo $svalue['filedval']; ?>" >
                        <?php if($svalue['filedval']=='logo'){ ?>
                         <input type="hidden" name="logoImg" value="<?php echo $svalue['filed_value']; ?>">
                        <?php } 
                          if($svalue['filedval']=='favicon'){ ?>
                         <input type="hidden" name="favImg" value="<?php echo $svalue['filed_value']; ?>">
                        <?php } ?>
                         <p><small class="text-success">Allowed Types: gif, jpg, png, jpeg</small></p> 
                     </div>
                    </div>
                    <?php  
                      break;
                      case "text": ?>                       
                      <div class="col-sm-6"> 
                        <div class="form-group">
                          <label class="control-label"><?php  echo ucwords(str_replace('_', ' ', $svalue['filed_label'])); ?></label>
                          <input type="text" class="form-control" name="<?php echo $svalue['filedval']; ?>" placeholder="<?php echo $svalue['filed_label']; ?>" value="<?php echo html_escape($svalue['filed_value']); ?>">
                        </div> 
                      </div>
                    <?php  
                      break;
                      case "password":
                      ?>                      
                      <div class="col-sm-6"> 
                        <div class="form-group">
                          <label class="control-label"><?php  echo ucwords(str_replace('_', ' ', $svalue['filed_label'])); ?></label>
                          <input type="password" class="form-control" name="<?php echo $svalue['filedval']; ?>" placeholder="<?php echo $svalue['filed_label']; ?>" value="<?php echo html_escape($svalue['filed_value']); ?>">
                        </div>
                      </div>
                    <?php  
                      break;
                      case "select":
                      ?>
                      <div class="col-sm-6">
                        <div class="form-group">  
                          <label class="control-label"><?php  
                          if(ucwords(str_replace('_', ' ', $svalue['filed_label']))=='Sms On Status'){
                            echo 'Sms On Order';
                          }elseif(ucwords(str_replace('_', ' ', $svalue['filed_label']))=='Sms On General'){
                            echo 'Allow OTP (Login & Register)';
                          }else{
                            echo ucwords(str_replace('_', ' ', $svalue['filed_label']));
                          } ?></label>
                          <select class="form-control" name="<?php echo $svalue['filedval']; ?>" >
                            <option <?php if($svalue['filed_value']=='1'){ echo 'selected="selected"'; } ?> value="true" >True</option>
                            <option <?php if($svalue['filed_value']=='0'){ echo 'selected="selected"'; } ?> value="false" >False</option>
                          </select> 
                        </div>  
                      </div>  
                  <?php  
                      break;
                      case "textarea":
                      ?>
                      <div class="col-sm-6">
                        <div class="form-group">
                          <label class="control-label"><?php  echo ucwords(str_replace('_', ' ', $svalue['filed_label'])); ?></label>
                          <textarea class="form-control" name="<?php echo $svalue['filedval']; ?>" placeholder="<?php echo $svalue['filed_label'];?>" ><?php echo html_escape($svalue['filed_value']); ?></textarea> 
                        </div>    
                      </div>  
                  <?php } 
                    } ?>  
                  </div>   
                  </div>
                  <?php } ?>  

                </div> 
                <div class="box-footer">
                 <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['settings']['is_edit']) && $this->general_user_premissions['settings']['is_edit']==1)){ ?>  
                  <input type="hidden" name="_id" id="_id" value="<?=$id?>">
                    <input type="submit" name="submit" value="Save Changes" class="btn btn-primary pull-right">
                  <?php } ?>
                </div>	
                <?php echo form_close(); ?>
            </div>
        </div>
    </section>
</div>

<script>
    $("#setting").addClass('active');
    $('#myTabs a').click(function (e) {
     e.preventDefault()
     $(this).tab('show')
 })
</script>
