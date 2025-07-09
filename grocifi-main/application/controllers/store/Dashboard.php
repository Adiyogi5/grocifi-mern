<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends MY_Controller {

	public function __construct(){
		parent::__construct();
		auth_franchise_check(); // check login auth 
		$this->model = $this->session->userdata('model');		 
	}

	//--------------------------------------------------------------------------
	public function index(){ 
		$data['title'] = 'Dashboard'; 

		$franchise_id = $this->session->userdata('franchise_id');
		$firmname = $this->session->userdata('firmname');
		$franchise[0]['_id']=$franchise_id;
		$franchise[0]['firmname']= $firmname; 
		$authtoken = $this->session->userdata('authtoken');  
		 
		$url1 =  $this->config->item('APIURL') . 'order/getciordersofdaterange/'.date('Y-m-d').'/'.date('Y-m-d').'/'.$franchise_id;
		$orderdetail = $this->Commonmodel->getData($url1, $authtoken); 
		$url2 =  $this->config->item('APIURL') . 'order/getcitodayandlastweekorders/'.$franchise_id;
		$latestorder = $this->Commonmodel->getData($url2, $authtoken); 
		$url2 =  $this->config->item('APIURL') . 'order/getsalegraphorder/'.$franchise_id;
		$salegraphorder = $this->Commonmodel->getData($url2, $authtoken); 
 
		$data['orderdetail']    = $orderdetail['data'];
		$data['latestorder']    = $latestorder['data']; 
		$salelabels = '';
		$salecount = '';
		$saleamt = '';
		foreach ($salegraphorder['data'] as $key => $value) {
			$month = date('M Y',strtotime($value['_id']));
			$salelabels.= "'".$month."'".', ';
			$salecount.= $value['count'].',';
			$saleamt.= $value['sum'].',';
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
 
		$data['salegraphsucess'] = @$salegraphorder['sucess'];
		$data['fromdate'] = date('Y-m-d');
		$data['todate'] = date('Y-m-d');
		$data['franchise'] = $franchise;
		
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