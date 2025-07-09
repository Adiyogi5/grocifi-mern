<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Settings extends MY_Controller {

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
		$this->load->library('functions');
		$this->model = $this->session->userdata('model');
	}
 
	//-----------------------------------------------------------	
	public function holiday(){
		$data['title'] = 'Holiday List';
		$franchise_id = $this->session->userdata('franchise_id');
		$firmname = $this->session->userdata('firmname');
		$franchise[0]['_id']=$franchise_id;
		$franchise[0]['firmname']= $firmname; 
		$data['franchise'] = $franchise;

		$this->load->view('includes/_header', $data);
		$this->load->view('general_settings/holiday_list');
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	public function holiday_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET); 
		$franchise_id = $this->session->userdata('franchise_id');
		$filter = '&franchise_id='.$franchise_id;
		
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/getholidays?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$holiday_data = $this->Commonmodel->getData($url, $authtoken);

		$data = array(); 
		if(@$holiday_data['success']=='200'){  		
			$total = $holiday_data['total'];
			$filtered = $holiday_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=0;
			foreach ($holiday_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$data[]= array(
					++$i,
					isset($row['franchiseName'])?$row['franchiseName']:'',
					date_time($row['holiday_date']),
					$row['description'], 
					date_time($row['created']),	
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',
					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/settings/edithoilday/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					<a title="Delete" class="delete btn btn-sm btn-danger" href='.base_url($this->model."/settings/deletehoilday/".$row['_id']).' title="Delete" onclick="return confirm(\'Do you want to delete ?\')"> <i class="fa fa-trash-o"></i></a>'
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 
	
	//-----------------------------------------------------------
	public function change_holiday_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/updateholidaystatus';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);
	}

	//-----------------------------------------------------------
	public function addhoilday(){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('holiday_date', 'Holiday Date', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['user'] = array( 
					'holiday_date' => $this->input->post('holiday_date'),
					'franchiseId' => $this->input->post('franchiseId'),
					'description' => $this->input->post('description'), 
					'is_active' => $this->input->post('is_active'),
				);
				$franchise_id = $this->session->userdata('franchise_id');
				$firmname = $this->session->userdata('firmname');
				$franchise[0]['_id']=$franchise_id;
				$franchise[0]['firmname']= $firmname; 
				$data['franchise'] = $franchise;

				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('general_settings/holiday_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'holiday_date' => $this->input->post('holiday_date'),
					'franchiseId' => $this->input->post('franchiseId'),
					'description' => $this->input->post('description'), 
					'is_active' => $this->input->post('is_active'),
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'settings/saveholiday'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
 
				if($records['success']=='200'){
					$this->session->set_flashdata('success', 'Holiday has been added successfully!');
					redirect(base_url($this->model.'/settings/holiday'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/settings/holiday'));
				}
			}
		}else{

			$data['title'] = 'Add Holiday';
			$franchise_id = $this->session->userdata('franchise_id');
			$firmname = $this->session->userdata('firmname');
			$franchise[0]['_id']=$franchise_id;
			$franchise[0]['firmname']= $firmname; 
			$data['franchise'] = $franchise;

			$this->load->view('includes/_header', $data);
			$this->load->view('general_settings/holiday_add');
			$this->load->view('includes/_footer');
		}
		
	}

	//-----------------------------------------------------------
	public function edithoilday($id = 0){ 
		if($this->input->post('submit')){
			$this->form_validation->set_rules('holiday_date', 'Holiday Date', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['user'] = array( 
					'_id' => $this->input->post('_id'), 
					'holiday_date' => $this->input->post('holiday_date'),
					'franchiseId' => $this->input->post('franchiseId'),
					'description' => $this->input->post('description'), 
					'is_active' => $this->input->post('is_active'),
				);
				$franchise_id = $this->session->userdata('franchise_id');
				$firmname = $this->session->userdata('firmname');
				$franchise[0]['_id']=$franchise_id;
				$franchise[0]['firmname']= $firmname; 
				$data['franchise'] = $franchise; 

				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('general_settings/holiday_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'),
					'holiday_date' => $this->input->post('holiday_date'),
					'franchiseId' => $this->input->post('franchiseId'),
					'description' => $this->input->post('description'), 
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
					//'modified' => date('Y-m-d : h:m:s'),
				);
				$data = $this->security->xss_clean($data);
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'settings/updateholiday'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['success']=='200'){
					$this->session->set_flashdata('success', 'Holiday has been update successfully!');
					redirect(base_url($this->model.'/settings/holiday'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/settings/holiday'));
				}
			}
		}else{

			$data['title'] = 'Edit Holiday';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'settings/getholidaybyid/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['success']=='200'){
				$data['holiday'] = $records['data'];
			} 
			$franchise_id = $this->session->userdata('franchise_id');
			$firmname = $this->session->userdata('firmname');
			$franchise[0]['_id']=$franchise_id;
			$franchise[0]['firmname']= $firmname; 
			$data['franchise'] = $franchise;

			$this->load->view('includes/_header', $data);
			$this->load->view('general_settings/holiday_edit');
			$this->load->view('includes/_footer');
		}
		
	}

	//-----------------------------------------------------------
	public function deletehoilday($id = 0)
	{ 
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/removeholiday/'.$id;
		$records = $this->Commonmodel->deleteData($url, $authtoken);
		if($records['success']=='200'){ 	 
			$this->session->set_flashdata('success', 'Holiday has been deleted successfully!');
			redirect(base_url($this->model.'/settings/holiday'));
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			redirect(base_url($this->model.'/settings/holiday'));
		}
	} 

 
}

?>	