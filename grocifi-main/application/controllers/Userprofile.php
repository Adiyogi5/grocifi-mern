<?php defined('BASEPATH') or exit('No direct script access allowed');

class Userprofile extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        authfront_check(); 
        authfront_area(); 
        $this->authtoken = $this->session->userdata('authUser')['authtoken'];
        $this->areaId = $this->session->userdata('authUser')['location']['3'];
        $this->load->library('pagination');
        $this->load->Model('Commonmodel', 'Commonmodel');
    }


    public function dashboard($value='')
    {   $user = "";
        $data = [];
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) {
            $user = $this->Commonmodel->getData($this->config->item('APIURL') . '/user/edit/' . $user_data['authUser']['user']['_id'], $this->authtoken);
            $user = $user['data'];
        }
        $data['title'] = "Dashboard";
        $data['user'] = $user;
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/dashboard');
        $this->load->view('home/includes/_footer');
    }


    public function index()
    {
        $user = "";
        $data = [];
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) {
            $user = $this->Commonmodel->getData($this->config->item('APIURL') . '/user/edit/' . $user_data['authUser']['user']['_id'], $this->authtoken);
            $user = $user['data'];
        }
        if($user){
            if ($this->input->post()) {

                $this->form_validation->set_rules('fname', "First Name", 'trim|xss_clean|required');
                $this->form_validation->set_rules('lname', "Last Name", 'trim|xss_clean|required');
                $this->form_validation->set_rules('email', "First Name", 'trim|xss_clean|required|valid_email');

                if ($this->form_validation->run() == false) {
                    $data = array(
                        'errors' => validation_errors()
                    );
                    $this->session->set_flashdata('errors', $data['errors']);
                    $data['title'] = "Profile";
                    $data['user'] = $user;
                    $this->load->view('home/includes/_header', $data);
                    $this->load->view('home/profile');
                    $this->load->view('home/includes/_footer');

                } else {
                    $postData['fname'] = $this->input->post('fname');
                    $postData['lname'] = $this->input->post('lname');
                    $postData['email'] = $this->input->post('email');
                    $postData['_id'] = $user['_id'];

                    if (!empty($_FILES['img']['name'])) {
                        $filename = $_FILES['img']['tmp_name'];
                        $request = ['img' => $this->Commonmodel->getCurlValue($filename, $_FILES['img']['type'], $_FILES['img']['name'])];
                        $url = $this->config->item('APIURL') . 'user/uploadimg/';
                        $authtoken = $this->authtoken;
                        $result = $this->Commonmodel->postImgCurl($url, $request, $this->authtoken);
                        if ($result['sucess'] == '200') {
                            $postData['img'] = $result['name'];
                        } else {
                            $this->session->set_flashdata('error', 'Something went wrong, image not uploaded. Please try again!');
                            redirect(base_url('profile'));die;
                        }
                    }

                    $result = $this->Commonmodel->postData($this->config->item('APIURL') . 'user/edit', $postData, $this->authtoken);

                    if ($result['sucess'] == 200) {
                        $this->session->set_flashdata('success', 'Profile Updated Successfully!!');
                        redirect(base_url('profile'));

                    } else {
                        $this->session->set_flashdata('errors', 'Something went wrong!!');
                        redirect(base_url('profile'));
                    }

                }
            }
            $data['title'] = "My Profile";
            $data['user'] = $user;
            $this->load->view('home/includes/_header', $data);
            $this->load->view('home/profile');
            $this->load->view('home/includes/_footer');
        }else{

            $data['title'] = "404 Error";
            $data['msg'] = '<i class="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found!!';
            $this->load->view('home/includes/_header', $data);
            $this->load->view('home/error');
            $this->load->view('home/includes/_footer');

        }
    }


    // user's wallet history
    public function wallet_history()
    {
        $data = [];
        $wallet = "";
        $start = 0;
        $limit = 20;
        $total = 0;
        $current_page = 0;
        if (!empty($_GET['page'])) {
            $current_page = $_GET['page'];
            $start = ($current_page > 1) ? ($current_page - 1) * $limit : 0;
        }
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) {          

            $wallet = $this->Commonmodel->getData($this->config->item('APIURL') . 'walletlog/gethistory/' . $user_data['authUser']['user']['_id'].'?start=' . $start . '&limit=' . $limit, $this->authtoken);
            if (isset($wallet["sucess"]) && $wallet["sucess"] == 200) {

                if (is_array($wallet["data"]) && isset($wallet["data"][0])) {
                    $total = $wallet["total"];
                    $wallet = $wallet["data"];                    
                } else {
                    $wallet = "";
                }
            }
        }
        
        $this->Commonmodel->pageConfig('wallet_history', $total, $limit);

        $data['title'] = "Wallet History";
        $data['wallet'] = $wallet;
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/wallet');
        $this->load->view('home/includes/_footer'); 
    }

    // user's notifications
    public function notifications($type=null)
    {
        $data = [];
        $notify = "";
        $start = 0;
        $limit = 20;
        $total = 0;
        $current_page = 0;
        if (!empty($_GET['page'])) {
            $current_page = $_GET['page'];
            $start = ($current_page > 1) ? ($current_page - 1) * $limit : 0;
        }
        $ntype = "";
        if($type=='personal'){
            $ntype=0;
        }elseif($type=='general'){
            $ntype=1;
        }        
       
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) { 
          
            $response = $this->Commonmodel->getData($this->config->item('APIURL') . 'notify/getnotification/' . $user_data['authUser']['user']['_id'].'/'.$ntype.'?start=' . $start . '&limit=' . $limit, $this->authtoken);
            if (isset($response["sucess"]) && $response["sucess"] == 200) {
                if (is_array($response["data"]) && isset($response["data"][0])) {
                    $total = $response["total"];
                    $notify = $response["data"];
                } else {
                    $notify = "";
                }
            }
        }

        $this->Commonmodel->pageConfig('notifications', $total, $limit);
        $data['title'] = "Notifications";
        $data['notify'] = $notify;
        $data['type'] = $type;

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/notification');
        $this->load->view('home/includes/_footer');

    }

    // user's orders
    public function myorders()
    {
        $data = [];
        $current_month = (isset($_GET['month']) && $_GET['month'] != '') ? $_GET['month'] : date("m");
        $current_year = (isset($_GET['year']) && $_GET['year'] != '') ? $_GET['year'] : date("Y");

        $user_data = $this->session->userdata();

        $orders = array();

        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) {
 
            $orders = $this->Commonmodel->getData($this->config->item('APIURL') . 'order/getorderwhere?month=' . $current_month . '&year=' . $current_year, $this->authtoken);

            if (isset($orders["sucess"]) && $orders["sucess"] == 200) {
                if (is_array($orders["data"]) && isset($orders["data"][0])) {
                    $orders = $orders["data"];
                } else {
                    $orders = array();
                }
            } else {
                $orders = array();
            }
        }

        $data['title'] = "My Orders";
        $data['orders'] = $orders;
        $data['current_month'] = $current_month; 
        $data['current_year'] = $current_year; 
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/myorder');
        $this->load->view('home/includes/_footer');
    }


    // user's address
    public function myaddress()
    {
        $user_data = $this->session->userdata();

        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) { 

            $addresses = $this->Commonmodel->getData($this->config->item('APIURL') . '/address/edit/' . $user_data['authUser']['user']['_id'], $this->authtoken);
            if (isset($addresses["sucess"]) && $addresses["sucess"] == 200) {
                $addresses = $addresses['data'];
            } else {
                $addresses = array();
            }
            $user = $this->Commonmodel->getData($this->config->item('APIURL') . '/user/edit/' . $user_data['authUser']['user']['_id'], $this->authtoken);
            $user = $user['data'];
        }
        
        $data['title'] = "My Address"; 
        $data['user'] = $user;
        $data['addresses'] = $addresses;

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/myaddress');
        $this->load->view('home/includes/_footer');
    }



    // add user's address
    public function add_address()
    {
        $user_data = $this->session->userdata();         

        $country = $this->Commonmodel->getData($this->config->item('APIURL') . 'country/index?is_active=1', $this->authtoken);
        if ($country["sucess"] == 200 && isset($country["data"][0])) {
            $search_country = $country['data'];
        } 
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) {
            $user = $this->Commonmodel->getData($this->config->item('APIURL') . '/user/edit/' . $user_data['authUser']['user']['_id'], $this->authtoken);
            $user = $user['data'];
        }
        $addressTypeArr = [];
        $address_settings = $this->Commonmodel->getData($this->config->item('APIURL') . 'settings/getconfigs?date=' . date('Y-m-d'), $this->authtoken);
        foreach ($address_settings["data"][0] as $val) {
            $addressTypeArr[$val["id"]] = $val["title"];
        }

        // submit address
        if ($this->input->post()) {

            $this->form_validation->set_rules('address1', 'Address 1', 'required|xss_clean');
            $this->form_validation->set_rules('address2', 'Address 2', 'required|xss_clean');
            $this->form_validation->set_rules('address_type', 'Address Type', 'required|xss_clean');
            $this->form_validation->set_rules('countryId', 'Country', 'required|xss_clean');
            $this->form_validation->set_rules('stateId', 'State', 'required|xss_clean');
            $this->form_validation->set_rules('cityId', 'City', 'required|xss_clean');
            $this->form_validation->set_rules('areaId', 'Area', 'required|xss_clean');
            $this->form_validation->set_rules('pincode', 'Pincode', 'required|xss_clean');
            // $this->form_validation->set_rules('lat', 'Latitude', 'required|xss_clean');
            // $this->form_validation->set_rules('long', 'Longitude', 'required|xss_clean');

            if ($this->form_validation->run() == false) {
                $data['errors'] = validation_errors();

                $this->session->set_flashdata('errors', $data['errors']);
                // $this->load->view('home/includes/_header', $data);
                // $this->load->view('home/add_address');
                // $this->load->view('home/includes/_footer');
                // redirect(base_url('add_address'));
            } else {

                $postData['address1'] = $this->input->post('address1');
                $postData['address2'] = $this->input->post('address2');
                $postData['address_type'] = $this->input->post('address_type');
                $postData['countryId'] = $this->input->post('countryId');
                $postData['stateId'] = $this->input->post('stateId');
                $postData['cityId'] = $this->input->post('cityId');
                $postData['areaId'] = $this->input->post('areaId');
                $postData['pincode'] = $this->input->post('pincode');
                $postData['default_address'] = isset($_POST["default_address"]) ? "true" : "false";
                $postData['userId'] = $user['_id'];
                $postData['phone_no'] = $user['phone_no'];
                $postData['created'] = date('Y-m-d h:i:s');
                $postData['modified'] = date('Y-m-d h:i:s');
                $postData['lat'] = $this->input->post('lat');
                $postData['long'] = $this->input->post('long');
                $postData['createdby'] = $user['_id'];
                $postData['modifiedby'] = $user['_id'];

                $result = $this->Commonmodel->postData($this->config->item('APIURL') . '/address/save', $postData, $this->authtoken);

                if ($result['sucess'] == 200) {
                    $this->session->set_flashdata('success', 'Address Added Successfully!!');
                    redirect(base_url('myaddress'));
                } else {
                    $this->session->set_flashdata('errors', 'Something Went Wrong!!');
                    redirect(base_url('myaddress'));
                }
            }
        }
       
        $data['title'] = "Add Address";
        $data['addressTypeArr'] = $addressTypeArr;
        $data['search_country'] = $search_country;
        $data['user'] = $user;

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/add_address');
        $this->load->view('home/includes/_footer');
    }

    // edit user's address
    public function edit_address($addressId = null)
    {
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) {
            $user = $this->Commonmodel->getData($this->config->item('APIURL') . '/user/edit/' . $user_data['authUser']['user']['_id'], $this->authtoken);
            $user = $user['data'];
        }

        $address = $this->Commonmodel->getData($this->config->item('APIURL') . '/address/getaddress/' . $addressId, $this->authtoken);
        if (isset($address['sucess']) && $address['sucess'] == 200) {
            $address = $address['data'];
        } else {
            $this->session->set_flashdata('error', 'Invalid Address Id');
            redirect(base_url('myaddress'));die;
        } 

        $country = $this->Commonmodel->getData($this->config->item('APIURL') . 'country/index?is_active=1', $this->authtoken);
        if ($country["sucess"] == 200 && isset($country["data"][0])) {
            $search_country = $country['data'];
        } 
        $addressTypeArr = [];
        $address_settings = $this->Commonmodel->getData($this->config->item('APIURL') . 'settings/getconfigs?date=' . date('Y-m-d'), $this->authtoken);
        foreach ($address_settings["data"][0] as $val) {
            $addressTypeArr[$val["id"]] = $val["title"];
        }

        if ($this->input->post()) {

            $this->form_validation->set_rules('address1', 'Address 1', 'required|xss_clean');
            $this->form_validation->set_rules('address2', 'Address 2', 'required|xss_clean');
            $this->form_validation->set_rules('address_type', 'Address Type', 'required|xss_clean');
            $this->form_validation->set_rules('countryId', 'Country', 'required|xss_clean');
            $this->form_validation->set_rules('stateId', 'State', 'required|xss_clean');
            $this->form_validation->set_rules('cityId', 'City', 'required|xss_clean');
            $this->form_validation->set_rules('areaId', 'Area', 'required|xss_clean');
            $this->form_validation->set_rules('pincode', 'Pincode', 'required|xss_clean');
            $this->form_validation->set_rules('lat', 'Latitude', 'required|xss_clean');
            $this->form_validation->set_rules('long', 'Longitude', 'required|xss_clean');

            if ($this->form_validation->run() == false) {
                $data['errors'] = validation_errors();
                redirect(base_url('edit_address'));
            } else {

                $postData['address1'] = $this->input->post('address1');
                $postData['address2'] = $this->input->post('address2');
                $postData['address_type'] = $this->input->post('address_type');
                $postData['countryId'] = $this->input->post('countryId');
                $postData['stateId'] = $this->input->post('stateId');
                $postData['cityId'] = $this->input->post('cityId');
                $postData['areaId'] = $this->input->post('areaId');
                $postData['pincode'] = $this->input->post('pincode');
                $postData['default_address'] = isset($_POST["default_address"]) ? "true" : "false";
                $postData['lat'] = $this->input->post('lat');
                $postData['long'] = $this->input->post('long');
                $postData['modifiedby'] = $user['_id'];

                $result = $this->Commonmodel->postData($this->config->item('APIURL') . '/address/edit/' . $addressId, $postData, $this->authtoken);

                if ($result['sucess'] == 200) {
                    $this->session->set_flashdata('success', 'Address Updated Successfully!!');
                    redirect(base_url('myaddress'));
                } else {
                    $this->session->set_flashdata('errors', 'Something Went Wrong!!');
                    redirect(base_url('myaddress'));
                }
            }
        }

        $data['title'] = "Edit Address";
        $data['addressTypeArr'] = $addressTypeArr;
        $data['search_country'] = $search_country;        
        $data['user'] = $user;
        $data['address'] = $address;

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/edit_address');
        $this->load->view('home/includes/_footer');
    }


    // user's friend list
    public function friend_list()
    {
        $data = [];
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) { 

            $myFriends = $this->Commonmodel->getData($this->config->item('APIURL') . 'user/getmyfriends/' . $user_data['authUser']['user']['_id'], $this->authtoken);

            if (is_array($myFriends["data"]) && isset($myFriends["data"][0])) {
                $myFriends = $myFriends["data"];
            } else {
                $myFriends = array();
            }

        }

        $data['title'] = "My Friends";
        $data['myFriends'] = $myFriends;
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/myfriend');
        $this->load->view('home/includes/_footer');        
    }


    // user's wish list
    public function wishlist()
    {
        $data = [];
        $user_data = $this->session->userdata();
        if (isset($user_data['authUser']['isLoggedIn']) && $user_data['authUser']['user']['role_type'] == 4) { 

             $wishlist =[];

        }

        $data['title'] = "My Wish List";
        $data['wishlist'] = $wishlist;
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/myfriend');
        $this->load->view('home/includes/_footer');        
    }


}
