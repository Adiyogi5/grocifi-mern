<!-- DataTables -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.css">
<?php
$token_name = $this->security->get_csrf_token_name();
$token_value = $this->security->get_csrf_hash();
$model = $this->session->userdata('model');
?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php') ?>
        <div class="card">
            <div class="card-header">
                <div class="d-inline-block" style="border-bottom: 1px solid #ddd;  width: 100%;  margin-bottom: 10px;">
                    <h3 class="card-title" style="width: 95%; float: left;"><i class="fa fa-list"></i>&nbsp; Order List </h3>
                    <span data-toggle="tooltip" title="<?=$color?>" data-placement="left" class="float-right qshelp"><i class="fa fa-question"></i></span>
                </div>
                <?php echo form_open(base_url($model.'/order/xlsexportorder'), 'class="form-horizontal" id="xlsexportorder"'); ?>
                <div id="location-filter" class="col-sm-12 row" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>">
                    <div class="col-sm-2">
                        <label for="search_franchise_id">Franchise</label>
                        <select name="search_franchise_id" class="form-control" id="search_franchise_id" > 
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                        <?php } ?>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_country">Country</label>
                        <select name="search_country" id="search_country" class="form-control custom-select form-control-border">
                            <option value="0">Select Country</option>
                            <?php foreach ($search_country as $val) { ?>
                                <option value="<?php echo $val["_id"]; ?>"><?php echo $val["title"]; ?></option>
                            <?php } ?>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_state">State</label>
                        <select name="search_state" id="search_state" class="form-control custom-select form-control-border">
                            <option value="0">Select State</option>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_city">City</label>
                        <select name="search_city" id="search_city" class="form-control custom-select form-control-border">
                            <option value="0">Select City</option>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_area_group">Group of Area</label>
                        <select name="search_area_group" id="search_area_group" class="form-control custom-select form-control-border">
                            <option value="0">Select Group of Area</option>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_area">Area</label>
                        <select name="search_area" id="search_area" class="form-control custom-select form-control-border">
                            <option value="0">Select Area</option>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_order_status">Order Status</label>
                        <select name="search_order_status" id="search_order_status" class="form-control custom-select form-control-border">
                           <option value="0">Select Order Status</option>
                           <?php foreach ($OrderStatus as $okey => $ovalue) { ?>
                            <option value="<?=$okey?>"><?=$ovalue?></option>
                           <?php } ?>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_payment_status">Payment Status</label>
                        <select name="search_payment_status" id="search_payment_status" class="form-control custom-select form-control-border">
                            <option value="0">Select Payment Status</option>
                            <?php foreach ($payMethod as $pkey => $pvalue) { ?>
                            <option value="<?=$pkey?>"><?=$pvalue?></option>
                           <?php } ?> 
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_dd_from">Delivery Date From</label> 
                        <input type="date" name="search_dd_from" id="search_dd_from" value="" class="form-control">
                    </div>

                    <div class="col-sm-2">
                        <label for="search_dd_to">Delivery Date To</label>
                        <input type="date" name="search_dd_to" id="search_dd_to" value="" class="form-control">
                    </div>
                    <?php if($this->general_settings['is_wholesaler']==1){ ?>
                    <div class="col-sm-2">
                        <label for="search_is_wholesaler">Order Type</label>
                        <select name="search_is_wholesaler" class="form-control" id="search_is_wholesaler" >  
                          <option value="">All</option>   
                          <option value="0">Customers</option> 
                          <option value="1">Wholesaler</option> 
                        </select>
                    </div>
                    <?php } ?>
                    <div class="col-sm-12">  
                    <hr>
                    <div class="row">
                    <div class="col-sm-2">
                        <label for="search_created_from">Order Date From</label>
                        <?php $monthFromToday = date("Y-m-d", strtotime("-7 day", strtotime(date("Y/m/d")))); ?>
                        <input type="date" name="search_created_from" id="search_created_from" value="<?php
                        echo $monthFromToday; ?>" class="form-control">
                    </div>

                    <div class="col-sm-2">
                        <label for="search_created_to">Order Date To</label>
                         <?php  
                         $TToday = date("Y-m-d", strtotime("+1 day", strtotime(date("Y/m/d")))); ?>
                        <input type="date" name="search_created_to" id="search_created_to" value="<?php echo $TToday; ?>" class="form-control">
                    </div>
                    </div>
                    </div>    
                    <div class="col-sm-12">  
                        <?php if($this->session->userdata('role_type')!=3){ ?>
                        <button title="Export XLS" id="export_xls" class="btn btn-primary btn-sm float-right" style="margin-left:10px;"><i class="fa fa-file-excel-o" aria-hidden="true"></i> Export XLS</button>
                        <?php } ?>

                        <button title="Reset" id="external-filter-reset" class="btn btn-info btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>
                        <button title="Search" id="external-filter" class="btn btn-success  btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button>

                    </div>
                </div> 
                <?php echo form_close(); ?>
            </div>
        </div>
        <div class="card">
            <div id="order-list" class="card-body table-responsive" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>">
                <table id="order-list-datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Order Id</th>
                            <th>Total</th>
                            <th>Wallet</th>
                            <th>Final Total</th>
                            <th>Franchise</th>
                            <th>Order Date</th>
                            <th>Delivery Date</th>
                            <th>Status</th>
                            <th>Payment Method</th>
                            <th>Device</th>
                            <th width="100" class="text-right">Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </section>
</div>

<!-- DataTables -->
<script src="<?= base_url() ?>assets/plugins/datatables/jquery.dataTables.js"></script>
<script src="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.js"></script>
<script src="<?= base_url() ?>assets/dist/js/order-list.js"></script>
<script src="<?= base_url() ?>assets/dist/js/location-list.js"></script>


<script type="text/javascript">
 $("body").on("click",".chkOrderPay",function(e){
    e.preventDefault(); 
    var uid = $(this).attr('uid'); 
    var oid = $(this).attr('oid'); 
    var url = '<?=base_url($model."/order/getchkOrderPay/")?>'+uid+'/'+oid; 
    var loading = '<?=base_url("assets/img/loading.gif")?>';
    $modal = $('#ajax-modal');  
    $('#ajax-modal').html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><img style="width:200px;" src="'+loading+'"></br><h5>Please be patient while data loading.....</h5></center></div></div></div>');
      $modal.modal('show'); 
      $modal.load(url, '', function(){
      $modal.modal();         
    });      
    return false;  
});
</script>