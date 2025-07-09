<!-- Cart data -->
<?php
$cartProduct = mycart();
$configData = configSetting();

foreach($configData[1] as $val){
   $unitTypeArr[$val["id"]] = $val["abv"];
}

$cart_id_qty = array();
$cartEmpty = true;
$cartQty = 0;
$user_wallet = 0; 

if (!isset($ajex)) {
   $cartqty = (isset($cartProduct["data"][0]))?$cartProduct["data"][0]["cart_total"][0]['cartqty']:0;
?>

<div class="cart-sidebar-header">
   <h5>
      My Cart <span class="text-success cart-value-div">(<?= $cartqty; ?> item)</span> <a data-toggle="offcanvas" class="float-right" href="#"><i class="mdi mdi-close"></i>
      </a>
   </h5>
</div>
<?php } ?>

<div class="cart-sidebar-body"><?php
   if (isset($cartProduct["data"][0])) {
      $cartEmpty = false;
      $ttlAmt = 0;
      $fttlAmt = 0;
      $ttlDiscAmt = 0;
      $cc_disc = 0;  //coupon code discount
      foreach ($cartProduct["data"][0]["cart_item"] as $val) { ?>
         <div class="cart-list-product">
            <a class="float-right remove-cart" onclick="removeItem('<?= $val['_id'] ?>','<?=$val["qty"]?>')" href="javascript:void(0);"><i class="mdi mdi-close"></i></a>
            <?php
            $img = base_url()."img/default_img.png";
            $isDisc = false;
            if (isset($val["image_url"]) > 0) {
               $img = $this->config->item('PRODUCTIMAGEPATH').$val["image_url"];
            } 
            if ($val["disc"] != "" && $val["disc"] != "0" && $val["disc"] != null) {
               //$isDisc = true;
            }
            
            ?>
            <img class="img-fluid" src="<?php echo $img; ?>" alt="">
            <!-- <span class="badge badge-success">50% OFF</span> -->
            <h5><a href="./product.php?pid=<?php echo $val["frproductvarId"] ?>"><?php echo $val["title"]; ?></a></h5>
            <h6><span class="mdi mdi-approval"></span> <?php echo $val["measurement"] . " " . $unitTypeArr[$val["unit"]]; ?> </h6>

            <h6>
               <strong> Quantity &nbsp;&nbsp;</strong>
               <?php if($val["qty"]>1 ){ ?>
               <button onclick="updateItem('<?php echo $val['_id']; ?>','<?php echo -1; ?>')" type="button" class="btn btn-primary btn-sm decreaseQty">-</button>
               <?php } ?>
               &nbsp;&nbsp;<?php echo $val["qty"]; ?>&nbsp;&nbsp;
               <?php if($val["qty"]<=1 || $val["qty"]>1){  ?>
               <button onclick="updateItem('<?php echo $val['_id']; ?>','<?php echo 1; ?>')" type="button" class="btn btn-primary btn-sm">+</button>
               <?php } ?>
            </h6>
            
            <p class="offer-price mb-0">Unit Price : <?=$this->general_settings["currency"]?> <?php 
               if($isDisc){
                  echo number_format($val["price"] - (($val["disc"] / 100) * $val["price"]), 2);
               }else{
                  echo number_format($val["price"], 2);
               }  ?>
               <i class="mdi mdi-tag-outline"></i>
               <?php if (isset($val["mrp"]) && $val["mrp"] > 0) { ?>
                  <span class="regular-price"> <?=$this->general_settings["currency"]?> <?php echo number_format($val["mrp"], 2); ?></span>
               <?php } ?>
               <?php if ($isDisc) { ?>
                  <span class="regular-price"> <?=$this->general_settings["currency"]?> <?php echo number_format($val["price"], 2); ?></span>
               <?php } ?>
            </p>
         </div><?php
         }
      }  ?>
</div>
<?php if (isset($cartProduct["data"][0]["cart_total"])) { 
   $cart_total = $cartProduct["data"][0]["cart_total"][0];
 ?>
<div class="cart-sidebar-footer">
   <div class="cart-store-details">
      <p>Total Amount<strong class="float-right"><?php echo number_format($cart_total['final_total'], 2); ?></strong></p>
      <p>Discount <strong class="float-right"><?php echo number_format($cart_total['disc'],2); ?></strong></p>

      <?php 
         if(!empty($_SESSION["ccode"]["code"]) && !empty($_SESSION["ccode"]["disc"])){
            $str = "";
            $cart_total['disc'] = $_SESSION["ccode"]["disc"];
            if($_SESSION["ccode"]["disc_in"]){
               $str = "(".$_SESSION["ccode"]["disc_val"]."%)";
            }else{
               $str = "(".$this->general_settings["currency"].")";
            }
            echo '<p>Promo Code Disc. '.$str.'<strong class="float-right"> '. number_format($_SESSION["ccode"]["disc"],2).' </strong></p>';
         }
      ?>

     <?php /* <p>Tax (<?php echo $siteSetting["data"][0]["tax"]; ?>%)<strong class="float-right"><?php $tax = ($cart_total['final_total']*$siteSetting["data"][0]["tax"])/100; 
      echo number_format($tax,2); ?></strong></p> */ ?>
      <p>Delivery Charges <strong class="float-right text-danger">+ 
         <?php echo number_format($cart_total['delivery_charge'],2); ?></strong>
      </p>
      <h6>Your total savings <strong class="float-right text-danger"><?=$this->general_settings["currency"]?> <?php echo number_format($cart_total['promo_disc']+$cart_total['disc'],2); ?></strong></h6>

   </div> 
   <a href="<?=base_url()?>checkout"><button class="btn btn-secondary btn-lg btn-block text-left" type="button"><span class="float-left"><i class="mdi mdi-cart-outline"></i> Proceed to Checkout </span> <span class="float-right"><strong> <?=$this->general_settings["currency"]?> <?php echo number_format($cart_total['total'] + $cart_total['delivery_charge'] - ($cart_total['promo_disc'] +$cart_total['disc']),2); ?></strong> <span class="mdi mdi-chevron-right"></span></span></button></a>
</div>
<?php
   $cart_total_total = $cart_total['total'] + $cart_total['delivery_charge'] - $cart_total['promo_disc'] ;
   if(!empty($_SESSION["cart_temp"])){
      $_SESSION["cart_temp"]['ttlAmt'] = $cart_total_total;
   }else{
       $_SESSION["cart_temp"] = array("ttlAmt"=>$cart_total_total);
   }
  
}else{
   $_SESSION["cart_temp"] = array();
} 
?>