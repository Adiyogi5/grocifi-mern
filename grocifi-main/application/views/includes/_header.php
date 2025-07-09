<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title> <?=$this->general_settings['app_name']; ?> </title>
  <!-- favicon -->
  <link rel="shortcut icon" href="<?= $this->config->item('APIIMAGES') ?>setting_img/<?=$this->general_settings['favicon']; ?>" type="image/x-icon"> 

  <!-- Tell the browser to be responsive to screen width -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/font-awesome/css/font-awesome.min.css">
  <!-- Ionicons -->
  <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="<?= base_url()?>assets/dist/css/adminlte.css">
  <!-- iCheck -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/iCheck/flat/blue.css">
  <!-- Morris chart -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/morris/morris.css">
  <!-- jvectormap -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/jvectormap/jquery-jvectormap-1.2.2.css">
  <!-- Date Picker -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/datepicker/datepicker3.css">
  <!-- Daterange picker -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/daterangepicker/daterangepicker-bs3.css">
  <!-- bootstrap wysihtml5 - text editor -->
  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">
  <!-- Google Font: Source Sans Pro -->
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">
  <!-- jQuery -->
  <script src="<?= base_url()?>assets/plugins/jquery/jquery.min.js"></script>

  <link rel="stylesheet" href="<?= base_url()?>assets/plugins/bootstrap/css/jquery.jgrowl.min.css" /> 
  <link rel="stylesheet" href="<?= base_url()?>assets/dist/css/app.css" /> 

  <script src="<?= base_url()?>assets/plugins/jquery/jquery.jgrowl.min.js"></script> 
  <script src="<?= base_url()?>assets/dist/js/app.js"></script> 

</head>

