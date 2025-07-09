<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-pencil"></i>
              &nbsp; Popup images  </h3>
          </div> 
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>

            <?php echo form_open_multipart(base_url($model.'/popslider'), 'class="form-horizontal" id="popsliderForm"' )?> 
              <div class="form-group">
                <?php 
                  $i=1;
                  foreach ($franchise as $key => $value) { ?>
                  <div class=" form-group row">
                  <div class="col-sm-4"><?=$i?>. <?=$value['firmname']?> <input type="hidden" name="franchiseId[]" value="<?=$value['_id']?>"></div>
                  <div class="col-sm-6">
                    <input type="file" id="popup_img<?=$i++?>" name="popup_img[]" > 
                    <?php
                     if(!empty($popimg[$value['_id']])){ ?>
                    <img  style="width:100px;" src="<?=$popimg[$value['_id']]?>">
                    <?php } ?>
                  </div>
                  <div class="col-sm-2">
                  <?php
                     if(!empty($popimg[$value['_id']])){ ?> <a href="<?=base_url($model.'/popslider/remove/'.$value['_id'])?>" title="Remove Slider"> <i class="fa fa-trash-o"></i> </a>
                   <?php } ?>   
                   </div>
                  </div>
                <?php } ?> 
              </div>  
             
              <div class="form-group">
                <div class="col-md-12"> 
                  <input type="submit" name="submit" value="Save" class="btn btn-info pull-right">
                </div>
              </div>
            <?php echo form_close(); ?>
        </div>
        <!-- /.box-body -->
      </div>
    </section>
  </div> 
