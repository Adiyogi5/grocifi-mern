
<?php $this->load->view('includes/_messages')?>
<section class="section-padding">
    <div class=" d-flex justify-content-center align-items-center">
            <div class="col-md-4">
                <div class="border border-3 border-<?= ($status == 1)?'success':'danger'?>"></div>
                <div class="card  bg-white shadow p-5">
                    <div class="mb-4 text-center">
                        <?php if($status == 1){?>
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-success" width="75" height="75"
                            fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                        </svg>

                        <?php }else{ ?>
                        <svg height="75" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="75" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:#D72828;"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg>

                        <?php } ?>
                    </div>
                    <?php if($status == 1) {?>
                    <div class="text-center">
                        <h1>Success !</h1>
                        <p>Thank you for completing the order. </p>
                        <a href="<?=base_url()?>" class="btn btn-outline-primary">Back Home</a>
                        <a href="<?=base_url('order/order_detail/'.$order_id)?>" class="btn btn-outline-success">View order</a>
                    </div>
                     <?php }else{ ?>
                     
                     <div class="text-center">
                        <h1>Faild !</h1>
                        <p>Please check your order if something went wrong.</p>
                        <a href="<?=base_url()?>" class="btn btn-outline-success">Back Home</a>
                     </div>
                     <?php } ?>
                </div>
            </div>
        </div>
</section>
 

