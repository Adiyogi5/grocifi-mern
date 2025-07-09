  <!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
<?php $model = $this->session->userdata('model'); ?>    
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-plus"></i>
              Access Permissions for <?php echo $userdetail['fname'].' '.$userdetail['lname']; ?>  </h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/users/admin'); ?>" class="btn btn-success"><i class="fa fa-list"></i>  Admins & Sub Admins List</a>
          </div>
        </div>
        <div class="card-body">   
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php') ?>
            
            <table class="table table-bordered table-striped" width="100%">
                <thead>
                    <tr class="text-center">
                        <th>Id</th>
                        <th>Section</th>
                        <th>View</th>
                        <th>Add</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody id="result">
                    <?php 
                    if (isset($permission) && count($permission) > 0) {
                        $i = 1;
                        foreach ($permission as $rs) {
                            ?>
                            <tr id="<?php echo $rs['_id'] . 'row'; ?>">
                                <td class="text-center"><?php echo $i; ?></td>
                                <td class="text-center"><?php echo ucwords(str_replace('_', ' ', $rs['name']));?></td>

                                <td class="text-center">
                                <?php if($rs['is_view'] != 2){ ?>    
                                  <input type="checkbox" class="form-check-input mt-0 pt-0 tgl_checkbox" id="<?php echo 'is_view' . $rs['_id']; ?>" data-modelid="<?php echo $rs['_id']; ?>" data-userid="<?php echo $rs['_id']; ?>" data-type="is_view"  data-opt="View"  <?php if($rs['is_view'] == 1){ echo 'checked'; } ?>>
                                <?php }else{
                                    echo '--';
                                } ?>  
                                </td>

                                <td class="text-center">
                                <?php if($rs['is_add'] != 2){ ?>  
                                  <input type="checkbox" class="form-check-input mt-0 pt-0 tgl_checkbox" id="<?php echo 'is_add' . $rs['_id']; ?>" data-modelid="<?php echo $rs['_id']; ?>" data-userid="<?php echo $rs['_id']; ?>" data-type="is_add"  data-opt="Add"  <?php if($rs['is_add'] == 1){ echo 'checked'; } ?>>
                                 <?php }else{
                                    echo '--';
                                } ?>  
                                </td>

                                <td class="text-center">
                                <?php if($rs['is_edit'] != 2){ ?>    
                                  <input type="checkbox" class="form-check-input mt-0 pt-0 tgl_checkbox" id="<?php echo 'is_edit' . $rs['_id']; ?>" data-modelid="<?php echo $rs['_id']; ?>" data-userid="<?php echo $rs['_id']; ?>" data-type="is_edit"  data-opt="Edit"  <?php if($rs['is_edit'] == 1){ echo 'checked'; } ?>>
                                 <?php }else{
                                    echo '--';
                                } ?>   
                                </td>

                                <td class="text-center">
                                <?php if($rs['is_delete'] != 2){ ?>    
                                  <input type="checkbox" class="form-check-input mt-0 pt-0 tgl_checkbox" id="<?php echo 'is_delete' . $rs['_id']; ?>" data-modelid="<?php echo $rs['_id']; ?>" data-userid="<?php echo $rs['_id']; ?>" data-type="is_delete" data-opt="Delete" <?php if($rs['is_delete'] == 1){ echo 'checked'; } ?>>
                                <?php }else{
                                    echo '--';
                                } ?>  
                                </td>
 
                            </tr>
                            <?php
                            $i++;
                        }
                    }
                    ?>
                </tbody>
          </table>

        </div>
    </section> 
  </div>    

  <script type="text/javascript">
 
  $("body").on("change",".tgl_checkbox",function(){
    var id = $(this).data('modelid');
    var opt = $(this).data('opt');
    var sid = $(this).is(':checked');
    var mid = $('#is_view'+id).is(':checked');
    if(mid==false && sid==true && $('#is_view'+id).length!=0){
      alert("Please select view option then you can able to select "+opt+"");
      $(this).prop("checked", false);
      return false;
    }else if(mid==false && $('#is_view'+id).length!=0){
       var aid = $('#is_add'+id).is(':checked');
       var eid = $('#is_edit'+id).is(':checked');
       var did = $('#is_delete'+id).is(':checked'); 
       if(aid==true || eid==true || did==true ){
        alert("Without view you did not select add/edit/delete option");
        $(this).prop("checked", true);
        return false;
       }
    }
    $.post('<?=base_url($model."/users/updateuserpermission")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      _id : $(this).data('modelid'),
      mode : $(this).data('type'),
      modeval : $(this).is(':checked') == true?1:0
    },
    function(data){
      $.notify("Permission Changed Successfully", "success");
    });
  });
 
</script>  