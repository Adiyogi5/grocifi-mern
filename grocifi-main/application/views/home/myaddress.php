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
                                <div class="card">                                     
                                     <div class="user-card-header card-header">
                                            <div class="row">
                                                <div class="col-6">
                                                    <h5 class="card-title">
                                                        <?=$title;?>
                                                    </h5>
                                                </div>
                                                <div class="col-6 d-flex justify-content-end">
                                                    <a href="<?=base_url('add_address')?>" class="btn btn-sm bg-purple text-white">+ Add Address</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                            <?php $i = 1;?>
                                            <?php if (!empty($addresses)) { ?>
                                                <?php foreach ($addresses as $addresses) { ?>
                                                
                                                    <div class="col-6">
                                                        <div class="card mb-3"> 
                                                            <div class="card-header bg-lpurple">
                                                                <div class="row align-items-top">
                                                                <div class="col-6">
                                                                <h6 class="text-white">Address <?=$i++?> </h6></div>
                                                                <div class="col-6 text-end">
                                                                <a class="btn-sm btn-success" href="<?=base_url('edit_address/' . $addresses['_id'])?>" class="btn btn-sm btn-secondary"><i class="mdi mdi-pencil-box-outline"></i> Edit</a></div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div class="card-body">
                                                                <div class="row align-items-top">
                                                                    <div class="col-3">
                                                                        <label for="formGroupExampleInput" class="form-label">Name: </label>
                                                                    </div>
                                                                    <div class="col-8">
                                                                        <label><?=$user['fname'] . $user['lname']?></label>
                                                                    </div>
                                                                    <div class="col-3">
                                                                        <label for="formGroupExampleInput" class="form-label">Phone no: </label>
                                                                    </div>
                                                                    <div class="col-8">
                                                                        <label><?=$user['phone_no']?></label>
                                                                    </div>
                                                                    <div class="col-3">
                                                                        <label for="formGroupExampleInput" class="form-label">Address: </label>
                                                                    </div>
                                                                    <div class="col-8">
                                                                        <label>
                                                                            <?=$addresses['address1'] . "  , " . $addresses['address2']; ?>
                                                                            <br>
                                                                            <?=@$addresses['area']['title']. "  " . @$addresses['city']['title']; ?>
                                                                            <br>
                                                                            <?=@$addresses['state']['title'] . "  " . $addresses['country']['title']; ?>
                                                                            <br>
                                                                            <?=$addresses['pincode']?>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                <?php } ?>
                                            <?php } else { ?>
                                                    <div class="col-12 text-center">
                                                        <h6>No Address Added!</h6>
                                                    </div>                                         
                                            <?php } ?>
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
 