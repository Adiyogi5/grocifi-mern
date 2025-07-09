<div class="form-background">
  <div class="login-box">
    <div class="login-logo">
      <img src="<?= $this->config->item('APIIMAGES') ?>setting_img/<?=$this->general_settings['logo']; ?>" alt="Logo" class="brand-image elevation-3" style="opacity: .8; float: none;"> 
    </div>
    
    <div class="card">
      <div class="card-body login-card-body">
        <p class="login-box-msg">Sign Into <?=ucfirst(@$cur_tab)?> Panel</p>

        <?php $this->load->view('includes/_messages.php') ?>
        
        <?php echo form_open(base_url('auth/login'), 'class="login-form" '); ?>
          <div class="form-group has-feedback">
            <input type="text" name="phone_no" id="phone_no" class="form-control" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')" placeholder="Phone no" >
          </div>
          <div class="form-group has-feedback">
            <input type="password" name="password" id="password" class="form-control" placeholder="Password" >
          </div>
          <div class="row">
            <div class="col-8">
              <div class="checkbox icheck">
                <label>
                  <input type="checkbox"> Remember Me
                </label>
              </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
              <input type="submit" name="submit" id="submit" class="btn btn-primary btn-block btn-flat" value="Sign In">
            </div>
            <!-- /.col -->
          </div>
        <?php echo form_close(); ?> 
        <!-- <p class="mb-1">
          <a href="<?= base_url('forgot_password'); ?>">I forgot my password</a>
        </p>  -->
      </div>
      <!-- /.login-card-body -->
    </div>
  </div>
  
</div>
          