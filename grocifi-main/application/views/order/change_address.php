<div class="modal-dialog modal-lg" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Change Delivery Address Of <?=$user['fname'].' '.$user['lname']; ?></h5> 
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <?php 
      $model = $this->session->userdata('model');
      $this->load->view('includes/_messages.php') ?>
        <?php 
        if(!empty($address)){
          echo form_open(base_url($model.'/order/change_delivery_address'), 'class="form-horizontal" id="delivery-address-form"' )?> 
          <?php foreach ($address as $key => $value) { ?>
            <div class="form-group row" style="border-bottom:1px solid #ededed"> 
              <div class="control-group col-md-2">Address: </div>
              <div class="control-group col-md-7">
                <?=$value['address1'].' '.$value['address2']; ?><br>
                <?=$value['area']['title'].', '.$value['city']['title']; ?><br>
                <?=$value['state']['title'].', '.$value['country']['title']; ?><br>
                <?='pincode: '.$value['pincode']; ?><br>
              </div>
           
            <?php if($value['default_address']==false){ ?>
             <div class="control-group col-md-3"><button type="button" aid="<?=$value['_id']?>" class="btn btn-primary updateDefault"><i class="fa fa-save"></i> Set Default Address </button></div>
           <?php } ?>
            </div> 
          <?php } ?>
        <?php echo form_close(); 
        }else{
          echo '<div class="form-group row"> No Address Found, Please Create New One!!!</div>'; 
        } ?>
    </div>
    <div class="modal-footer"> 
       <?php if($mode==1){ ?>
      <a href="<?= base_url($model.'/users/addaddress/'.$user['_id']); ?>" class="btn btn-success pull-right"><i class="fa fa-plus"></i> Add New Address</a>
      <?php } ?>
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    </div>
  </div>
</div>