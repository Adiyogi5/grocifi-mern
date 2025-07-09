<!-- DataTables -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.css"> 
<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <?php $customerData = $franchise[0]; 
  $franchiseData = $franchise[0]['franchise'][0];
  ?>
  <!-- Main content -->
  <section class="content">
    <?php $this->load->view('includes/_messages.php') ?>
    <div class="card card-default color-palette-bo">
      <div class="card-header">
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; <?=$franchiseData['firmname']?> Detail </h3>
        </div>
        <div class="d-inline-block float-right">
          <a href="<?= base_url($model.'/users/franchise'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Franchise List</a>
        </div>
      </div>
      <div class="card-body">   
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#frbasic" role="tab" aria-controls="frbasic" aria-selected="true"><?=$franchiseData['firmname']?> Detail</a>
          </li> 
          <?php  
          if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_area']['is_view']) && $this->general_user_premissions['franchise_area']['is_view']==1)){ ?> 
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#frarea" role="tab" aria-controls="frarea" aria-selected="false"><?=$franchiseData['firmname']?> Areas</a>
          </li>
          <?php  } ?>
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_category']['is_view']) && $this->general_user_premissions['franchise_category']['is_view']==1)){ ?> 
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#frcategory" role="tab" aria-controls="frcategory" aria-selected="false"><?=$franchiseData['firmname']?> Categories</a>
          </li>
          <?php  } ?>
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_product']['is_view']) && $this->general_user_premissions['franchise_product']['is_view']==1)){ ?> 
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#frproduct" role="tab" aria-controls="frproduct" aria-selected="false"><?=$franchiseData['firmname']?> Products</a>
          </li>
        <?php  } ?> 
        </ul>
        <hr>
         <div class="tab-content">
          <div role="tabpanel" class="tab-pane active" id="frbasic">  
              <div class="row" style="line-height: 30px;">
                <div class="col-md-12" style="text-align: center;">
                  <?php if($franchiseData['logo']!='noimage.png'){ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>firm_img/<?=$franchiseData['logo']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                  <b><?=$franchiseData['firmname']?></b> 
                </div>
                <div class="col-md-4"><b>Name:&nbsp; </b> <?=$customerData['fname'].' '.$customerData['lname'];?></div>
                <div class="col-md-4"><b>Email:&nbsp; </b> <?=!empty($customerData['email'])?$customerData['email']:'--';?></div>
                <div class="col-md-4"><b>Phone:&nbsp; </b> <?=!empty($customerData['phone_no'])?$customerData['phone_no']:'--';?></div>
                <div class="col-md-4"><b>DOb:&nbsp; </b> <?=(!empty($customerData['dob']))?date('d-m-Y',strtotime($customerData['dob'])):'--';?></div>
               <?php /* <div class="col-md-4"><b>Refer Code:&nbsp; </b> <?=isset($customerData['refer_code'])?$customerData['refer_code']:'';?></div>
                <div class="col-md-4"><b>Wallet Balance:&nbsp; </b> <?=!empty($customerData['wallet_balance'])?$customerData['wallet_balance']:0;?></div> 
                <div class="col-md-4"><b>Order Count:&nbsp; </b> <?=!empty($customerData['order_count'])?$customerData['order_count']:0;?></div> */ ?>
                <div class="col-md-4"><b>Register At:&nbsp; </b> <?=date('d-m-Y',strtotime($customerData['created']));?></div>
              </div>
               
              <div class="col-md-12" style="font-size:16px; font-weight:bold; padding: 0px; border-bottom: 1px solid #ddd; margin-top: 20px; ">About Firm</div>
              <div class="row" style="line-height: 30px;"> 
                <div class="col-md-4"><b>Owner Name:&nbsp; </b> <?=$franchiseData['ownername']?></div>
                <div class="col-md-4"><b>Owner Contact:&nbsp; </b> <?=$franchiseData['ownermobile']?></div>
                <div class="col-md-4"><b>Contact Person Name:&nbsp; </b> <?=$franchiseData['contactpersonname']?></div> 
                <div class="col-md-4"><b>Contact Person Mobile:&nbsp; </b> <?=$franchiseData['contactpersonmob']?></div> 
                <div class="col-md-4"><b>Commission:&nbsp; </b> <?=$franchiseData['commission']?></div>  
              </div>
          </div>
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_area']['is_view']) && $this->general_user_premissions['franchise_area']['is_view']==1)){ ?> 
          <div role="tabpanel" class="tab-pane " id="frarea"> 
            <div class="card-header" style="border-bottom: 0px;">
              <div class="d-inline-block">
                <h3 class="card-title"> Franchise Areas </h3>
              </div>
            <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_area']['is_add']) && $this->general_user_premissions['franchise_area']['is_add']==1)){ ?>   
              <div class="d-inline-block float-right"> 
              <a href="<?= base_url($model.'/users/franchisearea/'.$franchiseData['_id']); ?>" class="btn btn-success"><i class="fa fa-plus"></i>  Manage Area</a></div>
            <?php } ?>  
            </div>
            <div class="table-responsive">
                <table id="area_datatable" class="table table-bordered table-striped" width="100%">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Area</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Action</th> 
                    </tr>
                  </thead>
                </table> 
              </div>
            </div>
          <?php } ?>  
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_category']['is_view']) && $this->general_user_premissions['franchise_category']['is_view']==1)){ ?> 
            <div role="tabpanel" class="tab-pane " id="frcategory">  
              <div class="card-header" style="border-bottom: 0px;">
              <div class="d-inline-block">
                <h3 class="card-title"> Franchise Categories </h3>
              </div>
            <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_category']['is_add']) && $this->general_user_premissions['franchise_category']['is_add']==1)){ ?>  
              <div class="d-inline-block float-right"> 
              <a href="<?= base_url($model.'/users/franchisecategories/'.$franchiseData['_id']); ?>" class="btn btn-success"><i class="fa fa-plus"></i>  Manage Category</a></div>
            <?php } ?>
            </div>
            <div class="table-responsive">
                <table id="category_datatable" class="table table-bordered table-striped" width="100%">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category</th>
                      <th>Main Category</th>
                      <th>Status</th>
                      <th>Action</th> 
                    </tr>
                  </thead>
                </table> 
              </div>
            </div>
          <?php } ?>  
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_product']['is_view']) && $this->general_user_premissions['franchise_product']['is_view']==1)){ ?> 
            <div role="tabpanel" class="tab-pane " id="frproduct"> 
             <div class="card-header" style="border-bottom: 0px;">
              <div class="d-inline-block">
                <h3 class="card-title"> Franchise Products </h3>
              </div>
            <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['franchise_product']['is_add']) && $this->general_user_premissions['franchise_product']['is_add']==1)){ ?>   
              <div class="d-inline-block float-right"> 
              <a href="<?= base_url($model.'/users/franchiseproducts/'.$franchiseData['_id']); ?>" class="btn btn-success"><i class="fa fa-plus"></i>  Manage Products</a></div>
            <?php } ?> 

            <div class="d-inline-block float-right" style="margin-right: 15px;"> 
              <a href="<?= base_url($model.'/users/franchiseratelist/'.$franchiseData['_id']); ?>" class="btn btn-success"><i class="fa fa-download"></i>  Download Wholesaler Ratelist</a></div>

            </div> 
            <div class="table-responsive">
                <table id="product_datatable" class="table table-bordered table-striped" width="100%">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style="width:70%;">Product</th> 
                      <th>Status</th>
                      <th>Action</th> 
                    </tr>
                  </thead>
                </table> 
              </div>
           </div> 
          <?php } ?>
         </div>
      </div>
    </div>
  </section>
