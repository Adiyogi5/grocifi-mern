<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Voucher extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		check_user_premissions(
			$this->session->userdata('role_type'), 
			$this->session->userdata('admin_id'),
			$this->router->fetch_class(), 
			$this->router->fetch_method()
		);		
		auth_check(); // check login auth  
		$this->model = $this->session->userdata('model');
	}

	//-------------------------Voucher--------------------------------	
	public function index(){
		$data['title'] = 'Voucher List';
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$authtoken = $this->session->userdata('authtoken');  
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			if($key==0){ $franchise_id =$value['_id']; }
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}
		$data['franchise'] = $franchise;
		$data['fromdate'] = date("Y-m-d", strtotime("-7 day", strtotime(date("Y/m/d")))); 
		$data['today'] = date('Y-m-d');	
		$this->load->view('includes/_header', $data);
		$this->load->view('voucher/voucher_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function voucher_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);
  		$filter = ""; 
		if(isset($_GET["created_from"]) && !empty($_GET["created_from"]) && isset($_GET["created_to"]) && !empty($_GET["created_to"])){
			$filter .= '&created_from='.date("Y-m-d", strtotime($_GET["created_from"]));
			$filter .= '&created_to='.date("Y-m-d", strtotime($_GET["created_to"]));
		}else{
			$filter .= '&created_from='.date("Y-m-d", strtotime("-7 day", strtotime(date("Y/m/d")))); 
			$filter .= '&created_to='.date("Y-m-d");
		} 
		if(isset($_GET["franchise_id"]) && ($_GET["franchise_id"]!='')){
			$filter .= '&franchise_id='.$_GET["franchise_id"];
		}  

		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'voucher/list?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$voucher_data = $this->Commonmodel->getData($url, $authtoken); 
		///prd($voucher_data); exit;
		$data = array(); 
		if(@$voucher_data['sucess']=='200'){  		
			$total = $voucher_data['total'];
			$filtered = $voucher_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($voucher_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == '1')? 'Active': 'Deleted';
				$del = ($row['is_active'] == '1')?'<a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a>':'--';  
				$data[]= array(
					++$i, 
					isset($row['franchiseName'])?$row['franchiseName']:'', 
					$row['deliveryboy'], 
					isset($row['amount'])?$row['amount']:' 0 ',
					date_time($row['created']),	 
					$status,	 
					$del
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_voucher_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'voucher/status';
		$data = $this->input->post();
		$data['modifiedby'] =  $this->session->userdata('admin_id');
		 
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id'); 
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addvoucher(){
		if($this->input->post('submit')){ 
			$this->form_validation->set_rules('user_id', 'Delivery Boy', 'trim|required'); 
			$this->form_validation->set_rules('amount', 'Amount', 'trim|required|strip_tags|xss_clean'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['voucher'] = array( 
					'amount'=> $this->input->post('amount'),
					'user_id'=> $this->input->post('user_id'), 
				); 				
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'franchise/index';		
				$franchise_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$franchise_data['sucess']=='200'){ 
					$data['franchise'] = $franchise_data['data'];
				} 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('voucher/voucher_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(  
					'is_active' => 1,
					'amount'=> $this->input->post('amount'),
					'user_id'=> $this->input->post('user_id'), 
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d'),
					'modified' => date('Y-m-d'),
				); 
				$data = $this->security->xss_clean($data);
 	
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'voucher/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 	
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Voucher has been added successfully!');
					redirect(base_url($this->model.'/voucher'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/voucher'));
				}
			}
		}else{
			$data['title'] = 'Add Voucher';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('voucher/voucher_add');
			$this->load->view('includes/_footer');
		}

	} 
 


}

?>	