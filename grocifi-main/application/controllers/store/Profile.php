<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Profile extends MY_Controller {	
	public function __construct(){		
		parent::__construct();
		auth_franchise_check(); // check login auth
		$this->model = $this->session->userdata('model'); 
	}

	//----------------------------------------------------------------
	public function index(){ 
		if($this->input->post('submit')){
			$data['user'] = array( 
				'_id' => $this->session->userdata('admin_id'),
				'fname' => $this->input->post('fname'),
				'lname' => $this->input->post('lname'),
				'email' => $this->input->post('email'),
				'phone_no' => $this->input->post('phone_no'),
				'role_type' => $this->input->post('role_type') 
			);
			///prd($data);
			$data = $this->security->xss_clean($data);
			$url =  $this->config->item('APIURL') . 'user/edit';
			$authtoken = $this->session->userdata('authtoken'); 
			$result = $this->Commonmodel->postData($url, $data, $authtoken);	

			if(@$result['sucess']=='200'){
				$username = array('username'=> $this->input->post('fname')." ".$this->input->post('lname'));
				$this->session->set_userdata($username); 
				$this->session->set_flashdata('success', 'Profile has been Updated Successfully!');
				redirect(base_url($this->model.'/profile'), 'refresh');
			}else{
				$this->session->set_flashdata('error', $result['msg']);
				redirect(base_url($this->model.'/profile'), 'refresh'); 
			}
		}else{
			$data['title'] = 'Admin Profile';
			$id = $this->session->userdata('admin_id');  
			$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
			$authtoken = $this->session->userdata('authtoken'); 
			$profileresult = $this->Commonmodel->getData($url, $authtoken);	  
			$data['admin'] = $profileresult['data'];

			$this->load->view('includes/_header');
			$this->load->view('profile/index', $data);
			$this->load->view('includes/_footer');
		}
	}

	//-------------------------------------------------------------------------
	public function change_pwd(){ 
		$id = $this->session->userdata('admin_id');
		if($this->input->post('submit')){
			$this->form_validation->set_rules('password', 'Password', 'trim|required');
			$this->form_validation->set_rules('oldpassword', 'Old Password', 'trim|required');
			$this->form_validation->set_rules('confirm_pwd', 'Confirm Password', 'trim|required|matches[password]');

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);				
				$this->session->set_flashdata('errors', $data['errors']);
				redirect(base_url($this->model.'/profile/change_pwd'),'refresh');
			}else{ 
				$data = array( 
					'_id' => $this->session->userdata('admin_id'),
					'password' => $this->input->post('password'),
					'confirm_pwd' => $this->input->post('confirm_pwd'),
					'oldpassword' => $this->input->post('oldpassword')
				);
				$data = $this->security->xss_clean($data);
				$url =  $this->config->item('APIURL') . 'changepassword/';
				$authtoken = $this->session->userdata('authtoken'); 
				$result = $this->Commonmodel->postData($url, $data, $authtoken);	  
				///print_r($result); exit;
				if(@$result['sucess']=='200'){
					$this->session->set_flashdata('success', 'Password has been changed successfully!');
					redirect(base_url($this->model.'/profile/change_pwd'), 'refresh');
				}else{ 
					$this->session->set_flashdata('error', 'Something is wrong ,unable to change password');
					redirect(base_url($this->model.'/profile/change_pwd'));
				} 
			}
		}else{			
			$data['title'] = 'Change Password'; 
			
			$this->load->view('includes/_header');
			$this->load->view('profile/change_pwd');
			$this->load->view('includes/_footer');
		}
	}
}

?>	