</div>

<!-- DataTables -->
<script src="<?= base_url() ?>assets/plugins/datatables/jquery.dataTables.js"></script>
<script src="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.js"></script>

<script>
  //---------------------------------------------------
  var table = $('#area_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/franchiseareas_datatable_json/'.$franchiseData['_id'].'')?>",
    "order": [[1,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "title", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "city", 'searchable':true, 'orderable':true}, 
    { "targets": 3, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 4, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'} 
    ]
  }); 
  //---------------------------------------------------
  var table = $('#category_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/franchisecategory_datatable_json/'.$franchiseData['_id'].'')?>",
    "order": [[1,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "title", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "mainCategory", 'searchable':true, 'orderable':true}, 
    { "targets": 3, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 4, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'} 
    ]
  }); 
  //---------------------------------------------------
  var table = $('#product_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/franchiseproduct_datatable_json/'.$franchiseData['_id'].'')?>",
    "order": [[1,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "name", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "is_active", 'searchable':false, 'orderable':true},
    { "targets": 3, "name": "Action", 'searchable':false, 'orderable':false,'width':'80px'} 
    ]
  }); 

  

  $("body").on("change",".tgl_checkbox",function(){ 
    $.post('<?=base_url($model."/users/change_franchisedetail_status")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      _id : $(this).data('id'),
      ftype: $(this).data('ftype'),
      is_active : $(this).is(':checked') == true?1:2
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
      $.post('<?=base_url($model."/users/change_franchisedetail_status")?>',
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