<body class="sidebar-collapse sidebar-mini ftco-section"> <!-- hold-transition -->
<!-- Main Wrapper Start -->
<div class="wrapper">

  <!-- Navbar -->

  <?php if(!isset($navbar)): ?>

  <nav class="main-header navbar navbar-expand bg-white navbar-light border-bottom">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#"><i class="fa fa-bars"></i></a>
      </li> 
    
    </ul>
    <?php $model = $this->session->userdata('model'); ?>
    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto"> 
      <li id="profile" class="nav-item dropdown">
      <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="nav-icon fa fa-user"></i>&nbsp;Profile <span class="caret"></span></a>  
      <ul class="dropdown-menu" role="menu">
          <li class="nav-item">
              <a href="<?= base_url($model.'/profile'); ?>" class="nav-link"> 
                  <p>Change Profile</p>
              </a>
          </li>
          <li class="nav-item">
              <a href="<?= base_url($model.'/profile/change_pwd'); ?>" class="nav-link"> 
                  <p>Change Password</p>
              </a>
          </li>
      </ul>
      </li>
      <?php
      $ci =& get_instance();
      if($ci->session->has_userdata('IsAdminLogin')){
        if($this->session->userdata('role_type')!='2' || 
        ($this->general_user_premissions['settings']['is_view']==1) ||
        ($this->general_user_premissions['cms']['is_view']==1) ||
        ($this->general_user_premissions['admanager']['is_view']==1) ||
        ($this->general_user_premissions['delivery_time_slot']['is_view']==1) || 
        ($this->general_user_premissions['holiday']['is_view']==1)||
        ($this->general_user_premissions['rolemanager']['is_view']==1)||
        ($this->general_user_premissions['popslider']['is_view']==1)
        ){ ?>
      <li id="mainsettings" class="nav-item dropdown">
      <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="nav-icon fa fa-cogs"></i>&nbsp;Setting <span class="caret"></span></a>  
          <ul class="dropdown-menu" role="menu">
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['settings']['is_view']) && $this->general_user_premissions['settings']['is_view']==1)){ ?> 
              <li id="settings" class="nav-item">
                  <a href="<?= base_url('admin/settings'); ?>" class="nav-link">
                      <p>General Setting</p>
                  </a>
              </li>
            <?php } ?>
            <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['cms']['is_view']) && $this->general_user_premissions['cms']['is_view']==1)){ ?> 
              <li id="cms" class="nav-item">
                  <a href="<?= base_url('admin/settings/cms'); ?>" class="nav-link">
                      <p>CMS</p>
                  </a>
              </li>
              <?php } ?>
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['admanager']['is_view']) && $this->general_user_premissions['admanager']['is_view']==1)){ ?> 
              <li id="admanager" class="nav-item">
                  <a href="<?= base_url('admin/settings/admanager'); ?>" class="nav-link">
                      <p>Ad Manager</p>
                  </a>
              </li>
              <?php } ?>
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['delivery_time_slot']['is_view']) && $this->general_user_premissions['delivery_time_slot']['is_view']==1)){ ?> 
              <li id="delivery_time_slot" class="nav-item">
                  <a href="<?= base_url('admin/settings/setting_delivery_slot'); ?>" class="nav-link">
                      <p>Delivery Time Slot</p>
                  </a>
              </li>
              <?php } ?>
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['holiday']['is_view']) && $this->general_user_premissions['holiday']['is_view']==1)){ ?> 
              <li id="holiday" class="nav-item">
                  <a href="<?= base_url('admin/settings/holiday'); ?>" class="nav-link">
                      <p>Holiday</p>
                  </a>
              </li>
              <?php } ?>
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['popslider']['is_view']) && $this->general_user_premissions['popslider']['is_view']==1)){ ?> 
              <li id="popslider" class="nav-item">
                  <a href="<?= base_url('admin/popslider'); ?>" class="nav-link">
                      <p>Popup Image</p>
                  </a>
              </li> 
              <?php } ?>
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['rolemanager']['is_view']) && $this->general_user_premissions['rolemanager']['is_view']==1)){ ?> 
              <li id="rolemanager" class="nav-item">
                  <a href="<?= base_url('admin/settings/rolemanager'); ?>" class="nav-link">
                      <p>Role Manager</p>
                  </a>
              </li> 
              <?php } ?>
          </ul>
        </li>
        <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['general_notification']['is_view']) && $this->general_user_premissions['general_notification']['is_view']==1)){ ?> 
        <li id="general_notification" class="nav-item d-none d-sm-inline-block">
          <a href="<?= base_url('admin/notification'); ?>" class="nav-link">
              <i class="nav-icon fa fa-bell nav-icon"></i> 
                  Notification 
          </a>
        </li>
        <?php } ?>
        <?php } 
      }elseif($ci->session->has_userdata('IsFranchiseLogin')) {
       if($this->session->userdata('role_type')!='2' ||  
        ($this->general_user_premissions['holiday']['is_view']==1) 
        ){ ?>
      <li id="mainsettings" class="nav-item dropdown">
      <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="nav-icon fa fa-cogs"></i>&nbsp;Setting <span class="caret"></span></a>  
          <ul class="dropdown-menu" role="menu">
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['popslider']['is_view']) && $this->general_user_premissions['popslider']['is_view']==1)){ ?> 
              <li id="popslider" class="nav-item">
                  <a href="<?= base_url('store/popslider'); ?>" class="nav-link">
                      <p>Popup Image</p>
                  </a>
              </li> 
              <?php } ?> 
              <?php if($this->session->userdata('role_type')!='2' || (isset($this->general_user_premissions['holiday']['is_view']) && $this->general_user_premissions['holiday']['is_view']==1)){ ?> 
              <li id="holiday" class="nav-item">
                  <a href="<?= base_url('store/settings/holiday'); ?>" class="nav-link">
                      <p>Holiday</p>
                  </a>
              </li>
              <?php } ?> 
          </ul>
        </li>
        <?php } ?>
      <?php } ?> 
      <li class="nav-item d-none d-sm-inline-block">
         <a href="<?= base_url('logout') ?>" class="nav-link"><i class="nav-icon fa fa-lock"></i>&nbsp;Logout</a>
      </li>       
    </ul>
  </nav> 
  <?php endif; ?>

  <!-- /.navbar -->  
  <!-- Sideabr --> 
  <?php if(!isset($sidebar)): ?>

  <?php $this->load->view('includes/_sidebar'); ?>

  <?php endif; ?>

  <!-- / .Sideabr -->
