<!-- DataTables -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.css"> 
<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <section class="content">
    <!-- For Messages -->
    <?php $this->load->view('includes/_messages.php') ?>
    <div class="card">
      <div class="card-header">
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Franchise List </h3>
        </div>
        <div class="d-inline-block float-right">
          <?php 
          if(!$this->session->userdata('franchise_id')){
          if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_franchise']['is_add']) && $this->general_user_premissions['user_franchise']['is_add']==1)){ ?>
            <a href="<?= base_url($model.'/users/add/franchise'); ?>" class="btn btn-success"><i class="fa fa-plus"></i> Add New Franchise</a>  
        <?php } } ?>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Franchise </th>
              <th>Owner Name</th>
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
    "ajax": "<?=base_url($model.'/users/franchise_datatable_json')?>",
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


