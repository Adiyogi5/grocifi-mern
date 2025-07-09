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
                                        <h5 class="card-title"><?=$title?></h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-bordered table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php $i = 1;?>
                                                    <?php if (!empty($myFriends)) {?>
                                                        <?php foreach ($myFriends as $fval) {?>
                                                            <tr>
                                                                <td><?=$i++;?></td>
                                                                <td><?=$fval['fname'] . ' ' . $fval['lname']?></td>
                                                                <td><?=$fval['phone_no']?></td>
                                                            </tr>
                                                        <?php }?>
                                                    <?php } else {?>
                                                        <tr class="text-center">
                                                            <td colspan="3">
                                                                No Friends Found !
                                                            </td>
                                                        </tr>
                                                    <?php }?>
                                                    <tr></tr>
                                                </tbody>
                                            </table>
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
 