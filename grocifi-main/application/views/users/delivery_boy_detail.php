<!-- DataTables -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.css"> 
<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <?php $deliveryboyData = $deliveryboy[0]; ?>
  <!-- Main content -->
  <section class="content">
    <div class="card card-default color-palette-bo">
      <div class="card-header">
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; <?=$deliveryboyData['fname'].' '.$deliveryboyData['lname'];?> Detail </h3>
        </div>
        <div class="d-inline-block float-right">
          <a href="<?= base_url($model.'/users/delivery_boy'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Delivery Boy List</a>
        </div>
      </div>
      <div class="card-body">   
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#user-basic" role="tab" aria-controls="basic" aria-selected="true">Delivery Boy Detail</a>
          </li>  
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#user-order" role="tab" aria-controls="order" aria-selected="false">Order Detail</a>
          </li>
        </ul>
        <hr>
         <div class="tab-content">
           <div role="tabpanel" class="tab-pane active" id="user-basic"> 
              <div class="row" style="line-height: 30px;">
                <div class="col-md-12" style="text-align: center;">
                  <?php if($deliveryboyData['img']!='noimage.png'){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>user_img/<?=$deliveryboyData['img']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                </div>
                <div class="col-md-4"><b>Name:&nbsp; </b> <?=$deliveryboyData['fname'].' '.$deliveryboyData['lname'];?></div>
                <div class="col-md-4"><b>Email:&nbsp; </b> <?=!empty($deliveryboyData['email'])?$deliveryboyData['email']:'--';?></div>
                <div class="col-md-4"><b>Phone:&nbsp; </b> <?=!empty($deliveryboyData['phone_no'])?$deliveryboyData['phone_no']:'--';?></div>
                <div class="col-md-4"><b>DOb:&nbsp; </b> <?=(!empty($deliveryboyData['dob']))?date('d-m-Y',strtotime($deliveryboyData['dob'])):'--';?></div>  
                <div class="col-md-4"><b>Rating:&nbsp; </b> <span class="badge badge-primary">
                <i aria-hidden="true" class="fa fa-star"></i> &nbsp; <?=$deliveryboyData['rating']?></span></div>
                <div class="col-md-4"><b>Register At:&nbsp; </b> <?=date('d-m-Y',strtotime($deliveryboyData['created']));?></div>
                <div class="col-md-4"><b>Approved Status:&nbsp; </b> 
                  <?php 
                    if($deliveryboyData['franchisedeliveryboys']['is_approved']==1){
                      echo '<span class="green"> Approved </span>';
                    }else{
                      echo '<span class="red"> Not Approve </span>';
                    } 
                  ?>
                </div>
                <?php if($deliveryboyData['franchisedeliveryboys']['is_approved']==1){  ?>
                <div class="col-md-4"><b>Approved By:&nbsp; </b> <?=$deliveryboyData['franchisedeliveryboys']['approvedby'];?></div>
                <?php } ?>
              </div> 
              <hr>
              <div class="row" style="line-height: 30px;"> 
                 <div class="col-md-4"><b>Total Recieved(₹):&nbsp; </b> <?=number_format($deliveryboyData['delivery_detail']['recieved'],2,'.','')?></div>
                <div class="col-md-4"><b>Total Deposit(₹):&nbsp; </b> <?=number_format($deliveryboyData['delivery_detail']['deposit'],2,'.','')?></div>      
              </div>

           </div>
           <div role="tabpanel" class="tab-pane " id="user-order"> 
                 <table id="order_datatable" class="table table-bordered table-striped" width="100%" data-page-length="50">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Order Id</th>
                      <th>Total</th>
                      <th>Discount</th> 
                      <th>Delivery Charge</th> 
                      <th>Promo Disc.</th>
                      <th>Wallet Used</th>
                      <th>Net Total</th>
                      <th>Revised Total</th>
                      <th>Payable Amount</th>
                      <th>Pay Method</th> 
                      <th>Date</th>
                      <th>Status</th> 
                    </tr>
                  </thead>
                </table> 
           </div>
            
         </div>

      </div>
    </div>
  </section>
</div>
<!-- DataTables -->
<script src="<?= base_url() ?>assets/plugins/datatables/jquery.dataTables.js"></script>
<script src="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.js"></script>

<script type="text/javascript">
    //---------------------------------------------------
  var table = $('#order_datatable').DataTable( {
    "processing": true,
    "serverSide": true,
    "ajax": "<?=base_url($model.'/users/deliveryboy_order_datatable_json/'.$id.'')?>",
    "order": [[12,'desc']],
    "columnDefs": [
    { "targets": 0, "name": "##", 'searchable':true, 'orderable':false},
    { "targets": 1, "name": "userName", 'searchable':true, 'orderable':true},
    { "targets": 2, "name": "orderUserId", 'searchable':true, 'orderable':false},
    { "targets": 3, "name": "total", 'searchable':false, 'orderable':false},
    { "targets": 4, "name": "delivery_charge", 'searchable':false, 'orderable':false}, 

    { "targets": 5, "name": "discount", 'searchable':false, 'orderable':false}, 
    { "targets": 6, "name": "promo_discount", 'searchable':false, 'orderable':false}, 
    { "targets": 7, "name": "final_total", 'searchable':false, 'orderable':false},
    { "targets": 8, "name": "final_total", 'searchable':false, 'orderable':false},
    { "targets": 9, "name": "final_total", 'searchable':false, 'orderable':false},
    { "targets": 10, "name": "final_total", 'searchable':false, 'orderable':false},
    { "targets": 11, "name": "payMethod", 'searchable':false, 'orderable':false}, 
    { "targets": 12, "name": "created", 'searchable':false, 'orderable':true}, 
    { "targets": 13, "name": "status", 'searchable':false, 'orderable':true}, 
    ]
  }); 
</script>