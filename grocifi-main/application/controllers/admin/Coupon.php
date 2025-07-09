<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Coupon extends MY_Controller {

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


	//---------------------------Coupon--------------------------------	
	public function index(){
		$data['title'] = 'Coupons List';
		$authtoken = $this->session->userdata('authtoken');
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			if($key==0){ $franchise_id =$value['_id']; }
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}
		$data['franchise'] = $franchise;

		$this->load->view('includes/_header', $data);
		$this->load->view('coupon/coupon_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function coupon_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$filter = "";  
		if(isset($_GET["franchise_id"]) && !empty($_GET["franchise_id"])){
			$filter .= '&franchise_id='.$_GET["franchise_id"];
		} 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'coupon/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$coupon_data = $this->Commonmodel->getData($url, $authtoken); 

		$data = array(); 
		if(@$coupon_data['sucess']=='200'){  		
			$total = $coupon_data['total'];
			$filtered = $coupon_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start']; 
			foreach ($coupon_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$has_expiry  = ($row['has_expiry']==1)? 'Yes' : 'Yearly';
				$is_date  = ($row['has_expiry']==1)? date_time($row['start_date']).' - '.date_time($row['end_date']) : ' - ';
				$disc_value  = ($row['disc_in']==1)?"%":"Rs.";
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>';  

				$data[]= array(
					++$i, 
					$row['title'],  
					isset($row['franchiseName'])?$row['franchiseName']:'',
					($row['userName'] != null)?$row['userName']:"-",
					$has_expiry,
					$is_date,	
					isset($row['used_number'])?$row['used_number']:"Unlimited",
					isset($row['reuse_by_same_user'])?"Yes":"No",
					$row['disc_value'].' '.$disc_value,
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',
					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/coupon/edit/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function todayexpiry(){

		$data['title'] = 'Coupons To Be Expire Today';
		$authtoken = $this->session->userdata('authtoken');
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			if($key==0){ $franchise_id =$value['_id']; }
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}
		$data['franchise'] = $franchise;

		$this->load->view('includes/_header', $data);
		$this->load->view('coupon/coupon_todayexpiry');
		$this->load->view('includes/_footer');
	}	
	//-----------------------------------------------------------
	public function coupontodayexpiry_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$filter = ""; 
		if(isset($_GET["external_search"]) && $_GET["external_search"]){ 
			if(isset($_GET["franchise_id"]) && !empty($_GET["franchise_id"])){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			}
		}		

		$url =  $this->config->item('APIURL') . 'coupon/getexpirecoupon/'.date('Y-m-d').'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$coupon_data = $this->Commonmodel->getData($url, $authtoken); 

		$data = array(); 
		if(@$coupon_data['sucess']=='200'){  		
			$total = $coupon_data['total'];
			$filtered = $coupon_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=0; 
			foreach ($coupon_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$has_expiry  = ($row['has_expiry']==1)? 'Yes' : 'Yearly';
				$is_date  = ($row['has_expiry']==1)? date_time($row['start_date']).' - '.date_time($row['end_date']) : ' - ';
				$disc_value  = ($row['disc_in']==1)?"%":"Rs.";
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>';  

				$data[]= array(
					++$i, 
					$row['title'],  
					isset($row['franchiseName'])?$row['franchiseName']:'',
					$has_expiry,
					$is_date,	
					isset($row['used_number'])?$row['used_number']:"Unlimited",
					isset($row['reuse_by_same_user'])?"Yes":"No",
					$row['disc_value'].' '.$disc_value,
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',	
					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/coupon/edit/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 
	//-----------------------------------------------------------
	public function change_coupon_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'coupon/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id'); 
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function add(){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Coupon Code', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('has_expiry', 'Will be Expire', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('reuse_by_same_user', 'Reuse by same code', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('uses_number', 'Number of uses', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('disc_in', 'Discount Manner', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('disc_value', 'Discount Value', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			if($this->input->post('has_expiry')=='true'){				
				$this->form_validation->set_rules('start_date', 'Start Date', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('end_date', 'End Date', 'trim|required|strip_tags|xss_clean');
			}
			/*if(!empty($this->input->post('user_name'))){				
				$this->form_validation->set_rules('user_id', 'User', 'trim|required');
			}*/
			if (empty($_FILES['coupon_image']['name']))
			{
			    $this->form_validation->set_rules('coupon_image', 'Coupon Image', 'required');
			}
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['coupon'] = array( 
					'title' => $this->input->post('title'), 
					'franchise_id'=> $this->input->post('franchise_id'),
					'has_expiry'=> $this->input->post('has_expiry'),
					'user_id'=> $this->input->post('user_id'),
					'start_date'=> $this->input->post('start_date'),
					'end_date'=> $this->input->post('end_date'),
					'reuse_by_same_user'=> $this->input->post('reuse_by_same_user'),
					'uses_number'=> $this->input->post('uses_number'),
					'disc_in'=> $this->input->post('disc_in'),
					'disc_value'=> $this->input->post('disc_value'),
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken'); 
				$url =  $this->config->item('APIURL') . 'franchise/index';		
				$franchise_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$franchise_data['sucess']=='200'){ 
					$data['franchise'] = $franchise_data['data'];
				} 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('coupon/coupon_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'franchise_id'=> $this->input->post('franchise_id'),
					'has_expiry'=> $this->input->post('has_expiry'),
					'user_id'=> !empty($this->input->post('user_id'))?$this->input->post('user_id'):'null',
					'start_date'=> $this->input->post('start_date'),
					'end_date'=> $this->input->post('end_date'),
					'reuse_by_same_user'=> $this->input->post('reuse_by_same_user'),
					'uses_number'=> $this->input->post('uses_number'),
					'disc_in'=> $this->input->post('disc_in'),
					'disc_value'=> $this->input->post('disc_value'),
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				if($this->input->post('has_expiry')=='false'){
					$date = date('Y-m-d');
					$data['start_date'] = $date;
					$data['end_date']=  date('Y-m-d', strtotime($date. ' + 1 year'));
				}
				if(!empty($_FILES['coupon_image']['name']))
				{    
					$filename = $_FILES["coupon_image"]["tmp_name"];
		        	$request = array('coupon' => $this->Commonmodel->getCurlValue($filename, $_FILES["coupon_image"]["type"], $_FILES["coupon_image"]["name"]));  
					$url =  $this->config->item('APIURL') . 'coupon/savecouponcodeimg/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['code_img'] = $result['name'];
					}
				}
				$data = $this->security->xss_clean($data);
 			  
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'coupon/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 	 			///print_r($records ); exit;
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Coupon has been added successfully!');
					redirect(base_url($this->model.'/coupon'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/coupon'));
				}
			}
		}else{

			$data['title'] = 'Add Coupon';
			$authtoken = $this->session->userdata('authtoken'); 
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 
			///prd($data['franchise']);
			$this->load->view('includes/_header', $data);
			$this->load->view('coupon/coupon_add');
			$this->load->view('includes/_footer');
		}
	}
	//-----------------------------------------------------------
	public function edit($id = 0){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Coupon Code', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('has_expiry', 'Will be Expire', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('reuse_by_same_user', 'Reuse by same code', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('uses_number', 'Number of uses', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('disc_in', 'Discount Manner', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('disc_value', 'Discount Value', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			if($this->input->post('has_expiry')=='true'){				
				$this->form_validation->set_rules('start_date', 'Start Date', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('end_date', 'End Date', 'trim|required|strip_tags|xss_clean');
			}
			/*if(!empty($this->input->post('user_name'))){				
				$this->form_validation->set_rules('user_id', 'User', 'trim|required');
			}*/

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['coupon'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'franchise_id'=> $this->input->post('franchise_id'),
					'has_expiry'=> $this->input->post('has_expiry'),
					'user_id'=> $this->input->post('user_id'),
					'start_date'=> $this->input->post('start_date'),
					'end_date'=> $this->input->post('end_date'),
					'reuse_by_same_user'=> $this->input->post('reuse_by_same_user'),
					'uses_number'=> $this->input->post('uses_number'),
					'disc_in'=> $this->input->post('disc_in'),
					'coupon'=> $this->input->post('couponimg'),
					'disc_value'=> $this->input->post('disc_value'), 
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken'); 
				$url =  $this->config->item('APIURL') . 'franchise/index';		
				$franchise_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$franchise_data['sucess']=='200'){ 
					$data['franchise'] = $franchise_data['data'];
				} 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('coupon/coupon_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'franchise_id'=> $this->input->post('franchise_id'),
					'has_expiry'=> $this->input->post('has_expiry'),
					'user_id'=> !empty($this->input->post('user_id'))?$this->input->post('user_id'):'null',
					'start_date'=> !empty($this->input->post('start_date'))?$this->input->post('start_date'):'null',
					'end_date'=> !empty($this->input->post('end_date'))?$this->input->post('end_date'):'null',
					'reuse_by_same_user'=> $this->input->post('reuse_by_same_user'),
					'uses_number'=> $this->input->post('uses_number'),
					'disc_in'=> $this->input->post('disc_in'),
					'disc_value'=> $this->input->post('disc_value'),
					'is_active' => $this->input->post('is_active'),
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				if($this->input->post('has_expiry')=='false'){
					$date = date('Y-m-d');
					$data['start_date'] = $date;
					$data['end_date']=  date('Y-m-d', strtotime($date. ' + 1 year'));
				}
				if(!empty($_FILES['coupon_image']['name']))
				{    
					$filename = $_FILES["coupon_image"]["tmp_name"];
		        	$request = array('coupon' => $this->Commonmodel->getCurlValue($filename, $_FILES["coupon_image"]["type"], $_FILES["coupon_image"]["name"]));  
					$url =  $this->config->item('APIURL') . 'coupon/savecouponcodeimg/';
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['code_img'] = $result['name'];
					}
				}else{
					$data['code_img'] = $this->input->post('couponimg');
				}
				//prd($data);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'coupon/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 	////print_r($records); exit;
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Coupon has been update successfully!');
					redirect(base_url($this->model.'/coupon'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/coupon'));
				}
			}
		}else{

			$data['title'] = 'Edit Coupon';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'coupon/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['coupon'] = $records['data'];
			}  
			$authtoken = $this->session->userdata('authtoken'); 
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 
			$data['userName'] = "";
			if(!empty($data['coupon']['user_id'])){
				$url =  $this->config->item('APIURL') . 'user/getuserbyid/'.$data['coupon']['user_id'];
				$user_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$user_data['sucess']=='200'){ 
					$userName = $user_data['data'][0];
					$data['userName'] = $userName['fname'].' '.$userName['lname'].' ('.$userName['phone_no'].') ';
				} 
			}
			$this->load->view('includes/_header', $data);
			$this->load->view('coupon/coupon_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	} 
	//-----------------------------------------------------------
 	public function updateproduct($id = 0){
 		$data['title'] = 'Update Coupon Products';
 		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'coupon/getcoupondetailbyid/'.$id;
		$records = $this->Commonmodel->getData($url, $authtoken);
		if($records['sucess']=='200'){
			$data['coupon'] = $records['data'][0];
			$offranchise = $records['data'][0]['franchise_id']; 
		}  
		$url =  $this->config->item('APIURL') . 'product/getproductsoffranchise/'.$offranchise;
		$records = $this->Commonmodel->getData($url, $authtoken); 
		if($records['sucess']=='200'){
			$data['couponproduct'] = $records['data'];
		}  
		$this->load->view('includes/_header', $data);
		$this->load->view('coupon/updateproduct', $data);
		$this->load->view('includes/_footer');
 	}
	//-----------------------------------------------------------
	public function generatecoupon(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'coupon/generatecoupon';
		$records = $this->Commonmodel->getData($url, $authtoken);	
		$data = array();  
		echo json_encode($records);
	}
  	//-----------------------------------------------------------
	public function getuserbyName($name){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/getuserbyname/'.$name;
		$records = $this->Commonmodel->getData($url, $authtoken);	
		$data = array();  
		echo json_encode($records['data']);
	}
	//-----------------------------------------------------------
	public function setexpirecoupon(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'coupon/setexpirecoupon';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		///$records['data']['id']= $this->input->post('_id'); 
		echo json_encode($records);
	}


}

?>	