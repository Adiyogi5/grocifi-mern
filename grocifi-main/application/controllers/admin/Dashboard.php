<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends MY_Controller {

	public function __construct(){
		parent::__construct();
		auth_check(); // check login auth 
		$this->model = $this->session->userdata('model');		 
	}

	//---------------------------------------------------------------
	public function index(){ 
		// prd($this->general_settings);
		$data['title'] = 'Dashboard';
		$authtoken = $this->session->userdata('authtoken');  
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) {
			if($key==0 && empty($this->session->userdata('main_franchise_id')) ){
				$franc_data = array( 'main_franchise_id'  => $value['_id'] );
				$this->session->set_userdata($franc_data);
			}
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}

		$url1 =  $this->config->item('APIURL') . 'order/getciordersofdaterange/'.date('Y-m-d').'/'.date('Y-m-d').'/'.$this->session->userdata('main_franchise_id');
		$orderdetail = $this->Commonmodel->getData($url1, $authtoken); 
		///prd($orderdetail);
		$url2 =  $this->config->item('APIURL') . 'order/getcitodayandlastweekorders/'.$this->session->userdata('main_franchise_id');
		$latestorder = $this->Commonmodel->getData($url2, $authtoken); 
		$url3 =  $this->config->item('APIURL') . 'catagory/getcatswithproductcount';
		$productcount = $this->Commonmodel->getData($url3, $authtoken); 
		$url4 =  $this->config->item('APIURL') . 'user/todayandlastweekcustomers';
		$latestcustomer = $this->Commonmodel->getData($url4, $authtoken); 
		$url5 =  $this->config->item('APIURL') . 'order/getsalegraphorder/'.$this->session->userdata('main_franchise_id');
		$salegraphorder = $this->Commonmodel->getData($url5, $authtoken);		 		
		 
		$data['orderdetail']    = isset($orderdetail['data'])?$orderdetail['data']:[];
		$data['latestorder']    = isset($latestorder['data'])?$latestorder['data']:[];
		$data['productcount']   = isset($productcount['data'])?$productcount['data']:[];
		$data['latestcustomer'] = isset($latestcustomer['data'])?$latestcustomer['data']:[];
		$salelabels = '';
		$salecount = '';
		$saleamt = '';
		if($salegraphorder){
			foreach ($salegraphorder['data'] as $key => $value) {
				$month = date('M Y',strtotime($value['_id']));
				$salelabels.= "'".$month."'".', ';
				$salecount.= $value['count'].',';
				$saleamt.= $value['sum'].',';
			}
		}
		if(@$salegraphorder['sucess']=='200'){
			$data['salelabels'] = substr($salelabels,0,strlen($salelabels)-2);
			$data['salecount'] = substr($salecount,0,strlen($salecount)-1);
			$data['saleamt'] = substr($saleamt,0,strlen($saleamt)-1);
		}else{
			$data['salelabels'] = '';
			$data['salecount'] = '';
			$data['saleamt'] = '';
		}
 

		$data['salegraphsucess'] = isset($salegraphorder['sucess'])?$salegraphorder['sucess']:[];
		$data['fromdate'] = date('Y-m-d');
		$data['todate'] = date('Y-m-d');
		$data['franchise'] = isset($franchise)?$franchise:[];
		
		$this->load->view('includes/_header');
    	$this->load->view('dashboard/index', $data);
    	$this->load->view('includes/_footer');
	}
	
	public function getorderdata()
	{
		if($this->input->is_ajax_request()){
			$fromdate= $this->input->post('fromdate');
			$todate = $this->input->post('todate'); 
			$franchise_id= $this->input->post('franchise_id');
			$authtoken = $this->session->userdata('authtoken');  
			$url1 =  $this->config->item('APIURL') . 'order/getciordersofdaterange/'.$fromdate.'/'.$todate.'/'.$franchise_id;
			$orderdetail = $this->Commonmodel->getData($url1, $authtoken); 
			echo json_encode($orderdetail);
		}
	}

	public function change_franchise(){
		if($this->input->is_ajax_request()){
			$franchise_id= $this->input->post('franchise_id');
			$franc_data = array( 'main_franchise_id'  => $franchise_id );
			$this->session->set_userdata($franc_data);
		}
	}
	
}

?>	