
<section class="pt-3 pb-3 page-info section-padding border-bottom bg-white">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <a href="<?= base_url(); ?>"><strong><span class="mdi mdi-home"></span> Home</strong></a> <span class="mdi mdi-chevron-right"></span> <a href="javascript:void(0);">Checkout</a>
            </div>
        </div>
    </div>
</section>
<section class="checkout-page section-padding">
    <div class="container">
        <div class="row">
           <div id="payment-div">
                <img src="<?= base_url()?>img/logogif.gif" alt="vvc" /><br />
                <p>Please wait Razorpay popup will be open</p>
                <form action="<?=base_url('checkout/placeorder')?>" method="POST">
                    <script src="https://checkout.razorpay.com/v1/checkout.js" data-key="<?= $this->general_settings['razor_key_id'] ?>" data-amount="<?= $ttlAmt * 100; ?>" data-currency="INR" data-id="<?= 'OID' . date("YmdHisu"); ?>" data-buttontext="Pay with Razorpay" data-name="Adityom" data-description="Get Farm Fresh Vegitable And Fruits Delivered At Your Doorstep." data-image="<?= base_url().'img/logo.png';?>" data-prefill.name="<?= $user["fname"] . ' ' . $user["lname"]; ?>" data-prefill.email="<?= $user["email"]; ?>" data-prefill.contact="<?= $user["phone_no"] ?>" data-theme.color="#F37254"></script>
                     <input type="hidden" name="csrf_test_name" value="<?=$this->security->get_csrf_hash(); ?>">
                    <input type="hidden" custom="Hidden Element" name="delivery_date" value="<?= $delivery_date; ?>">
                </form>
            </div>
        </div>
    </div>
</section>

<script>
  $(document).ready(() => {
        setTimeout(() => {
            $("input[type=submit]").click();
        }, 3000);
    });

    $(function() {
        
    });
/*    var SITEPATH ='<?= base_url()?>';
    let Token = '<?=$this->security->get_csrf_hash(); ?>';*/
</script>
<style>
  img {
        margin-top: 5%;
    }

    input[type=submit] {
        margin-top: 5%;
        display: inline-block;
        font-weight: 400;
        color: #FFF;
        text-align: center;
        vertical-align: middle;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        background-color: #0AB04B !important;
        display: none !important;
    }

    #payment-div {
        border: green 0px;
        width: 31%;
        border-style: outset;
        border-radius: 18px;
        margin-left: 33%;
        text-align: center;
    }

   
</style>