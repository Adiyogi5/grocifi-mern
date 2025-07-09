<!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Update <?=$utype?> </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/users/'.$mode); ?>" class="btn btn-success"><i class="fa fa-list"></i>  <?=$utype?> List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            <?php echo form_open_multipart(base_url($model.'/users/edit/'.$user['_id'].'/'.$mode), 'class="form-horizontal" id="userForm"');  ?> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="fname" class="col-sm-6 control-label">First Name <span class="red">*</span></label>
                  <input type="text" name="fname" class="form-control" id="fname" placeholder="" value="<?= set_value('fname',$user['fname']); ?>">
                </div>
                <div class="col-sm-6">
                <label for="lname" class="col-sm-6 control-label">Last Name <span class="red">*</span></label>  
                  <input type="text" name="lname" class="form-control" id="lname" placeholder="" value="<?= set_value('lname',$user['lname']); ?>">
                </div>
              </div>            
              <div class="form-group row">
                <div class="col-sm-6">
                <label for="phone_no" class="col-sm-6 control-label">Mobile <span class="red">*</span></label>  
                  <input type="text" name="phone_no" class="form-control" id="phone_no" placeholder=""   onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  value="<?= set_value('phone_no',$user['phone_no']); ?>">
                </div>
                <div class="col-sm-6">
                  <label for="email" class="col-sm-6 control-label">Email</label>
                  <input type="email" name="email" class="form-control" id="email" placeholder="" value="<?= set_value('email',$user['email']); ?>">
                </div>
              </div>
              <div class="form-group row">               
                <div class="col-sm-6">
                  <label for="dob" class="col-sm-6 control-label">DOB </label>
                  <input type="date" name="dob" class="form-control" id="dob" placeholder="" value="<?= set_value('dob', date('Y-m-d',strtotime($user['dob']))); ?>">
                </div>   
                <div class="col-sm-6">
                <?php if($mode!='wholesaler'){ ?>  
                  <label for="role_type" class="col-sm-6 control-label">Select Role <span class="red">*</span></label>
                  <div class="form-control"> 
                    <?php foreach ($role as $key => $value) { 
                      if(set_value('role_type',$user['role_type'])==$value['role_code']){ 
                        echo $value['title'];
                      }
                    }?>
                    <input type="hidden" name="role_type" id="role_type" value="<?=$user['role_type']?>">
                  </div>
                  <?php }else{ ?>
                    <input type="hidden" name="role_type" id="role_type" value="4">
                    <input type="hidden" name="is_wholesaler" id="is_wholesaler" value="1">
                     <label for="wholesaler_firmname" class="col-sm-6 control-label">Firm name </label>
                    <input type="text" name="wholesaler_firmname" class="form-control" id="wholesaler_firmname" placeholder="" value="<?= set_value('wholesaler_firmname', $user['wholesaler_firmname']); ?>">
                  <?php } ?> 
                </div>
              </div> 
               <?php if($mode=='wholesaler'){ ?>
              <div class="form-group row">  
                <div class="col-6">
                  <label for="visiting_card" class="col-sm-12 control-label">Visiting Card Image </label>     
                  <input type="file" class="form-control" name="visiting_card" id="visiting_card" >
                  <?php if($user['visiting_card']!='noimage.png'){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>user_img/<?=$user['visiting_card']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                  <input type="hidden" name="user_visiting_card" value="<?=$user['visiting_card']; ?>">
                </div>  
                <div class="col-6">
                  <label for="visiting_card" class="col-sm-12 control-label">GST No. </label>     
                  <input type="text" name="gst_no" class="form-control" id="gst_no" placeholder="" value="<?= set_value('gst_no', $user['gst_no']); ?>">
                </div>
              </div>
              <?php } ?>

              <?php if($mode=='customer' || $mode=='wholesaler'){ ?>
              <div class="form-group row"> 
                <div class="col-sm-6">
                  <label for="friends_code" class="col-sm-6 control-label">Friend's Code</label>
                  <div class="form-control bggray"><?=$user['friends_code']?>&nbsp;</div> 
                </div>
                <div class="col-sm-6">
                  <label for="refer_code" class="col-sm-6 control-label">Refer Code</label>
                  <div class="form-control bggray"><?=$user['refer_code']?>&nbsp;</div>  
                </div>
              </div> 
              <?php } ?>
              <div class="form-group row">   
                <div class="col-6">
                  <label for="img" class="col-sm-12 control-label">User Image </label>     
                  <input type="file" class="form-control" name="img" id="img" >
                  <?php if($user['img']!='noimage.png'){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>user_img/<?=$user['img']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                  <input type="hidden" name="user_image" value="<?=$user['img']; ?>">
                </div>   
                <div class="col-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active" id="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$user['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$user['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div>  
              </div> 
              <?php if($mode=='franchise'){ ?>
                <hr>
                <div class="form-group row">   
                  <div class="col-sm-6">
                    <label for="firmname" class="col-sm-6 control-label">Firm Name <span class="red">*</span></label>
                    <input type="text" name="firmname" class="form-control" id="firmname" placeholder="" value="<?= set_value('firmname',$franchise['firmname']); ?>">
                  </div>
                  <div class="col-sm-6">
                    <label for="ownername" class="col-sm-6 control-label">Firm Owner <span class="red">*</span></label>
                    <input type="text" name="ownername" class="form-control" id="ownername" placeholder="" value="<?= set_value('ownername',$franchise['ownername']); ?>">
                  </div>
                </div> 

                <div class="form-group row">   
                  <div class="col-sm-6">
                    <label for="ownermobile" class="col-sm-6 control-label">Firm Owner Mobile <span class="red">*</span></label>
                    <input type="text" name="ownermobile" class="form-control" id="ownermobile" placeholder="" value="<?= set_value('ownermobile',$franchise['ownermobile']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                  </div>
                  <div class="col-sm-6">
                    <label for="contactpersonname" class="col-sm-6 control-label">Contact Person Name <span class="red">*</span></label>
                    <input type="text" name="contactpersonname" class="form-control" id="contactpersonname" placeholder="" value="<?= set_value('contactpersonname',$franchise['contactpersonname']); ?>">
                  </div>
                </div> 

                <div class="form-group row">   
                  <div class="col-sm-6">
                    <label for="contactpersonmob" class="col-sm-6 control-label">Contact Person Mobile <span class="red">*</span></label>
                    <input type="text" name="contactpersonmob" class="form-control" id="contactpersonmob" placeholder="" value="<?= set_value('contactpersonmob',$franchise['contactpersonmob']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                  </div>
                  <div class="col-sm-6">
                    <label for="commission" class="col-sm-6 control-label">Commission <span class="red">*</span></label>
                    <input type="text" name="commission" class="form-control" id="commission" placeholder="" value="<?= set_value('commission',$franchise['commission']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                  </div>
                </div> 

                <div class="form-group row">   
                  <div class="col-6">
                    <label for="logo" class="col-sm-12 control-label">Firm Logo </label>     
                    <input type="file" class="form-control" name="logo" id="logo" >
                  <?php 
                   if($franchise['logo']!='No Image' && $franchise['logo']!='' ){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>firm_img/<?=$franchise['logo']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                  <input type="hidden" name="firm_img" value="<?=$franchise['logo']; ?>">
                  </div>   
                  <div class="col-6">
                    <label for="is_cod" class="col-sm-6 control-label">Cash On Delivery <span class="red">*</span></label>                
                    <select name="is_cod" id="is_cod" class="form-control">
                      <option value="">Select Option</option>
                      <option value="true" <?= (set_value('is_cod',$franchise['is_cod']) == '1')?'selected': '' ?>>Yes</option>
                      <option value="false" <?= (set_value('is_cod',$franchise['is_cod']) == '0')?'selected': '' ?>>No</option>
                    </select>
                  </div>  
                </div>
                

                  <div class="col-12 mt-5">
                  <h4> Franchise Settings </h4>
                  <hr>
                    <div class="form-group row">   
                      <div class="col-6">
                        <label for="isallow_global_product" class="col-sm-6 control-label">Allow Global Products <span class="red">*</span></label>                  
                        <select name="isallow_global_product" id="isallow_global_product" class="form-control"> 
                          <option value="true" <?= (set_value('isallow_global_product',$franchise['isallow_global_product']) == '1')?'selected': '' ?>>Yes</option>
                          <option value="false" <?= (set_value('isallow_global_product',$franchise['isallow_global_product']) == '')?'selected': '' ?>>No</option>
                        </select>
                      </div>
                      <div class="col-6">
                        <label for="accept_minimum_order" class="col-sm-6 control-label">Accept Minimum Order <span class="red">*</span></label>              
                        <select name="accept_minimum_order" id="accept_minimum_order" class="form-control"> 
                          <option value="true" <?= (set_value('accept_minimum_order',$franchise['accept_minimum_order']) == '1')?'selected': '' ?>>True</option>
                          <option value="false" <?= (set_value('accept_minimum_order',$franchise['accept_minimum_order']) == '')?'selected': '' ?>>False</option>
                        </select>
                      </div> 
                    </div>

                    <div class="form-group row">   
                      <div class="col-sm-6">
                        <label for="min_order" class="col-sm-6 control-label">Min Order <span class="red">*</span></label>
                        <input type="text" name="min_order" class="form-control" id="min_order" placeholder="" value="<?= set_value('min_order',$franchise['min_order']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                      </div>
                      <div class="col-sm-6">
                        <label for="min_order_wholesaler" class="col-sm-6 control-label">Min Order Wholesaler <span class="red">*</span></label>
                        <input type="text" name="min_order_wholesaler" class="form-control" id="min_order_wholesaler" placeholder="" value="<?= set_value('min_order_wholesaler',$franchise['min_order_wholesaler']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                      </div>
                    </div>
                    <div class="form-group row">   
                      <div class="col-sm-6">
                        <label for="delivery_chrge" class="col-sm-6 control-label">Delivery Chrge<span class="red">*</span></label>
                        <input type="text" name="delivery_chrge" class="form-control" id="delivery_chrge" placeholder="" value="<?= set_value('delivery_chrge',$franchise['delivery_chrge']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                      </div>
                      <div class="col-sm-6">
                        <label for="delivery_day_after_order" class="col-sm-6 control-label">Delivery Day After Order <span class="red">*</span></label>
                        <input type="text" name="delivery_day_after_order" class="form-control" id="delivery_day_after_order" placeholder="" value="<?= set_value('delivery_day_after_order',$franchise['delivery_day_after_order']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                      </div>
                    </div>
                     <div class="form-group row">   
                      <div class="col-sm-6">
                        <label for="delivery_max_day" class="col-sm-6 control-label"> Delivery Max Day<span class="red">*</span></label>
                        <input type="text" name="delivery_max_day" class="form-control" id="delivery_max_day" placeholder="" value="<?= set_value('delivery_max_day',$franchise['delivery_max_day']); ?>"  onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')"  >
                      </div> 
                    </div> 
                  </div>
              <?php } ?>
              <div class="form-group">
                <div class="col-md-6">
                <?php 
                if($this->general_settings['is_wholesaler']==1){
                  if($mode=='customer' || $mode=='wholesaler'){ 
                  if($mode=='customer'){ $conv='Wholesaler'; }else{ $conv='Customer'; } ?>  
                    <input type="button" mode="<?=ucfirst($mode)?>" usr="<?=$conv?>" name="button" value="Convert to <?=$conv?>" class="btn btn-danger pull-left" id="ConvertBtn">
                  <?php } 
                }
                ?>
                &nbsp;
                </div>
                <div class="col-md-6 pull-right">
                  <input type="hidden" name="contentmode" id="contentmode" value="<?=$mode?>">
                  <input type="hidden" name="_id" value="<?=$user['_id']?>">
                  <input type="hidden" name="firmId" value="<?=@$franchise['_id']?>">
                  <input type="submit" name="submit" value="Update <?=$utype?>" class="btn btn-info pull-right" id="submitBtn">
                </div>
              </div>
            <?php echo form_close( ); ?>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>
<script type="text/javascript">
  $(document).ready(function(){ 
    var mode = '<?php echo $mode ?>';
    var URL = "<?=base_url($model."/users/convert")?>";
    var uid = "<?php echo $user['_id'] ?>";
    $("body").on("change","#role_type",function(){
      var isrole = $("#role_type  option:selected").val();
      if((mode=='admin' || mode=='delivery_boy') && isrole!=''){
        if(isrole=='2'){
          $('#franchiseId').hide();        
          $('#franchise_id').val(''); 
        }else{
          $('#franchiseId').show();
        }
      }
    });
    $('#role_type').trigger('change');
  
  $("#ConvertBtn").click(function(e){   
    var usr = $(this).attr('usr');
    var mode = $(this).attr('mode');
    if(confirm("Are you sure? Do you want to Convert "+mode+" to "+usr+".")){
      if(usr=='Customer'){ mod='0'; }else{ mod='1'; }  
      window.location.href=URL+'/'+uid+'/'+mod; 
    }
  });

  $("#submitBtn").click(function(){ 
    var Content_Mode = $('#contentmode').val();
    var Roletype = $('#role_type').val(); 
    if (Content_Mode == "admin" && jQuery.inArray(Roletype,['7,8,9'])){ 
        $("#userForm").validate({
          rules: {
              fname:"required",
              lname: "required", 
              phone_no:"required", 
              email: {required: true, email: true}, 
              role_type: "required", 
              franchise_id: "required", 
              password:{
                        required: true,
                        minlength: 6
                    },
              confirm_pwd:{
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    },   
              is_active: "required", 
              img: {
                  ///required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
          },
          messages: {
              fname: "Please Enter First Name",
              lname: "Please Enter Last Name", 
              email: "Please Enter Valid Email Address", 
              role_type: "Please Select User Role",
              franchise_id: "Please Select Franchise",
              phone_no: {
                        "required": "Please Enter Mobile No",
                        "number": "Please Enter Valid Mobile No",
                        "minlength": "Mobile Should Be 10 Digits",
                        "maxlength": "Mobile Should Be 10 Digits",
                    },
                
                password: {
                    "required": "Please Enter Password",
                },
                confirm_pwd: {
                    "required": "Please Enter Confirm Password",
                    "equalTo": "Password And Confirm Password Should be Same",
                },
              is_active: "Please Select Status",   
              img:{
                  ///required:"Please Select User Image",
                  extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                   },
          }
        });
    }else if(Content_Mode == "admin" && Roletype=='2'){ 
        $("#userForm").validate({
          rules: {
              fname:"required",
              lname: "required", 
              phone_no:"required", 
              email: {required: true, email: true}, 
              role_type: "required", 
              password:{
                        required: true,
                        minlength: 6
                    },
              confirm_pwd:{
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    },   
              is_active: "required", 
              img: {
                  ///required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
          },
          messages: {
              fname: "Please Enter First Name",
              lname: "Please Enter Last Name", 
              email: "Please Enter Valid Email Address", 
              role_type: "Please Select User Role",
              phone_no: {
                        "required": "Please Enter Mobile No",
                        "number": "Please Enter Valid Mobile No",
                        "minlength": "Mobile Should Be 10 Digits",
                        "maxlength": "Mobile Should Be 10 Digits",
                    },
                
                password: {
                    "required": "Please Enter Password",
                },
                confirm_pwd: {
                    "required": "Please Enter Confirm Password",
                    "equalTo": "Password And Confirm Password Should be Same",
                },
              is_active: "Please Select Status",   
              img:{
                  ///required:"Please Select User Image",
                  extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                   },
          }
        });
    }else if(Content_Mode == "franchise"){ 
        $("#userForm").validate({
          rules: {
              fname:"required",
              lname: "required", 
              phone_no:"required", 
              email: {required: true, email: true}, 
              role_type: "required", 
              password:{
                        required: true,
                        minlength: 6
                    },
              confirm_pwd:{
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    },   
              is_active: "required", 
              img: {
                  //required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
              firmname:"required", 
              ownername:"required", 
              ownermobile:"required", 
              contactpersonname:"required", 
              contactpersonmob:"required",     
              commission:"required", 
              logo: { 
                  extension:"jpg|png|gif|jpeg",
                  },
              is_cod:"required",  
          },
          messages: {
              fname: "Please Enter First Name",
              lname: "Please Enter Last Name", 
              email: "Please Enter Valid Email Address", 
              role_type: "Please Select User Role",
              phone_no: {
                        "required": "Please Enter Mobile No",
                        "number": "Please Enter Valid Mobile No",
                        "minlength": "Mobile Should Be 10 Digits",
                        "maxlength": "Mobile Should Be 10 Digits",
                    },
                
                password: {
                    "required": "Please Enter Password",
                },
                confirm_pwd: {
                    "required": "Please Enter Confirm Password",
                    "equalTo": "Password And Confirm Password Should be Same",
                },
              is_active: "Please Select Status",   
              img:{
                  ////required:"Please Select User Image",
                  extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                   },
              firmname:"Please Enter Firm Name",
              ownername:"Please Enter Firm Owner Name",
              ownermobile:"Please Enter Firm Owner Mobile",
              contactpersonname:"Please Enter Contact Person Name",
              contactpersonmob:"Please Enter Contact Person Mobile",     
              commission:"Please Enter Commission",
              logo:{ 
                  extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                   },
              is_cod:"Please Select Delivery Option",
          }
        });
    }else if(Content_Mode == "customer"){ 
        $("#userForm").validate({
          rules: {
              fname:"required",
              lname: "required", 
              phone_no:"required",  
              role_type: "required", 
              password:{
                        required: true,
                        minlength: 6
                    },
              confirm_pwd:{
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    },   
              is_active: "required", 
              img: { 
                  extension:"jpg|png|gif|jpeg",
                  },
          },
          messages: {
              fname: "Please Enter First Name",
              lname: "Please Enter Last Name",   
              role_type: "Please Select User Role",
              phone_no: {
                        "required": "Please Enter Mobile No",
                        "number": "Please Enter Valid Mobile No",
                        "minlength": "Mobile Should Be 10 Digits",
                        "maxlength": "Mobile Should Be 10 Digits",
                    },
                
                password: {
                    "required": "Please Enter Password",
                },
                confirm_pwd: {
                    "required": "Please Enter Confirm Password",
                    "equalTo": "Password And Confirm Password Should be Same",
                },
              is_active: "Please Select Status",   
              img:{ 
                  extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                   },
          }
        });    
    }else if(Content_Mode == "delivery_boy"){ 
        $("#userForm").validate({
          rules: {
              fname:"required",
              lname: "required", 
              phone_no:"required",  
              role_type: "required", 
              franchise_id: "required", 
              password:{
                        required: true,
                        minlength: 6
                    },
              confirm_pwd:{
                        required: true,
                        minlength: 6,
                        equalTo: "#password"
                    },   
              is_active: "required", 
              img: {
                  ///required:true,
                  extension:"jpg|png|gif|jpeg",
                  },
          },
          messages: {
              fname: "Please Enter First Name",
              lname: "Please Enter Last Name",  
              role_type: "Please Select User Role",
              franchise_id: "Please Select Franchise",
              phone_no: {
                        "required": "Please Enter Mobile No",
                        "number": "Please Enter Valid Mobile No",
                        "minlength": "Mobile Should Be 10 Digits",
                        "maxlength": "Mobile Should Be 10 Digits",
                    },
                
                password: {
                    "required": "Please Enter Password",
                },
                confirm_pwd: {
                    "required": "Please Enter Confirm Password",
                    "equalTo": "Password And Confirm Password Should be Same",
                },
              is_active: "Please Select Status",   
              img:{
                  ///required:"Please Select User Image",
                  extension:"Please upload file in these format only (jpg, jpeg, png, gif)",
                   },
          }
        });
    }    
    $("#userForm").submit();  
  });
 
});  
</script>    