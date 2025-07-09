<link rel="stylesheet" href="<?= base_url()?>assets/dist/css/login.css">
<div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center mb-5">
          <h2 class="heading-section"> Sign Into <?=ucfirst(@$cur_tab)?> Panel </h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-md-12 col-lg-10">
          <div class="wrap d-md-flex">
            <div class="text-wrap p-4 p-lg-5 text-center d-flex align-items-center  justify-content-center">
               <img src="<?=$this->config->item('APIIMAGES')?>setting_img/<?=$this->general_settings['logo'];?>" alt="Logo" class="login-image elevation-3">
            </div>
            <div class="login-wrap p-4 p-lg-5">

              <div class="d-flex">
                <div class="w-100">
                  <h3 class="mb-4">Sign In</h3>
                </div>
              </div>
               <?php $this->load->view('includes/_messages.php')?>
               <?php echo form_open(base_url('admin/login'), 'class="login-form" '); ?>
                <div class="form-group mb-3">
                  <label class="label" for="phone_no">Mobile Number</label>
                  <input type="text" name="phone_no" id="phone_no" class="form-control" placeholder="Mobile Number" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')" />
                </div>
                <div class="form-group mb-3">
                  <label class="label" for="password">Password</label>
                  <input type="password" name="password" id="password" class="form-control" placeholder="Password" />
                </div>
                <div class="form-group">
                  <button type="submit" id="submit" value="sumbit" name="submit" class="form-control btn btn-primary submit px-3">
                    Sign In
                  </button>
                </div>
                <div class="form-group d-md-flex">
                  <div class="w-50 text-left">
                    <label class="checkbox-wrap checkbox-primary mb-0">Remember Me
                      <input type="checkbox"/>
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <div class="w-50 text-md-right">
                    <a href="<?=base_url('admin/forgot_password')?>">Forgot Password</a>
                  </div>
                </div>
               <?php echo form_close(); ?>
            </div>
          </div>
        </div>
      </div>
</div>
