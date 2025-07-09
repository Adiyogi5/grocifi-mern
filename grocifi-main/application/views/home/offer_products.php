<?php $product_q_class = $this->config->item('product_quality_class');?>
<?php $product_q_text = $this->config->item('product_quality_text');?>
<?php $smallunits = $this->config->item('smallunits');
?>

<section class="product-items-slider section-padding">
    <div class="container">
        <div class="owl-carousel owl-carousel-featured">
            <?php if (is_array($siteProduct) && isset($siteProduct[0])) {?>
                        <?php foreach ($siteProduct as $key => $val) {?>
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
    <div class="item">
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
            <a href="<?=base_url('products/details/' . $val['frProductId'])?>">
                <img src="<?=$tempImg?>" class="card-img-top" alt="...">
            </a>
                    <div class="card-body">
                        <a href="<?=base_url('products/details/' . $val['frProductId'])?>">
                            <h5 class="card-title"><?=$val['title']?></h5>
                        </a>
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
                        <p class="product_price offer-price pb-0 mb-3"><i class="mdi mdi-currency-inr"></i>
                        <span class="prod-price<?=$val["frProductId"];?>"><?=number_format($price, 2);?></span>
                        <span class="regular-price prod-mrp<?=$val["frProductId"];?> <?=($f_mrp > 0) ? '' : 'hide';?>">
                        <i class="mdi mdi-currency-inr"></i>
                        MRP. <?=number_format($f_mrp, 2);?>

                        </span>
                        </p>
                        <p class="product_available ms-1">
                            <span class="mdi mdi-approval"></span>
                            <strong>Available in - </strong>
                            <span class="prduct_qty prod-avail<?=$val["frProductId"];?>">500 Gms</span>
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
                            <button class="btn add-to-cart-btn p-0 position-relative btn-<?=$val["frProductId"];?> btn-tocart" data-val="<?=$firstVarId;?>">
                                <i class="mdi mdi-cart-outline"></i>
                                <span class="position-absolute">Add To Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
    </div>
    <?php }?>
    <?php } else {?>
        <div>
            <h4 class="text-center">
                No record(s) found.
            </h4>
        </div>
    <?php }?>
        </div>
    </div>
</section>
<!-- Free shipping cms -->
<section class="my-lg-5 my-md-3 my-2">
   <?php if (is_array($cms_content) && !empty($cms_content)) {?>
      <?=$cms_content['data'];?>
   <?php }?>
</section>