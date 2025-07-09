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
                                                <div class="col-6">
                                                    <div class="row align-items-center">
                                                        <div class="col-6"> 
                                                            <select id="order-month" class="form-control custom-select border-form-control order-time">
                                                                <option value="1" <?=(isset($current_month) && $current_month == 1) ? 'selected' : '';?>>January</option>
                                                                <option value="2" <?=(isset($current_month) && $current_month == 2) ? 'selected' : '';?>>February</option>
                                                                <option value="3" <?=(isset($current_month) && $current_month == 3) ? 'selected' : '';?>>March</option>
                                                                <option value="4" <?=(isset($current_month) && $current_month == 4) ? 'selected' : '';?>>April</option>
                                                                <option value="5" <?=(isset($current_month) && $current_month == 5) ? 'selected' : '';?>>May</option>
                                                                <option value="6" <?=(isset($current_month) && $current_month == 6) ? 'selected' : '';?>>June</option>
                                                                <option value="7" <?=(isset($current_month) && $current_month == 7) ? 'selected' : '';?>>July</option>
                                                                <option value="8" <?=(isset($current_month) && $current_month == 8) ? 'selected' : '';?>>August</option>
                                                                <option value="9" <?=(isset($current_month) && $current_month == 9) ? 'selected' : '';?>>September</option>
                                                                <option value="10" <?=(isset($current_month) && $current_month == 10) ? 'selected' : '';?>>October</option>
                                                                <option value="11" <?=(isset($current_month) && $current_month == 11) ? 'selected' : '';?>>November</option>
                                                                <option value="12" <?=(isset($current_month) && $current_month == 12) ? 'selected' : '';?>>December</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-6">
                                                            <select id="order-year" class="form-control custom-select border-form-control order-time">
                                                                <?php for ($i = 2020; $i <= date("Y"); $i++) {
                                                                        $selected = ($current_year == $i) ? 'selected' : '';
                                                                        echo '<option ' . $selected . ' value="' . $i . '" >' . $i . '</option>';
                                                                    }?>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="table-responsive">
                                                <table class="table table bordered table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Order #</th>
                                                            <th>Date Purchased</th>
                                                            <th>Status</th>
                                                            <th>Total</th>
                                                            <th>Final Total</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <?php $i = 1;?>
                                                        <?php if (!empty($orders)) {?>
                                                            <?php foreach ($orders as $ovalue) {?>
                                                                <tr>
                                                                    <td>#<?=$i++;?></td>
                                                                    <td><?=date("d M Y", strtotime($ovalue["created"]));?></td>
                                                                    <td><span class="<?=$ostcls[$ovalue["is_active"]];?>"><?=$ostatus[$ovalue["is_active"]];?></span></td>
                                                                    <td><?=$ovalue["total"];?></td>
                                                                    <td><?=$ovalue["final_total"];?></td>
                                                                    <td><a title="" href="<?=base_url('order/order_detail/'.$ovalue["_id"]);?>" class="btn btn-info btn-sm"><i class="mdi mdi-eye"></i></a></td>
                                                                </tr>
                                                            <?php }?>
                                                        <?php } else {?>
                                                            <tr class="text-center">
                                                                <td colspan="6" class="text-center">
                                                                    No Orders Found !!
                                                                </td>
                                                            </tr>
                                                        <?php }?>
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
 