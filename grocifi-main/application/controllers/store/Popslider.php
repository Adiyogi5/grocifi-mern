<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Popslider extends MY_Controller {	
	public function __construct(){		
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

	//----------------------------------------------------------------
	public function index(){
		if($this->input->post('submit')){ 
				 
				$authtoken = $this->session->userdata('authtoken'); 
				$filedfile=$_FILES;   
				$franchiseId = $this->input->post('franchiseId');
				$data = [];		
				$imgs = $_FILES['popup_img'];			
				$i=0;
				foreach ($_FILES['popup_img']['name'] as $key => $value) {					
					if(!empty($value))
					{    
						$filename = $imgs["tmp_name"][$key];
			        	$request = array('popup_img' => $this->Commonmodel->getCurlValue($filename, $imgs["type"][$key], $value));  
						$url =  $this->config->item('APIURL') . 'popupimg/uploadimg/';
						$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
						if($result['sucess']=='200'){
							$data[$i]['popup_img'] = $result['name'];
							$data[$i]['franchiseId'] = $franchiseId[$key];
							$data[$i]['is_active'] = 1;
						}
						$i++;
					}	
				} 
				$data = $this->security->xss_clean($data);
 				$url =  $this->config->item('APIURL') . 'popupimg/save/';	 
				$authtoken = $this->session->userdata('authtoken'); 
				$result = $this->Commonmodel->postData($url, $data, $authtoken);	

				if(@$result['sucess']=='200'){ 
					$this->session->set_flashdata('success', 'Popup Slider has been Send Successfully!');
					redirect(base_url($this->model.'/popslider'), 'refresh');
				}else{
					$this->session->set_flashdata('error', $result['msg']);
					redirect(base_url($this->model.'/popslider'), 'refresh'); 
				}
				
			}else{
				$data['title'] = 'Popup Slider'; 
				$authtoken = $this->session->userdata('authtoken');
				$franchise_id = $this->session->userdata('franchise_id');
				$firmname = $this->session->userdata('firmname');
				$franchise[0]['_id']=$franchise_id;
				$franchise[0]['firmname']= $firmname;				 
				$data['franchise'] = $franchise;

				$url =  $this->config->item('APIURL') . 'popupimg/getpopupimg/';	 
				$authtoken = $this->session->userdata('authtoken'); 
				$result = $this->Commonmodel->getData($url, $authtoken);
				$data['popimg'] = [];
				$data['popactive'] = [];
				if(@$result['sucess']=='200'){
					$popimg = []; $popactive =[];
					foreach ($result['data'] as $key => $value) {
						$popimg[$value['franchiseId']] = $this->config->item('APIIMAGES').'popup_img/'.$value['popup_img'];
						$popactive[$value['franchiseId']] = $value['is_active'];

					}
					$data['popimg'] = $popimg;
					$data['popactive'] = $popactive;
				} 

				$this->load->view('includes/_header',$data);
				$this->load->view('popslider/index');
				$this->load->view('includes/_footer');
			}
	}

	 
		//-----------------------------------------------------------
	public function remove($id = 0)
	{
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'popupimg/deletepopupimg/'.$id;
		$records = $this->Commonmodel->deleteData($url, $authtoken);
		
		if($records['sucess']=='200'){ 	 
			$this->session->set_flashdata('success', 'Popup Image has been deleted successfully!');
			redirect(base_url($this->model.'/popslider'));
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			redirect(base_url($this->model.'/popslider'));
		}
	}  

}

?>	