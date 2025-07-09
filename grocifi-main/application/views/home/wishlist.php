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
                                         
                                         
                                    
                                    <div class="course_navigation mt-4">
                                        <div class="container">
                                            <div class="row ">
                                                <nav aria-label="Page navigation example">
                                                     <?=$this->pagination->create_links();?>
                                                </nav>

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
        </div>
    </div>
</section>
 