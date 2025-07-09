<?php defined('BASEPATH') or exit('No direct script access allowed');

class Checkout extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        authfront_check(); // check login auth
        authfront_area(); // check location
        $this->areaId = $this->session->userdata('authUser')['location']['3'];
        $this->load->library('mailer');
        $this->load->Model('Commonmodel', 'Commonmodel');
        $this->load->library('cart');
    }

    
    public function index()
    {
        // prd();
        if (is_array($_SESSION["cartData"]) && $_SESSION["cartData"]['qty'] > 0) {
        } else {
          redirect(base_url());
        }    


        $user_wallet = isset($_SESSION['key_wallet_used'])?$_SESSION['key_wallet_used']:0; 
        $data['edit_used_wallet_checked'] = ($user_wallet == 1)?'checked':'';

        if (isset($_SESSION["authUser"])) {
           $is_wholesaler = (!empty($_SESSION['authUser']['user']['is_wholesaler']))?$_SESSION['authUser']['user']['is_wholesaler']:0;
           $where = array("user_id"=> $_SESSION["authUser"]['user']['_id'],"is_wholesaler"=>$is_wholesaler,"session_id"=> $_SESSION["session_id"],"user_wallet"=> $user_wallet);
        }else{
           $where =  array("session_id"=>$_SESSION["session_id"]);
        }

        $cartProduct = $this->Commonmodel->postData($this->config->item('APIURL') . 'cart/get_cart', $where, FRONT_TOKEN);

        $data['cartProduct'] = (isset($cartProduct["data"][0]))?$cartProduct["data"]:[];
       
        $data['cartQty'] = (isset($cartProduct["data"][0]))?$cartProduct["data"][0]["cart_total"][0]['cartqty']:0;

        $data['Carttotal'] = (isset($cartProduct["data"][0]))?$cartProduct["data"][0]["cart_total"][0]:[];

        $data['defaultAddress'] =  $this->Commonmodel->postData($this->config->item('APIURL') . 'address/checkaddress', array("userId"=> $_SESSION["authUser"]['user']['_id'], "areaId"=>$_SESSION["authUser"]["location"][3]), FRONT_TOKEN);

        
       

        $delivery_day_after_order = $this->general_settings["delivery_day_after_order"];
        $today = new DateTime('today');
        $nextDay = $today->modify('+'.$delivery_day_after_order.' day');
        $nextDay = $today->format('Y-m-d');
        $data['nextDay'] = $nextDay;  
        $formatedDate = $today->format("l, d F, Y");
        $data['formatedDate'] = $formatedDate;  

        // prd($this->general_settings);
        $siteConfig  = $this->Commonmodel->getData($this->config->item('APIURL') ."settings/getconfigData?date=".$nextDay.'&franchiseId='.@front_auth_user('franchise')['franchiseId']);
       
        if(@$siteConfig['data']){
            foreach($siteConfig['data'][1] as $val){
               $data['unitTypeArr'][$val["id"]] = $val["abv"];
            }
            foreach($siteConfig['data'][7] as $val){
               $data['deliveryTimeArr'][] = $val;
            }
        }
        // prd($_SESSION);

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/checkout', $data);
        $this->load->view('home/includes/_footer');
        
    }   

    public function placeorder()
    {  
        if ($_SESSION["authUser"]["isLoggedIn"] && ($_SESSION["cartData"]['qty'] > 0)) {
        } else {
          redirect(base_url());
        }    

        $user = front_auth_user('user');
        $delivery_date = "";

        if (isset($_POST["delivery_date"]) && !empty($_POST["delivery_date"])) {
            $delivery_date = $_POST["delivery_date"];
        }

        $frIds = "";
        $cartProduct = "";
        $cart_id_qty = array();
        $walletBalance = "";

        $cc_disc = 0;
        $payment_method = "";
        $delivery_time_id = "";
        $delivery_address = "";
        $paytm_payment_id = "";
        $key_wallet_used  = " ";
        $delivery_address_id = "";
        $razorpay_payment_id = "";
        $cancelled_id = null;
        $paytm_array = array();
        $configData = configSetting();

        if (isset($_POST) && !empty($_POST)) {
            if (isset($_POST["razorpay_payment_id"]) && !empty($_POST["razorpay_payment_id"])) {
                $delivery_time_id   =  $_SESSION["cart_temp"]["delivery_time_id"];
                $delivery_address   =  $_SESSION["cart_temp"]["delivery_address"];
                $payment_method     =  $_SESSION["cart_temp"]["payment_method"];
                $key_wallet_used    =  $_SESSION["cart_temp"]["key_wallet_used"];
                $razorpay_payment_id = $_POST["razorpay_payment_id"];
            } else {
                $delivery_time_id =  $_POST["delivery_time_id"];
                $delivery_address =  $_POST["delivery_address"];
                $payment_method   =  $_POST["payment_method"];
                $key_wallet_used  =  isset($_POST["key_wallet_used"]) ? "true" : "false";
            }
        } else {
            $delivery_date    =  $_SESSION["cart_temp"]["delivery_date"];
            $delivery_time_id =  $_SESSION["cart_temp"]["delivery_time_id"];
            $delivery_address =  $_SESSION["cart_temp"]["delivery_address"];
            $payment_method   =  $_SESSION["cart_temp"]["payment_method"];
            $key_wallet_used  =  $_SESSION["cart_temp"]["key_wallet_used"];
        }

        if (!empty($_SESSION["edit_order"]["id"])){
            $delivery_address_id = $_SESSION["edit_order"]["old_order"][0]["delivery_address_id"];
     
            $data = $this->Commonmodel->getData($this->config->item('APIURL') . 'order/findorderbeforecancel/' , $_SESSION["edit_order"]["old_order"][0]["_id"]. '/'.$_SESSION["authUser"]["user"]["_id"], FRONT_TOKEN);

            if (isset($data["sucess"]) &&  $data["sucess"] == 200) {
                 $data = $this->Commonmodel->postData($this->config->item('APIURL') .'order/updatestatus/',array("_id"=>$_SESSION["edit_order"]["old_order"][0]["_id"], "is_active"=>"6"), FRONT_TOKEN);
                if (isset($data["sucess"]) && $data["sucess"] == 200) {
                    $cancelled_id = $_SESSION["edit_order"]["old_order"][0]["_id"];
                    //Order cancelled
                }else{
                    redirect(base_url('checkout'),'refresh');
                }
            }else{
                unset($_SESSION["edit_order"]);
                $_SESSION["mycart"] = array();
                $_SESSION["ccode"] = array();
                $this->session->set_flashdata('errors','Your order can not be edited at this stage.');
                redirect(base_url('checkout'),'refresh');
            }
        }

        $order_param   ='{"order_param":{';
        $order_param  .='"session_id":"' . $_SESSION["session_id"] . '", "userId":"' . $user["_id"] . '",';

        if (isset($_SESSION["cartData"]) && $_SESSION["cartData"]["qty"] > 0) {
            $cartEmpty      = false;
            $user_wallet    = isset($_SESSION['key_wallet_used'])?$_SESSION['key_wallet_used']:0; 

            $edit_used_wallet_checked = ($user_wallet == 1)?'checked':'';

            if (isset($_SESSION["authUser"])) {
               $is_wholesaler = (!empty($_SESSION['authUser']['user']['is_wholesaler']))?$_SESSION['authUser']['user']['is_wholesaler']:0;
               $where = array("user_id"=> $_SESSION["authUser"]['user']['_id'],"is_wholesaler"=>$is_wholesaler,"session_id"=> $_SESSION["session_id"],"user_wallet"=>$user_wallet);
            }else{
               $where = array("session_id"=> $_SESSION["session_id"]);
            }

            $url                =  $this->config->item('APIURL') .'cart/get_cart'; 
            $cartProduct        =  $this->Commonmodel->postData($url, $where, FRONT_TOKEN);
       
            $cartQty            = (isset($cartProduct["data"][0]))?$cartProduct["data"][0]["cart_total"][0]['cartqty']:0;
            $Carttotal          = (isset($cartProduct["data"][0]))?$cartProduct["data"][0]["cart_total"][0]:[];

            $url                =  $this->config->item('APIURL') .'user/getwalletbalance/'. $user['_id']; 
            $walletBalance      =  $this->Commonmodel->getData($url, FRONT_TOKEN); 

            $walletBalance      = (empty(trim($walletBalance["wallet_balance"])) ||  0 >= $walletBalance["wallet_balance"]) ? 0 : $walletBalance["wallet_balance"];
        }
        if(empty($delivery_time_id)){
            $delivery_time_id = 0;
        } 
        $deliveryTimeArr = [];
      
        if(!empty($configData[7])){
            foreach($configData[7] as $key => $value) {
                 $deliveryTimeArr[$value['id']] = $value['title'];
            }
        } 
        
        $frIds        =  (isset($cartProduct["data"][0]['cart_item']))?$cartProduct["data"][0]["cart_item"][0]['franchiseId']:''; 
        $order_param .=   '"franchiseId":"' . $frIds . '",';
        $order_param .=   '"delivery_address":"' . $delivery_address . '",';
        $order_param .=   '"delivery_address_id":"' . $delivery_address_id . '",';
        $order_param .=   '"cancelled_id":"' . $cancelled_id . '",';
        $order_param .=   '"razorpay_payment_id":"' . $razorpay_payment_id . '",';
        $order_param .=   '"paytm_payment_id":"' . $paytm_payment_id . '",';
        $order_param .=   '"delivery_date":"' . $delivery_date . '",';
        $order_param .=   '"delivery_day":"2",';
        $order_param .=   '"delivery_time_id":"0",';
        $order_param .=   '"delivery_solt_id":"' . $delivery_time_id . '",';
        $order_param .=   '"delivery_time":"' . $deliveryTimeArr[$delivery_time_id] . '",';

        $order_param .=   '"tax_percent":"",';
        ///$order_param .=   '"tax_percent":"' . $siteSetting["data"][0]["tax"] . '",';
        $order_param .=   '"phone_no":"' . $user["phone_no"] . '",';
        $order_param .=   '"key_wallet_used":"' . $key_wallet_used . '",';
        $order_param .=   '"payment_method":"' . $payment_method . '",';
        $order_param .=   '"longitude":"0.00",';
        $order_param .=   '"latitude":"0.00",';
        $order_param .=   '"email":"' . $user["email"] . '",';

        $order_param .=   '"promo_code":"' . $Carttotal['promo_code'] . '",';
        $order_param .=   '"promo_discount":"' . $Carttotal['promo_disc'] . '",';

        $order_param .=   '"version_code":"",';
        $order_param .=   '"os_devid_vc":"'. $_SERVER['HTTP_USER_AGENT'] .'",';
        $order_param .=   '"ordered_by":"web",';

        $xvar = array();
        $ttlAmt = 0;
        $ttlDiscAmt = 0;
       
        foreach ($cartProduct["data"][0]['cart_item'] as $val) {
            $ttl = 0;
            $t = "";
            $t .= '{';

            $t .= '"productId":"' . $val["productId"] . '", ';
            $t .= '"frproductvarId":"' . $val["frproductvarId"] . '", ';
            $t .= '"franchiseId":"' . $val["franchiseId"] . '", ';
            $t .= '"price":"' . $val["price"] . '", ';
            $t .= '"frproductId":"' . $val["frproductId"] . '", ';
            $t .= '"qty":"' . $val["qty"] . '", ';
            $_pimg = "noimage.png";
            if (isset($val["image_url"]) > 0) {
               $_pimg = $val["image_url"];
            } 
            $t .= '"image_url":"' . $_pimg . '", ';
            $t .= '"measurement":"' . $val["measurement"] . '", ';
            $t .= '"unit":"' . $val["unit"] . '", ';
            $t .= '"title":"' . $val["title"] . '" ';

            $t .= '}';
         
            $xvar[] = $t;
        } 
        ///$tax = ($ttlAmt * $siteSetting["data"][0]["tax"]) / 100;

        $order_param .= '"discount_rupee":"' . $Carttotal['disc'] . '",';
        $order_param .= '"tax_amount":"0",'; 
        $order_param .= '"total":"' . $Carttotal['total'] . '",';

        if ($Carttotal['total'] < $this->general_settings['min_order']) { 
            $this->session->set_flashdata('errors','We accept minimum order amount Rs. ' . $this->general_settings['min_order'] . '/-.');
            echo '211';
            exit();
        }

        $order_param .= '"delivery_charge":"' . $Carttotal['delivery_charge'] . '",';
        if ($walletBalance > 0 && $key_wallet_used != "false") { 
            if($payment_method == "1" && $Carttotal['total']==$Carttotal['final_total']){
                $order_param .=   '"payment_method":3,';
                $payment_method = 3;
            }     
            $order_param .= '"key_wallet_balance":"' . $Carttotal['user_wallet'] . '",';
        } else {
            $order_param .= '"key_wallet_balance":"0.00",';
        }
         
        $order_param .= '"final_total":"' . $Carttotal['final_total'] . '", ';
        $order_param .= '"paytm_status":' . json_encode($paytm_array) . ', ';

        $order_param .= '"order_val":[';
        $order_param .= implode(", ", $xvar);
        $order_param .= ']';
        $order_param .= '} }';

      
        $order_paramData    = json_decode($order_param, true);
        $orderurl           = $this->config->item('APIURL') .'order/placeorder'; 
        $ord                = $this->Commonmodel->postData($orderurl, $order_paramData, FRONT_TOKEN);
   
    
        if (isset($ord["sucess"]) && $ord["sucess"] == 200 && isset($ord["tracking_id"]) && !empty($ord["tracking_id"])) {
            if (isset($_SESSION["edit_order"]["id"]) && !empty($_SESSION["edit_order"]["id"])){
                unset($_SESSION["edit_order"]);
            }
            $_SESSION["session_id"] = '';
            $_SESSION["last_order_id"] = $ord["order_id"];
            $_SESSION["ccode"] = array();
          
            $url        = $this->config->item('APIURL') .'cart/remove_cart_by_userid'; 
            $cwhere     = array("user_id"=>$_SESSION["authUser"]['user']['_id']);
            $rmcart     = $this->Commonmodel->postData($url, $cwhere, FRONT_TOKEN);

            if (isset($_SESSION["cart_temp"]["redirectedFrom"]) && ($_SESSION["cart_temp"]["redirectedFrom"] == "op" || $_SESSION["cart_temp"]["redirectedFrom"] == "paytm")) {
                 $this->session->set_flashdata('success','Your order placed successfully.');
                 redirect(base_url('order/order_confirm'),'refresh');
            } else {
                echo '200';
            }
           exit();
        }else{
            echo $ord["msg"]; exit();
        }
        
    }  

    public function online_pay(){

        if (!$_SESSION["authUser"]["isLoggedIn"]) {
        
            $this->session->set_flashdata('errors','Unauthorized access.');
            redirect(base_url('checkout'),'refresh');
        }
        if (is_array($_SESSION["cartData"]) && $_SESSION["cartData"]['qty'] > 0) {
            //---------
        } else {
            $this->session->set_flashdata('errors','Your cart is empty.');
            redirect(base_url('checkout'),'refresh');
        }
        $user =  $_SESSION["authUser"]["user"];
        $ttlAmt = $_SESSION["cart_temp"]["ttlAmt"];
        if ($ttlAmt < $this->general_settings['min_order']) {
            $this->session->set_flashdata('errors','We accept minimum order amount Rs. ' . $this->general_settings['min_order'] . '/-.');
            redirect(base_url('checkout'));
        }
        // $walletBalance =  $backendObj->getCurl($_SESSION["authUser"]['authtoken'], 'user/getwalletbalance/' . $user["_id"], '');
        $walletBalance = $this->Commonmodel->getData($this->config->item('APIURL') . 'user/getwalletbalance/'.$user["_id"], FRONT_TOKEN);
    
        $walletBalance = (empty(trim($walletBalance["wallet_balance"])) ||  0 >= $walletBalance["wallet_balance"]) ? 0 : $walletBalance["wallet_balance"];

        if (isset($_SESSION["edit_order"]['edit_used_wallet_amount']) && $_SESSION["edit_order"]['edit_used_wallet_amount'] > 0) {
            $walletBalance = $walletBalance + $_SESSION["edit_order"]['edit_used_wallet_amount'];
        }

        $delivery_date = "";

        if (isset($_POST["delivery_date"]) && !empty($_POST["delivery_date"])) {
            $delivery_date = $_POST["delivery_date"];
        }



        if (isset($_POST["key_wallet_used"]) && $_POST["key_wallet_used"] == "true" && !isset($_SESSION["wallet_less"])) {
            if ($walletBalance > 0 && isset($_POST["key_wallet_used"])) {
                $_SESSION["wallet_less"] = true;

                if ($walletBalance == $ttlAmt) {
                    $walletBalance = $ttlAmt;
                    $ttlAmt = 0.00;
                }

                if ($walletBalance > $ttlAmt) {
                    $walletBalance = $ttlAmt;
                    $ttlAmt = 0.00;
                }

                if ($walletBalance < $ttlAmt) {
                    $ttlAmt = $ttlAmt - $walletBalance;
                }
            }
        }

        if ($ttlAmt > 0) {
            //------------------
        } else {
            $_SESSION["cart_temp"]  = array(
                "ttlAmt" => $_SESSION["cart_temp"]["ttlAmt"],
                "delivery_time_id" => $_POST["delivery_time_id"],
                "delivery_date" => $_POST["delivery_date"],
                "delivery_address" => $_POST["delivery_address"],
                "payment_method" => '3',
                "key_wallet_used" => isset($_POST["key_wallet_used"]) ? "true" : "false",
                "redirectedFrom" => "op"  //online_payment
            );

            redirect(base_url('checkout/placeorder'));
        }

        $_SESSION["cart_temp"]  = array(
            "ttlAmt" => $ttlAmt,
            "delivery_time_id" => $_POST["delivery_time_id"],
            "delivery_address" => $_POST["delivery_address"],
            "payment_method"  => $_POST["payment_method"],
            "key_wallet_used" => isset($_POST["key_wallet_used"]) ? "true" : "false",
            "redirectedFrom"  => "op"  //online_payment
        );

        $cc_disc  = 0;
        $data['delivery_date'] = $delivery_date;
        $data['user'] = $user;

        if (!empty($_SESSION["ccode"]["code"]) && !empty($_SESSION["ccode"]["disc"])) {
            $cc_disc = $_SESSION["ccode"]["disc"];
        }
        $data['cc_disc'] =  $cc_disc;

        $data['ttlAmt'] = $ttlAmt - $cc_disc;
       
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/online_pay');
        $this->load->view('home/includes/_footer');
    }

    public function use_wallet(){

        $wallet = trim($this->input->post("wallet"));
        $user_id = front_auth_user('user')['_id'];
        $session_id = $_SESSION['session_id']; 
        $url = 'cart/checkwallet/' . $session_id.'/'.$user_id.'/'.$wallet;
        $response = "";

        // $data = $backendObj->getCurl($_SESSION["authUser"]['authtoken'], $url, '');

        $data  = $this->Commonmodel->getData($this->config->item('APIURL') ."cart/checkwallet/" . $session_id.'/'.$user_id.'/'.$wallet, FRONT_TOKEN);

        if ($data["status"] == 200) { 
            if(isset($data['data']['wallet_balance'])){
                $_SESSION["key_wallet_used"] = 1;
            }else{
               $_SESSION["key_wallet_used"] = ''; 
            } 
           $response = json_encode(array("success" => 200,'data'=>@$data['data']['wallet_balance']));        
        } else {
            $_SESSION["key_wallet_used"] = ''; 
            $response = json_encode(array("success" => $data["status"], "msg" => $data["message"]));
        }
        echo $response;
    }

    public function use_coupon(){

        $ccode = trim($_POST["ccode"]);
        $franchise_id = $_SESSION["authUser"]['franchiseId'];
        $user_id = $_SESSION["authUser"]["user"]["_id"];
        $session_id = $_SESSION['session_id'];
        $response = "";
        $url = $this->config->item('APIURL') .'cart/checkcoupon/' . $ccode;
       
        $postdata = array("franchise_id"=>$franchise_id, "user_id"=>$user_id,"session_id"=>$session_id);
        $data = $this->Commonmodel->postData($url,$postdata, FRONT_TOKEN);

        if ($data["sucess"] == 200) {
            $disc = $data["data"]['promo_disc']; 
            $_SESSION["ccode"]["disc"] = $disc; 
            $response = json_encode(array("success" => 200));
        } else {
            $response = json_encode(array("success" => $data["sucess"], "msg" => $data["msg"]));
        }

        echo $response;
    }
    
}
