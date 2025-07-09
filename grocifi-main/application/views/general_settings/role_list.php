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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Roles List </h3>
        </div>
        <div class="d-inline-block float-right"> 
         <?php /* <a href="<?= base_url($model.'/settings/addrole'); ?>" class="btn btn-success"><i class="fa fa-plus"></i> Add New Role</a> */ ?>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Role</th>
              <th>Role Code</th> 
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
    "ajax": "<?=base_url($model.'/settings/rolemanager_datatable_json')?>",
    "order": [[1,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "_id", 'searchable':false, 'orderable':false},
    { "targets": 1, "name": "title", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "role_code", 'searchable':false, 'orderable':true}, 
    { "targets": 3, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 4, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'}
    ]
  });
 
  $("body").on("change",".tgl_checkbox",function(){
    console.log('checked');
    $.post('<?=base_url($model."/settings/change_role_status")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      _id : $(this).data('id'),
      is_active : $(this).is(':checked') == true?1:0
    },
    function(response){
      var data = JSON.parse(response);
      if(data.success=='200'){
        $.notify("Status Changed Successfully", "success");
      }else{
        $.notify(data.msg, "error");
      }
    });
  });
</script> 


