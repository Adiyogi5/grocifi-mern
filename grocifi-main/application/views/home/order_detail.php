<section class="user_profile">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 my-lg-5 my-3">
                <div class="user_profile_card">
                    <div class="card vcc_profile_card">
                        <?php include('includes/userheader.php');?>
                         <div class="container mb-3">     
                            <div class="col-lg-12 mx-auto">
                                <div class="row no-gutters">
                                    <div class="card card-body account-right">
                                        <div class="widget">
                                            <div class="section-header">
                                                <h5 class="heading-design-h5">
                                                    Order Track
                                                </h5>
                                            </div>


                                            <div class="card blog">
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Order #: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            <?php echo $orders["order"]["orderUserId"]; ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Total Amount: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            Rs. <?php echo number_format($orders["order"]["total"], 2); ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Wallet Used: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            <?php
                                                            if ($orders["order"]["key_wallet_used"] == 1) {
                                                                echo "Rs. " . number_format($orders["order"]["key_wallet_balance"], 2);
                                                            } else {
                                                                echo "Not Used.";
                                                            } ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Dilivery Charges: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            Rs. <?php echo number_format($orders["order"]["delivery_charge"], 2); ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Final Amount: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            Rs. <?php echo number_format($orders["order"]["final_total"], 2); ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Payable Amount: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            Rs. <?php echo (number_format($orders["order"]["final_total"]-$orders["order"]["key_wallet_balance"], 2)); ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Payment Method: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            <?= $paymentMethodArr[$orders["order"]["payment_method"]]; ?>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-4">
                                                            <label>Delivery Address: </label>
                                                        </div>

                                                        <div class="control-group form-group col-md-6">
                                                            <?php echo $orders["order"]["delivery_address"]; ?>
                                                        </div>
                                                    </div>

                                                    <?php if ($orders["order"]["review"]['product_rate']) { ?>
                                                        <div class="row">
                                                            <div class="control-group form-group col-md-4">
                                                                <label>Product Rating: </label>
                                                            </div>

                                                            <div class="control-group form-group col-md-6">
                                                                <div class="rating-stars">
                                                                    <ul id="stars">
                                                                        <?php
                                                                        for ($i = 1; $i <= $orders["order"]["review"]['product_rate']; $i++) {
                                                                            echo '<li class="star selected" title="Poor" data-value="1"><i class="mdi mdi-star"></i></li>';
                                                                        }

                                                                        for ($i <= $orders["order"]["review"]['product_rate']; $i <= 5; $i++) {
                                                                            echo '<li class="star" title="Poor" data-value="1"><i class="mdi mdi-star"></i></li>';
                                                                        }
                                                                        ?>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="row">
                                                            <div class="control-group form-group col-md-4">
                                                                <label>Delivery Boy Rating: </label>
                                                            </div>

                                                            <div class="control-group form-group col-md-6">
                                                                <div class="rating-stars">
                                                                    <ul id="stars">
                                                                        <?php
                                                                        for ($i = 1; $i <= $orders["order"]["review"]['dboy_rate']; $i++) {
                                                                            echo '<li class="star selected" data-value="1"><i class="mdi mdi-star"></i></li>';
                                                                        }

                                                                        for ($i <= $orders["order"]["review"]['dboy_rate']; $i <= 5; $i++) {
                                                                            echo '<li class="star" data-value="1"><i class="mdi mdi-star"></i></li>';
                                                                        }
                                                                        ?>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <?php if (!empty($orders["order"]["review"]['comment'])) { ?>
                                                            <div class="row">
                                                                <div class="control-group form-group col-md-4">
                                                                    <label>Comment: </label>
                                                                </div>

                                                                <div class="control-group form-group col-md-6">
                                                                    <?php echo $orders["order"]["review"]['comment']; ?>
                                                                </div>
                                                            </div>
                                                        <?php }

                                                        if (!empty($orders["order"]["review"]['why_low_rate'])) { ?>
                                                            <div class="row">
                                                                <div class="control-group form-group col-md-4">
                                                                    <label>Why Low Rate: </label>
                                                                </div>

                                                                <div class="control-group form-group col-md-6">
                                                                    <?php echo $orders["order"]["review"]['why_low_rate']; ?>
                                                                </div>
                                                            </div>
                                                    <?php }
                                                    } else {
                                                        if($orders["order"]["is_active"] == "4"){
                                                            echo '<button id="order-review-btn" type="button" data-toggle="modal" data-target="#reviewModal" class="btn btn-outline-success btn-border btn-sm float-right"><i class="mdi mdi-star"></i> Rating</button>';
                                                        }
                                                    } ?>

                                                    <div class="row">
                                                        <div class="control-group form-group col-md-3">
                                                            <label>Product(s): </label>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="order-list-tabel-main table-responsive">
                                                            <?php if (is_array($orders["order"]) && $orders["order"]["order_type"] != 2) { ?>
                                                                <table class="datatabel table table-striped table-bordered order-list-tabel" width="100%" cellspacing="0">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Product</th>
                                                                            <th>Title</th>
                                                                            <th>Quantity</th>
                                                                            <th>Price</th>
                                                                            <th>Total Price</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <?php
                                                                        $ttl = 0;
                                                                        if (is_array($orders["order_variants"]) &&  isset($orders["order_variants"][0])) {
                                                                            foreach ($orders["order_variants"] as $val) { ?>
                                                                                <tr>
                                                                                    <td><img class="img-fluid" src="<?= $this->config->item('PRODUCTIMAGEPATH').$val['image_url'] ?> " height="50" width="50" alt=""></td>

                                                                                    <td>
                                                                                        <a href="#"><?php echo $val["title"]; ?></a>
                                                                                    </td>

                                                                                    <td><?php echo $val["qty"]; ?></td>
                                                                                    <td><?php echo number_format($val["price"], 2); ?></td>
                                                                                    <td><?php echo number_format($val["qty"] * $val["price"], 2); ?></td>
                                                                                </tr>
                                                                        <?php
                                                                                $ttl += number_format($val["qty"] * $val["price"], 2);
                                                                            }
                                                                        }
                                                                        ?>

                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td align="right">Wallet Used</td>
                                                                            <td><?php
                                                                                if ($orders["order"]["key_wallet_used"] == 1) {
                                                                                    echo "Rs. " . number_format($orders["order"]["key_wallet_balance"], 2);
                                                                                } else {
                                                                                    echo "Not Used.";
                                                                                }
                                                                                ?></td>
                                                                        </tr>


                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td align="right">Tax Amount</td>
                                                                            <td><?php echo number_format($orders["order"]["tax_amount"], 2); ?></td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td align="right">Disc. Amount</td>
                                                                            <td><?php echo number_format($orders["order"]["discount_rupee"], 2); ?></td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td align="right">Total Amount</td>
                                                                            <td><?php echo number_format($ttl, 2); ?></td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td align="right">Final Amount</td>
                                                                            <td><?php echo number_format($orders["order"]["final_total"], 2); ?></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table><?php
                                                                    } else {
                                                                        if (is_array($orders["order_variants"]) &&  isset($orders["order_variants"][0])) {
                                                                            foreach ($orders["order_variants"] as $val) {
                                                                                echo '<a href="' . $USERORDERIMG . $val["image_url"] . '" target="_blank"><div class="order-img-div no-border"><img id="user-img-nav1" alt="logo" src="./image.php?image=' . $USERORDERIMG . $val["image_url"] . '&amp;height=100&amp;width=100"></div></a>';
                                                                            }
                                                                        }
                                                                    }
                                                                        ?>
                                                        </div>
                                                    </div>
                                                    <?php if ($orders["order"]["is_active"] == '1') { ?>
                                                        <div class="row">
                                                            <div class="control-group form-group col-sm-4"></div>
                                                            <div class="control-group form-group col-sm-4">
                                                                <?php /* ?><button data-id="<?php echo $orders["_id"]; ?>" class="btn btn-outline-primary btn-border btn-sm float-right edit-link-btn"> <i class="mdi mdi-lead-pencil" aria-hidden="true"></i> Edit Order </button><?php */ ?>
                                                            </div>

                                                            <div class="control-group form-group col-sm-4">
                                                                <a data-id="<?php echo $orders["_id"]; ?>" class="btn btn-outline-danger btn-border btn-sm float-right cancel-link-btn" href="javascript:void(0);" role="button"> <i class="mdi mdi-delete"></i> Cancel Order </a>
                                                            </div>
                                                        </div>
                                                    <?php } ?>
                                                </div>
                                            </div>

                                            <div class="card sidebar-card mb-4">
                                                <div class="card-body">
                                                    <h5 class="card-title mb-3">Order Status</h5>
                                                    <ul class="sidebar-card-list">
                                                        <?php
                                                        if (is_array($orders["ostatus"]) &&  isset($orders["ostatus"][0])) {
                                                            foreach ($orders["ostatus"] as $val) { ?>
                                                                <li>
                                                                    <a href="javascript:void(0);">
                                                                        <i class="mdi mdi-chevron-right"></i>
                                                                        <span class="<?php echo $ostcls[$val["order_status"]]; ?>">
                                                                            <?php echo $ostatus[$val["order_status"]] ?>
                                                                        </span>
                                                                        <span class="float-right"><?php echo date("d M Y H:i A", strtotime($val["created"])); ?></span>
                                                                    </a>
                                                                </li>
                                                            <?php
                                                            }
                                                            ?>
                                                        <?php } ?>
                                                    </ul>
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
<!-- <script type="text/javascript">
    let Token = '<?=$this->security->get_csrf_hash(); ?>';
</script> -->