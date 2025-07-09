<?php if (!$this->session->userdata('isLoggedIn')) {?>
<div class="modal fade login-modal-main" id="bd-example-modal">
   <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
         <div class="modal-body">
            <div class="login-modal">
               <div class="row">
                  <div class="col-lg-6 pad-right-0">
                     <div class="login-modal-left"> <img src="<?=$this->config->item('APIIMAGES') . 'setting_img/' . $this->general_settings['logo'];?>" class="modellogo"> </div>
                     <div id="app-link" class="app-link">
                        <a href="<?=$this->general_settings["short_link"]?>" target="_blank"><img src="<?=base_url() . 'assets/img/google.png';?>" alt="Google App" /></a>
                     </div>
                  </div>
                  <div class="col-lg-6"> 
                     <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>

                     <div class="login-modal-right"><!-- Tab panes -->
                        <div class="tab-content">
                           <div class="tab-pane active" id="login" role="tabpanel">
                              <?php echo form_open(base_url('/'), 'class="form-horizontal" name="loginForm" id="loginForm" method="post"'); ?>
                                 <h5 class="heading-design-h5">Login to your account</h5>
                                 <div id="login-txt" class="form-group">
                                    <label>Mobile number</label>
                                    <input type="tel" maxlength="10" name="phone" id="phone-login" class="form-control m-0" placeholder="Entre your mobile number">
                                    <input type="hidden" class="form-control" name="reqForm" value="login">
                                 </div>
                                 <div class="form-group">
                                    <button id="login-btn" type="button" class="btn btn-lg btn-secondary btn-block w-100 my-md-4 my-2">Enter to your account</button>
                                 </div>
                              </form>
                           </div>
                           <div class="tab-pane" id="register" role="tabpanel">
                              <?php echo form_open(base_url('/'), 'class="form-horizontal" name="signupForm" id="signupForm" method="post"'); ?>
                                 <h5 class="heading-design-h5">Register Now!</h5>
                                 <fieldset id="signup-txt-fname" class="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="fname" id="reg-fname" required class="form-control m-0" placeholder="Entre your first name.">
                                 </fieldset>

                                 <fieldset id="signup-txt-lname" class="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lname" required id="reg-lname" class="form-control m-0" placeholder="Entre your last name (optional).">
                                 </fieldset>

                                 <fieldset id="signup-txt" class="form-group">
                                    <label>Mobile number</label>
                                    <input type="tel" name="phone" id="phone-reg" class="form-control m-0" placeholder="Entre your mobile number">
                                    <input type="hidden" class="form-control m-0" name="reqForm" value="signup">
                                 </fieldset>
                                 <?php if ($this->general_settings['refer_earn']) {?>
                                 <fieldset class="form-group">
                                    <label>Friend Code</label>
                                    <input type="text" name="friends_code" id="friends_code" class="form-control m-0" placeholder="Optional">
                                 </fieldset>
                                 <?php }?>

                                 <fieldset class="form-group">
                                    <button id="signup-btn" type="button" class="btn btn-lg btn-secondary w-100 my-md-4 my-3 btn-block">Create Your Account</button>
                                 </fieldset>
                              </form>
                           </div>

                           <div class="tab-pane" id="varifyotp" role="tabpanel">
                              <?php echo form_open(base_url('/'), 'class="form-horizontal" name="varifyotpForm" id="varifyotpForm" method="post"'); ?>
                                 <h5 class="heading-design-h5">Verify OTP!</h5>
                                 <fieldset id="otp-phone-txt" class="form-group">
                                    <label>Mobile number</label>
                                    <input readonly type="tel" name="phone" id="phone-otp" class="form-control m-0" placeholder="+91 123 456 7890">
                                    <input type="hidden" class="form-control m-0" name="reqForm" value="varifyotp">
                                 </fieldset>

                                 <fieldset id="otp-txt" class="form-group">
                                    <label>OTP</label>
                                    <span id="otp-timer" style="float: right;">Timer</span>
                                    <input type="number" name="otp" id="otp" class="form-control m-0" placeholder="Please enter OTP">
                                 </fieldset>

                                 <fieldset class="form-group">
                                    <button id="otp-btn" type="button" class="btn btn-lg btn-secondary w-100 my-md-4 my-3 btn-block">Verify OTP</button><button id="resend-otp-btn" type="button" class="btn btn-lg w-100 my-md-4 my-3 btn-secondary btn-block margin-top-resendBtn hidden-div">Otp Resend</button>
                                 </fieldset>

                              </form>
                           </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="text-center login-footer-tab">
                           <ul class="nav nav-tabs" role="tablist">
                              <li class="nav-item">
                                 <a id="login-link" class="nav-link active" data-toggle="tab" href="#login" role="tab"><i class="mdi mdi-lock"></i> LOGIN</a>
                              </li>
                              <?php if ($this->general_settings['reg_required']) {?>
                              <li class="nav-item">
                                 <a id="reg-link" class="nav-link" data-toggle="tab" href="#register" role="tab"><i class="mdi mdi-pencil"></i> REGISTER</a>
                              </li>
                              <?php }?>
                              <li class="nav-item hidden-div">
                                 <a id="otp-link" class="nav-link" data-toggle="tab" href="#varifyotp" role="tab"><i class="mdi mdi-key-variant"></i> OTP</a>
                              </li>
                           </ul>
                        </div>
                        <div class="clearfix"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
<?php }?>
<!-- new -->
<!-- footer -->
<footer class="vcc_footer bg-lpurple">
    <div class="container">
        <div class="row justify-content-evenly">
            <div class="col-lg-3 col-md-6 col-12">
                <div class="row mt-lg-3">
                    <img src="<?=$this->config->item('APIIMAGES')?>setting_img/<?=@$this->general_settings['logowhite'];?>" alt="" class="w-75">
                </div>
                <div class="row vcc_footer_about">
                    <p>
                     <?=@$this->general_settings["footer_text"]?>
                    </p>
                </div>
                <div class="row">
                    <div class="col-6">
                        <ul class="d-flex justify-content-between" style="list-style: none!important;">
                            <li>
                                <a href="<?=$this->general_settings['insta_link']?>">
                                    <img src="<?=base_url('assets/img/Vector-1.png')?>" alt="" class="vcc_footer_slinks">
                                </a>
                            </li>
                            <li>
                                <a href="<?=$this->general_settings['fb_link']?>">
                                    <img src="<?=base_url('assets/img/f1.png')?>" alt="" class="vcc_footer_slinks">
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <img src="<?=base_url('assets/img/i1n.png')?>" alt="" class="vcc_footer_slinks">
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-12 d-flex justify-content-lg-center vcc_footer_links my-md-5 my-3">
                <div class="">
                    <h2>COMPANY</h2>
                    <ul class="ms-md-4 ms-2">
                        <li class=""><a href="<?=base_url('aboutus')?>" class="mx-2">About Us</a></li>
                        <li class=""><a href="<?=base_url('termsandconditions')?>" class="mx-2">Terms and Conditions</a></li>
                        <li class=""><a href="<?=base_url('contactus')?>" class="mx-2">Contact Us</a></li>
                        <li class=""><a href="<?=base_url('faq')?>" class="mx-2">FAQ</a></li>
                        <li class=""><a href="<?=base_url('franchise')?>" class="mx-2">Franchise</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-12 d-flex justify-content-lg-center vcc_footer_links my-md-5 my-3">
                <div class="">
                    <h2>CATEGORIES</h2>
                    <ul class="ms-md-4 ms-2">
                     <?php $category = WEBCATEGORY;?>
                     <?php if (!empty($category)) {?>
                        <?php foreach ($category['siteCategory'] as $fckey => $fcval) {?>
                           <li><a href="<?=base_url('products/' . $fcval['slug'])?>" class="mx-2"><?=$fcval["title"];?></a></li>
                        <?php }?>
                     <?php }?>
                     </ul>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-12 my-md-5 my-3 ">
                <h2 class="">CONTACT US</h2>
                <div class="col-12 vcc_footer_contact">
                    <div class="row align-items-center">
                    <div class="col-2 m-0">
                        <img src="<?=base_url('assets/img/email.png')?>" alt="">
                    </div>
                    <div class="col-10 m-0">
                        <a href="mailto:<?=$this->general_settings["support_email"]?>"><?=$this->general_settings["support_email"]?></a>
                    </div>
                    </div>
                    <div class="row align-items-center">
                        <div class="col-2">
                            <img src="<?=base_url('assets/img/phone.png')?>" alt="">
                        </div>
                        <div class="col-10">
                            <a href="tel:<?=$this->general_settings["support_number"]?>"><?=$this->general_settings["support_number"]?></a>
                        </div>
                    </div>
                    <div class="row align-items-baseline">
                        <div class="col-2">
                            <img src="<?=base_url('assets/img/address.png')?>" alt="">
                        </div>
                        <div class="col-10">
                            <a class="lh-sm"><?=$this->general_settings["site_address"];?></a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <img src="<?=base_url('assets/img/playstore.png')?>" alt="">
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- copyright -->
<section>
    <div class="container">
        <div class="row align-items-center">
            <div class="col-12 text-center">
                <p class="vcc_copyright_text mt-2">
                    © Copyright <?=date('Y')?> <strong><?=$this->general_settings['site_name']?></strong>. All Rights Reserved  Design and Developed by <a target="_blank" href="https://adiyogitechnosoft.com/"> Adiyogi Technosoft Pvt. Ltd.
                </p>
            </div>
        </div>
    </div>
