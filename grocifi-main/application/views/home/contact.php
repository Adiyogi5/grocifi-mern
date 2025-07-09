<?php  include('includes/breadcrumb.php'); ?>

<?php $this->load->view('includes/_messages')?>
<section class="section-padding">
         <div class="container">
            <div class="row">
               <div class="col-lg-4 col-md-4">
                  <h3 class="mt-1 mb-5">Get In Touch</h3>

                  <h6 class="text-dark"><i class="mdi mdi-home-map-marker"></i> Address :</h6>
                  <p><?php echo $this->general_settings["site_address"]; ?></a></p>
                  <h6 class="text-dark"><i class="mdi mdi-phone"></i> Phone :</h6>
                  <p><?php echo $this->general_settings["support_number"]; ?></p>

                  <h6 class="text-dark"><i class="mdi mdi-email"></i> Email :</h6>
                  <p><?php echo $this->general_settings["support_email"]; ?></p>
                  <h6 class="text-dark"><i class="mdi mdi-link"></i> Website :</h6>
                  <p><?php echo $this->general_settings["web_url"]; ?></p>
                  <div class="footer-social"><span>Follow : </span>
                     <a href="<?php echo $this->general_settings["fb_link"]; ?>" target="_blank"><i class="mdi mdi-facebook"></i></a>
                     <a href="<?php echo $this->general_settings["insta_link"]; ?>" target="_blank"><i class="mdi mdi-instagram"></i></a>
                     <!-- <a href="javascript:void(0);"><i class="mdi mdi-twitter"></i></a>
                     <a href="javascript:void(0);"><i class="mdi mdi-google"></i></a> -->
                  </div>
               </div>
               <div class="col-lg-8 col-md-8">
                  <div class="card">
                     <div class="card-body">
                       <?= @$this->general_settings["maplink"];  ?> 
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      <!-- End Contact Us -->
      <!-- Contact Me -->
      <section class="section-padding  bg-white">
         <div class="container">
            <div class="row">
               <div class="col-lg-12 col-md-12 section-title text-left mb-4">
                  <h2>Contact Us</h2>
               </div>

            <?php echo form_open(base_url('/submitenquiry'), 'class="form-horizontal" name="contactForm" id="contactForm" method="post" onsubmit="return validateContact()" '); ?>
                  <div class="control-group form-group">
                     <div class="controls">
                        <label>Full Name <span class="text-danger">*</span></label>
                        <input type="text" placeholder="Full Name" class="form-control" id="name" name="name">
                        <input type="hidden" name="query" value="true">
                     </div>
                  </div>
                  <div class="row">
                     <div class="control-group form-group col-md-6">
                        <label>Phone Number <span class="text-danger">*</span></label>
                        <div class="controls">
                           <input type="tel" placeholder="Phone Number" class="form-control" id="phone" name="phone">
                        </div>
                     </div>
                     <div class="control-group form-group col-md-6">
                        <div class="controls">
                           <label>Email Address <span class="text-danger">*</span></label>
                           <input type="email" placeholder="Email Address"  class="form-control" id="email" name="email">
                        </div>
                     </div>
                  </div>
                  <div class="control-group form-group">
                     <div class="controls">
                        <label>Message <span class="text-danger">*</span></label>
                        <textarea rows="4" cols="100" placeholder="Message" class="form-control" name="message" id="message" maxlength="999" style="resize:none"></textarea>
                     </div>
                  </div>
                  <div id="success"></div>
                  <!-- For success/fail messages -->
                  <button id="submit-btn" type="submit" class="btn btn-success mx-2 my-4">Send Message</button>
               </form>
            </div>
         </div>
      </section>
      <!-- End Contact Me -->
<script>
      function validateContact(){
         $(".err-msg").remove();
         if($("#name").val().trim() == ""){
            $("#name").focus();
            $("#name").addClass("error-border");
            $("#name").parent().append('<div class="err-msg">Please enter your full name.</div>');
            return false;
         }else{
            $("#name").removeClass("error-border");
         }
         if($("#phone").val().trim() == ""){
            $("#phone").focus();
            $("#phone").addClass("error-border");
            $("#phone").parent().append('<div class="err-msg">Please enter your phone number.</div>');
            return false;
         }else{
            $("#phone").removeClass("error-border");
         }
         if($("#email").val().trim() == ""){
            $("#email").focus();
            $("#email").addClass("error-border");
            $("#email").parent().append('<div class="err-msg">Please enter your email address.</div>');
            return false;
         }else{
            $("#email").removeClass("error-border");
         }
         if($("#message").val().trim() == ""){
            $("#message").focus();
            $("#message").addClass("error-border");
            $("#name").parent().append('<div class="err-msg">Please enter message.</div>');
            return false;
         }else{
            $("#message").removeClass("error-border");
         }
      }
   </script>
