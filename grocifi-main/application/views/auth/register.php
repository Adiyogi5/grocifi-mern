<div class="form-background"> 
  <div class="register-box">
    <div class="register-logo">
      <h2 class="fontwhile"><?=$this->general_settings['app_name']; ?> Register</h2>
    </div>

    <div class="card">
      <div class="card-body register-card-body">
        <p class="login-box-msg">Register a new membership</p>

        <?php $this->load->view('includes/_messages.php') ?>

        <?php echo form_open(base_url('auth/register'), 'class="login-form" '); ?>
          <div class="form-group has-feedback">
             <input type="text" name="username" id="name" value="<?= old("username"); ?>" class="form-control" placeholder="Username" >
          </div>
          <div class="form-group has-feedback">
            <input type="text" name="firstname" id="firstname" value="<?= old("firstname"); ?>" class="form-control" placeholder="First Name" >
          </div>
          <div class="form-group has-feedback">
           <input type="text" name="lastname" id="lastname" value="<?= old("lastname"); ?>" class="form-control" placeholder="Last Name" >
          </div>
          <div class="form-group has-feedback">
             <input type="text" name="email" id="email" value="<?= old("email"); ?>" class="form-control" placeholder="Email" >
          </div>
          <div class="form-group has-feedback">
             <input type="password" name="password" id="password" class="form-control" placeholder="Password" >
          </div>
          <div class="form-group has-feedback">
              <input type="password" name="confirm_password" id="confirm_password" class="form-control" placeholder="Confirm" >
          </div>
          <div class="row">
            <div class="col-8">
              <div class="checkbox icheck">
                <label>
                  <input type="checkbox"> I agree to the <a href="#">terms</a>
                </label>
              </div>
            </div>
            <?php if($this->recaptcha_status): ?>
              <div class="recaptcha-cnt">
                  <?php generate_recaptcha(); ?>
              </div>
            <?php endif; ?>
            <!-- /.col -->
            <div class="col-4">
              <input type="submit" name="submit" id="submit" class="btn btn-primary btn-block btn-flat" value="Register">
            </div>
            <!-- /.col -->
          </div>
        <?php echo form_close(); ?>

        <a href="<?= base_url('auth/login'); ?>" class="text-center">I already have a membership</a>
      </div>
      <!-- /.form-box -->
    </div><!-- /.card -->
  </div>
</div>
