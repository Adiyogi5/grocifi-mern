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
                                        <div class="row align-items-center">
                                            <div class="col-6">
                                                <h5 class="card-title">
                                                    <?=$title?>
                                                </h5>
                                            </div>
                                            <div class="col-6 d-flex justify-content-end">
                                                <select id="notification-types" class="form-control w-50 border-form-control col-md-6 float-end">
                                                    <option value="">All</option>
                                                    <option value="general" <?php echo ($type=='general')?"selected":""; ?> >General Notification</option>
                                                    <option value="personal"  <?php echo ($type=='personal')?"selected":""; ?>>Personal Notification</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table class="table table-bordered table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Type</th>
                                                        <th>Title</th>
                                                        <th>Message</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php $i = 1;
                                                   ?>
                                                    <?php if (!empty($notify)) {?>
                                                        <?php foreach ($notify as $nkey => $nvalue) {?>
                                                            <tr>
                                                                <td><?=$i++;?></td>
                                                                <td><?=($nvalue["is_general"] == true) ? "General" : "Personal"?></td>
                                                                <td><?=$nvalue['mtitle']?></td>
                                                                <td><?=$nvalue['mbody']?></td>
                                                                <td><?=date('d-M-Y h:i a', strtotime($nvalue['created']))?></td>
                                                            </tr>
                                                        <?php }?>
                                                    <?php } else {?>
                                                        <tr class="text-center">
                                                            <td colspan="4">
                                                                No Notification For You !
                                                            </td>
                                                        </tr>
                                                    <?php }?>
                                                </tbody>
                                            </table>
                                        </div>                                    
                                
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
 <script type="text/javascript">
    var base_url = "<?=base_url()?>";
    $("#notification-types").change(function(){
        
        if($(this).val()==''){
            window.location.href= base_url+"notifications";
        }
        if($(this).val()=="general"){
            window.location.href= base_url+"notifications/general";
        }
        if($(this).val()=="personal"){
            window.location.href= base_url+"notifications/personal";
        }
    }); 
 </script>