<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <section class="content">
        <!-- For Messages -->
        <?php $this->load->view('includes/_messages.php'); ?>
        <div class="card">
            <div class="card-header">
                <div class="row col-sm-12">
                    <h3>Error</h3>
                </div> 
            </div>
        </div>

        <div class="card">
            <p style="padding: 20px;"><?=$error?></p>
        </div>
    </section>
</div> 