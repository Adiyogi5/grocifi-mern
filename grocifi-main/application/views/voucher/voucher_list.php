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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Voucher List </h3>
        </div>
        <div class="d-inline-block float-right"> 
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['voucher']['is_add']) && $this->general_user_premissions['voucher']['is_add']==1)){ ?>  
          <a href="<?= base_url($model.'/voucher/addvoucher'); ?>" class="btn btn-sm btn-success"><i class="fa fa-plus"></i> Add New Voucher</a>
          <?php } ?>
        </div>

        <div id="location-filter" class="col-sm-12 row" data-url="<?php echo base_url().$model.'/'; ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>" style="border-top: 1px solid #ddd;  width: 100%;  margin-top: 10px;">
                    <div class="col-sm-2">
                        <label for="search_franchise_id">Franchise</label>
                        <select name="search_franchise_id" class="form-control" id="search_franchise_id" > 
                        <?php foreach ($franchise as $key => $value) { ?>
                          <option value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                        <?php } ?>
                        </select>
                    </div>
                    <div class="col-sm-2">
                        <label for="search_created_from">Date From</label> 
                        <input type="date" name="search_created_from" id="search_created_from" value="<?=$fromdate?>" class="form-control">
                    </div>

                    <div class="col-sm-2">
                        <label for="search_created_to">Date To</label>
                        <input type="date" name="search_created_to" id="search_created_to" value="<?=$today?>" class="form-control">
                    </div>
                    <div class="col-sm-3" style="margin-top: 35px;">   

                        <button title="Reset" id="external-filter-reset" class="btn btn-info btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>
                        <button title="Search" id="external-filter" class="btn btn-success  btn-sm float-right" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-search"></i> Search</button>

                    </div>

        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%">
          <thead>
            <tr>
              <th>#ID</th> 
              <th>Franchise</th> 
              <th>Delivery Boy</th> 
              <th>Amount</th> 
              <th>Date</th>
              <th>Status</th>
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

<script>
  //---------------------------------------------------
  var table = $('#na_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/voucher/voucher_datatable_json')?>",
    "order": [[4,'asc']],
    "columnDefs": [
    { "targets": 0, "name": "_id", 'searchable':false, 'orderable':false}, 
    { "targets": 1, "name": "franchiseName", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "deliveryboy", 'searchable':true, 'orderable':true},
    { "targets": 3, "name": "amount", 'searchable':false, 'orderable':true},
    { "targets": 4, "name": "created", 'searchable':false, 'orderable':true}, 
    { "targets": 5, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 6, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'}
    ]
  }); 


        $("#external-filter").click(function(e) {
            e.preventDefault();
            $("#lodingalert").show(); 
            table.on('preXhr.dt', function(e, settings, data) {
                var external_search = false;
                var location_search_added = false; 
                if ($("#search_created_from").val() != "" && $("#search_created_to").val() != "") {
                    data.created_from = $("#search_created_from").val();
                    data.created_to = $("#search_created_to").val();
                    external_search = true
                }  
                if ($("#search_franchise_id").val() != "") {
                    data.franchise_id = $("#search_franchise_id").val(); 
                    external_search = true
                }  
                data.external_search = external_search;
            });
            table.draw();
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });


        $("#external-filter-reset").click(function(e) {
            e.preventDefault();
            $("#lodingalert").show();  
            $("#search_created_from").val("");
            $("#search_created_to").val(""); 

            table.on('preXhr.dt', function(e, settings, data) {
                delete data.external_search;
                delete data.created_from;
                delete data.created_to; 
            });
            table.draw();
            setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
        });

  $("body").on("click",".tgl_delete",function(){ 
    if(confirm('Do you want to delete ?')){
      $.post('<?=base_url($model."/voucher/change_voucher_status")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        _id : $(this).data('id'), 
        is_active : 0
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess=='200'){  
          $.notify("Status Changed Successfully", "success");
          window.location.reload();
        }else{
          $.notify(data.msg, "error");
        }
      });
    }
  });  
</script> 


