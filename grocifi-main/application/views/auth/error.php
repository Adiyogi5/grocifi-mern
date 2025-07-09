<div class="form-background">  
  <div class="login-box"> 
    <div class="login-logo">   
      <div class="login-logo">
      <a href="<?= base_url('admin'); ?>"><img src="<?= $this->config->item('APIIMAGES') ?>setting_img/<?=$this->general_settings['logo']; ?>" alt="Logo" class="brand-image elevation-3" style="opacity: .8; float: none;"> </a>
    </div>
    </div>     
        <h3 class="login-box-msg">404 Error</h3> 
        <?php if($this->session->flashdata('errors')): ?>
	      <div class="alert alert-danger"> 
	        <?= $this->session->flashdata('errors')?>
	        <?php  $this->session->unset_userdata('errors'); ?>
	      </div>
	    <?php endif; ?>
  </div>
 <!-- /.login-box -->
</div>

