<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Product extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		if($this->router->fetch_method()!='syncMargproduct'){
			check_user_premissions(
			$this->session->userdata('role_type'), 
			$this->session->userdata('admin_id'),
			$this->router->fetch_class(), 
			$this->router->fetch_method()
			);		
			auth_check(); // check login auth  
			$this->model = $this->session->userdata('model');
		}
	}

	//---------------------------Product--------------------------------
	public function index(){

		$data['title'] = 'Product List';

		$this->load->view('includes/_header', $data);
		$this->load->view('product/product_list');
		$this->load->view('includes/_footer');
	}
	//-----------------------------------------------------------
	public function product_datatable_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);
  		
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'product/index?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.urlencode($tableData['where']).'';
		 
		$product_data = $this->Commonmodel->getData($url, $authtoken); 
		///print_r($product_data); exit;
		$data = array(); 
		if(@$product_data['sucess']=='200'){  		
			$total = $product_data['total'];
			$filtered = $product_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			$i=$tableData['start'];
			foreach ($product_data['data']  as $row) 
			{  
				$status = ($row['is_active'] == 1)? 'checked': '';
				$del = ($row['is_active'] != '0')?'<span id="deb_'.$row['_id'].'"><a title="Delete" class="delete btn btn-sm btn-danger tgl_delete"  data-id="'.$row['_id'].'" id="db_'.$row['_id'].'" data-ftype="product" title="Delete" > <i class="fa fa-trash-o"></i></a></span>':'<span id="deb_'.$row['_id'].'"></span>';  
				$data[]= array(
					++$i, 
					$row['title'], 
					isset($row['catName'])?$row['catName']:' - ',
					date_time($row['created']),	
					$row['is_global'],
					'<input class="tgl_checkbox tgl-ios" 
					data-id="'.$row['_id'].'" 
					id="cb_'.$row['_id'].'"
					type="checkbox"  
					'.$status.'><label for="cb_'.$row['_id'].'"></label>',		

					'<a title="Edit" class="update btn btn-sm btn-warning" href="'.base_url($this->model.'/product/editproduct/'.$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>
					'.$del.''
				);
			}
		}
		$records['data']=$data;
		echo json_encode($records);						   
	} 	
	//-----------------------------------------------------------
	public function change_product_status(){   
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . 'product/status';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		$records['data']['id']= $this->input->post('_id');
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function addproduct(){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			$this->form_validation->set_rules('catId', 'Category', 'trim|required');
			$this->form_validation->set_rules('search_title', 'Search By', 'trim|required|strip_tags|xss_clean'); 
			if (empty($_FILES['imgs']['name']))
			{
			    $this->form_validation->set_rules('imgs', 'Image', 'required');
			}

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['product'] = array( 
					'title' => $this->input->post('title'), 
					'catId'=> $this->input->post('catId'),
					'search_title'=> $this->input->post('search_title'), 
					'description'=> $this->input->post('description'),
					'is_active' => $this->input->post('is_active'),
					'is_global' => $this->input->post('is_global'),
				); 				
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'catagory/getcatlist';
				$records = $this->Commonmodel->getData($url, $authtoken); 
				if($records['sucess']=='200'){
					$data['category'] = $records['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('product/product_add', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array( 
					'title' => $this->input->post('title'), 
					'is_active' => $this->input->post('is_active'), 
					'is_global' => $this->input->post('is_global'),
					'catId'=> $this->input->post('catId'),
					'description'=> $this->input->post('description'),
					'search_title'=> $this->input->post('search_title'), 
					'createdby' =>  $this->session->userdata('admin_id'),
					'created' => date('Y-m-d : h:m:s'),
					'modified' => date('Y-m-d : h:m:s'),
				);
				$proimg = '';
				if(!empty($_FILES['imgs']['name'][0]))
				{    
					$imgs = $_FILES['imgs'];
					foreach ($imgs['name'] as $key => $value) {
						$filename = $imgs["tmp_name"][$key];
						$request = array('product_img' => $this->Commonmodel->getCurlValue($filename, $imgs["type"][$key], $value));  
						$url =  $this->config->item('APIURL') . 'product/uploadimg/';
						$authtoken = $this->session->userdata('authtoken'); 
						$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
						if($result['sucess']=='200'){
							$proimg.= $result['name'].',';
						}
					}
				}
				if(!empty($proimg)){ $data['_imgs'] = substr($proimg,0,strlen($proimg)-1); }
				$data = $this->security->xss_clean($data); 
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'product/save'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken); 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Product has been added successfully!');
					redirect(base_url($this->model.'/product'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/product'));
				}
			}
		}else{
			$data['title'] = 'Add Product';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'catagory/getcatlist';
			$records = $this->Commonmodel->getData($url, $authtoken); 
			if($records['sucess']=='200'){
				$data['category'] = $records['data'];
			}
			 
			$this->load->view('includes/_header', $data);
			$this->load->view('product/product_add');
			$this->load->view('includes/_footer');
		}

	}
	//-----------------------------------------------------------
	public function editproduct($id = 0){
		if($this->input->post('submit')){
			$this->form_validation->set_rules('title', 'Title', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('description', 'Description', 'trim|required|strip_tags|xss_clean');
			$this->form_validation->set_rules('is_active', 'Status', 'trim|required'); 
			$this->form_validation->set_rules('catId', 'Category', 'trim|required');
			$this->form_validation->set_rules('search_title', 'Search By', 'trim|required|strip_tags|xss_clean'); 

			if ($this->form_validation->run() == FALSE) {
				$data = array(
					'errors' => validation_errors()
				);
				$data['product'] = array(  
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'catId'=> $this->input->post('catId'),
					'search_title'=> $this->input->post('search_title'), 
					'description'=> $this->input->post('description'),
					'is_active' => $this->input->post('is_active'),
					'is_global' => $this->input->post('is_global'),
				); 
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'catagory/getcatlist';
				$records = $this->Commonmodel->getData($url, $authtoken); 
				if($records['sucess']=='200'){
					$data['category'] = $records['data'];
				}
				$this->session->set_flashdata('errors', $data['errors']);
				$this->load->view('includes/_header');
				$this->load->view('product/product_edit', $data);
				$this->load->view('includes/_footer');
			}else{
				$data = array(
					'_id' => $this->input->post('_id'), 
					'title' => $this->input->post('title'), 
					'catId'=> $this->input->post('catId'),
					'search_title'=> $this->input->post('search_title'), 
					'description'=> $this->input->post('description'),
					'is_active' => $this->input->post('is_active'),
					'is_global' => $this->input->post('is_global'),
					'modifiedby' =>  $this->session->userdata('admin_id')
				); 
				if(!empty($_FILES['imgs']['name'][0]))
				{   $proimg = ''; 
					$imgs = $_FILES['imgs'];
					foreach ($imgs['name'] as $key => $value) {
						$filename = $imgs["tmp_name"][$key];
						$request = array('product_img' => $this->Commonmodel->getCurlValue($filename, $imgs["type"][$key], $value));  
						$url =  $this->config->item('APIURL') . 'product/uploadimg/';
						$authtoken = $this->session->userdata('authtoken'); 
						$result = $this->Commonmodel->postImgCurl($url, $request , $authtoken); 
						if($result['sucess']=='200'){
							$proimg.= $result['name'].',';
						}
					}
					if(!empty($proimg)){ $data['_imgs'] = substr($proimg,0,strlen($proimg)-1); }
				}  
				$data = $this->security->xss_clean($data);
				//echo "<pre>"; print_r($data); exit;
				$authtoken = $this->session->userdata('authtoken');  
				$url =  $this->config->item('APIURL') . 'product/edit'; 
				$records = $this->Commonmodel->postData($url, $data, $authtoken);
			 
				if($records['sucess']=='200'){
					$this->session->set_flashdata('success', 'Product has been update successfully!');
					redirect(base_url($this->model.'/product'));
				}else{
					$this->session->set_flashdata('error', $records['msg']);
					redirect(base_url($this->model.'/product'));
				}
			}
		}else{

			$data['title'] = 'Edit Product';
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'product/edit/'.$id;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['product'] = $records['data'][0];
			}   
			$url =  $this->config->item('APIURL') . 'catagory/getcatlist';
			$records = $this->Commonmodel->getData($url, $authtoken); 
			if($records['sucess']=='200'){
				$data['category'] = $records['data'];
			}
			///echo "<pre>"; print_r($data); exit;
			$this->load->view('includes/_header', $data);
			$this->load->view('product/product_edit', $data);
			$this->load->view('includes/_footer');
		}
		
	} 

 
 //-----------------------------------------------------------
	public function makedefaultimage(){   
		$authtoken = $this->session->userdata('authtoken');  
		$mode = $this->input->post('mode');
		$url =  $this->config->item('APIURL') . 'product/updatedefaultimage';
		$data =  $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function removeproductimage(){   
		$authtoken = $this->session->userdata('authtoken');  
		$mode = $this->input->post('mode'); 
		$url =  $this->config->item('APIURL') . 'product/deleteimage';
		$data =  $this->input->post();
		///print_r($data); exit;
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		 
		echo json_encode($records);
	}
	//-----------------------------------------------------------
	public function syncproduct($mode){
		$html ="<div class='row'>";
		$html.="<div class='col-sm-12' style='text-align: center;'>";
		$html.= "<h2 > Data Syncing Please Be Patient!!</h2>";
		$html.= "<img src='".$this->config->item('base_url')."assets/img/loading.gif' >";
		$html.= "</div>";
		$html.= "</div>";
		$html.= "<script> setTimeout(function(){  window.location.href= '".$this->config->item('base_url')."product/syncMargproduct/".$mode."'; }, 2000);</script>";
		echo $html; 
		//$this->syncMargproduct();
	}
	//-----------------------------------------------------------	
	public function syncMargproduct($mode, $type=0){	 
		if($type==0){
			$margDate = ''; //date('Y-m-d H:i:s',strtotime($this->general_settings['marg_Proentry_date']));
		}elseif($type==1){
			$margDate = date('Y-m-d H:i:s',strtotime($this->general_settings['marg_autoentry_date']));
		} 
		$ch = curl_init($this->general_settings['marg_ApiUrl']);
		$payload = json_encode( array("CompanyCode" => $this->general_settings['marg_companycode'],"MargID" => $this->general_settings['marg_Id'],"Datetime" => !empty($margDate)?date('Y-m-d H:i:s',strtotime($margDate)):"", "index" => 0));
		
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
		curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
		$response = curl_exec($ch);
		$err = curl_error($ch);
		curl_close($ch);
		$encrypted= $response; 
		if(!empty($encrypted)){
			$key = $this->general_settings['marg_Key'];
			$iv=$key . "\0\0\0\0";
			$key=$key . "\0\0\0\0";
			$encrypted = base64_decode($encrypted);	
			$decrypted=openssl_decrypt($encrypted, "aes-128-cbc", $key, OPENSSL_RAW_DATA | OPENSSL_NO_PADDING,$iv);
			if($decrypted != '')
			{
				$dec_s2 = strlen($decrypted);
				$padding = ord($decrypted[$dec_s2-1]);
				$decrypted = substr($decrypted, 0, -$padding);
			}
			$decrypted;
			$data =  substr(trim(gzinflate(base64_decode($decrypted))),3);
			$arraydata = json_decode($data, TRUE);
			///// Get detail and make array
			$pro_N = $arraydata['Details']['pro_N'];
			///$pro_U = $arraydata['Details']['pro_U'];
			$pro_S = $arraydata['Details']['pro_S'];
			$pro_R = $arraydata['Details']['pro_R'];
			$Stype = $arraydata['Details']['Stype'];
 		 
			$Datetime = $arraydata['Details']['DateTime'];
			$finalCat = []; 
			$finalNewPro = [];
			$finalPro = []; 
			$finalStPro = [];
			///$authtoken = $this->session->userdata('authtoken');
			if(!empty($this->session->userdata('authtoken'))){
				$authtoken = $this->session->userdata('authtoken');  
			}else{ 
				$data = [];
				$url = $this->config->item('APIURL') . 'user/getguest';
        		$result = $this->Commonmodel->postData($url, $data);   
				if($result['sucess']=='200'){ 
					$loginData = $result['data'];
					$authtoken = $loginData['authtoken'];  
				}
			}
			/// get franchise details
			$url6 =  $this->config->item('APIURL') . 'franchise/index';
			$franData = $this->Commonmodel->getData($url6, $authtoken);
			$franchise_id = '';
			foreach ($franData['data'] as $key => $value) { 
				if($key==0){ $franchise_id=$value['_id']; }
			}

			if($mode==1){ /// for new product
				if(!empty($Stype)){
					$c=0;
					foreach ($Stype as $skey => $svalue) { 
						if($svalue['sgcode']=='CATEGO' && $svalue['Is_Deleted']=='0' ){
							$finalCat['cat'][$c]['id']   =  (string)trim($svalue['scode']);
							$finalCat['cat'][$c]['name'] =  $svalue['name'];
							$finalCat['cat'][$c]['description']  =  $svalue['name']; 
							$finalCat['cat'][$c]['franchise_id'] =  $franchise_id;
							$finalCat['cat'][$c]['created']  =  date('Y-m-d : h:m:s');
							$finalCat['cat'][$c]['modified'] =  date('Y-m-d : h:m:s');  
							$c++;
						} 
					}
				}
				if(!empty($pro_N)){
					$inp=0;  
					foreach ($pro_N as $npkey => $npvalue) {  
						$finalNewPro['product'][$inp]['procode'] =  (string)trim($npvalue['code']);
						$finalNewPro['product'][$inp]['catcode'] =  (string)trim($npvalue['catcode']);
						$finalNewPro['product'][$inp]['name']    =  str_replace('@','&',$npvalue['name']);
						$finalNewPro['product'][$inp]['stock']   =  trim($npvalue['stock']);
						if($npvalue['stock']<=0){
							$finalNewPro['product'][$inp]['is_active'] = 3;
						}else{
							$finalNewPro['product'][$inp]['is_active'] = 1;
						}
						$finalNewPro['product'][$inp]['remark']  =  $npvalue['remark'];
						$finalNewPro['product'][$inp]['MRP']     =  trim($npvalue['MRP']);
						$finalNewPro['product'][$inp]['Rate']    =  trim($npvalue['Rate']);
						$finalNewPro['product'][$inp]['franchise_id'] =  $franchise_id;
						$finalNewPro['product'][$inp]['created']  =  date('Y-m-d : h:m:s');
						$finalNewPro['product'][$inp]['modified'] =  date('Y-m-d : h:m:s'); 
						$inp++; 
					}
				}
			}
			 
			if($mode==1){ /// for new product
				/// update Category in DB
				if(!empty($finalCat)){
					$url = $this->config->item('APIURL') . 'catagory/updatesynccat'; 
					$records   = $this->Commonmodel->postData($url, $finalCat, $authtoken);
				}  
				/// Add Product in DB
				if(!empty($finalNewPro)){  
					$url = $this->config->item('APIURL') . 'product/addnewsyncproduct'; 
					$records   = $this->Commonmodel->postData($url, $finalNewPro, $authtoken);
				}	 
			} 

			if($mode==2){  /// for update old product manual
				if(!empty($pro_N)){
					$inp=0; 
					foreach ($pro_N as $npkey => $npvalue) { 
						$finalPro['product'][$npvalue['code']]['procode'] =  trim($npvalue['code']);   
						$finalPro['product'][$npvalue['code']]['MRP'] = trim($npvalue['MRP']);
						$finalPro['product'][$npvalue['code']]['Rate'] = trim($npvalue['Rate']);
						$finalPro['product'][$npvalue['code']]['stock'] = trim($npvalue['stock']); 
						if($npvalue['stock']<=0){
							$finalPro['product'][$npvalue['code']]['is_active'] = 3;
						}else{
							$finalPro['product'][$npvalue['code']]['is_active'] = 1;
						}
					}
				}
				if(!empty($finalPro)){
					foreach ($finalPro['product'] as $fpkey => $fpvalue) { 
						$finalStPro['product'][] = $fpvalue;
					}					
				}
			}

			if($mode==3){ /// for update old product auto
				if(!empty($pro_R)){
					$np=0;
					foreach ($pro_R as $npkey => $npvalue) { 
						$finalPro['product'][$npvalue['code']]['procode'] =  trim($npvalue['code']);   
						$finalPro['product'][$npvalue['code']]['MRP'] = trim($npvalue['MRP']);
						$finalPro['product'][$npvalue['code']]['Rate'] = trim($npvalue['Rate']);
						$np++; 
					}
				}
				if(!empty($pro_S)){ 
					$np=0;
					foreach ($pro_S as $npkey => $npvalue) { 
						$finalPro['product'][$npvalue['code']]['procode'] =  trim($npvalue['code']);  
						$finalPro['product'][$npvalue['code']]['stock'] =  trim($npvalue['stock']); 
						if($npvalue['stock']<=0){
							$finalPro['product'][$npvalue['code']]['is_active'] = 3;
						}else{
							$finalPro['product'][$npvalue['code']]['is_active'] = 1;
						}
						$np++; 
					}
				}
				if(!empty($finalPro)){
					foreach ($finalPro['product'] as $fpkey => $fpvalue) { 
						$finalStPro['product'][] = $fpvalue;
					}					
				}
			} 
			
			if($mode==2 || $mode==3){ /// for update old product
				/// Update Product Rate in DB	 
				if(!empty($finalStPro)){   
					$url = $this->config->item('APIURL') . 'product/updatesyncproduct'; 
					$records   = $this->Commonmodel->postData($url, $finalStPro, $authtoken); 	
				}     
				//// Update Marg sync time in setting 
				if($type==0){
					$settingdata['_id'] = $this->general_settings['_id'];
					$settingdata['marg_Proentry_date'] = $Datetime;
					$url =  $this->config->item('APIURL') . 'settings/editcms';
					$result = $this->Commonmodel->postData($url, $settingdata, $authtoken);
				}elseif($type==1){
					$settingdata['_id'] = $this->general_settings['_id'];
					$settingdata['marg_autoentry_date'] = $Datetime;
					$url =  $this->config->item('APIURL') . 'settings/editcms';
					$result = $this->Commonmodel->postData($url, $settingdata, $authtoken); 
				}
			}
			if($type==0){
				$this->session->set_flashdata('success', 'Product Sync Successfully!!!');
				redirect(base_url($this->model.'/product'));
			}
		}else{
			$this->session->set_flashdata('error', 'No Record Found!!!');
			redirect(base_url($this->model.'/product'));
		}
	}
}

?>	