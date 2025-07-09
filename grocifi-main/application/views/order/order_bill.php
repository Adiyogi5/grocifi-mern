<style type="text/css">
@media print {
  #footer {page-break-after: always;}
  body { font-size: 14px; }
}
body {font-size: 14px;}
p {
    margin-top: 0;
    margin-bottom: 0rem;
}
#order-table{
    line-height: 18px;
}
label{
    margin:0px;
}  
.table thead th {
    vertical-align: bottom;
    border: 2px solid #dee2e6;
    background-color: #f9f9ed !important;
    padding: 5px;
}
.table tbody td {
    vertical-align: bottom;
    border: 2px solid #dee2e6;
    padding: 5px;
}
.card-header {
    padding: 0.25rem;
}
h3 {
 margin-bottom: 0px;
}
.p-3 {
    padding: .25rem .50rem !important;
}
.pr-4, .card-body.p-0 .table thead > tr > th:last-of-type, .card-body.p-0 .table thead > tr > td:last-of-type, .card-body.p-0 .table tbody > tr > th:last-of-type, .card-body.p-0 .table tbody > tr > td:last-of-type, .px-4 {
    padding-right: .5rem !important;
}
</style>
<?php
$model = $this->session->userdata('model');
$toPayAmt = $order_details["final_total"]; 

if ($order_details["payment_method"] == 2 && $order_details["razorpay_payment_id"] != "") {
    $toPayAmt = 0;
}

if ($order_details["payment_method"] == 3) {
    $toPayAmt = 0;
}

if ($order_details["payment_method"] == 4 && $order_details["paytm_payment_id"] != "") {
    $toPayAmt = 0;
}

