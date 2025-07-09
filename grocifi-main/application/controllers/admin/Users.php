<?php defined('BASEPATH') OR exit('No direct script access allowed');
class Users extends MY_Controller {

	public function __construct(){
		parent::__construct(); 
		$param = $this->uri->segment(4);
		if($this->router->fetch_method()=='edit' || $this->router->fetch_method()=='delete'){
			$param = $this->uri->segment(5);
		}
		auth_check(); // check login auth 
		check_user_premissions(
			$this->session->userdata('role_type'), 
			$this->session->userdata('admin_id'),
			$this->router->fetch_class(), 
			$this->router->fetch_method(),
			$param	
		);		
		
		$this->load->library('datatable'); 
		$this->model = $this->session->userdata('model');
	}
	
	//-----------------------------------------------------------
	public function wholesaler(){
		if($this->general_settings['is_wholesaler']==1){
			$data['title'] = 'Wholesaler List';
			$authtoken = $this->session->userdata('authtoken'); 
			$url =  $this->config->item('APIURL') . "country/index?is_active=1";
			$temp = $this->Commonmodel->getData($url, $authtoken);
			$data['search_country'] = $temp['data']; 
			
			$this->load->view('includes/_header', $data);
			$this->load->view('users/wholesaler_list');
			$this->load->view('includes/_footer');
		}else{
			$this->session->set_flashdata('errors', "You don't have permission to access page.");
            redirect('error', 'refresh');
		}
	}
	
