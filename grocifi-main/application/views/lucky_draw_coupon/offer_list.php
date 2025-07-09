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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Lucky Draw Coupon List </h3>
        </div>
        <div class="d-inline-block float-right"> 
        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['lucky_draw_coupon']['is_add']) && $this->general_user_premissions['lucky_draw_coupon']['is_add']==1)){ ?>  
          <a href="<?= base_url($model.'/lucky_draw_coupon/add'); ?>" class="btn btn-success"><i class="fa fa-plus"></i> Add New Lucky Draw Coupon</a>
        <?php } ?>  
        </div>
        <?php if(!$this->session->userdata('franchise_id')){ ?>
        <div  style="border-top: 1px solid #ddd;  width: 100%; margin-top: 15px; padding-top: 5px;" id="location-filter" class="col-sm-12 row" data-url="<?php echo base_url(); ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>">
               
              <div class="col-sm-2">
                  <label for="search_franchise_id">Franchise</label>
                  <select name="search_franchise_id" class="form-control" id="search_franchise_id" >   
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
        <?php } ?>
      </div>
    </div>
    <div class="card">
      <div class="card-body table-responsive">
        <table id="na_datatable" class="table table-bordered table-striped" width="100%">
          <thead>
            <tr>
              <th>#ID</th> 
              <th>Offer</th> 
              <th>Franchise</th> 
              <th>Offer Date</th>
              <th>Created</th> 
              <th>Status</th>
              <th class="text-right">Action</th>
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
    "ajax": "<?=base_url($model.'/lucky_draw_coupon/offer_datatable_json')?>?franchise_id="+$('#search_franchise_id').val(),
    "order": [[1,'asc']],
    "columnDefs": [
    { "targets": 0, "name": "_id", 'searchable':false, 'orderable':false}, 
    { "targets": 1, "name": "title", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "Franchise", 'searchable':true, 'orderable':true},
    { "targets": 3, "name": "has_expire", 'searchable':true, 'orderable':true},
    { "targets": 4, "name": "dates", 'searchable':false, 'orderable':false}, 
    { "targets": 5, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 6, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'}
    ]
  });
 
  $("body").on("change",".tgl_checkbox",function(){ 
    $.post('<?=base_url($model."/lucky_draw_coupon/change_offer_status")?>',
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
  
  $("#external-filter").click(function(e) {
      table.on('preXhr.dt', function(e, settings, data) {
          var external_search = false; 
          if ($("#search_franchise_id").val() != 0) {
              data.franchise_id = $("#search_franchise_id").val(); 
              external_search = true
          }
          data.external_search = external_search;
      });
      table.draw();
  });

  $("#external-filter-reset").click(function(e) {
      $("#search_franchise_id").val(""); 
      table.on('preXhr.dt', function(e, settings, data) {
          delete data.franchise_id; 
      });
      table.draw();
  });
  
  $("body").on("click",".tgl_delete",function(){ 
    if(confirm('Do you want to delete ?')){
      $.post('<?=base_url($model."/lucky_draw_coupon/change_offer_status")?>',
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


