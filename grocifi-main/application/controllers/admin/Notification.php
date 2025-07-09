<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Notification extends MY_Controller {	
	public function __construct(){		
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

	//----------------------------------------------------------------
	public function index(){
		if($this->input->post('submit')){
				$this->form_validation->set_rules('title', 'Title', 'trim|required|xss_clean');
				$this->form_validation->set_rules('mbody', 'Message', 'trim|required'); 

				if ($this->form_validation->run() == FALSE) {
					$data = array(
						'errors' => validation_errors()
					);
					$authtoken = $this->session->userdata('authtoken');
					$url6 =  $this->config->item('APIURL') . 'franchise/index';
					$franData = $this->Commonmodel->getData($url6, $authtoken);
					$franchise = [];
					foreach ($franData['data'] as $key => $value) { 
						if($key==0){ $franchise_id = $value['_id']; }
						$franchise[$key]['_id']=$value['_id'];
						$franchise[$key]['firmname']= $value['firmname'];
					}
					$data['franchise'] = $franchise;
					
					$data['user'] = array( 
						'title' => $this->input->post('title'),
						'mbody' => $this->input->post('mbody'),  
					);
					$this->session->set_flashdata('errors', $data['errors']);
					$this->load->view('includes/_header');
					$this->load->view('notification/index', $data);
					$this->load->view('includes/_footer');
				}else{
				 
					$authtoken = $this->session->userdata('authtoken'); 
					$filedfile=$_FILES;   
					if(!empty($_FILES['notify_img']['name']))
					{    
						$filename = $_FILES["notify_img"]["tmp_name"];
			        	$request = array('notify_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["notify_img"]["type"], $_FILES["notify_img"]["name"]));  
						$url =  $this->config->item('APIURL') . 'notify/uploadimg/';
						$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
						if($result['sucess']=='200'){
							$data['notify_img'] = $result['name'];
						}
					}
					$franchiseId = $this->input->post('franchiseId');
					$data = array(  
						'title' => $this->input->post('title'),
						'mbody' => $this->input->post('mbody'),
						'is_general' => true, 
						'franchiseId' => $franchiseId
					);
					$data = $this->security->xss_clean($data);

					if($franchiseId==''){
						$url =  $this->config->item('APIURL') . 'notify/sendtoall/';
					}else{
						$url =  $this->config->item('APIURL') . 'notify/sendnotification/';
					}
					
					$authtoken = $this->session->userdata('authtoken'); 
					$result = $this->Commonmodel->postData($url, $data, $authtoken);	

					if(@$result['sucess']=='200'){ 
						$this->session->set_flashdata('success', 'Notification has been Send Successfully!');
						redirect(base_url($this->model.'/notification'), 'refresh');
					}else{
						$this->session->set_flashdata('error', $result['msg']);
						redirect(base_url($this->model.'/notification'), 'refresh'); 
					}
				}
			}else{
				$data['title'] = 'Notification'; 
				$authtoken = $this->session->userdata('authtoken');
				$url6 =  $this->config->item('APIURL') . 'franchise/index';
				$franData = $this->Commonmodel->getData($url6, $authtoken);
				$franchise = [];
				foreach ($franData['data'] as $key => $value) { 
					if($key==0){ $franchise_id = $value['_id']; }
					$franchise[$key]['_id']=$value['_id'];
					$franchise[$key]['firmname']= $value['firmname'];
				}
				$data['franchise'] = $franchise;

				$this->load->view('includes/_header',$data);
				$this->load->view('notification/index');
				$this->load->view('includes/_footer');
			}
	}

	 
}

?>	