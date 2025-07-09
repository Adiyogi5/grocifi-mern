<?php 
$amtStatus = array("1" => "Active", "2" => "Used", "3" => "Expired");
$ostatus = array(
    "1" => "Recieved",
    "2" => "Processed",
    "3" => "Shipped",
    "4" => "Delivered",
    "5" => "Returned",
    "6" => "Cancel",
);
$ostcls = array(
    "1" => "bg-primary",
    "2" => "bg-info",
    "3" => "bg-warning",
    "4" => "bg-success",
    "5" => "bg-secondary",
    "6" => "bg-danger",
);

$segment = current_url();
$segment = explode('/', $segment);
$active1 = $active2 = $active3 = $active4 = $active5 = $active6 = $active7 = $active8 = $active9 = '';

if (in_array('dashboard', $segment)) {
    $active1 = 'active show';
}
if (in_array('profile', $segment)) {
    $active2 = 'active show';
}
if (in_array('wallet_history', $segment)) {
    $active3 = 'active show';
}
if (in_array('notifications', $segment)) {
    $active4 = 'active show';
}
if (in_array('myorders', $segment)) {
    $active5 = 'active show';
}
if (in_array('myaddress', $segment) || in_array('add_address', $segment) || in_array('edit_address', $segment)) {
    $active6 = 'active show';
}
if (in_array('friendlist', $segment)) {
    $active7 = 'active show';
} 
if (in_array('wishlist', $segment)) {
    $active8 = 'active show';
} 
?>
<!-- Inner Header -->
   <div class="card-header p-0 mb-3" style="background-color: #ECECEC;">
       <ul class="nav nav-pills" id="pills-tab" role="tablist">

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('dashboard')?>" class="nav-link <?=@$active1;?>" role="tab" aria-controls="pills-home" aria-selected="true">Dashboard</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('profile')?>" class="nav-link <?=@$active2;?>" role="tab" aria-controls="pills-home" aria-selected="true">My Profile</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('wallet_history')?>" class="nav-link <?=@$active3;?>" role="tab" aria-controls="pills-contact" aria-selected="false">Wallet</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('notifications')?>" class="nav-link <?=@$active4;?>" role="tab" aria-controls="pills-notifications" aria-selected="false">Notifications</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('myorders')?>" class="nav-link <?=@$active5;?>" role="tab" aria-controls="pills-notifications" aria-selected="false">My Orders</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('myaddress')?>" class="nav-link <?=@$active6;?>" role="tab" aria-controls="pills-address" aria-selected="false">My Address</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('friendlist')?>" class="nav-link <?=@$active7;?>" role="tab" aria-controls="pills-address" aria-selected="false">My Friends</a>
           </li>

           <li class="nav-item" role="presentation">
               <a href="<?=base_url('wishlist')?>" class="nav-link <?=@$active8;?>" role="tab" aria-controls="pills-address" aria-selected="false">Wishlist</a>
           </li>
       </ul>
   </div> 
<!-- End Inner Header -->