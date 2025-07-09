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
                <div class="d-inline-block" style="border-bottom: 1px solid #ddd;  width: 100%; padding-bottom: 5px;  margin-bottom: 10px;">
                    <h3 class="card-title" style="width: 95%; float: left;"><i class="fa fa-list"></i>&nbsp; Active Order List &nbsp; <small style="font-size: 12px;">Orders that are to be delivered </small> </h3> 
                    <span data-toggle="tooltip" title="<?=$color?>" data-placement="left" class="float-right qshelp"><i class="fa fa-question"></i></span>
                </div>

                <?php echo form_open(base_url($model.'/order/print_bills'), 'class="form-horizontal" id="xlsexportorder"'); ?>
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
                        <label for="search_dd_from">Deleivery Time:</label>
                        <select name="search_order_delivery_time" id="search_order_delivery_time" class="form-control custom-select form-control-border">
                            <option value="0">Select Delivery Time</option>
                            <?php foreach ($time_slot as $val) { ?>
                                <option value="<?php echo $val["id"]; ?>"><?php echo $val["title"]; ?></option>
                            <?php } ?>
                        </select>
                    </div>

                    <div class="col-sm-2">
                        <label for="search_dd_from">Delivery Date From</label>
                        <input type="date" name="search_dd_from" id="search_dd_from" value="<?php echo date("Y-m-d") ?>" class="form-control">
                    </div>

                    <div class="col-sm-2">
                        <label for="search_dd_to">Delivery Date To</label>
                        <input type="date" name="search_dd_to" id="search_dd_to" value="<?php echo date("Y-m-d") ?>" class="form-control">
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
                    <div class="col-sm-12" style="margin-top:10px">
                        <?php if($this->session->userdata('role_type')!=3){ ?>
                            <button title="Export XLS" id="export_xls" class="btn btn-primary btn-sm float-right" style="margin-left:10px;"><i class="fa fa-file-excel-o" aria-hidden="true"></i> Export XLS</button>
                        <?php } ?>

                        <button title="Print Bills" id="print_bills" class="btn btn-primary btn-sm float-right" style="margin-left:10px;"><i class="fa fa-print" aria-hidden="true"></i> Print Bills</button>

                        <button title="Reset" id="external-filter-reset" class="btn btn-danger btn-sm float-right" style="margin-left:5px; margin-right: 20px;"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>

                        <button title="Search" id="external-filter" class="btn btn-success btn-sm float-right" style="margin-left:5px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button> 
                        
                        </div>
                        <input type="hidden" name="flterOrderId" id="flterOrderId" value="">
                        <input type="hidden" name="pmode" id="pmode" value="1">
                    </div> 
                 <?php echo form_close(); ?> 
                <div class="row" style="margin-right: 15px;"> 
                <div class="col-sm-12" style="margin-top:10px;margin-right:15px;">
                    <button title="Change Status" id="change-status-all" data-toggle="modal" data-target="#orderStatusAllModal" class="btn btn-info btn-sm float-right" style="margin-left:10px;"><i class="fa fa-recycle" aria-hidden="true"></i> Change Status</button>

                    <button title="Assign Delivery Boy" id="delivery-boy" data-toggle="modal" data-target="#deliveryboyAllModal" class="btn btn-warning btn-sm float-right" style="margin-left:10px;"><i class="fa fa-motorcycle" aria-hidden="true"></i> Assign Delivery Boy</button>
                </div>
                </div>
            </div>
        </div>
        <div class="card">
        <div id="active-order-list" class="card-body table-responsive" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>">
                <table id="active-order-list-datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
                    <thead>
                        <tr>
                            <th>#</th> <!-- 1. -->
                            <th>Name</th> <!-- 2. -->
                            <th>Order Id</th> <!-- 3. -->
                            <th>Area</th> <!-- 4. -->
                            <th>Delivery Boy</th> <!-- 5. -->
                            <th>Final Total</th> <!-- 6. -->
                            <th>Order Date</th> <!-- 7. -->
                            <th>Delivery Date</th> <!-- 8. -->
                            <th width="100" class="text-right">Action</th> <!-- 9. -->
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </section>
</div>

<!-- Modal -->
<div class="modal fade" id="orderStatusAllModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="Order-Status" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="Order-Status">Update Status</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <label for="new_order_status">Order Status</label>
                <select id="new-order-status" class="form-control custom-select form-control-border">
                    <option value="">Select Order Status</option>
                    <option value="1">Received</option>
                    <option value="2">Processed</option>
                    <option value="3">Shipped</option>
                    <option value="4">Delivered</option>
                    <option value="5">Returned</option>
                    <option value="6">Cancel</option>
                </select>
                <div id="status-all-alert" class="pb-5"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="new-update-status">Update Status</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="deliveryboyAllModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="Order-Status" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="Order-Status">Assign Delivery Boy</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body"> 
                <label for="delivery_boy">Delivery Boy</label> 
                  <select name="delivery_boy" class="form-control" id="delivery_boy" >
                    <option value="">Select Delivery Boy</option>
                     
                  </select>
                <div id="status-all-alert" class="pb-5"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="update-delivery-boy">Assign Delivery Boy</button>
            </div>
        </div>
    </div>
</div>


<!-- DataTables -->
<script>
    var base_url = "<?php echo base_url(); ?>";
</script>
<script src="<?= base_url() ?>assets/plugins/datatables/jquery.dataTables.js"></script>
<script src="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.js"></script>
<script src="<?= base_url() ?>assets/dist/js/active-order-list.js"></script>
<script src="<?= base_url() ?>assets/dist/js/location-list.js"></script>