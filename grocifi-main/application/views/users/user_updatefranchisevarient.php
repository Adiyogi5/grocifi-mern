<!-- Select2 -->
<link rel="stylesheet" href="<?= base_url() ?>assets/plugins/select2/select2.min.css">
<style type="text/css">
  #product_varients td input, #product_varients td select{
    width: 90px;
  }
</style>
<?php $model = $this->session->userdata('model'); ?>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-list"></i>
              <?=$title?> of <?=$franchise['firmname']?></h3>
          </div>
          <div class="d-inline-block float-right">
            <a href="<?= base_url($model.'/users/franchise_detail/'.$franchise['userId']); ?>" class="btn btn-success"><i class="fa fa-list"></i> Franchise Detail</a>
          </div>
        </div>
        <div class="card-body">  
          <?php echo form_open(base_url($model.'/users/updatefranchisevarient/'.$id.'/'.$franchise['_id']), 'class="form-horizontal" id="fraproductForm"');  ?>          
           <!-- For Messages -->
            <?php $this->load->view('includes/_messages.php');  ?>  
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="categoryId" class="col-sm-6 control-label">Catagory Name <span class="red">*</span></label>
                  <select name="categoryId" class="form-control select2" id="categoryId" >
                    <option value="">Select Category</option>
                    <?php foreach ($catagory as $key => $value) { ?>
                      <option <?php if(set_value('categoryId',$fraproducts['catId'])==$value['_id']){ echo "selected='selected'"; }  ?> value="<?=$value['_id']?>"><?=$value['title']?></option>
                    <?php } ?>
                  </select>
                  <label id="categoryId-error" class="error" for="categoryId"></label>
                  <input type="hidden" name="franchiseId" value="<?=$franchise['_id']?>" id="franchiseId">
                  <input type="hidden" name="frproductId" value="<?=$id?>" id="frproductId"> 
                </div>
                <div class="col-sm-6">
                  <label for="productId" class="col-sm-6 control-label">State Products <span class="red">*</span></label>
                  <select name="productId" class="form-control select2" id="productId" >
                     <option value="">Select Products</option>
                  </select>
                  <label id="productId-error" class="error" for="productId"></label>
                </div>   
              </div> 
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="isPacket" class="col-sm-12 control-label">Package Type <span class="red">*</span></label>
                    <label style="font-weight: normal;"><input value="1" type="radio" <?= (set_value('isPacket',$fraproducts['isPacket']) == '1')?'checked': '' ?>  name="isPacket">&nbsp;Packet</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label style="font-weight: normal;"><input value="0" type="radio" <?= (set_value('isPacket',$fraproducts['isPacket']) == '0')?'checked': '' ?> name="isPacket">&nbsp;Loose</label>
                </div> 
                 <div class="col-md-6">
                  <label for="is_active" class="col-sm-6 control-label">Select Status <span class="red">*</span></label>                  
                  <select name="is_active"  id="is_active" class="form-control">
                    <option value="">Select Status</option>
                    <option value="1" <?= (set_value('is_active',$fraproducts['is_active']) == '1')?'selected': '' ?>>Active</option>
                    <option value="2" <?= (set_value('is_active',$fraproducts['is_active']) == '2')?'selected': '' ?>>Deactive</option>
                  </select>
                </div> 
              </div>  
              <div class="form-group row">                
                <div class="col-sm-6">
                  <label for="categoryId" class="col-sm-12 control-label">Max Order <span class="red">*</span> <small>(Zero value means unlimited)</small></label>
                   <input type="text" name="product_max_order" id="product_max_order" class="form-control" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" value="<?= (set_value('product_max_order',$fraproducts['product_max_order'])) ?>" style="width:40%;float: left; margin-right:20px; ">  
                   <select name="product_unit"  id="product_unit" class="form-control"  style="width:40%;float: left;">
                    <?php foreach ($this->config->item('units') as $ukey => $uvalue) { ?>
                      <option value="<?=$ukey?>" <?= (set_value('product_unit',$fraproducts['product_unit']) == $ukey)?'selected': '' ?> ><?=$uvalue?></option>
                    <?php  }?>
                  </select>
                </div> 
                 <div class="col-md-6">
                  <label for="is_active" class="col-sm-6 control-label">Product Quality <span class="red">*</span></label>                  
                   <select name="product_quality"  id="product_quality" class="form-control">
                    <?php foreach ($this->config->item('proquality') as $ukey => $uvalue) { ?>
                      <option value="<?=$ukey?>" <?= (set_value('product_quality',$fraproducts['product_quality']) == $ukey)?'selected': '' ?>><?=$uvalue?></option>
                    <?php } ?>
                  </select>
                </div> 
              </div> 
               <div class="form-group row">  
                <div class="col-md-6"> 
                  <label for="is_active" class="col-sm-6 control-label">Show On Front<span class="red">*</span></label>                  
                   <select name="isShown"  id="isShown" class="form-control"> 
                      <option value="true" <?= (set_value('isShown',$fraproducts['isShown']) == 1)?'selected': '' ?>>True</option> 
                       <option value="false" <?= (set_value('isShown',$fraproducts['isShown']) == 0)?'selected': '' ?>>False</option> 
                  </select>
                </div> 
               </div>
              <hr>
              <div class="form-group row"> 
                 <div class="col-sm-6">
                  <h5> Product Varient</h5>
                  <label id="is_varient_error" class="error"></label>
                 </div> 
                <div class="col-md-6" style="margin-bottom: 5px;">
                  <input type="button" name="addmore" value="Add More" class="btn btn-info pull-right addvarient">
                </div> 
                <?php $varient_row = 0; ?>
                 <div class="col-sm-12">
                  <input type="hidden" name="is_varient" id="is_varient" value="<?=count($fraproductvarient)?>">
                  <table class="table table-bordered" id="product_varients">
                    <thead>
                      <tr>
                        <th style="width:15%">Measurment</th>
                        <th style="width:15%">Unit</th>
                        <?php if($this->general_settings['is_wholesaler']==1){ ?>
                        <th style="width:12%">WS. Price</th>
                        <?php } ?>
                        <th style="width:12%">Cust. Price</th>
                        <th style="width:12%">MRP</th>
                        <th style="width:12%">Disc.(%)<br><small style="font-size:10px;">only for customer</small></th>
                        <th style="width:12%">Stock</th>
                        <th style="width:15%">Cust. Status</th>
                        <?php if($this->general_settings['is_wholesaler']==1){ ?>
                        <th style="width:15%">WS. Status</th>
                        <?php } ?>
                        <th style="width:10%">Action</th>
                      </tr>
                    </thead>
                    <tbody> 
                      <?php foreach ($fraproductvarient as $key => $value) { ?>
                        <tr class="varientspro" id="varients-row<?=$varient_row?>" rid="<?=$varient_row?>">
                          <td>
                            <input type="text" class="form-control" name="oldvarient[<?=$varient_row?>][measurment]" id="measurment<?=$varient_row?>" value="<?=$value['measurment']?>">
                            <input type="hidden" name="oldvarient[<?=$varient_row?>][_id]" id="_id<?=$varient_row?>" value="<?=$value['_id']?>">
                          </td>
                          <td>
                            <select name="oldvarient[<?=$varient_row?>][unit]" id="unit0" class="form-control">
                              <?php foreach ($this->config->item('units') as $ukey => $uvalue) { ?>
                              <option value="<?=$ukey?>" <?= ($value['unit'] == $ukey)?'selected': '' ?> ><?=$uvalue?></option>
                              <?php } ?>
                            </select>
                          </td> 
                          <?php if($this->general_settings['is_wholesaler']==1){ ?>
                          <td>
                            <input type="text" name="oldvarient[<?=$varient_row?>][wholesale]" class="form-control" id="wholesale<?=$varient_row?>" placeholder="" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" value="<?=$value['wholesale']?>"></td>  
                          <?php } ?>  
                          <td>
                            <input type="text" name="oldvarient[<?=$varient_row?>][price]" class="form-control" id="price<?=$varient_row?>" placeholder="" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" value="<?=$value['price']?>"></td> 
                          <td>
                            <input type="text" name="oldvarient[<?=$varient_row?>][mrp]" class="form-control" id="mrp<?=$varient_row?>" placeholder="" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" value="<?=@$value['mrp']?>">
                          </td> 
                          <td>
                            <input type="text" name="oldvarient[<?=$varient_row?>][disc_price]" class="form-control" id="disc_price<?=$varient_row?>" placeholder="" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" value="<?=$value['disc_price']?>">
                          </td>  
                          <td>
                            <input type="text" name="oldvarient[<?=$varient_row?>][qty]" class="form-control" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '')" id="qty<?=$varient_row?>" value="<?=$value['qty']?>">
                          </td> 
                          <td>
                            <select name="oldvarient[<?=$varient_row?>][is_active]" id="is_active<?=$varient_row?>" class="form-control"><option value="1" <?= ($value['is_active'] == "1")?'selected': '' ?> >Available</option><option value="2" <?= ($value['is_active'] == "2")?'selected': '' ?> >Not Available</option> <option value="3" <?= ($value['is_active'] == "3")?'selected': '' ?> >Sold</option> </select>
                          </td> 
                         <?php if($this->general_settings['is_wholesaler']==1){ ?>  
                          <td>
                            <select name="oldvarient[<?=$varient_row?>][is_ws_active]" id="is_ws_active<?=$varient_row?>" class="form-control"><option value="1" <?= ($value['is_ws_active'] == "1")?'selected': '' ?> >Available</option><option value="2" <?= ($value['is_ws_active'] == "2")?'selected': '' ?> >Not Available</option> <option value="3" <?= ($value['is_ws_active'] == "3")?'selected': '' ?> >Sold</option> </select>
                          </td>
                        <?php } ?>  
                          <td> -- </td>
                        </tr>
                      <?php $varient_row++; } ?>
                    </tbody>
                  </table>
                 </div>
              </div>
              <div class="form-group">
                <div class="col-md-12"> 
                  <input type="submit" name="submit" value="Submit" class="btn btn-success pull-right btn-submit">
                </div>
              </div>
            <!-- /.box-body -->
          <?php echo form_close(); ?>
        </div>
    </section> 
  </div>    
