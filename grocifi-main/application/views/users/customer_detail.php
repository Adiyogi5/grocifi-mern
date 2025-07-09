<!-- DataTables -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.css"> 
<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <?php $customerData = $customer; ?>
<?php 
$userType = "Customer";
$link = 'customer';
if(isset($customerData['is_wholesaler']) && !empty($customerData['is_wholesaler'])){ 
  $userType = "Wholesaler";
  $link = 'wholesaler';
  } ?>
  <!-- Main content -->
  <section class="content">
    <div class="card card-default color-palette-bo">
      <div class="card-header">
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; <?=$customerData['fname'].' '.$customerData['lname'];?> Detail </h3>
        </div>
        <div class="d-inline-block float-right">
          <a href="<?= base_url($model.'/users/'.$link.''); ?>" class="btn btn-success"><i class="fa fa-list"></i>  <?=$userType?> List</a>
        </div>
      </div>
      <div class="card-body">   
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#user-basic" role="tab" aria-controls="basic" aria-selected="true"><?=$userType?> Detail</a>
          </li> 
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#user-friends" role="tab" aria-controls="friends" aria-selected="false">Friends</a>
          </li>
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#user-wallet" role="tab" aria-controls="wallet" aria-selected="false">Wallet Log</a>
          </li>
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#user-order" role="tab" aria-controls="order" aria-selected="false">Order</a>
          </li>
        </ul>
        <hr>
         <div class="tab-content">
           <div role="tabpanel" class="tab-pane active" id="user-basic"> 
              <div class="row" style="line-height: 30px;">
                <div class="col-md-12" style="text-align: center;">
                  <?php if($customerData['img']!='noimage.png'){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>user_img/<?=$customerData['img']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                </div>
                <div class="col-md-4"><b>Name:&nbsp; </b> <?=$customerData['fname'].' '.$customerData['lname'];?></div>
                <div class="col-md-4"><b>Email:&nbsp; </b> <?=!empty($customerData['email'])?$customerData['email']:'--';?></div>
                <?php if($role!=3){ ?><div class="col-md-4"><b>Phone:&nbsp; </b> <?=!empty($customerData['phone_no'])?$customerData['phone_no']:'--';?></div> <?php } ?>
                <div class="col-md-4"><b>DOb:&nbsp; </b> <?=(!empty($customerData['dob']))?date('d-m-Y',strtotime($customerData['dob'])):'--';?></div>
                <div class="col-md-4"><b>Refer Code:&nbsp; </b>  <?=isset($customerData['refer_code'])?$customerData['refer_code']:'';?></div>
                <div class="col-md-4"><b>Wallet Balance:&nbsp; </b> <?=!empty($customerData['wallet_balance'])?$customerData['wallet_balance']:0;?></div>
                <div class="col-md-4"><b>Order Count:&nbsp; </b> <?=!empty($customerData['order_count'])?$customerData['order_count']:0;?></div>
                <div class="col-md-4"><b>Register At:&nbsp; </b> <?=date('d-m-Y',strtotime($customerData['created']));?></div>
              </div>
              <?php if(isset($customerData['is_wholesaler']) && !empty($customerData['is_wholesaler'])){ ?>
                <div class="row" style="line-height: 30px;">
                  <div class="col-md-4"><b>Wholesaler:&nbsp; </b> True</div>
                  <div class="col-md-4"><b>Firm Name:&nbsp; </b> <?=$customerData['wholesaler_firmname'];?></div>
                  <div class="col-md-4"><b>GST No.:&nbsp; </b> <?=$customerData['gst_no'];?></div>
                  <div class="col-md-4"><b>Visiting Card:&nbsp; </b> <?php  
                  if($customerData['visiting_card']!='noimage.png' or $customerData['visiting_card']!=''){ ?>
                  <img src="<?= $this->config->item('APIIMAGES') ?>user_visitingcard/<?=$customerData['visiting_card']; ?>" class="logosmallvcard" style="vertical-align: top;">  
                  <?php }else{ ?>
                    <img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallvcard" style="vertical-align: top;"> 
                  <?php } ?></div>
                </div>
              <?php } ?> 
              <hr>
              <div class="row" style="line-height: 30px;"> 
                 <div class="col-md-4"><b>Order Recieved:&nbsp; </b> <?=$customerData['order_status']['recieved']?></div>
                <div class="col-md-4"><b>Order Delivered:&nbsp; </b> <?=$customerData['order_status']['delivered']?></div>
                 <div class="col-md-4"><b>Order Cancelled:&nbsp; </b> <?=$customerData['order_status']['cancelled']?></div>     
              </div> 
              <?php if(isset($customerData['friends_code']) && !empty($customerData['friends_code'])){ ?>
                <hr>
                <div class="row" style="line-height: 30px;"> 
                 <div class="col-md-12"><h4>Referer Detail</h4> </div>
                 <div class="col-md-4"><b>Name: &nbsp; </b> <a href="<?=$this->config->item('base_url').$model; ?>/users/customer_detail/<?=$myReferer['_id']?>"> <?=$myReferer['fname'].' '.$myReferer['lname'] ?></a></div>
                  <?php if($role!=3){ ?>
                  <div class="col-md-4"><b>Phone: &nbsp; </b> <?=$myReferer['phone_no']?></div>
                  <?php  } ?>
               </div>
              <?php } ?>
           </div>
           <div role="tabpanel" class="tab-pane " id="user-friends"> 
              <div class="table-responsive">
                <table id="friend_datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Balance</th> 
                    </tr>
                  </thead>
                </table> 
              </div>
           </div>
           <div role="tabpanel" class="tab-pane " id="user-wallet">  
              <div class="table-responsive">
                <table id="wallet_datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Before Update</th>
                      <th>After Update</th>
                      <th>Date</th>
                      <th>Expire Date</th> 
                    </tr>
                  </thead>
                </table> 
              </div>
           </div>
           <div role="tabpanel" class="tab-pane " id="user-order">  
              <div class="table-responsive">
                <table id="order_datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Total</th>
                      <th>D. Charge</th>
                      <th>Tax</th>
                      <th>Disc.</th>
                      <th>Wallet Used</th>
                      <th>F. Total</th>
                      <th>P. Method</th>
                      <th>Fr Name</th>
                      <th>Date</th>
                      <th>Status</th> 
                    </tr>
                  </thead>
                </table> 
              </div>
           </div> 
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
  var table = $('#wallet_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/walletlog_datatable_json/'.$id.'')?>",
    "order": [[6,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "description", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "type", 'searchable':true, 'orderable':true},
    { "targets": 3, "name": "amount", 'searchable':true, 'orderable':true},
    { "targets": 4, "name": "before_update", 'searchable':false, 'orderable':false},
    { "targets": 5, "name": "after_update", 'searchable':false, 'orderable':false},
    { "targets": 6, "name": "date", 'searchable':false, 'orderable':true},
    { "targets": 7, "name": "expire_date", 'searchable':false, 'orderable':true}, 
    ]
  }); 
  //---------------------------------------------------
  var table = $('#order_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/orderlog_datatable_json/'.$id.'')?>",
    "order": [[0,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "total", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "delivery_charge", 'searchable':true, 'orderable':false},
    { "targets": 3, "name": "tax_percent", 'searchable':true, 'orderable':false},
    { "targets": 4, "name": "discount", 'searchable':false, 'orderable':false},
    { "targets": 5, "name": "key_wallet_balance", 'searchable':false, 'orderable':false},
    { "targets": 6, "name": "final_total", 'searchable':false, 'orderable':false},
    { "targets": 7, "name": "payMethod", 'searchable':false, 'orderable':false},
    { "targets": 8, "name": "franchiseName", 'searchable':false, 'orderable':true},
    { "targets": 9, "name": "created", 'searchable':false, 'orderable':true}, 
    { "targets": 10, "name": "status", 'searchable':false, 'orderable':true}, 
    ]
  }); 
  //---------------------------------------------------
  var table = $('#friend_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/friendlog_datatable_json/'.$id.'')?>",
    "order": [[0,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "id", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "name", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "phone_no", 'searchable':true, 'orderable':false},
    { "targets": 3, "name": "wallet_balance", 'searchable':true, 'orderable':false}, 
    ]
  }); 


</script>