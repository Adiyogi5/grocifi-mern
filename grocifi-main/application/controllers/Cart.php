<?php defined('BASEPATH') or exit('No direct script access allowed');

class Cart extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        authfront_check(); // check login auth
        authfront_area(); // check location
        $this->authtoken = $this->session->userdata('authUser')['authtoken'];
        $this->areaId = $this->session->userdata('authUser')['location']['3'];
        $this->load->library('mailer');
        $this->load->Model('Commonmodel', 'Commonmodel');
        $this->load->library('cart');
       
    }

    
    public function addtocart()
    {
      
        $varid = $this->input->post('varid');;
        $var_qty = ($_POST["qty"]!='')?$_POST["qty"]:1;

        $url = $this->config->item('APIURL') .'cart/add_to_cart/'; 

        $postdata =  array("session_id"=> $this->session->userdata('session_id'),"qty"=>$var_qty,"productvarId"=> $varid );

        $data = $this->Commonmodel->postData($url, $postdata, FRONT_TOKEN);

        if ($data["status"] == 200) {
            if(!isset($_SESSION["cartData"])){
                $_SESSION["cartData"] = [];
            }
            $_SESSION["cartData"]['qty']= $_SESSION["cartData"]['qty']+$var_qty; 
            $data['data']['qty'] = $_SESSION["cartData"]['qty'];
            echo json_encode($data);
            exit();
        }else{ 
            echo json_encode($data);
            exit();
        }
    }   

    public function removeItem()
    {
        $cartId     = $this->input->post('cartid');
        $qty        =  $this->input->post('qty');

        $url        =  $this->config->item('APIURL') .'cart/remove_cart'; 
        $postdata   =  array("cartId"=>$cartId);
        $data       = $this->Commonmodel->postData($url, $postdata, FRONT_TOKEN);

        if ($data["status"] == 200) {
            $_SESSION["cartData"]['qty'] = $_SESSION["cartData"]["qty"]-$qty; 
             $data['data']['qty'] = $_SESSION["cartData"]['qty'];
            echo json_encode($data);
            exit();
        }else{
            echo json_encode($data);
            exit();
        }
    }  

    public function check_min_pay(){

        $cartProduct    = "";
        $cart_id_qty    = array();
        $cartEmpty      = true;
        $cartQty        = 0;

        if (isset($_SESSION["mycart"][0]) && count($_SESSION["mycart"]) > 0) {
            $cartEmpty = false;
            $frpvIds = array();
            foreach ($_SESSION["mycart"] as $val) {
                $cart_id_qty[$val["varid"]] = $val["qty"];
                $frpvIds[]  = $val["varid"];
                $cartQty    += $val["qty"];
            }
            $url            =  $this->config->item('APIURL') .'franchise/getproductdetailsbyvarientid'; 
            $frpvIdsImp     =  implode('","', $frpvIds);
            $postdata       =  array("frpvIds"=>[$frpvIdsImp]);
            $cartProduct    = $this->Commonmodel->postData($url, $postdata, FRONT_TOKEN);
            // $cartProduct    = $backendObj->postCurl($_SESSION["authUser"]['authtoken'], 'franchise/getproductdetailsbyvarientid', '{"frpvIds":["' . implode('","', $frpvIds) . '"]}');
        }

        $ttlAmt     = 0;
        $fttlAmt    = 0;
        $ttlDiscAmt = 0;

        if (isset($cartProduct["data"][0])) {
            foreach ($cartProduct["data"] as $val) {
                $isDisc = false;
                if ($val["disc_price"] != "" && $val["disc_price"] != "0" && $val["disc_price"] != null) {
                    $isDisc = true;
                }


                $tprice = $val["price"] * $cart_id_qty[$val["_id"]];
                $ttlAmt += $tprice;

                $discAmt = 0;
                if ($isDisc) {
                    $discAmt = (($val["disc_price"] / 100) * $tprice);
                    $tprice = $tprice - $discAmt;
                }
                //$ttlAmt += $tprice;
                $ttlDiscAmt += $discAmt;
            }
            //$tax = ($ttlAmt * $siteSetting["data"][0]["tax"]) / 100;
            $ttlAmt = $ttlAmt - $ttlDiscAmt;
        }
        $flag = true;
        if ($ttlAmt < $this->general_settings['min_order']) {
            $flag = false;
        }
        echo json_encode(array("place_order" => $flag));
    }  

    public function update_cart(){

        $cartId = $this->input->post('cartid');
        $qty        =  $this->input->post('qty');

        $url        =  $this->config->item('APIURL') .'cart/update_cart';
        $postdata   =  array("cartId"=>$cartId,"qty"=>$qty); 
        $data       = $this->Commonmodel->postData($url, $postdata, FRONT_TOKEN);

        if ($data["status"] == 200) {
            $_SESSION["cartData"]['qty'] = $_SESSION["cartData"]["qty"]+$qty; 
            $data['data']['qty'] = $_SESSION["cartData"]['qty'];
            echo json_encode($data);
            exit();
        }else{
            echo json_encode($data);
            exit();
        }
    }  

    public function getDeliverySlot()
    {
        
        $date =  $this->input->post('date');
        $franchiseId =  $this->input->post('franchiseId');
        $url =  $this->config->item('APIURL') . 'settings/getAvailbleTimeslot?date='.$date.'&franchiseId='.$franchiseId; 
        $records = $this->Commonmodel->getData($url, FRONT_TOKEN);
      
        $data = array('status'=>false,'message'=>"", 'data'=>[]);
        if($records['status']=='200'){
            $arrayData = $records['data'];
            $data = array('status'=>true,'message'=>"", 'data'=>$arrayData);
        }
        echo json_encode($data); exit;
    }    

    public function checkTimeslotAvailble()
    {
        
        $date =  $this->input->post('date');
        $slot_id =  $this->input->post('slot_id');
        $franchiseId =  front_auth_user('franchise')['franchiseId'];
        $url =  $this->config->item('APIURL') . 'settings/getAvailbleTimeslot?date='.$date.'&franchiseId='.$franchiseId; 
        $records = $this->Commonmodel->getData($url, FRONT_TOKEN);
   
        $data = array('status'=>false,'message'=>"", 'data'=>[]);
        if($records['status']=='200'){
            foreach ($records['data'] as $key => $value) {
                if(($value['id'] == $slot_id )&& ($value['is_available'] == true)){
                    $data = array('status'=>true,'message'=>"", 'data'=>$slot_id);
                }
            }
        }
       
        echo json_encode($data); exit;
    }   

    public function my_cart()
    {
        $data['title'] = "Cart";
        $data['ajex'] = true;
        $cartData =  $this->load->view('home/myCart',$data, TRUE);  
        echo json_encode($cartData); exit;
    }    
    
    public function edit_order()
    {
 
        if (isset($_SESSION["edit_order"]["id"]) && !empty($_SESSION["edit_order"]["id"])) {
            //-------------
        } else {
            //$_SESSION["flashMsg"] = array("class" => "alert alert-info", "message" => "No order found to edit");
            echo json_encode(array("success" => false, "msg"=>""));
            exit();
        }

        $orderid = $_SESSION["edit_order"]["id"];    
        $old_orders =  $_SESSION["edit_order"]["old_order"];

        $frpvIds = array();
        foreach ($_SESSION["mycart"] as $val) {
            $cart_id_qty[$val["varid"]] = $val["qty"];
            $frpvIds[] = $val["varid"];
        }   
        // $cartProduct =  $backendObj->postCurl($_SESSION["authUser"]['authtoken'], 'franchise/getproductdetailsbyvarientid', json_encode(array("frpvIds"=>$frpvIds)));
        $cartProduct = $this->Commonmodel->postData($this->config->item('APIURL').'franchise/getproductdetailsbyvarientid', array("frpvIds"=>$frpvIds), FRONT_TOKEN);

        $str = '';

        $str .= '<div id="edited_cart" class="card blog">';
        $str .= '<div class="card-body">';
        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Order #: </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= $old_orders[0]["orderUserId"];
        $str .= '</div>';
        $str .= '</div>';
        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Total Amount (Old): </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= $currency.' '.number_format($old_orders[0]["total"], 2);
        $str .= '</div>';
        $str .= '</div>';
        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Total Amount (New): </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= '<strong>'.$currency.' '.number_format($_SESSION["cart_temp"]["ttlAmt"], 2).'</strong>';
        $str .= '</div>';
        $str .= '</div>';
        $str .=  '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Wallet Used: </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .=  ($old_orders[0]["key_wallet_used"] == 1)?$currency." " . number_format($old_orders[0]["key_wallet_balance"], 2):"Not Used";
        $str .= '</div>';
        $str .= '</div>';

        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Dilivery Charges: </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= $currency.' '.number_format($old_orders[0]["delivery_charge"], 2);
        $str .= '</div>';
        $str .= '</div>';

        $wallet_amount = ($old_orders[0]["key_wallet_used"] == 1)?number_format($old_orders[0]["key_wallet_balance"], 2):0.00;
        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Final Amount: </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= '<strong>'.$currency.' '.number_format($_SESSION["cart_temp"]["ttlAmt"] - $wallet_amount, 2).' (to be paid)</strong>';
        $str .= '</div>';
        $str .= '</div>';

        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Payment Method: </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= $paymentMethodArr[$old_orders[0]["payment_method"]];
        $str .= '</div>';
        $str .= '</div>';
        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-4">';
        $str .= '<label>Delivery Address: </label>';
        $str .= '</div>';
        $str .= '<div class="control-group form-group col-md-6">';
        $str .= $old_orders[0]["delivery_address"];;
        $str .= '</div>';
        $str .= '</div>';
        $str .= '<div class="row">';
        $str .= '<div class="control-group form-group col-md-3">';
        $str .= '<label>Product(s): </label>';
        $str .= '</div>';
        $str .= '<div class="card-body pt-0 pr-0 pl-0 pb-0">';

        if (isset($cartProduct["data"][0])) {
            $ttlAmt = 0;
            $fttlAmt = 0;
            $ttlDiscAmt = 0;
            foreach ($cartProduct["data"] as $val) {
                $str .= '<div class="cart-list-product">';
                $str .= '<a class="float-right remove-cart" onclick="deleteItem('."'".$val['_id']."'".')" href="javascript:void(0);"><i class="mdi mdi-close"></i></a>';
                $img = $SITEURL."img/default_img.png";
                $isDisc = false;
                if (isset($val["pImgs"]) && count($val["pImgs"]) > 0) {
                    foreach ($val["pImgs"] as $pimg) {
                        if ($pimg["isMain"]) {
                            $file_headers = get_headers($this->config->item('PRODUCTIMAGEPATH') . $pimg["title"]);
                            if ($file_headers[0] == 'HTTP/1.1 200 OK') {
                                $img = $this->config->item('PRODUCTIMAGEPATH') . $pimg["title"];
                            }   break;
                        }
                    }
                }
                if ($val["disc_price"] != "" && $val["disc_price"] != "0" && $val["disc_price"] != null) {
                    //$isDisc = true;
                }  

                $str .= '<img class="img-fluid" src="'.$img.'" alt="">';
                $str .= '<h5><a href="./product.php?pid='.$val["frproductId"].'">'.$val["products"][0]["title"].'</a></h5>';
                $str .= '<h6><span class="mdi mdi-approval"></span> '.$val["measurment"] . " " . $unitTypeArr[$val["unit"]].' </h6>';
                $str .= '<h6>';
                $str .= '<strong> Quantity &nbsp;&nbsp;</strong>';
                if ($cart_id_qty[$val["_id"]] > 1) {
                    $str .= '<button onclick="removeItem('."'". $val['_id'] ."'".')" type="button" class="btn btn-outline-primary btn-border btn-sm decreaseQty">-</button>';
                }else{
                    $str .= '<button type="button" class="btn btn-outline-primary btn-border btn-sm" disabled>-</button>';
                }
                $str .= '&nbsp;&nbsp;'.$cart_id_qty[$val["_id"]].'&nbsp;&nbsp;';
                if ($cart_id_qty[$val["_id"]] < $val["qty"]) {
                    $str .= '<button onclick="addItem('."'". $val['_id'] ."'".')" type="button" class="btn btn-outline-primary btn-border btn-sm">+</button>';
                }
                $str .= '</h6>';
                $tprice = $val["price"] * $cart_id_qty[$val["_id"]];
                $ttlAmt += $tprice;
                $discAmt = 0;
                if ($isDisc) {
                    $discAmt = (($val["disc_price"] / 100) * $tprice);
                    $tprice = $tprice - $discAmt;
                }
                $ttlDiscAmt += $discAmt;
                $str .= '<p class="offer-price mb-0">'.$currency;
                if ($isDisc) {
                    $str .= number_format($val["price"] - (($val["disc_price"] / 100) * $val["price"]), 2);
                } else {
                    $str .= number_format($val["price"], 2);
                }
                $str .= '<i class="mdi mdi-tag-outline"></i>';
                if (isset($val["mrp"]) && $val["mrp"] > 0) {
                    $str .= '<span class="regular-price">'.$currency.' '.number_format($val["mrp"], 2).'</span>';
                }

                if ($isDisc) {
                    $str .= '<span class="regular-price">'.$currency.' '.number_format($val["price"], 2).'</span>';
                }
                $str .= '</p>';
                $str .= '</div>';
            }
        }  
        $str .= '</div>';
        $str .= '</div>';
        $str .= '</div>';
        $str .= '</div>';
        echo json_encode(array("success" => true, "msg"=>"", "data"=>$str));
        
    } 
}
