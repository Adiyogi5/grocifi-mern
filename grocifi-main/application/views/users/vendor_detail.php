<!-- DataTables -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.css"> 
<?php $model = $this->session->userdata('model'); ?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <?php $vendorData = $vendor[0]; ?>
  <!-- Main content -->
  <section class="content">
    <div class="card card-default color-palette-bo">
      <div class="card-header">
        <div class="d-inline-block">
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; <?=$vendorData['fname'].' '.$vendorData['lname'];?> Detail </h3>
        </div>
        <div class="d-inline-block float-right">
          <a href="<?= base_url($model.'/users/vendor'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Vendor List</a>
        </div>
      </div>
      <div class="card-body">   
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#user-basic" role="tab" aria-controls="basic" aria-selected="true">Vendor Detail</a>
          </li>  
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#user-category" role="tab" aria-controls="category" aria-selected="false">Category Detail</a>
          </li>
          <li class="nav-item">
            <a class="nav-link " id="pills-home-tab" data-toggle="pill" href="#user-product" role="tab" aria-controls="product" aria-selected="false">Product Detail</a>
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
                  <?php if($vendorData['img']!='noimage.png'){ ?>
                  <p><img src="<?= $this->config->item('APIIMAGES') ?>user_img/<?=$vendorData['img']; ?>" class="logosmallimg"></p>   
                  <?php }else{ ?>
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>noimage.png" class="logosmallimg"></p> 
                  <?php } ?>
                </div>
                <div class="col-md-4"><b>Name:&nbsp; </b> <?=$vendorData['fname'].' '.$vendorData['lname'];?></div>
                <div class="col-md-4"><b>Email:&nbsp; </b> <?=!empty($vendorData['email'])?$vendorData['email']:'--';?></div>
                <div class="col-md-4"><b>Phone:&nbsp; </b> <?=!empty($vendorData['phone_no'])?$vendorData['phone_no']:'--';?></div>
                <div class="col-md-4"><b>Address:&nbsp; </b> </div>  
                <div class="col-md-4"><b>Wallet Balance:&nbsp; </b> <?=$vendorData['franchisevendors']['wallet_balance'];?></div>  
                <div class="col-md-4"><b>Register At:&nbsp; </b> <?=date('d-m-Y',strtotime($vendorData['created']));?></div>
                <div class="col-md-4"><b>Approved Status:&nbsp; </b> 
                  <?php 
                    if($vendorData['franchisevendors']['is_approved']==1){
                      echo '<span class="green"> Approved </span>';
                    }else{
                      echo '<span class="red"> Not Approve </span>';
                    } 
                  ?>
                </div>
                <?php if($vendorData['franchisevendors']['is_approved']==1){  ?>
                <div class="col-md-4"><b>Approved By:&nbsp; </b> <?=$vendorData['franchisevendors']['approvedby'];?></div>
                <?php } ?>
              </div> 
              <hr>
           </div>
           <div role="tabpanel" class="tab-pane " id="user-category"> 
                   Category
           </div>
           <div role="tabpanel" class="tab-pane " id="user-product"> 
                   Product
           </div>
           <div role="tabpanel" class="tab-pane " id="user-order"> 
                   Order
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
  
</script>