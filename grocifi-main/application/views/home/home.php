<!-- banner - starts -->
<section class="carousel-slider-main text-center border-top border-bottom bg-white">
    <div class="owl-carousel owl-carousel-slider">
        <?php foreach ($siteBanner as $key => $val) { ?>
        <div class="item">
            <?php if ($val[0] != 'no title') { ?>
            <a href="<?= base_url() ?>"><img class="img-fluid" src="<?= $val[1]; ?>" alt="<?= $val[0]; ?>"></a>
            <?php } else { ?>
            <a href="javascript:void(0);"><img class="img-fluid" src="<?= $val[1]; ?>" alt="<?= $val[0]; ?>"></a>
            <?php } ?>
        </div>
        <?php } ?>
    </div>
</section>

<!-- Category slide -->
<?php $category = WEBCATEGORY ?>
<?php if (!empty($WEBCATEGORY['siteCategory'][0])) { ?>
<div class="container my-3">
    <div class="row">
        <div class="owl-carousel owl-carousel-category">
            <?php foreach ($category['siteCategory'] as $ckey => $cvalue) { ?>
            <div class="item p-2">
                <a href="<?= base_url('products/' . $cvalue['slug']) ?>">
                    <div
                        class="card category_card p-2 position-relative <?php echo ($ckey % 2 == 1) ? 'cardodd' : ''; ?> ">
                        <div class="category_card_img my-lg-3 text-center">
                            <img src="<?= $cvalue['img'] ?>" alt="" class="img-fluid">
                        </div>
                        <div
                            class="category_card_title <?= ($ckey % 2 == 1) ? 'bg-orange' : 'bg-lpurple' ?> position-absolute">
                            <p><?= $cvalue['title'] ?></p>
                        </div>
                    </div>
                </a>
            </div>
            <?php } ?>
        </div>
    </div>
</div>
<?php } ?>
<?php
$product_q_class = $this->config->item('product_quality_class');
$product_q_text = $this->config->item('product_quality_text');
$smallunits = $this->config->item('smallunits');
?>
<?php if (is_array($homeProduct) && isset($homeProduct[0])) { ?>
<!-- best selling -->
<div class="container my-3">
    <div class="row align-items-center justify-content-end headingsection">
        <div class="col-6">
            <h1 class="best_selling_heading">
                Best Selling
            </h1>
        </div>
        <div class="col-6 text-end">
        </div>
    </div>
    <div class="row">
        <?php foreach ($homeProduct as $pkey => $pval) {
                if (!isset($pval['productvar'][0])) {
                    continue;
                }
                $allAvail = false;
                foreach ($pval['productvar'] as $pkey => $pvalue) {
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
                <span
                    class="badge badge-<?= $product_q_class[$pval['product_quality']] ?> quality-<?= $product_q_class[$pval['product_quality']] ?>"><?= $product_q_text[$pval['product_quality']] ?>
                    Quality</span>
                <?php
                        $tempImg = base_url() . 'assets/images/default_img.png';
                        if (is_array($pval['productImg']) && isset($pval['productImg'][0]['title'])) {
                            foreach ($pval['productImg'] as $pikey => $pivalue) {
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
                <a href="<?= base_url('products/details/' . $pval['_id']) ?>">
                    <img src="<?= $tempImg; ?>" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <?php
                            $availabeIn = "";
                            $price = "";
                            $f_mrp = 0;
                            if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                                $availabeIn = $pval["productvar"][0]["measurment"] . " " . $smallunits[$pval["productvar"][0]["unit"]];
                                $price = $pval["productvar"][0]["price"];
                                $f_mrp = (isset($pval["productvar"][0]["mrp"]) && $pval["productvar"][0]["mrp"] > 0) ? $pval["productvar"][0]["mrp"] : 0;
                            } ?>
                    <h5 class="card-title"><a
                            href="<?= base_url('products/details/' . $pval['_id']) ?>"><?= $pval["product"][0]['title'] ?></a>
                    </h5>

                    <p class="product_price offer-price mb-3">
                        <i class="mdi mdi-currency-inr"></i> <span
                            class="prod-price<?= $pval["_id"]; ?>"><?= number_format($price, 2); ?>/-</span>

                        <span class="regular-price prod-mrp<?= $pval["_id"]; ?> <?= ($f_mrp > 0) ? '' : 'hide'; ?>">
                            <i class="mdi mdi-currency-inr"></i>
                            MRP. <?= number_format($f_mrp, 2); ?>/-</span>
                    </p>
                    <p class="product_available ms-1 padbt50">
                        <strong>
                            <span class="mdi mdi-approval"></span>
                            Available in
                        </strong>
                        -
                        <span
                            class="prod-avail<?= $pval["_id"]; ?>"><?= @$pval["productvar"][0]["measurment"] . ' ' . @$smallunits[@$pval["productvar"][0]["unit"]] ?></span>
                    </p>
                    <select id="prod-<?php echo $pval["_id"]; ?>"
                        class="form-control custom-select product-select change-product">
                        <?php
                                $firstVarId = "";
                                if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                                    foreach ($pval["productvar"] as $pvar) {
                                        if ($pvar["is_active"] == '1') {
                                            if ($firstVarId == "") {
                                                $firstVarId = $pvar["_id"];
                                            }
                                            $mrp = (isset($pvar["mrp"]) && $pvar["mrp"] > 0) ? $pvar["mrp"] : 0;
                                            echo '<option data-id="' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . '&' . number_format($pvar["price"], 2) . '&' . number_format($mrp, 2) . '" value="' . $pvar["_id"] . '">' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . ' &nbsp;[Rs. ' . $pvar["price"] . ']</option>';
                                        }
                                    }
                                } ?></select>
                    <div class="card-footer bg-transparent border-0 px-0 mt-1">
                        <button type="button" data-val="<?= $firstVarId; ?>"
                            class="btn add-to-cart-btn btn-sm btn-<?= $pval["_id"]; ?> btn-tocart">
                            <i class="mdi mdi-cart-outline"></i> <span> Add To Cart </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php } ?>
    </div>
</div>
<?php } ?>

<!-- Offer banner -->
<?php if (!empty($offer_banner['data']) && isset($offer_banner['data'][0])) { ?>
<section class="offer-product">
    <div class="container my-3">
        <div class="row no-gutters banner-offer-div-parent">
            <?php foreach ($offer_banner['data'] as $ofkey => $ofvalue) {
                    if ($ofkey <= 1) {
                ?>
            <div class="col-md-6 banner-offer-div">
                <a href="<?= base_url('home/offer_products/' . $ofvalue['_id']) ?>">
                    <img class="img-fluid" src="<?= $this->config->item('OFFERIMAGEPATH') . $ofvalue['offer_img'] ?>"
                        alt="">
                </a>
            </div>
            <?php }
                } ?>
        </div>
    </div>
</section>
<?php } ?>

<?php if (is_array($featureProduct) && isset($featureProduct[0])) { ?>
<!-- medical -->
<div class="container my-3">
    <div class="row align-items-center justify-content-end headingsection">
        <div class="col-6">
            <h1 class="best_selling_heading">
                <?= $featureProduct[0]['category']['title'] ?>
            </h1>
        </div>
        <div class="col-6 text-end">
            <a href="<?= base_url('products/' . $featureProduct[0]['category']['slug']); ?>"
                class="best_sellings_viewall d-flex justify-content-end">
                View All
            </a>
        </div>
    </div>

    <div class="row">
        <?php
            $feaProduct = $featureProduct[0]['category']['product'];
            if (!empty($feaProduct)) {
                foreach ($feaProduct as $pkey => $pval) {
                    if (!isset($pval['productvar'][0])) {
                        continue;
                    }
                    $allAvail = false;
                    foreach ($pval['productvar'] as $pkey => $pvalue) {
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
                <span
                    class="badge badge-<?= $product_q_class[$pval['product_quality']] ?> quality-<?= $product_q_class[$pval['product_quality']] ?>"><?= $product_q_text[$pval['product_quality']] ?>
                    Quality</span>
                <?php
                            $tempImg = base_url() . 'assets/images/default_img.png';
                            if (is_array($pval['productimages']) && isset($pval['productimages'][0]['title'])) {
                                foreach ($pval['productimages'] as $pikey => $pivalue) {
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
                <a href="<?= base_url('products/details/' . $pval['_id']) ?>">
                    <img src="<?= $tempImg; ?>" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <?php
                                $availabeIn = "";
                                $price = "";
                                $f_mrp = 0;
                                if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                                    $availabeIn = $pval["productvar"][0]["measurment"] . " " . $smallunits[$pval["productvar"][0]["unit"]];
                                    $price = $pval["productvar"][0]["price"];
                                    $f_mrp = (isset($pval["productvar"][0]["mrp"]) && $pval["productvar"][0]["mrp"] > 0) ? $pval["productvar"][0]["mrp"] : 0;
                                } ?>
                    <h5 class="card-title"><a
                            href="<?= base_url('products/details/' . $pval['_id']) ?>"><?= $pval['title'] ?></a></h5>

                    <p class="product_price offer-price mb-3">
                        <i class="mdi mdi-currency-inr"></i> <span
                            class="prod-price<?= $pval["_id"]; ?>"><?= number_format($price, 2); ?>/-</span>

                        <span class="regular-price prod-mrp<?= $pval["_id"]; ?> <?= ($f_mrp > 0) ? '' : 'hide'; ?>">
                            <i class="mdi mdi-currency-inr"></i>
                            MRP. <?= number_format($f_mrp, 2); ?>/-</span>
                    </p>
                    <p class="product_available ms-1 padbt50">
                        <strong>
                            <span class="mdi mdi-approval"></span>
                            Available in
                        </strong>
                        -
                        <span
                            class="prod-avail<?= $pval["_id"]; ?>"><?= @$pval["productvar"][0]["measurment"] . ' ' . @$smallunits[@$pval["productvar"][0]["unit"]] ?></span>
                    </p>
                    <select id="prod-<?php echo $pval["_id"]; ?>"
                        class="form-control custom-select product-select change-product">
                        <?php
                                    $firstVarId = "";
                                    if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                                        foreach ($pval["productvar"] as $pvar) {
                                            if ($pvar["is_active"] == '1') {
                                                if ($firstVarId == "") {
                                                    $firstVarId = $pvar["_id"];
                                                }
                                                $mrp = (isset($pvar["mrp"]) && $pvar["mrp"] > 0) ? $pvar["mrp"] : 0;
                                                echo '<option data-id="' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . '&' . number_format($pvar["price"], 2) . '&' . number_format($mrp, 2) . '" value="' . $pvar["_id"] . '">' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . ' &nbsp;[Rs. ' . $pvar["price"] . ']</option>';
                                            }
                                        }
                                    } ?></select>
                    <div class="card-footer bg-transparent border-0 px-0 mt-1">
                        <button type="button" data-val="<?= $firstVarId; ?>"
                            class="btn add-to-cart-btn btn-sm btn-<?= $pval["_id"]; ?> btn-tocart">
                            <i class="mdi mdi-cart-outline"></i> <span> Add To Cart </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php }
            } else { ?>
        <div class="col-12 my-md-2 my-1">
            <h4 class="text-center">
                No record(s) found.
            </h4>
        </div>
        <?php } ?>
    </div>
</div>
<?php } ?>

<!-- Offer banner -->
<?php if (!empty($offer_banner['data']) && isset($offer_banner['data'][0])) { ?>
<section class="offer-product">
    <div class="container my-3">
        <div class="row no-gutters banner-offer-div-parent">
            <?php foreach ($offer_banner['data'] as $ofkey => $ofvalue) {
                    if ($ofkey == 2) {
                ?>
            <div class="col-md-12 banner-offer-div">
                <a href="<?= base_url('home/offer_products/' . $ofvalue['_id']) ?>">
                    <img class="img-fluid" src="<?= $this->config->item('OFFERIMAGEPATH') . $ofvalue['offer_img'] ?>"
                        alt="">
                </a>
            </div>
            <?php }
                } ?>
        </div>
    </div>
</section>
<?php } ?>

<!-- vegetables -->
<?php if (is_array($featureProduct) && isset($featureProduct[1])) { ?>
<!-- medical -->
<div class="container my-3">
    <div class="row align-items-center justify-content-end headingsection">
        <div class="col-6">
            <h1 class="best_selling_heading">
                <?= $featureProduct[1]['category']['title'] ?>
            </h1>
        </div>
        <div class="col-6 text-end">
            <a href="<?= base_url('products/' . $featureProduct[1]['category']['slug']); ?>"
                class="best_sellings_viewall">
                View All
            </a>
        </div>
    </div>
    <div class="row">
        <?php
            $feaProduct = $featureProduct[1]['category']['product'];
            if (!empty($feaProduct)) {
                foreach ($feaProduct as $pkey => $pval) {
                    if (!isset($pval['productvar'][0])) {
                        continue;
                    }
                    $allAvail = false;
                    foreach ($pval['productvar'] as $pkey => $pvalue) {
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
                <span
                    class="badge badge-<?= $product_q_class[$pval['product_quality']] ?> quality-<?= $product_q_class[$pval['product_quality']] ?>"><?= $product_q_text[$pval['product_quality']] ?>
                    Quality</span>
                <?php
                            $tempImg = base_url() . 'assets/images/default_img.png';
                            if (is_array($pval['productimages']) && isset($pval['productimages'][0]['title'])) {
                                foreach ($pval['productimages'] as $pikey => $pivalue) {
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
                <a href="<?= base_url('products/details/' . $pval['_id']) ?>">
                    <img src="<?= $tempImg; ?>" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <?php
                                $availabeIn = "";
                                $price = "";
                                $f_mrp = 0;
                                if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                                    $availabeIn = $pval["productvar"][0]["measurment"] . " " . $smallunits[$pval["productvar"][0]["unit"]];
                                    $price = $pval["productvar"][0]["price"];
                                    $f_mrp = (isset($pval["productvar"][0]["mrp"]) && $pval["productvar"][0]["mrp"] > 0) ? $pval["productvar"][0]["mrp"] : 0;
                                } ?>
                    <h5 class="card-title"><a
                            href="<?= base_url('products/details/' . $pval['_id']) ?>"><?= $pval['title'] ?></a></h5>

                    <p class="product_price offer-price mb-0">
                        <i class="mdi mdi-currency-inr"></i> <span
                            class="prod-price<?= $pval["_id"]; ?>"><?= number_format($price, 2); ?>/-</span>

                        <span class="regular-price prod-mrp<?= $pval["_id"]; ?> <?= ($f_mrp > 0) ? '' : 'hide'; ?>">
                            <i class="mdi mdi-currency-inr"></i>
                            MRP. <?= number_format($f_mrp, 2); ?>/-</span>
                    </p>
                    <p class="product_available ms-1 padbt50">
                        <strong>
                            <span class="mdi mdi-approval"></span>
                            Available in
                        </strong>
                        -
                        <span
                            class="prod-avail<?= $pval["_id"]; ?>"><?= @$pval["productvar"][0]["measurment"] . ' ' . @$smallunits[@$pval["productvar"][0]["unit"]] ?></span>
                    </p>
                    <select id="prod-<?php echo $pval["_id"]; ?>"
                        class="form-control custom-select product-select change-product">
                        <?php
                                    $firstVarId = "";
                                    if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                                        foreach ($pval["productvar"] as $pvar) {
                                            if ($pvar["is_active"] == '1') {
                                                if ($firstVarId == "") {
                                                    $firstVarId = $pvar["_id"];
                                                }
                                                $mrp = (isset($pvar["mrp"]) && $pvar["mrp"] > 0) ? $pvar["mrp"] : 0;
                                                echo '<option data-id="' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . '&' . number_format($pvar["price"], 2) . '&' . number_format($mrp, 2) . '" value="' . $pvar["_id"] . '">' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . ' &nbsp;[Rs. ' . $pvar["price"] . ']</option>';
                                            }
                                        }
                                    } ?></select>
                    <div class="card-footer bg-transparent border-0 px-0 mt-1">
                        <button type="button" data-val="<?= $firstVarId; ?>"
                            class="btn add-to-cart-btn btn-sm btn-<?= $pval["_id"]; ?> btn-tocart">
                            <i class="mdi mdi-cart-outline"></i> <span> Add To Cart </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php }
            } else { ?>
        <div class="col-12 my-md-2 my-1">
            <h4 class="text-center">
                No record(s) found.
            </h4>
        </div>
        <?php } ?>
    </div>
</div>
<?php } ?>

<!-- Offer banner -->
<?php if (!empty($offer_banner['data']) && isset($offer_banner['data'][0])) { ?>
<section class="offer-product">
    <div class="container my-3">
        <div class="row no-gutters banner-offer-div-parent">
            <?php foreach ($offer_banner['data'] as $ofkey => $ofvalue) {
                    if ($ofkey >= 3) {
                ?>
            <div class="col-md-12 banner-offer-div">
                <a href="<?= base_url('home/offer_products/' . $ofvalue['_id']) ?>">
                    <img class="img-fluid" src="<?= $this->config->item('OFFERIMAGEPATH') . $ofvalue['offer_img'] ?>"
                        alt="">
                </a>
            </div>
            <?php }
                } ?>
        </div>
    </div>
</section>
<?php } ?>

<!-- Exotic -->
<?php if (is_array($featureProduct) && isset($featureProduct[3])) { ?>
<!-- medical -->
<div class="container my-3">
    <div class="row align-items-center justify-content-end headingsection">
        <div class="col-6">
            <h1 class="best_selling_heading">
                <?= $featureProduct[3]['category']['title'] ?>
            </h1>
        </div>
        <div class="col-6 text-end">
            <a href="<?= base_url('products/' . $featureProduct[3]['category']['slug']); ?>"
                class="best_sellings_viewall">
                View All
            </a>
        </div>
    </div>
    <div class="row">
        <?php
            $feaProduct = $featureProduct[3]['category']['product'];
            if (!empty($feaProduct)) {
                foreach ($feaProduct as $pkey => $pval) {
                    if (!isset($pval['productvar'][0])) {
                        continue;
                    }
                    $allAvail = false;
                    foreach ($pval['productvar'] as $pkey => $pvalue) {
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
                <span
                    class="badge badge-<?= $product_q_class[$pval['product_quality']] ?> quality-<?= $product_q_class[$pval['product_quality']] ?>"><?= $product_q_text[$pval['product_quality']] ?>
                    Quality</span>
                <?php
                $tempImg = base_url() . 'assets/images/default_img.png';
                if (is_array($pval['productimages']) && isset($pval['productimages'][0]['title'])) {
                    foreach ($pval['productimages'] as $pikey => $pivalue) {
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
                <a href="<?= base_url('products/details/' . $pval['_id']) ?>">
                    <img src="<?= $tempImg; ?>" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <?php
                    $availabeIn = "";
                    $price = "";
                    $f_mrp = 0;
                    if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                        $availabeIn = $pval["productvar"][0]["measurment"] . " " . $smallunits[$pval["productvar"][0]["unit"]];
                        $price = $pval["productvar"][0]["price"];
                        $f_mrp = (isset($pval["productvar"][0]["mrp"]) && $pval["productvar"][0]["mrp"] > 0) ? $pval["productvar"][0]["mrp"] : 0;
                    } ?>
                    <h5 class="card-title"><a
                            href="<?= base_url('products/details/' . $pval['_id']) ?>"><?= $pval['title'] ?></a></h5>

                    <p class="product_price offer-price mb-0">
                        <i class="mdi mdi-currency-inr"></i> <span
                            class="prod-price<?= $pval["_id"]; ?>"><?= number_format($price, 2); ?>/-</span>

                        <span class="regular-price prod-mrp<?= $pval["_id"]; ?> <?= ($f_mrp > 0) ? '' : 'hide'; ?>">
                            <i class="mdi mdi-currency-inr"></i>
                            MRP. <?= number_format($f_mrp, 2); ?>/-</span>
                    </p>
                    <p class="product_available ms-1 padbt50">
                        <strong>
                            <span class="mdi mdi-approval"></span>
                            Available in
                        </strong>
                        -
                        <span
                            class="prod-avail<?= $pval["_id"]; ?>"><?= @$pval["productvar"][0]["measurment"] . ' ' . @$smallunits[@$pval["productvar"][0]["unit"]] ?></span>
                    </p>
                    <select id="prod-<?php echo $pval["_id"]; ?>"
                        class="form-control custom-select product-select change-product">
                        <?php
                    $firstVarId = "";
                    if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                        foreach ($pval["productvar"] as $pvar) {
                            if ($pvar["is_active"] == '1') {
                                if ($firstVarId == "") {
                                    $firstVarId = $pvar["_id"];
                                }
                                $mrp = (isset($pvar["mrp"]) && $pvar["mrp"] > 0) ? $pvar["mrp"] : 0;
                                echo '<option data-id="' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . '&' . number_format($pvar["price"], 2) . '&' . number_format($mrp, 2) . '" value="' . $pvar["_id"] . '">' . $pvar["measurment"] . ' ' . $smallunits[$pvar["unit"]] . ' &nbsp;[Rs. ' . $pvar["price"] . ']</option>';
                            }
                        }
                    } ?></select>
                    <div class="card-footer bg-transparent border-0 px-0 mt-1">
                        <button type="button" data-val="<?= $firstVarId; ?>"
                            class="btn add-to-cart-btn btn-sm btn-<?= $pval["_id"]; ?> btn-tocart">
                            <i class="mdi mdi-cart-outline"></i> <span> Add To Cart </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <?php }
            } else { ?>
        <div class="col-12 my-md-2 my-1">
            <h4 class="text-center">
                No record(s) found.
            </h4>
        </div>
        <?php } ?>
    </div>
</div>
<?php } ?>

<!-- cms -->
<section class="my-lg-5 my-md-3 my-2">
    <?php if (is_array($cms_content) && !empty($cms_content)) { ?>
    <?= $cms_content['data']; ?>
    <?php } ?>
</section> 
