<?php
$model = $this->session->userdata('model');
    $order_details = $order_details["data"][0];
    
    
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
    $status_class = array("1"=>"badge-warning", "2"=>"badge-info", "3"=>"badge-primary", "4"=>"badge-success", "5"=>"badge-default", "6"=>"badge-danger");
    $btn_class = array("1"=>"btn-outline-warning", "2"=>"btn-outline-info", "3"=>"btn-outline-primary", "4"=>"btn-outline-success", "5"=>"btn-outline-default", "6"=>"btn-outline-danger");
?>
<style type="text/css">
.table thead th {
    vertical-align: bottom;
    border: 2px solid #dee2e6;
    background-color: #f9f9ed !important;
}
.table tbody td {
    vertical-align: bottom;
    border: 2px solid #dee2e6;
}
</style>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php'); ?>
        <div class="card">
            <div class="card-header">
                <div class="d-inline-block">
                    <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Order Details </h3>
                </div>
            </div>
        </div>

        <div class="card">
            <div id="order-details" class="card-body" data-id="<?php echo $order_details["_id"]; ?>" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $this->security->get_csrf_token_name(); ?>" token-value="<?php echo $this->security->get_csrf_hash(); ?>">
            <div class="row">    
                <div class="col-sm-6 mt-2 row">
                    <div class="col-sm-4 text-right font-weight-bold">
                        Order Id:
                    </div>
                    <div class="col-sm-7">
                        <?php echo $order_details["orderUserId"]; ?>
                    </div>
                </div> 
                <div class="col-sm-6 mt-2 row">
                    <div class="col-sm-4 text-right font-weight-bold">
                        Order Date:
                    </div>
                    <div class="col-sm-7">
                        <?php echo date_time($order_details["created"]); ?>
                    </div>
                </div> 

                <div class="col-sm-6 mt-2 row">
                    <div class="col-sm-4 text-right font-weight-bold">
                        Delivery Date:
                    </div>
                    <div class="col-sm-7">
                        <?php echo date_time($order_details["delivery_date"]); ?>
                    </div>
                </div> 
                <div class="col-sm-6 mt-2 row">
                    <div class="col-sm-4 text-right font-weight-bold">
                        Delivered Date:
                    </div>
                    <div class="col-sm-7">
                        <?php echo ($order_details["delivered_date"]) ? date_time($order_details["delivered_date"]) : "No Delivered yet"; ?>
                    </div>
                </div> 

                <div class="col-sm-6 mt-2 row">
                    <div class="col-sm-4 text-right font-weight-bold">
                        Payment Method:
                    </div>
                    <div class="col-sm-7">
                        <?php echo $payment_method[$order_details["payment_method"]]; ?> | <?php echo $order_details["ordered_by"] ?> <?php echo (isset($order_details["os_devid_vc"])) ? "(" .$order_details["os_devid_vc"] . ")" : ''; ?>
                    </div>
                </div> 
                <div class="col-sm-6 mt-2 row">
                    &nbsp;
                </div>
                <div class="col-sm-12 mt-2 row">
                    <div class="col-sm-6 row">
                        <div class="col-sm-12 row">
                            <div class="col-sm-4 text-right font-weight-bold" style="padding-right: 0px;">
                                Customer Name:
                            </div>
                            <div class="col-sm-8">
                                <?php echo $order_details["user"][0]["fname"] . " " . $order_details["user"][0]["lname"]; ?>
                                <div class="div-review col-sm-8 <?php echo ($order_details["review"]["product_rate"]) ? '' : 'hide'; ?>" style="margin-top:15px;">
                                    <div class="col-sm-12 row">
                                        <div class="col-sm-4"><strong>Product Rating</strong> :</div>
                                        <div class="col-sm-8 text-success">
                                            <?php echo $order_details["review"]["product_rate"]; ?>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 row">
                                        <div class="col-sm-4"><strong>Delivery Boy Rating</strong> :</div>
                                        <div class="col-sm-8 text-success">
                                            <?php echo $order_details["review"]["dboy_rate"]; ?>
                                        </div>
                                    </div>
                                    <div class="col-sm-12">
                                        <?php echo $order_details["review"]["comment"]; ?>
                                    </div>
                                    <div class="col-sm-12 text-danger">
                                        <?php echo $order_details["review"]["why_low_rate"]; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12 row">
                            <div class="col-sm-4 text-right font-weight-bold" style="padding-right: 0px;">
                                Email:
                            </div>
                            <div class="col-sm-8">
                                <?php echo ($order_details["user"][0]["email"]) ? $order_details["user"][0]["email"] : "Not Available"; ?>
                            </div>
                        </div> 
                        <div class="col-sm-12 row">
                            <div class="col-sm-4 text-right font-weight-bold" style="padding-right: 0px;">
                                Contact:
                            </div>
                            <div class="col-sm-8">
                                <?php echo ($order_details["user"][0]["phone_no"]) ? $order_details["user"][0]["phone_no"] : "Not Available"; ?>
                            </div>
                        </div> 
                    </div>
                    <div class="col-sm-6 mt-2 row">
                        <div class="col-sm-12 mt-2 row">
                            <div class="col-sm-2 text-right font-weight-bold">
                                Address:
                            </div>
                            <div class="col-sm-10">
                                <?php echo (nl2br($order_details["delivery_address"])); ?>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>    
 
            <div class="col-sm-12" style="padding: 0px; margin:10px 0px; ">
                <div class="card">
                    <div class="card-body table-responsive p-0 table-div">
                        <table class="table table-head-fixed text-nowrap" id="order-table">
                            <thead>
                                <tr>
                                    <th width="5%" rowspan="2" >#</th>
                                    <th width="31%" rowspan="2" >Title</th>
                                    <th width="22%" style="text-align: center;" colspan="2">(Ordered)</th>
                                    <th width="22%" style="text-align: center;"  colspan="2" >(Revised)</th>
                                    <th width="10%" style="text-align: center;" rowspan="2" >Total Price</th>
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
                                        <?php echo ($revised)?number_format($val["revised_price"], 2):number_format($val["qty"] * $val["price"], 2); ?>
                                        </td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div> 
            <div class="row">
                <div class="col-sm-2">
                <?php if($order_details['status']){ 
                    $mode=[];
                    foreach ($order_details['status'] as $key => $value) {
                        $mode[$value['order_status']] = $value['status_date'];
                    } 
                    ?>
                    <ul class="timeline">
                        <?php if(isset($mode[1])){ ?>
                        <li  class="timeline">
                            <div  class="timeline-icon"><i  class="fa fa-shopping-cart"></i></div> 
                            <div  class="timeline-body o1"><h2 >Recieved</h2><div  class="timeline-content"> <?php 
                            $date = str_replace('Z', '', $mode[1]);
                            echo date('d-m-Y h:i a',strtotime($date));?> </div></div> 
                        </li>
                        <?php } ?>
                        <?php if(isset($mode[2])){ ?> 
                        <li  class="timeline">
                            <div  class="timeline-icon"><i  class="fa fa-cogs"></i></div> 
                            <div  class="timeline-body o2"><h2 >Processed</h2><div  class="timeline-content"> <?php
                            $date = str_replace('Z', '', $mode[2]);
                            echo date('d-m-Y h:i a',strtotime($date));?> </div></div> 
                        </li>
                        <?php } ?>
                        <?php if(isset($mode[3])){ ?>
                        <li  class="timeline">
                            <div  class="timeline-icon"><i  class="fa fa-motorcycle"></i></div> 
                            <div  class="timeline-body o3"><h2 >Shipped</h2><div  class="timeline-content"> <?php
                            $date = str_replace('Z', '', $mode[3]);
                            echo date('d-m-Y h:i a',strtotime($date));?></div></div> 
                        </li>
                        <?php } ?>
                        <?php if(isset($mode[4])){ ?>
                        <li  class="timeline">
                            <div  class="timeline-icon"><i  class="fa fa-check"></i></div>
                            <div class="timeline-body o4"><h2 >Delivered</h2><div  class="timeline-content"> <?php
                            $date = str_replace('Z', '', $mode[4]);
                            echo  date('d-m-Y h:i a',strtotime($date));?> </div></div>                            
                        </li> 
                        <?php } ?>
                        <?php if(isset($mode[6])){ ?> 
                        <li  class="timeline">
                            <div  class="timeline-icon"><i  class="fa fa-trash"></i></div>
                            <div class="timeline-body o6"><h2 >Cancel</h2><div  class="timeline-content"> <?php
                            $date = str_replace('Z', '', $mode[6]);
                            echo date('d-m-Y h:i a',strtotime($date));?> </div></div>
                        </li>    
                       <?php } ?> 
                    </ul>
                <?php } ?>
                </div>
                <div class="col-sm-5 mt-2">
                    <table class="table">
                        <tr>
                            <td style="width:40%; text-align: right; font-weight: bold;" >Payment Method:</td>
                            <td style="width:60%; text-align: left;" >
                                <?php
                                echo $payment_method[$order_details["payment_method"]];
                                if ($order_details["key_wallet_used"] && $order_details["payment_method"]!=3) {
                                    echo ' & Wallet Payment';
                                }
                                ?>
                            </td>
                        </tr>
                        <?php if (@$order_details["razorpay_payment_id"] != "") { ?>
                        <tr>
                            <td style="width:40%; text-align: right;font-weight: bold;" >RazorPay TXNID:</td>
                            <td style="width:60%; text-align: left;" >
                                <?php echo $order_details["razorpay_payment_id"]; ?>
                            </td>
                        </tr> 
                        <?php } ?>
                        <?php if (@$order_details["paytm_payment_id"] != "") { ?>
                        <tr>
                            <td style="width:40%; text-align: right;font-weight: bold;" >Paytm TXNID:</td>
                            <td style="width:60%; text-align: left;" >
                                <?php echo $order_details["paytm_status"]["STATUS"] . " | " . $order_details["paytm_payment_id"]; ?>
                            </td>
                        </tr>     
                        <?php } ?>
                        <tr>
                            <td style="width:40%; text-align: right;font-weight: bold;" >Current Status:</td>
                            <td style="width:60%; text-align: left;" class="<?php echo $btn_class[$order_details["is_active"]]; ?>">
                                <?php echo  $order_status[$order_details["is_active"]]; ?>
                            </td>
                        </tr> 
                        <?php if(in_array($order_details["is_active"], array(1,2,3))){ ?>
                        <tr>
                            <td style="width:40%; text-align: right;font-weight: bold;" >Change Status To:</td>
                            <td>
                                <div class="row">
                                <div class="col-sm-12">
                                    <a id="change-status" data-val="<?php echo ($order_details["is_active"]+1); ?>" class="btn btn-sm <?php echo $btn_class[$order_details["is_active"]+1]; ?>" href="javascript:void(0);"><?php echo $order_status[$order_details["is_active"]+1]; ?></a>
                                </div>
                                </div>
                            </td>
                        </tr>
                        <?php 
                        if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['place_order']['is_delete']==1){  ?>
                        <tr>
                            <td style="width:40%; text-align: right;font-weight: bold;" >Mark Cancel:</td>
                            <td> 
                                <div class="col-sm-12">
                                    <a id="cancel-order" class="btn btn-sm btn-outline-danger" href="javascript:void(0);">Cancel</a>
                                </div> 
                            </td>
                        </tr>
                        <?php } ?>
                        <?php } ?>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Delivery Boy:</td>
                            <td>
                             <?php if($order_details["is_active"] < 4 && $order_details["is_active"]!=5){ ?> <select name="delivery_boy_id" id="delivery_boy_id" class="form-control custom-select form-control-border">
                                <option value="">Select Delivery Boy</option>
                                <?php foreach($dboys as $k=>$val){ ?>
                                    <option <?php echo ($order_details["delivery_boy_id"]==$k)?'selected':''; ?> value="<?php echo $k; ?>"><?php echo $val; ?></option>
                                <?php } ?>
                              </select>
                          <?php }else{ 
                            if(!empty($order_details["delivery_boy_id"])){
                                foreach($dboys as $k=>$val){ 
                                    if($order_details["delivery_boy_id"]==$k){
                                        echo @$val;
                                    }
                                }
                            }else{
                                echo "--";
                            }
                          } ?>
                            </td>
                        </tr>
                        <?php if($order_details["is_active"] < 4 && $order_details["is_active"]!=5){ ?>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Update Order Total:</td>
                            <td>
                                <div class="row">
                                    <div class="col-sm-7">
                                        <input type="text" name="revised_total" id="revised_total" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" class="form-control"></div>
                                    <div class="col-sm-3">
                                        <button id="revised_amout" class="btn btn-success">Update</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <?php } ?>
                        <tr>
                            <td colspan="2" >
                                <div class="row">
                                <div class="col-sm-6" style="text-align: right;">
                                    <a class="btn btn-sm btn-outline-success" target="_blank" href="https://api.whatsapp.com/send?phone=+91<?php echo $order_details["phone_no"]; ?>&text=Hello <?php echo $order_details["user"][0]["fname"]." ".$order_details["user"][0]["lname"]; ?>, Your order with ID : <?php echo $order_details["orderUserId"]; ?> is <?php echo $order_status[$order_details["is_active"]] ?>. Please take a note of it. If you have further queries feel free to contact us on (+91 8010981098). Thank you">Whats App</a>
                                </div>
                                <div class="col-sm-6">
                                <a class="btn btn-sm float-right btn-outline-primary" href="<?php echo base_url().$model."/order/order_bill/$_uid/$_oid"; ?>">Generate Bill</a>
                                </div>
                                </div>
                            </td>
                        </tr>
                    </table>  
                </div>     
                <div class="col-sm-5 mt-2" style="border-left: 1px solid darkgray;">
                    <table class="table">
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Total:</td>
                            <td style="width:50%; text-align: right;" >
                                <?php echo number_format($order_details["total"], 2); ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Discount:</td>
                            <td style="width:50%; text-align: right;" >
                                <?php echo number_format($order_details["discount_rupee"], 2); ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Delivery Charge:</td>
                            <td style="width:50%; text-align: right;" >
                                <?php echo number_format($order_details["delivery_charge"], 2); ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Tax (%):</td>
                            <td style="width:50%; text-align: right;" >
                                <?php echo number_format($order_details["tax_percent"], 2) ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Promo Disc (Rs.):</td>
                            <td style="width:50%; text-align: right;" >
                                <?php echo number_format($order_details["promo_discount"], 2) ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Wallet Used (Rs.):</td>
                            <td style="width:50%; text-align: right;" >
                                <?php echo number_format($order_details["key_wallet_balance"], 2) ?>
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;border-bottom: 2px solid #5b5b5b;" >Net Total:</td>
                            <td style="width:50%; text-align: right;border-bottom: 2px solid #5b5b5b;" >
                                <?php echo number_format($order_details["final_total"], 2); ?>
                            </td>
                        </tr>
                        <?php if(isset($order_details["opm_total"])){ ?>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Revised Total:</td>
                            <td style="width:50%; text-align: right;" >
                                <?php
                                if($order_details["is_active"]>=4){
                                    echo number_format($order_details["delivery_total"], 2);
                                }else{
                                    echo number_format($order_details["opm_total"], 2);
                                }
                            ?>
                            </td>
                        </tr> 
                        <?php } ?> 
                         <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Payable Amount(Rs.):</td>
                            <td style="width:50%; text-align: right;" >
                                <?php  
                                if($order_details["payment_method"]==1){
                                    echo number_format($order_details["delivery_total"], 2);
                                }else{ 
                                    if($order_details["payment_method"]==3){
                                       echo number_format($order_details["delivery_total"] - $order_details["key_wallet_balance"], 2);
                                    }else{
                                        echo number_format($order_details["delivery_total"]-$order_details["final_total"], 2);
                                    }
                                }
                                ?>
                            </td>
                        </tr> 
                        <?php  if($order_details["is_active"]==4){ ?>
                        <tr>
                            <td style="width:50%; text-align: right;font-weight: bold;" >Received Amount(Rs.):</td>
                            <td style="width:50%; text-align: right;" >
                                <?php 
                                if($order_details["is_active"]>=4){
                                    echo number_format($order_details["received_total"], 2); 
                                 }else{
                                     echo number_format($toPayAmt, 2); 
                                 }?>
                            </td>
                        </tr>  
                        <?php } ?>
                    </table>
                </div> 
            </div> 
          
            </div>
        </div>
    </section>
</div>
<style>
    .div-review {
        position: relative;
        min-width: 30em;
        background-color: #fff;
        padding: 1.125em 1.5em;
        font-size: 14px;
        border-radius: 1rem;
        box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
    }

    .div-review::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        bottom: 100%;
        left: 1.5em;
        border: .75rem solid transparent;
        border-top: none;
        border-bottom-color: #fff;
        filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1));
    }

#order-table td{
    border-left:1px solid #dee2e6 !important;
}
.strike-out{
    text-decoration: line-through;
}
</style>
<script src="<?php echo base_url(); ?>assets/dist/js/order-details.js"></script>