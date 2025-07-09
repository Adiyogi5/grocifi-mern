<?php defined('BASEPATH') or exit('No direct script access allowed'); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title> <?=$this->general_settings['app_name'];?> </title>
  <!-- favicon -->
  <link rel="shortcut icon" href="<?=$this->config->item('APIIMAGES')?>setting_img/<?=$this->general_settings['favicon'];?>" type="image/x-icon">
  <link rel="canonical" href="">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="author" content="adityom.co.in">
<!-- Favicon Icon -->
<link rel="icon" type="image/png" href="<?=$this->config->item('APIIMAGES') . 'setting_img/' . $this->general_settings['favicon'];?>">
<!-- Bootstrap core CSS -->
<!-- <link href="<?=base_url()?>assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"> -->
<link rel="stylesheet" href="<?=base_url()?>assets/dist/css/bootstrap.min.css">

<!-- Material Design Icons -->
<link href="<?=base_url()?>assets/vendor/icons/css/materialdesignicons.min.css" media="all" rel="stylesheet" type="text/css" />
<!-- font-awsome -->
<link href="<?=base_url()?>assets/vendor/font-awsome/all.min.css"/>

<!-- Select2 CSS -->
<link href="<?=base_url()?>assets/vendor/select2/css/select2-bootstrap.css" />
<link href="<?=base_url()?>assets/vendor/select2/css/select2.min.css" rel="stylesheet" />
<!-- Custom styles for this template -->
<link href="<?=base_url()?>assets/vendor/css/osahan.css" rel="stylesheet">
<!-- Owl Carousel -->
<link href = "https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel = "stylesheet">
<link rel="stylesheet" href="<?=base_url()?>assets/vendor/owl-carousel/owl.carousel.css">
<link rel="stylesheet" href="<?=base_url()?>assets/vendor/owl-carousel/owl.theme.css">
<link rel="stylesheet" href="<?=base_url()?>assets/vendor/css/site_main.css">
<link rel="stylesheet" href="<?=base_url()?>assets/dist/css/responsive.css">
<link rel="stylesheet" href="<?=base_url()?>assets/dist/css/style.css">

<!-- Bootstrap core JavaScript -->
<script src="<?=base_url()?>assets/vendor/jquery/jquery.min.js"></script>
<script src = "https://code.jquery.com/jquery-1.10.2.js"></script>
<script src = "https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>

</head>
<body>
<div id="loadingDiv">
  <img alt="logo" src="<?=base_url()?>assets/images/logogif.gif"><div id="loading-msg">Loading...</div>
</div>
<section id="home-page">
<?php
$url = current_url();
$hsegments = explode('/', $url);

$uLoc = array();
$cartQty = (!empty($_SESSION["cartData"])?$_SESSION["cartData"]['qty']:0);
if ($this->session->userdata('authUser')['location']['2'] && $this->session->userdata('authUser')['location']['3']) {
    $temp = $this->Commonmodel->getData($this->config->item('APIURL') . 'area/edit/' . $this->session->userdata('authUser')['location']['3'], FRONT_TOKEN);
    if (!empty($temp["data"]) && $temp["sucess"] == 200) {
        $uLoc[] = $temp["data"]["title"];
    } else {
        $uLoc[] = "Area";
    }
    $temp = $this->Commonmodel->getData($this->config->item('APIURL') . 'city/edit/' . $this->session->userdata('authUser')['location']['2'], FRONT_TOKEN);
    if (!empty($temp["data"]) && $temp["sucess"] == 200) {
        $uLoc[] = $temp["data"]["title"];
    } else {
        $uLoc[] = "City";
    }
} else {
    $uLoc = array("Area", "City");
}
$category = WEBCATEGORY;
?>
<!-- offerbar -->
<div class="navbar-top bg-success pt-2 pb-2">
   <div class="container-fluid">
      <div class="row">
         <div class="col-lg-12 text-center">
            <a class="location-top" href="<?=base_url('userlocation')?>"><i class="mdi mdi-map-marker-circle" aria-hidden="true"></i>&nbsp;Deliver to&nbsp;-&nbsp;<?php echo implode(" / ", $uLoc); ?></a>
         </div>
      </div>
   </div>
</div>

