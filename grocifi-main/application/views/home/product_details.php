<?php  include('includes/breadcrumb.php'); ?>
<?php
$product_q_class = $this->config->item('product_quality_class');
$product_q_text = $this->config->item('product_quality_text');
$smallunits = $this->config->item('smallunits');

$mainprod = array();
$imgs = array();
$frprod = array();
$variants = array();
// prd($this->general_settings);


if($product){   
    $mainprod = $product["product"][0];
    $imgs = $product["pimg"];
    $temp = $product;
    unset($temp["variants"], $temp["product"], $temp["pimg"]);
    $frprod = $temp;
    unset($temp);
    $variants = $product["variants"];
}

if (is_array($variants) && isset($variants[0])) {
    foreach ($variants as $k => $pvar) {
        if ($pvar["qty"] <= 0) {
            unset($variants[$k]);
        }
    }
}

$allAvail = false;
if (is_array($variants) && count($variants) > 0) {
    foreach ($variants as $pvar) {
        if ($pvar["is_active"] == "1") {
            $allAvail = true;
        }
    }
}

?>
<div class="product-detail-page" id="productDetails">
    <section class="shop-single section-padding pt-3">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="shop-detail-left">
                        <div class="shop-detail-slider" >
                            <div id="sync1" class="owl-carousel">
                                <?php foreach ($imgs as $val) { ?>
                                <div class="item">
                                    <img alt="" src="<?= $this->config->item('PRODUCTIMAGEPATH').$val["title"] ?>" class="img-fluid img-center">
                                </div>
                                <?php }?>
                            </div>
                            <div id="sync2" class="owl-carousel">
                            <?php foreach ($imgs as $val) { ?>
                                <div class="item">
                                    <img alt="" src="<?= $this->config->item('PRODUCTIMAGEPATH').$val["title"] ?>" class="img-fluid img-center">
                                </div>
                            <?php } ?>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="shop-detail-right">
                        <?php if ($allAvail) {?>
                            <span class="badge badge-<?=$product_q_class[$frprod['product_quality']]?> quality-<?=$product_q_class[$frprod['product_quality']]?>"><?=$product_q_text[$frprod['product_quality']]?> Quality</span>
                        <?php }?>
                        <h2><?=$mainprod['title']?></h2>
                        <?php
                            $price = "";
                            $f_mrp = 0.00; //first mrp
                            $availabeIn = "";
                            if (is_array($variants) && isset($variants[0])) {
                                $availabeIn = $variants[0]["measurment"] . " " . $smallunits[$variants[0]["unit"]];
                                $price = $variants[0]["price"];
                                $f_mrp = (isset($variants[0]["mrp"]) && $variants[0]["mrp"] > 0) ? $variants[0]["mrp"] : 0;
                            }
                        ?>
                        <h6>
                            <strong>
                                <span class="mdi mdi-approval"></span>
                                Available in
                            </strong>
                            -
                            <span class="prod-avail<?=$product['_id'];?>"><?=$availabeIn?></span>
                        </h6>
                        <?php
                            $firstVarId = "";
                            $opt = "";
                            if (is_array($variants) && isset($variants[0])) {
                                foreach ($variants as $pvar) {
                                    if ($pvar["is_active"] == "1") {

                                        if ($firstVarId == "") {
                                            $firstVarId = $pvar["_id"];
                                        }

                                        $mrp = (isset($pvar["mrp"]) && $pvar["mrp"] > 0) ? $pvar["mrp"] : 0;
                                        $opt .= '<option data-id="' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . '&' . number_format($pvar["price"], 2) . '&' . number_format($mrp, 2) . '&' . $pvar["is_active"] . '" value="' . $pvar["_id"] . '">' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . ' &nbsp;[Rs. ' . $pvar["price"] . ']</option>';
                                    }
                                }
                            }?>
                        <select id="prod-<?=$product['_id'];?>" class="form-control custom-select border-form-control mb-2 change-product"><?=$opt;?></select>
                        <p>&nbsp;</p>
                        <p class="offer-price mb-0">Price : <?=$this->general_settings['currency']?> &nbsp;<span class="prod-price<?=$product['_id'];?>"><?=number_format($price, 2);?></span> <i class="mdi mdi-tag-outline"></i>
                            <span class="regular-price prod-mrp<?=$product['_id'];?> <?=($f_mrp > 0) ? '' : 'hide';?>">MRP. <?=$f_mrp;?></span>
                            </p>
                        <div class="product-footer">
                            <button data-val="<?=$firstVarId;?>" type="button" class="btn btn-secondary btn-lg btn-<?=$product['_id'];?> btn-tocart"><i class="mdi mdi-cart-outline"></i> Add To Cart</button>
                        </div>
                        <div class="short-description">
                            <h5>
                                Product Description
                                <p class="float-right">
                                    Availability:
                                    <span id="stock-available" class="badge badge-<?=($allAvail) ? 'success' : 'danger'?>"><?=$allAvail ? 'In-Stock' : 'Out of Stock'?></span>
                                </p>
                            </h5>
                            <p class="mb-0"><?=$mainprod['description']?></p>
                        </div>
                         
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
<!-- <script type="text/javascript">
    let Token = '<?=$this->security->get_csrf_hash(); ?>';
</script> -->