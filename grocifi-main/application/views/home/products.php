<?php include('includes/breadcrumb.php'); ?>
<?php $product_q_class = $this->config->item('product_quality_class');?>
<?php $product_q_text = $this->config->item('product_quality_text');?>
<?php $smallunits = $this->config->item('smallunits');?>
<section class="shop-list section-padding">
    <div class="container">
        <div class="row">
            <div class="col-md-3">
                <div class="shop-filters">                    
                    <div class="card grocery-category">
                        <div class="pt-lg-3 py-md-2" style="border-bottom: solid 1px #4b1489; padding-left:5px;">
                            <h2 class="col-12 ">Category </h2>
                        </div>
                        <div class="navbar-collapse" id="navbarSupportedCat" style="justify-content: left;"> 
                            <ul style="list-style: none; width: 100%;" class="bg-light scroldiv">
                                <?php foreach($parentcatData as $key => $pval){ ?>                  
                                <li class="pt-1 position-relative" style="width: 97%;">
                                    <a href="<?=base_url('products/'.$pval['slug'])?>"><?=$pval['title']?></a>
                                    <?php
                                    $subcat= $this->Commonmodel->getData($this->config->item('APIURL') . 'catagory/index/' . $pval['_id'], $this->authtoken);
                                    if ($subcat['sucess'] == 200 && !empty($subcat['data'][0])) {
                                        $subcategory = $subcat['data']; 
                                    ?>
                                    <i class="fa fa-plus position-absolute top-0 end-0 mt-lg-1" data-bs-toggle="collapse" href="#collapseExample<?= $key ?>">+</i>
                                    <i style="display: none;"  class="fa fa-minus position-absolute top-0 end-0 mt-lg-1" data-bs-toggle="collapse" href="#collapseExample<?= $key ?>">-</i>

                                    <div class="collapse" id="collapseExample<?= $key ?>">
                                        <div class="bg-light border-0 p-0 m-0">     
                                                <ul style="list-style: none;">
                                                    <?php foreach ($subcategory as $skey => $svalue) {  ?>
                                                        <a href="<?=base_url('products/'.$svalue['slug'])?>">
                                                            <li class="bg-light ps-lg-3 ps-md-2 mt-1 ps-1"><?=$svalue['title'] ?></li>
                                                        </a>
                                                    <?php } ?>
                                                </ul>
                                        </div>
                                    </div>
                                    <?php } ?>
                                </li>                             
                            <?php } ?>
                            </ul>
                        </div>
                    </div>                    
                </div>
            </div>
            <div class="col-md-9"> 
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-6 row d-flex justify-content-end mb-3">
                        <div class="form-group">
                            <div class="input-group search_bar">
                              <input class="form-control border-0 ms-1" placeholder="Search products" aria-label="Search products" type="text" id="prosearch" name="prosearch" value="<?=$search?>">
                              <span class="input-group-btn">
                                 <button class="btn btn-search" type="submit"><img src="<?=base_url('assets/img/search.png')?>" alt=""></button>
                              </span>
                           </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-6 row d-flex justify-content-end mb-3">
                        <div class="col-3 text-end mx-0 pt-1">
                            <span class="text-dark fs-6">Sort By: </span>
                        </div>
                        <div class="dropdown col-8 mx-0 px-0 pt-0"> 
                            <select class="form-select profilterData" aria-label="Default select example">
                                <option value="#">Default</option>
                                <option value="name_asc" <?=($sort=='name_asc')?"selected":""?>>Name, A to Z</option>
                                <option value="name_desc" <?=($sort=='name_desc')?"selected":""?>>Name, Z to A</option>
                                <option value="price_asc" <?=($sort=='price_asc')?"selected":""?>>Price, low to high</option>
                                <option value="price_desc" <?=($sort=='price_desc')?"selected":""?>>Price, high to low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row no-gutters">
                    <?php if (is_array($siteProduct) && isset($siteProduct[0])) { ?>
                        <?php foreach ($siteProduct as $key => $val) { ?>
                            <?php if (!isset($val['productvar'][0])) {continue;}?>
                            <?php
                                $allAvail = false;
                                    foreach ($val['productvar'] as $pkey => $pvalue) {
                                        if ($pvalue['is_active'] == '1') {
                                            $allAvail = true;
                                        }
                                    }
                                    if (!$allAvail) {
                                        continue;
                                    }
                                    ?>
                            <div class="col-md-4 product-div mb-3">
                                <div class="card product_card product-header h-100">
                                    <span class="badge badge-<?=$product_q_class[$val['product_quality']]?> quality-<?=$product_q_class[$val['product_quality']]?>"><?=$product_q_text[$val['product_quality']]?> Quality</span>
                                    <?php
                                    $tempImg = base_url() . 'assets/images/default_img.png';
                                        if (is_array($val['productImg']) && isset($val['productImg'][0]['title'])) {
                                            foreach ($val['productImg'] as $pikey => $pivalue) {
                                                if ($pivalue['isMain'] == 1) {
                                                    $file_headers = get_headers($this->config->item('PRODUCTIMAGEPATH') . $pivalue["title"]);
                                                    if ($file_headers[0] == 'HTTP/1.1 200 OK') {
                                                        $tempImg = $this->config->item('PRODUCTIMAGEPATH') . $pivalue['title'];
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    ?>
                                    <a href="<?=base_url('products/details/' . $val['frProductId'])?>"><img src="<?=$tempImg;?>" class="card-img-top" alt="..."></a>
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            <a href="<?=base_url('products/details/' . $val['frProductId'])?>">
                                                <?=$val['title']?>
                                            </a>
                                        </h5>
                                        <?php
                                            $availabeIn = "";
                                            $price = "";
                                            $f_mrp = 0;
                                            if (is_array($val["productvar"]) && isset($val["productvar"][0])) {
                                                $availabeIn = $val["productvar"][0]["measurment"] . " " . $smallunits[$val["productvar"][0]["unit"]];
                                                $price = $val["productvar"][0]["price"];
                                                $f_mrp = (isset($val["productvar"][0]["mrp"]) && $val["productvar"][0]["mrp"] > 0) ? $val["productvar"][0]["mrp"] : 0;
                                            }
                                        ?>
                                        <p class="product_price offer-price pb-0 mb-3">
                                        <i class="mdi mdi-currency-inr"></i> <span class="prod-price<?=$val["frProductId"];?>"><?=number_format($price, 2);?></span>

                                            <span class="regular-price prod-mrp<?=$val["frProductId"];?> <?=($f_mrp > 0) ? '' : 'hide';?>">
                                            <i class="mdi mdi-currency-inr"></i>
                                            MRP. <?=number_format($f_mrp, 2);?></span>
                                        </p>
                                        <p class="product_available ms-1">
                                            <span class="mdi mdi-approval"></span>
                                            <strong>Available in -</strong> <span class="prod-avail<?=$val["frProductId"];?>">500 Gms</span>
                                        </p>

                                        <select id="prod-<?php echo $val["frProductId"]; ?>" class="form-control custom-select border-form-control mb-2 change-product product-select">
                                        <?php
                                            $firstVarId = "";
                                            if (is_array($val["productvar"]) && isset($val["productvar"][0])) {
                                                foreach ($val["productvar"] as $pvar) {
                                                    if ($pvar["is_active"] == '1') {
                                                        if ($firstVarId == "") {
                                                            $firstVarId = $pvar["_id"];
                                                        }
                                                        $mrp = (isset($pvar["mrp"]) && $pvar["mrp"] > 0) ? $pvar["mrp"] : 0;
                                                        echo '<option data-id="' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . '&' . number_format($pvar["price"], 2) . '&' . number_format($mrp, 2) . '" value="' . $pvar["_id"] . '">' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . ' &nbsp;[Rs. ' . $pvar["price"] . ']</option>';
                                                    }
                                                }
                                        }?></select>
                                        <div class="card-footer bg-transparent border-0 px-0 mt-1">
                                            <button class="btn add-to-cart-btn p-0 position-relative btn-tocart btn-<?=$val["frProductId"];?>" data-val="<?=$firstVarId;?>">
                                                <i class="mdi mdi-cart-outline"></i>
                                                <span class="position-absolute">Add To Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>

                   <?php } else {?>
                    <div>
                        <h4 class="text-center">
                            No record(s) found.
                        </h4>
                    </div>
                   <?php } ?>
                </div>
            </div>
        </div>
    </div>
    <div class="course_navigation mt-4">
        <div class="container">
            <div class="row ">
                <nav aria-label="Page navigation example">
                     <?=$this->pagination->create_links();?>
                </nav>

            </div>
        </div>
    </div>
</section>
<script type="text/javascript">
    var base_url = '<?=base_url().'products/'.$slug ?>';
     $(document).ready(function() {        
        $('.btn-search').on('click', function() {
            var search = $('#prosearch').val();
            window.location.href = base_url+'?search='+search;
        });        
        $('.profilterData').on('change', function() {
            var sort = $(this).val();
            var search = $('#prosearch').val();
            if(search!=''){
                window.location.href = base_url+'?search='+search+'&sort='+sort;    
            }else{
                window.location.href = base_url+'?sort='+sort;
            }
            
        });
    });
  
/*    let Token = '<?=$this->security->get_csrf_hash(); ?>';*/

    $(".collapse").on('show.bs.collapse', function(elem) {
        $(this).parent().find('.fa-plus').hide();
        $(this).parent().find('.fa-minus').show();
    })
    $(".collapse").on('hide.bs.collapse', function(elem) {
        $(this).parent().find('.fa-plus').show();
        $(this).parent().find('.fa-minus').hide();
    })   

</script>