<!-- header strip -->
<header>
    <div class="container-fluid">
        <div class="row align-items-center">
            <div class="col-md-3 d-flex justify-content-center">
                <a class="navbar-brand" href="<?=base_url('/')?>" alt="logo"><img src="<?=$this->config->item('APIIMAGES') . 'setting_img/' . $this->general_settings['logo'];?>" class="weblogo"> </a>
            </div>
            <div class="col-md-9">
                <div class="row ">
                    <div class="col-md-10 col-7">
                        <form action="<?=base_url('products/search')?>" method="get">
                           <div class="input-group search_bar">
                              <input class="form-control border-0 ms-1" placeholder="Search products in your area" aria-label="Search products in your area" type="text" id="InputSearch" name="InputSearch" value="<?=(isset($_GET["InputSearch"]) && !empty($_GET["InputSearch"])) ? $_GET["InputSearch"] : "";?>">
                              <span class="input-group-btn">
                                 <button class="btn" type="submit"><img src="<?=base_url('assets/img/search.png')?>" alt=""></button>
                              </span>
                           </div>
                        </form>
                    </div>
                    <div class="col-md-2 col-5">
                        <div class="row">
                           <ul class="list-inline main-nav-right">
                              <?php //pr($this->session->userdata('authUser'));
                                if (!@$this->session->userdata('authUser')['isLoggedIn']) {?>
                                 <li class="list-inline-item">
                                    <button class="border-0 bg-transparent" id="login_model" href="javascript:void(0);" data-target="#bd-example-modal" data-toggle="modal"><img src="<?=base_url('assets/img/login.png')?>" alt=""></button>
                                 </li>
                              <?php
                                } else {
                                $user = $this->session->userdata('authUser')['user'];
                                ?>
                                 <li class="list-inline-item dropdown" style="position:relative;">
                                 <button class="border-0 bg-transparent profilebtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                 <?php
                                $img = "noimage.png";
                                if (!empty($user["img"])) {
                                    $file_headers = get_headers($this->config->item('USERIMAGEPATH') . $user["img"]);
                                    if ($file_headers[0] == 'HTTP/1.1 200 OK') {
                                        $img = $user["img"];
                                    }
                                }?>
                                       <img id="user-img-nav1" alt="logo" src="<?=$this->config->item('USERIMAGEPATH') . $img?>">
                                    </button>

                                    <?php if (!empty($this->session->userdata('authUser')['isLoggedIn']) && $this->session->userdata('authUser')['isLoggedIn'] == true) {
                                    $walletBalance = $this->Commonmodel->getData($this->config->item('APIURL') . 'user/getwalletbalance', FRONT_TOKEN, $user['_id']);
                                    $walletBalance = number_format($walletBalance["wallet_balance"], 2);
                                    ?>

                                    <div class="dropdown-menu dropdown-menu-right dropdown-list-design">
                                       <a href="<?=base_url('profile');?>" class="dropdown-item"><i aria-hidden="true" class="mdi mdi-account-outline"></i> My Profile</a>
                                       <a href="<?=base_url('myaddress');?>" class="dropdown-item"><i aria-hidden="true" class="mdi mdi-map-marker-circle"></i> My Address</a>

                                       <a href="<?=base_url('wishlist');?>" class="dropdown-item"><i aria-hidden="true" class="mdi mdi-tag-outline"></i> Wishlist</a>

                                       <a href="<?=base_url('wallet_history');?>" class="dropdown-item"><i aria-hidden="true" class="mdi mdi-wallet"></i> Wallet <span class="text-success" title="Wallet Balance">(<?php echo $walletBalance; ?>)</span> </a>

                                       <a href="<?=base_url('notifications');?>" class="dropdown-item"><i aria-hidden="true" class="mdi mdi-bell"></i> Notification </a>

                                       <a href="<?=base_url('myorders');?>" class="dropdown-item"><i aria-hidden="true" class="mdi mdi-format-list-bulleted"></i> Order List</a>
                                       <div class="dropdown-divider"></div>
                                       <a class="dropdown-item logout-link" href="<?=base_url('logout');?>"><i class="mdi mdi-lock"></i> Logout</a>
                                    </div>
                                    <?php }?>
                                 </li>
                              <?php }?>
                              <li class="list-inline-item cart-btn">
                                 <button class="border-0 bg-transparent cart-i position-relative" data-toggle="offcanvas" >
                                    <img src="<?=base_url('assets/img/cart.png')?>" alt="">
                                     <small class="cart-value"><?= $cartQty;?></small>
                                 </button>
                              </li>
                           </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
<!-- navbar -->
<nav class="navbar navbar-expand-lg navbar-light vcc_navbar pt-lg-0 my-lg-0 my-2">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0 margin-auto">
            <li class="nav-item">
               <a href="<?=base_url('/');?>" class="nav-link <?=(!empty($hsegments[5]) ? '' : 'nav_active')?>">Home</a>
            </li>
            <li class="nav-item dropdown">
               <a class="nav-link <?=(in_array('products', $hsegments) ? 'nav_active' : '')?> dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Categories
               </a>
               <?php if (isset($category['siteCategory'][0]) && is_array($category['siteCategory'])) {?>
               <div class="dropdown-menu">
                  <?php foreach ($category['siteCategory'] as $val) {?>
                  <a class="dropdown-item" href="<?=base_url('products/' . $val['slug']);?>"><i class="mdi mdi-chevron-right" aria-hidden="true"></i> <?php echo $val["title"]; ?></a>
                  <?php }?>
               </div>
               <?php }?>
            </li>
            <li class="nav-item">
               <a href="<?=base_url('franchise');?>" class="nav-link <?=(in_array('franchise', $hsegments) ? 'nav_active' : '')?>">Franchise</a>
            </li>

            <li class="nav-item">
               <a class="nav-link <?=(in_array('aboutus', $hsegments) ? 'nav_active' : '')?>" href="<?=base_url('aboutus');?>"> About Us</a>
            </li>

            <li class="nav-item">
               <a class="nav-link  <?=(in_array('privacy', $hsegments) ? 'nav_active' : '')?>" href="<?=base_url('privacy');?>"> Policy </a>
            </li>

            <li class="nav-item">
               <a class="nav-link  <?=(in_array('termsandconditions', $hsegments) ? 'nav_active' : '')?>" href="<?=base_url('termsandconditions');?>"> T & C </a>
            </li>

            <li class="nav-item">
               <a class="nav-link  <?=(in_array('faq', $hsegments) ? 'nav_active' : '')?>" href="<?=base_url('faq');?>"> FAQ </a>
            </li>

            <li class="nav-item">
               <a class="nav-link  <?=(in_array('contactus', $hsegments) ? 'nav_active' : '')?>" href="<?=base_url('contactus');?>"> Contact Us</a>
            </li>

            <li class="nav-item">
               <a class="nav-link  <?=(in_array('referandearn', $hsegments) ? 'nav_active' : '')?>" href="<?=base_url('referandearn');?>"> Refer & Earn</a>
            </li>
         </ul>
    </div>
  </div>
</nav>

</section>