	//-----------------------------------------------------------
	public function wholesaler_datatable_json(){	
		$tableData = $this->Commonmodel->dataTableData($_GET);
		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["area"]) && !empty($_GET["area"])){
				$filter .= '&area='.$_GET["area"];
			} 
			if(isset($_GET["city"]) && !empty($_GET["city"])){
				$filter .= '&city='.$_GET["city"];
			}
			if(isset($_GET["state"]) && !empty($_GET["state"])){
				$filter .= '&state='.$_GET["state"];
			}
			if(isset($_GET["country"]) && !empty($_GET["country"])){
				$filter .= '&country='.$_GET["country"];
			} 
		}
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'user/getuserbyrole?role=wholesaler&start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 		
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{  
				$isstatus = ($row['is_active'] == 1)? 'checked': ''; 
				$isactive = ($row['is_active'] != 0)? 'true': 'false'; 
				$walletBal = isset($row['wallet_balance'])?$row['wallet_balance']:0;
				$del = '';
				$edit = '';
				$status = '<button class="btn btn-sm btn-danger"><i class="fa fa-remove" ></i> Deleted</button> ';

				if(($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_wholesaler']['is_edit']==1 ) && $row['is_wholesaler_approve']!=2){
					$edit = '<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/users/edit/'.$row['_id'].'/wholesaler').'"> <i class="fa fa-pencil-square-o"></i></a>';
				}
				if($isactive=='true'){
					if(($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_wholesaler']['is_delete']==1) && $row['is_wholesaler_approve']!=2){
					$del = '<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/users/delete/".$row['_id']."/wholesaler").' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>';
					}
					$status ='<input class="tgl_checkbox tgl-ios" data-id="'.$row['_id'].'" id="cb_'.$row['_id'].'" type="checkbox" '.$isstatus.'><label for="cb_'.$row['_id'].'"></label>';
				}
				$orderStatus = 'Recieved: '.$row['order_status']['recieved'].'<br>Delivered: '.$row['order_status']['delivered'].'<br>Cancelled: '.$row['order_status']['cancelled'];
				
				if($row['is_wholesaler_approve']==0){
					$approvemod = '<a title="Approve" class="btn btn-sm btn-success user_approve" href='.base_url($this->model."/users/status/".$row['_id']."/approve").' style="float:left; margin:0px;" onclick="return confirm(\'Do you want to Approve ?\')"> <i class="fa fa-check"></i></a> <a title="Reject"  class="btn btn-sm btn-danger user_reject" href='.base_url($this->model."/users/status/".$row['_id']."/reject").' style="float:right;margin:0px;" onclick="return confirm(\'Do you want to Reject ?\')"> <i class="fa fa-remove"></i></a>';
				}elseif($row['is_wholesaler_approve']==1){
					$approvemod = "Approved";
				}elseif($row['is_wholesaler_approve']==2){
					$approvemod = "Rejected";
				}
				$address = '';
				if($row['is_wholesaler_approve']!=2){
					$address ='<a title="Address" uid="'.$row['_id'].'" class="btn btn-sm btn-info user_address" href="javascript:void(0);"> <i class="fa fa-home"></i></a>';
				}
				$data[]= array(
					++$i, 
					'<a title="Wholesaler Detail" href="'.base_url($this->model.'/users/customer_detail/'.$row['_id'].'').'">'.$row['full_name'].'</a>', 
					isset($row['phone_no'])?$row['phone_no']:' - ',
					'<a title="Add Wallet" data-toggle="modal" data-target="#ajax-modal" class="updateWallet" href="'.base_url($this->model.'/users/add_wallet/'.$row['_id'].'').'">'.$walletBal.'</a>', 
					$orderStatus,
					isset($row['app_version'])?$row['app_version']:'', 
					isset($row['reg_from'])?$row['reg_from']:'',  
					date_time($row['created']),	
					$status,
					$approvemod,		
					$edit.$del.$address
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	}

	//-----------------------------------------------------------
	public function customer(){
		$data['title'] = 'Customer List';
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . "country/index?is_active=1";
		$temp = $this->Commonmodel->getData($url, $authtoken);
		$data['search_country'] = $temp['data']; 
		$data['role'] = $this->session->userdata('role_type');

		$this->load->view('includes/_header', $data);
		$this->load->view('users/customer_list');
		$this->load->view('includes/_footer');
	}	
	//-----------------------------------------------------------
	public function customer_datatable_json(){				   					   
		$tableData = $this->Commonmodel->dataTableData($_GET);
		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["area"]) && !empty($_GET["area"])){
				$filter .= '&area='.$_GET["area"];
			} 
			if(isset($_GET["city"]) && !empty($_GET["city"])){
				$filter .= '&city='.$_GET["city"];
			}
			if(isset($_GET["state"]) && !empty($_GET["state"])){
				$filter .= '&state='.$_GET["state"];
			}
			if(isset($_GET["country"]) && !empty($_GET["country"])){
				$filter .= '&country='.$_GET["country"];
			} 
		}
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'user/getuserbyrole?role=customer&start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 
		///prd($user_data);
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{  
				$isstatus = ($row['is_active'] == 1)? 'checked': ''; 
				$isactive = ($row['is_active'] != 0)? 'true': 'false'; 
				$walletBal = isset($row['wallet_balance'])?$row['wallet_balance']:0;
				$del = '';
				$edit ='';
				$status = '<button class="btn btn-sm btn-danger"><i class="fa fa-remove" ></i> Deleted</button> ';

				if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_customer']['is_edit']==1){
					$edit ='<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/users/edit/'.$row['_id'].'/customer').'"> <i class="fa fa-pencil-square-o"></i></a>';
				}
				if($isactive=='true'){
					if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_customer']['is_delete']==1){
					$del = '<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/users/delete/".$row['_id']."/customer").' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>';
					}
					$status ='<input class="tgl_checkbox tgl-ios" data-id="'.$row['_id'].'" id="cb_'.$row['_id'].'" type="checkbox" '.$isstatus.'><label for="cb_'.$row['_id'].'"></label>';
				}
				$orderStatus = 'Recieved: '.$row['order_status']['recieved'].'<br>Delivered: '.$row['order_status']['delivered'].'<br>Cancelled: '.$row['order_status']['cancelled'];
				$data[]= array(
					++$i, 
					'<a title="Customer Detail" href="'.base_url($this->model.'/users/customer_detail/'.$row['_id'].'').'">'.$row['full_name'].'</a>', 
					isset($row['phone_no'])?$row['phone_no']:' - ',
					'<a title="Add Wallet" data-toggle="modal" data-target="#ajax-modal" class="updateWallet" href="'.base_url($this->model.'/users/add_wallet/'.$row['_id'].'').'">'.$walletBal.'</a>', 
					$orderStatus,
					isset($row['app_version'])?$row['app_version']:'', 
					isset($row['reg_from'])?$row['reg_from']:'',  
					date_time($row['created']),	
					$status,		
					$edit.' '.$del.' <a title="Address" uid="'.$row['_id'].'" class="btn btn-sm btn-info user_address" href="javascript:void(0);"> <i class="fa fa-home"></i></a>'
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	}

	//-----------------------------------------------------------
	public function delivery_boy(){
		$data['title'] = 'Delivery Boy List';
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
		$this->load->view('users/delivery_boy_list');
		$this->load->view('includes/_footer');
	}	
	//-----------------------------------------------------------
	public function delivery_boy_datatable_json(){				   					   
		$tableData = $this->Commonmodel->dataTableData($_GET);
  		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["franchise_id"]) && !empty($_GET["franchise_id"])){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			}
		}
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'user/getuserbyrole?role=delivery_boy&start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 

		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{  
				$isstatus = ($row['is_active'] == 1)? 'checked': ''; 
				$isactive = ($row['is_active'] != 0)? 'true': 'false'; 
				$del = '';
				$edit = '';
				$status = '<button class="btn btn-sm btn-danger"><i class="fa fa-remove" ></i> Deleted</button> ';

				if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_delivery_boy']['is_edit']==1){
					$edit = '<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/users/edit/'.$row['_id'].'/delivery_boy').'"> <i class="fa fa-pencil-square-o"></i></a>';
				}
				if($isactive=='true'){
					if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_delivery_boy']['is_delete']==1){
					$del = '<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/users/delete/".$row['_id']."/delivery_boy").' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>';
					}
					$status ='<input class="tgl_checkbox tgl-ios" data-id="'.$row['_id'].'" id="cb_'.$row['_id'].'" type="checkbox" '.$isstatus.'><label for="cb_'.$row['_id'].'"></label>';
				} 
				$diffAmt = $row['delivery_detail']['deposit'] - $row['delivery_detail']['recieved'];
				$data[]= array(
					++$i, 
					$row['franchiseName'],
					'<a title="Delivery Boy Detail" href="'.base_url($this->model.'/users/delivery_boy_detail/'.$row['_id'].'').'">'.$row['full_name'].'</a>', 
					isset($row['phone_no'])?$row['phone_no']:' - ',
					'<span class="badge badge-primary">
					<i aria-hidden="true" class="fa fa-star"></i> &nbsp; '.$row['rating'].'</span>', 
					number_format($row['delivery_detail']['recieved'],2,'.',''),
					number_format($row['delivery_detail']['deposit'],2,'.',''), 
					number_format($diffAmt,2,'.',''), 
					date_time($row['created']),	
					$status,		
					$edit.''.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	}


	//-----------------------------------------------------------
	public function franchise(){
		$data['title'] = 'Franchise List';
		$this->load->view('includes/_header', $data);
		$this->load->view('users/franchise_list');
		$this->load->view('includes/_footer');
	}	
	//-----------------------------------------------------------	
	public function franchise_datatable_json(){				   					   
		$tableData = $this->Commonmodel->dataTableData($_GET);
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/getuserbyrole?role=franchise&start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{  
				$isstatus = ($row['is_active'] == 1)? 'checked': ''; 
				$isactive = ($row['is_active'] != 0)? 'true': 'false'; 
				$del = '';
				$edit = '';
				$status = '<button class="btn btn-sm btn-danger"><i class="fa fa-remove" ></i> Deleted</button> ';
				
				if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_franchise']['is_edit']==1){
					$edit = '<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/users/edit/'.$row['_id'].'/franchise').'"> <i class="fa fa-pencil-square-o"></i></a>';
				}
				if($isactive=='true'){
					if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_franchise']['is_delete']==1){
					$del = '<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/users/delete/".$row['_id']."/franchise").' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>';
					}
					$status ='<input class="tgl_checkbox tgl-ios" data-id="'.$row['_id'].'" id="cb_'.$row['_id'].'" type="checkbox" '.$isstatus.'><label for="cb_'.$row['_id'].'"></label>';
				}
				 $global='';
				if($row["is_global"]==true){ $global='(Global)'; }
				$data[]= array(
					++$i, 
					'<a title="Franchise Detail" href="'.base_url($this->model.'/users/franchise_detail/'.$row['_id'].'').'">'.$row['franchiseName'].' '.$global.'</a>', 
					$row['full_name'],  
					isset($row['phone_no'])?$row['phone_no']:' - ', 
					date_time($row['created']),	
					($row["is_global"]==false)?$status:' -- ',	
					($row["is_global"]==false)?$edit.''.$del.'':' -- ',	
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	}

	//-----------------------------------------------------------
	public function admin(){
		$data['title'] = 'Admin/Subadmin List';
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

		$url =  $this->config->item('APIURL') . 'roles/getroles';		
		$role_data = $this->Commonmodel->getData($url, $authtoken);
		$RoleType = array('1','3','4','5','6');
		if(@$role_data['success']=='200'){ 
			foreach ($role_data['data'] as $rkey => $rvalue) { 
				if(!in_array($rvalue['role_code'],$RoleType) ){
					$data['role'][] = $rvalue;
				}
			}
		} 
		$this->load->view('includes/_header', $data);
		$this->load->view('users/admin_list');
		$this->load->view('includes/_footer');
	}	
	//-----------------------------------------------------------
	public function admin_datatable_json(){				   					   
		$tableData = $this->Commonmodel->dataTableData($_GET);
  		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["role_id"]) && !empty($_GET["role_id"])){
				$filter .= '&role_id='.$_GET["role_id"];
			}
			if(isset($_GET["franchise_id"]) && !empty($_GET["franchise_id"])){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			}
		}
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/getuserbyrole?role=admin&start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		$user_data = $this->Commonmodel->getData($url, $authtoken); 

		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];

			foreach ($user_data['data']  as $row) 
			{  
				$isstatus = ($row['is_active'] == 1)? 'checked': ''; 
				$isactive = ($row['is_active'] != 0)? 'true': 'false'; 
				$del = ''; 
				$edit = ''; 
				$permission = '';
				$status = '<button class="btn btn-sm btn-danger"><i class="fa fa-remove" ></i> Deleted</button> ';

				if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_admin_subadmin']['is_edit']==1){
					$edit = '<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/users/edit/'.$row['_id'].'/admin').'"> <i class="fa fa-pencil-square-o"></i></a>';
				}
				if($isactive=='true' ){
					if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['user_admin_subadmin']['is_delete']==1){
					$del = '<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/users/delete/".$row['_id']."/admin").' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>';
					}
					if($row['role_type']!=1){
						$status ='<input class="tgl_checkbox tgl-ios" data-id="'.$row['_id'].'" id="cb_'.$row['_id'].'" type="checkbox" '.$isstatus.'><label for="cb_'.$row['_id'].'"></label>';
					}else{
						$status = 'Active';
					}
				if($row['role_type']==2){
					$permission = '<a title="User Permission" class="permission btn btn-sm btn-info" href='.base_url($this->model."/users/manage_permission/".$row['_id']."").'> <i class="fa fa-lock"></i></a>';
				}	
				}
				$data[]= array(
					++$i, 
					isset($row['franchiseName'])?$row['franchiseName']:'--',
					$row['full_name'], 
					isset($row['phone_no'])?$row['phone_no']:' - ', 
					$this->general_roles[$row['role_type']]['title'],
					date_time($row['created']),	
					$status,		
					($row['role_type']!=1)?$edit.$del.$permission.'':''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	}	
	
	//-----------------------------------------------------------
	public function change_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);
	} 

	//-----------------------------------------------------------
	public function add($mode=NULL){
		if($mode=='admin'){
			$utype = 'Admins & Sub Admins';
			$RoleType = array('1','3','4','5');
		}elseif($mode=='franchise'){
			$utype = 'Franchise';
		}elseif($mode=='customer'){
			$utype = 'Customer';
		}elseif($mode=='wholesaler'){
			if($this->general_settings['is_wholesaler']==0){
				$this->session->set_flashdata('errors', "You don't have permission to access page.");
				redirect(base_url($this->model.'/users/'.$mode));
			}
			$utype = 'Wholesaler';	
		}elseif($mode=='delivery_boy'){
			$utype = 'Delivery Boy'; 					
		}else{
			$utype = 'Admins & Sub Admins';
			$RoleType = array('1','3','4','5');
			$mode='admin';
		}	
		$data['mode'] = $mode;
		$data['utype'] = $utype;
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'roles/getroles';		
		$role_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$role_data['success']=='200'){ 
			foreach ($role_data['data'] as $rkey => $rvalue) { 
				if($rvalue['role_code']!=6){
					if($mode=='admin' && !in_array($rvalue['role_code'],$RoleType) ){
						$data['role'][] = $rvalue;
					}elseif($mode=='franchise' && $rvalue['role_code']=='3'){
						$data['role'][] = $rvalue;
					}elseif(($mode=='customer' || $mode=='wholesaler') && $rvalue['role_code']=='4'){
						$data['role'][] = $rvalue;
					}elseif($mode=='delivery_boy' && $rvalue['role_code']=='5'){
						$data['role'][] = $rvalue;	 		
					}	
				}
			}
		}
		if($mode=='delivery_boy' || $mode=='admin'){
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, $authtoken); 
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise_list'] = $franchise_data['data'];
			} 
		}

		if($this->input->post('submit')){
			$this->form_validation->set_rules('role_type', 'Role', 'trim|required');
			$this->form_validation->set_rules('fname', 'Firstname', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('lname', 'Lastname', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('phone_no', 'Mobile', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('password', 'Password', 'trim|required');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required');
			$this->form_validation->set_rules('confirm_pwd', 'Confirm Password', 'trim|required|matches[password]'); 
			if($mode=='admin' || $mode=='franchise'){
				$this->form_validation->set_rules('email', 'Email', 'trim|valid_email|required|strip_tags|xss_clean');
			}
			if ($this->input->post('role_type')=='3')
			{
				$this->form_validation->set_rules('firmname', 'Firm Name', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('ownername', 'Firm Owner', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('ownermobile', 'Firm Owner Mobile', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('contactpersonname', 'Contact Person Name', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('contactpersonmob', 'Contact Person Mobile', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('commission', 'Commission', 'trim|required|strip_tags|xss_clean');
				/*$this->form_validation->set_rules('is_cod', 'Cash On Delivery', 'trim|required|strip_tags|xss_clean');*/
			}
			if ($this->input->post('role_type')=='5' || $this->input->post('role_type')=='10')
			{
				$this->form_validation->set_rules('address', 'Address', 'trim|required|strip_tags|xss_clean');
			}
			if ($this->input->post('role_type')>'2' and $mode=='admin')
			{
				$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|strip_tags|xss_clean');
			}
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				); 
				$data['user'] = array( 
					'role_type' => $this->input->post('role_type'),
					'fname' => $this->input->post('fname'),
					'lname' => $this->input->post('lname'),
					'email' => $this->input->post('email'),
					'phone_no' => $this->input->post('phone_no'),
					'password' =>  $this->input->post('password'),
					'dob' =>  $this->input->post('dob'),
					'is_wholesaler'=>  !empty($this->input->post('is_wholesaler'))?$this->input->post('is_wholesaler'):0,
					'wholesaler_firmname'=>  $this->input->post('wholesaler_firmname'),
					'gst_no'=>  $this->input->post('gst_no'), 
					'refer_code' =>  $this->input->post('refer_code'),
					'friends_code' =>  $this->input->post('friends_code'),
					'wallet_balance' =>  $this->input->post('wallet_balance'),
					'franchise_id' =>  $this->input->post('franchise_id'),
					'is_active' => $this->input->post('is_active'),

					'firmname' => $this->input->post('firmname'),
					'ownername' => $this->input->post('ownername'),
					'ownermobile' => $this->input->post('ownermobile'),
					'contactpersonname' => $this->input->post('contactpersonname'),
					'contactpersonmob' => $this->input->post('contactpersonmob'),
					'commission' => $this->input->post('commission'),
					//'is_cod' => $this->input->post('is_cod'), 
					'isallow_global_product' => $this->input->post('isallow_global_product'),
					'min_order' => $this->input->post('min_order'),
					'min_order_wholesaler' => $this->input->post('min_order_wholesaler'),
					'delivery_chrge' => $this->input->post('delivery_chrge'),
					'accept_minimum_order' => $this->input->post('accept_minimum_order'),
					'delivery_day_after_order' => $this->input->post('delivery_day_after_order'),
					'delivery_max_day' => $this->input->post('delivery_max_day')
				);
				$data['mode'] = $mode;
				$data['utype'] = $utype;
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'roles/getroles';		
				$role_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$role_data['success']=='200'){ 
					foreach ($role_data['data'] as $rkey => $rvalue) { 
						if($rvalue['role_code']!=6){
							if($mode=='admin' && !in_array($rvalue['role_code'],$RoleType) ){
								$data['role'][] = $rvalue;
							}elseif($mode=='franchise' && $rvalue['role_code']=='3'){
								$data['role'][] = $rvalue;
							}elseif(($mode=='customer' || $mode=='wholesaler') && $rvalue['role_code']=='4'){
								$data['role'][] = $rvalue;
							}elseif($mode=='delivery_boy' && $rvalue['role_code']=='5'){
								$data['role'][] = $rvalue; 			
							}	
						}
					}
				}  
				if($mode=='delivery_boy' || $mode=='admin'){
					$url =  $this->config->item('APIURL') . 'franchise/index';		
					$franchise_data = $this->Commonmodel->getData($url, $authtoken); 
					if(@$franchise_data['sucess']=='200'){ 
						$data['franchise_list'] = $franchise_data['data'];
					} 
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('users/user_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data['user'] = array(
					'role_type' => $this->input->post('role_type'),
					'fname' => $this->input->post('fname'),
					'lname' => $this->input->post('lname'),
					'phone_no' => $this->input->post('phone_no'),
					'password' =>  $this->input->post('password'),
					'dob' =>  $this->input->post('dob'),
					'is_wholesaler'=>  !empty($this->input->post('is_wholesaler'))?$this->input->post('is_wholesaler'):0,
					'gst_no'=>  $this->input->post('gst_no'),
					'wholesaler_firmname'=>  $this->input->post('wholesaler_firmname'),
					'reg_from' => 'admin',
					'refer_code' =>  $this->input->post('refer_code'),	
					'friends_code' =>  $this->input->post('friends_code'), 
					'wallet_balance' =>  0,
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);   
				if($mode=='wholesaler'){
					$data['user']['is_wholesaler_approve']=1;
				}
				if($this->input->post('email')!=''){				
					$data['user']['email'] = $this->input->post('email');
				}
				if($this->input->post('franchise_id')!=''){				
					$data['user']['franchise_id'] = $this->input->post('franchise_id');	
				}
				if($mode=='delivery_boy'){
					$data['user']['delivery_detail'] = array('recieved'=>0,'deposit'=>0);
				}
				if($this->input->post('role_type')==3){
					$data['franchise'] = array(
						'firmname' => $this->input->post('firmname'),
						'ownername' => $this->input->post('ownername'),
						'ownermobile' => $this->input->post('ownermobile'),
						'contactpersonname' => $this->input->post('contactpersonname'),
						'contactpersonmob' => $this->input->post('contactpersonmob'),
						'commission' => $this->input->post('commission'),
						//'is_cod' => $this->input->post('is_cod'), 
						'isallow_global_product' => $this->input->post('isallow_global_product'),
						'min_order' => $this->input->post('min_order'),
						'min_order_wholesaler' => $this->input->post('min_order_wholesaler'),
						'delivery_chrge' => $this->input->post('delivery_chrge'),
						'accept_minimum_order' => $this->input->post('accept_minimum_order'),
						'delivery_day_after_order' => $this->input->post('delivery_day_after_order'),
						'delivery_max_day' => $this->input->post('delivery_max_day')
					);
				}
				if($this->input->post('role_type')==5){
					$data['deliveryboy'] = array(
						'address' => $this->input->post('address'),
						'is_active' => $this->input->post('is_active'),	
						'franchiseId' => $this->input->post('franchise_id'),
					);
				}
				 
				if(!empty($_FILES['visiting_card']['name']))
				{    
					$filename = $_FILES["visiting_card"]["tmp_name"];
		        	$request = array('visiting_card' => $this->Commonmodel->getCurlValue($filename, $_FILES["visiting_card"]["type"], $_FILES["visiting_card"]["name"]));  
					$url =  $this->config->item('APIURL') . 'user/uploadvisitingcard/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['user']['visiting_card'] = $result['name'];
					}
				}
				if(!empty($_FILES['img']['name']))
				{    
					$filename = $_FILES["img"]["tmp_name"];
		        	$request = array('user_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["img"]["type"], $_FILES["img"]["name"]));  
					$url =  $this->config->item('APIURL') . 'user/uploadimg/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['user']['img'] = $result['name'];
					}
				}
				if(!empty($_FILES['logo']['name']))
				{    
					$filename = $_FILES["logo"]["tmp_name"];
		        	$request = array('firm_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["logo"]["type"], $_FILES["logo"]["name"]));  
					$url =  $this->config->item('APIURL') . 'user/uploadfirmlogo/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['franchise']['logo'] = $result['name'];
					}
				}
				$data = $this->security->xss_clean($data);

				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'user/save'; 

				$records = $this->Commonmodel->postData($url, $data, $authtoken); 
				 //prd($records);
				if($records['sucess']=='200'){ 
					$this->session->set_flashdata('success','User has been added successfully!');
					if($records['data']['role_type']=='2'){
						redirect(base_url($this->model.'/users/manage_permission/'.$records['data']['_id']));
					}else{ 
						redirect(base_url($this->model.'/users/'.$mode));	
					}
				}else{
					$nerror = ''; 
					if(!empty($records['msg'])){ 
						$nerror = $records['msg']; 
					}elseif(!empty($records['error'])){
						$data = array(
						'errors' => $records['error']
						);
					}
					$data['user'] = array( 
						'role_type' => $this->input->post('role_type'),
						'fname' => $this->input->post('fname'),
						'lname' => $this->input->post('lname'),
						'email' => $this->input->post('email'),
						'phone_no' => $this->input->post('phone_no'),
						'password' =>  $this->input->post('password'),
						'dob' =>  $this->input->post('dob'),
						'is_wholesaler'=>  !empty($this->input->post('is_wholesaler'))?$this->input->post('is_wholesaler'):0,
						'gst_no'=>  $this->input->post('gst_no'), 
						'wholesaler_firmname'=>  $this->input->post('wholesaler_firmname'),
						'refer_code' =>  $this->input->post('refer_code'),
						'friends_code' =>  $this->input->post('friends_code'),
						'wallet_balance' =>  $this->input->post('wallet_balance'),
						'franchise_id' =>  $this->input->post('franchise_id'),
						'is_active' => $this->input->post('is_active'),

						'firmname' => $this->input->post('firmname'),
						'ownername' => $this->input->post('ownername'),
						'ownermobile' => $this->input->post('ownermobile'),
						'contactpersonname' => $this->input->post('contactpersonname'),
						'contactpersonmob' => $this->input->post('contactpersonmob'),
						'commission' => $this->input->post('commission'),
						///'is_cod' => $this->input->post('is_cod'), 
						'isallow_global_product' => $this->input->post('isallow_global_product'),
						'min_order' => $this->input->post('min_order'),
						'min_order_wholesaler' => $this->input->post('min_order_wholesaler'),
						'delivery_chrge' => $this->input->post('delivery_chrge'),
						'accept_minimum_order' => $this->input->post('accept_minimum_order'),
						'delivery_day_after_order' => $this->input->post('delivery_day_after_order'),
						'delivery_max_day' => $this->input->post('delivery_max_day')
					);
					$data['mode'] = $mode;
					$data['utype'] = $utype;
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'roles/getroles';		
					$role_data = $this->Commonmodel->getData($url, $authtoken);
					if(@$role_data['success']=='200'){ 
						foreach ($role_data['data'] as $rkey => $rvalue) { 
							if($rvalue['role_code']!=6){
								if($mode=='admin' && !in_array($rvalue['role_code'],$RoleType) ){
									$data['role'][] = $rvalue;
								}elseif($mode=='franchise' && $rvalue['role_code']=='3'){
									$data['role'][] = $rvalue;
								}elseif(($mode=='customer' || $mode=='wholesaler') && $rvalue['role_code']=='4'){
									$data['role'][] = $rvalue;
								}elseif($mode=='delivery_boy' && $rvalue['role_code']=='5'){
									$data['role'][] = $rvalue;		
								}	
							}
						}
					}  
					if(!empty($data['errors']) && is_array($data['errors'])){
						foreach ($data['errors'] as $key => $value) {
							if(!empty($value[0])){
								foreach ($value as $ekey => $evalue) {
									$nerror.= $evalue['msg'].'<br>';
								}
							}else{
								$nerror.= $value['message'].'<br>';								
							}
						}
					}
					$this->session->set_flashdata('errors', $nerror);
					$this->load->view('includes/_header');
					$this->load->view('users/user_add', $data);
					$this->load->view('includes/_footer');

				}
			}
		}else{

			$data['title'] = 'Add '.$mode.' User'; 
			$this->load->view('includes/_header', $data);
			$this->load->view('users/user_add');
			$this->load->view('includes/_footer');
		}
		
	}

	//-----------------------------------------------------------
	public function edit($id = 0, $mode=null){
		if($mode=='admin'){
			$utype = 'Admins & Sub Admins';
			$RoleType = array('1','3','4','5');
		}elseif($mode=='franchise'){
			$utype = 'Franchise';
		}elseif($mode=='customer'){
			$utype = 'Customer';
		}elseif($mode=='wholesaler'){
			if($this->general_settings['is_wholesaler']==0){
				$this->session->set_flashdata('errors', "You don't have permission to access page.");
				redirect(base_url($this->model.'/users/'.$mode));
			}
			$utype = 'Wholesaler';
		}elseif($mode=='delivery_boy'){
			$utype = 'Delivery Boy'; 			
		}else{
			$utype = 'Admins & Sub Admins';
			$RoleType = array('1','3','4','5');
			$mode='admin';
		}	
		$data['mode'] = $mode;
		$data['utype'] = $utype;
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'roles/getroles';		
		$role_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$role_data['success']=='200'){ 
			foreach ($role_data['data'] as $rkey => $rvalue) { 
				if($rvalue['role_code']!=6){
					if($mode=='admin' && !in_array($rvalue['role_code'],$RoleType) ){
						$data['role'][] = $rvalue;
					}elseif($mode=='franchise' && $rvalue['role_code']=='3'){
						$data['role'][] = $rvalue;
					}elseif(($mode=='customer' || $mode=='wholesaler') && $rvalue['role_code']=='4'){
						$data['role'][] = $rvalue;
					}elseif($mode=='delivery_boy' && $rvalue['role_code']=='5'){
						$data['role'][] = $rvalue;	 		
					}	
				}
			}
		}

		if($this->input->post('submit')){ 
			$this->form_validation->set_rules('role_type', 'Role', 'trim|required');
			$this->form_validation->set_rules('fname', 'Firstname', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('lname', 'Lastname', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('phone_no', 'Mobile', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required');
			if($mode=='admin' || $mode=='franchise'){
				$this->form_validation->set_rules('email', 'Email', 'trim|valid_email|required|strip_tags|xss_clean');
			}
			if ($this->input->post('role_type')=='3')
			{
				$this->form_validation->set_rules('firmname', 'Firm Name', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('ownername', 'Firm Owner', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('ownermobile', 'Firm Owner Mobile', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('contactpersonname', 'Contact Person Name', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('contactpersonmob', 'Contact Person Mobile', 'trim|required|strip_tags|xss_clean');
				$this->form_validation->set_rules('commission', 'Commission', 'trim|required|strip_tags|xss_clean');
				/*$this->form_validation->set_rules('is_cod', 'Cash On Delivery', 'trim|required|strip_tags|xss_clean');*/
			}

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['user'] = array( 
					'_id' => $this->input->post('_id'),
					'role_type' => $this->input->post('role_type'),
					'fname' => $this->input->post('fname'),
					'lname' => $this->input->post('lname'),
					'email' => $this->input->post('email'),
					'is_wholesaler'=>  !empty($this->input->post('is_wholesaler'))?$this->input->post('is_wholesaler'):0,
					'wholesaler_firmname'=>  $this->input->post('wholesaler_firmname'),
					'gst_no'=>  $this->input->post('gst_no'),
					'phone_no' => $this->input->post('phone_no'),
					////'password' =>  $this->input->post('password'),
					'dob' =>  $this->input->post('dob'),
					'refer_code' =>  $this->input->post('refer_code'),
					'friends_code' =>  $this->input->post('friends_code'),
					'wallet_balance' =>  $this->input->post('wallet_balance'),
					'is_active' => $this->input->post('is_active'),

					'firmname' => $this->input->post('firmname'),
					'ownername' => $this->input->post('ownername'),
					'ownermobile' => $this->input->post('ownermobile'),
					'contactpersonname' => $this->input->post('contactpersonname'),
					'contactpersonmob' => $this->input->post('contactpersonmob'),
					'commission' => $this->input->post('commission'),
					///'is_cod' => $this->input->post('is_cod'), 
					'isallow_global_product' => $this->input->post('isallow_global_product'),
					'min_order' => $this->input->post('min_order'),
					'min_order_wholesaler' => $this->input->post('min_order_wholesaler'),
					'delivery_chrge' => $this->input->post('delivery_chrge'),
					'accept_minimum_order' => $this->input->post('accept_minimum_order'),
					'delivery_day_after_order' => $this->input->post('delivery_day_after_order'),
					'delivery_max_day' => $this->input->post('delivery_max_day')
				);
				$data['mode'] = $mode;
				$data['utype'] = $utype;
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'roles/getroles';		
				$role_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$role_data['success']=='200'){ 
					foreach ($role_data['data'] as $rkey => $rvalue) { 
						if($rvalue['role_code']!=6){
							if($mode=='admin' && !in_array($rvalue['role_code'],$RoleType) ){
								$data['role'][] = $rvalue;
							}elseif($mode=='franchise' && $rvalue['role_code']=='3'){
								$data['role'][] = $rvalue;
							}elseif($mode=='customer' && $rvalue['role_code']=='4'){
								$data['role'][] = $rvalue;
							}elseif($mode=='delivery_boy' && $rvalue['role_code']=='5'){
								$data['role'][] = $rvalue;		
							}	
						}
					}
				}  
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
				$records = $this->Commonmodel->getData($url, $authtoken); 
				if($records['sucess']=='200'){
					$data['user'] = $records['data'];
					if($records['data']['role_type']==3){
						$authtoken = $this->session->userdata('authtoken');  
						$url =  $this->config->item('APIURL') . 'franchise/getfranchisebyuserid/'.$id;
						$frecords = $this->Commonmodel->getData($url, $authtoken); 
						if($frecords['sucess']=='200'){
							$data['franchise'] = $frecords['data'][0];
						}
					} 
				} 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('users/user_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data['user'] = array(
					'_id' => $this->input->post('_id'),
					'role_type' => $this->input->post('role_type'),
					'fname' => $this->input->post('fname'),
					'lname' => $this->input->post('lname'),
					'phone_no' => $this->input->post('phone_no'),
					'is_wholesaler'=>  !empty($this->input->post('is_wholesaler'))?$this->input->post('is_wholesaler'):0,
					'wholesaler_firmname'=>  $this->input->post('wholesaler_firmname'),
					'gst_no'=>  $this->input->post('gst_no'),
					///'password' =>  $this->input->post('password'),
					'dob' =>  $this->input->post('dob'),
					'is_active' => $this->input->post('is_active'),
					'modifiedby' =>  $this->session->userdata('admin_id')
				);
				$data['franchise'] = array(
					'firmId' => $this->input->post('firmId'),
					'firmname' => $this->input->post('firmname'),
					'ownername' => $this->input->post('ownername'),
					'ownermobile' => $this->input->post('ownermobile'),
					'contactpersonname' => $this->input->post('contactpersonname'),
					'contactpersonmob' => $this->input->post('contactpersonmob'),
					'commission' => $this->input->post('commission'),
					///'is_cod' => $this->input->post('is_cod'), 
					'isallow_global_product' => $this->input->post('isallow_global_product'),
					'min_order' => $this->input->post('min_order'),
					'min_order_wholesaler' => $this->input->post('min_order_wholesaler'),
					'delivery_chrge' => $this->input->post('delivery_chrge'),
					'accept_minimum_order' => $this->input->post('accept_minimum_order'),
					'delivery_day_after_order' => $this->input->post('delivery_day_after_order'),
					'delivery_max_day' => $this->input->post('delivery_max_day')
				);
				
				if($this->input->post('email')!=''){				
					$data['user']['email'] = $this->input->post('email');	
				}
				if(!empty($_FILES['visiting_card']['name']))
				{    
					$filename = $_FILES["visiting_card"]["tmp_name"];
		        	$request = array('visiting_card' => $this->Commonmodel->getCurlValue($filename, $_FILES["visiting_card"]["type"], $_FILES["visiting_card"]["name"]));  
					$url =  $this->config->item('APIURL') . 'user/uploadvisitingcard/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['user']['visiting_card'] = $result['name'];
					}
				}
				if(!empty($_FILES['img']['name']))
				{    
					$filename = $_FILES["img"]["tmp_name"];
		        	$request = array('user_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["img"]["type"], $_FILES["img"]["name"]));  
					$url =  $this->config->item('APIURL') . 'user/uploadimg/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['user']['img'] = $result['name'];
					}
				} 
				if(!empty($_FILES['logo']['name']))
				{    
					$filename = $_FILES["logo"]["tmp_name"];
		        	$request = array('firm_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["logo"]["type"], $_FILES["logo"]["name"]));  
					$url =  $this->config->item('APIURL') . 'user/uploadfirmlogo/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['franchise']['logo'] = $result['name'];
					}
				}
				$data = $this->security->xss_clean($data);
				/// pr($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'user/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
				
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'User has been updated successfully!');
					redirect(base_url($this->model.'/users/'.$mode));
				}else{
					$nerror = ''; 
					if(!empty($records['msg'])){ 
						$nerror = $records['msg']; 
					}elseif(!empty($records['error'])){
						$data = array(
						'errors' => $records['error']
						);
					}
					$data['user'] = array( 
						'role_type' => $this->input->post('role_type'),
						'fname' => $this->input->post('fname'),
						'lname' => $this->input->post('lname'),
						'email' => $this->input->post('email'), 
						'dob' =>  $this->input->post('dob'),  
						'is_wholesaler'=>  !empty($this->input->post('is_wholesaler'))?$this->input->post('is_wholesaler'):0,
						'gst_no'=>  $this->input->post('gst_no'),
						'wholesaler_firmname'=>  $this->input->post('wholesaler_firmname'),
						'refer_code' =>  $this->input->post('refer_code'),
						'friends_code' =>  $this->input->post('friends_code'),
						'is_active' => $this->input->post('is_active'),

						'firmname' => $this->input->post('firmname'),
						'ownername' => $this->input->post('ownername'),
						'ownermobile' => $this->input->post('ownermobile'),
						'contactpersonname' => $this->input->post('contactpersonname'),
						'contactpersonmob' => $this->input->post('contactpersonmob'),
						'commission' => $this->input->post('commission'),
						///'is_cod' => $this->input->post('is_cod'), 
					);
					$data['mode'] = $mode;
					$data['utype'] = $utype;
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'roles/getroles';		
					$role_data = $this->Commonmodel->getData($url, $authtoken);
					if(@$role_data['success']=='200'){ 
						foreach ($role_data['data'] as $rkey => $rvalue) { 
							if($rvalue['role_code']!=6){
								if($mode=='admin' && !in_array($rvalue['role_code'],$RoleType) ){
									$data['role'][] = $rvalue;
								}elseif($mode=='franchise' && $rvalue['role_code']=='3'){
									$data['role'][] = $rvalue;
								}elseif($mode=='customer' && $rvalue['role_code']=='4'){
									$data['role'][] = $rvalue;
								}elseif($mode=='delivery_boy' && $rvalue['role_code']=='5'){
									$data['role'][] = $rvalue;	 			
								}	
							}
						}
					}  

					if(!empty($data['errors']) && is_array($data['errors'])){
						foreach ($data['errors'] as $key => $value) {
							if(!empty($value[0])){
								foreach ($value as $ekey => $evalue) {
									$nerror.= $evalue['msg'].'<br>';
								}
							}else{
								$nerror.= $value['message'].'<br>';								
							}
						}
					}
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
					$records = $this->Commonmodel->getData($url, $authtoken); 

					if($records['sucess']=='200'){
						$data['user'] = $records['data'];
						if($records['data']['role_type']==3){
							$authtoken = $this->session->userdata('authtoken');  
							$url =  $this->config->item('APIURL') . 'franchise/getfranchisebyuserid/'.$id;
							$frecords = $this->Commonmodel->getData($url, $authtoken); 
							if($frecords['sucess']=='200'){
								$data['franchise'] = $frecords['data'][0];
							}
						} 
					} 
					$this->session->set_flashdata('errors', $nerror);
					$this->load->view('includes/_header');
					$this->load->view('users/user_edit', $data);
					$this->load->view('includes/_footer');
				}
			}
		}else{
			$data['title'] = 'Edit '.$mode.' User'; 
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken); 
			if($records['sucess']=='200'){
				$data['user'] = $records['data'];
				if($records['data']['role_type']==3){
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'franchise/getfranchisebyuserid/'.$id;
					$frecords = $this->Commonmodel->getData($url, $authtoken);  
					if($frecords['sucess']=='200'){
						$data['franchise'] = $frecords['data'][0];
					}
				} 
			} 
			//prd($data);
			if($mode=='franchise'){
				if(isset($data['franchise']['is_global']) && $data['franchise']['is_global']==false){
					$this->load->view('includes/_header', $data);
					$this->load->view('users/user_edit', $data);
					$this->load->view('includes/_footer');
				}else{
					redirect(base_url($this->model.'/users/franchise'));
				}
			}else{
				$this->load->view('includes/_header', $data);
				$this->load->view('users/user_edit', $data);
				$this->load->view('includes/_footer');
			}
			
		}
	}
	//-----------------------------------------------------------
	public function convert($id, $mode)
	{	 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/changestatus';
		
		$data = array('_id'=> $id,'is_wholesaler'=>$mode);
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	

		if($records['sucess']=='200'){ 	 
			if($mode==0){
				$this->session->set_flashdata('success', 'User has convert into Customer!'); 
			}elseif($mode==1){
				$this->session->set_flashdata('success', 'User has convert into Wholesaler!'); 
			}
			if($mode==0){
				redirect(base_url($this->model.'/users/customer'));
			}else{
				redirect(base_url($this->model.'/users/wholesaler'));	
			}
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			if($mode==0){
				redirect(base_url($this->model.'/users/wholesaler'));
			}else{
				redirect(base_url($this->model.'/users/customer'));	
			}
		}
	}	
	//-----------------------------------------------------------
	public function status($id, $mode)
	{	$status=0; 
		if($mode=='approve'){
			$status=1;
		}elseif($mode=='reject'){
			$status=2;
		}
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/wholesalerstatus';
		
		$data = array('_id'=> $id,'is_wholesaler_approve'=>$status);
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	

		if($records['sucess']=='200'){ 	 
			if($mode==1){
				$this->session->set_flashdata('success', 'User has been Approve successfully!'); 
			}elseif($mode==2){
				$this->session->set_flashdata('success', 'User has been Reject successfully!'); 
			}
			redirect(base_url($this->model.'/users/wholesaler'));
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			redirect(base_url($this->model.'/users/wholesaler'));
		}
	}
	//-----------------------------------------------------------
	public function delete($id = 0, $mode='admin')
	{	 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/status';
		$data = array('_id'=> $id,'is_active'=>'0');
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	 
		/// print_r($records); exit;
		if($records['sucess']=='200'){ 	 
			$this->session->set_flashdata('success', 'User has been deleted successfully!');
			if($mode=='admin'){
				redirect(base_url($this->model.'/users/admin'));
			}elseif($mode=='franchise'){
				redirect(base_url($this->model.'/users/franchise'));
			}elseif($mode=='customer'){
				redirect(base_url($this->model.'/users/customer'));
			}elseif($mode=='delivery_boy'){
				redirect(base_url($this->model.'/users/delivery_boy')); 	
			}elseif($mode=='wholesaler'){
				redirect(base_url($this->model.'/users/wholesaler'));
			}			
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			if($mode=='admin'){
				redirect(base_url($this->model.'/users/admin'));
			}elseif($mode=='franchise'){
				redirect(base_url($this->model.'/users/franchise'));
			}elseif($mode=='customer'){
				redirect(base_url($this->model.'/users/customer'));
			}elseif($mode=='delivery_boy'){
				redirect(base_url($this->model.'/users/delivery_boy')); 
			}elseif($mode=='wholesaler'){
				redirect(base_url($this->model.'/users/wholesaler'));
			}
		}
	} 

	//-----------------------------------------------------------
	function add_wallet($id = null){
		$data['title'] = 'Customer List'; 
		$data['_id'] = $id;
		$this->load->view('users/add_wallet', $data); 
	} 

	//-----------------------------------------------------------
	function update_wallet(){ 
		$data = array(
					'_id' => $this->input->post('_id'),
					'wallet_balance' => $this->input->post('wallet_balance'),
					'ttype' => $this->input->post('ttype'),
					'description' => $this->input->post('description'), 
					'is_admin' => 0
				);
		$data = $this->security->xss_clean($data); 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/updatewalletbalance'; 
		$records = $this->Commonmodel->postData($url, $data, $authtoken);
		echo json_encode($records); exit; 
	} 

	//-----------------------------------------------------------
	function customer_detail($id = null){
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
		$customer = $this->Commonmodel->getData($url, $authtoken);	
		if($customer['sucess']=='200'){
			$data['customer'] = $customer['data'];
		} 
		$data['myReferer'] = [];
		if(!empty($data['customer']['friends_code'])){
			$url =  $this->config->item('APIURL') . 'user/getmyreferer/'.$data['customer']['friends_code'];
			$myReferer = $this->Commonmodel->getData($url, $authtoken);	
			if($myReferer['sucess']=='Success'){
				$data['myReferer'] = $myReferer['data'];
			} 
		}
		////prd($data);
		$data['id'] = $id;
		$data['title'] = 'Customer Detail';
		$data['role'] = $this->session->userdata('role_type');
		
		$this->load->view('includes/_header');
		$this->load->view('users/customer_detail',$data);
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	function walletlog_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'walletlog/gethistory/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{  
				$isstatus = ($row['is_active'] == 1)? 'checked': ''; 				 
				$data[]= array(
					++$i,  
					$row['description'], 
					($row['transaction']==1)?'Credit':'Debit',
					isset($row['wallet_amount'])?number_format($row['wallet_amount'],2,'.',''):' 0 ', 
					isset($row['current_wallet'])?number_format($row['current_wallet'],2,'.',''):' 0 ', 
					isset($row['updated_wallet'])?number_format($row['updated_wallet'],2,'.',''):' 0 ',  
					date_time($row['date']),	
					date_time($row['expire_on']),	 
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	}

	//-----------------------------------------------------------
	function orderlog_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'order/getuserorders/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		 
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{   
				$payMethod = $this->config->item('payMethod')[$row['payment_method']]; 		
				$status = $this->config->item('OrderStatus')[$row['is_active']]; 		 
				$data[]= array(
					++$i,  
					number_format($row['total'],2,'.',''), 
					$row['delivery_charge'],
					isset($row['tax_percent'])?$row['tax_percent']:' -- ', 
					isset($row['discount'])?$row['discount']:' -- ', 
					isset($row['key_wallet_balance'])?$row['key_wallet_balance']:' -- ',  
					isset($row['final_total'])?number_format($row['final_total'],2,'.',''):' -- ', 
					$payMethod, 
					isset($row['franchiseName'])?$row['franchiseName']:' -- ',
					date_time($row['created']),	
					$status,	 
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	}
	
	//-----------------------------------------------------------
	function friendlog_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/getmyfriends/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{   				 		 
				$data[]= array(
					++$i,  
					$row['fname'].' '.$row['lname'], 
					$row['phone_no'],
					($row['wallet_balance'] != null && $row['wallet_balance'] != "")?number_format($row['wallet_balance'],2,'.',''):"0.00"	 
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	}

	//-----------------------------------------------------------
	function franchise_detail($id = null){
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/getuserbyid/'.$id;
		$franchise = $this->Commonmodel->getData($url, $authtoken);	
		if($franchise['sucess']=='200'){
			$data['franchise'] = $franchise['data'];
		} 
		///echo "<pre>"; print_r($data['franchise']); exit;
		$data['id'] = $id;
		$data['title'] = 'Franchise Detail';
		$this->load->view('includes/_header');
		$this->load->view('users/franchise_detail',$data);
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	function franchiseareas_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'franchise/getfrareas/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{   	
				$status = ($row['is_active'] == '1')? 'checked': '';					  		 
				$data[]= array(
					++$i,  
					!empty($row['area']['title'])?$row['area']['title']:'', 
					!empty($row['city']['title'])?$row['city']['title']:'',
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					data-ftype="area"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',	 
					($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete" data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="area" title="Delete" > <i class="fa fa-trash-o"></i></a><span>':'<span id="deb_'.$row['_id'].'"></span>' 
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	}
	//-----------------------------------------------------------
	function franchisecategory_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'franchise/getfranchisecat/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];

			foreach ($user_data['data']  as $row) 
			{   		
				$status = ($row['is_active'] == 1)? 'checked': '';					 		 
				$data[]= array(
					++$i,  
					!empty($row['Cats']['title'])?$row['Cats']['title']:'',
					!empty($row['mainCat']['title'])?$row['mainCat']['title']:'',
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					data-ftype="category"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',	 
					($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete" data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="category" title="Delete" > <i class="fa fa-trash-o"></i></a><span>':'<span id="deb_'.$row['_id'].'"></span>' 
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	}
	//-----------------------------------------------------------
	function franchiseproduct_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'product/getfranchiseproducts/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{   		
				$status = ($row['is_active'] == 1)? 'checked': '';	
				$productvariants = "<table class='table table-bordered table-striped dataTable no-footer' width='100%'><tr><th>#</th><th>Unit</th><th>Wholesale</th><th>Price</th> <th>Mrp</th><th>Stock</th><th>Status</th></tr>";
				$kk=1;
				foreach ($row['productvariants'] as $pvkey => $pvvalue) {
					if($pvvalue['is_active']==1){ $pvstatus='Available'; }elseif($pvvalue['is_active']==2){ $pvstatus='Not Available'; }elseif($pvvalue['is_active']==3){ $pvstatus='Sold'; }
					$productvariants.= "<tr>";
					$productvariants.= "<td>".$kk."</td>";
					$productvariants.= "<td>".$pvvalue['measurment'].@$this->config->item('units')[$pvvalue['unit']]."</td>";
					$productvariants.= "<td>".$pvvalue['wholesale']."</td>";
					$productvariants.= "<td>".$pvvalue['price']."</td>";
					$productvariants.= "<td>".@$pvvalue['mrp']."</td>";
					$productvariants.= "<td>".$pvvalue['qty']."</td>";
					$productvariants.= "<td>".$pvstatus."</td>";
					$productvariants.= "</tr>"; 
					$kk++;
				}	
				$productvariants.= "</table>";	 		 
				$data[]= array(
					++$i,  
					!empty($row['product']['title'])?'<a href="'.base_url($this->model.'/users/updatefranchisevarient/'.$row['_id'].'/'.$id).'">'.$row['product']['title'].'</a><br>'.$productvariants.'':'',
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					data-ftype="product"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',	 
					($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>'  
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	}

	//-----------------------------------------------------------
	public function change_franchisedetail_status(){   
		$authtoken = $this->session->userdata('authtoken');
		$data = $this->input->post();
		$ftype = $this->input->post('ftype');
		if($ftype=='area'){
			if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_area']['is_delete']) && $this->general_user_premissions['franchise_area']['is_delete']==0)){ 
				$records['msg'] = "You don't have permission to access page.";
				echo json_encode($records);
				return false;
			}
			$url =  $this->config->item('APIURL') . 'franchise/frareastatus';
		}elseif($ftype=='category'){
			if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_category']['is_delete']) && $this->general_user_premissions['franchise_category']['is_delete']==0)){ 
				$records['msg'] = "You don't have permission to access page.";
				echo json_encode($records);
				return false;
			}
			$url =  $this->config->item('APIURL') . 'franchise/frcatstatus';
		}elseif($ftype=='product'){
			if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_product']['is_delete']) && $this->general_user_premissions['franchise_product']['is_delete']==0)){ 
				$records['msg'] = "You don't have permission to access page.";
				echo json_encode($records);
				return false;
			}
			$url =  $this->config->item('APIURL') . 'product/franchiseproductstatus';	
		}
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array(); 
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	} 
	//-----------------------------------------------------------
	public function franchisearea($id=null){		 
		if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_area']['is_add']) && $this->general_user_premissions['franchise_area']['is_add']==0)){ 
			$this->session->set_flashdata('errors', "You don't have permission to access page.");
			redirect(base_url($this->model.'/users/franchise'));
		}
		$data['title'] = 'Areas'; 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
		$country_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$country_data['sucess']=='200'){ 
			$data['country'] = $country_data['data'];
		}
		$url =  $this->config->item('APIURL') . 'franchise/edit/'.$id;
		$franchise = $this->Commonmodel->getData($url, $authtoken);	
		if($franchise['sucess']=='200'){
			$data['franchise'] = $franchise['data'];
			///$fid = $franchise['data']['userId'];
		} 
		$data['id'] = $id; 
		$this->load->view('includes/_header', $data);
		$this->load->view('users/user_franchisearea', $data);
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function updatefranchisearea(){
		$authtoken = $this->session->userdata('authtoken');
		$data = $this->input->post();
		$ftype = $this->input->post('type');
		$farea = $this->input->post('areaId');
		$ffranchise = $this->input->post('franchiseId');
		if($ftype=='save'){
			$url =  $this->config->item('APIURL') . 'franchise/savefrarea';
			$records = $this->Commonmodel->postData($url, $data, $authtoken);
		}elseif($ftype=='delete'){
			$url =  $this->config->item('APIURL') . 'franchise/deletefrarea/'.$ffranchise.'/'.$farea;
			$records = $this->Commonmodel->deleteData($url, $authtoken);
		} 
		$data = array(); 
		echo json_encode($records);		
	}
	//-----------------------------------------------------------
	public function franchisecategories($id=null){
		if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_category']['is_add']) && $this->general_user_premissions['franchise_category']['is_add']==0)){ 
			$this->session->set_flashdata('errors', "You don't have permission to access page.");
			redirect(base_url($this->model.'/users/franchise'));
		}
		$data['title'] = 'Categories'; 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'franchise/getfranchisecat/'.$id;		
		$francatagory_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$francatagory_data['sucess']=='200'){ 
			$data['francatagory'] = $francatagory_data['data'];
		}
		$frCats =[];
		foreach ($data['francatagory'] as $fkey => $fvalue) {
			if($fvalue['frCats']['is_active']==1){
				$frCats[] = $fvalue['frCats']['catId'];
			}
		}
		$data['frCats'] = $frCats;
		$url =  $this->config->item('APIURL') . 'franchise/edit/'.$id;
		$franchise = $this->Commonmodel->getData($url, $authtoken);	
		if($franchise['sucess']=='200'){
			$data['franchise'] = $franchise['data'];
		} 
		/// get all category
		$url =  $this->config->item('APIURL') . 'catagory/getallcatlist/';		
		$catagory_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$catagory_data['sucess']=='200'){ 
			$data['catagory'] = $catagory_data['data'];
		}
		$data['id'] = $id;
		$this->load->view('includes/_header', $data);
		$this->load->view('users/user_franchisecategories', $data);
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function updatefranchisecategory(){
		$authtoken = $this->session->userdata('authtoken');
		$data = $this->input->post();
		$ftype = $this->input->post('type'); 
		$ffranchise = $this->input->post('franchiseId');
		if($ftype=='save'){
			$data['is_active'] = "1";
			$url =  $this->config->item('APIURL') . 'franchise/savefrcats';
			$records = $this->Commonmodel->postData($url, $data, $authtoken);
		}elseif($ftype=='delete'){
			$data['is_active'] = "2";
			$url =  $this->config->item('APIURL') . 'franchise/savefrcats';
			$records = $this->Commonmodel->postData($url, $data, $authtoken);
		} 
		$data = array(); 
		echo json_encode($records);		
	} 

	//-----------------------------------------------------------
	public function franchiseproducts($id=null){
		if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_product']['is_add']) && $this->general_user_premissions['franchise_product']['is_add']==0)){ 
			$this->session->set_flashdata('errors', "You don't have permission to access page.");
			redirect(base_url($this->model.'/users/franchise'));
		}
		$data['title'] = 'Products'; 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'franchise/edit/'.$id;
		$franchise = $this->Commonmodel->getData($url, $authtoken);	
		$userId = '';
		$isglobal = 0;
		if($franchise['sucess']=='200'){
			$data['franchise'] = $franchise['data'];
			$fuserId = $franchise['data']['userId'];
			$isglobal = $franchise['data']['is_global'];
		} 
		$url =  $this->config->item('APIURL') . 'franchise/getfranchisecatlist/'.$id;		 
		$catagory_data = $this->Commonmodel->getData($url, $authtoken); 
		if(@$catagory_data['sucess']=='200'){ 
			foreach($catagory_data['data'] as $cdata => $cvale){
				$data['catagory'][] = $cvale['Cats'];
			}
		} 
		$data['id'] = $id;		

		if($this->input->post('submit')){ 
			$this->form_validation->set_rules('categoryId', 'Category', 'trim|required');
			$this->form_validation->set_rules('productId', 'Product', 'trim|required');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required');
			$this->form_validation->set_rules('product_quality', 'Product Quality', 'trim|required');
			$this->form_validation->set_rules('product_max_order', 'Product Max Order', 'trim|required');
			$this->form_validation->set_rules('product_unit', 'Product Unit', 'trim|required');
			$this->form_validation->set_rules('is_varient', 'Product Varient', 'trim|required');
			 
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['frepro'] = array(  
						'categoryId' => $this->input->post('categoryId'),
						'productId' => $this->input->post('productId'),
						'is_active' => $this->input->post('is_active'),
						'product_quality' => $this->input->post('product_quality'),
						'product_max_order' => $this->input->post('product_max_order'),
						'product_unit' => $this->input->post('product_unit'), 
					); 
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'franchise/edit/'.$id;
				$franchise = $this->Commonmodel->getData($url, $authtoken);	
				if($franchise['sucess']=='200'){
					$data['franchise'] = $franchise['data'];
				} 
				$url =  $this->config->item('APIURL') . 'catagory/getcatlist/';		
				$catagory_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$catagory_data['sucess']=='200'){ 
					$data['catagory'] = $catagory_data['data'];
				} 
				$data['title'] = 'Products'; 
				$data['id'] = $id;
				///prd($data);
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('users/user_franchiseproducts', $data);
				$this->load->view('includes/_footer');
			}else{
				$varient = $this->input->post('varient');
				$oldvarient = $this->input->post('oldvarient');
				$provarient = [];
				$prooldvarient = [];
				$data = array(  
						'franchiseId'=> $this->input->post('franchiseId'),
						'catId' => $this->input->post('categoryId'), 
						'productId' => $this->input->post('productId'),
						'product_quality' => $this->input->post('product_quality'),
						'product_max_order' => $this->input->post('product_max_order'),
						'product_unit' => $this->input->post('product_unit'),
						'is_active' => $this->input->post('is_active'), 
						'isShown' => $this->input->post('isShown'),
						'createdby' => $this->session->userdata('admin_id'),
						'isPacket' => $this->input->post('isPacket'),
						'modifiedby' => $this->session->userdata('admin_id'),
					); 
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'product/savefranchiseproduct';		
				$prorecords = $this->Commonmodel->postData($url, $data, $authtoken);
				if($prorecords['sucess']=='200'){ 
					$data = array(  
						'_franchiseId'=> $this->input->post('franchiseId'),
						'_categoryId' => $this->input->post('categoryId'), 
						'_frproductId' => $prorecords['data']['_id'], 
						'productId' => $this->input->post('productId'),
						'product_quality' => $this->input->post('product_quality'),
						'product_max_order' => $this->input->post('product_max_order'),
						'product_unit' => $this->input->post('product_unit'),
						'is_active' => $this->input->post('is_active'), 
						'isShown' => $this->input->post('isShown'),
						'createdby' => $this->session->userdata('admin_id'),
						'isPacket' => $this->input->post('isPacket'),
						'modifiedby' => $this->session->userdata('admin_id'),
					); 
				}
				if(!empty($varient)){
					foreach ($varient as $key => $value) {
						$provarient[] = $value;
					}
				}
				if(!empty($oldvarient)){
					foreach ($oldvarient as $key => $value) {
						$prooldvarient[] = $value;
					}
				}
				$data['varientRows'] = $provarient;
				$data['oldvarientRows'] = $prooldvarient;
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'product/updatefranchisevarient';		
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
				// Update franchise product if isglobal true
				if($isglobal==1){ 
					// get all franchise product list
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'franchise/allfranchise';		
					$allfranchise = $this->Commonmodel->getData($url, $authtoken);
					if(!empty($allfranchise['data'])){
						foreach ($allfranchise['data'] as $fkey => $fvalue) {
							if($fvalue['isallow_global_product']==true){
								$provarient = [];
								$prooldvarient = [];
								$data = array(  
										'franchiseId'=> $fvalue['_id'],
										'catId' => $this->input->post('categoryId'), 
										'productId' => $this->input->post('productId'),
										'product_quality' => $this->input->post('product_quality'),
										'product_max_order' => $this->input->post('product_max_order'),
										'product_unit' => $this->input->post('product_unit'),
										'is_active' => $this->input->post('is_active'), 
										'isShown' => $this->input->post('isShown'),
										'createdby' => $this->session->userdata('admin_id'),
										'isPacket' => $this->input->post('isPacket'),
										'modifiedby' => $this->session->userdata('admin_id'),
									); 
								$authtoken = $this->session->userdata('authtoken');  
								$url =  $this->config->item('APIURL') . 'product/savefranchiseproduct';		
								$prorecords = $this->Commonmodel->postData($url, $data, $authtoken);
								if($prorecords['sucess']=='200'){ 
									$data = array(  
										'_franchiseId'=> $fvalue['_id'],
										'_categoryId' => $this->input->post('categoryId'), 
										'_frproductId' => $prorecords['data']['_id'], 
										'productId' => $this->input->post('productId'),
										'product_quality' => $this->input->post('product_quality'),
										'product_max_order' => $this->input->post('product_max_order'),
										'product_unit' => $this->input->post('product_unit'),
										'is_active' => $this->input->post('is_active'), 
										'isShown' => $this->input->post('isShown'),
										'createdby' => $this->session->userdata('admin_id'),
										'isPacket' => $this->input->post('isPacket'),
										'modifiedby' => $this->session->userdata('admin_id'),
									); 
								}
								if(!empty($varient)){
									foreach ($varient as $key => $value) {
										$provarient[] = $value;
									}
								}
								if(!empty($oldvarient)){
									foreach ($oldvarient as $key => $value) {
										$prooldvarient[] = $value;
									}
								}
								$data['varientRows'] = $provarient;
								$data['oldvarientRows'] = $prooldvarient; 
								$authtoken = $this->session->userdata('authtoken');  
								$url =  $this->config->item('APIURL') . 'product/updatefranchisevarient'; 
								$records = $this->Commonmodel->postData($url, $data, $authtoken);
							}
						}
					}
				}
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Franchise Products has been updated successfully!');
					redirect(base_url($this->model.'/users/franchise_detail/'.$fuserId));
				} 
			}
		}else{
			$this->load->view('includes/_header', $data);
			$this->load->view('users/user_franchiseproducts', $data);
			$this->load->view('includes/_footer');
		}
	}
	//-----------------------------------------------------------
	public function getfranchiseproductsbycats(){ 
		$categoryid = $this->input->post('category_id'); 
		///$franchiseId = $this->input->post('franchiseId'); 
		$isglobal =  ($this->input->post('isglobal'))?$this->input->post('isglobal'):0; 
		$authtoken = $this->session->userdata('authtoken'); 
		if(!empty($categoryid)){
			$url =  $this->config->item('APIURL').'product/getlistedproductsbycats/'.$categoryid.'/'.$isglobal;
			$records = $this->Commonmodel->getData($url, $authtoken);	
			$product = '';   
			///echo "<pre>"; print_r($records); exit;
			if($records['sucess']=='200'){ 
				$product = '<option value="">Select Products</option>';
				foreach($records['data'] as $row){
					$product.= '<option value="'.$row["_id"].'">'.$row["title"].'</option> ';
				} 
			}
			echo $product;
		}else{
			if(empty($mode)){ echo $product = '<option value="">Select Products</option>'; }
		} 
	}
	//-----------------------------------------------------------
	public function updatefranchisevarient($id=null, $fid=null){
		if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['franchise_product']['is_edit']) && $this->general_user_premissions['franchise_product']['is_edit']==0)){ 
			redirect(base_url($this->model.'/users/franchise'));
		}
		$data['title'] = 'Products'; 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'franchise/edit/'.$fid;
		$franchise = $this->Commonmodel->getData($url, $authtoken);	
		$fuserId = '';
		$isglobal = 0;
		if($franchise['sucess']=='200'){
			$data['franchise'] = $franchise['data'];
			$fuserId = $franchise['data']['userId'];
			$isglobal = $franchise['data']['is_global'];
		} 
		$url =  $this->config->item('APIURL') . 'catagory/getcatlist/';		
		$catagory_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$catagory_data['sucess']=='200'){ 
			$data['catagory'] = $catagory_data['data'];
		} 
		$data['fid'] = $fid;
		$data['id'] = $id;	
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'product/editfranchiseproduct/'.$id;
		$fraproducts = $this->Commonmodel->getData($url, $authtoken);
		if(@$catagory_data['sucess']=='200'){ 
			$data['fraproducts'] = $fraproducts['data'];
			$productId = $fraproducts['data']['productId']; 
			$url =  $this->config->item('APIURL') . 'product/edit/'.$productId;
			$precords = $this->Commonmodel->getData($url, $authtoken);
			if($precords['sucess']=='200'){
				$data['procode'] = isset($precords['data'][0]['procode'])?$precords['data'][0]['procode']:'';
			}
		} 
		///prd($data);
		/* get product varient */
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'product/getfranchiseproductvarient/'.$id;
		$fraproductvarient = $this->Commonmodel->getData($url, $authtoken);
		if(@$catagory_data['sucess']=='200'){ 
			$data['fraproductvarient'] = $fraproductvarient['data'];
		} 
		/*'product/getfranchiseproductvarient'*/
		if($this->input->post('submit')){ 
			$this->form_validation->set_rules('categoryId', 'Category', 'trim|required');
			$this->form_validation->set_rules('productId', 'Product', 'trim|required');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required');
			$this->form_validation->set_rules('product_quality', 'Product Quality', 'trim|required');
			$this->form_validation->set_rules('product_max_order', 'Product Max Order', 'trim|required');
			$this->form_validation->set_rules('product_unit', 'Product Unit', 'trim|required');
			$this->form_validation->set_rules('is_varient', 'Product Varient', 'trim|required');
			 
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['fraproducts'] = array(  
						'catId' => $this->input->post('categoryId'),
						'categoryId' => $this->input->post('categoryId'),
						'productId' => $this->input->post('productId'),
						'isPacket' => $this->input->post('isPacket'),
						'frproductId'=> $this->input->post('frproductId'),
						'is_active' => $this->input->post('is_active'),
						'isShown' => $this->input->post('isShown'),
						'product_quality' => $this->input->post('product_quality'),
						'product_max_order' => $this->input->post('product_max_order'),
						'product_unit' => $this->input->post('product_unit'), 
					); 
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'franchise/edit/'.$fid;
				$franchise = $this->Commonmodel->getData($url, $authtoken);	
				if($franchise['sucess']=='200'){
					$data['franchise'] = $franchise['data'];
				} 
				$url =  $this->config->item('APIURL') . 'catagory/getcatlist/';		
				$catagory_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$catagory_data['sucess']=='200'){ 
					$data['catagory'] = $catagory_data['data'];
				} 
				/* get product varient */
				$authtoken = $this->session->userdata('authtoken'); 
				$url =  $this->config->item('APIURL') . 'product/getfranchiseproductvarient/'.$id;
				$fraproductvarient = $this->Commonmodel->getData($url, $authtoken);
				if(@$catagory_data['sucess']=='200'){ 
					$data['fraproductvarient'] = $fraproductvarient['data'];
				} 
				$data['title'] = 'Products'; 
				$data['fid'] = $fid;
				$data['id'] = $id;
				///print_r($data); exit;				
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('users/user_updatefranchisevarient', $data);
				$this->load->view('includes/_footer');
			}else{
				$varient = $this->input->post('varient');
				$oldvarient = $this->input->post('oldvarient');
				$provarient = [];
				$prooldvarient = []; 
				$data = array(  
					'_id'=> $this->input->post('frproductId'),
					'franchiseId'=> $this->input->post('franchiseId'),
					'productId'=> $this->input->post('productId'),
					'catId'=> $this->input->post('categoryId'),					
					'_franchiseId'=> $this->input->post('franchiseId'),
					'_categoryId' => $this->input->post('categoryId'), 
					'_frproductId' => $this->input->post('frproductId'), 
					'productId' => $this->input->post('productId'),
					'product_quality' => $this->input->post('product_quality'),
					'product_max_order' => $this->input->post('product_max_order'),
					'product_unit' => $this->input->post('product_unit'),
					'is_active' => $this->input->post('is_active'), 
					'isShown' => $this->input->post('isShown'),
					'createdby' => $this->session->userdata('admin_id'),
					'isPacket' => $this->input->post('isPacket'),
					'modifiedby' => $this->session->userdata('admin_id'),
				);  
				if(!empty($varient)){
					foreach ($varient as $key => $value) {
						$provarient[] = $value;
					}
				}
				if(!empty($oldvarient)){
					foreach ($oldvarient as $key => $value) {
						$prooldvarient[] = $value;
					}
				}
				$data['varientRows'] = $provarient;
				$data['oldvarientRows'] = $prooldvarient;
				 
				/// Update franchise product Product 
				$url =  $this->config->item('APIURL') . 'product/editfranchiseproduct/'.$id;
				$updatefraproduct = $this->Commonmodel->postData($url, $data, $authtoken);
				if(isset($updatefraproduct['err']) && $updatefraproduct['err']==409){
					$this->session->set_flashdata('error', $updatefraproduct['msg']);
					redirect(base_url($this->model.'/users/franchise_detail/'.$fuserId));
				}else{
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'product/updatefranchisevarient';		
					$records = $this->Commonmodel->postData($url, $data, $authtoken);
					if($records['sucess']=='200'){
						$this->session->set_flashdata('success', 'Franchise Products has been updated successfully!');
						redirect(base_url($this->model.'/users/franchise_detail/'.$fuserId));
					}
				}
			}
		}else{
			$this->load->view('includes/_header', $data);
			$this->load->view('users/user_updatefranchisevarient', $data);
			$this->load->view('includes/_footer');
		} 

	}


	public function manage_permission($id){  
		if($this->session->userdata('role_type')=='2'  && (isset($this->general_user_premissions['user_admin_subadmin']['is_add']) && $this->general_user_premissions['user_admin_subadmin']['is_add']==0 && $this->general_user_premissions['user_admin_subadmin']['is_edit']==0)){ 
			$this->session->set_flashdata('errors', "You don't have permission to access page.");
			redirect(base_url($this->model.'/users/admin'));
		}		
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
		$records = $this->Commonmodel->getData($url, $authtoken); 
		if($records['sucess']=='200'){ 
			$userdetail = $records['data'];
			if($records['data']['role_type']!=2){
				$this->session->set_flashdata('errors', "invalid access");
				redirect('users/admin');
			}
		} 
		$userperm ='';
		$allmodule ='';
		$userperData = [];
		/// Get user permission Modules
		$url =  $this->config->item('APIURL') . 'roles/userpermission/'.$id;
		$perrecord = $this->Commonmodel->getData($url, $authtoken); 
  		if($perrecord['success']=='200'){ 
  			$userperm = $perrecord['data'];
  		}
  		/// Get all Modules
  		$url =  $this->config->item('APIURL') . 'roles/getallmodule';
		$modulerecord = $this->Commonmodel->getData($url, $authtoken); 
  		if($modulerecord['success']=='200'){ 
  			$allmodule = $modulerecord['data'];
  		} 
  		foreach ($userperm as $ukey => $uvalue) {
  			$userperData[] = $uvalue['name'];
  		}
  		$kk = 0;
  		foreach ($allmodule as $akey => $avalue) {
  			if(!in_array($avalue['name'],$userperData)){
  				$newpermission[$kk]['userId'] = $id; 
  				$newpermission[$kk]['name'] = $avalue['name'];
  				$newpermission[$kk]['is_view'] = $avalue['is_view'];
  				$newpermission[$kk]['is_add'] = $avalue['is_add'];
  				$newpermission[$kk]['is_edit'] = $avalue['is_edit'];
  				$newpermission[$kk]['is_delete'] = $avalue['is_delete'];
  				$newpermission[$kk]['createdby'] = $this->session->userdata('admin_id');
  				$newpermission[$kk]['created'] = date('Y-m-d');
  				$newpermission[$kk]['modifiedby'] = $this->session->userdata('admin_id');
  				$newpermission[$kk]['modified'] = date('Y-m-d');
  				$kk++;
  			}
  		}
  		if(!empty($newpermission)){ 
			$url =  $this->config->item('APIURL') . 'roles/saveuserpermission'; 
			$records = $this->Commonmodel->postData($url, $newpermission, $authtoken);
			if($records['success']=='200'){
				$userperm = $records['data'];
			}
  		}
  		 
		$data['title'] = 'Assing User Permission'; 
		$data['permission'] = $userperm; 
		$data['userdetail'] = $userdetail;
		$this->load->view('includes/_header', $data);
		$this->load->view('users/user_permission');
		$this->load->view('includes/_footer');
	}
	
	public function updateuserpermission(){  

		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'roles/updateuserpermission';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);	
	} 
	
	public function getdeliveryboys(){  
		$authtoken = $this->session->userdata('authtoken');  
		$franchise_id = $this->input->post('franchise_id');
		$url =  $this->config->item('APIURL') . 'franchise/getdeliveryboys/'.$franchise_id;		
		$records = $this->Commonmodel->getData($url, $authtoken);	
		$users = '';   
		if($records['sucess']=='200'){
			$users = '<option value="">Select Delivery Boy</option>';
			foreach($records['data'] as $row){
				$users.= '<option value="'.$row["_id"].'">'.$row["fname"].' '.$row["lname"].'</option> ';
			} 
			echo $users;
		}else{
			echo $users = '<option value="">Select Delivery Boy</option>';
		}	
	} 

	//-----------------------------------------------------------
	function delivery_boy_detail($id = null){
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'user/getuserbyid/'.$id;
		$deliveryboy = $this->Commonmodel->getData($url, $authtoken);	
		if($deliveryboy['sucess']=='200'){
			$data['deliveryboy'] = $deliveryboy['data'];
		}  

		////echo "<pre>"; print_r($data['deliveryboy_order']); exit;
		$data['id'] = $id;
		$data['title'] = 'Delivery Boy Detail';
		$this->load->view('includes/_header');
		$this->load->view('users/delivery_boy_detail',$data);
		$this->load->view('includes/_footer');
	} 
	//-----------------------------------------------------------
	function deliveryboy_order_datatable_json($id = null){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'order/getdboyorders/'.$id.'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		/// prd($user_data); 
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];

			foreach ($user_data['data']['orders']  as $row) 
			{   
				$payMethod = $this->config->item('payMethod')[$row['payment_method']]; 		
				$status = $this->config->item('OrderStatus')[$row['is_active']]; 
				if($row["payment_method"] == 1){ 
					$toPayAmt = number_format($row["final_total"],2,'.',''); 
				}else{ $toPayAmt = 0.00; }
				if($row["is_active"]==3){
                    if(@$row['opm_total']!=$row["final_total"]){
                        $toPayAmt = number_format(@$row["delivery_total"],2,'.','');
                    }else{
                        $toPayAmt = number_format($toPayAmt,2,'.','');
                    }
                }else if($row["is_active"]>=4){
                    $toPayAmt =  number_format($row["received_total"],2,'.',''); 
                } 
				$data[]= array(
					++$i, 
					$row['userName'].'<br>('.$row['phone_no'].')', 
					$row['orderUserId'],
					number_format($row['total'],2,'.',''), 
					number_format($row['delivery_charge'],2,'.',''), 
					isset($row['discount'])?number_format($row['discount'],2,'.',''):' -- ',
					isset($row['promo_discount'])?number_format($row['promo_discount'],2,'.',''):' -- ',
					isset($row['key_wallet_balance'])?$row['key_wallet_balance']:' -- ',
					isset($row['final_total'])?number_format($row['final_total'],2,'.',''):' -- ',
					($row["is_active"]>=4)?number_format(@$row["delivery_total"],2,'.',''):number_format(@$row["opm_total"],2,'.',''),
					$toPayAmt, 
					$payMethod,  
					date_time($row['created']),	
					$status,	 
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);			
	} 
	
	//-----------------------------------------------------------
	public function expire_wallet(){
		$data['title'] = 'Admin/Subadmin List';

		$url = explode('/', $_SERVER['REQUEST_URI']);
		$date = array_pop($url);
		$d = DateTime::createFromFormat('Y-m-d', $date);
		if(!empty($d)){
			if($d->format('Y-m-d') === $date){
				$today = $date;
			}else{
				$today = date('Y-m-d');
			} 
		}else{
			$today = date('Y-m-d');
		}
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'walletlog/gettodaywalletexpiry/'.$today.'';
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		///prd($user_data);
		$ndata = $data = array(); 
		if(@$user_data['sucess']=='200'){ 
			foreach ($user_data['data']  as $row) 
			{   
				$expireAmt =0;
				$debitAmt = 0;
				$creditAmt = isset($row['creditwalletlogs'][0]['amount'])?$row['creditwalletlogs'][0]['amount']:'0';
				$debitAmt = isset($row['debitwalletlogs'][0]['amount'])?$row['debitwalletlogs'][0]['amount']:'0';
				$expireAmt = $creditAmt-$debitAmt;  
				if($expireAmt>0){
					$ndata[]= array( 
						isset($row['full_name'])?$row['full_name']:'--', 
						isset($row['phone_no'])?$row['phone_no']:' - ',
						isset($row['wallet_balance'])?$row['wallet_balance']:' 0 ', 
						$expireAmt
					); 
				}
			}
		} 
		///prd($ndata);
		$data['today'] = $today;
		$data['wallet'] = $ndata;		 
		$this->load->view('includes/_header', $data);
		$this->load->view('users/expire_wallet_list');
		$this->load->view('includes/_footer');
	}	

	public function walletexpirenotification(){
		$today = $this->input->post('date');
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'walletlog/sendnotifyexpirewallet/'.$today.'';
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		///prd($user_data);
		$ndata = $data = array(); 
		if($user_data['sucess']=='200'){ 
			echo json_encode($user_data);
			return false;
		}
	}

	public function markuserwalletexpire(){
		$today = $this->input->post('date');
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'walletlog/markexpireuserwallet/'.$today.'';
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		///prd($user_data);
		$ndata = $data = array(); 
		if($user_data['sucess']=='200'){ 
			echo json_encode($user_data);
			return false;
		}
	}

	//-----------------------------------------------------------	
	/*public function expire_wallet_datatable_json(){	
		$tableData = $this->Commonmodel->dataTableData($_GET);
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'walletlog/gettodaywalletexpiry/'.date('Y-m-d').'?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';		
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		////prd($user_data);
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($user_data['data']  as $row) 
			{  
				$data[]= array(
					++$i, 
					isset($row['full_name'])?$row['full_name']:'--', 
					isset($row['phone_no'])?$row['phone_no']:' - ', 
					isset($row['walletlogs'])?$row['walletlogs']:' - ' 	 
				); 
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	}*/

	//-----------------------------------------------------------
	public function addaddress($id = null){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('userId', 'User', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('address_type', 'Address Type', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('address1', 'Address Line 1', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('address2', 'Address Line 2', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required');
			$this->form_validation->set_rules('areaId', 'Area', 'trim|required'); 
			 
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['product'] = array( 
					'userId' => $this->input->post('userId'), 
					'address_type'=> $this->input->post('address_type'),
					'address1'=> $this->input->post('address1'), 
					'address2'=> $this->input->post('address2'),
					'countryId'=> $this->input->post('countryId'),
					'stateId'=> $this->input->post('stateId'),
					'cityId'=> $this->input->post('cityId'),
					'areaId'=> $this->input->post('areaId'),
					'pincode' => $this->input->post('pincode'), 
					'phone_no' => $this->input->post('phone_no'), 
					'lat'=> '26.301048636780852',
            		'long'=> '73.05697571163942',
					'is_active' => "1", 
					'default_address'=>true
				); 	
				$authtoken = $this->session->userdata('authtoken');			
				$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
				$user = $this->Commonmodel->getData($url, $authtoken);
				// country
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				} 
				$url =  $this->config->item('APIURL') . "settings/getconfigs";
				$_configs = $this->Commonmodel->getData($url, $authtoken);
				$_configs = $_configs["data"];
				$temp = array();
				foreach($_configs[0] as $val){
					$temp[$val["id"]] = $val["title"];
				}
				$data['address_type'] = $temp;
				$data['user'] = $user['data'];  
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('users/addaddress', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'userId' => $this->input->post('userId'), 
					'address_type'=> $this->input->post('address_type'),
					'address1'=> $this->input->post('address1'), 
					'address2'=> $this->input->post('address2'),
					'countryId'=> $this->input->post('countryId'),
					'stateId'=> $this->input->post('stateId'),
					'cityId'=> $this->input->post('cityId'),
					'areaId'=> $this->input->post('areaId'),
					'pincode' => $this->input->post('pincode'), 
					'phone_no' => $this->input->post('phone_no'), 
					'lat'=> '26.301048636780852',
            		'long'=> '73.05697571163942',
					'is_active' => "1", 
					'default_address'=>true, 
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				); 
				$data = $this->security->xss_clean($data); 
				$authtoken = $this->session->userdata('authtoken');  
				// remove default old address
				$rdata = array( 'userId' => $this->input->post('userId') );
				$url =  $this->config->item('APIURL') . 'address/removedefaultaddress'; 
				$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
				////prd($records);
				// save new address
				$url =  $this->config->item('APIURL') . 'address/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);

				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Address has been added successfully!');
					redirect(base_url($this->model.'/users/customer'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/users/customer'));
				}
			}
		}else{
			$data['title'] = 'User Add Address'; 
			$authtoken = $this->session->userdata('authtoken');  		 
			$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
			$user = $this->Commonmodel->getData($url, $authtoken);
			// country
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$url =  $this->config->item('APIURL') . "settings/getconfigs";
			$_configs = $this->Commonmodel->getData($url, $authtoken);
			$_configs = $_configs["data"];
			$temp = array();
			foreach($_configs[0] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['address_type'] = $temp;
			$data['user'] = $user['data'];  
			 
			$this->load->view('includes/_header', $data);
			$this->load->view('users/addaddress');
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function xlsexportuser(){
		$authtoken = $this->session->userdata('authtoken');
		$records['sucess'] = 0;
		$user_type = $this->input->post('user_type');  
		$filter = ""; 
		if(isset($_POST["search_area"]) && !empty($_POST["search_area"])){
			$filter .= '&area='.$_POST["search_area"];
		} 
		if(isset($_POST["search_city"]) && !empty($_POST["search_city"])){
			$filter .= '&city='.$_POST["search_city"];
		}
		if(isset($_POST["search_state"]) && !empty($_POST["search_state"])){
			$filter .= '&state='.$_POST["search_state"];
		}
		if(isset($_POST["search_country"]) && !empty($_POST["search_country"])){
			$filter .= '&country='.$_POST["search_country"];
		}  	 
		$url =  $this->config->item('APIURL') . "user/exportuser?role=".$user_type."".$filter;
		$user_details = $this->Commonmodel->getData($url, $authtoken);
		///prd($user_details);
		$data['user_details'] = $user_details["data"];	
		 
		$records['sucess'] = 1;
		  
		$filename = $user_type.'_'.time().'.csv'; 
		header("Content-Description: File Transfer"); 
		header("Content-Disposition: attachment; filename=$filename"); 
		header("Content-Type: application/csv; ");
		// file creation 
		$file = fopen('php://output', 'w');

		$header = array("Name", "Mobile", "Wallet" ,"Order", "App-V", "Reg", "Created Date", "Status"); 
		fputcsv($file, $header); 

		foreach ($data['user_details'] as $key=>$value){ 
			$orderStatus = 'Recieved: '.$value['order_status']['recieved'].'<br>Delivered: '.$value['order_status']['delivered'].'<br>Cancelled: '.$value['order_status']['cancelled'];
			$breaks = array("<br />","<br>","<br/>");  
    		$orderStatus = str_ireplace($breaks, "\r\n", $orderStatus);  
    		if($value["is_active"]=='1'){ $active='Active';  }else{ $active ='Inactive'; } 
			$line = array($value['fname'].' '.$value['lname'], $value['phone_no'],  
				number_format($value["wallet_balance"], 2,".",""), 
				$orderStatus,
				$value["app_version"],
				$value['reg_from'],  
				date('F d, Y',strtotime($value['created'])),  
				$active);
			fputcsv($file,$line);  
		}
		fclose($file); 
		exit; 
	}
	//-----------------------------------------------------------
	public function dailycollection(){
		$data['title'] = 'Daily Collection List';
		$authtoken = $this->session->userdata('authtoken'); 
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		} 
		$data['OrderStatus'] = $this->config->item('OrderStatus');
		$data['payMethod'] = $this->config->item('payMethod');
		$data['franchise'] = $franchise;
		$data['today'] = date('Y-m-d');
		$this->load->view('includes/_header', $data);
		$this->load->view('users/dailycollection_list');
		$this->load->view('includes/_footer');
	} 
	//-----------------------------------------------------------
	function dailycollection_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);
  		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["franchise_id"]) && !empty($_GET["franchise_id"])){
				$filter.= '&franchise_id='.$_GET["franchise_id"];
			}
			if(isset($_GET["delivery_date_from"]) && !empty($_GET["delivery_date_from"]) && isset($_GET["delivery_date_to"]) && !empty($_GET["delivery_date_to"])){  
				$start = date('Y-m-d',strtotime($_GET["delivery_date_from"]));
				$end = date('Y-m-d',strtotime($_GET["delivery_date_to"]));
				$filter.= '&delivery_date_from='.$_GET["delivery_date_from"];
				$filter.= '&delivery_date_to='.$_GET["delivery_date_to"];
			}
			if(isset($_GET["is_active"]) && !empty($_GET["is_active"])){
				$filter.= '&is_active='.$_GET["is_active"];
			}
			if(isset($_GET["payment_method"]) && !empty($_GET["payment_method"])){
				$filter.= '&payment_method='.(int)$_GET["payment_method"];
			}
		}else{
			$start = $end = date('Y-m-d');
			$filter.= '&delivery_date_from='.date('Y-m-d');
			$filter.= '&delivery_date_to='.date('Y-m-d');
		}
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'order/dailycollection?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;  
		$user_data = $this->Commonmodel->getData($url, $authtoken); 
		
		$data = array(); 
		if(@$user_data['sucess']=='200'){  		
			$total = $user_data['total'];
			$filtered = $user_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			////prd($user_data['data']);
			foreach ($user_data['data']  as $row) 
			{  	
				$deposit =0;
				if(!empty($row["_id"]['delivery_boy_id'])){
					$url1 =  $this->config->item('APIURL') . 'voucher/getdepositbyuser/'.$row["_id"]['delivery_boy_id'].'?start='.$start.'&end='.$end.''; 
					$depositData = $this->Commonmodel->getData($url1, $authtoken); 
					$deposit = isset($depositData['data'][0]['deposit'])?$depositData['data'][0]['deposit']:0;
				} 
				
				$data[]= array(
					++$i, 
					isset($row["_id"]['firmname'])?$row["_id"]['firmname']:'--',
					'<a title="Delivery Boy Detail" target="_blank" href="'.base_url($this->model.'/users/delivery_boy_detail/'.$row["_id"]['delivery_boy_id'].'').'">'.$row["_id"]['full_name'].'</a>', 
					isset($row['order_count'])?$row['order_count']:' - ',
					number_format($row['recived'],2,'.',''),
					number_format($deposit,2,'.','') 
				);
			} 
		}
		$records['data']=$data;
		echo json_encode($records);			
	}

	function franchiseratelist($id=null){
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'product/getfranchiseproducts/'.$id;
		$franchiseproducts = $this->Commonmodel->getData($url, $authtoken);	 
		///prd($franchiseproducts);
		if($franchiseproducts['sucess']=='200'){
			
		$filename = 'wholesaler_ratelist.csv'; 
		header("Content-Description: File Transfer"); 
		header("Content-Disposition: attachment; filename=$filename"); 
		header("Content-Type: application/csv; ");
		// file creation 
		$file = fopen('php://output', 'w');
		$header = array("Product Name", "Unit", "Whole Rate" ,"Status"); 
		
		fputcsv($file, $header); 
		foreach ($franchiseproducts['data'] as $key=>$products){ 
			$productname = (isset($products["product"]["title"]))?$products["product"]["title"]:'';			 
				foreach ($products["productvariants"] as $vkey => $variants) { 
					if($variants['is_ws_active']==1){ 
						$is_ws_active='Available'; 
					}elseif($variants['is_ws_active']==2){ 
						$is_ws_active='Not Available'; 
					}elseif($variants['is_active']==3){ 
						$is_ws_active='Sold'; 
					}  
					$product_unit = $variants['measurment'].' '.@$this->config->item('units')[$variants['unit']];
				 	$line = array($productname, 
					$product_unit,
					number_format($variants["wholesale"], 2,".",""), 
					$is_ws_active);
					fputcsv($file,$line); 
				}
			} 
			 
		}
		fclose($file); 
		exit;  
	}
}
?>