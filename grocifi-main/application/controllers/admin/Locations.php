<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Locations extends MY_Controller {

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
		$this->load->library('functions');
		$this->model = $this->session->userdata('model');
	}

	//---------------------------Country-----------------------------	
	public function country(){

		$data['title'] = 'Country List';

		$this->load->view('includes/_header', $data);
		$this->load->view('locations/country_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function country_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'country/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$country_data = $this->Commonmodel->getData($url, $authtoken); 

		$data = array(); 
		if(@$country_data['sucess']=='200'){  		
			$total = $country_data['total'];
			$filtered = $country_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($country_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>'; 
				$data[]= array(
					++$i, 
					$row['title'], 
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/locations/editcountry/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_country_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'country/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addcountry(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['country'] = array( 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
				);
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/country_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Country has been added successfully!');
					redirect(base_url($this->model.'/locations/country'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/country'));
				}
			}
		}else{

			$data['title'] = 'Add Country';
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/country_add');
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editcountry($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['country'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
				);
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/country_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Country has been update successfully!');
					redirect(base_url($this->model.'/locations/country'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/country'));
				}
			}
		}else{

			$data['title'] = 'Edit Country';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'country/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['country'] = $records['data'];
			} 

			$this->load->view('includes/_header', $data);
			$this->load->view('locations/country_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	} 


//---------------------------State--------------------------------	
	public function state(){

		$data['title'] = 'State List';

		$this->load->view('includes/_header', $data);
		$this->load->view('locations/state_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function state_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'state/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$state_data = $this->Commonmodel->getData($url, $authtoken); 
		///echo "<pre>"; print_r($state_data); exit; 
		$data = array(); 
		if(@$state_data['sucess']=='200'){  		
			$total = $state_data['total'];
			$filtered = $state_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($state_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>'; 
				$data[]= array(
					++$i, 
					$row['title'], 
					(!empty($row['countryName']))?$row['countryName']:'',
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/locations/editstate/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_state_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'state/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addstate(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['state'] = array( 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'is_active' => $this->input->post('is_active'),
				);
				$data['countryId'] = $this->input->post('countryId');
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				} 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/state_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'countryId' => $this->input->post('countryId'), 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'state/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'State has been added successfully!');
					redirect(base_url($this->model.'/locations/state'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/state'));
				}
			}
		}else{

			$data['title'] = 'Add State';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/state_add', $data);
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editstate($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['state'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				} 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/state_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'countryId' => $this->input->post('countryId'), 
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'state/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'State has been update successfully!');
					redirect(base_url($this->model.'/locations/state'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/state'));
				}
			}
		}else{

			$data['title'] = 'Edit State';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'state/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['state'] = $records['data'];
			}   
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/state_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	}

	//-----------------------------------------------------------
	public function fetch_state_list_by_country_id($id = 0)
	{
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . "state/getstatebycid/$id?is_active=1";
		$records = $this->Commonmodel->getData($url, $authtoken);
		$states = array("0"=>"Select State");
		if($records['sucess']=='200'){ 	 
			foreach($records["data"] as $val){
				$states[$val["_id"]] = $val["title"];
			}
		}
		echo json_encode($states);
	} 


//---------------------------City--------------------------------	
	public function city(){

		$data['title'] = 'City List';

		$this->load->view('includes/_header', $data);
		$this->load->view('locations/city_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function city_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'city/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$city_data = $this->Commonmodel->getData($url, $authtoken); 
		///echo "<pre>"; print_r($city_data); exit; 
		$data = array(); 
		if(@$city_data['sucess']=='200'){  		
			$total = $city_data['total'];
			$filtered = $city_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($city_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>'; 
				$data[]= array(
					++$i, 
					$row['title'], 
					(!empty($row['stateName']))?$row['stateName']:'',  
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/locations/editcity/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_city_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'city/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addcity(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['city'] = array( 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'),
					'stateId' => $this->input->post('stateId'), 
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}  
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/city_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'stateId' => $this->input->post('stateId'), 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'city/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'City has been added successfully!');
					redirect(base_url($this->model.'/locations/city'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/city'));
				}
			}
		}else{

			$data['title'] = 'Add City';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			}
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/city_add', $data);
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editcity($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['city'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'is_active' => $this->input->post('is_active'),
				);
				$data['countryId'] = $this->input->post('countryId');
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/city_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'stateId' => $this->input->post('stateId'), 
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'city/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'City has been update successfully!');
					redirect(base_url($this->model.'/locations/city'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/city'));
				}
			}
		}else{

			$data['title'] = 'Edit City';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'city/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['city'] = $records['data'];
				$stateId = $records['data']['stateId'];
				$url =  $this->config->item('APIURL') . 'state/edit/'.$stateId;
				$records1 = $this->Commonmodel->getData($url, $authtoken);
				if($records1['sucess']=='200'){
					$data['countryId'] = $records1['data']['countryId'];
				}
			}       
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/city_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	}

	public function fetch_city_list_by_state_id($id = 0)
	{
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . "city/getcitybystateid/$id?is_active=1";
		$records = $this->Commonmodel->getData($url, $authtoken);
		$states = array("0"=>"Select City");
		if($records['sucess']=='200'){ 	 
			foreach($records["data"] as $val){
				$states[$val["_id"]] = $val["title"];
			}
		}
		echo json_encode($states);
	}


//---------------------------Area--------------------------------	
	public function area(){

		$data['title'] = 'Area List';

		$this->load->view('includes/_header', $data);
		$this->load->view('locations/area_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function area_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'area/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$area_data = $this->Commonmodel->getData($url, $authtoken); 
		///echo "<pre>"; print_r($area_data); exit; 
		$data = array(); 
		if(@$area_data['sucess']=='200'){  		
			$total = $area_data['total'];
			$filtered = $area_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start']; 

			foreach ($area_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>'; 
				$data[]= array(
					++$i, 
					$row['title'], 
					(!empty($row['cityName']))?$row['cityName']:'',  
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/locations/editarea/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_area_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'area/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addarea(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['area'] = array( 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'), 
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}  
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/area_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'cityId' => $this->input->post('cityId'), 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'area/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Area has been added successfully!');
					redirect(base_url($this->model.'/locations/area'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/area'));
				}
			}
		}else{

			$data['title'] = 'Add Area';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			}
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/area_add', $data);
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editarea($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['area'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'), 
					'is_active' => $this->input->post('is_active'),
				);				
				$data['countryId'] = $this->input->post('countryId');
				$data['stateId'] = $this->input->post('stateId');
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/area_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'cityId' => $this->input->post('cityId'), 
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'area/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Area has been update successfully!');
					redirect(base_url($this->model.'/locations/area'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/area'));
				}
			}
		}else{

			$data['title'] = 'Edit Area';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'area/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['area'] = $records['data'];
				$cityId = $records['data']['cityId'];
				$url =  $this->config->item('APIURL') . 'city/edit/'.$cityId;
				$records1 = $this->Commonmodel->getData($url, $authtoken);
				if($records1['sucess']=='200'){
					$data['stateId'] = $records1['data']['stateId'];
					$url =  $this->config->item('APIURL') . 'state/edit/'.$data['stateId'];
					$records2 = $this->Commonmodel->getData($url, $authtoken);
					if($records2['sucess']=='200'){
						$data['countryId'] = $records2['data']['countryId'];
					}
				}
			}     
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/area_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	} 

	public function fetch_areagroup_list_by_city_id($id){
		//
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . "area/groups?city_id=$id&is_active=1";
		$records = $this->Commonmodel->getData($url, $authtoken);
		$states = array("0"=>"Select Group of Area");
		if($records['sucess']=='200'){ 	 
			foreach($records["data"] as $val){
				$states[$val["_id"]] = $val["title"];
			}
		}
		echo json_encode($states);
	}

	public function fetch_area_list_by_city_id($id){
		//
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . "area/index/$id?is_active=1";
		$records = $this->Commonmodel->getData($url, $authtoken);
		$states = array("0"=>"Select Area");
		if($records['sucess']=='200'){ 	 
			foreach($records["data"] as $val){
				$states[$val["_id"]] = $val["title"];
			}
		}
		echo json_encode($states);
	}

	public function fetch_area_list_by_group_id($id){
		//
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . "area/getareabygroupid/$id?is_active=1";
		$records = $this->Commonmodel->getData($url, $authtoken);
		$states = array("0"=>"Select Area");
		if($records['sucess']=='200'){ 	 
			foreach($records["data"] as $val){
				$states[$val["_id"]] = $val["title"];
			}
		}
		echo json_encode($states);
	}


//---------------------------Sub Area--------------------------------	
	public function sub_area(){

		$data['title'] = 'Sub Area List';

		$this->load->view('includes/_header', $data);
		$this->load->view('locations/sub_area_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function sub_area_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'subarea/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$sub_area_data = $this->Commonmodel->getData($url, $authtoken); 
		///echo "<pre>"; print_r($sub_area_data); exit; 
		$data = array(); 
		if(@$sub_area_data['sucess']=='200'){  		
			$total = $sub_area_data['total'];
			$filtered = $sub_area_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start']; 

			foreach ($sub_area_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>'; 
				$data[]= array(
					++$i, 
					$row['title'], 
					(!empty($row['areaName']))?$row['areaName']:'',
					(!empty($row['cityName']))?$row['cityName']:'',  
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/locations/editsub_area/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_sub_area_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'subarea/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addsub_area(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('areaId', 'Area', 'trim|required|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['sub_area'] = array( 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'),
					'areaId' => $this->input->post('areaId'), 
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}  
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/sub_area_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'cityId' => $this->input->post('cityId'), 
					'areaId' => $this->input->post('areaId'), 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'subarea/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Sub Area has been added successfully!');
					redirect(base_url($this->model.'/locations/sub_area'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/sub_area'));
				}
			}
		}else{

			$data['title'] = 'Add Sub Area';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			}
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/sub_area_add', $data);
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editsub_area($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required|xss_clean');
			$this->form_validation->set_rules('areaId', 'Area', 'trim|required|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['sub_area'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'), 
					'areaId' => $this->input->post('areaId'), 
					'is_active' => $this->input->post('is_active'),
				);				
				$data['countryId'] = $this->input->post('countryId');
				$data['stateId'] = $this->input->post('stateId');
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/sub_area_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 					
					'cityId' => $this->input->post('cityId'),
					'areaId' => $this->input->post('areaId'),  
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'subarea/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Sub Area has been update successfully!');
					redirect(base_url($this->model.'/locations/sub_area'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/sub_area'));
				}
			}
		}else{

			$data['title'] = 'Edit Sub Area';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'subarea/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['sub_area'] = $records['data'];
				$cityId = $records['data']['cityId'];
				$url =  $this->config->item('APIURL') . 'city/edit/'.$cityId;
				$records1 = $this->Commonmodel->getData($url, $authtoken);
				if($records1['sucess']=='200'){
					$data['stateId'] = $records1['data']['stateId'];
					$url =  $this->config->item('APIURL') . 'state/edit/'.$data['stateId'];
					$records2 = $this->Commonmodel->getData($url, $authtoken);
					if($records2['sucess']=='200'){
						$data['countryId'] = $records2['data']['countryId'];
					}
				}
			}     
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/sub_area_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	} 

	//---------------------Group of Area----------------------------	
	public function area_group(){

		$data['title'] = 'Group of Area List';

		$this->load->view('includes/_header', $data);
		$this->load->view('locations/area_group_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function area_group_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'area/groups?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$area_group_data = $this->Commonmodel->getData($url, $authtoken); 
		///echo "<pre>"; print_r($area_group_data); exit; 
		$data = array(); 
		if(@$area_group_data['sucess']=='200'){  		
			$total = $area_group_data['total'];
			$filtered = $area_group_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start']; 

			foreach ($area_group_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$data[]= array(
					++$i, 
					$row['title'], 
					(!empty($row['cityName']))?$row['cityName']:'',
					(!empty($row['stateName']))?$row['stateName']:'',  
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/locations/editarea_group/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>'
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_area_group_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'area/groupstatus';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addarea_group(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			if(empty($this->input->post('area_id'))){
				$this->form_validation->set_rules('area_id', 'Area', 'trim|required|xss_clean');
			}
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['area_group'] = array( 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'),
					'area_id' => $this->input->post('area_id'), 
					'is_active' => $this->input->post('is_active'),
				);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}  
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/area_group_add', $data);
				$this->load->view('includes/_footer');
			}else{
				foreach ($this->input->post('area_id') as $key => $value) {
					$arearr[] = $value;
				}
				$data = array( 
					'title' => $this->input->post('title'), 
					'city_id' => $this->input->post('cityId'), 
					'area_id' => $arearr, 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				); 
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'area/savegroupofarea'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 	 
				if($records['success']=='200'){
					$this->session->set_flashdata('success', 'Group of Area has been added successfully!');
					redirect(base_url($this->model.'/locations/area_group'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/area_group'));
				}
			}
		}else{

			$data['title'] = 'Add Group of Area';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			}
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/area_group_add', $data);
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editarea_group($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('countryId', 'Country', 'trim|required|xss_clean');
			$this->form_validation->set_rules('stateId', 'State', 'trim|required|xss_clean');
			$this->form_validation->set_rules('cityId', 'City', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			if(empty($this->input->post('area_id'))){
				$this->form_validation->set_rules('area_id', 'Area', 'trim|required|xss_clean');
			}
			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['area_group'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'),
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'), 
					'area_id' => $this->input->post('area_id'), 
					'is_active' => $this->input->post('is_active'),
				);				
				$data['countryId'] = $this->input->post('countryId');
				$data['stateId'] = $this->input->post('stateId');
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
				$country_data = $this->Commonmodel->getData($url, $authtoken);
				if(@$country_data['sucess']=='200'){ 
					$data['country'] = $country_data['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('locations/area_group_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				foreach ($this->input->post('area_id') as $key => $value) {
					$arearr[] = $value;
				}
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 					
					'city_id' => $this->input->post('cityId'),
					'area_id' => $arearr,  
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'area/updategroupofarea'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Group of Area has been update successfully!');
					redirect(base_url($this->model.'/locations/area_group'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/locations/area_group'));
				}
			}
		}else{

			$data['title'] = 'Edit Group of Area';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'area/editgroupofarea/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			//print_r($records); exit;
			if($records['sucess']=='200'){
				$data['area_group'] = $records['data'];
				$cityId = $records['data']['city_id'];
				$url =  $this->config->item('APIURL') . 'city/edit/'.$cityId;
				$records1 = $this->Commonmodel->getData($url, $authtoken);
				if($records1['sucess']=='200'){
					$data['stateId'] = $records1['data']['stateId'];
					$url =  $this->config->item('APIURL') . 'state/edit/'.$data['stateId'];
					$records2 = $this->Commonmodel->getData($url, $authtoken);
					if($records2['sucess']=='200'){
						$data['countryId'] = $records2['data']['countryId'];
					}
				}
			}     
			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$this->load->view('includes/_header', $data);
			$this->load->view('locations/area_group_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	}
	 
//-----------------------------------------------------------
	public function getstatebycountry(){   
		$authtoken = $this->session->userdata('authtoken');  
		$data = $this->input->post('country_id');
		if(!empty($data)){
			$url =  $this->config->item('APIURL') . 'state/getstatebycid/'.$data.'?is_active=1';		
			$records = $this->Commonmodel->getData($url, $authtoken);	
			$state = '';   
			if($records['sucess']=='200'){
				$state = '<option value="">Select State</option>';
				foreach($records['data'] as $row){
					$state.= '<option value="'.$row["_id"].'">'.$row["title"].'</option> ';
				}
			}
			echo $state;
		}else{
			echo $state = '<option value="">Select State</option>';
		}
	}
//-----------------------------------------------------------
	public function getcitybystate(){   
		$authtoken = $this->session->userdata('authtoken');  
		$data = $this->input->post('state_id');
		if(!empty($data)){
			$url =  $this->config->item('APIURL') . 'city/getcitybystateid/'.$data.'?is_active=1';		
			$records = $this->Commonmodel->getData($url, $authtoken);	
			$city = '';   
			if($records['sucess']=='200'){
				$city = '<option value="">Select City</option>';
				foreach($records['data'] as $row){
					$city.= '<option value="'.$row["_id"].'">'.$row["title"].'</option> ';
				}
			}
			echo $city;
		}else{
			echo $city = '<option value="">Select City</option>';
		}
	}	
//-----------------------------------------------------------
	public function getareabycity(){   
		$authtoken = $this->session->userdata('authtoken');  
		$data = $this->input->post('city_id');
		$groupareaId = $this->input->post('groupareaId');
		$mode = $this->input->post('mode');
		if(!empty($data)){
			$url =  $this->config->item('APIURL') . 'area/index/'.$data.'?is_active=1';		
			$records = $this->Commonmodel->getData($url, $authtoken);	
			$area = '';   
			if($records['sucess']=='200'){
				if($mode==1){
					$i=0;
					foreach($records['data'] as $row){
						if($groupareaId==0){
							if(empty($row['group_id'])){
								$area.= '<div class="col-sm-4"><label style="font-weight: normal;"><input value="'.$row["_id"].'" type="checkbox" id="area_'.$i.'"  name="area_id['.$i.']">&nbsp;'.$row["title"].'</label></div>';
							}
						}else{
							if($groupareaId==$row['group_id']) {
								$area.= '<div class="col-sm-4"><label style="font-weight: normal;"><input value="'.$row["_id"].'" type="checkbox" checked="checked" id="area_'.$i.'"  name="area_id['.$i.']">&nbsp;'.$row["title"].'</label></div>';
							}elseif(empty($row['group_id'])){
								$area.= '<div class="col-sm-4"><label style="font-weight: normal;"><input value="'.$row["_id"].'" type="checkbox" id="area_'.$i.'"  name="area_id['.$i.']">&nbsp;'.$row["title"].'</label></div>';
							}
						}
						$i++;
					}
				}else{
					$area = '<option value="">Select Area</option>';
					foreach($records['data'] as $row){
						$area.= '<option value="'.$row["_id"].'">'.$row["title"].'</option> ';
					}
				}
			}
			echo $area;
		}else{
			if(empty($mode)){ echo $area = '<option value="">Select Area</option>'; }
		}
	}
	//-----------------------------------------------------------
	public function getfranchiseareabycity(){   
		$authtoken = $this->session->userdata('authtoken');  
		$data = $this->input->post('city_id');
		$franchiseId = $this->input->post('franchiseId');
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'franchise/getfrareas/'.$franchiseId;
		$records = $this->Commonmodel->getData($url, $authtoken); 
		$franchisearea = [];
		if($records['sucess']=='200'){
			foreach ($records['data'] as $fkey => $fvalue) {
				$franchisearea[] = $fvalue['frarea']['areaId']; 
			}			
		}  
		if(!empty($data)){
			$url =  $this->config->item('APIURL') . 'area/index/'.$data.'?is_active=1';		
			$records = $this->Commonmodel->getData($url, $authtoken);	
			$area = '';   
			if($records['sucess']=='200'){ 
				$i=0;
				foreach($records['data'] as $row){ 
					if(in_array($row['_id'], $franchisearea)) {
						$area.= '<div class="col-sm-4"><label style="font-weight: normal;"><input value="'.$row["_id"].'" type="checkbox" checked="checked" id="area'.$i.'"  name="area_id['.$i.']" class="updateArea">&nbsp;'.$row["title"].'</label></div>';
					}else{
						$area.= '<div class="col-sm-4"><label style="font-weight: normal;"><input value="'.$row["_id"].'" type="checkbox" id="area'.$i.'"  name="area_id['.$i.']" class="updateArea">&nbsp;'.$row["title"].'</label></div>';
					}
					$i++;
				} 
			}
			echo $area;
		} 
	}


}

?>	