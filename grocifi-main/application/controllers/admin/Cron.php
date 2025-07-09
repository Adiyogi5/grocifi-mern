<?php 
defined('BASEPATH') OR exit('No direct script access allowed');
 
require_once(APPPATH."libraries/razorpay/razorpay-php/Razorpay.php");
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class Cron extends MY_Controller {

	public function __construct(){

		parent::__construct(); 
		$this->model = $this->session->userdata('model');
	}
	 
	function createrazorpayorder($amount = null){ 

		$razorpay_key =  $this->general_settings["razor_key_id"];
		$razorpay_secret =  $this->general_settings["razor_key_secret"];
	 	
		$api = new Api($razorpay_key, $razorpay_secret);
        $orderData  = $api->order->create([
            'receipt'   => generateRandomString(16),
            'amount'    => $amount * 100,
            'currency'  => 'INR'
        ]);

        $data = [
            "key"               => $razorpay_key,
            "amount"            => $amount * 100,
            "order_id"          => $orderData['id'],
            "currency"          => 'INR'
        ];

        $response = json_encode([
                    'status' => TRUE,
                    'message' => 'Successful.',
                    'data' => $data
                ], '200'); 

        echo $response;
	}
	
	function updateorderpaymentdata(){ 

	 	$razorpay_key =  $this->general_settings["razor_key_id"];
		$razorpay_secret =  $this->general_settings["razor_key_secret"];
	 	$api = new Api($razorpay_key, $razorpay_secret);

		$url =  $this->config->item('APIURL') . 'order/getfailedpaymentorders';
		$authtoken = $this->session->userdata('authtoken');  
		$order_data = $this->Commonmodel->getData($url, $authtoken);
		$flterOrderId = [];
		$data = array();   

		if(@$order_data['sucess']=='200' && !empty($order_data['data'])){  
			
			foreach ($order_data['data'] as $key => $value) {				
				$razorpay_order_id = $value['order']['razorpay_order_id'];
				$razorpay_payment_id = $value['order']['razorpay_payment_id'];

				if(!empty($razorpay_order_id)){
					$payment = $api->order->fetch($razorpay_order_id);  
					if(!empty($payment) && $payment->status=='paid'){  //paid
						// update payment api code  
						$rdata = array( 'orderId' => $value['order']['_id'], "payment_status"=>2,"razorpay_amt"=>@$value['order']['razorpay_amt'], "razorpay_payment_id"=>$value['order']['razorpay_payment_id'], "payment_method"=>2,  );
						$url =  $this->config->item('APIURL') . 'order/updateorderpayment'; 
						$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
 
					}else{
						//cancel order if pass one hours
						$now = date('Y-m-d H:i:s');
						$created = date('Y-m-d H:i:s', strtotime($value['order']['created']));
						$from_time = strtotime($now); 
						$to_time =  strtotime($created); 
						$diff_minutes = round(abs($from_time - $to_time) / 60,2);
						if($diff_minutes>60){
							// update order cancel api code  
							$rdata = array( '_id' => $value['order']['_id'], "is_active"=>6 );
							$url =  $this->config->item('APIURL') . 'order/updatestatus'; 
							$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
						}
					}
				}else if(!empty($razorpay_payment_id)){
					$payment = $api->payment->fetch($razorpay_payment_id);  
					if(!empty($payment) && $payment->status=='captured'){  //captured
						// update payment api code  
						$rdata = array( 'orderId' => $value['order']['_id'], "payment_status"=>2,"razorpay_amt"=>@$value['order']['razorpay_amt'], "razorpay_payment_id"=>$value['order']['razorpay_payment_id'], "payment_method"=>2,  );
						$url =  $this->config->item('APIURL') . 'order/updateorderpayment'; 
						$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
 
					}else{
						//cancel order if pass one hours
						$now = date('Y-m-d H:i:s');
						$created = date('Y-m-d H:i:s', strtotime($value['order']['created']));
						$from_time = strtotime($now); 
						$to_time =  strtotime($created); 
						$diff_minutes = round(abs($from_time - $to_time) / 60,2);
						if($diff_minutes>60){
							// update order cancel api code  
							$rdata = array( '_id' => $value['order']['_id'], "is_active"=>6 );
							$url =  $this->config->item('APIURL') . 'order/updatestatus'; 
							$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
						}
					}
				}else{
					//cancel order if pass one hours
					$now = date('Y-m-d H:i:s');
					$created = date('Y-m-d H:i:s', strtotime($value['order']['created']));
					$from_time = strtotime($now); 
					$to_time =  strtotime($created); 
					$diff_minutes = round(abs($from_time - $to_time) / 60,2);
					if($diff_minutes>60){
						// update order cancel api code  
						$rdata = array( '_id' => $value['order']['_id'], "is_active"=>6 );
						$url =  $this->config->item('APIURL') . 'order/updatestatus'; 
						$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
					}				
				}
				

			}

		}


	}

}
?>