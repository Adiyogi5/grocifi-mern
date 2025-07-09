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
                                                        <th>Amount</th>
                                                        <th>Type</th>
                                                        <th>Comment</th>
                                                        <th>Status</th>
                                                        <th>Date of Transaction</th>
                                                        <th>Date of Expiry</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <?php $i = 1;?>
                                                    <?php if (!empty($wallet)) {?>
                                                        <?php foreach ($wallet as $wkey => $wvalue) {?>
                                                            <tr>
                                                                <td><?=$i++;?></td>
                                                                <td><?=number_format($wvalue['wallet_amount'], 2);?>/-</td>
                                                                <td>
                                                                    <span class="badge bg-<?=($wvalue['transaction'] == 1) ? 'success' : 'danger'?>"><?=($wvalue['transaction'] == 1) ? 'Credit' : 'Debit'?> </span>
                                                                </td>
                                                                <td><?=$wvalue['description']?></td>
                                                                <td><?=($wvalue["transaction"] != 2) ? $amtStatus[$wvalue["is_active"]] : "-"?></td>
                                                                <td><?=date('d-M-Y h:i a', strtotime($wvalue['created']))?></td>
                                                                <td><?=date('d-M-Y h:i a', strtotime($wvalue['expire_on']))?></td>
                                                            </tr>
                                                        <?php }?>
                                                    <?php } else {?>
                                                        <tr class="text-center">
                                                            <td colspan="7">No Wallet History !!</td>
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
 