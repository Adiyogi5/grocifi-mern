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
<?php $model = $this->session->userdata('model'); ?>
<?php
foreach ($orderdetails as $key => $value) {
$toPayAmt = $value["final_total"];

if ($value["payment_method"] == 2 && $value["razorpay_payment_id"] != "") {
    $toPayAmt = 0;
}

if ($value["payment_method"] == 3) {
    $toPayAmt = 0;
}

if ($value["payment_method"] == 4 && $value["paytm_payment_id"] != "") {
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
                    From<br />
                    <strong><?php echo $settings["site_name"]; ?></strong><br /> Email: <?php echo $settings["support_email"]; ?><br /> Customer Care: <?php echo $settings["support_number"]; ?><br />
                    Delivery By: <?php echo ($value["delivery_boy_id"]) ? $dboys[$value["delivery_boy_id"]] : "Not Assigned"; ?>
                </div>

                <div class="col-4">
                    To<br />
                    <p class="user-details"><strong><?php echo $value["user"][0]["fname"] . " " . $value["user"][0]["lname"] ?></strong></p>
                    <p class="user-details">
                        <?php echo nl2br($value["delivery_address"]); ?>
                        <strong><?php echo $value["user"][0]["email"] ?></strong>
                    </p>
                </div>

                <div class="col-4">
                    Retail Invoice<br />
                    <strong>No:</strong> <?php echo $value["orderUserId"]; ?><br />
                    <strong>Bill Date:</strong> <?php echo date("d M Y") ?><br />
                    <strong>Order Date:</strong> <?php echo date("d M Y", strtotime($value["created"])); ?><br />
                    <strong>Delivery Date:</strong> <?php echo date("d M Y", strtotime($value["delivery_date"])); ?><br />
                    <strong>Delivery Time:</strong> <?php echo $value["delivery_time"]; ?><br />
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
                        </thead>
                        <tbody>
                        <?php $i = 1;
                            foreach ($value["order_variants"] as $val) {
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
                            foreach ($value["order_variants"] as $val) {
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
                <div class="col-sm-2"></div>
                <div class="col-sm-3" style="text-align: right;">
                    <p><strong>Total:&nbsp;</strong></p>
                    <p><strong>Wallet Used:&nbsp;</strong></p>
                    <p><strong>Delivery Charge:&nbsp;</strong></p>
                    <p><strong>Tax (%):&nbsp;</strong></p>
                    <p><strong>Discount:&nbsp;</strong></p>
                    <p><strong>Promo (-) Discount (Rs.):&nbsp;</strong></p>
                    <p><strong>Payment Method:&nbsp;</strong></p>
                    <p><strong>Final Total (Rs.):&nbsp;</strong></p>
                    <p><strong>Revised Amount:&nbsp;</strong></p>
                    <p><strong>Payable Amount(Rs.):&nbsp;</strong></p> 
                </div>
                <div class="col-sm-2" style="text-align: right;max-width: 12%;">
                    <p><?php echo number_format($value["total"], 2); ?></p>
                    <p><?php echo number_format($value["key_wallet_balance"], 2); ?></p>
                    <p><?php echo number_format($value["delivery_charge"], 2); ?></p>
                    <p><?php echo number_format($value["tax_percent"], 2); ?></p>
                    <p><?php echo number_format($value["discount_rupee"], 2); ?></p>
                    <p><?php echo number_format($value["promo_discount"], 2); ?></p>
                    <p><?php echo $payment_method[$value["payment_method"]]; ?></p>
                    <p><?php echo number_format($value["final_total"], 2); ?></p>
                    <p><?php echo ($value["is_active"] == 4)?number_format($value["received_total"], 2):number_format(@$value["delivery_total"], 2); ?></p>
                    <p><?php
                    if($value["payment_method"]==1){
                        echo number_format($value["delivery_total"], 2);
                    }else{ 
                        if($value["payment_method"]==3){
                           echo number_format($value["delivery_total"] - $value["key_wallet_balance"], 2);
                        }else{
                            echo number_format($value["delivery_total"]-$value["final_total"], 2);
                        }
                    }
                    ?></p>
                </div>
            </div>
        </div>
    <div id="footer"></div>	
    </section>
</div>
<?php } ?>
<div class="row">
<div class="col-sm-12" style="margin-bottom: 10px;">
    <button id="print-list-btn" class="btn btn-primary float-right" ><i aria-hidden="true" class="fa fa-print"></i> Print Bills</button>
</div>
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