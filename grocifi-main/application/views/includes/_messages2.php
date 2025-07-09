<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

    <!--print error messages-->
    <?php if($this->session->flashdata('errors')): ?>
      <div class="m-b-15">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="icon fa fa-times"></i>
                <?php echo $this->session->flashdata('errors'); ?>
                <?php  $this->session->unset_userdata('errors'); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    <?php endif; ?>

    <!--print custom error message-->
    <?php if ($this->session->flashdata('error')): ?>
        <div class="m-b-15">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="icon fa fa-times"></i>
                <?php echo $this->session->flashdata('error'); ?>
                <?php  $this->session->unset_userdata('error'); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    <?php endif; ?>

    <!--print custom success message-->
    <?php if ($this->session->flashdata('success')): ?>
        <div class="m-b-15">
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="icon fa fa-check"></i>
                <?php echo $this->session->flashdata('success'); ?>
                <?php  $this->session->unset_userdata('success'); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        </div>
    <?php endif; ?>