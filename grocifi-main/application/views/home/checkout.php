<?php 
$haveDefaultAddress = false;
$currency = $this->general_settings['currency'];
$edit_used_wallet_amount = 0;

if (empty($defaultAddress["defaultAddress_flag"]) || !$defaultAddress["defaultAddress_flag"]) {
    $haveDefaultAddress = true;
}

$haveAddress = $defaultAddress["number_of_address"];

$walletBalance =  "";

$addresses = "";
$deliveryAddress = "";
$country = $state = $city = $area = $subarea = $zip = $addr = "";

if ($_SESSION["authUser"]["isLoggedIn"]) {
    $old_order = array();
    $addresses = array();
    $userData = $_SESSION["authUser"]['user'];

    if(isset($_SESSION["edit_order"]["id"]) && !empty($_SESSION["edit_order"]["id"])){
        $old_order = $_SESSION["edit_order"]["old_order"]; 
        $delivery_address_id = $old_order[0]["delivery_address_id"];
        $addresses = $this->Commonmodel->getData($this->config->item('APIURL') . 'address/getdetailedaddress', FRONT_TOKEN, $delivery_address_id);
      
    }else{
        $addresses = $this->Commonmodel->getData($this->config->item('APIURL') . 'address/getdefaultaddressofuser', FRONT_TOKEN, $userData["_id"]);
      
    }
    $walletBalance = $this->Commonmodel->getData($this->config->item('APIURL') . 'user/getwalletbalance', FRONT_TOKEN, $userData["_id"]);

    $walletBalance = $walletBalance["wallet_balance"];
    if (isset($addresses["data"][0]) && is_array($addresses["data"][0]) && !empty($addresses["data"][0])) {
        $addresses = $addresses["data"][0];

        $addr = $addresses["address1"] . " " . $addresses["address2"];
        $deliveryAddress .= $addr;
        $zip = $addresses["pincode"];
        $mobile = $addresses["phone_no"];
        
        $area = $addresses["area"][0]["title"];
        $city = $addresses["city"][0]["title"];
        $state = $addresses["state"][0]["title"];
        $country = $addresses["country"][0]["title"];

        if (!empty($addresses["sub_areaId"])) {
            $subarea = $this->Commonmodel->getData($this->config->item('APIURL') . 'subarea/edit', FRONT_TOKEN, $addresses["sub_areaId"]);
          
            if (isset($subarea["data"]["_id"])) {
                $subarea = $subarea["data"]["title"];
            } else {
                $subarea = "";
            }
        }

        $deliveryAddress .= ", " . $subarea;
        $deliveryAddress .= ", " . $area;
        $deliveryAddress .= ", " . $city;
        $deliveryAddress .= ", " . $state;
        $deliveryAddress .= ", " . $country;
        $deliveryAddress .= ", Pincode " . $zip;
        $deliveryAddress .= ", Mobile:- " . $mobile;
    }
}

?>

<section class="pt-3 pb-3 page-info section-padding border-bottom bg-white">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <a href="<?php echo base_url(); ?>"><strong><span class="mdi mdi-home"></span> Home</strong></a> <span class="mdi mdi-chevron-right"></span> <a href="javascript:void(0);">Checkout</a>
            </div>
        </div>
    </div>
