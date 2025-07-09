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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Coupons To Be Expire Today </h3>
        </div>
        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['coupon']['is_add']) && $this->general_user_premissions['coupon']['is_add']==1)){ ?>  
        <div class="d-inline-block float-right" style="width: 350px;"> 
          <div class="row">
          <?php /* <div class="col-sm-6">
          <input type="hidden" name="selfranchise_id" id="selfranchise_id" value="<?=@$this->session->userdata('franchise_id');?>">  
          <input type="date" name="given_date" class="form-control" id="given_date" value="<?=date('Y-m-d')?>">
          </div> */ ?> 
          </div>
        </div> 
        <?php } ?>  
        <?php if(!$this->session->userdata('franchise_id')){ ?>
        <div  style="border-top: 1px solid #ddd;  width: 100%; margin-top: 15px; padding-top: 5px;" id="location-filter" class="col-sm-12 row" data-url="<?php echo base_url(); ?>" token-name="<?php echo $token_name; ?>" token-value="<?php echo $token_value; ?>">
               
              <div class="col-sm-3">
                  <label for="search_franchise_id">Franchise</label>
                  <select name="search_franchise_id" class="form-control" id="search_franchise_id" > 
                  <option value="">Select Franchise</option>   
                  <?php foreach ($franchise as $key => $value) { ?>
                    <option value="<?=$value['_id']?>"><?=$value['firmname']?></option>
                  <?php } ?>
                  </select>
              </div>

              <div class="col-sm-2" style="margin-top: 35px;">  
                  <button title="Reset" id="external-filter-reset" class="btn btn-info btn-sm float-right" style="margin-left: 15px;"><i aria-hidden="true" class="fa fa-times"></i> Reset</button>

                  <button title="Search" id="external-filter" class="btn btn-success  btn-sm float-right"><i aria-hidden="true" class="fa fa-search"></i> Search</button>
              </div>
               <div class="col-sm-2" style="margin-top: 35px;"> 
                <a title="Exipre Coupons" class="delete btn btn-sm btn-danger tgl_expire" title="Exipre Coupons"> <i class="fa fa-trash-o"></i> Exipre Coupons</a>
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
              <th>Code</th> 
              <th>Franchise</th>  
              <th>Is Expiry</th>
              <th>Dates</th> 
              <th>No. of Uses</th>
              <th>Reuse</th>
              <th>Disc.</th>
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
    "ajax": "<?=base_url($model.'/coupon/coupontodayexpiry_datatable_json')?>",
    "order": [[1,'asc']],
    "columnDefs": [
    { "targets": 0, "name": "_id", 'searchable':false, 'orderable':false}, 
    { "targets": 1, "name": "title", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "Franchise", 'searchable':true, 'orderable':true}, 
    { "targets": 3, "name": "is_expire", 'searchable':false, 'orderable':false},
    { "targets": 4, "name": "dates", 'searchable':false, 'orderable':false},
    { "targets": 5, "name": "user_no", 'searchable':false, 'orderable':false},
    { "targets": 6, "name": "reuse", 'searchable':false, 'orderable':false},
    { "targets": 7, "name": "disc", 'searchable':false, 'orderable':false}, 
    { "targets": 8, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 9, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'}
    ]
  });
 
  $("body").on("change",".tgl_checkbox",function(){
    console.log('checked');
    $.post('<?=base_url($model."/coupon/change_coupon_status")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      _id : $(this).data('id'),
      is_active : $(this).is(':checked') == true?1:0
    },
    function(response){
      var data = JSON.parse(response);
      if(data.sucess=='200'){
        var Del = '<a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'+data.data.id+'" id="db_'+data.data.id+'" data-ftype="product" title="Delete"> <i class="fa fa-trash-o"></i></a>';
        $('#deb_'+data.data.id+'').html(Del); 
        $.notify("Status Changed Successfully", "success");
      }else{
        $.notify(data.msg, "error");
      }
    });
  });

  $("body").on("click",".tgl_delete",function(){ 
    if(confirm('Do you want to delete ?')){
      $.post('<?=base_url($model."/coupon/change_coupon_status")?>',
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
  
  $("body").on("click",".tgl_expire",function(){ 
    var date = $('#given_date').val();
    var franchise_id = $('#selfranchise_id').val();
    var dateAr = date.split('-');
    var newDate = dateAr[2] + '-' + dateAr[1] + '-' + dateAr[0];
    if(confirm('Do you want to Exipre Coupons of Date: '+newDate+' ?')){
      $.post('<?=base_url($model."/coupon/setexpirecoupon")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>', 
        given_date : date,
        franchise_id :franchise_id
      },
      function(response){
        var data = JSON.parse(response);
          $.notify("Coupons Exipre Successfully", "success");
          var table = $('#na_datatable').DataTable();
          table.ajax.reload();
      });
    }
  })  
</script> 