<!-- Select2 -->
<script src="<?= base_url() ?>assets/plugins/select2/select2.full.min.js"></script>

<script type="text/javascript">
  $(function () { 
    var varient_row = <?php echo $varient_row ?>;
    var productId = '<?php echo $fraproducts['productId'] ?>';
    var is_wholesaler = '<?php echo $this->general_settings['is_wholesaler']; ?>';
    var unit = <?php echo json_encode($this->config->item('units')); ?>;
    $("body").on("change","#categoryId",function(){  
      $("#productId").empty().trigger('change');
      $.post('<?=base_url($model."/users/getfranchiseproductsbycats")?>',
      {
        '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
        category_id : $(this).val(),
        franchiseId : '<?php echo $id ?>',
      },
      function(response){  
          $('#productId').html(response);         
      });
    }); 
    $("#categoryId").trigger('change');
    setTimeout(function(){ $("#productId").val(productId); $("#productId").select2("val", productId); }, 2000);

    $('.addvarient').on('click', function() {  
      var html ='<tr class="varientspro" id="varients-row' + varient_row + '" rid="' + varient_row + '"><td><input type="text" class="form-control" name="varient[' + varient_row + '][measurment]" id="measurment' + varient_row + '"></td><td><select name="varient[' + varient_row + '][unit]" id="unit' + varient_row + '" class="form-control">';
        $.each( unit, function( key, value ) {
          html +='<option value="'+key+'">'+value+'</option>';
        });
        html +='</select></td>';
        if(is_wholesaler==1){
        html +='<td><input type="text" name="varient[' + varient_row + '][wholesale]" class="form-control" id="wholesale' + varient_row + '" placeholder="" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, \'\')"   value="0"></td>';
        }
        html +='<td><input type="text" name="varient[' + varient_row + '][price]" class="form-control numberval" id="price' + varient_row + '" placeholder="" value="0"></td> <td><input type="text" name="varient[' + varient_row + '][mrp]" class="form-control numberval" id="mrp' + varient_row + '" placeholder="" value="0"></td> <td><input type="text" name="varient[' + varient_row + '][disc_price]" class="form-control numberval" id="disc_price' + varient_row + '" placeholder="" value="0"></td>  <td><input type="text" name="varient[' + varient_row + '][qty]" class="form-control numberval"  id="qty' + varient_row + '"></td> <td><select name="varient[' + varient_row + '][is_active]" id="is_active' + varient_row + '" class="form-control"><option value="1">Available</option><option value="2">Not Available</option> <option value="3">Sold</option> </select></td>'; 
        if(is_wholesaler==1){
          html +='<td><select name="varient[' + varient_row + '][is_ws_active]" id="is_ws_active' + varient_row + '" class="form-control"><option value="1">Available</option><option value="2">Not Available</option> <option value="3">Sold</option> </select></td>';
        }
        html +='<td><span class="removeimg" vid="' + varient_row + '"><i class="fa fa-trash" style="font-size:25px;padding-top: 5px;"></i></span></td></tr>'; 
         
      $('#product_varients tbody').append(html);
      varient_row++; 
      var totpro =0;
      $( ".varientspro" ).each(function( index ) {  
        totpro=totpro+1;
      })
      if(totpro==0){
        $('#is_varient').val('');
      }else{
        $('#is_varient').val(totpro);
      }
    }); 

    $('#product_varients').delegate('.removeimg', 'click', function() { 
      var pid = $(this).attr('vid');
      $('#varients-row'+pid).remove();
      
      var totpro =0;
      $( ".varientspro" ).each(function( index ) {  
        totpro=totpro+1;
      })
      if(totpro==0){
        $('#is_varient').val('');
      }else{
        $('#is_varient').val(totpro);
      }
    });
 
    //Initialize Select2 Elements
    $('.select2').select2();


    $("#fraproductForm").validate({
        rules: {
            categoryId:"required",
            productId: "required",  
            is_active: "required", 
            product_max_order: "required",  
            is_varient:"required",  
        },
        messages: {
            categoryId: "Please Select Category",
            productId: "Please Select Product", 
            is_active: "Please Select Status",  
            product_max_order: "Please Enter Max Order Value", 
            is_varient: "Please Select Product Varient",  
        }
    });
    $("body").on("click", ".btn-submit", function(e){
        if ($("#fraproductForm").valid()){
          $('#is_varient_error').hide();
          var varientspro = 0
          if($(".varientspro").length==0){
            $('#is_varient_error').html('Please Enter Product Varient Details.');
            $('#is_varient_error').show();
            return false;
          }
          $(".varientspro").each(function( index ) {  
           var rid = $(this).attr('rid');
           if($('#measurment'+rid).val()==''){
             varientspro = 1;
           }
           if($('#wholesale'+rid).val()==''){
             varientspro = 1;
           }
           if($('#price'+rid).val()==''){
             varientspro = 1;
           }
           if($('#mrp'+rid).val()==''){
             varientspro = 1;
           }
           if($('#disc_price'+rid).val()==''){
             varientspro = 1;
           }
           if($('#qty'+rid).val()==''){
             varientspro = 1;
           } 
          })
          if(varientspro==1){
            $('#is_varient_error').html('Please Enter Product Varient Details.');
            $('#is_varient_error').show();
            return false;
          }else{
            $("#fraproductForm").submit();
          }
        }
    });

    $("body").on("keyup", ".numberval", function(e){
        
      if (/\D/g.test(this.value)) this.value = this.value.replace(/[^\d\.]/g, '');
       
    }); 

  });
</script>