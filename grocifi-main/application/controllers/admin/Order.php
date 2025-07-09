<?php defined('BASEPATH') OR exit('No direct script access allowed');
class Order extends MY_Controller {

	public function __construct(){
		parent::__construct();
		auth_check(); // check login auth 
		check_user_premissions(
			$this->session->userdata('role_type'), 
			$this->session->userdata('admin_id'),
			$this->router->fetch_class(), 
			$this->router->fetch_method()
		);		
		
		$this->load->library('datatable');
		$this->model = $this->session->userdata('model');
		
		$franchiseId = $this->input->post('fid');
	    if(!empty($franchiseId)){ 	    	
	      $authtoken = $this->session->userdata('authtoken');
	      $url1 =  $this->config->item('APIURL') . 'franchise/getfranchisebyid/'.$franchiseId;
	      $fraSetting = $this->Commonmodel->getData($url1, $authtoken); 
	      if(@$fraSetting['sucess']=='200'){ 
	         $FranchiseSet = $fraSetting['data'][0];
	         $this->min_order_wholesaler = $FranchiseSet['min_order_wholesaler'];
	         $this->min_order = $FranchiseSet['min_order'];
	         $this->accept_minimum_order = $FranchiseSet['accept_minimum_order'];
	         $this->delivery_chrge = $FranchiseSet['delivery_chrge']; 
	         $this->delivery_max_day = $FranchiseSet['delivery_max_day'];
	         $this->delivery_day_after_order = $FranchiseSet['delivery_day_after_order'];
	      }
	    }else{
	    	 $this->min_order_wholesaler = $this->general_settings['min_order_wholesaler'];
	         $this->min_order = $this->general_settings['min_order'];
	         $this->accept_minimum_order = $this->general_settings['accept_minimum_order'];
	         $this->delivery_chrge = $this->general_settings['delivery_chrge']; 
	         $this->delivery_max_day = $this->general_settings['delivery_max_day'];
	         $this->delivery_day_after_order = $this->general_settings['delivery_day_after_order'];
	    }
	}
	
	//-----------------------------------------------------------
	public function index(){		
		$data['title'] = 'Order List';		
		$authtoken = $this->session->userdata('authtoken');
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		// prd($franData);
		$franchise = [];

		foreach ($franData['data'] as $key => $value) { 
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}

		$url =  $this->config->item('APIURL') . "country/index?is_active=1";
		$temp = $this->Commonmodel->getData($url, $authtoken);
		$data['search_country'] = $temp['data'];
		$data['franchise'] = $franchise;
		$color ='';
		foreach ($this->config->item('OrderStatus') as $key => $value) {
			$color.=''.$value.'='.$this->config->item('OrderColorvalue')[$key].',  ';
		}		
		$data['color'] = $color;
		$data['OrderStatus'] = $this->config->item('OrderStatus');
		$data['payMethod'] = $this->config->item('payMethod');
		$data['delivery_max_day'] = $this->delivery_max_day;
		$data['delivery_day_after_order'] = $this->delivery_day_after_order;
		
		$this->load->view('includes/_header', $data);
		$this->load->view('order/order_list');
		$this->load->view('includes/_footer');
	}

	public function active_order(){
		$authtoken = $this->session->userdata('authtoken');
		
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		} 

		$url =  $this->config->item('APIURL') . "country/index?is_active=1";
		$temp = $this->Commonmodel->getData($url, $authtoken);
		$data['search_country'] = $temp['data'];

		$url =  $this->config->item('APIURL') . "settings/getconfigs";
		$_configs = $this->Commonmodel->getData($url, $authtoken);
		$_configs = $_configs["data"];

