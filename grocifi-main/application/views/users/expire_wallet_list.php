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
          <h3 class="card-title"><i class="fa fa-list"></i>&nbsp; Today's Expire Wallet List </h3>
        </div>
      </div>
      
      <div id="location-filter" class="col-sm-12 row"> 
          <div class="col-sm-2">
              <label for="expire_date">Date:</label>
               <input type="date" name="expire_date" id="expire_date" value="<?php echo $today ?>" class="form-control">
          </div>
          <div class="col-sm-3">
          <div>&nbsp;</div> 
          <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_expire_wallet']['is_edit']) && $this->general_user_premissions['user_expire_wallet']['is_edit']==1)){ ?> 
          <button title="Mark As Expire" id="markexpire" class="btn btn-danger btn-sm float-left" style="margin-left:10px;"><i aria-hidden="true" class="fa fa-cog"></i> Mark As Expire</button>
          <button title="Send Notification" id="sendnotification" class="btn btn-success  btn-sm float-left" style="margin-left:10px;"><i aria-hidden="true" class="nav-icon fa fa-bell nav-icon"></i> Send Notification</button> 
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
              <th>Name</th>
              <th>Mobile No.</th>
              <th>Wallet Balance</th>
              <th>Expire Amount</th>
            </tr>
          </thead>
          <tbody>
          <?php
          if(!empty($wallet)){
          $i =1;
          foreach ($wallet as $key => $value) { ?>
            <tr>
              <td><?=$i;?></td>
              <td><?=$value[0];?></td>
              <td><?=$value[1];?></td>
              <td><?=$value[2];?></td>
              <td><?=$value[3];?></td>
            </tr>
          <?php $i++; } 
        }else{ ?>
          <tr><td colspan="4"> No Record Found!!!</td></tr>
        <?php } ?>
          </tbody>
        </table>
      </div>
    </div>
  </section>  
</div>

<!-- DataTables -->
<script src="<?= base_url() ?>assets/plugins/datatables/jquery.dataTables.js"></script>
<script src="<?= base_url() ?>assets/plugins/datatables/dataTables.bootstrap4.js"></script> 

<script src="<?= base_url() ?>assets/dist/js/moment.min.js"></script> 

<script type="text/javascript">
  $("#expire_date").change(function(e) {
  e.preventDefault();
  var waldate = $(this).val();
  var URL = "<?=base_url($model."/users/expire_wallet")?>";
    window.location.href = URL+'/'+waldate;
  });

 var table = $('#na_datatable').DataTable( {
  "pageLength": 100 
 });
 
$("body").on("click","#sendnotification",function(e){   
  e.preventDefault();
  var sdate =  moment($('#expire_date').val()).format("DD/MM/YYYY"); 
  if(confirm('Do you want to send notification to all users, whose wallet amount is expired on '+sdate+' ?')){
      $("#lodingalert").show(); 
      $.post('<?=base_url($model."/users/walletexpirenotification")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        date : $('#expire_date').val() 
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess=='200'){ 
           
          $.notify("Send Notification Successfully", "success");
        }else{
          $.notify(data.msg, "error");
        }
        setTimeout(function(){ $("#lodingalert").hide(); }, 1000);  
      });
  }
});

$("body").on("click","#markexpire",function(e){   
  e.preventDefault();
  var sdate =  moment($('#expire_date').val()).format("DD/MM/YYYY");
 if(confirm('Do you want to mark as expire all users wallet amount, whose wallet amount is expired on '+sdate+' ?')){
    $("#lodingalert").show(); 
      $.post('<?=base_url($model."/users/markuserwalletexpire")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        date : $('#expire_date').val() 
      },
      function(response){
        var data = JSON.parse(response);
        if(data.sucess=='200'){            
          $.notify("Wallet Expire Successfully", "success");
        }else{
          $.notify(data.msg, "error");
        }
        setTimeout(function(){ window.location.reload(); }, 1000);  
      });
 }
});
</script>