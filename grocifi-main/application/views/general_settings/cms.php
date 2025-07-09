<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
<?php $model = $this->session->userdata('model'); ?>  
    <!-- Main content -->
    <section class="content">
        <div class="card card-default color-palette-bo">
            <div class="card-header">
              <div class="d-inline-block">
                  <h3 class="card-title"> <i class="fa fa-pencil"></i>
                  CMS Settings </h3>
              </div>
            </div>
            <div class="card-body">   
                 <!-- For Messages -->
                <?php $this->load->view('includes/_messages.php') ?>

                <?php echo form_open_multipart(base_url($model.'/settings/updatecms'), 'class="form-horizontal" id="cmsForm"'); ?>	 
                <!-- Tab panes -->
                <div class="tab-content"> 
                  <div> 
                    <?php 
                    foreach ($cms_content as $skey => $svalue) {
                      ?>
                        <div class="form-group">
                          <label class="col-md-12 control-label" style="font-size: 20px; margin-top: 10px; border-bottom: 1px solid #ddd;"><?php echo ucwords(str_replace('_', ' ', $skey)); ?></label>
                          <textarea class="form-control textarea" name="<?php echo $skey; ?>" placeholder="<?php echo $skey;?>" id="<?php echo $skey; ?>" ><?php echo html_escape($svalue); ?></textarea> 
                        </div>      
                  <?php  
                    } ?>  
                  </div>   

                </div> 
                <div class="box-footer">
                  <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['cms']['is_edit']) && $this->general_user_premissions['cms']['is_edit']==1)){ ?>  
                  <input type="hidden" name="_id" id="_id" value="<?=$id?>">
                    <input type="submit" name="submit" value="Save Changes" class="btn btn-primary pull-right">
                  <?php } ?>
                </div>	
                <?php echo form_close(); ?>
            </div>
        </div>
    </section>
</div>
<!-- Bootstrap WYSIHTML5 -->
<script src="<?= base_url() ?>assets/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>

<script type="text/javascript"> 
$(document).ready(function(){     
  // bootstrap WYSIHTML5 - text editor
    $('.textarea').wysihtml5({
      toolbar: { fa: true, "html": true},
      "html": true,  
      parser: function(html) {
        return html;
      }
    }) 
    $("#setting").addClass('active');
    $('#myTabs a').click(function (e) {
     e.preventDefault()
     $(this).tab('show')
 }) 
   
  $("#cmsForm").validate({
      rules: {
          "about":"required",
          "contactus": "required",  
          "FAQ": "required", 
          "Terms & Conditions":"required", 
          "Privacy Policy":"required",
          "Franchise":"required",
      },
      messages: {
          "about": "Please Enter About Us",
          "contactus": "PleaseEnter Contact Us", 
          "FAQ": "Please Enter FAQ",   
          "Terms & Conditions": "Please Enter Terms & Conditions", 
          "Privacy Policy": "Please Enter Privacy Policy", 
          "Franchise": "Please Enter Franchise Detail", 
      }
  });
  $("body").on("click", ".btn-submit", function(e){
      if ($("#cmsForm").valid()){
          $("#cmsForm").submit();
      }
  });
});  
</script> 
