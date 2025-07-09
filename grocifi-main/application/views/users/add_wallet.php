<?php $model = $this->session->userdata('model'); ?>
<div class="modal-dialog modal-lg" role="document">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Update Wallet</h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <?php $this->load->view('includes/_messages.php') ?>
        <?php echo form_open(base_url($model.'/user/update_wallet'), 'class="form-horizontal" id="wallet-form"' )?> 
          <div class="form-group row"> 
            <label for="wallet_balance" class="col-sm-12 control-label">Wallet Balance <span class="red">*</span></label>
            <div class="col-md-12">
              <input type="text"  name="wallet_balance" value="<?= set_value('wallet_balance'); ?>" class="form-control" id="wallet_balance" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '')" placeholder="">
              <span id="error_wallet_balance" class="error" ></span>
            </div> 
          </div>
          <div class="form-group row"> 
            <label for="ttype" class="col-sm-12 control-label">Wallet Option <span class="red">*</span></label>
            <div class="col-md-12">
              <select name="ttype" id="wallet_ttype" class="form-control"> 
                    <option value="1" <?= (set_value('ttype') == '1')?'selected': '' ?>>Credit</option>
                    <option value="2" <?= (set_value('ttype') == '2')?'selected': '' ?>>Debit</option>
              </select>
            </div> 
          </div>
          <div class="form-group row"> 
            <label for="wallet_balance" class="col-sm-12 control-label">Description <span class="red">*</span></label>
            <div class="col-md-12">
              <textarea name="description" class="form-control" id="wallet_description" ><?= set_value('description'); ?></textarea> 
              <span id="error_wallet_description" class="error" ></span>
              <input type="hidden" name="_id" id="wallet_id" value="<?=$_id?>">
            </div> 
          </div>
        <?php echo form_close(); ?>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="submit" class="btn btn-primary" id="walletSubmitBtn"><i class="fa fa-save"></i> Submit </button>
    </div>
  </div>
</div>