</section>


<?php
$products_and_cats = $this->Commonmodel->getData($this->config->item('APIURL') . 'product/index', FRONT_TOKEN);
$temp = array();
if (isset($products_and_cats["sucess"]) && $products_and_cats["sucess"] == 200) {
    if (is_array($products_and_cats["data"]) && isset($products_and_cats["data"][0])) {
        foreach ($products_and_cats["data"] as $val) {
            if (isset($val["catagory"])) {
                if (isset($val["search_title"])) {
                    $temp[] = $val["search_title"];
                }
                $temp[] = $val["catagory"]["title"];
            }
        }
    }
}
$products_and_cats = $temp;
$products_and_cats = array_unique($products_and_cats);
sort($products_and_cats);
?>
<script>
   var SITEPATH = "<?=base_url();?>";
   var Token = "<?=$this->security->get_csrf_hash(); ?>";

   $(function() {
      var availableTutorials = [<?php echo '"' . implode('","', $products_and_cats) . '"'; ?>];
      $( "#InputSearch" ).autocomplete({
         minLength:2,
         delay:100,
         source: availableTutorials
      });
   });
</script>
<script src="<?=base_url()?>assets/dist/js/bootstrap.bundle.min.js"></script>

<script src="<?=base_url()?>assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- select2 Js -->
<script src="<?=base_url()?>assets/vendor/select2/js/select2.min.js"></script>
<!-- Owl Carousel -->
<script src="<?=base_url()?>assets/vendor/owl-carousel/owl.carousel.js"></script>
<!-- Custom -->
<script src="<?=base_url()?>assets/vendor/js/custom.js"></script>
<script src="<?=base_url()?>assets/vendor/js/auth.js"></script>
<script src="<?=base_url()?>assets/vendor/js/home_product.js"></script>
<script src="<?=base_url()?>assets/vendor/js/app.js"></script>
<script src="<?=base_url()?>assets/vendor/js/profile.js"></script>
<script src="<?=base_url()?>assets/vendor/js/order_imgs.js"></script>
<script src="<?=base_url()?>assets/vendor/js/placeorder.js"></script>
<script src="<?=base_url()?>assets/vendor/js/jquery.form.js"></script>
<script src="<?=base_url()?>assets/vendor/js/location_bound.js"></script>
<script src="<?=base_url()?>assets/vendor/js/location_address.js"></script>
<script src="<?=base_url()?>assets/vendor/js/contact.js"></script>
<script src="<?=base_url()?>assets/vendor/jquery/jquery.validate.min.js"></script>
<div class="cart-sidebar">
  
<?php $this->load->view('home/myCart'); ?>
</div>
</body>
</html>
