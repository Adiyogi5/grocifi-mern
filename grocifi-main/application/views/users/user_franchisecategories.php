  <!-- Content Wrapper. Contains page content -->
<?php $model = $this->session->userdata('model'); ?>  
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-list"></i>
              <?=$title?> of <?=$franchise['firmname'];?></h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/users/franchise_detail/'.$franchise['userId']); ?>" class="btn btn-success"><i class="fa fa-list"></i> Franchise Detail</a>
          </div>
        </div>
        <div class="card-body">   
          <!-- For Messages -->
          <?php $this->load->view('includes/_messages.php') ?>
            <div class="row">
            <?php  
            $k=0;
            foreach ($catagory as $ckey => $cvalue) { ?>
                <div class="col-sm-6 category-main"> 
                <div class="card">
                  <div class="card-header category-header">
                    <?php if(in_array($cvalue['_id'], $frCats)) { ?>
                    <label style="font-weight: normal;"><input value="<?=$cvalue["_id"]?>" type="checkbox" id="category'<?=$k?>'"  name="category_id['<?=$k?>']" checked="checked" class="updateCategory">&nbsp;<?=$cvalue["title"]?></label>
                    <?php }else{ ?>
                      <label style="font-weight: normal;"><input value="<?=$cvalue["_id"]?>" type="checkbox" id="category'<?=$k?>'"  name="category_id['<?=$k?>']" class="updateCategory">&nbsp;<?=$cvalue["title"]?></label>
                    <?php } ?>
                  </div>
                  <div class="card-body"> 
                    <?php 
                    $i=0;
                    foreach ($cvalue['cats'] as $cakey => $cavalue) {  ?>
                      <div class="col-sm-12">
                      <?php if(in_array($cavalue['_id'], $frCats)) { ?>  
                        <label style="font-weight: normal;"><input value="<?=$cavalue["_id"]?>" type="checkbox" id="category'<?=$k.$i?>'" checked="checked"  name="category_id['<?=$k.$i?>']" class="updateCategory">&nbsp;<?=$cavalue["title"]?></label>
                      <?php }else{ ?>  
                        <label style="font-weight: normal;"><input value="<?=$cavalue["_id"]?>" type="checkbox" id="category'<?=$k.$i?>'"  name="category_id['<?=$k.$i?>']" class="updateCategory">&nbsp;<?=$cavalue["title"]?></label>
                      <?php } ?>  
                      </div>
                     <?php $i++; } ?> 
                  </div> 
                </div>
              </div>
            <?php $k++; } ?>
            </div>
          <!-- /.box-body -->
        </div>
    </section> 
  </div>    
 <script type="text/javascript">      
    $('body').delegate('.updateCategory', 'click', function() {
      if($(this).is(":checked")) {
        var ttype = 'save';
      }else{
        var ttype = 'delete';
      } 
      $.post('<?=base_url($model."/users/updatefranchisecategory")?>',
        {
          '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
          franchiseId : '<?php echo $id ?>',
          catId: $(this).val(),
          type : ttype,
        },
        function(response){
          var data = JSON.parse(response);
          if(data.sucess=='200'){  
            $.notify("Franchise Category Updated", "success");
          }else{
            $.notify(data.msg, "error");
          }
        });
    });
</script> 