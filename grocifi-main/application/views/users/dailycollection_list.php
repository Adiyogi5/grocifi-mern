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
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Daily Collection List </h3>
        </div>
         
        <div  style="border-top: 1px solid #ddd;  width: 100%; margin-top: 15px; padding-top: 5px;" id="location-filter" class="col-sm-12 row" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>"> 
                    <div class="col-sm-2">
                        <label for="search_franchise_id">Franchise</label>
                        <select name="search_franchise_id" class="form-control" id="search_franchise_id" > 
                        <option value="">Select Franchise</option>   
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                        <?php } ?>
                        </select>
                    </div>
                    
                     <div class="col-sm-2">
                        <label for="search_order_status">Order Status</label>
                        <select name="search_order_status" id="search_order_status" class="form-control custom-select form-control-border">
                           <option value="0">Select Order Status</option>
                           <?php foreach ($OrderStatus as $okey => $ovalue) {
                            if($okey>=4){ ?>
                            <option value="<?=$okey?>"><?=$ovalue?></option>
                           <?php } } ?>
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
                        <input type="date" name="search_dd_from" id="search_dd_from" value="<?=$today?>" class="form-control">
                    </div>

                    <div class="col-sm-2">
                        <label for="search_dd_to">Delivery Date To</label>
                        <input type="date" name="search_dd_to" id="search_dd_to" value="<?=$today?>" class="form-control">
                    </div>

                    <div class="col-sm-2" style="margin-top: 35px;">  
                        <button title="Search" id="external-filter-reset" class="btn btn-info btn-sm float-right"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>
                        <button title="Search" id="external-filter" class="btn btn-success  btn-sm float-right"><i aria-hidden="true" class="fa fa-search"></i> Search</button>
                    </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div id="dailycollection-list" class="card-body table-responsive" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>">
        <table id="dailycollection-list-datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Franchise</th> 
              <th>Name</th>
              <th>Order Count</th>
              <th>Recived(₹)</th>
              <th>Deposit(₹)</th>
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
<script src="<?= base_url() ?>assets/dist/js/dailycollection.js"></script> 