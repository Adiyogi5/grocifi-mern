<section class="user_profile">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 my-lg-5 my-3">
                <div class="user_profile_card">
                    <div class="card vcc_profile_card">
                        <?php include('includes/userheader.php');?>

                        <div class="container mb-3">                             
                            <?php $this->load->view('home/includes/_messages.php') ?>

                            <div class="row">    
                                <div class="col-md-12">
                                    <div class="user-card-header card-header">
                                            <h5 class="card-title"><?=$title?></h5>
                                        </div>
                                    <!-- Profile Update --> 
                                    <?=form_open_multipart(base_url('profile'), 'class="form-horizontal", id="updateProfile"')?>
                                        <div class="row">
                                            <div class="col-md-6 mb-md-3">
                                                <label for="inputEmail4" class="form-label">First Name</label>
                                                <input type="text" class="form-control" name="fname" value="<?=$user['fname']?>"> 
                                            </div>
                                            <div class="col-md-6 mb-md-3">
                                                <label for="inputEmail4" class="form-label">Last Name</label>
                                                <input type="text" class="form-control" name="lname" value="<?=$user['lname']?>"> 
                                            </div>
                                            <div class="col-md-6 mb-md-3">
                                                <label for="inputEmail4" class="form-label">Mobile No</label>
                                                <div class="form-control disabled"><?=$user['phone_no']?></div>
                                                 
                                            </div>
                                            <div class="col-md-6 mb-md-3">
                                                <label for="inputEmail4" class="form-label">Email Address</label>
                                                <input type="email" class="form-control" name="email" value="<?=$user['email']?>"> 
                                            </div>
                                            <div class="col-md-6 mb-md-3">
                                                <label for="inputEmail4" class="form-label">Wallet Balance</label>
                                                <div class="form-control disabled"><?=$user['wallet_balance']?></div> 
                                            </div>
                                            <div class="col-md-6 mb-md-3">
                                                <label for="inputEmail4" class="form-label">Refer Code</label>
                                                <div class="form-control disabled"><?=$user['refer_code']?></div> 
                                            </div>
                                            <div class="col-md-6 mb-md-5">
                                                <label for="inputEmail4" class="form-label">Profile Picture</label>
                                                <input type="file" class="form-control" name="img">
                                            </div>
                                            <div class="col-12 mb-md-3">
                                                <button name="submit" type="submit" class="btn vcc_profile_submit_btn">Update Profile</button>
                                            </div>
                                        </div>
                                    <?php echo form_close( ); ?>        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    $(document).ready(function(){
        $('#updateProfile').validate({
            rules:{
                fname : "required",
                lname : "required",
                email : "required",
            },
            messages:{
                fname : "Please Enter First Name",
                lname : "Please Enter Last Name",
                email : "Please Enter Email Address",
            }
        });
        $('body').on('click','.vcc_profile_submit_btn',function(){
            if($('#updateProfile').valid()){
             $('#updateProfile').submit();
            }
        });
    });        
</script>