<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.11.4/themes/ui-lightness/jquery-ui.css">

<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php'); ?>
        <div class="card">
            <div class="card-header">
                <div class="row col-sm-12">
                    <h3>Order's Report</h3>
                </div>

                <?php echo form_open(base_url($model.'/order/report'), 'class="form-horizontal" id="xlsexportorder"'); ?>
                <div class="row col-sm-12">
                    <div class="col-sm-2"> <label for="fromDate">Order Date From:</label>
                    <input type="text" class="form-control" value="<?php echo $start_date; ?>" id="fromDate" name="fromDate" placeholder="Enter order date">
                    </div>
                    <div class="col-sm-2"> <label for="todate">Order Date To:</label>
                        <input type="text" class="form-control" value="<?php echo $end_date; ?>" id="todate" name="todate" placeholder="Enter order date">
                    </div>
                    <div class="col-sm-3">
                        <label for="franchise_id">Franchise</label>
                        <select name="franchise_id" class="form-control" id="franchise_id" > 
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                        <?php } ?>
                        </select>
                        <input type="hidden" name="isprint" id="isprint" value="1">
                    </div> 
                    <div class="col-sm-2">
                        <label for="category_id">Categories</label>
                        <select name="category_id" class="form-control" id="category_id" > 
                        <option value="" <?php if($category_id==''){ echo 'selected'; } ?> > All </option>
                        <?php foreach ($category as $key => $value) { ?>
                          <option <?php if($category_id==$value['_id']){ echo 'selected'; } ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                        <?php } ?>
                        </select>
                    </div> 
                    <div class="col-sm-3 textAligh-right" style="margin-top:35px;">
                        <?php if($this->session->userdata('role_type')!=3){ ?>
                         <button title="Export XLS" id="export_xls" class="btn btn-primary btn-sm float-right" style="margin-left:10px;"><i class="fa fa-file-excel-o" aria-hidden="true"></i> Export XLS</button>
                        <?php } ?>
                        <button title="Search" id="today-order-filter" class="btn btn-success btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button>
                    </div>
                </div>
                <?php echo form_close(); ?>
            </div>
        </div>

        <div class="card">
            <div class="row p-3">
                <div id="date-title" class="col-sm-12" style="text-align: center;font-weight: 800;">
                    Order report : <?php echo date("d M Y", strtotime($start_date)) . " - " . date("d M Y", strtotime($end_date)); ?>
                </div>
                <div class="card-body table-responsive p-0 table-div">
                    <table class="table table-head-fixed text-nowrap" id="border-table">
                        <thead>
                            <tr>
                                <th width="5%" scope="col">#</th>
                                <th width="15%" scope="col">Date</th>
                                <th width="10%" scope="col">Order Count</th>
                                <th width="15%" scope="col">Wallet Used</th>
                                <th width="15%" scope="col">Promo Discount</th>
                                <th width="20%" scope="col">Total Amount</th>
                                <th width="20%" scope="col">Final Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            <?php $i = 1;
                            if (!empty($order_report)) {
                                $order_count = $wallet_used = $promo_disc = $total = $final_total = 0;
                                foreach ($order_report as $k=>$val) {
                                    $order_count += $val["order_count"];
                                    $wallet_used += $val["wallet_used"];
                                    $promo_disc += $val["promo_disc"];
                                    $total += $val["total"];
                                    $final_total += $val["final_total"];
                                    ?>
                                    <tr>
                                        <th align="right" scope="row"><?php echo $i++; ?>.</th>
                                        <td align="center"><?php echo date("d M Y", strtotime($k)); ?></td>
                                        <td align="right"><?php echo $val["order_count"]; ?></td>
                                        <td align="right"><?php echo number_format($val["wallet_used"], 2); ?></td>
                                        <td align="right"><?php echo number_format($val["promo_disc"], 2); ?></td>
                                        <td align="right"><?php echo number_format($val["total"], 2); ?></td>
                                        <td align="right"><?php echo number_format($val["final_total"], 2); ?></td>
                                    </tr>
                            <?php }
                                echo '<tr>
                                <td align="right" colspan="2"><strong>'.count($order_report).' Day(s)</strong></td>
                                <td align="right"><strong>'.$order_count.'</strong></td>
                                <td align="right"><strong>'.number_format($wallet_used, 2).'</strong></td>
                                <td align="right"><strong>'.number_format($promo_disc, 2).'</strong></td>
                                <td align="right"><strong>'.number_format($total, 2).'</strong></td>
                                <td align="right"><strong>'.number_format($final_total, 2).'</strong></td>
                            </tr>';
                            } else {
                                echo '<tr><td align="center" colspan="7">Record(s) not found.</td>
                            </tr>';
                            } ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-sm-12 padding-10">
                <?php if (!empty($order_report)) { ?>
                    <button id="print-list-btn" class="btn btn-outline-primary btn-sm float-right"><i aria-hidden="true" class="fa fa-print"></i> Print</button><?php } ?>

                </div>
            </div>
        </div>
    </section>
</div>
<style>
#border-table td{
    border-left:1px solid #dee2e6 !important;
}
</style>
<script>
    $(document).ready(function() { 
        
        $( "#fromDate" ).datepicker({ 
          dateFormat: 'yy-mm-dd',  
          onClose: function( selectedDate ) {
            $( "#todate" ).datepicker( "option", "minDate", selectedDate ); 
            var date2 = $(this).datepicker('getDate'); 
            date2.setDate(date2.getDate()+30);  
            $('#todate').datepicker('option', {minDate: selectedDate, maxDate: date2});
          }
        });
        $( "#todate" ).datepicker({ 
          dateFormat: 'yy-mm-dd',  
          onClose: function( selectedDate ) { 
            var date2 = $(this).datepicker('getDate'); 
            date2.setDate(date2.getDate()-30);  
            $('#fromDate').datepicker('option', {minDate:date2 , maxDate: selectedDate});
          }
        });  

        $("#print-list-btn").click(function(e) {
            $('#print-list-btn').hide();
            $("#today-order-filter").hide();
            $("#today-order").hide();
            $('.main-footer').hide();
            window.print();
            setTimeout(() => {
                $('#print-list-btn').show();
                $("#today-order-filter").show();
                $("#today-order").show();
                $('.main-footer').show();
            }, 100);
        });
        $("#today-order-filter").click(function(e) {
            $('#isprint').val(0);
            $('#xlsexportorder').submit();  
        }); 
        $("#export_xls").click(function(e) { 
            e.preventDefault();
            if(confirm("Are you sure? Do you want to Export CSV of all filtered orders.")){ 
               $("#lodingalert").show(); 
               $('#isprint').val(1);
               $('#xlsexportorder').submit(); 
               setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
            }
        });
    });
</script>