</section>
<section class="checkout-page section-padding">
    <div class="container">
        <div class="row" style="position:relative;">
            <?php if ($_SESSION["authUser"]["isLoggedIn"]) { ?>
            <?php $this->load->view('includes/_messages2.php') ?>
            <div class="col-md-8">
                <form action="" data-url="<?=base_url('checkout/')?>placeorder" id="form-place-order" name="placeorder" id="placeorder" method="post">
                    <div class="checkout-step">
                        <div class="accordion" id="accordionExample">
                            <div class="card checkout-step-one">
                                <div class="card-header" id="headingOne">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link collapsed" type="button"><span class="number">1</span> Delivery Address</button>

                                    </h5>
                                </div>
                             
                                <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <?php if ($haveDefaultAddress) { ?>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <div class="form-group">
                                                        <label class="control-label" style="font-weight:500;">Name : </label><br/>
                                                        <?php echo $userData['fname'] . " " . $userData['lname']; ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <div class="form-group">
                                                        <label class="control-label" style="font-weight:500;">Phone :</label><br/>
                                                        <?php echo $userData['phone_no']; ?>
                                                    </div>
                                                </div>
                                                <div class="col-sm-12">
                                                    <div class="form-group">
                                                        <label class="control-label"  style="font-weight:500;">Email Address: </label><br/>
                                                        <?php echo $userData['email']; ?>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <div class="form-group">
                                                        <label class="control-label"  style="font-weight:500;">Shipping Address :</label>
                                                        <br /><?php echo $addr; ?> <?php echo $subarea; ?><br />
                                                        <?php echo $area . " " . $city; ?><br />
                                                        <?php echo $state . " " . $country; ?><br />
                                                        Pincode:<?php echo $zip; ?><br />
                                                    </div>
                                                </div>
                                            </div>
                                            <?php if(isset($_SESSION["edit_order"]["id"]) && !empty($_SESSION["edit_order"]["id"])){
                                                //DO Nothing
                                            }else{ ?>
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <a class="btn btn-secondary mb-2 btn-lg" href="<?=base_url('myaddress')?>" role="button">Change Address.</a>
                                                </div>
                                            </div>
                                            <?php
                                            } ?>
                                        </div>
                                    <?php } else { ?>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <a class="btn btn-secondary mb-2 btn-lg" href="<?= ($haveAddress) ? base_url('myaddress') : base_url('add_address'); ?>" role="button">Add Address</a><br />
                                                    <span>
                                                        You don't have delivery address in current area. Please add a delivery address or Make a default delivery address of current area.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    <?php } ?>
                                </div>
                            </div>

                            <div class="card checkout-step-two">
                                <div class="card-header" id="headingTwo">
                                    <h5 class="mb-0">
                                       
                                        <button class="btn btn-link collapsed" type="button"><span class="number">2</span> Delivery Day And Time</button>
                                    </h5>
                                </div>
                               
                                <div id="collapseTwo" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                    <div class="card-body">
                                        <p style="font-weight:500;">Delivery Day</p>
                                        
                                        <input type="text" class="form-control readonly-transparent" id="delivery_date" name="delivery_date" value="<?= $nextDay; ?>" placeholder="Enter Delivery date" readonly style="width: 50%;float: left;" />

                                        <input style="background: transparent;border: 0;width: 50%;outline: none;text-align: center;vertical-align: middle;height: 35px;" type="text" id="alternate" name="alternate" value="<?= $formatedDate; ?>" disabled />
                                        
                                    </div>

                                    <div class="card-body">
                                        <p style="font-weight:500;">Delivery Time</p>
                                        <div id="avaible_time_slot">
                                        <?php
                                        foreach (@$deliveryTimeArr as $k => $dt) {
                                            echo '<label class="checkbox-inline">&nbsp;<input  class="check_time_slot_availability" ' . (($dt["is_available"]) ? "" : "disabled") . ' id="time_slot_' . $k . '" type="radio" name="delivery_time_id" value="' . $dt["id"]. '">&nbsp;&nbsp;' . $dt["title"] . '</label><br />';
                                        } ?>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <?php if ($haveDefaultAddress) { ?>
                            <div class="card checkout-step-three">
                                <div class="card-header" id="headingThree">
                                    <h5 class="mb-0">

                                    <button class="btn btn-link collapsed" type="button"><span class="number">3</span> Payment</button>
                                    </h5>
                                </div>
                                <?php
                                $cls1 = 'show-div';
                                $cls2 = 'hidden-div';
                               
                                if (@$this->general_settings['min_order']) {
                                    //---------------
                                } else {
                                    if ($this->general_settings['min_order'] == false && $this->general_settings['min_order'] <= @$Carttotal['total']) {
                                        //---------------------
                                    } else {
                                        $cls1 = 'hidden-div';
                                        $cls2 = 'show-div';
                                    }
                                } ?>
                              
                                <div id="collapseThree" aria-labelledby="headingThree" data-parent="#accordionExample">
                                    <div id="card-pay-btn" class="card-body <?php echo $cls1; ?>">
                                            <h5>Total Amount to be paid: <span><?php echo number_format(@$Carttotal['final_total'], 2); ?></span></h5> 
                                        <div class="row">
                                        <div class="col-sm-12" style="text-align: right;">
                                                <?php 
                                                $current_wb = $walletBalance;
                                                $walletBalance = $walletBalance + $edit_used_wallet_amount;
                                                if (empty(trim($walletBalance)) || 0 >= $walletBalance) { ?>
                                                    <label class="checkbox-inline"><strong>Wallet Balence: <?php echo $walletBalance; ?></strong></label>
                                                <?php } else { ?>
                                                    <label class="checkbox-inline"> Use Wallet Amount <input <?= (empty(trim($walletBalance)) ||  0 >= $walletBalance) ? 'disabled' : ''; ?> <?= $edit_used_wallet_checked; ?> name="key_wallet_used" id="key_wallet_used"  type="checkbox" value="true"></label><br />
                                                    <strong>(Wallet Balence: <?= $currency.' '.number_format($walletBalance, 2); ?>)</strong>
                                                <?php } ?>
                                            </div>
                                            <input type="hidden" name="delivery_address" value="<?php echo $deliveryAddress; ?>">

                                            <?php  if (empty($walletBalance) || $Carttotal['final_total'] > 0) { ?>
                                            <?php if(@$this->general_settings['is_cod']==1){ ?>
                                            <div class="col-sm-4 mb-2 method_cod">
                                                <label class="checkbox-inline"> 
                                                    <input checked type="radio" name="payment_method" id="cod" value="1">
                                                    &nbsp;<img src="<?=base_url('assets/')?>images/cod.png" alt="">
                                                </label>
                                            </div>
                                            <?php } ?>

                                            <?php if(@$this->general_settings['is_razorpay']==1){ ?>
                                            <div class="col-sm-4 mb-2 method_razorpay">
                                                <label style="margin-top: 15px;" class="checkbox-inline">
                                                    <input type="radio" id="razorpay" name="payment_method" value="2">
                                                    &nbsp;<img src="<?=base_url('assets/')?>images/razorpay.png" alt="">
                                                </label>
                                            </div>
                                            <?php } }else{ ?>
                                                <input checked type="hidden" name="payment_method" id="cod" value="1">
                                            <?php } ?>
                                         
                                            <div class="col-sm-6">
                                                <div class="input-group mb-3">
                                                    <?php
                                                    $cc_value = "";
                                                    $cc_disable = "";
                                                    $btn_text = "Apply";
                                                    $btn_class = "btn-secondary";
                                                    if (!empty($Carttotal['promo_code']) && !empty($Carttotal['promo_code'])) {
                                                        $btn_text = "Applied";
                                                        $cc_disable = "disabled";
                                                        $btn_class = "btn-success";
                                                        $cc_value = $Carttotal['promo_code'];
                                                    } ?>
                                                    <input type="text" class="form-control" id="promo-code" name="promo_code" value="<?php echo $cc_value; ?>" maxlength="10" placeholder="Enter Promo Code" <?php echo $cc_disable; ?> />
                                                    <button class="btn <?php echo $btn_class; ?>" type="button" id="ccApplyBtn" <?php echo $cc_disable; ?>> <?php echo $btn_text; ?> </button>
                                                </div>
                                            </div>

                                            <div class="col-sm-6">
                                                <button id="palce-order-button" type="button" type="button" class="btn btn-secondary mb-2 btn-lg">Place Order</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="card-msg-btn" class="card-body <?php echo $cls2; ?>">We accept minimum order amount  <?php echo $currency.' '.$min_order; ?>/-.</div>
                                </div>
                            </div>
                                <?php } ?>
                        </div>
                    </div>
                    <input type="hidden" name="csrf_test_name" value="<?=$this->security->get_csrf_hash(); ?>">
                </form>
            </div>
            <!-- Right cart block -->
            <div class="col-md-4 cart-onpage-div">
                <div class="card">
                    <h5 class="card-header">My Cart <span class="text-secondary float-right">(<?php echo $cartQty; ?> item)</span></h5>
                    <div class="card-body pt-0 pr-0 pl-0 pb-0">
                        <?php
                        if (isset($cartProduct[0]["cart_item"])) {
                            $ttlAmt = 0;
                            $fttlAmt = 0;
                            $ttlDiscAmt = 0;
                            foreach ($cartProduct[0]["cart_item"] as $val) { ?>
                                <div class="cart-list-product">
                                    <a class="float-right remove-cart" onclick="removeItem('<?php echo $val['_id'] ?>','<?=$val["qty"]?>')" href="javascript:void(0);"><i class="mdi mdi-close"></i></a>
                                    <?php
                                   
                                    $isDisc = false; 
                                    if ($val["disc"] != "" && $val["disc"] != "0" && $val["disc"] != null) {
                                       //$isDisc = true;
                                    } ?>
                                    <img class="img-fluid" src="<?= $this->config->item('PRODUCTIMAGEPATH').$val["image_url"] ?>" alt="">
                                    <h5><a href="<?=base_url('products/details/'.$val["frproductId"])?>"><?php echo $val["title"]; ?></a></h5>
                                    <h6><span class="mdi mdi-approval"></span> <?php echo $val["measurement"] . " " . @$unitTypeArr[$val["unit"]]; ?> </h6>
                                    <h6>
                                        <strong> Quantity &nbsp;&nbsp;</strong>
                                        <?php if ($val["qty"]>1 ) { ?>
                                            <button onclick="updateItem('<?php echo $val['_id']; ?>','<?php echo -1; ?>')" type="button" class="btn btn-primary btn-sm decreaseQty">-</button>
                                        <?php } ?>
                                        &nbsp;&nbsp;<?php echo $val["qty"]; ?>&nbsp;&nbsp;
                                        <?php if($val["qty"]<=1 || $val["qty"]>1){  ?>
                                            <button onclick="updateItem('<?php echo $val['_id']; ?>','<?php echo 1; ?>')" type="button" class="btn btn-primary btn-sm">+</button>
                                        <?php } ?>
                                    </h6> 

                                    <p class="offer-price mb-0"><?php echo $currency; ?>
                                        <?php
                                        if($isDisc){
                                          echo number_format($val["price"] - (($val["disc"] / 100) * $val["price"]), 2);
                                        }else{
                                          echo number_format($val["price"], 2);
                                        }  ?>
                                        <i class="mdi mdi-tag-outline"></i>
                                        <?php if (isset($val["mrp"]) && $val["mrp"] > 0) { ?>
                                            <span class="regular-price"><?php echo $currency; ?> <?php echo number_format($val["mrp"], 2); ?></span>
                                        <?php } ?>

                                        <?php if ($isDisc) { ?>
                                            <span class="regular-price"><?php echo $currency; ?> <?php echo number_format($val["price"], 2); ?></span>
                                        <?php } ?>
                                    </p>
                                </div>
                        <?php
                            }
                        }  ?>
                    </div>
                    <div class="card-body pt-0 pr-0 pl-0 pb-0 graybg">
                        <?php if (isset($cartProduct[0]["cart_total"])) { ?>
                            <div class="row pt-1 pr-1 pl-1 pb-1" >
                            <div class="col-sm-8">Total</div><div class="col-sm-4"><?=$Carttotal['total']?></div>
                            <div class="col-sm-8">Discount</div><div class="col-sm-4"><?=$Carttotal['disc']?></div>
                            <div class="col-sm-8">Promo. Discount<?php if($Carttotal['promo_disc']!=''){ echo '('.$Carttotal['promo_code'].')'; }?></div><div class="col-sm-4"><?=$Carttotal['promo_disc']?></div>
                            <div class="col-sm-8">Wallet Used</div><div class="col-sm-4"><?=$Carttotal['user_wallet']?></div>
                            <div class="col-sm-8">Delivery Charge</div><div class="col-sm-4"><?=@$Carttotal['delivery_charge']?></div>
                            <div class="col-sm-8">Final Total</div><div class="col-sm-4"><?=@$Carttotal['final_total']?></div>
                            </div>
                        <?php  
                         } ?>
                    </div>
                </div>
            </div>
            <?php }else{ ?>
                <h5 class="mb-0 text-center py-5 text-secondary">Please Login for proceed to checkout</h5>
            <?php } ?>
        </div>
    </div>
</section>

<script>
     
    $(function() {
        $("#delivery_date").datepicker({
            showAnim: "slideDown",
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: 'yy-mm-dd',
            altField: "#alternate",
            altFormat: "DD, d MM, yy",
            minDate: <?= $this->general_settings['delivery_day_after_order']; ?>,
            maxDate: <?= $this->general_settings['delivery_max_day'];?>,
            onSelect: function() {
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    url: "<?=base_url('cart/getDeliverySlot')?>",
                    data: {
                        'csrf_test_name' :Token, 
                        date: $(this).val(),
                        franchiseId: '<?= @front_auth_user('franchise')['franchiseId'] ?>',
                    },
                    success: function(data) {
                        if (data.status) {
                            var html = '';
                            data.data.forEach((ele, i) => {
                                console.log(ele);
                                var disabled = (ele.is_available == false)?'disabled':'';
                                html +=`<label class="checkbox-inline">&nbsp;<input  class="check_time_slot_availability" ${disabled} id="time_slot_${i}" type="radio" name="delivery_time_id" value="${ele.id}" >&nbsp;&nbsp;${ele.title}</label><br />`;
                            })
                             $('#avaible_time_slot').html(html);
                        }
                    }
                });
            }
        });
    });
   /* var SITEPATH ='<?= base_url()?>';
    var Token = '<?=$this->security->get_csrf_hash(); ?>';*/
</script>
<style>
    .ui-datepicker {
        width: 300px;
        height: 250px;
    }
</style>