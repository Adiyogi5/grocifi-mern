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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Category List </h3>
        </div>
        <div class="d-inline-block float-right"> 
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['category']['is_add']) && $this->general_user_premissions['category']['is_add']==1)){ ?>  
          <a href="<?= base_url($model.'/category/addcategory'); ?>" class="btn btn-success"><i class="fa fa-plus"></i> Add New Category</a>
          <?php } ?>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%">
          <thead>
            <tr>
              <th>#ID</th> 
              <th>Category</th> 
              <th>Main Category</th> 
              <th>Created At</th>
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
    "ajax": "<?=base_url($model.'/category/category_datatable_json')?>",
    "order": [[1,'asc']],
    "columnDefs": [
    { "targets": 0, "name": "_id", 'searchable':false, 'orderable':false}, 
    { "targets": 1, "name": "title", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "mainCategory", 'searchable':true, 'orderable':true},
    { "targets": 3, "name": "created", 'searchable':false, 'orderable':true}, 
    { "targets": 4, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 5, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'}
    ]
  });
 
  $("body").on("change",".tgl_checkbox",function(){
    $.post('<?=base_url($model."/category/change_category_status")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      _id : $(this).data('id'),
      is_active : $(this).is(':checked') == true?1:2
    },
    function(response){
      var data = JSON.parse(response);
      if(data.sucess=='200'){
        var Del = '<a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'+data.data.id+'" id="db_'+data.data.id+'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a>';
        $('#deb_'+data.data.id+'').html(Del);    
        $.notify("Status Changed Successfully", "success");
      }else{
        $.notify(data.msg, "error");
      }
    });
  });

  $("body").on("click",".tgl_delete",function(){ 
    if(confirm('Do you want to delete ?')){
      $.post('<?=base_url($model."/category/change_category_status")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        _id : $(this).data('id'),
        ftype: $(this).data('ftype'),
        is_active : 0
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess=='200'){ 
          $('#cb_'+data.data['id']+'').prop( "checked", false );
          $('#deb_'+data.data['id']+'').html('');
          $.notify("Status Changed Successfully", "success");
        }else{
          $.notify(data.msg, "error");
        }
      });
    }
  });  
</script> 


