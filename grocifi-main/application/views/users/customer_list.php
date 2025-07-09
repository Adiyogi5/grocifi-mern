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
      <div class="card-header" style="margin-bottom: 5px;">
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Customers List </h3>
        </div>
        <div class="d-inline-block float-right"> 
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_customer']['is_add']) && $this->general_user_premissions['user_customer']['is_add']==1)){ ?> 
          <a href="<?= base_url($model.'/users/add/customer'); ?>" class="btn btn-success" ><i class="fa fa-plus"></i> Add New Customer</a>
          <?php } ?>
        </div>
      </div>
      <?php echo form_open(base_url($model.'/users/xlsexportuser'), 'class="form-horizontal" id="xlsexportuser"'); ?>
      <div id="location-filter" class="col-sm-12 row" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>"> 
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
                        <label for="search_area">Area</label>
                        <select name="search_area" id="search_area" class="form-control custom-select form-control-border">
                            <option value="0">Select Area</option>
                        </select>
                    </div> 
  
                    <div class="col-sm-12" style="margin-top: 7px;">  
                      <?php if($role!=3){ ?>  <button title="Export XLS" id="export_xls" class="btn btn-primary btn-sm float-right" style="margin-left:10px;"><i class="fa fa-file-excel-o" aria-hidden="true"></i> Export XLS</button>
                      <?php } ?>
                      <input type="hidden" name="user_type" value="customer">
                      <button title="Reset" id="external-filter-reset" class="btn btn-info btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>
                      <button title="Search" id="external-filter" class="btn btn-success  btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button> 
                    </div>      
            </div>
            <?php echo form_close(); ?>  
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Name</th>
              <?php if($role!=3){ ?><th>Mobile</th> <?php } ?>
              <th>Wallet</th>
              <th width="100" >Order</th>
              <th>App-V</th>
              <th>Reg.</th>
              <th>Created</th>
              <th>Status</th> 
              <th width="80" class="text-right">Action</th>
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
<script src="<?= base_url() ?>assets/dist/js/location-list.js"></script>
<script>
  var urole = "<?=$role?>";
  //---------------------------------------------------
  if(urole==3){
    var table = $('#na_datatable').DataTable( {
      "processing": true,
      "serverSide": true,
      "ajax": "<?=base_url($model.'/users/customer_datatable_json')?>",
      "order": [[6,'desc']],
      "columnDefs": [
      { "targets": 0, "name": "id", 'searchable':true, 'orderable':true},
      { "targets": 1, "name": "username", 'searchable':true, 'orderable':true}, 
      { "targets": 2, "name": "wallet_balance", 'searchable':true, 'orderable':true},
      { "targets": 3, "name": "order_status", 'searchable':false, 'orderable':false},
      { "targets": 4, "name": "app_version", 'searchable':false, 'orderable':false},
      { "targets": 5, "name": "reg_from", 'searchable':false, 'orderable':false},
      { "targets": 6, "name": "created", 'searchable':false, 'orderable':true},
      { "targets": 7, "name": "is_active", 'searchable':true, 'orderable':false},
      { "targets": 8, "name": "Action", 'searchable':false, 'orderable':false,'width':'100px'}
      ]
    }); 
  }else{
    var table = $('#na_datatable').DataTable( {
      "processing": true,
      "serverSide": true,
      "ajax": "<?=base_url($model.'/users/customer_datatable_json')?>",
      "order": [[7,'desc']],
      "columnDefs": [
      { "targets": 0, "name": "id", 'searchable':true, 'orderable':true},
      { "targets": 1, "name": "username", 'searchable':true, 'orderable':true},
      { "targets": 2, "name": "phone_no", 'searchable':true, 'orderable':true},
      { "targets": 3, "name": "wallet_balance", 'searchable':true, 'orderable':true},
      { "targets": 4, "name": "order_status", 'searchable':false, 'orderable':false},
      { "targets": 5, "name": "app_version", 'searchable':false, 'orderable':false},
      { "targets": 6, "name": "reg_from", 'searchable':false, 'orderable':false},
      { "targets": 7, "name": "created", 'searchable':false, 'orderable':true},
      { "targets": 8, "name": "is_active", 'searchable':true, 'orderable':false},
      { "targets": 9, "name": "Action", 'searchable':false, 'orderable':false,'width':'100px'}
      ]
    }); 
  }
  $("#external-filter").click(function(e) {
    e.preventDefault();
     $("#lodingalert").show(); 
      table.on('preXhr.dt', function(e, settings, data) {
       var external_search = false;
         if ($("#search_city").val() != 0) {
              data.city = $("#search_city").val();
              external_search = true
          }
          if ($("#search_state").val() != 0) {
              data.state = $("#search_state").val();
              external_search = true
          }
          if ($("#search_country").val() != 0) {
              data.country = $("#search_country").val(); 
              external_search = true
          }
          if ($("#search_area").val() != 0) {
              data.area = $("#search_area").val(); 
              external_search = true
          } 
          data.external_search = external_search; 
      });
      table.draw();
      setTimeout(function(){ $("#lodingalert").hide(); }, 3000);  
  });

  $("#external-filter-reset").click(function(e) {
    e.preventDefault();
      $("#lodingalert").show(); 
      $("#search_country").val("0"); 
      $("#search_state").val("0");
      $("#search_city").val("0");
      $("#search_area").val("0"); 
      table.on('preXhr.dt', function(e, settings, data) {
          delete data.area; 
          delete data.city;
          delete data.state;
          delete data.country;  
      });
      table.clear().draw();
      setTimeout(function(){ $("#lodingalert").hide(); }, 3000);
  });

  $("body").on("change",".tgl_checkbox",function(){
    $.post('<?=base_url($model."/users/change_status")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      _id : $(this).data('id'),
      is_active : $(this).is(':checked') == true?1:2
    },
    function(data){
      $.notify("Status Changed Successfully", "success");
    });
  });

  $("body").on("click",".updateWallet",function(e){
      e.preventDefault();
      var loading = '<?=base_url("assets/img/loading.gif")?>';
      var url = $(this).attr('href'); 
      $modal = $('#ajax-modal');  
      $('#ajax-modal').html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><img style="width:200px;" src="'+loading+'"></br><h5>Please be patient while data loading.....</h5></center></div></div></div>');
      $modal.modal('show'); 
      $modal.load(url, '', function(){
        $modal.modal();         
      });      
      return false; 
  });

  $("body").on("click","#walletSubmitBtn",function(){
    var wallet_balance = $('#wallet_balance').val();
    var wallet_description = $('#wallet_description').val();
    var error = '';
    $("#error_wallet_balance").html('');
    $("#error_wallet_description").html('');
    if (wallet_balance == ''){  
      var error='Enter Wallet Balance';
      $("#error_wallet_balance").show();
      $("#error_wallet_balance").html(error); 
    }
    if (wallet_description == ''){  
      var error='Enter Wallet Description';
      $("#error_wallet_description").show();
      $("#error_wallet_description").html(error); 
    }
    if (error==''){
      $.post('<?=base_url($model."/users/update_wallet")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        _id : $('#wallet_id').val(),
        ttype : $('#wallet_ttype').val(), 
        wallet_balance : $('#wallet_balance').val(), 
        description : $('#wallet_description').val(),  
      },
      function(response){
        var data = JSON.parse(response);
        ///console.log(data);
        if(data.sucess=='200'){
          $.notify("Wallet Update Successfully", "success");
        }else{
          $.notify(data.msg, "error");
        }
        window.location.reload();
      });
    }
  });
 
 $("body").on("click",".user_address",function(e){
    e.preventDefault(); 
    var uid = $(this).attr('uid'); 
    var url = '<?=base_url($model."/order/getuseraddress/")?>'+uid+'/1'; 
    var loading = '<?=base_url("assets/img/loading.gif")?>';
    $modal = $('#ajax-modal');  
    $('#ajax-modal').html('<div class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><img style="width:200px;" src="'+loading+'"></br><h5>Please be patient while data loading.....</h5></center></div></div></div>');
      $modal.modal('show'); 
      $modal.load(url, '', function(){
      $modal.modal();         
    });      
    return false;  
});
$("#export_xls").click(function(e) {  
  e.preventDefault();
    if(confirm("Are you sure? Do you want to Export CSV of all filtered customers.")){ 
        $('#xlsexportuser').submit(); 
    }
}); 
</script>  


