<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Banner extends MY_Controller {

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


	//---------------------------Banner--------------------------------	
	public function index(){

		$data['title'] = 'Banner List';
		$franchise_id = $this->session->userdata('franchise_id');
		$firmname = $this->session->userdata('firmname');
		$franchise[0]['_id']=$franchise_id;
		$franchise[0]['firmname']= $firmname; 
		$data['franchise'] = $franchise;

		$this->load->view('includes/_header', $data);
		$this->load->view('banner/banner_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function banner_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET); 
		$franchise_id = $this->session->userdata('franchise_id');
		$filter = '&franchise_id='.$franchise_id;

		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'banner/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$banner_data = $this->Commonmodel->getData($url, $authtoken); 
		$data = array(); 
		if(@$banner_data['sucess']=='200'){  		
			$total = $banner_data['total'];
			$filtered = $banner_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($banner_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$data[]= array(
					++$i, 
					$row['title'], 
					isset($row['franchiseName'])?$row['franchiseName']:'',
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		
					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/banner/edit/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/banner/delete/".$row['_id']).' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>'
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_banner_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'banner/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function add(){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			if (empty($_FILES['banner_img']['name']))
			{
			    $this->form_validation->set_rules('banner_img', 'Banner', 'required');
			}

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['banner'] = array( 
					'title' => $this->input->post('title'), 
					'franchise_id'=> $this->input->post('franchise_id'),
					'is_active' => $this->input->post('is_active'),
				);
				$franchise_id = $this->session->userdata('franchise_id');
				$firmname = $this->session->userdata('firmname');
				$franchise[0]['_id']=$franchise_id;
				$franchise[0]['firmname']= $firmname; 
				$data['franchise'] = $franchise;

				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('banner/banner_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
					'franchise_id'=> $this->input->post('franchise_id'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				if(!empty($_FILES['banner_img']['name']))
				{    
					$filename = $_FILES["banner_img"]["tmp_name"];
		        	$request = array('banner_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["banner_img"]["type"], $_FILES["banner_img"]["name"]));  
					$url =  $this->config->item('APIURL') . 'banner/uploadbannerimg/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['_img'] = $result['name'];
					}
				}
				$data = $this->security->xss_clean($data);
 	
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'banner/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Banner has been added successfully!');
					redirect(base_url($this->model.'/banner'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/banner'));
				}
			}
		}else{

			$data['title'] = 'Add Banner';
			$franchise_id = $this->session->userdata('franchise_id');
			$firmname = $this->session->userdata('firmname');
			$franchise[0]['_id']=$franchise_id;
			$franchise[0]['firmname']= $firmname; 
			$data['franchise'] = $franchise;

			$this->load->view('includes/_header', $data);
			$this->load->view('banner/banner_add');
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function edit($id = 0){  
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('franchise_id', 'Franchise', 'trim|required|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['banner'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'franchise_id' => $this->input->post('franchise_id'),
					'img' => $this->input->post('_img'),
					'is_active' => $this->input->post('is_active'),
				);
				$franchise_id = $this->session->userdata('franchise_id');
				$firmname = $this->session->userdata('firmname');
				$franchise[0]['_id']=$franchise_id;
				$franchise[0]['firmname']= $firmname; 
				$data['franchise'] = $franchise; 

				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('banner/banner_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'franchise_id' => $this->input->post('franchise_id'), 
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
				);
				if(!empty($_FILES['banner_img']['name']))
				{    
					$filename = $_FILES["banner_img"]["tmp_name"];
		        	$request = array('banner_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["banner_img"]["type"], $_FILES["banner_img"]["name"]));  
					$url =  $this->config->item('APIURL') . 'banner/uploadbannerimg/';
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['_img'] = $result['name'];
					}
				}else{
					$data['_img'] = $this->input->post('_img');
				}
				 
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'banner/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Banner has been update successfully!');
					redirect(base_url($this->model.'/banner'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/banner'));
				}
			}
		}else{

			$data['title'] = 'Edit Banner';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'banner/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['banner'] = $records['data'];
			} 
			$franchise_id = $this->session->userdata('franchise_id');
			$firmname = $this->session->userdata('firmname');
			$franchise[0]['_id']=$franchise_id;
			$franchise[0]['firmname']= $firmname; 
			$data['franchise'] = $franchise;

			$this->load->view('includes/_header', $data);
			$this->load->view('banner/banner_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	}
	//-----------------------------------------------------------
	public function delete($id = 0)
	{
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'banner/delete/'.$id;
		$records = $this->Commonmodel->deleteData($url, $authtoken);
		if($records['sucess']=='200'){ 	 
			$this->session->set_flashdata('success', 'Banner has been deleted successfully!');
			redirect(base_url($this->model.'/banner'));
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			redirect(base_url($this->model.'/banner'));
		}
	}  


}

?>	