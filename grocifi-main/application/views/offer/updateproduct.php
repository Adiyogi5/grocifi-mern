<?php $model = $this->session->userdata('model'); ?>
 <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Main content -->
    <section class="content">
      <div class="card card-default color-palette-bo">
        <div class="card-header">
          <div class="d-inline-block">
              <h3 class="card-title"> <i class="fa fa-list"></i>
              <?=$title ?> for <?=$offer['title']?> </h3>
          </div> 
        </div>
        <div class="card-body">   
          <div class="card-header" style="padding:0px;">                 
              <div class="card">
                  <div class="card-header">
                    <button type="button" class="btn btn-tool" data-widget="collapse" style="color:#333"><h5 class="card-title"> Offer Details </h5></button> 
                    <div class="card-tools">
                      <button type="button" class="btn btn-tool" data-widget="collapse">
                        <i class="fa fa-minus"></i>
                      </button> 
                    </div>
                  </div>
                  <div class="card-body" style="display: none;">
                    <div class="row">
                      <div class="col-sm-12">
                        <div class="form-group row">      
                        <div class="col-sm-4">
                          <label for="title" class="col-sm-12 control-label">Offer Name <span class="red">*</span></label>
                          <div class="form-control"><?=$offer['title']?>
                            <input type="hidden" name="offer_id" id="offer_id" value="<?=$offer['_id']?>">
                          </div>
                        </div>
                        <div class="col-sm-4">
                          <label for="title" class="col-sm-12 control-label">Franchise Name <span class="red">*</span></label>
                          <div class="form-control"><?=$offer['franchiseName']?></div>
                        </div>
                        <div class="col-sm-4">
                          <label for="title" class="col-sm-12 control-label">Offer Type <span class="red">*</span></label>
                          <div class="form-control"><?php echo ($offer['offer_type']==1)? 'Offer' : 'Section';?></div>
                        </div>
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <div class="form-group row">      
                        <div class="col-sm-4">
                          <label for="title" class="col-sm-12 control-label">Has Expiry <span class="red">*</span></label>
                          <div class="form-control"><?php echo ($offer['is_expiry']==1)? 'Yes' : 'Never'; ?></div>
                        </div>
                        <div class="col-sm-4">
                          <label for="title" class="col-sm-12 control-label">Start Date <span class="red">*</span></label>
                          <div class="form-control"><?php echo ($offer['start_date'])?date_time($offer['start_date']):' - ' ?></div>
                        </div>
                        <div class="col-sm-4">
                          <label for="title" class="col-sm-12 control-label">End Date <span class="red">*</span></label>
                          <div class="form-control"><?php echo ($offer['expiry_date'])?date_time($offer['expiry_date']):' - ' ?></div>
                        </div>
                        </div>
                      </div>
                      <div class="col-sm-12">
                        <label for="title" class="col-sm-12 control-label">Description<span class="red">*</span></label>
                        <div class="form-control"><?=$offer['description']?></div>
                      </div> 
                    </div>
                  </div>
              </div> 
              <div class="card">
                <div class="card-header">
                  <button type="button" class="btn btn-tool" data-widget="collapse" style="color:#333"><h5 class="card-title"> Offer Image </h5> </button>
                  <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-widget="collapse">
                      <i class="fa fa-minus"></i>
                    </button> 
                  </div>
                </div>
                <div class="card-body" style="display: none;">
                  <div class="row">
                    <p><img src="<?= $this->config->item('APIIMAGES') ?>offer_banners/<?=$offer['offer_img']; ?>" style="width:100%;"></p> 
                  </div>
                </div>
              </div>  
          </div>
         

          <div class="form-group row" style="margin-top: 5px;">   
             <div class="col-sm-12"  style="margin-bottom: 10px;">  <input type="text" name="product" class="form-control" id="searchproduct" placeholder="Search Product" ></div>

            <?php 
            if(!empty($franchiseproducts )){
            foreach ($franchiseproducts as $key => $value) { ?>
              <div class="col-sm-3 product-main"> 
                <div class="card">
                  <div class="card-header product-header"><?=$value['pname'];?></div>
                  <div class="card-body"> <img id="user-img-nav1" alt="<?=$value['pname']?>" src="<?= $this->config->item('APIIMAGES') ?>product_img/<?=@$value['pimgs'][0]['title']?>" width="150" height="200" /></div>
                  <div class="card-footer">     
                    <?php 
                    if(!in_array($value['productId'], $offerproducts)) { ?>  
                      <button type="button" id="<?=$value['productId']?>" class="btn btn-success btn-sm float-right addToOffer"><i class="fa fa-plus"></i> Add </button>

                    <?php }else{ ?>  
                      <button type="button" id="<?=$value['productId']?>"  class="btn btn-danger btn-sm float-right removeFromOffer"><i class="fa fa-trash"></i> Remove </button>
                    <?php } ?>
                  </div>
                </div>
              </div>
            <?php } } ?>
          </div>
        </div> 
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php') ?>    
      </div>
  </section> 
</div>
<script type="text/javascript"> 
  $("body").on("click",".addToOffer",function(){ 
    pid = $(this).attr('id');
    $.post('<?=base_url($model."/offer/updateofferchild")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      product_id : $(this).attr('id'),
      offer_id : $('#offer_id').val(),
      mode : 1,
    },
    function(response){
      var data = JSON.parse(response);
      if(data.sucess=='200'){  
        $('#'+pid).removeClass('btn btn-success btn-sm float-right addToOffer');
        $('#'+pid).addClass('btn btn-danger btn-sm float-right removeFromOffer');
        $('#'+pid).html('<i class="fa fa-trash"></i> Remove ');
        $.notify("Product Added Successfully", "success");
      }else{
        $.notify(data.msg, "error");
      }
    });
  });

  $("body").on("click",".removeFromOffer",function(){ 
     pid = $(this).attr('id');
    $.post('<?=base_url($model."/offer/updateofferchild")?>',
    {
      '<?php echo $this->security->get_csrf_token_name(); ?>' : '<?php echo $this->security->get_csrf_hash(); ?>',
      product_id : $(this).attr('id'),
      offer_id : $('#offer_id').val(),
      mode : 0,
    },
    function(response){
      var data = JSON.parse(response);
      if(data.sucess=='200'){
        $('#'+pid).removeClass('btn btn-danger btn-sm float-right removeFromOffer');
        $('#'+pid).addClass('btn btn-success btn-sm float-right addToOffer');
        $('#'+pid).html('<i class="fa fa-plus"></i> Add ');
        $.notify("Product Remove Successfully", "success");
      }else{
        $.notify(data.msg, "error");
      }
    });
  });

  $("body").on("keyup","#searchproduct",function(){  
    filter = $('#searchproduct').val().toUpperCase(); 
     console.log(filter);
      // Loop through all list items, and hide those who don't match the search query
     $( ".product-header" ).each(function( i ) {
      var txtValue = $(this).text(); 
      var pro_main = $(this).parent().parent();
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        pro_main.css("display","");  
      } else {
        pro_main.css("display","none");  
      } 
    })
  });
 
</script>