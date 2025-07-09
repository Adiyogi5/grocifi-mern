<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Lucky_draw_coupon extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		check_user_premissions(
			$this->session->userdata('role_type'), 
			$this->session->userdata('admin_id'),
			$this->router->fetch_class(), 
			$this->router->fetch_method()
		);		
		auth_franchise_check(); // check login auth  
		$this->model = $this->session->userdata('model');
	}

	//---------------------------Lucky Draw Coupon--------------------------------	
	public function index(){

		$data['title'] = 'Lucky Draw Coupon List';
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
		$this->load->view('lucky_draw_coupon/offer_list');
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	public function offer_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);  
		$franchise_id = $this->session->userdata('franchise_id');
		$filter = '&franchise_id='.$franchise_id;
		
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'luckydraw_coupon/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$offer_data = $this->Commonmodel->getData($url, $authtoken); 

		$data = array(); 
		if(@$offer_data['sucess']=='200'){  		
			$total = $offer_data['total'];
			$filtered = $offer_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start']; 
			foreach ($offer_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$is_lock  = $row['is_lock'];
				$is_date  = date_time($row['start_date']).' - '.date_time($row['expiry_date']);
				$edt = ($row['is_lock'] == '0')?'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/lucky_draw_coupon/edit/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>':'';

				$del = ($row['is_lock'] == '0' && $row['is_active'] != 0)?'  <span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>';  
				$data[]= array(
					++$i, 
					'<a title="Lucky Draw Coupon Detail" class="detail" href="'.base_url($this->model.'/lucky_draw_coupon/updateproduct/'.$row['_id']).'">'.$row['title'].'</a>', 
					isset($row['franchiseName'])?$row['franchiseName']:'', 
					$is_date,	
					date_time($row['created']),
					($is_lock=='0')?'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>':' Locked ',  
					$edt.$del
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	

	//-----------------------------------------------------------
	public function change_offer_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id'); 
		echo json_encode($records);
	}

	//-----------------------------------------------------------
	public function add(){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|xss_clean');  
			
			$this->form_validation->set_rules('start_date', 'Start Date', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('expiry_date', 'End Date', 'trim|required|strip_tags|xss_clean');

			$this->form_validation->set_rules('offer_order', 'Lucky Draw Coupon Order', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('offer_winner', 'Lucky Draw Count', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if (empty($_FILES['offer_image']['name']))
			{
			    $this->form_validation->set_rules('offer_image', 'Lucky Draw Coupon Image', 'required');
			}
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['offer'] = array( 
					'title' => $this->input->post('title'), 
					'franchise_id'=> $this->input->post('franchise_id'),
					'offer_winner' => $this->input->post('offer_winner'), 
					'start_date'=> $this->input->post('start_date'),
					'expiry_date'=> $this->input->post('expiry_date'),
					'offer_order'=> $this->input->post('offer_order'),
					'description'=> $this->input->post('description'),
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
				$this->load->view('lucky_draw_coupon/offer_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$sdate = $this->input->post('start_date');
				$edate = $this->input->post('expiry_date');
				$today = date('Y-m-d');
				$is_lock = 0; 
				$dateError = '';
				$data = array( 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
					'franchise_id'=> $this->input->post('franchise_id'),
					'is_lock'=> $is_lock, 
					'offer_winner' => $this->input->post('offer_winner'),
					'start_date'=> $this->input->post('start_date'),
					'expiry_date'=> $this->input->post('expiry_date'),
					'offer_order'=> $this->input->post('offer_order'),
					'description'=> $this->input->post('description'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);  
				if(strtotime($sdate) < strtotime($today)){
					$dateError = 'You can not create lucky draw coupon in back date'; 
				}
				if(strtotime($sdate) > strtotime($edate) ){
					$dateError = 'Start date should not be less then End date';
				}
				if($dateError!=''){	 
					$edata = array(
						'errors' => $dateError,
						'offer' => $data
					);
					$authtoken = $this->session->userdata('authtoken'); 
					$url =  $this->config->item('APIURL') . 'franchise/index';		
					$franchise_data = $this->Commonmodel->getData($url, $authtoken);
					if(@$franchise_data['sucess']=='200'){ 
						$edata['franchise'] = $franchise_data['data'];
					}
					$this->session->set_flashdata('errors', $edata['errors']);
					$this->load->view('includes/_header');
					$this->load->view('lucky_draw_coupon/offer_add', $edata);
					$this->load->view('includes/_footer');
				}else{ 				 
					if(!empty($_FILES['offer_image']['name']))
					{    
						$filename= $_FILES["offer_image"]["tmp_name"];
			        	$request = array('offer_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["offer_image"]["type"], $_FILES["offer_image"]["name"]));  
						$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/saveofferimg/';
						$authtoken = $this->session->userdata('authtoken'); 
						$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
						if($result['sucess']=='200'){
							$data['offerimg'] = $result['name'];
						}
					}
					$data = $this->security->xss_clean($data); 	
					$authtoken= $this->session->userdata('authtoken');
					$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/save'; 
					$records = $this->Commonmodel->postData($url, $data, $authtoken); 
					if($records['sucess']=='200'){
						$this->session->set_flashdata('success', 'Lucky Draw Coupon has been added successfully!');
						redirect(base_url($this->model.'/lucky_draw_coupon'));
					}else{
						$this->session->set_flashdata('error', $records['msg']);
						redirect(base_url($this->model.'/lucky_draw_coupon'));
					}
				}
			}
		}else{
			$data['title'] = 'Add Lucky Draw Coupon';
			$authtoken = $this->session->userdata('authtoken'); 
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('lucky_draw_coupon/offer_add');
			$this->load->view('includes/_footer');
		}
	}

	//-----------------------------------------------------------
	public function edit($id = 0){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|xss_clean');  
			
			$this->form_validation->set_rules('start_date', 'Start Date', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('expiry_date', 'End Date', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('offer_winner', 'Lucky Draw Count', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('offer_order', 'Lucky Draw Coupon Order', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			 
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['offer'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'franchise_id' => $this->input->post('franchise_id'),
					'offer_winner' => $this->input->post('offer_winner'), 
					'start_date'=> $this->input->post('start_date'),
					'expiry_date'=> $this->input->post('expiry_date'),
					'offer_order'=> $this->input->post('offer_order'),
					'description'=> $this->input->post('description'), 
					'offer_img'=> $this->input->post('offerimg'),
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
				$this->load->view('lucky_draw_coupon/offer_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$sdate = $this->input->post('start_date');
				$edate = $this->input->post('expiry_date');
				$today = date('Y-m-d');
				$is_lock = 0; 
				$data = array( 
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
					'franchise_id'=> $this->input->post('franchise_id'),
					'is_lock'=> $is_lock, 
					'offer_winner' => $this->input->post('offer_winner'),
					'start_date'=> $this->input->post('start_date'),
					'expiry_date'=> $this->input->post('expiry_date'),
					'offer_order'=> $this->input->post('offer_order'),
					'offer_img'=> $this->input->post('offerimg'),
					'description'=> $this->input->post('description'),
					'modifiedby' =>  $this->session->userdata('admin_id'),  
				);  
				if(strtotime($sdate) < strtotime($today)){
					$dateError = 'You can not create lucky draw coupon in back date'; 
				}
				if(strtotime($sdate) > strtotime($edate) ){
					$dateError = 'Start date should not be less then End date';
				}

				if($dateError!=''){	  
					$edata = array(
						'errors' => $dateError,
						'offer' => $data
					);  
					$authtoken = $this->session->userdata('authtoken'); 
					$url =  $this->config->item('APIURL') . 'franchise/index';		
					$franchise_data = $this->Commonmodel->getData($url, $authtoken);
					if(@$franchise_data['sucess']=='200'){ 
						$edata['franchise'] = $franchise_data['data'];
					}
					$this->session->set_flashdata('errors', $edata['errors']);
					$this->load->view('includes/_header');
					$this->load->view('lucky_draw_coupon/offer_edit', $edata); 
					$this->load->view('includes/_footer');
				}else{ 

					if(!empty($_FILES['offer_image']['name']))
					{    
						$filename = $_FILES["offer_image"]["tmp_name"];
			        	$request = array('offer_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["offer_image"]["type"], $_FILES["offer_image"]["name"]));  
						$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/saveofferimg/';
						$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
						if($result['sucess']=='200'){
							$data['offerimg'] = $result['name'];
						}
					}else{
						$data['offerimg'] = $this->input->post('offerimg');
					}
					 
					$data = $this->security->xss_clean($data);
					$authtoken = $this->session->userdata('authtoken');  
					$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/edit'; 
					$records = $this->Commonmodel->postData($url, $data, $authtoken);
				 
					if($records['sucess']=='200'){
						$this->session->set_flashdata('success', 'Lucky Draw Coupon has been update successfully!');
						redirect(base_url($this->model.'/lucky_draw_coupon'));
					}else{
						$this->session->set_flashdata('error', $records['msg']);
						redirect(base_url($this->model.'/lucky_draw_coupon'));
					}
				}
			}
		}else{

			$data['title'] = 'Edit Lucky Draw Coupon';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['offer'] = $records['data'];
			}  
			$authtoken = $this->session->userdata('authtoken'); 
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 

			$this->load->view('includes/_header', $data);
			$this->load->view('lucky_draw_coupon/offer_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	} 

 	public function updateproduct($id = 0){
 		$data['title'] = 'Update Lucky Draw Coupon Products';
 		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/getofferdetailbyid/'.$id;
		$records = $this->Commonmodel->getData($url, $authtoken);
		if($records['sucess']=='200'){
			$data['offer'] = $records['data'][0];
			$offranchise = $records['data'][0]['franchise_id']; 
		}  
		////prd($data['offer']);
		$url =  $this->config->item('APIURL') . 'product/getproductsoffranchise/'.$offranchise;
		$records = $this->Commonmodel->getData($url, $authtoken); 
		if($records['sucess']=='200'){
			$data['franchiseproducts'] = $records['data'];
		}  
		//prd($data);
		$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/getproductsofoffer/'.$id;
		$records = $this->Commonmodel->getData($url, $authtoken); 
		if($records['sucess']=='200'){
			$data['offerproducts'] = $records['data'];
		}  
		/// echo "<pre>";print_r($records); exit;
		$this->load->view('includes/_header', $data);
		$this->load->view('lucky_draw_coupon/updateproduct', $data);
		$this->load->view('includes/_footer');
 	}

 	//-----------------------------------------------------------
	public function updateofferchild(){   
		$authtoken = $this->session->userdata('authtoken');  
		$mode = $this->input->post('mode');
		if($mode==1){
			$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/productsave';
		}else{
			$url =  $this->config->item('APIURL') . 'lucky_draw_coupon/productremove';
		}
		$data =  $this->input->post(); 
		$data['createdby'] = $this->session->userdata('admin_id');
		$records = $this->Commonmodel->postData($url, $data, $authtoken); 
		echo json_encode($records);
	}
	

}

?>	