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
		auth_check(); // check login auth 
		$this->load->library('functions');
		$this->model = $this->session->userdata('model');
	}

	//---------------------------------------------------------------
	// General Setting View
	public function index()
	{ 
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/index';
		$settings_data = $this->Commonmodel->getData($url, TOKEN);
		$general_settings_data = $settings_data['data'];
		// prd($general_settings_data);
		$removeFiled = array('modifiedby','createdby','created','modified','__v','_id','ad_img','marg_Proentry_date','marg_autoentry_date','friend_three_earn','friend_four_earn','friend_five_earn','friend_three_earn_percentage','friend_four_earn_percentage','friend_five_earn_percentage','is_wholesaler' 

			,'min_amount','max_product_return_days','system_configurations','system_configurations_id','delivery_refund_limit','system_timezone_gmt','minimum_withdrawal_amount','delivery_boy_bonus_percentage','expiry_day','email_on_status','email_on_wallet',
			'email_on_general','tax','api_url','cat_column','fcm_Id','current_version_app','mini_version','sms_on_status','sms_on_wallet','sms_on_general','min_refer_earn_order_amount', 'refer_earn_bonus', 'refer_earn_method', 'max_refer_earn_amount', 'refmsg_onRegistration','earn_msg', 'share_msg', 
			'free_delivery_message', 'min_ordermsg', 'checkout_deliveryChargeMessage', 
			'device_reg_msg', 'free_msg', 'cart_note', 'delivery_time_full_note', 
			'delivery_time_note', 'wholesale_registration_msg', 'min_amount', 'max_product_return_days' ,'is_paytm','paytm_mid','paytm_mkey');
		$imageType = array('logo','favicon','ad_img','logowhite');
		$textType = array('earn_msg','share_msg','free_delivery_message','key_fcm_id','checkout_deliveryChargeMessage','site_address','device_reg_msg','cart_note','delivery_time_full_note','delivery_time_note','wholesale_registration_msg','maplink');
		$selectType = array('force_update','is_refer','accept_minimum_order','reg_required','give_reg_amount','refer_earn','ad_flag','is_razorpay','is_paytm','is_cod','is_marg','email_on_status','sms_on_status','email_on_wallet','sms_on_wallet','email_on_general','sms_on_general','is_orderrefer','is_wholesaler','maintainance_mode');
		$passwordType = array();
		$parent_setting = array(
							'type'=>array(
								'1'=>"basic", 
								'2'=>"mobile", 
								'3'=>"smsData",  
								'4'=>"paymentData",
								'5'=>"refferData",
								//'6'=>"msgData",
								'7'=>"orderData",
								//'8'=>"margapi"  
							),
							'name'=>array(
								'1'=>"General Setting", 
								'2'=>"Mobile App Setting", 
								'3'=>"SMS Setting", 
								'4'=>"Payment Setting",
								'5'=>"Refer Setting",
								//'6'=>"Message Setting",
								'7'=>"Order Setting",
								//'8'=>"Marg API"
							) );
		/*$basic = array('site_name','logo','favicon','email','fcm_Id','mobile_no','from_email','reply_email','short_link');*/
		$mobile = array('app_name','current_version_app','mini_version','key_fcm_id','fcm_Id','version_code','androidurl','iosurl','short_link');
		$smsData = array('textLocalHash','textLocalUser','textLocalSender','sms_on_status','sms_on_wallet','sms_on_general','');
		$paymentData = array('is_cod','is_razorpay','razor_key_id','razor_key_secret');
		$refferData = array('is_refer','use_refer_code_amount','min_refer_earn_order_amount','refer_earn_bonus','refer_earn_method','max_refer_earn_amount','friend_one_earn','friend_two_earn','friend_three_earn','friend_four_earn','friend_five_earn','friend_one_earn_percentage','friend_two_earn_percentage','friend_three_earn_percentage','friend_four_earn_percentage','friend_five_earn_percentage','refmsg_onRegistration','refer_earn','give_reg_amount','is_orderrefer');
		$msgData = array('earn_msg','share_msg','free_delivery_message','checkout_deliveryChargeMessage','device_reg_msg','cart_note','delivery_time_full_note','delivery_time_note','free_msg','min_ordermsg','wholesale_registration_msg');
		$margapi =array('is_marg','marg_ApiUrl','marg_companycode','marg_Id','marg_Key');
		$orderData =array('delivery_day_after_order','min_order','accept_minimum_order','delivery_chrge','min_amount','max_product_return_days','delivery_max_day','min_order_wholesaler','delivery_boy_bonus_percentage');

		foreach ($general_settings_data[0] as $skey => $svalue) {
			if(!in_array($skey, $removeFiled)){
			
				if(in_array($skey, $mobile)){	
					$gs=2; 
				}elseif(in_array($skey, $smsData)){	
					$gs=3;
				}elseif(in_array($skey, $paymentData)){	
					$gs=4;
				}elseif(in_array($skey, $refferData)){	
					$gs=5;
				}elseif(in_array($skey, $msgData)){	
					$gs=6;
				}elseif(in_array($skey, $orderData)){	
					$gs=7;
				}elseif(in_array($skey, $margapi)){	
					$gs=8;
				}else{
					$gs=1;
				}	
	           	$data['general_settings'][$gs][$skey]['filedval'] = $skey;
	           	$data['general_settings'][$gs][$skey]['filed_value'] = $svalue; 
	           	$data['general_settings'][$gs][$skey]['filed_label'] = $skey;
	           	if(in_array($skey, $imageType)){
	           		$data['general_settings'][$gs][$skey]['filed_type'] = "file";
	       		}elseif(in_array($skey, $textType)){	
	           		$data['general_settings'][$gs][$skey]['filed_type'] = "textarea";
	           	}elseif(in_array($skey, $passwordType)){
	           		$data['general_settings'][$gs][$skey]['filed_type'] = "password";
	           	}elseif(in_array($skey, $selectType)){
	           		$data['general_settings'][$gs][$skey]['filed_type'] = "select";
	           	}else{
	           		$data['general_settings'][$gs][$skey]['filed_type'] = "text";
	           	}
            }
            if($skey=='_id'){
            	$id = $svalue; 
            }
        }   
        ///prd($data['general_settings']);
        $data['parent_setting'] = $parent_setting;
		$data['title'] = 'General Setting';  
		$data['id'] = $id;
		$this->load->view('includes/_header', $data);
		$this->load->view('general_settings/setting', $data);
		$this->load->view('includes/_footer');
	}

	//-------------------------------------------------------------------------
	public function updatesetting()
	{ 
		// TOKEN = $this->session->userdata('authtoken'); 
		$data = $this->input->post();
		$filedfile=$_FILES;   
		if(!empty($_FILES['logo']['name']))
		{    
			$filename = $_FILES["logo"]["tmp_name"];
        	$request = array('logo' => $this->Commonmodel->getCurlValue($filename, $_FILES["logo"]["type"], $_FILES["logo"]["name"]));  
			$url =  $this->config->item('APIURL') . 'settings/uploadsitelogo/';
			$result = $this->Commonmodel->postImgCurl($url, $request , TOKEN); 
			if($result['sucess']=='200'){
				$data['logoImg'] = $result['name'];
			}
		}
		if(!empty($_FILES['favicon']['name']))
		{  	
			$filename = $_FILES["favicon"]["tmp_name"];
        	$request = array('favicon' => $this->Commonmodel->getCurlValue($filename, $_FILES["favicon"]["type"], $_FILES["favicon"]["name"])); 
			$url =  $this->config->item('APIURL') . 'settings/uploadsitefav/';
			$result = $this->Commonmodel->postImgCurl($url, $request, TOKEN);
			if($result['sucess']=='200'){
				$data['favImg'] = $result['name'];
			}
		} 	 

		if(!empty($_FILES['logowhite']['name']))
		{  	
			$filename = $_FILES["logowhite"]["tmp_name"];
        	$request = array('logowhite' => $this->Commonmodel->getCurlValue($filename, $_FILES["logowhite"]["type"], $_FILES["logowhite"]["name"])); 
			$url =  $this->config->item('APIURL') . 'settings/uploadLogowhite/';
			$whitelogoimg = $this->Commonmodel->postImgCurl($url, $request, TOKEN);
			
			if(@$whitelogoimg['sucess']=='200'){
				$data['logowhite'] = $whitelogoimg['name'];
			}
		} 	 
	
		$url =  $this->config->item('APIURL') . 'settings/edit';
		$result = $this->Commonmodel->postData($url, $data, TOKEN);
		
		if(@$result['success']=='200'){  
			$this->session->set_flashdata('success', 'Setting has been changed Successfully!');
			redirect(base_url($this->model.'/settings'), 'refresh');
		}else{
			$this->session->set_flashdata('error', $result['msg']);
			redirect(base_url($this->model.'/settings'), 'refresh'); 
		} 		 
	}
	//-----------------------------------------------------------
	public function cms()
	{ 
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'cmssettings/index';
		$settings_data = $this->Commonmodel->getData($url, TOKEN);	
		$general_settings_data = $settings_data['data']; 
		foreach ($general_settings_data[0] as $skey => $svalue) { 
           	$data['general_settings'][$skey] = $svalue;  
           	if($skey=='_id'){
            	$id = $svalue; 
            }
		}
		
		$cms_content = [];
		foreach ($data['general_settings']['cms_content'] as $ckey => $cms) {
			foreach ($cms as $key => $value) {
				if($key=='Privacy_Policy'){ $key='Privacy Policy'; }
				if($key=='Terms_&_Conditions'){ $key='Terms & Conditions'; }
				$cms_content[$key] = $value;
			}
		}
		//prd($cms_content);
		$data['cms_content'] = $cms_content;
		$data['title'] = 'General Setting';  
		$data['id'] = $id; 
		$this->load->view('includes/_header', $data);
		$this->load->view('general_settings/cms', $data);
		$this->load->view('includes/_footer');
	}

	public function updatecms(){
		// TOKEN = $this->session->userdata('authtoken'); 
		$variable = $this->input->post();
		$data['_id'] = $this->input->post('_id');
		$i=0;
		$notarray = array('submit','_id','_wysihtml5_mode');
		foreach ($variable as $key => $value) {
			if($key!='0' && !in_array($key, $notarray)){
				if($key=='Privacy_Policy'){ $key='Privacy Policy'; }
				if($key=='Terms_&_Conditions'){ $key='Terms & Conditions'; }
				$data['cms_content'][$i][$key] = $value;
				$i++;
			} 
		} 
		///prd($data);
		$url =  $this->config->item('APIURL') . 'settings/editcms/';
		$result = $this->Commonmodel->postData($url, $data, TOKEN);	
		if(@$result['success']=='200'){  
			$this->session->set_flashdata('success', 'CMS has been changed Successfully!');
			redirect(base_url($this->model.'/settings/cms'), 'refresh');
		}else{
			$this->session->set_flashdata('error', $result['msg']);
			redirect(base_url($this->model.'/settings/cms'), 'refresh'); 
		} 	
	}

	//-----------------------------------------------------------
	public function admanager(){
		if($this->input->post('submit')){			
			// TOKEN = $this->session->userdata('authtoken'); 
			$data = $this->input->post();
			$filedfile=$_FILES;   
			if(!empty($_FILES['add_img']['name']))
			{    
				$filename = $_FILES["add_img"]["tmp_name"];
	        	$request = array('ad_img' => $this->Commonmodel->getCurlValue($filename, $_FILES["add_img"]["type"], $_FILES["add_img"]["name"]));  
				$url =  $this->config->item('APIURL') . 'settings/uploadadimage/';
				$result = $this->Commonmodel->postImgCurl($url, $request , TOKEN); 
				if($result['sucess']=='200'){
					$data['ad_img'] = $result['name'];
				}
			} 
			if(@$result['sucess']=='200'){  
				$this->session->set_flashdata('success', 'Add Manager has been update Successfully!');
				redirect(base_url($this->model.'/settings/admanager'), 'refresh');
			}else{

				$this->session->set_flashdata('error', "Something went wrong please again!!");
				redirect(base_url($this->model.'/settings/admanager'), 'refresh'); 
			} 
		} else{
			$data['title'] = 'Ad Manager';
			// TOKEN = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'settings/index';
			$settings_data = $this->Commonmodel->getData($url, TOKEN);	
			$general_settings_data = $settings_data['data'];
			$ad_img = '';
			foreach ($general_settings_data[0] as $skey => $svalue) {
				if($skey=='ad_img'){
					$ad_img = $svalue;
				}
			}
			$data['ad_img'] = $ad_img;
			$this->load->view('includes/_header', $data);
			$this->load->view('general_settings/admanager', $data);
			$this->load->view('includes/_footer');
		}
	}

	//-----------------------------------------------------------
	public function delivery_time_slot(){

		if($this->input->post('submit')){			
			// TOKEN = $this->session->userdata('authtoken'); 
			$data = $this->input->post();
			
			$url =  $this->config->item('APIURL') . 'settings/savedeliverytimeslot/';
			$result = $this->Commonmodel->postData($url, $data, TOKEN);	
		 
			if(@$result['success']=='200'){  
				$this->session->set_flashdata('success', 'Delivery Time Slot has been update Successfully!');
				redirect(base_url($this->model.'/settings/delivery_time_slot'), 'refresh');
			}else{
				$this->session->set_flashdata('error', $result['msg']);
				redirect(base_url($this->model.'/settings/delivery_time_slot'), 'refresh'); 
			} 
		} else{
			$data['title'] = 'Delivery Time Slot';
			// TOKEN = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'settings/getdeliverytimeslot';
			$settings_data = $this->Commonmodel->getData($url, TOKEN);	

			$delivery_time = $settings_data['data'];
			$data['delivery_time'] = $delivery_time[0]; 

			$this->load->view('includes/_header', $data);
			$this->load->view('general_settings/deliverytimeslot', $data);
			$this->load->view('includes/_footer');
		}
	}

	//-----------------------------------------------------------
	public function setting_delivery_slot(){
		

		$data['title'] = 'Setting Delivery Slot';
		// TOKEN = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'settings/getdeliveryslot';
		$settings_data = $this->Commonmodel->getData($url, TOKEN);	
		$data['delivery_time'] = [];
		if(@$settings_data['success'] == 200){
			$data['delivery_time'] = $settings_data['data']; 
		}
		
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, TOKEN);

		$franchise = [];
		foreach ($franData['data'] as $key => $value) {
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}

		$data['franchise'] = isset($franchise)?$franchise:[];
		if($this->input->post('submit')){	
			$this->form_validation->set_rules('franchiseId', 'franchise Id', 'trim|required|strip_tags|xss_clean');
			if($this->input->post('timeslot') ){
				foreach ($this->input->post('timeslot') as $key => $value) {
					$this->form_validation->set_rules('timeslot['.$key.'][value]', 'Time Slot '.($key+ 1) , 'trim|required|strip_tags|xss_clean');
				}	
			}else{
				$this->form_validation->set_rules('timeslot', 'Time Slot ', 'trim|required|strip_tags|xss_clean');
			}
			
			if ($this->form_validation->run() == FALSE) {
				$data['errors'] = validation_errors();
		
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header', $data);
				$this->load->view('general_settings/setting-time-slot', $data);
				$this->load->view('includes/_footer');
				return;
			}else{
				
				$postData = $this->input->post('timeslot');
				$insertData = [];
				$i = 0;
				foreach ($postData as $key => $value) {
					$insertData[$i] = $value;
					$insertData[$i]['franchiseId'] =$this->input->post('franchiseId'); 
					$i++;
				}
				$url =  $this->config->item('APIURL') . 'settings/savedeliveryslot/';
				$result = $this->Commonmodel->postData($url, $insertData, TOKEN);	
			 
				if(@$result['success']=='200'){  
					$this->session->set_flashdata('success', 'Delivery Time Slot has been update Successfully!');
					redirect(base_url($this->model.'/settings/setting_delivery_slot'), 'refresh');
				}else{
					$this->session->set_flashdata('error', $result['msg']);
					redirect(base_url($this->model.'/settings/setting_delivery_slot'), 'refresh'); 
				} 
			}
		} 

		$this->load->view('includes/_header', $data);
		$this->load->view('general_settings/setting-time-slot', $data);
		$this->load->view('includes/_footer');
	}

	public function get_franchise_timeslote(){   
		$id = $this->input->get('_id');
		$url =  $this->config->item('APIURL') . 'settings/getdeliveryslot/'.$id;
		$settings_data = $this->Commonmodel->getData($url, TOKEN);	
		$delivery_time = [];
		$data = array('status'=>false,'message'=>'','data'=>[]);
		if(@$settings_data['success'] == 200){
			$delivery_time = $settings_data['data']; 
			$data = array('status'=>true,'message'=>'','data'=>$delivery_time);
		}

		echo json_encode($data);
	}


	//-----------------------------------------------------------	
	public function holiday(){

		$data['title'] = 'Holiday List';
		// TOKEN = $this->session->userdata('authtoken');
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, TOKEN);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			if($key==0){ $franchise_id =$value['_id']; }
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}
		$data['franchise'] = $franchise;

		$this->load->view('includes/_header', $data);
		$this->load->view('general_settings/holiday_list');
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	public function holiday_datatable_json(){

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
		
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/getholidays?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).$filter;
		
		$holiday_data = $this->Commonmodel->getData($url, TOKEN);

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
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/updateholidaystatus';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, TOKEN);	
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
				// TOKEN = $this->session->userdata('authtoken'); 
				$url =  $this->config->item('APIURL') . 'franchise/index';		
				$franchise_data = $this->Commonmodel->getData($url, TOKEN);
				if(@$franchise_data['sucess']=='200'){ 
					$data['franchise'] = $franchise_data['data'];
				} 
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
				// TOKEN = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'settings/saveholiday'; 
				$records = $this->Commonmodel->postData($url, $data, TOKEN);
 
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
			// TOKEN = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, TOKEN); 
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 

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
				// TOKEN = $this->session->userdata('authtoken'); 
				$url =  $this->config->item('APIURL') . 'franchise/index';		
				$franchise_data = $this->Commonmodel->getData($url, TOKEN);
				if(@$franchise_data['sucess']=='200'){ 
					$data['franchise'] = $franchise_data['data'];
				} 
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
				// TOKEN = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'settings/updateholiday'; 
				$records = $this->Commonmodel->postData($url, $data, TOKEN);
			 
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
			// TOKEN = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'settings/getholidaybyid/'.$id;
			$records = $this->Commonmodel->getData($url, TOKEN);
			if($records['success']=='200'){
				$data['holiday'] = $records['data'];
			} 
			// TOKEN = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'franchise/index';		
			$franchise_data = $this->Commonmodel->getData($url, TOKEN); 
			if(@$franchise_data['sucess']=='200'){ 
				$data['franchise'] = $franchise_data['data'];
			} 

			$this->load->view('includes/_header', $data);
			$this->load->view('general_settings/holiday_edit');
			$this->load->view('includes/_footer');
		}
		
	}

	//-----------------------------------------------------------
	public function deletehoilday($id = 0)
	{
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'settings/removeholiday/'.$id;
		$records = $this->Commonmodel->deleteData($url, TOKEN);
		if($records['success']=='200'){ 	 
			$this->session->set_flashdata('success', 'Holiday has been deleted successfully!');
			redirect(base_url($this->model.'/settings/holiday'));
		}else{
			$this->session->set_flashdata('error', $records['msg']);
			redirect(base_url($this->model.'/settings/holiday'));
		}
	} 

	//-----------------------------------------------------------	
	public function rolemanager(){

		$data['title'] = 'Roles List';
		$this->load->view('includes/_header', $data);
		$this->load->view('general_settings/role_list');
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	public function rolemanager_datatable_json(){

		$tableData = $this->Commonmodel->dataTableData($_GET);
  
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'roles/getroles?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		
		$rolemanager_data = $this->Commonmodel->getData($url, TOKEN);

		$data = array(); 
		if(@$rolemanager_data['success']=='200'){  		
			$total = $rolemanager_data['total'];
			$filtered = $rolemanager_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=0;
			foreach ($rolemanager_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$edit = '--';
				$nstatus ='--';
				$nallow = array('1','2','3','4','5','6');
				if(!in_array($row['role_code'], $nallow)){
				$nstatus ='<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>';
				$edit = '<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/settings/editrole/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>';
				}
				$data[]= array(
					++$i,
					isset($row['title'])?$row['title']:'', 
					$row['role_code'],  	
					$nstatus,		
					$edit
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 

	//-----------------------------------------------------------
	public function change_role_status(){   
		// TOKEN = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'roles/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, TOKEN);	
		$data = array();  
		echo json_encode($records);
	}
 
	//-----------------------------------------------------------
	public function editrole($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Role Name', 'trim|required|strip_tags|xss_clean'); 
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['user'] = array( 
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'),
				); 
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('general_settings/edit_role', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'),
					'title' => $this->input->post('title'),  
					'is_active' => $this->input->post('is_active'), 
					'modifiedby' =>  $this->session->userdata('admin_id'),  
				);
				$data = $this->security->xss_clean($data);
				// TOKEN = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'roles/update'; 
				$records = $this->Commonmodel->postData($url, $data, TOKEN);
			 	
				if($records['success']=='200'){
					$this->session->set_flashdata('success', 'Role has been update successfully!');
					redirect(base_url($this->model.'/settings/rolemanager'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/settings/rolemanager'));
				}
			}
		}else{

			$data['title'] = 'Edit Role';
			// TOKEN = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'roles/edit/'.$id;
			$records = $this->Commonmodel->getData($url, TOKEN);
			if($records['success']=='200'){
				$data['role'] = $records['data'];
			} 
			
			$this->load->view('includes/_header', $data);
			$this->load->view('general_settings/edit_role');
			$this->load->view('includes/_footer');
		}
		
	}
}

?>	