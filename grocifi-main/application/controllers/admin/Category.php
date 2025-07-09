<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Category extends MY_Controller {

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


	//---------------------------Category----------------------------	
	public function index(){
		$data['title'] = 'Category List';
		$this->load->view('includes/_header', $data);
		$this->load->view('category/category_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function category_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'catagory/list?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$category_data = $this->Commonmodel->getData($url, $authtoken); 
		///print_r($category_data); exit;
		$data = array(); 
		if(@$category_data['sucess']=='200'){  		
			$total = $category_data['total'];
			$filtered = $category_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($category_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>';  
				$data[]= array(
					++$i, 
					$row['title'], 
					isset($row['mainCategory'])?$row['mainCategory']:' - ',
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/category/editcategory/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_category_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'catagory/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id'); 
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addcategory(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			$this->form_validation->set_rules('priority', 'Priority', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('slug', 'SEO Url', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('coming_soon', 'Coming Soon', 'trim|required');
			$this->form_validation->set_rules('allow_upload', 'Allow Upload', 'trim|required'); 
			if (empty($_FILES['catagory_img']['name']))
			{
			    $this->form_validation->set_rules('catagory_img', 'Image', 'required');
			}

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['category'] = array( 
					'title' => $this->input->post('title'), 
					'catagory_id'=> $this->input->post('catagory_id'),
					'priority'=> $this->input->post('priority'),
					'slug'=> $this->input->post('slug'),
					'coming_soon'=> $this->input->post('coming_soon'),
					'allow_upload'=> $this->input->post('allow_upload'),
					'description'=> $this->input->post('description'),
					'is_active' => $this->input->post('is_active'),
					'is_feature' => $this->input->post('is_feature'),
				); 				
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'catagory/index';
				$records = $this->Commonmodel->getData($url, $authtoken); 
				if($records['sucess']=='200'){
					$data['maincategory'] = $records['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('category/category_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
					'is_feature' => $this->input->post('is_feature'),
					'catagory_id'=> !empty($this->input->post('catagory_id'))?$this->input->post('catagory_id'):'',
					'priority'=> $this->input->post('priority'),
					'slug'=> $this->input->post('slug'),
					'description'=> $this->input->post('description'),
					'coming_soon'=> $this->input->post('coming_soon'),
					'allow_upload'=> $this->input->post('allow_upload'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				if(!empty($_FILES['catagory_img']['name']))
				{    
					$filename = $_FILES["catagory_img"]["tmp_name"];
		        	$request = array('catagory_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["catagory_img"]["type"], $_FILES["catagory_img"]["name"]));  
					$url =  $this->config->item('APIURL') . 'catagory/uploadcatimg/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['cat_image'] = $result['name'];
					}
				}
				$data = $this->security->xss_clean($data);
 	
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'catagory/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 	
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Category has been added successfully!');
					redirect(base_url($this->model.'/category'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/category'));
				}
			}
		}else{
			$data['title'] = 'Add Category';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'catagory/index';
			$records = $this->Commonmodel->getData($url, $authtoken); 
			if($records['sucess']=='200'){
				$data['maincategory'] = $records['data'];
			}
			$this->load->view('includes/_header', $data);
			$this->load->view('category/category_add');
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editcategory($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			$this->form_validation->set_rules('priority', 'Priority', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('slug', 'SEO Url', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('coming_soon', 'Coming Soon', 'trim|required');
			$this->form_validation->set_rules('allow_upload', 'Allow Upload', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['category'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'catagory_id'=> $this->input->post('catagory_id'),
					'priority'=> $this->input->post('priority'),
					'slug'=> $this->input->post('slug'),
					'coming_soon'=> $this->input->post('coming_soon'),
					'allow_upload'=> $this->input->post('allow_upload'),
					'description'=> $this->input->post('description'),
					'is_active' => $this->input->post('is_active'),
					'is_feature' => $this->input->post('is_feature'),
				); 
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'catagory/index';
				$records = $this->Commonmodel->getData($url, $authtoken); 
				if($records['sucess']=='200'){
					$data['maincategory'] = $records['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('category/category_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
					'is_feature' => $this->input->post('is_feature'),
					'catagory_id'=> !empty($this->input->post('catagory_id'))?$this->input->post('catagory_id'):'',
					'priority'=> $this->input->post('priority'),
					'slug'=> $this->input->post('slug'),
					'coming_soon'=> $this->input->post('coming_soon'),
					'allow_upload'=> $this->input->post('allow_upload'),
					'description'=> $this->input->post('description'), 
					'modifiedby' =>  $this->session->userdata('admin_id')
				);
				if(!empty($_FILES['catagory_img']['name']))
				{    
					$filename = $_FILES["catagory_img"]["tmp_name"];
		        	$request = array('catagory_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["catagory_img"]["type"], $_FILES["catagory_img"]["name"]));  
					$url =  $this->config->item('APIURL') . 'catagory/uploadcatimg/';
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
					if($result['sucess']=='200'){
						$data['cat_image'] = $result['name'];
					}
				}else{
					$data['cat_image'] = $this->input->post('cat_image');
				}
				 
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'catagory/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Category has been update successfully!');
					redirect(base_url($this->model.'/category'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/category'));
				}
			}
		}else{

			$data['title'] = 'Edit Category';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'catagory/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);

			if($records['sucess']=='200'){
				$data['category'] = $records['data'];
			}  
			$url =  $this->config->item('APIURL') . 'catagory/index';
			$records = $this->Commonmodel->getData($url, $authtoken); 
			if($records['sucess']=='200'){
				$data['maincategory'] = $records['data'];
			}
			////echo "<pre>"; print_r($data); exit;
			$this->load->view('includes/_header', $data);
			$this->load->view('category/category_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	}  


}

?>	