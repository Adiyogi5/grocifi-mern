<?php
$groupMenu = array('profile', 'settings', 'locations');
if (!empty($this->uri->segment(2))) {
    if (in_array($this->uri->segment(1), $groupMenu)) {
        $cur_tab = $this->uri->segment(1);
    } else {
        $cur_tab = $this->uri->segment(2) == '' ? 'dashboard' : $this->uri->segment(2);
    }
} else {
    $cur_tab = $this->uri->segment(1) == '' ? 'dashboard' : $this->uri->segment(1);
}
?>
<!-- Main Sidebar Container -->
<aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="<?= base_url() ?>" class="brand-link">
        <img src="<?= $this->config->item('APIIMAGES') ?>setting_img/<?= $this->general_settings['logo']; ?>" alt="Logo" class="brand-image elevation-3" style="opacity: .8">
        <span class="brand-text font-weight-light">&nbsp;</span>
    </a>
    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
                <img src="<?= base_url() ?>assets/dist/img/avatar5.png" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
                <a href="#" class="d-block"><?= ucwords($this->session->userdata('username')); ?></a>
            </div>
        </div>
        <!-- Sidebar Menu -->
        <?php 
        $ci =& get_instance();
        if($ci->session->has_userdata('IsAdminLogin')) { ?>
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false"> 
                <li id="dashboard" class="nav-item">
                    <a href="<?= base_url('admin/dashboard'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-dashboard"></i>
                        <p>
                            Dashboard
                        </p>
                    </a>
                </li>
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['order_list']['is_view']==1) ||
                ($this->general_user_premissions['active_order']['is_view']==1) ||
                ($this->general_user_premissions['place_order']['is_add']==1) ||
                ($this->general_user_premissions['purchase_list']['is_view']==1) ||
                ($this->general_user_premissions['purchased_list']['is_view']==1)  
                ){ ?> 
                <li id="orders" class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa fa-shopping-cart nav-icon"></i>
                        <p>
                            Orders
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['order_list']['is_view']) && $this->general_user_premissions['order_list']['is_view']==1)){ ?> 
                        <li id="order_list" class="nav-item">
                            <a href="<?= base_url("admin/order/index"); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Order List</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['active_order']['is_view']) && $this->general_user_premissions['active_order']['is_view']==1)){ ?> 
                        <li id="active_order" class="nav-item">
                            <a href="<?= base_url("admin/order/active_order"); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Active Orders</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['place_order']['is_add']) && $this->general_user_premissions['place_order']['is_add']==1)){ ?>                        
                        <li id="place_order" class="nav-item">
                            <a href="<?= base_url(); ?>admin/order/placeorder" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Place Order</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['purchase_list']['is_view']) && $this->general_user_premissions['purchase_list']['is_view']==1)){ ?>                        
                        <li id="purchase_list" class="nav-item">
                            <a href="<?= base_url(); ?>admin/order/purchase_list" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Purchase List</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['purchased_list']['is_view']) && $this->general_user_premissions['purchased_list']['is_view']==1)){ ?>                        
                        <li id="purchased_list" class="nav-item">
                            <a href="<?= base_url(); ?>admin/order/purchased_list" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Purchased List</p>
                            </a>
                        </li>
                        <?php } ?> 
                    </ul>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['user_admin_subadmin']['is_view']==1) ||
                ($this->general_user_premissions['user_franchise']['is_view']==1) ||
                ($this->general_user_premissions['user_customer']['is_view']==1) ||
                ($this->general_user_premissions['user_wholesaler']['is_view']==1) ||
                ($this->general_user_premissions['user_delivery_boy']['is_view']==1)  
                ){ ?>
                <li id="user" class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-users"></i>
                        <p>
                            Users
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_admin_subadmin']['is_view']) && $this->general_user_premissions['user_admin_subadmin']['is_view']==1)){ ?> 
                        <li id="user_admin_subadmin" class="nav-item">
                            <a href="<?= base_url(); ?>admin/users/admin" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Admin & Sub Admin</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_franchise']['is_view']) && $this->general_user_premissions['user_franchise']['is_view']==1)){ ?> 
                        <li class="nav-item">
                            <a id="user_franchise" href="<?= base_url(); ?>admin/users/franchise" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Franchise</p>
                            </a>
                        </li>
                        <?php } ?> 
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_customer']['is_view']) && $this->general_user_premissions['user_customer']['is_view']==1)){ ?> 
                        <li id="user_customer" class="nav-item">
                            <a href="<?= base_url(); ?>admin/users/customer" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Customers</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php 
                        if($this->general_settings['is_wholesaler']==1){
                        if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_wholesaler']['is_view']) && $this->general_user_premissions['user_wholesaler']['is_view']==1)){ ?> 
                        <li id="user_wholesaler" class="nav-item">
                            <a href="<?= base_url(); ?>admin/users/wholesaler" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Wholesaler</p>
                            </a>
                        </li>
                        <?php } } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_delivery_boy']['is_view']) && $this->general_user_premissions['user_delivery_boy']['is_view']==1)){ ?> 
                        <li id="user_delivery_boy" class="nav-item">
                            <a href="<?= base_url(); ?>admin/users/delivery_boy" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Delivery Boys</p>
                            </a>
                        </li>
                        <?php } ?> 
                    </ul>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['order_report']['is_view']==1) ||
                ($this->general_user_premissions['user_dailycollection']['is_view']==1) ||
                ($this->general_user_premissions['coupon_todayexpiry']['is_view']==1) || 
                ($this->general_user_premissions['user_expire_wallet']['is_view']==1) 
                ){ ?>
                    <li id="report" class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-file-text-o"></i>
                        <p>
                            Reports
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['order_report']['is_view']) && $this->general_user_premissions['order_report']['is_view']==1)){ ?>                        
                        <li id="order_report" class="nav-item">
                            <a href="<?= base_url(); ?>admin/order/report" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Order's Report</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_dailycollection']['is_view']) && $this->general_user_premissions['user_dailycollection']['is_view']==1)){ ?> 
                        <li id="daily_collection" class="nav-item">
                            <a href="<?= base_url(); ?>admin/users/dailycollection" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Daily Colletion Report</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_expire_wallet']['is_view']) && $this->general_user_premissions['user_expire_wallet']['is_view']==1)){ ?> 
                        <li id="today_expire_wallet" class="nav-item">
                            <a href="<?= base_url(); ?>admin/users/expire_wallet" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Expire Wallets Report</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['coupon_todayexpiry']['is_view']) && $this->general_user_premissions['coupon_todayexpiry']['is_view']==1)){ ?> 
                        <li id="coupon_todayexpiry" class="nav-item">
                            <a href="<?= base_url('admin/coupon/todayexpiry'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Expire Coupons Report</p>
                            </a>
                        </li>
                        <?php } ?> 
                    </ul>
                <?php } ?>  
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['voucher']['is_view']) && $this->general_user_premissions['voucher']['is_view']==1)){ ?> 
                <li id="voucher" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/voucher'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-money"></i>
                        <p>
                            Deposit Vouchers
                        </p>
                    </a>
                </li>
                <?php } ?>  
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['category']['is_view']) && $this->general_user_premissions['category']['is_view']==1)){ ?> 
                <li id="category" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/category'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-tags"></i>
                        <p>
                            Categories
                        </p>
                    </a>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['product']['is_view']) && $this->general_user_premissions['product']['is_view']==1)){ ?> 
                <li id="product" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/product'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-shopping-basket"></i>
                        <p>
                            Products
                        </p>
                    </a>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['banner']['is_view']) && $this->general_user_premissions['banner']['is_view']==1)){ ?> 
                <li id="banner" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/banner'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-image nav-icon"></i>
                        <p>
                            Banner
                        </p>
                    </a>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['offer']['is_view']) && $this->general_user_premissions['offer']['is_view']==1)){ ?> 
                <li id="offer" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/offer'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-gift nav-icon"></i>
                        <p>
                            Offers
                        </p>
                    </a>
                </li>
                <?php } ?>
                <?php /*if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['lucky_draw_coupon']['is_view']) && $this->general_user_premissions['lucky_draw_coupon']['is_view']==1)){ ?> 
                <li id="lucky_draw_coupon" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/lucky_draw_coupon'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-gift nav-icon"></i>
                        <p>
                            Lucky Draw Coupon
                        </p>
                    </a>
                </li>
                <?php }*/ ?> 
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['coupon']['is_view']) && $this->general_user_premissions['coupon']['is_view']==1)){ ?> 
                <li id="coupon" class="nav-item has-treeview">
                    <a href="<?= base_url('admin/coupon'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-certificate nav-icon"></i>
                        <p>
                            Coupon 
                        </p>
                    </a> 
                </li>
                <?php } ?> 
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['country']['is_view']==1) ||
                ($this->general_user_premissions['state']['is_view']==1) ||
                ($this->general_user_premissions['city']['is_view']==1) ||
                ($this->general_user_premissions['area']['is_view']==1) || 
                ($this->general_user_premissions['area_group']['is_view']==1)||
                ($this->general_user_premissions['sub_area']['is_view']==1)
                ){ ?>
                <li id="locations" class="nav-item has-treeview">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-map-marker"></i>
                        <p>
                            Locations
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['country']['is_view']) && $this->general_user_premissions['country']['is_view']==1)){ ?> 
                        <li id="country" class="nav-item">
                            <a href="<?= base_url('admin/locations/country'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Country</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['state']['is_view']) && $this->general_user_premissions['state']['is_view']==1)){ ?> 
                        <li id="state" class="nav-item">
                            <a href="<?= base_url('admin/locations/state'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>State</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['city']['is_view']) && $this->general_user_premissions['city']['is_view']==1)){ ?>
                        <li id="city" class="nav-item">
                            <a href="<?= base_url('admin/locations/city'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>City</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['area']['is_view']) && $this->general_user_premissions['area']['is_view']==1)){ ?>
                        <li id="area" class="nav-item">
                            <a href="<?= base_url('admin/locations/area'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Area</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['area_group']['is_view']) && $this->general_user_premissions['area_group']['is_view']==1)){ ?>
                        <li id="area_group" class="nav-item">
                            <a href="<?= base_url('admin/locations/area_group'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Group Of Area</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php /*if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['sub_area']['is_view']) && $this->general_user_premissions['sub_area']['is_view']==1)){ ?>
                        <li id="sub_area" class="nav-item">
                            <a href="<?= base_url('admin/locations/sub_area'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Sub Area</p>
                            </a>
                        </li>
                        <?php } */ ?>
                    </ul>
                </li> 
                <?php } ?> 
            </ul>
        </nav>
        <?php }elseif($ci->session->has_userdata('IsFranchiseLogin')) { ?>
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false"> 
                <li id="dashboard" class="nav-item">
                    <a href="<?= base_url('store/dashboard'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-dashboard"></i>
                        <p>
                            Dashboard
                        </p>
                    </a>
                </li>
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['order_list']['is_view']==1) ||
                ($this->general_user_premissions['active_order']['is_view']==1) ||
                ($this->general_user_premissions['place_order']['is_add']==1) ||
                ($this->general_user_premissions['purchase_list']['is_view']==1) ||
                ($this->general_user_premissions['purchased_list']['is_view']==1)  
                ){ ?> 
                <li id="orders" class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa fa-shopping-cart nav-icon"></i>
                        <p>
                            Orders
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['order_list']['is_view']) && $this->general_user_premissions['order_list']['is_view']==1)){ ?> 
                        <li id="order_list" class="nav-item">
                            <a href="<?= base_url("store/order/index"); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Order List</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['active_order']['is_view']) && $this->general_user_premissions['active_order']['is_view']==1)){ ?> 
                        <li id="active_order" class="nav-item">
                            <a href="<?= base_url("store/order/active_order"); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Active Orders</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['place_order']['is_add']) && $this->general_user_premissions['place_order']['is_add']==1)){ ?>                        
                        <li id="place_order" class="nav-item">
                            <a href="<?= base_url(); ?>store/order/placeorder" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Place Order</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['purchase_list']['is_view']) && $this->general_user_premissions['purchase_list']['is_view']==1)){ ?>                        
                        <li id="purchase_list" class="nav-item">
                            <a href="<?= base_url(); ?>store/order/purchase_list" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Purchase List</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['purchased_list']['is_view']) && $this->general_user_premissions['purchased_list']['is_view']==1)){ ?>                        
                        <li id="purchased_list" class="nav-item">
                            <a href="<?= base_url(); ?>store/order/purchased_list" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Purchased List</p>
                            </a>
                        </li>
                        <?php } ?> 
                    </ul>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['user_admin_subadmin']['is_view']==1) ||
                ($this->general_user_premissions['user_franchise']['is_view']==1) ||
                ($this->general_user_premissions['user_customer']['is_view']==1) ||
                ($this->general_user_premissions['user_wholesaler']['is_view']==1) ||
                ($this->general_user_premissions['user_delivery_boy']['is_view']==1)  
                ){ ?>
                <li id="user" class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-users"></i>
                        <p>
                            Users
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_admin_subadmin']['is_view']) && $this->general_user_premissions['user_admin_subadmin']['is_view']==1)){ ?> 
                        <li id="user_admin_subadmin" class="nav-item">
                            <a href="<?= base_url(); ?>store/users/admin" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Admin & Sub Admin</p>
                            </a>
                        </li>
                        <?php } ?> 
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_franchise']['is_view']) && $this->general_user_premissions['user_franchise']['is_view']==1)){ ?> 
                        <li class="nav-item">
                            <a id="user_franchise" href="<?= base_url(); ?>store/users/franchise" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Franchise</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_customer']['is_view']) && $this->general_user_premissions['user_customer']['is_view']==1)){ ?> 
                        <li id="user_customer" class="nav-item">
                            <a href="<?= base_url(); ?>store/users/customer" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Customers</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php 
                        if($this->general_settings['is_wholesaler']==1){
                        if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_wholesaler']['is_view']) && $this->general_user_premissions['user_wholesaler']['is_view']==1)){ ?> 
                        <li id="user_wholesaler" class="nav-item">
                            <a href="<?= base_url(); ?>store/users/wholesaler" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Wholesaler</p>
                            </a>
                        </li>
                        <?php } } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_delivery_boy']['is_view']) && $this->general_user_premissions['user_delivery_boy']['is_view']==1)){ ?> 
                        <li id="user_delivery_boy" class="nav-item">
                            <a href="<?= base_url(); ?>store/users/delivery_boy" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Delivery Boys</p>
                            </a>
                        </li>
                        <?php } ?> 
                    </ul>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || 
                ($this->general_user_premissions['order_report']['is_view']==1) ||
                ($this->general_user_premissions['user_dailycollection']['is_view']==1) ||
                ($this->general_user_premissions['coupon_todayexpiry']['is_view']==1) 
                ){ ?>
                    <li id="report" class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fa fa-file-text-o"></i>
                        <p>
                            Reports
                            <i class="right fa fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview">
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['order_report']['is_view']) && $this->general_user_premissions['order_report']['is_view']==1)){ ?>                        
                        <li id="order_report" class="nav-item">
                            <a href="<?= base_url(); ?>store/order/report" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Order's Report</p>
                            </a>
                        </li>
                        <?php } ?>
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['user_dailycollection']['is_view']) && $this->general_user_premissions['user_dailycollection']['is_view']==1)){ ?> 
                        <li id="daily_collection" class="nav-item">
                            <a href="<?= base_url('store/users/dailycollection'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Daily Colletion Report</p>
                            </a>
                        </li>
                        <?php } ?> 
                        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['coupon_todayexpiry']['is_view']) && $this->general_user_premissions['coupon_todayexpiry']['is_view']==1)){ ?> 
                        <li id="coupon_todayexpiry" class="nav-item">
                            <a href="<?= base_url('store/coupon/todayexpiry'); ?>" class="nav-link">
                                <i class="fa fa-circle-o nav-icon"></i>
                                <p>Expire Coupons Report</p>
                            </a>
                        </li>
                        <?php } ?> 
                    </ul>
                <?php } ?>  
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['voucher']['is_view']) && $this->general_user_premissions['voucher']['is_view']==1)){ ?> 
                <li id="voucher" class="nav-item has-treeview">
                    <a href="<?= base_url('store/voucher'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-money"></i>
                        <p>
                            Deposit Vouchers
                        </p>
                    </a>
                </li>
                <?php } ?>  
                
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['banner']['is_view']) && $this->general_user_premissions['banner']['is_view']==1)){ ?> 
                <li id="banner" class="nav-item has-treeview">
                    <a href="<?= base_url('store/banner'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-image nav-icon"></i>
                        <p>
                            Banner
                        </p>
                    </a>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['offer']['is_view']) && $this->general_user_premissions['offer']['is_view']==1)){ ?> 
                <li id="offer" class="nav-item has-treeview">
                    <a href="<?= base_url('store/offer'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-gift nav-icon"></i>
                        <p>
                            Offers
                        </p>
                    </a>
                </li>
                <?php } ?>
                <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['coupon']['is_view']) && $this->general_user_premissions['coupon']['is_view']==1)){ ?> 
                <li id="coupon" class="nav-item has-treeview">
                    <a href="<?= base_url('store/coupon'); ?>" class="nav-link">
                        <i class="nav-icon fa fa-certificate nav-icon"></i>
                        <p>
                            Coupon 
                        </p>
                    </a> 
                </li>
                <?php } ?>  
            </ul>
        </nav>
        <?php  } ?>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>

<script>
    $("#<?= $cur_tab ?>").addClass('menu-open');
    $("#<?= $cur_tab ?> > a").addClass('active');
</script>