$status_class = array("1" => "badge-warning", "2" => "badge-info", "3" => "badge-primary", "4" => "badge-success", "5" => "badge-default", "6" => "badge-danger");
$btn_class = array("1" => "btn-outline-warning", "2" => "btn-outline-info", "3" => "btn-outline-primary", "4" => "btn-outline-success", "5" => "btn-outline-default", "6" => "btn-outline-danger");
?>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php'); ?>
        <div class="card" style="margin-bottom: 5px !important;">
            <div class="card-header">
                <div class="row col-sm-12">
                    <div class="col-sm-6">
                        <h3><?php echo $settings["site_name"]; ?></h3>
                    </div>
                    <div class="col-sm-6">
                        <h4 class="float-right">Mob. <?php echo $settings["support_number"]; ?></h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 5px !important;">
            <div class="row p-3">
                <div class="col-4">
                    <strong>From</strong><br />
                    <strong><?php echo $settings["site_name"]; ?></strong><br /> Email: <?php echo $settings["support_email"]; ?><br /> Customer Care: <?php echo $settings["support_number"]; ?><br />
                    Delivery By: <?php echo ($order_details["delivery_boy_id"]) ? $dboys[$order_details["delivery_boy_id"]] : "Not Assigned"; ?>
                </div>

                <div class="col-4">
                    <strong>To</strong><br />
                    <p class="user-details"><strong><?php echo $order_details["user"][0]["fname"] . " " . $order_details["user"][0]["lname"] ?></strong></p>
                    <p class="user-details">
                        <?php echo $delivery_address["address1"] . "<br/>" . $delivery_address["address2"] . "<br/>"; ?>
                        <label>Area</label>:&nbsp;<?php echo $delivery_address["area"][0]["title"]; ?>
                        <label>City</label>:&nbsp;<?php echo $delivery_address["city"][0]["title"] . "<br/>"; ?>
                        <label>State</label>:&nbsp;<?php echo $delivery_address["state"][0]["title"]; ?>
                        <label>Country</label>:&nbsp;<?php echo $delivery_address["country"][0]["title"] . "<br/>"; ?>
                        <label>Pincode</label>:&nbsp;<?php echo $delivery_address["pincode"] . "<br/>"; ?>
                        <label>Mobile No.:&nbsp;</label><strong><?php echo $order_details["user"][0]["phone_no"] . "<br/>"; ?></strong>
                        <strong><?php echo $order_details["user"][0]["email"] ?></strong>
                    </p>
                </div>

                <div class="col-4">
                    <strong>Retail Invoice</strong><br />
                    <strong>No:</strong> <?php echo $order_details["orderUserId"]; ?><br />
                    <strong>Bill Date:</strong> <?php echo date("d M Y") ?><br />
                    <strong>Order Date:</strong> <?php echo date("d M Y", strtotime($order_details["created"])); ?><br />
                    <strong>Delivery Date:</strong> <?php echo date("d M Y", strtotime($order_details["delivery_date"])); ?><br />
                    <strong>Delivery Time:</strong> <?php echo $order_details["delivery_time"]; ?><br />
                </div>

            </div>
        </div>

        <div class="card" style="margin-bottom: 5px !important;">
            <div class="row p-3">
                <div class="card-body table-responsive p-0 table-div">
                    <table class="table table-head-fixed text-nowrap" id="order-table">
                        <thead>
                            <tr>
                                <th width="5%" rowspan="2" >#</th>
                                <th width="31%" rowspan="2" >Title</th>
                                <th width="22%" style="text-align: center;" colspan="2">(Ordered)</th>
                                <th width="22%" style="text-align: center;"  colspan="2" >(Revised)</th>
                                <th width="10%" style="text-align: center;" rowspan="2" >Total</th>
                                <th width="10%" style="text-align: center;" rowspan="2" >Price</th>
                                <th width="10%" style="text-align: center;" rowspan="2" >Sub Total</th>
                            </tr>
                            <tr> 
                                <th style="text-align: center;">Qty x Unit</th>
                                <th style="text-align: center;">Price</th>
                                <th style="text-align: center;">Qty x Unit</th>
                                <th style="text-align: center;">Price</th>
                            </tr> 
                            <?php /* ?><tr>
                                <th width="5%" scope="col">#</th>
                                <th width="31%" scope="col">Title</th>
                                <th width="22%" scope="col">(Ordered) Qty x Unit</th>
                                <th width="22%" scope="col">(Revised) Qty x Unit</th>
                                <th width="10%" scope="col">Price</th>
                                <th width="10%" scope="col">Total Price</th>
                            </tr> <?php */ ?>
                        </thead>
                        <tbody>
                        <?php $i = 1;
                            foreach ($order_details["order_variants"] as $val) {
                                $revised = false;
                                $revisedstatus = $val['revised_status'];
                                $proprice = $val["price"]*$val["qty"];
                                if(isset($val["revised_price"])){
                                   $revised = ( $proprice!= $val["revised_price"])?true:false;
                                }
                                $order = $val["qty"]." x ".$val["measurement"]." ".$units[$val["unit"]];
                                $revised_order = " -- ";
                                if($revised){
                                    $revised_order = $val["revised_qty"]." x ".$val["revised_measurement"]." ".$units[$val["revised_unit"]];
                                }
                            ?>
                                <tr <?php if($revisedstatus!=1){ echo 'class="btn-outline-danger"'; } ?>>
                                    <td scope="row"><?php echo $i++; ?>.</td>
                                    <td><?php echo $val["title"]; ?></td>
                                    <td style="text-align: center;" class="<?php echo ($revised)?"strike-out":""; ?>">
                                        <?php echo $order; ?>
                                    </td>
                                    <td align="right" class="<?php echo ($revised)?"strike-out":""; ?>">      
                                    <?php  echo number_format($val["qty"] * $val["price"], 2); ?>
                                    </td>
                                    <td style="text-align: center;">
                                        <?php echo $revised_order; ?>
                                    </td>
                                    <td align="right"><?php echo ($revised)?number_format($val["revised_price"], 2):'--'; ?></td>
                                    <td align="right">
                                    <?php  
                                    if($val["revised_unit"]==1 || $val["revised_unit"]==3){
                                        echo ($val["revised_qty"]*$val["revised_measurement"]).' '.$units[$val["revised_unit"]];
                                    }elseif($val["revised_unit"]==2){
                                        $nqty = $val["revised_qty"]*$val["revised_measurement"];
                                        if($nqty >= 1000){
                                            echo ($nqty/1000).' '.$units[1];
                                        }else{
                                            echo $nqty.' '.$units[$val["revised_unit"]];
                                        }  
                                    }elseif($val["revised_unit"]==4){
                                        $nqty = $val["revised_qty"]*$val["revised_measurement"];
                                        if($nqty >= 1000){
                                            echo ($nqty/1000).' '.$units[3];
                                        }else{
                                            echo $nqty.' '.$units[$val["revised_unit"]];
                                        } 
                                    }else{
                                        echo ($val["revised_qty"]*$val["revised_measurement"]).' '.$units[$val["revised_unit"]]; 
                                    }
                                    ?>
                                    </td>
                                    <td align="right">      
                                    <?php echo ($revised)?number_format($val["revised_price"]/$val["qty"], 2):number_format($val["price"], 2); ?>
                                    </td>
                                    <td align="right"><?php echo ($revised)?number_format($val["revised_price"], 2):number_format($val["qty"] * $val["price"], 2); ?></td>
                                </tr>
                            <?php } ?>
                        </tbody>
                       <?php /* <tbody>
                            <?php $i = 1;
                            foreach ($order_details["order_variants"] as $val) {
                                $revised = ($val["price"] != @$val["revised_price"]) ? true : false;
                                $order = $val["qty"] . " x " . $val["measurement"] . " " . $units[$val["unit"]];
                                $revised_order = @$val["revised_qty"] . " x " . @$val["revised_measurement"] . " " . @$units[@$val["revised_unit"]];
                            ?>
                                <tr>
                                    <th align="right" scope="row"><?php echo $i++; ?>.</th>
                                    <td><?php echo $val["title"]; ?></td>
                                    <td class="<?php echo ($revised) ? "strike-out" : ""; ?>">
                                        <?php echo $order; ?>
                                    </td>

                                    <td>
                                        <?php echo $revised_order; ?>
                                    </td>

                                    <td align="right"><?php echo ($revised) ? number_format(@$val["revised_price"], 2) : number_format($val["price"], 2); ?></td>
                                    <td align="right">

                                        <?php echo ($revised) ? number_format(@$val["revised_price"], 2) : number_format($val["qty"] * $val["price"], 2); ?>
                                    </td>
                                </tr>
                            <?php } ?>
                        </tbody> */ ?>
                    </table>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 5px !important;">
            <div class="row p-3">
                <div class="col-sm-5"></div>
                <div class="col-sm-3"></div>
                <div class="col-sm-3" style="text-align: right;">
                    <p><strong>Total:&nbsp;</strong></p>
                    <p><strong>Wallet Used:&nbsp;</strong></p>
                    <p><strong>Delivery Charge:&nbsp;</strong></p>
                    <p><strong>Tax (%):&nbsp;</strong></p>
                    <p><strong>Discount:&nbsp;</strong></p>
                    <p><strong>Promo (-) Discount (Rs.):&nbsp;</strong></p>
                    <p><strong>Payment Method:&nbsp;</strong></p>
                    <p><strong>Final Total (Rs.):&nbsp;</strong></p>
                    <p><strong>Revised Amount(Rs.):&nbsp;</strong></p>
                    <p><strong>Payable Amount(Rs.):&nbsp;</strong></p> 
                </div>
                <div class="col-sm-1" style="text-align: right;">
                    <p><?php echo number_format($order_details["total"], 2); ?></p>
                    <p><?php echo number_format($order_details["key_wallet_balance"], 2); ?></p>
                    <p><?php echo number_format($order_details["delivery_charge"], 2); ?></p>
                    <p><?php echo number_format($order_details["tax_percent"], 2); ?></p>
                    <p><?php echo number_format($order_details["discount_rupee"], 2); ?></p>
                    <p><?php echo number_format($order_details["promo_discount"], 2); ?></p>
                    <p><?php echo $payment_method[$order_details["payment_method"]]; ?></p>
                    <p><?php echo number_format($order_details["final_total"], 2); ?></p>
                    <p><?php echo ($order_details["is_active"] == 4)?number_format($order_details["received_total"], 2):number_format(@$order_details["delivery_total"], 2); ?></p>
                    <p><?php
                    if($order_details["payment_method"]==1){
                        echo number_format($order_details["delivery_total"], 2);
                    }else{ 
                        if($order_details["payment_method"]==3){
                           echo number_format($order_details["delivery_total"] - $order_details["key_wallet_balance"], 2);
                        }else{
                            echo number_format($order_details["delivery_total"]-$order_details["final_total"], 2);
                        }
                    }
                    ?></p>
                </div>
            </div>
        <div class="col-sm-12 mt-1 mb-3">
            <button id="print-list-btn" class="btn btn-outline-primary btn-sm float-right" ><i aria-hidden="true" class="fa fa-print"></i> Print</button>
        </div>
        </div>
        </section>
</div>

<style>
    #order-table td {
        border-left: 1px solid #dee2e6 !important;
    }

    .strike-out {
        text-decoration: line-through;
    }
</style>

<script>
    $(document).ready(function() {

        $("#print-list-btn").click(function(e) {
            $('#print-list-btn').hide();
            $('.main-footer').hide();
            
            window.print();
            setTimeout(() => {
                $('#print-list-btn').show();
                $('.main-footer').show();
            }, 100);
        });
    });
</script>