		$color ='';
		foreach ($this->config->item('OrderStatus') as $key => $value) {
			$color.=''.$value.'='.$this->config->item('OrderColorvalue')[$key].',  ';
		}		
		$data['color'] = $color;
		$data['OrderStatus'] = $this->config->item('OrderActiveStatus');
		$data['payMethod'] = $this->config->item('payMethod');
		$data['franchise'] = $franchise;
		$data["time_slot"] = $_configs[2];
		$data['title'] = 'Active Order List';
		$this->load->view('includes/_header', $data);
		$this->load->view('order/active_order');
		$this->load->view('includes/_footer');
	}

	public function order_index_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);
		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["created_from"]) && !empty($_GET["created_from"]) && isset($_GET["created_to"]) && !empty($_GET["created_to"])){
				$filter .= '&created_from='.$_GET["created_from"];
				$filter .= '&created_to='.$_GET["created_to"];
			}else{
				$filter .= '&created_from='.date("Y-m-d", strtotime("-7 day", strtotime(date("Y/m/d")))); 
				$filter .= '&created_to='.date("Y-m-d", strtotime("+1 day", strtotime(date("Y/m/d"))));
			}
			if(isset($_GET["delivery_date_from"]) && !empty($_GET["delivery_date_from"]) && isset($_GET["delivery_date_to"]) && !empty($_GET["delivery_date_to"])){  
				$filter .= '&delivery_date_from='.$_GET["delivery_date_from"];
				$filter .= '&delivery_date_to='.$_GET["delivery_date_to"];
			}
			if(isset($_GET["is_active"]) && !empty($_GET["is_active"])){
				$filter .= '&is_active='.$_GET["is_active"];
			}
			if(isset($_GET["payment_method"]) && !empty($_GET["payment_method"])){
				$filter .= '&payment_method='.(int)$_GET["payment_method"];
			}
			if(isset($_GET["area"]) && !empty($_GET["area"])){
				$filter .= '&area='.$_GET["area"];
			}
			if(isset($_GET["area_group"]) && !empty($_GET["area_group"])){
				$filter .= '&area_group='.$_GET["area_group"];
			}
			if(isset($_GET["city"]) && !empty($_GET["city"])){
				$filter .= '&city='.$_GET["city"];
			}
			if(isset($_GET["state"]) && !empty($_GET["state"])){
				$filter .= '&state='.$_GET["state"];
			}
			if(isset($_GET["country"]) && !empty($_GET["country"])){
				$filter .= '&country='.$_GET["country"];
			}
			if(isset($_GET["franchise_id"]) && ($_GET["franchise_id"]!='')){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			}
			if(isset($_GET["is_wholesaler"]) && ($_GET["is_wholesaler"]!='')){
				$filter .= '&is_wholesaler='.$_GET["is_wholesaler"];
			}
		}else{ 
			if(isset($_GET["franchise_id"]) && ($_GET["franchise_id"]!='')){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			}
			$filter .= '&created_from='.date("Y-m-d", strtotime("-7 day", strtotime(date("Y/m/d")))); 
			$filter .= '&created_to='.date("Y-m-d", strtotime("+1 day", strtotime(date("Y/m/d"))));
		} 
		 
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'order/getallorders?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.trim($tableData['where']).$filter;

		$order_data = $this->Commonmodel->getData($url, $authtoken);
		$data = array(); 
		$flterOrderId = [];

		if(@$order_data['sucess']=='200'){  		
			$total = $order_data['total_order'];
			$filtered = $order_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			
			$i=$tableData['start'];
			$order_status = $this->config->item('OrderStatus'); 			
			$pay_method = $this->config->item('payMethod');  

			foreach ($order_data['data']  as $row){
				$flterOrderId[]= $row['_id'];
				$status = ($row['is_active'] == 1)? 'checked': '';
				$ordered_by = (isset($row["ordered_by"]))?$row["ordered_by"]:'-';
				if(isset($this->config->item('OrderColor')[$row["is_active"]])){
					$color = $this->config->item('OrderColor')[$row["is_active"]];
				}else{
					$color = '#000';
				}	
				$edit = '';
				if($row["is_active"]<=2){
					if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['place_order']['is_edit']==1){
						$edit = '<a title="Edit" class="editOrder update btn btn-sm btn-warning" href="'.base_url($this->model."/order/edit/".$row['userId']."/".$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>';
					}
				}	
				$chkpay = '';		
				if(@$row["payment_method"]=="2" && @$row["payment_status"]!=2 ){ 
					$chkpay = '<a title="Payment Status" class="chkOrderPay btn btn-sm btn-info" href="javascript:void(0);" oid="'.$row['_id'].'" uid="'.$row['userId'].'"> <i class="fa fa-money"></i></a>';
				}
				$payStatus = '';	 
				if($row["payment_method"]=="2" || $row["payment_method"]=="4"){ $payStatus = '<small>'.@$pay_status[$row["payment_status"]].'<small>'; }

				$data[]= array(
					++$i,
					'<span style="color:'.$color.';">'.$row["full_name"].'<br>('.$row["phone_no"].')</span>',  
					'<span style="color:'.$color.';">'.$row["orderUserId"].'</span>', 
					number_format($row["total"], 2,".",""),
					number_format($row["key_wallet_balance"], 2,".",""),
					number_format($row["final_total"], 2,".",""),
					(isset($row["firmname"]))?$row["firmname"]:'',
					date_time($row["created"]),
					date_time($row["delivery_date"]),
					$order_status[$row["is_active"]],
					@$pay_method[$row["payment_method"]].' '.$payStatus,
					$ordered_by,
					$edit.'
					<input type="hidden" id="country" name="country" value="'.@$row["country"].'" />
					<input type="hidden" id="state" name="state" value="'.@$row["state"].'" />
					<input type="hidden" id="city" name="city" value="'.@$row["city"].'" />
					<input type="hidden" id="area" name="area" value="'.@$row["area"].'" />
					<a title="View" class="btn btn-sm btn-primary" href="'.base_url($this->model."/order/order_detail/".$row['userId']."/".$row['_id']).'" title="View"> <i class="fa fa-eye"></i></a>'.$chkpay
				);
			}
		}

		$records['data']=$data;
		$records['flterOrderId']=$flterOrderId;
		echo json_encode($records);						   
	}

	public function active_order_json(){
		$tableData = $this->Commonmodel->dataTableData($_GET);
		$authtoken = $this->session->userdata('authtoken');
		
		$filter = "";
		if(isset($_GET["external_search"]) && $_GET["external_search"]){
			if(isset($_GET["delivery_date_from"]) && !empty($_GET["delivery_date_from"]) && isset($_GET["delivery_date_to"]) && !empty($_GET["delivery_date_to"])){
				$filter .= '&today='.$_GET["delivery_date_from"];
				$filter .= '&todayEnd='.$_GET["delivery_date_to"];
			}			
			if(isset($_GET["is_active"]) && !empty($_GET["is_active"])){
				$filter .= '&is_active='.$_GET["is_active"];
			}
			if(isset($_GET["payment_method"]) && !empty($_GET["payment_method"])){
				$filter .= '&payment_method='.(int)$_GET["payment_method"];
			}
			if(isset($_GET["area"]) && !empty($_GET["area"])){
				$filter .= '&area='.$_GET["area"];
			}
			if(isset($_GET["area_group"]) && !empty($_GET["area_group"])){
				$filter .= '&area_group='.$_GET["area_group"];
			}
			if(isset($_GET["city"]) && !empty($_GET["city"])){
				$filter .= '&city='.$_GET["city"];
			}
			if(isset($_GET["state"]) && !empty($_GET["state"])){
				$filter .= '&state='.$_GET["state"];
			}
			if(isset($_GET["country"]) && !empty($_GET["country"])){
				$filter .= '&country='.$_GET["country"];
			}
			if(isset($_GET["franchise_id"]) && ($_GET["franchise_id"]!='')){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			}
			if(isset($_GET["is_wholesaler"]) && ($_GET["is_wholesaler"]!='')){
				$filter .= '&is_wholesaler='.$_GET["is_wholesaler"];
			}
			if(isset($_GET["delivery_time_id"]) && !empty($_GET["delivery_time_id"])){
				$filter .= '&delivery_time_id='.$_GET["delivery_time_id"];
			}
		}else{ 
			if(isset($_GET["franchise_id"]) && ($_GET["franchise_id"]!='')){
				$filter .= '&franchise_id='.$_GET["franchise_id"];
			} 
		}
		$filter .= '&payment_status=2';
		$url =  $this->config->item('APIURL') . 'order/getordersbycondition?start='.$tableData['start'].'&limit='.$tableData['length'].'&order='.trim($tableData['order']).'&dir='.trim($tableData['dir']).'&where='.trim($tableData['where']).$filter;

		$order_data = $this->Commonmodel->getData($url, $authtoken);
		$flterOrderId = [];
		$data = array(); 
		if(@$order_data['sucess']=='200'){  		
			$total = $order_data['total_order'];
			$filtered = $order_data['filtered']; 			
			$records = array("recordsTotal"=>$total,"recordsFiltered"=>$filtered,'data' => $data);
			
			$i=$tableData['start'];
			foreach ($order_data['data']  as $row){
				$flterOrderId[]= $row['_id'];
				if(isset($this->config->item('OrderColor')[$row["is_active"]])){
					$color = $this->config->item('OrderColor')[$row["is_active"]];
				}else{
					$color = '#000';
				}	
				$edit = '';
				if($row["is_active"]<=2){
					if($this->session->userdata('role_type')!='2' || $this->general_user_premissions['place_order']['is_edit']==1){
						$edit = '<a title="Edit" class="editOrder update btn btn-sm btn-warning" href="'.base_url($this->model."/order/edit/".$row['userId']."/".$row['_id']).'"> <i class="fa fa-pencil-square-o"></i></a>';
					}
				}	
				$data[]= array(
					++$i,
					'<span style="color:'.$color.';">'.$row["full_name"].'<br>('.$row["phone_no"].')</span>', 
					'<span style="color:'.$color.';">'.$row["orderUserId"].'</span>',
					isset($row["area_title"])?$row["area_title"]:"N/A",
					($row["delivery_boy"])?$row["delivery_boy"]:"Not Assigned",
					number_format($row["final_total"], 2,".",""),
					date_time($row["created"]),
					date_time($row["delivery_date"]). "<br>(".$row["delivery_time"].")",
					$edit.'
					<a title="View" class="btn btn-sm btn-primary" href="'.base_url($this->model."/order/order_detail/".$row['userId']."/".$row['_id']).'" title="view"> <i class="fa fa-eye"></i></a>'
				);
			}
		}

		$records['data']=$data;
		$records['flterOrderId']=$flterOrderId;
		echo json_encode($records);
	}

	public function order_detail($_uid, $_oid){
		$authtoken = $this->session->userdata('authtoken');
		$data['title'] = 'Order Detail';
		$data['order_status'] = $this->config->item('OrderStatus'); 

		$url =  $this->config->item('APIURL') . "order/trackingorder/$_uid/$_oid";
		$data['order_details'] = $this->Commonmodel->getData($url, $authtoken);

		$franchise_id = $data['order_details']["data"][0]["franchiseId"];
		$url =  $this->config->item('APIURL') . "settings/getconfigs";
		$_configs = $this->Commonmodel->getData($url, $authtoken);
		$_configs = $_configs["data"];

		$url =  $this->config->item('APIURL') . "franchise/getfranchisedeliveryboys/$franchise_id";
		$dboys = $this->Commonmodel->getData($url, $authtoken);
		$temp = array();
		if(!empty($dboys["data"])){
			foreach($dboys["data"] as $val){
				$temp[$val["_id"]] = $val["fname"]." ".$val["lname"];
			}
		}
		$data['dboys'] = $temp;

		
		$temp = array();
		foreach($_configs[4] as $val){
			$temp[$val["id"]] = $val["title"];
		}

		$data['payment_method'] = $temp;

		$temp = array();
		foreach($_configs[1] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['units'] = $temp;
		$data["_uid"] = $_uid;
		$data["_oid"] = $_oid;
		$this->load->view('includes/_header', $data);
		$this->load->view('order/order_detail', $data);
		$this->load->view('includes/_footer');		

	}

	public function update_delivery_boy(){   
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'order/updateorderdeliveryboy';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);
	}

	public function order_revised()
	{
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'order/updaterevised';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);	
	}

	public function updatestatus(){   
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'order/updatestatus';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);
	}

	public function updatestatusall(){   
		$authtoken = $this->session->userdata('authtoken');
		$records['sucess'] = 0;
		$filter = '?franchise_id='.$_POST["search_franchise_id"]; 
		if(isset($_POST["search_dd_from"]) && !empty($_POST["search_dd_from"]) && isset($_POST["search_dd_to"]) && !empty($_POST["search_dd_to"])){
			$filter .= '&delivery_date_from='.$_POST["search_dd_from"];
			$filter .= '&delivery_date_to='.$_POST["search_dd_to"];
		}
		if(isset($_POST["search_order_status"]) && !empty($_POST["search_order_status"])){
			$filter .= '&is_active='.$_POST["search_order_status"];
		}
		if(isset($_POST["search_payment_method"]) && !empty($_POST["search_payment_method"])){
			$filter .= '&payment_method='.(int)$_POST["search_payment_method"];
		}
		if(isset($_POST["search_area"]) && !empty($_POST["search_area"])){
			$filter .= '&area='.$_POST["search_area"];
		}
		if(isset($_POST["search_area_group"]) && !empty($_POST["search_area_group"])){
			$filter .= '&area_group='.$_POST["search_area_group"];
		}
		if(isset($_POST["search_city"]) && !empty($_POST["search_city"])){
			$filter .= '&city='.$_POST["search_city"];
		}
		if(isset($_POST["search_state"]) && !empty($_POST["search_state"])){
			$filter .= '&state='.$_POST["search_state"];
		}
		if(isset($_POST["search_country"]) && !empty($_POST["search_country"])){
			$filter .= '&country='.$_POST["search_country"];
		}
		if(isset($_POST["search_is_wholesaler"]) && ($_POST["search_is_wholesaler"]!='')){
			$filter .= '&is_wholesaler='.$_POST["search_is_wholesaler"];
		}	 
		if(isset($_POST["search_delivery_time_id"]) && !empty($_POST["search_delivery_time_id"])){
			$filter .= '&delivery_time_id='.$_POST["search_delivery_time_id"];
		}
		$filter .= '&payment_status=2';
		$url =  $this->config->item('APIURL') . "order/exportorder".$filter;
		$order_details = $this->Commonmodel->getData($url, $authtoken);
		$OrderId = $order_details["data"];

		$is_active = $this->input->post('is_active');
		///prd($OrderId);
		if($OrderId){
			foreach ($OrderId as $key => $value) {	
				$data = array(
					'_id' => $value['_id'],
					'is_active' => $is_active,
				);			
				$url =  $this->config->item('APIURL') . 'order/updatestatus';
				$OrdData = $this->Commonmodel->postData($url, $data, $authtoken);	
			}
			$records['sucess'] = 1;
		}
		echo json_encode($records);
	}

	public function updatedeliveryboyall(){   
		$authtoken = $this->session->userdata('authtoken');
		$records['sucess'] = 0;
		$filter = '?franchise_id='.$_POST["search_franchise_id"]; 
		if(isset($_POST["search_dd_from"]) && !empty($_POST["search_dd_from"]) && isset($_POST["search_dd_to"]) && !empty($_POST["search_dd_to"])){
			$filter .= '&delivery_date_from='.$_POST["search_dd_from"];
			$filter .= '&delivery_date_to='.$_POST["search_dd_to"];
		}
		if(isset($_POST["search_order_status"]) && !empty($_POST["search_order_status"])){
			$filter .= '&is_active='.$_POST["search_order_status"];
		}
		if(isset($_POST["search_payment_method"]) && !empty($_POST["search_payment_method"])){
			$filter .= '&payment_method='.(int)$_POST["search_payment_method"];
		}
		if(isset($_POST["search_area"]) && !empty($_POST["search_area"])){
			$filter .= '&area='.$_POST["search_area"];
		}
		if(isset($_POST["search_area_group"]) && !empty($_POST["search_area_group"])){
			$filter .= '&area_group='.$_POST["search_area_group"];
		}
		if(isset($_POST["search_city"]) && !empty($_POST["search_city"])){
			$filter .= '&city='.$_POST["search_city"];
		}
		if(isset($_POST["search_state"]) && !empty($_POST["search_state"])){
			$filter .= '&state='.$_POST["search_state"];
		}
		if(isset($_POST["search_country"]) && !empty($_POST["search_country"])){
			$filter .= '&country='.$_POST["search_country"];
		}
		if(isset($_POST["search_is_wholesaler"]) && ($_POST["search_is_wholesaler"]!='')){
			$filter .= '&is_wholesaler='.$_POST["search_is_wholesaler"];
		}	 
		if(isset($_POST["search_delivery_time_id"]) && !empty($_POST["search_delivery_time_id"])){
			$filter .= '&delivery_time_id='.$_POST["search_delivery_time_id"];
		}
		$filter .= '&payment_status=2';
		$url =  $this->config->item('APIURL') . "order/exportorder".$filter;
		$order_details = $this->Commonmodel->getData($url, $authtoken);
		$OrderId = $order_details["data"];
		
		$delivery_boy_id = $this->input->post('DeliveryBoyId');
		if($OrderId){
			foreach ($OrderId as $key => $value) {	
				if($value['is_active'] < 4){ 
					$data = array(
						'_id' => $value["_id"],
						'delivery_boy_id' => $delivery_boy_id,
					);			
					$url =  $this->config->item('APIURL') . 'order/updateorderdeliveryboy';
					$OrdData = $this->Commonmodel->postData($url, $data, $authtoken);	
				}
			}
			$records['sucess'] = 1;
		}   
		echo json_encode($records);
	}

	public function order_bill($_uid, $_oid){
		$authtoken = $this->session->userdata('authtoken');
		//prd($_uid." / ".$_oid);
		$data['title'] = 'Order Detail';
		$data['order_status'] = $this->config->item('OrderStatus'); 

		/*$url =  $this->config->item('APIURL') . "settings/index";
		$data['settings'] = $this->Commonmodel->getData($url, $authtoken);
		$data['settings'] = $data['settings']["data"][0];*/

		$data['settings'] = $this->general_settings;

		$url =  $this->config->item('APIURL') . "order/trackingorder/$_uid/$_oid";
		$data['order_details'] = $this->Commonmodel->getData($url, $authtoken);
		$data['order_details'] = $data['order_details']["data"][0];

		$url =  $this->config->item('APIURL') . "address/getdetailedaddress/".$data['order_details']["delivery_address_id"];
		$data['delivery_address'] = $this->Commonmodel->getData($url, $authtoken);
		$data['delivery_address'] = $data['delivery_address']["data"][0];

		$franchise_id = $data['order_details']["franchiseId"];
		$url =  $this->config->item('APIURL') . "settings/getconfigs";
		$_configs = $this->Commonmodel->getData($url, $authtoken);
		$_configs = $_configs["data"];

		$url =  $this->config->item('APIURL') . "franchise/getfranchisedeliveryboys/$franchise_id";
		$dboys = $this->Commonmodel->getData($url, $authtoken);
		$temp = array();
		foreach($dboys["data"] as $val){
			$temp[$val["_id"]] = $val["fname"]." ".$val["lname"];
		}
		$data['dboys'] = $temp;
		
		$temp = array();
		foreach($_configs[4] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['payment_method'] = $temp;

		$temp = array();
		foreach($_configs[1] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['units'] = $temp;

		$this->load->view('includes/_header', $data);
		$this->load->view('order/order_bill', $data);
		$this->load->view('includes/_footer');
	}

	public function purchase_list(){
		$data['title'] = 'Purchase List';
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
		$category = [];
		$url7 =  $this->config->item('APIURL') . 'catagory/parentlist';
		$catData = $this->Commonmodel->getData($url7, $authtoken); 

		foreach ($catData['data'] as $key => $value) {  
			$category[$key]['_id']=$value['_id'];
			$category[$key]['title']= $value['title'];
		}
		$data['category'] = $category;

		$data['start_date'] = $start_date=(isset($_GET["fromDate"]) && $_GET["fromDate"] != "")?$_GET["fromDate"]:date("Y-m-d");
		$data['end_date'] = $end_date=(isset($_GET["todate"]) && $_GET["todate"] != "")?$_GET["todate"]:date("Y-m-d");
		$data['franchise_id'] = $franchise_id =(isset($_GET["franchise_id"]) && $_GET["franchise_id"] != "")?$_GET["franchise_id"]:$franchise_id;
		$data['is_wholesaler'] = $is_wholesaler = (isset($_GET["is_wholesaler"]) && $_GET["is_wholesaler"] != "")?$_GET["is_wholesaler"]:'0';
		$data['category_id'] = $category_id = (isset($_GET["category_id"]) && $_GET["category_id"] != "")?$_GET["category_id"]:'';


		$url =  $this->config->item('APIURL') . "settings/index";
		$data['settings'] = $this->Commonmodel->getData($url, $authtoken);
		$data['settings'] = $data['settings']["data"][0];

		$url =  $this->config->item('APIURL') . "settings/getconfigs";
		$_configs = $this->Commonmodel->getData($url, $authtoken);
		$_configs = $_configs["data"];

		//Payment Method
		$temp = array();
		foreach($_configs[4] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['payment_method'] = $temp;
		//Units
		$temp = array();
		foreach($_configs[1] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['units'] = $temp;
		$is_wholesaler = ($is_wholesaler!="")?$is_wholesaler:'0';
		$url =  $this->config->item('APIURL') . "order/getcitodayorder/$start_date/$end_date/$franchise_id/$is_wholesaler/$category_id";  
		$temp = $this->Commonmodel->getData($url, $authtoken);
		//prd($temp);
		foreach($temp["data"] as $k=>$val){
			if($val["main_order"][0]["is_active"] != "2"){
				unset($temp["data"][$k]);
			}
		}
		$data['today_order']= $temp["data"];
		$this->load->view('includes/_header', $data);
		$this->load->view('order/purchase_list');
		$this->load->view('includes/_footer');
	}

	public function purchased_list(){
		$data['title'] = 'Purchased Products';
		$authtoken = $this->session->userdata('authtoken');
		$data['today'] = $today = (isset($_GET["today"]) && $_GET["today"] != "")?$_GET["today"]:date("Y-m-d");
		
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			if($key==0){
				$franchise_id = $value['_id'];
			}
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}
		$data['franchise'] = $franchise;
		
		$data['franchise_id'] = $franchise_id =(isset($_GET["franchise_id"]) && $_GET["franchise_id"] != "")?$_GET["franchise_id"]:$franchise_id;
		$data['is_wholesaler'] = $is_wholesaler = (isset($_GET["is_wholesaler"]) && $_GET["is_wholesaler"] != "")?$_GET["is_wholesaler"]:'';
		
		$url =  $this->config->item('APIURL') . "settings/index";
		$data['settings'] = $this->Commonmodel->getData($url, $authtoken);
		$data['settings'] = $data['settings']["data"][0];

		$url =  $this->config->item('APIURL') . "settings/getconfigs";
		$_configs = $this->Commonmodel->getData($url, $authtoken);
		$_configs = $_configs["data"];

		//Units
		$temp = array();
		foreach($_configs[1] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['units'] = $temp;

		$url =  $this->config->item('APIURL') . "user/getallstaff";
		$temp = $this->Commonmodel->getData($url, $authtoken);
		$staff = array();
		
		foreach($temp["data"] as $val){
			$staff[$val["_id"]] = $val["fname"]." ".$val["lname"];
		}

		$data['staff'] = $staff;

		$url =  $this->config->item('APIURL') . "franchise/getcipurchaseditembydate/$today/$franchise_id/$is_wholesaler";
		$temp = $this->Commonmodel->getData($url, $authtoken);
		$data['list']= $temp["data"];


		$this->load->view('includes/_header', $data);
		$this->load->view('order/purchased_list');
		$this->load->view('includes/_footer');
	}

	public function report(){
		$data['title'] = "Order's Report";
		$authtoken = $this->session->userdata('authtoken');
		$data['start_date'] = $start_date=(isset($_POST["fromDate"]) && $_POST["fromDate"] != "")?$_POST["fromDate"]:date("Y-m-d");
		$data['end_date'] = $end_date=(isset($_POST["todate"]) && $_POST["todate"] != "")?$_POST["todate"]:date("Y-m-d");
		$isprint = isset($_POST['isprint'])?$_POST['isprint']:0;

		$category = [];
		$url7 =  $this->config->item('APIURL') . 'catagory/parentlist';
		$catData = $this->Commonmodel->getData($url7, $authtoken); 

		foreach ($catData['data'] as $key => $value) {  
			$category[$key]['_id']=$value['_id'];
			$category[$key]['title']= $value['title'];
		}
		$data['category'] = $category;

		//prd($_POST);
		$url6 =  $this->config->item('APIURL') . 'franchise/index';
		$franData = $this->Commonmodel->getData($url6, $authtoken);
		$franchise = [];
		foreach ($franData['data'] as $key => $value) { 
			if($key==0){ $franchise_id =$value['_id']; }
			$franchise[$key]['_id']=$value['_id'];
			$franchise[$key]['firmname']= $value['firmname'];
		}
		$data['franchise'] = $franchise;
		$data['franchise_id'] = $franchise_id =(isset($_POST["franchise_id"]) && $_POST["franchise_id"] != "")?$_POST["franchise_id"]:$franchise_id;

		$data['category_id'] = $category_id =(isset($_POST["category_id"]) && $_POST["category_id"] != "")?$_POST["category_id"]:'';
		$url =  $this->config->item('APIURL') . "order/getciorderbydate/$start_date/$end_date/$franchise_id/$category_id";
		$temp = $this->Commonmodel->getData($url, $authtoken);
	 //prd($temp);
		$temp = $temp["data"]; 
		$temp_1 = array();
		if( !empty($temp) && count($temp)>0){
			foreach($temp as $val){
				$temp_1[date("Y-m-d", strtotime($val["created"]))][] = $val;
			}
			$temp = array();

			foreach($temp_1 as $k=>$val){
				$wallet_used = $promo_disc = $total = $final_total = 0;
				if(is_array($val) && count($val) > 0){
					foreach($val as $val_in){
						$wallet_used += $val_in["key_wallet_balance"];
						$promo_disc += $val_in["promo_discount"];
						$total += $val_in["total"];
						$final_total += $val_in["final_total"];
					}
					$temp[$k] = array(
						"order_count"=>count($val), 
						"wallet_used"=>$wallet_used, 
						"promo_disc"=>$promo_disc, 
						"total"=>$total, 
						"final_total"=>$final_total
					);
				}else{
					$temp[$temp] = array(
						"order_count"=>count($val), 
						"wallet_used"=>$wallet_used, 
						"promo_disc"=>$promo_disc, 
						"total"=>$total, 
						"final_total"=>$final_total
					);
				}
			}
		}		
		
		if($isprint==1){
			$filename = 'orderlist_'.time().'.csv'; 
			header("Content-Description: File Transfer"); 
			header("Content-Disposition: attachment; filename=$filename"); 
			header("Content-Type: application/csv; ");
			// file creation 
			$file = fopen('php://output', 'w');
			
			$header = array("Name", "Order Count", "Wallet Used", "Promo Discount", "Total Amount", "Final Amount"); 

			fputcsv($file, $header); 
			 foreach ($temp as $k => $value) {
				$line = array(date("d M Y", strtotime($k)), $value['order_count'], $value['wallet_used'], $value['promo_disc'], $value['total'], $value['final_total']);
				fputcsv($file,$line);  
			}
			fclose($file); 
			exit; 
		}

		$data['order_report']= $temp;
		$this->load->view('includes/_header', $data);
		$this->load->view('order/report');
		$this->load->view('includes/_footer');
	}

	//-----------------------------------------------------------
	public function getfranchisedeliveryboys($franchise_id){   
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . "franchise/getfranchisedeliveryboys/".$franchise_id;
		$dboys = $this->Commonmodel->getData($url, $authtoken);
		$temp = array();
		$k=0;
		foreach($dboys["data"] as $val){
			$temp[$k]['val'] = $val["_id"];
			$temp[$k]['name'] = $val["fname"]." ".$val["lname"];
			$k++;
		}
		$data['dboys'] = $temp; 
		echo json_encode($data);
	} 
	//-----------------------------------------------------------
	public function print_bills(){   
		$authtoken = $this->session->userdata('authtoken');
		$records['sucess'] = 0;
		$franchise_id = $_POST["search_franchise_id"];
		$filter = '?franchise_id='.$_POST["search_franchise_id"]; 
		if(isset($_POST["search_dd_from"]) && !empty($_POST["search_dd_from"]) && isset($_POST["search_dd_to"]) && !empty($_POST["search_dd_to"])){
			$filter .= '&delivery_date_from='.$_POST["search_dd_from"];
			$filter .= '&delivery_date_to='.$_POST["search_dd_to"];
		}
		if(isset($_POST["search_order_status"]) && !empty($_POST["search_order_status"])){
			$filter .= '&is_active='.$_POST["search_order_status"];
		}else{
			$filter .= '&is_active=2';
		}
		if(isset($_POST["search_payment_method"]) && !empty($_POST["search_payment_method"])){
			$filter .= '&payment_method='.(int)$_POST["search_payment_method"];
		}
		if(isset($_POST["search_area"]) && !empty($_POST["search_area"])){
			$filter .= '&area='.$_POST["search_area"];
		}
		if(isset($_POST["search_area_group"]) && !empty($_POST["search_area_group"])){
			$filter .= '&area_group='.$_POST["search_area_group"];
		}
		if(isset($_POST["search_city"]) && !empty($_POST["search_city"])){
			$filter .= '&city='.$_POST["search_city"];
		}
		if(isset($_POST["search_state"]) && !empty($_POST["search_state"])){
			$filter .= '&state='.$_POST["search_state"];
		}
		if(isset($_POST["search_country"]) && !empty($_POST["search_country"])){
			$filter .= '&country='.$_POST["search_country"];
		}
		if(isset($_POST["search_is_wholesaler"]) && ($_POST["search_is_wholesaler"]!='')){
			$filter .= '&is_wholesaler='.$_POST["search_is_wholesaler"];
		}	 
		if(isset($_POST["search_delivery_time_id"]) && !empty($_POST["search_delivery_time_id"])){
			$filter .= '&delivery_time_id='.$_POST["search_delivery_time_id"];
		}
		$pmode =  $this->input->post('pmode');
		$filter .= '&payment_status=2';
		$url =  $this->config->item('APIURL') . "order/exportorder".$filter;
		$order_details = $this->Commonmodel->getData($url, $authtoken);
		$data['order_details'] = $order_details["data"];
		
		if(!empty($data['order_details'])){ 
			if($pmode=='1'){ 
				foreach ($data['order_details'] as $key => $value) {	 
					$url =  $this->config->item('APIURL') . "order/printorderbill/".$value['_id'];
					$order_details = $this->Commonmodel->getData($url, $authtoken);
					$data['orderdetails'][] = $order_details["data"][0];	
					/*if($key==0){ $franchise_id = $order_details["data"][0]['franchiseId']; }*/
				}
				$url =  $this->config->item('APIURL') . "settings/getconfigs";
				$_configs = $this->Commonmodel->getData($url, $authtoken);
				$_configs = $_configs["data"];
				
				$url =  $this->config->item('APIURL') . "franchise/getfranchisedeliveryboys/".$franchise_id;
				$dboys = $this->Commonmodel->getData($url, $authtoken);
				$temp = array();
				foreach($dboys["data"] as $val){
					$temp[$val["_id"]] = $val["fname"]." ".$val["lname"];
				}
				$data['dboys'] = $temp;

				$temp = array();
				foreach($_configs[4] as $val){
					$temp[$val["id"]] = $val["title"];
				}
				$data['payment_method'] = $temp;

				$temp = array();
				foreach($_configs[1] as $val){
					$temp[$val["id"]] = $val["title"];
				}
				$data['units'] = $temp;
				$data['settings'] = $this->general_settings;
				///prd($data);	
				$this->load->view('includes/_header');
				$this->load->view('order/print_bills', $data);
				$this->load->view('includes/_footer');
			}else{
				$filename = 'orderlist_'.time().'.csv'; 
				header("Content-Description: File Transfer"); 
				header("Content-Disposition: attachment; filename=$filename"); 
				header("Content-Type: application/csv; ");
				// file creation 
				$file = fopen('php://output', 'w');
				
				$header = array("Name", "Mobile", "Delivery Address", "Final Total", "Order Date", "Delivery Date"); 

				fputcsv($file, $header); 
				foreach ($data['order_details'] as $key=>$value){ 
					$breaks = array("<br />","<br>","<br/>");  
		    		$delivery_address = str_ireplace($breaks, "\r\n", $value['delivery_address']);  
		    		$b = array("<b>","</b>");  
		    		$delivery_address = str_ireplace($b,"",$delivery_address);
					$line = array($value['full_name'], $value['phone_no'], $delivery_address, number_format($value['final_total'], 2,".",""), date('F d, Y',strtotime($value['created'])), date('F d, Y',strtotime($value['delivery_date'])).' ('.$value['delivery_time'].') ');
					fputcsv($file,$line);  
				}
				fclose($file); 
				exit; 
			}
		}else{
			$data['error'] = "No Record Found!!";
			$this->load->view('includes/_header');
			$this->load->view('order/error', $data);
			$this->load->view('includes/_footer');
		}
	} 
	//-----------------------------------------------------------
	public function xlsexportorder(){
		$authtoken = $this->session->userdata('authtoken');
		$records['sucess'] = 0;

		$filter = '?franchise_id='.$_POST["search_franchise_id"];
		if(isset($_POST["search_created_from"]) && !empty($_POST["search_created_from"]) && isset($_POST["search_created_to"]) && !empty($_POST["search_created_to"])){
			$filter .= '&created_from='.$_POST["search_created_from"];
			$filter .= '&created_to='.$_POST["search_created_to"];
		}else{
			$filter .= '&created_from='.date("Y-m-d", strtotime("-7 day", strtotime(date("Y/m/d")))); 
			$filter .= '&created_to='.date("Y-m-d", strtotime("+1 day", strtotime(date("Y/m/d"))));
		}
		if(isset($_POST["search_dd_from"]) && !empty($_POST["search_dd_from"]) && isset($_POST["search_dd_to"]) && !empty($_POST["search_dd_to"])){  
			$filter .= '&delivery_date_from='.$_POST["search_dd_from"];
			$filter .= '&delivery_date_to='.$_POST["search_dd_to"];
		}
		if(isset($_POST["search_order_status"]) && !empty($_POST["search_order_status"])){
			$filter .= '&is_active='.$_POST["search_order_status"];
		}
		if(isset($_POST["search_payment_method"]) && !empty($_POST["search_payment_method"])){
			$filter .= '&payment_method='.(int)$_POST["search_payment_method"];
		}
		if(isset($_POST["search_area"]) && !empty($_POST["search_area"])){
			$filter .= '&area='.$_POST["search_area"];
		}
		if(isset($_POST["search_area_group"]) && !empty($_POST["search_area_group"])){
			$filter .= '&area_group='.$_POST["search_area_group"];
		}
		if(isset($_POST["search_city"]) && !empty($_POST["search_city"])){
			$filter .= '&city='.$_POST["search_city"];
		}
		if(isset($_POST["search_state"]) && !empty($_POST["search_state"])){
			$filter .= '&state='.$_POST["search_state"];
		}
		if(isset($_POST["search_country"]) && !empty($_POST["search_country"])){
			$filter .= '&country='.$_POST["search_country"];
		}
		if(isset($_POST["search_is_wholesaler"]) && ($_POST["search_is_wholesaler"]!='')){
			$filter .= '&is_wholesaler='.$_POST["search_is_wholesaler"];
		}	 
		$filter .= '&payment_status=2';
		$url =  $this->config->item('APIURL') . "order/exportorder".$filter;
		$order_details = $this->Commonmodel->getData($url, $authtoken);
		///pr($order_details);
		$data['order_details'] = $order_details["data"];	 

		$order_status = $this->config->item('OrderStatus'); 			
		$pay_method = $this->config->item('payMethod');

		$filename = 'orderlist_'.time().'.csv'; 
		header("Content-Description: File Transfer"); 
		header("Content-Disposition: attachment; filename=$filename"); 
		header("Content-Type: application/csv; ");
		// file creation 
		$file = fopen('php://output', 'w');
		$header = array("Name", "Mobile", "Delivery Address" ,"Total", "Wallet", "Final Total", "Franchise", "Order Date", "Delivery Date", "Status", "Payment Method", "Device"); 
		
		fputcsv($file, $header); 
		foreach ($data['order_details'] as $key=>$value){ 
			$firmname = (isset($value["franchise"][0]["firmname"]))?$value["franchise"][0]["firmname"]:'';
			$ordered_by = (isset($value["ordered_by"]))?$value["ordered_by"]:'-';
			$breaks = array("<br />","<br>","<br/>");  
    		$delivery_address = str_ireplace($breaks, "\r\n", $value['delivery_address']);  
    		$b = array("<b>","</b>");  
    		$delivery_address = str_ireplace($b,"",$delivery_address);
			$line = array($value['full_name'], $value['phone_no'], 
				$delivery_address,
				number_format($value["total"], 2,".",""), 
				number_format($value["key_wallet_balance"], 2,".",""),
				number_format($value['final_total'], 2,".",""), 
				$firmname, 
				date('F d, Y',strtotime($value['created'])), 
				date('F d, Y',strtotime($value['delivery_date'])).' ('.$value['delivery_time'].') ',
				$order_status[$value["is_active"]],
				$pay_method[$value["payment_method"]],
				$ordered_by);
			fputcsv($file,$line);  
		}
		fclose($file); 
		exit; 
	}
	//-----------------------------------------------------------
	public function edit($userid,$orderid){
		
		if($this->input->post('submit')){			 
			if($_SESSION['CartTotal']['user_wallet']!=0){ $key_wallet_used = 1; }else{ $key_wallet_used = 0; }
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . "settings/getconfigs";
			$_configs = $this->Commonmodel->getData($url, $authtoken);
			$_configs = $_configs["data"];
			$temp = array();
			foreach($_configs[2] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$setting_delivery_time = $temp; 
			$url =  $this->config->item('APIURL') . 'user/getuserbyid/'.$this->input->post('user_id'); 
			$userDetail = $this->Commonmodel->getData($url, $authtoken);	
			$userData = $userDetail['data'][0];
			$ord_var = [];
			foreach ($_SESSION['UserCart'] as $key => $value) {
				$ord_var[] = $value;
			}
			/// cancel previous order
			// $url =  $this->config->item('APIURL') . 'order/updatestatus/'; 
			// $odata = array("_id"=>$orderid, "is_active"=>6);
			// $userDetail = $this->Commonmodel->postData($url, $odata ,$authtoken);
			/// add new order 
			$data['order_param'] = array( 
				'userId' => $this->input->post('user_id'), 
				'franchiseId' => $this->input->post('franchiseId'),
				'delivery_address'=> $this->input->post('delivery_address'),
				'razorpay_payment_id'=>'',
				'delivery_day'=> 2, 
                'delivery_date'=> $this->input->post('delivery_date'), 
                'delivery_time_id'=> $this->input->post('delivery_time'), 
                'delivery_time'=> $setting_delivery_time[$this->input->post('delivery_time')], 
                'tax_percent'=> "0",
                'phone_no'=> $userData['phone_no'], 
                'key_wallet_used'=> $key_wallet_used, 
                'key_wallet_balance'=> $_SESSION['CartTotal']['user_wallet'], 
                'payment_method'=>"1",
                'latitude'=> $this->input->post('latitude'), 
                'longitude'=> $this->input->post('longitude'), 
                'email'=> $userData['email'], 
                'version_code'=>null,
                'ordered_by'=>"admin",
                'discount_rupee'=> $_SESSION['CartTotal']['disc'], 
                'promo_code'=> $this->input->post('promocode'), 
                'promo_discount'=> $_SESSION['CartTotal']['promo_disc'], 
                'tax_amount'=>"0",
                'total'=> $_SESSION['CartTotal']['total'], 
                'delivery_charge'=> 0, 
                'final_total'=> $_SESSION['CartTotal']['final_total'], 
                'order_val'=> $ord_var
			);  
			//pr($data['order_param']);
			$data = $this->security->xss_clean($data); 	
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'order/placeorder'; 
			$records = $this->Commonmodel->postData($url, $data, $authtoken);
	 	
			if($records['sucess']=='200'){
				$this->session->set_flashdata('success', 'Order has been added successfully!');
				redirect(base_url($this->model.'/order/index'));
			}else{
				$this->session->set_flashdata('error', $records['msg']);
				redirect(base_url($this->model.'/order/index'));
			} 
		}else{
			$data['title'] = 'Edit Order';
			$authtoken = $this->session->userdata('authtoken');  
			unset($_SESSION['is_wholesaler']);
			unset($_SESSION['UserCart']);
			unset($_SESSION['CartTotal']);
			/// get order detail 
			$url =  $this->config->item('APIURL') . 'order/trackingorder/'.$userid.'/'.$orderid;
			$records = $this->Commonmodel->getData($url, $authtoken);
			if($records['sucess']=='200'){
				$data['order'] = $records['data'][0];

				/// cancel previous order
				// if($data['order']['is_active']==1){
				// 	$url = $this->config->item('APIURL') . 'order/updatestatus/';
				// 	$odata = array("_id"=>$data['order']['_id'], "is_active"=>6);
				// 	$userDetail = $this->Commonmodel->postData($url, $odata ,$authtoken);
				// }

				$order_variants = $data['order']['order_variants'];
				///prd($data['order']);
				foreach ($order_variants as $ovkey => $ovvalue) { 
					$url =  $this->config->item('APIURL') . 'product/getproductsimages/'.$ovvalue['productId'];
					$productImgData = $this->Commonmodel->getData($url, $authtoken);
					$productImg = [];
					if($productImgData['sucess']=='200'){
						$productImg = @$productImgData['data'][0];
					}
					$cart_data= array( 
						'productId' => $ovvalue['productId'],
						'franchiseId'=> $ovvalue['franchiseId'],
						'frproductId'=> $ovvalue['frproductId'],
		                'frproductvarId'=> $ovvalue['frproductvarId'],                
		                'price'=> $ovvalue['price'],                
		                'qty'=> $ovvalue['qty'],
		                'image_url'=> @$productImg['title'],
		                'measurement'=> $ovvalue['measurement'],
		                'unit'=> $ovvalue['unit'],
		                'title'=> $ovvalue['title'],
		                'total' => ($ovvalue['qty']*$ovvalue['price']),
						'disc' => 0,
				);
				$_SESSION['UserCart'][$ovvalue['frproductvarId']] = $cart_data;
				}
				$carttotal['promo_disc'] = number_format($data['order']['promo_discount'],2,".","");
				$carttotal['total'] = number_format($data['order']['total'],2,".","");
				$carttotal['disc'] = number_format($data['order']['discount_rupee'],2,".","");
				$carttotal['user_wallet'] = number_format(0,2,".","");
				$finalTotal = $data['order']['key_wallet_balance']+$data['order']['final_total'];
				$carttotal['final_total'] = number_format($finalTotal,2,".","");
			}  
			$data['carttotal'] = $carttotal;
			$_SESSION['CartTotal'] = $carttotal;
			///prd($_SESSION['UserCart']);
			$url6 =  $this->config->item('APIURL') . 'franchise/index';
			$franData = $this->Commonmodel->getData($url6, $authtoken);
			$franchise = [];
			foreach ($franData['data'] as $key => $value) { 
				if($key==0){ $franchise_id =$value['_id']; }
				$franchise[$key]['_id']=$value['_id'];
				$franchise[$key]['firmname']= $value['firmname'];
			}
			$data['franchise'] = $franchise;

			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$url =  $this->config->item('APIURL') . 'coupon/getcouponoffranchise/'.$franchise_id;	
			$coupon_data = $this->Commonmodel->getData($url, $authtoken);
			
			if(@$coupon_data['sucess']=='200'){ 
				foreach ($coupon_data['data'] as $ckey => $cvalue) {
					if ($cvalue['disc_in'] == 1) {
	                    $temp = array( 'id'=> $cvalue['title'], 
	                    		  'title'=> $cvalue['disc_value'].'% Discount ('.$cvalue['title'].')' );
	                } else {
	                	$temp = array('id'=> $cvalue['title'], 
	                    		  'title'=> 'Rs. '.$cvalue['disc_value'].'/- Discount ('.$cvalue['title'].')' );
	                } 
	                $data['promocode'][] = $temp;
				} 
			} 
			$url =  $this->config->item('APIURL') . 'franchise/getfranchisecat/'.$franchise_id;
			$records = $this->Commonmodel->getData($url, $authtoken);  
			if($records['sucess']=='200'){
				foreach ($records['data'] as $catkey => $catvalue) {
					$data['maincategory'][] = $catvalue['Cats'];
				} 
			} 
			$url =  $this->config->item('APIURL') . "settings/getconfigs";
			$_configs = $this->Commonmodel->getData($url, $authtoken);
			$_configs = $_configs["data"];
			$temp = array();
			foreach($_configs[0] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['address_type'] = $temp;
			$temp = array();
			foreach($_configs[2] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['delivery_time'] = $temp;
			$temp = array();
			foreach($_configs[4] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['payment_method'] = $temp;
			$temp = array();
			foreach($_configs[1] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['units'] = $temp;
			$data['settings'] = $this->general_settings;
			$data['userid'] = $userid;
			$data['orderid'] = $orderid;
			//echo "<pre>"; print_r($data); exit;
			$this->load->view('includes/_header');
			$this->load->view('order/order_edit', $data);
			$this->load->view('includes/_footer');	
	 	}	
	}
	//-----------------------------------------------------------
	public function placeorder(){
		if($this->input->post('submit')){			 
			if($_SESSION['CartTotal']['user_wallet']!=0){ $key_wallet_used = 1; }else{ $key_wallet_used = 0; }
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . "settings/getconfigData?franchiseId=".MAINFRANCHISE;
			$_configs = $this->Commonmodel->getData($url, $authtoken);
			$_configs = $_configs["data"];
			$temp = array();
			// foreach($_configs[7] as $val){

			// 	$temp[$val["id"]] = $val["title"];
			// }
			foreach($_configs[7] as $val){
				$temp[$val["id"]] = $val["title"];
			}

			$setting_delivery_time = $temp; 
			$url =  $this->config->item('APIURL') . 'user/getuserbyid/'.$this->input->post('user_id'); 
			$userDetail = $this->Commonmodel->getData($url, $authtoken);	
			$userData = $userDetail['data'][0];
			$ord_var = [];
			foreach ($_SESSION['UserCart'] as $key => $value) {
				$ord_var[] = $value;
			} 
			if($_SESSION['CartTotal']['total']==$_SESSION['CartTotal']['user_wallet']){ 
				$payment_method = "3";
			}else{
				$payment_method = "1";
			}
			$data['order_param'] = array( 
				'userId' => $this->input->post('user_id'), 
				'franchiseId' => $this->input->post('franchiseId'),
				'delivery_address'=> $this->input->post('delivery_address'),
				'razorpay_payment_id'=>'',
				'delivery_day'=> 2, 
                'delivery_date'=> $this->input->post('delivery_date'), 
                'delivery_time_id'=> 0, 
                'delivery_solt_id'=> $this->input->post('delivery_time'), 
                'delivery_time'=> $setting_delivery_time[$this->input->post('delivery_time')], 
                'tax_percent'=> "0",
                'phone_no'=> $userData['phone_no'], 
                'key_wallet_used'=> $key_wallet_used, 
                'key_wallet_balance'=> $_SESSION['CartTotal']['user_wallet'], 
                'payment_method'=>$payment_method,
                'latitude'=> $this->input->post('latitude'), 
                'longitude'=> $this->input->post('longitude'), 
                'email'=> $userData['email'], 
                'version_code'=> null,
                'ordered_by'=>"admin",
                'is_wholesaler' => ($_SESSION['is_wholesaler']=='true')?1:0,
                'discount_rupee'=> $_SESSION['CartTotal']['disc'], 
                'promo_code'=> $this->input->post('promocode'), 
                'promo_discount'=> $_SESSION['CartTotal']['promo_disc'], 
                'tax_amount'=>"0",
                'total'=> $_SESSION['CartTotal']['total'], 
                'delivery_charge'=> $_SESSION['CartTotal']['delivery_charge'],
                'final_total'=> $_SESSION['CartTotal']['final_total'], 
                'order_val'=> $ord_var
			);  
			
			$data = $this->security->xss_clean($data); 	
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . 'order/placeorder'; 
			$records = $this->Commonmodel->postData($url, $data, $authtoken);
	 		/////prd($records);
			if($records['sucess']=='200'){
				$this->session->set_flashdata('success', 'Order has been added successfully!');
				redirect(base_url($this->model.'/order/index'));
			}else{
				$this->session->set_flashdata('error', $records['msg']);
				redirect(base_url($this->model.'/order/index'));
			} 
		}else{
			$data['title'] = 'Place Order';
			$authtoken = $this->session->userdata('authtoken'); 
			unset($_SESSION['is_wholesaler']); 
			unset($_SESSION['UserCart']);
			unset($_SESSION['CartTotal']);

			$url6 =  $this->config->item('APIURL') . 'franchise/index';
			$franData = $this->Commonmodel->getData($url6, $authtoken);
			$franchise = [];
			foreach ($franData['data'] as $key => $value) { 
				if($key==0){ $franchise_id =$value['_id']; }
				$franchise[$key]['_id']=$value['_id'];
				$franchise[$key]['firmname']= $value['firmname'];
			}
			$data['franchise'] = $franchise;

			$data['delivery_max_day'] = $this->delivery_max_day;
			$data['delivery_day_after_order'] = $this->delivery_day_after_order;

			$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
			$country_data = $this->Commonmodel->getData($url, $authtoken);
			if(@$country_data['sucess']=='200'){ 
				$data['country'] = $country_data['data'];
			} 
			$url =  $this->config->item('APIURL') . 'coupon/getcouponoffranchise/'.$franchise_id;	
			$coupon_data = $this->Commonmodel->getData($url, $authtoken);
			
			if(@$coupon_data['sucess']=='200'){ 
				foreach ($coupon_data['data'] as $ckey => $cvalue) {
					if ($cvalue['disc_in'] == 1) {
                        $temp = array( 'id'=> $cvalue['title'], 
                        		  'title'=> $cvalue['disc_value'].'% Discount ('.$cvalue['title'].')' );
                    } else {
                    	$temp = array('id'=> $cvalue['title'], 
                        		  'title'=> 'Rs. '.$cvalue['disc_value'].'/- Discount ('.$cvalue['title'].')' );
                    } 
                    $data['promocode'][] = $temp;
				} 
			} 

			$url =  $this->config->item('APIURL') . 'franchise/getfranchisecat/'.$franchise_id;
			$records = $this->Commonmodel->getData($url, $authtoken);  

			if($records['sucess']=='200'){
				foreach ($records['data'] as $catkey => $catvalue) {
					$data['maincategory'][] = $catvalue['Cats'];
				} 
			} 

			$url =  $this->config->item('APIURL') . "settings/getconfigData?franchiseId=".MAINFRANCHISE;
			$_configs = $this->Commonmodel->getData($url, $authtoken);
			
			$_configs = $_configs["data"];
			// prd($_configs);
			$temp = array();
			foreach($_configs[0] as $val){
				$temp[$val["id"]] = $val["title"];
			}

			$data['address_type'] = $temp;
			$temp = array();
			foreach($_configs[7] as $val){
				if($val['is_available'] == 1){
					$temp[$val["id"]] = $val["title"];
				}
			}
			$data['delivery_time'] = $temp;
			
			$temp = array();
			foreach($_configs[3] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['payment_method'] = $temp;
			$temp = array();
			foreach($_configs[1] as $val){
				$temp[$val["id"]] = $val["title"];
			}
			$data['units'] = $temp;
			$data['settings'] = $this->general_settings;
			
			$this->load->view('includes/_header');
			$this->load->view('order/place_order', $data);
			$this->load->view('includes/_footer');
		}
	}

	public function getDeliveryTimeZone(){
		
		$date =  $this->input->get('date');
		$franchiseId =  $this->input->get('franchiseId');
		$url =  $this->config->item('APIURL') . 'settings/getAvailbleTimeslot?date='.$date.'&franchiseId='.$franchiseId;	
		$records = $this->Commonmodel->getData($url, TOKEN);
		// prd($records);
		$data = array('status'=>false,'message'=>"", 'data'=>[]);
		if($records['status']=='200'){
			$arrayData = [];
			foreach($records['data'] as $val){
				if($val['is_available'] == 1){
					$arrayData[$val["id"]] = $val["title"];
				}
			}
			$data = array('status'=>true,'message'=>"", 'data'=>$arrayData);
		}
		echo json_encode($data); exit;
	}

	
	public function getdefaultaddressofuser(){   
		$authtoken = $this->session->userdata('authtoken');
		$userId =  $this->input->post('uid');
		$url =  $this->config->item('APIURL') . 'address/getdefaultaddressofuser/'.$userId; 
		$records = $this->Commonmodel->getData($url, $authtoken);
		$_SESSION['CartTotal']['user_wallet'] =  number_format(0,2,".",""); 
		$CartTotal = $this->setCartvalue();  
		$_SESSION['CartTotal'] = $CartTotal;	
		$data['sucess'] = $records['sucess'];
		$data['address'] = $records['data'];  
		$data['carttotal'] = $CartTotal;   
		$Date = date('Y-m-d');
		$data['delivery_max_day'] = date('Y-m-d', strtotime($Date. ' + '.$this->delivery_day_after_order.' days') );
		$data['delivery_day_after_order'] = date('Y-m-d', strtotime($Date. ' + '.$this->delivery_max_day.' days') );
		echo json_encode($data);
	}

	public function getfranchisecategorycoupon(){
		$authtoken = $this->session->userdata('authtoken');
		$fId =  $this->input->post('fid');
		$url =  $this->config->item('APIURL') . 'coupon/getcouponoffranchise/'.$fId;	
		$coupon_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$coupon_data['sucess']=='200'){ 
			foreach ($coupon_data['data'] as $ckey => $cvalue) {
				if ($cvalue['disc_in'] == 1) {
                    $temp = array( 'id'=> $cvalue['title'], 
                    		  'title'=> $cvalue['disc_value'].'% Discount ('.$cvalue['title'].')' );
                } else {
                	$temp = array('id'=> $cvalue['title'], 
                    		  'title'=> 'Rs. '.$cvalue['disc_value'].'/- Discount ('.$cvalue['title'].')' );
                } 
                $promocode[] = $temp;
			} 
		} 
		$url =  $this->config->item('APIURL') . 'franchise/getfranchisecat/'.$fId;
		$records = $this->Commonmodel->getData($url, $authtoken);  
		if($records['sucess']=='200'){
			foreach ($records['data'] as $catkey => $catvalue) {
				$maincategory[] = $catvalue['Cats'];
			} 
		}
		$catagory = '<option value="">Select Category</option>';
		foreach ($maincategory as $catkey => $catvalue) {
			$catagory.='<option value="'.$catvalue['_id'].'">'.$catvalue['title'].'</option>';
		}
		$procode = '<option value="">Select Coupon Code</option>';
		foreach ($promocode as $ckey => $cvalue) {
			$procode.='<option value="'.$cvalue['id'].'">'.$cvalue['title'].'</option>';
		} 
		$data['procode'] =$procode;
		$data['catagory'] =$catagory;
		echo json_encode($data);
	}

	public function getproductbycategory(){   
		$authtoken = $this->session->userdata('authtoken');
		$fId =  $this->input->post('fid');
		$cId =  $this->input->post('cid');
		$iswholesaler =  $this->input->post('iswholesaler');
		$url =  $this->config->item('APIURL') . 'product/getfranchiseproductsbycats/'.$fId.'/'.$cId;

		$records = $this->Commonmodel->getData($url, $authtoken);
		// prd($records);
		$data['sucess'] = '200';  
		$data['msg'] = '';  
		$html = ''; 
		if(empty($_SESSION['is_wholesaler'])){
			$_SESSION['is_wholesaler'] = $iswholesaler;
		} 

		foreach ($records['data'] as $pkey => $products) {
			foreach ($products['productvariants'] as $key => $value) {  
				$html.= '<div class="col-sm-4 product-main">'; 
	            $html.= '<div class="card">';
	            $html.= '<div class="card-header product-header" style="font-size: 14px; padding: 8px 5px;">'.$products['product']['title'].'</div>';
	            $html.= '<div class="card-body" style="padding: .50rem;"><div class="col-sm-12" style="border-bottom:1px solid #e5e5e5;padding-bottom: 5px;">';
	            if(!empty($products['pimgs'][0]['title'])){
	            	$html.= '<img id="user-img-nav1" alt="'.$products['product']['title'].'" src="'.$this->config->item('APIIMAGES').'product_img/'.@$products['pimgs'][0]['title'].'" width="150" height="150" />';
	            }else{
	            	$html.= '<img id="user-img-nav1" alt="'.$products['product']['title'].'" src="'.$this->config->item('APIIMAGES').'noimage.png" width="150" height="150" />';	
	            } 
	            $html.= '</div><div class="col-sm-12" style="font-size: 15px; padding-top:10px;">';    
	            $html.= '<div>Available Qty: '.$value['qty'].'</div>';    
	            $html.= '<div>Available In: '.$value['measurment'].' '.$this->config->item('smallunits')[$value['unit']].'</div>';    
	            $html.= '<div>Price(₹): '.$value['price'].'</div>';
	            $html.= '<div>Wholesale(₹): '.$value['wholesale'].'</div>';    
	            $html.= '</div>';    
	            $html.= '</div><div class="card-footer">';

	            if($iswholesaler=='true'){
	            	$proisactive = $value['is_ws_active'];
	            }else{  
	            	$proisactive = $value['is_active'];
	            }
	            if($proisactive=='1'){  
	            	$html.= '<button type="button" pvid="'.$value['_id'].'" class="btn btn-success btn-sm float-right addCart"><i class="fa fa-cart-arrow-down"></i> Add to cart</button>'; 
	        	}else{
	        		$html.= '<div class="btn btn-danger btn-sm float-right" style="cursor: default;">Sold Out</div>';
	        	}
	            $html.= '</div>';
	            $html.= '</div>';
	            $html.= '</div>';
        	}
		} 
		$data['html'] = $html;
		echo json_encode($data);
	}

	//-----------------------------------------------------------
	function getuseraddress($id,$mode=0){
		$data['title'] = 'User Address List'; 
		$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'address/edit/'.$id;
		$records = $this->Commonmodel->getData($url, $authtoken);
		///prd($records); 
		$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
		$user = $this->Commonmodel->getData($url, $authtoken);

		$data['user'] = $user['data'];
		$data['address'] = $records['data'];
		$data['mode'] = $mode;
		$this->load->view('order/change_address', $data); 
	}	

	//-----------------------------------------------------------
	function setdefaultaddressofuser(){
		$authtoken = $this->session->userdata('authtoken');
		$url =  $this->config->item('APIURL') . 'address/default';
		$data = $this->input->post();
		$records = $this->Commonmodel->postData($url, $data, $authtoken);	
		$data = array();  
		echo json_encode($records);
	}

	//-----------------------------------------------------------
	function adduseraddress($id){
		$data['title'] = 'User Add Address'; 
		$authtoken = $this->session->userdata('authtoken');  		 
		$url =  $this->config->item('APIURL') . 'user/edit/'.$id;
		$user = $this->Commonmodel->getData($url, $authtoken);
		// country
		$url =  $this->config->item('APIURL') . 'country/index?is_active=1';		
		$country_data = $this->Commonmodel->getData($url, $authtoken);
		if(@$country_data['sucess']=='200'){ 
			$data['country'] = $country_data['data'];
		} 
		$url =  $this->config->item('APIURL') . "settings/getconfigs";
		$_configs = $this->Commonmodel->getData($url, $authtoken);
		$_configs = $_configs["data"];
		$temp = array();
		foreach($_configs[0] as $val){
			$temp[$val["id"]] = $val["title"];
		}
		$data['address_type'] = $temp;
		$data['user'] = $user['data']; 
		$this->load->view('order/add_address', $data); 
	}	

	//-----------------------------------------------------------
	function add_deliveryaddress(){
		$data = array(
					'userId' => $this->input->post('userId'),
					'address_type' => $this->input->post('address_type'),
					'address1' => $this->input->post('address1'),
					'address2' => $this->input->post('address2'), 
					'countryId' => $this->input->post('countryId'), 
					'stateId' => $this->input->post('stateId'), 
					'cityId' => $this->input->post('cityId'), 
					'areaId' => $this->input->post('areaId'), 
					'pincode' => $this->input->post('pincode'), 
					'phone_no' => $this->input->post('phone_no'), 
					'lat'=> '26.301048636780852',
            		'long'=> '73.05697571163942',
					'is_active' => "1", 
					'default_address'=>true
				);
		$data = $this->security->xss_clean($data); 
		$authtoken = $this->session->userdata('authtoken');  
		// remove default old address
		$rdata = array( 'userId' => $this->input->post('userId') );
		$url =  $this->config->item('APIURL') . 'address/removedefaultaddress'; 
		$records = $this->Commonmodel->postData($url, $rdata, $authtoken);
		////prd($records);
		// save new address
		$url =  $this->config->item('APIURL') . 'address/save'; 
		$records = $this->Commonmodel->postData($url, $data, $authtoken);
		echo json_encode($records); exit; 
	} 

	function applycouponcode(){
		$userId = $this->input->post('uid');
		$franchiseId = $this->input->post('fid'); 
		$code = $this->input->post('code');  
		$_SESSION['CartTotal']['promo_disc'] = number_format(0,2,".","");
		$authtoken = $this->session->userdata('authtoken');  
		$url =  $this->config->item('APIURL') . "coupon/checkexpiry/".$code."/".$franchiseId."/".$userId;
		$couponData = $this->Commonmodel->getData($url, $authtoken);
		if(@$couponData["sucess"]=='200'){
			$couponcode = $couponData["data"];
			$ttlAmt = isset($_SESSION['CartTotal']['final_total'])?$_SESSION['CartTotal']['final_total']:0;
			if(!empty($ttlAmt)){
				$disc = 0;
	            if ($couponcode['disc_in'] == 1) {  //Percentage (%)
	                $disc = $ttlAmt * ($couponcode['disc_value'] / 100);
	            } else {   //Rupees (Rs.)
	                $disc = $couponcode['disc_value'];
	            }
	            $_SESSION['CartTotal']['promo_disc'] = number_format($disc,2,".",""); 
	            $records['status'] = '1';
				$records['msg'] = 'coupon code add successfully!!!';
			}else{
				$records['status'] = '2';  
				$_SESSION['CartTotal']['promo_disc'] = number_format(0,2,".",""); 
				$records['msg'] = 'Please Add Product in cart then apply coupon code!!!';
			}
		}else{
			$records['status'] = '2'; 
			$_SESSION['CartTotal']['promo_disc'] = number_format(0,2,".","");
			$records['msg'] = isset($couponData["msg"])?$couponData["msg"]:"coupon code not apply!!!";
		} 
		$CartTotal = $this->setCartvalue();
		$records['data'] = $CartTotal;
		echo json_encode($records); exit; 
	}

	function updateusewallet(){
		$userId = $this->input->post('uid');
		$mode = $this->input->post('mode'); 
		if($mode==1){
			$_SESSION['CartTotal']['user_wallet'] = 0;
			$final_total = !empty($_SESSION['CartTotal']['final_total'])?$_SESSION['CartTotal']['final_total']:0;
			if($final_total==0){
				$records['status'] = '2';
				$records['msg'] = 'Please add product in cart first!!!';
			}else{
				$url =  $this->config->item('APIURL') . 'user/getuserbyid/'.$userId;
				$authtoken = $this->session->userdata('authtoken'); 
				$userDetail = $this->Commonmodel->getData($url, $authtoken);	
				$userData = $userDetail['data'][0];
				$user_wallet = $userData['wallet_balance'];
				if($user_wallet>0){
					$final_total = $_SESSION['CartTotal']['final_total'];
					if($final_total > $user_wallet){
						$_SESSION['CartTotal']['user_wallet'] = number_format($user_wallet,2,".","");
					}else{
						$_SESSION['CartTotal']['user_wallet'] = number_format($final_total,2,".","");
					} 
					$records['status'] = '1';
					$records['msg'] = 'Wallet amount used from cart!!!';
				}else{
					$records['status'] = '2';
					$records['msg'] = 'User wallet have zero ballance!!';
				}
			}
		}else{
			$_SESSION['CartTotal']['user_wallet'] = number_format(0,2,".","");
 			$records['status'] = '1';
			$records['msg'] = 'Wallet amount remove from cart!!!';
		}
		$CartTotal = $this->setCartvalue();
		$records['data'] = $CartTotal;
		echo json_encode($records); exit; 		
	}

	function checkorderdeliverydata(){
		$userId = $this->input->post('uid');
		$todaydate = date('Y-m-d');
		$delivery_date = $this->input->post('delivery_date'); 
		$delivery_time = $this->input->post('delivery_time'); 
		$min_delivery_date = date('Y-m-d', strtotime($delivery_date. ' + '.$this->delivery_day_after_order.' days')); 
		$delivery_max_day = date('Y-m-d', strtotime($todaydate. ' + '.$this->delivery_max_day.' days')); 
		if(strtotime($delivery_date) >= strtotime($delivery_max_day)){
			$records['status'] = '2';
			$records['msg'] = $this->general_settings['site_name']." can not allow delivery after ".$this->delivery_chrge." days!!";
		}else{
			$records['status'] = '1';
			$records['msg'] = 'You can place order!!!';
		}
		echo json_encode($records); exit; 	
	}

	function addcartinsession(){
		$userId = $this->input->post('uid');
		$franchiseId = $this->input->post('fid');
		$productvariantId = $this->input->post('pvid');		
		$mode = $this->input->post('mode');
		$promo_disc = isset($_SESSION['CartTotal']['promo_disc'])?$_SESSION['CartTotal']['promo_disc']:0;
		$user_wallet = isset($_SESSION['CartTotal']['user_wallet'])?$_SESSION['CartTotal']['user_wallet']:0;
		$cartqty = 0;
		if($mode==1){
			/// get product varient detail
			$authtoken = $this->session->userdata('authtoken');  
			$url =  $this->config->item('APIURL') . "product/getproductvarientbyId/".$productvariantId;
			$productvariant = $this->Commonmodel->getData($url, $authtoken);
			$productvariant = $productvariant["data"][0]; 
			$proQty = @$_SESSION['UserCart'][$productvariant['_id']]['qty']+1;
			
			if($_SESSION['is_wholesaler']=='true'){
				$pvarprice = $productvariant['wholesale'];
				$discAmt = 0;
			}else{
				$pvarprice = $productvariant['price'];
				$discAmt = (($productvariant['disc_price'] / 100)) * ($pvarprice * ((@$_SESSION['UserCart'][$productvariant['_id']]['qty']+1)));
			} 
			if($productvariant['qty']>=$proQty){
				$cart_data= array(
						'productId' => $productvariant['productId'],
						'franchiseId'=> $productvariant['franchiseId'],
						'frproductId'=> $productvariant['frproductId'],
		                'frproductvarId'=> $productvariant['_id'],
		                'price'=> $pvarprice, 
		                'discount'=> $productvariant['disc_price'], 
		                'qty'=> $proQty,
		                'image_url'=> @$productvariant['productimg'][0],
		                'measurement'=> $productvariant['measurment'],
		                'unit'=> $productvariant['unit'],
		                'title'=> $productvariant['producttitle'],
		                'total' => (@$_SESSION['UserCart'][$productvariant['_id']]['qty']+1)*$pvarprice,
						'disc' => $discAmt,
				);
				$_SESSION['UserCart'][$productvariant['_id']] = $cart_data;
			}else{
				$records['status'] = '0';
				$records['msg'] = 'Oops! Limited stock available!!!';
				$records['data']['UserCart'] = '';
				$records['data']['CartTotal'] = $_SESSION['CartTotal'];
				echo json_encode($records); exit; 
			}
		}elseif($mode==2){ 
			if(($_SESSION['UserCart'][$productvariantId]['qty']-1) >0){
				$_SESSION['UserCart'][$productvariantId]['qty']= $_SESSION['UserCart'][$productvariantId]['qty']-1;
				$productvariant_price = $_SESSION['UserCart'][$productvariantId]['price'];
				$productvariant_disc = $_SESSION['UserCart'][$productvariantId]['discount'];
				$_SESSION['UserCart'][$productvariantId]['total'] =  ($_SESSION['UserCart'][$productvariantId]['qty'])*$productvariant_price;  
				if($_SESSION['is_wholesaler']=='true'){
					$pvarprice = $productvariant_price;
					$discAmt = 0;
				}else{
					$pvarprice = $productvariant_price;
					$discAmt = (($productvariant_disc / 100) * ($productvariant_price * $_SESSION['UserCart'][$productvariantId]['qty']));
				} 
				$_SESSION['UserCart'][$productvariantId]['disc'] = $discAmt;
			}else{
				unset($_SESSION['UserCart'][$productvariantId]);
			}
		}elseif($mode==3){
			unset($_SESSION['UserCart'][$productvariantId]);
		} 
		$total = $disc = $final_total = 0;  
 		$cartdata['promo_disc'] = number_format($promo_disc,2,".","");
 		$cartdata['total'] = number_format($total,2,".","");
 		$cartdata['disc'] = number_format($disc,2,".","");
 		$cartdata['user_wallet'] = number_format($user_wallet,2,".","");
 		//prd($_SESSION['UserCart']);
		foreach ($_SESSION['UserCart'] as $key => $value) {
			//// total
			$total+=$value['total']; 
			$cartdata['total'] =  number_format($total,2,".","");
			/// disc
			$disc+=$value['disc'];
			$cartdata['disc'] = number_format($disc,2,".","");
			$cartqty+=$value['qty'];
		} 
		if($_SESSION['is_wholesaler']=='true'){
			$minOrderVal = $this->min_order_wholesaler;
		}else{
			$minOrderVal = $this->min_order;
		}	
		if(($this->accept_minimum_order==false) 
			&&  ($total) < (float)$minOrderVal){
			$delivery_charge = $this->delivery_chrge;
		}else{
			if( ($total) < (float)$minOrderVal){
				$delivery_charge = $this->delivery_chrge;
			}else{
				$delivery_charge = 0;
			}
		} 
		$cartdata['delivery_charge'] = number_format($delivery_charge,2,".","");

		$cartdata['cartqty'] = $cartqty;
		//// final_total
		if(($disc+$promo_disc) > $total){
			$final_total= 0;
		}else{
			$final_total= ($total-($disc+$promo_disc));
		}
		if($final_total <= $user_wallet){ 
			$final_total = 0;
		}else{
			$final_total = ($final_total-$user_wallet);
		}
		$cartdata['final_total'] = number_format($final_total+$delivery_charge,2,".",""); 

		if($cartdata['final_total'] < $user_wallet){ 
 			$_SESSION['CartTotal']['user_wallet'] =  number_format(0,2,".",""); 
 			$CartTotal = $this->setCartvalue();  
			$_SESSION['CartTotal'] = $CartTotal; 
 		}else{
			$_SESSION['CartTotal'] = $cartdata; 
 		}
		$UserCart = ''; 
		foreach ($_SESSION['UserCart'] as $key => $value) {
			$UserCart.= '<div class="col-sm-12 " style="position: relative;" id="cartrow'.$value['frproductvarId'].'">'; 
	        $UserCart.= '<div class="card" style="margin-bottom: .5rem !important;">';
	        $UserCart.= '<div class="row" style="padding: 5px;">';
	        $UserCart.= '<div class="col-sm-3">';
	         if(!empty($value['image_url'])){
	            	$UserCart.= '<img id="user-img-nav1" alt="'.$value['title'].'" src="'.$this->config->item('APIIMAGES').'product_img/'.@$value['image_url'].'" width="50" height="50" />';
	            }else{
	            	$UserCart.= '<img id="user-img-nav1" alt="'.$value['title'].'" src="'.$this->config->item('APIIMAGES').'noimage.png" width="50" height="50" />';	
	            } 
	        $UserCart.= '</div>';
	        $UserCart.= '<div class="col-sm-6" style="font-size:14px;"><div>'.$value['title'].'</div>';
	        $UserCart.= '<div>Price(₹):'.$value['price'].'</div>';
	        $UserCart.= '<div>Available In: '.$value['measurement'].' '.$this->config->item('smallunits')[$value['unit']].'</div>'; 
	        $UserCart.= '<div>Amount(₹):'.$value['price']*$value['qty'].'</div>';
	        $UserCart.= '</div>';
	        $UserCart.= '<div class="col-sm-3" style="padding: 0px;"><span class="form-control" style="width:50%; margin-top: 20px;padding: 8px 2px;">'.$value['qty'].'</span>
	        	 <i aria-hidden="true" style="position: absolute; top: 20px; right: 25px;color: #018601!important;cursor:pointer;" pvid="'.$value['frproductvarId'].'" class="fa fa-plus float-right inc-btn addCart"></i> <br> <i aria-hidden="true" pvid="'.$value['frproductvarId'].'"  style="position: absolute; top: 50px; right: 25px; color: #f90202!important;cursor:pointer;" class="fa fa-minus float-right inc-btn minusCart"></i>';
	        $UserCart.= '<div pvid="'.$value['frproductvarId'].'" style="position: absolute; top: -8px; right: 8px; cursor:pointer;" class="removeCart"><i class="fa fa-times"></i></div></div>';
	        $UserCart.= '</div></div></div>';
		}
		$records['status'] = '1';
		$records['msg'] = 'Product add successfully in cart!!!';
		$records['data']['UserCart'] = $UserCart;
		$records['data']['CartTotal'] = $_SESSION['CartTotal'];
		echo json_encode($records); exit;  
	}

	function setCartvalue(){
		$promo_disc = isset($_SESSION['CartTotal']['promo_disc'])?$_SESSION['CartTotal']['promo_disc']:0;
		$user_wallet = isset($_SESSION['CartTotal']['user_wallet'])?$_SESSION['CartTotal']['user_wallet']:0;
		$iswholesaler =  $this->input->post('iswholesaler');
		$total = $disc = $final_total = $cartqty = 0;  
		$cartdata['promo_disc'] = number_format($promo_disc,2,".",""); 
 		$cartdata['total'] = number_format($total,2,".","");
 		$cartdata['disc'] = number_format($disc,2,".","");
 		$cartdata['user_wallet'] = number_format($user_wallet,2,".","");
 		if(!empty($_SESSION['UserCart'])){
			foreach ($_SESSION['UserCart'] as $key => $value) {
				//// total
				$total+=$value['total']; 
				$cartdata['total'] =  number_format($total,2,".","");
				/// disc
				$disc+=$value['disc'];
				$cartdata['disc'] = number_format($disc,2,".","");
				$cartqty+=$value['qty'];
			}  
		}
		if(empty($_SESSION['is_wholesaler'])){
			$_SESSION['is_wholesaler'] = $iswholesaler;
		}
		if($_SESSION['is_wholesaler']=='true'){
			$minOrderVal = $this->min_order_wholesaler;
		}else{
			$minOrderVal = $this->min_order;
		}
		if(($this->accept_minimum_order==false) 
			&&  ($total) < (float)$minOrderVal){
			$delivery_charge = $this->delivery_chrge;
		}else{
			if( ($total) < (float)$minOrderVal){
				$delivery_charge = $this->delivery_chrge;
			}else{
				$delivery_charge = 0;
			}
		} 
		$cartdata['delivery_charge'] = number_format($delivery_charge,2,".",""); 
		$cartdata['cartqty'] = $cartqty;
		//// final_total 
		if(($disc+$promo_disc) > $total){
			$final_total= 0;
		}else{
			$final_total= ($total-($disc+$promo_disc));
		}
		if($final_total <= $user_wallet){
			$final_total = 0;
		}else{
			$final_total = ($final_total-$user_wallet);
		}
		$cartdata['final_total'] = number_format($final_total+$delivery_charge,2,".",""); 
		$_SESSION['CartTotal'] = $cartdata; 
		return $_SESSION['CartTotal'];
	}


	function getchkOrderPay($userid,$orderid){
		$razorpay_key =  $this->general_settings["razor_key_id"];
		$razorpay_secret =  $this->general_settings["razor_key_secret"];
	 	$api = new Api($razorpay_key, $razorpay_secret);

	 	$authtoken = $this->session->userdata('authtoken'); 
		$url =  $this->config->item('APIURL') . 'order/trackingorder/'.$userid.'/'.$orderid;
		$records = $this->Commonmodel->getData($url, $authtoken);
		$order= [];
		$payment = [];
		if($records['sucess']=='200'){
				$order = $records['data'][0];
				$razorpay_order_id = $order['razorpay_order_id'];
				$razorpay_payment_id = $order['razorpay_payment_id'];

			 	if(!empty($razorpay_order_id)){
					$payment = $api->order->fetch($razorpay_order_id);  
					if(!empty($payment) && $payment->status=='paid' && $order['is_active']!=6){  //paid
						// update payment api code  
						$rdata = array( 'orderId' => $order['_id'], "payment_status"=>2,"razorpay_amt"=>@$order['razorpay_amt'], "razorpay_payment_id"=>$order['razorpay_payment_id'], "payment_method"=>2,  );
						$url =  $this->config->item('APIURL') . 'order/updateorderpayment'; 
						$paydata = $this->Commonmodel->postData($url, $rdata, $authtoken);
					}
				}else if(!empty($razorpay_payment_id)){
					$payment = $api->payment->fetch($razorpay_payment_id);  
					if(!empty($payment) && $payment->status=='captured' && $order['is_active']!=6){  //captured
						// update payment api code  
						$rdata = array( 'orderId' => $order['_id'], "payment_status"=>2,"razorpay_amt"=>@$order['razorpay_amt'], "razorpay_payment_id"=>$order['razorpay_payment_id'], "payment_method"=>2,  );
						$url =  $this->config->item('APIURL') . 'order/updateorderpayment'; 
						$paydata = $this->Commonmodel->postData($url, $rdata, $authtoken);

					}
				}
		}	
		$data['payment'] = $payment; 
		$data['order_details'] = $order;
		///prd($payment);
		$this->load->view('order/paymentstatus', $data);		
	}
}
?>