<?php  include('includes/breadcrumb.php'); ?>
<?php
$product_q_class = $this->config->item('product_quality_class');
$product_q_text = $this->config->item('product_quality_text');
$smallunits = $this->config->item('smallunits');
?>
<section class="product-items-slider section-padding">
    <div class="container">
        <div class="section-header">
            <h5 class="heading-design-h5">Search By "<?=$InputSearch;?>"</h5>
        </div>
        <div class="row">
            <?php if (is_array($search) && isset($search[0])) {
    foreach ($search as $key => $val) {
        if (!isset($val['productvar'][0])) {continue;}
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
                    <div class="col-lg-3 col-md-4 col-12 my-md-2 my-1">
                        <div class="card product_card product-header h-100">
                            <span class="badge badge-<?=$product_q_class[$val['product_quality']]?> quality-<?=$product_q_class[$val['product_quality']]?>"><?=$product_q_text[$val['product_quality']]?> Quality</span>
                            <?php
$tempImg = base_url() . 'assets/images/default_img.png';
        if (is_array($val['pimg']) && isset($val['pimg'][0]['title'])) {
            foreach ($val['pimg'] as $pikey => $pivalue) {
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
                            <a href="<?=base_url('products/details/' . $val['_id'])?>">
                                <img src="<?=$tempImg;?>" class="card-img-top" alt="...">
                            </a>
                            <div class="card-body">
                                <?php
$availabeIn = "";
        $price = "";
        $f_mrp = 0;
        if (is_array($val["productvar"]) && isset($val["productvar"][0])) {
            $availabeIn = $val["productvar"][0]["measurment"] . " " . $smallunits[$val["productvar"][0]["unit"]];
            $price = $val["productvar"][0]["price"];
            $f_mrp = (isset($val["productvar"][0]["mrp"]) && $val["productvar"][0]["mrp"] > 0) ? $val["productvar"][0]["mrp"] : 0;
        }?>
                                <h5 class="card-title"><a href="<?=base_url('products/details/' . $val['_id'])?>"><?=$val["product"][0]['title']?></a></h5>

                                <p class="product_price offer-price mb-3">
                                    <i class="mdi mdi-currency-inr"></i> <span class="prod-price<?=$val["_id"];?>"><?=number_format($price, 2);?>/-</span>

                                    <span class="regular-price prod-mrp<?=$val["_id"];?> <?=($f_mrp > 0) ? '' : 'hide';?>">MRP. <?=number_format($f_mrp, 2);?>/-</span>
                                </p>
                                <p class="product_available ms-1 padbt50">
                                    <strong>
                                    <span class="mdi mdi-approval"></span>
                                    Available in
                                    </strong>
                                    -
                                    <span class="prod-avail<?=$val["_id"];?>"><?=@$val["productvar"][0]["measurment"] . ' ' . @$smallunits[@$val["productvar"][0]["unit"]]?></span>
                                </p>
                                <select id="prod-<?php echo $val["_id"]; ?>" class="form-control custom-select product-select change-product">
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
                                    <button type="button" data-val="<?=$firstVarId;?>" class="btn add-to-cart-btn btn-sm btn-<?=$val["_id"];?> btn-tocart">
                                    <i class="mdi mdi-cart-outline"></i> <span> Add To Cart </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php }?>
            <?php } else {?>
                <div class="col-12 my-md-2 my-1">
                    <h4 class="text-center">
                        No record(s) found.
                    </h4>
                </div>
            <?php }?>
        </div>
    </div>
</section>
<!-- Free shipping cms -->
<section class="section-padding mt-md-5 mt-2 mb-0">
    <?php if (is_array($cms_shipping) && !empty($cms_shipping)) {?>
        <?=$cms_shipping['data'];?>
    <?php }?>
</section>