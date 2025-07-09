<!-- admin modal -->
<div class="modal fade" id="ajax-modal" tabindex="-1" role="dialog" aria-labelledby="ajax-modal" aria-hidden="true">
</div> 

<div id="lodingalert" style="display: none" class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><img style="width:200px;" src="<?=base_url("assets/img/loading.gif")?>"></br><h5>Please be patient while data loading.....</h5></center></div></div></div> 

<?php if(!isset($footer)): ?> 
  <footer class="main-footer">
    <strong><?=$this->general_settings['app_name']; ?> </strong>
    <div class="float-right d-none d-sm-inline-block">
      <b>Developed By:</b> <a href="https://adiyogitechnosoft.com" target="_blank">Adiyogi Technosoft</a>
    </div>
  </footer> 
  <?php endif; ?>   
  <!-- Control Sidebar -->
  <aside class="control-sidebar control-sidebar-dark">
    <!-- Control sidebar content goes here -->
  </aside>
  <!-- /.control-sidebar --> 
</div>
<!-- ./wrapper --> 
<!-- jQuery UI 1.11.4 -->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
<script>
  $.widget.bridge('uibutton', $.ui.button)
  document.addEventListener("contextmenu", function (e){
    e.preventDefault();
  }, false);
</script>
<!-- Bootstrap 4 -->
<script src="<?= base_url() ?>assets/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- Notify -->
<script src="<?= base_url() ?>assets/dist/js/notify.js"></script>
<!-- Slimscroll -->
<script src="<?= base_url() ?>assets/plugins/slimScroll/jquery.slimscroll.min.js"></script>
<!-- FastClick -->
<script src="<?= base_url() ?>assets/plugins/fastclick/fastclick.js"></script>
<!-- AdminLTE App -->
<script src="<?= base_url() ?>assets/dist/js/adminlte.js"></script>

<!-- AdminLTE for demo purposes -->
<script src="<?= base_url() ?>assets/dist/js/demo.js"></script>
<!-- Validator -->
<script src="<?= base_url() ?>assets/dist/js/jquery.validate.min.js"></script>
<script src="<?= base_url() ?>assets/dist/js/additional-methods.min.js"></script>

</body>
</html>
