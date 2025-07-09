<section class="account-page section-padding">
      <div class="container">
         <div class="row">
            <div class="col-lg-9 mx-auto">
               <div class="row no-gutters no-gutters-if">
                  <div class="col-md-10">
                     <div class="card card-body account-right account-right-if">
                        <div class="widget">
                           <div class="section-header">
                              <h5 class="heading-design-h5">
                                 Select Your Location
                              </h5>
                           </div>

                              <div class="row">
                                 <div class="col-sm-6">
                                    <div class="form-group">
                                       <label class="control-label">Country <span class="required">*</span></label>
                                       <select id="loc-country" class="form-control custom-select border-form-control">
                                          <option value="0">Select Country</option>
                                           <?php foreach ($search_country as $val) { ?>
                                               <option value="<?php echo $val["_id"]; ?>"><?php echo $val["title"]; ?></option>
                                           <?php } ?>
                                       </select>
                                    </div>
                                 </div>

                                 <div class="col-sm-6">
                                    <div class="form-group">
                                       <label class="control-label">State <span class="required">*</span></label>
                                       <select id="loc-state" class="form-control custom-select border-form-control">
                                          <option value="0">Select State</option>
                                       </select>
                                    </div>
                                 </div>
                              </div>

                              <div class="row">
                                 <div class="col-sm-6">
                                    <div class="form-group">
                                       <label class="control-label">City <span class="required">*</span></label>
                                       <select id="loc-city" class="form-control custom-select border-form-control">
                                          <option value="0">Select City</option>
                                       </select>
                                    </div>
                                 </div>

                                 <div class="col-sm-6">
                                    <div class="form-group">
                                       <label class="control-label">Area <span class="required">*</span></label>
                                       <select id="loc-area" class="form-control custom-select border-form-control">
                                          <option value="0">Select Area</option>
                                       </select>
                                    </div>
                                 </div>
                              </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
</section>
<!-- Free shipping cms -->
<section class="section-padding bg-white border-top mb-0">
   <div class="container">
      <div class="row">
         <div class="col-lg-4 col-sm-6">
            <div class="feature-box">
               <i class="mdi mdi-truck-fast"></i>
               <h6>Free & Next Day Delivery</h6>
               <p>Lorem ipsum dolor sit amet, cons...</p>
            </div>
         </div>
         <div class="col-lg-4 col-sm-6">
            <div class="feature-box">
               <i class="mdi mdi-basket"></i>
               <h6>100% Satisfaction Guarantee</h6>
               <p>Rorem Ipsum Dolor sit amet, cons...</p>
            </div>
         </div>
         <div class="col-lg-4 col-sm-6">
            <div class="feature-box">
               <i class="mdi mdi-tag-heart"></i>
               <h6>Great Daily Deals Discount</h6>
               <p>Sorem Ipsum Dolor sit amet, Cons...</p>
            </div>
         </div>
      </div>
   </div>
</section>
