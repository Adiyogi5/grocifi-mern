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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Vendor List </h3>
        </div>
        <div class="d-inline-block float-right">
          <?php 
          if(!$this->session->userdata('vendor_id')){
          if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_vendor']['is_add']) && $this->general_user_premissions['user_vendor']['is_add']==1)){ ?>
            <a href="<?= base_url($model.'/users/add/vendor'); ?>" class="btn btn-success"><i class="fa fa-plus"></i> Add New Vendor</a>  
        <?php } } ?>
        </div>
        <?php if(!$this->session->userdata('franchise_id')){ ?>
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
              <div class="col-sm-3" style="margin-top: 35px;">  
                  <button title="Reset" id="external-filter-reset" class="btn btn-info btn-sm float-right"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>
                  <button title="Search" id="external-filter" class="btn btn-success  btn-sm float-right"><i aria-hidden="true" class="fa fa-search"></i> Search</button>
              </div>
          </div>
        <?php  } ?>
      </div>
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Franchise Name</th>
              <th>Vendor </th>              
              <th>Mobile No.</th>
              <th>Created Date</th>
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
    "ajax": "<?=base_url($model.'/users/vendor_datatable_json')?>",
    "order": [[4,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':true},
    { "targets": 1, "name": "franchiseName", 'searchable':true, 'orderable':true},  
    { "targets": 2, "name": "full_name", 'searchable':true, 'orderable':true},
    { "targets": 3, "name": "phone_no", 'searchable':true, 'orderable':true}, 
    { "targets": 4, "name": "created", 'searchable':false, 'orderable':true},
    { "targets": 5, "name": "is_active", 'searchable':true, 'orderable':false},
    { "targets": 6, "name": "Action", 'searchable':false, 'orderable':false,'width':'100px'}
    ]
  });
 

  $("#external-filter").click(function(e) {
     $("#lodingalert").show(); 
      table.on('preXhr.dt', function(e, settings, data) {
          var external_search = false; 
          if ($("#search_franchise_id").val() != 0) {
              data.franchise_id = $("#search_franchise_id").val(); 
              external_search = true
          }

          data.external_search = external_search;
      });
      table.draw();
      setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
  });

  $("#external-filter-reset").click(function(e) {
     $("#lodingalert").show(); 
      $("#search_franchise_id").val(""); 
      table.on('preXhr.dt', function(e, settings, data) {
          delete data.franchise_id; 
      });
      table.draw();
      setTimeout(function(){ $("#lodingalert").hide(); }, 1000);
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
</script>  


