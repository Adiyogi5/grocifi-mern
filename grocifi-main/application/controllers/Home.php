<?php defined('BASEPATH') or exit('No direct script access allowed');

class HOME extends MY_Controller
{

    public function __construct()
    {
        parent::__construct();
        authfront_check(); // check login auth
        authfront_area(); // check location
        $this->authtoken = $this->session->userdata('authUser')['authtoken'];
        $this->areaId = $this->session->userdata('authUser')['location']['3'];
        $this->load->library('mailer');
        $this->load->Model('Commonmodel', 'Commonmodel');

    }

    public function index()
    {
        // Update Banner  
        $siteBanner = $this->Commonmodel->getData($this->config->item('APIURL') . 'franchise/getfrbanner/' . $this->areaId, $this->authtoken);

        $banner = [];
        if (isset($siteBanner["data"])) {
            foreach ($siteBanner["data"] as $key => $value) {
                $banner[] = array($value["title"], $this->config->item('BANNERIMAGEPATH') . $value["img"]);
            }
        }
        // Offer
        $offer_banner = $this->Commonmodel->getData($this->config->item('APIURL') . 'offer/index/' . $this->areaId . '/1', $this->authtoken);
        
        // Home Products
        $homeProduct = $this->Commonmodel->getData($this->config->item('APIURL') . 'franchise/getfranchiseproducts/' . $this->areaId . '?user_type=0', $this->authtoken);

        // Home Products
        $featureProduct = $this->Commonmodel->getData($this->config->item('APIURL') . 'franchise/getfeatureproductlist/' . $this->areaId . '?user_type=0', $this->authtoken);

        if (isset($homeProduct["sucess"]) && $homeProduct["sucess"] == 200) {
            if (is_array($homeProduct["data"]) && isset($homeProduct["data"][0])) {
                $homeProduct = $homeProduct["data"];

                foreach ($homeProduct as $k => $val) {
                    if (is_array($val["productvar"]) && isset($val["productvar"][0])) {
                        foreach ($val["productvar"] as $kk => $pvar) {
                            if ($pvar["qty"] <= 0) {
                                unset($homeProduct[$k]["productvar"][$kk]);
                            }
                        }
                    }
                }
            }
        }
        if (isset($featureProduct["sucess"]) && $featureProduct["sucess"] == 200) {
            if (is_array($featureProduct["data"]) && isset($featureProduct["data"][0])) {

                $featureProduct = $featureProduct["data"];
                foreach ($featureProduct as $k => $val) { 
                    $products = $val['category']['product'];

                    foreach ($products as $k => $pval) {
                        if (is_array($pval["productvar"]) && isset($pval["productvar"][0])) {
                            foreach ($pval["productvar"] as $kk => $pvar) {
                                if ($pvar["qty"] <= 0) {
                                    unset($featureProduct[$k]["productvar"][$kk]);
                                }
                            }
                        }
                    }
                }
            }
        }
        
        $cms = $this->Commonmodel->getData($this->config->item('APIURL') . 'settings/cms/' . 8, $this->authtoken);

        $cms_content = [];
        if ($cms['success'] == 200 && !empty($cms['data'])) {
            foreach ($cms['data'] as $c2key => $c2value) {
                $cms_content['title'] = $c2key;
                $cms_content['data'] = $c2value;
            }
        }

        $data['siteBanner'] = $banner;
        $data['offer_banner'] = $offer_banner;
        $data['homeProduct'] = $homeProduct;
        $data['featureProduct'] = $featureProduct;
        $data['cms_content'] = $cms_content;
        // $data['featureProduct'] = [];

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/home');
        $this->load->view('home/includes/_footer');
    }

    public function location()
    {
        $url = $this->config->item('APIURL') . "country/index?is_active=1";
        $temp = $this->Commonmodel->getData($url, $this->authtoken);
        $data['search_country'] = $temp['data'];

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/location');
        $this->load->view('home/includes/_footer');
    }

    public function pages($id)
    {
        $cmsData = $this->Commonmodel->getData($this->config->item('APIURL') . 'settings/cms/' . $id, $this->authtoken);

        $data = [];
        foreach ($cmsData['data'] as $key => $value) {
            $data['title'] = $key;
            $data['data'] = $value;
        }
        // prd($data);
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/page');
        $this->load->view('home/includes/_footer');
    }

    public function contactus()
    {
        $data = [];
        $data['title'] = "Contact Us";
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/contact', $data);
        $this->load->view('home/includes/_footer');
    }

    public function submitenquiry()
    {
        if ($this->input->post()) {

            $name = $this->input->post('name');
            $phone = $this->input->post('phone');
            $email = $this->input->post('email');
            $message = $this->input->post('message');

            try {
                $this->load->helper('email_helper');

                $body = "You have received a new message from your website contact form.\r\n" . "Here are the details:\r\nName: $name\r\nEmail: $email\r\nPhone: $phone\r\nMessage:\r\n$message";

                $to = 'adityomapp03@gmail.com';
                $subject = "Website Contact Form:  $name";

                $message = $body;

                // Temporarily suppress PHP warnings
                error_reporting(0);
                $email = send_email($to, $subject, $message, $file = '', $cc = '');

                if ($email !== 'success') {
                    $this->session->set_flashdata('error', 'Mail not sent. Please try Again!');
                    redirect('contactus');exit;
                } else {
                    $this->session->set_flashdata('success', 'We have recieved your message. We will get back to you!');
                    redirect('contactus');die;
                }

            } catch (\Throwable $th) {
                $this->session->set_flashdata('error', $th->getMessage());
                redirect('contactus');exit;
            }

        }

    }

    public function offer_products($id = null)
    {
        $data['title'] = "Offer Details";
        $offers = $this->Commonmodel->getData($this->config->item('APIURL') . 'list/offerChild/' . $id, $this->authtoken);
        if (isset($offers['sucess']) && $offers['sucess'] == 200) {
            if (is_array($offers['data']) && isset($offers["data"][2]) && isset($offers["data"][2]["products"][0])) {
                $offers = $offers["data"][2]["products"];
            } else {
                $offers = '';
            }
        } else {
            $offers = '';
        }

        $siteProduct = $offers;

        // cms
        $cms = $this->Commonmodel->getData($this->config->item('APIURL') . 'settings/cms/' . 8, $this->authtoken);

        $cms_content = [];
        if ($cms['success'] == 200 && !empty($cms['data'])) {
            foreach ($cms['data'] as $c2key => $c2value) {
                $cms_content['title'] = $c2key;
                $cms_content['data'] = $c2value;
            }
        }

        $data['cms_content'] = $cms_content;

        // prd($siteProduct);
        $data['siteProduct'] = $siteProduct;
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/offer_products', $data);
        $this->load->view('home/includes/_footer');
    }

    public function login()
    {
        $phone = $this->input->post('phone');
        $request = array('phone' => $phone, "reqForm" => "login");
        $loginAct = $this->Commonmodel->postData($this->config->item('APIURL') . 'user/login', $request, $this->authtoken);

        if ($loginAct["sucess"] == 200) {
            $response = array(
                'success' => 200,
                'msg' => "",
                'otp' => $loginAct,
            );
            echo json_encode($response, true);exit;
        } else {
            if ($loginAct["sucess"] == 404) {
                $response = array(
                    'success' => 404,
                    'msg' => "Record(s) not found.",
                );
            } else {
                $response = array(
                    'success' => $loginAct["sucess"],
                    'msg' => $loginAct["msg"],
                );
            }
            echo json_encode($response, true);exit;
        }

    }

    public function register()
    {

        $postData = array();
        $postData["fname"] = $this->input->post('fname');
        $postData["lname"] = $this->input->post('lname');
        $postData["phone"] = $this->input->post('phone');
        $postData["os_devid_vc"] = $_SERVER['HTTP_USER_AGENT'];

        $postData["reqForm"] = "signup";
        $postData["reg_from"] = "web";
        $postData["app_version"] = 0;
        if (isset($_POST['friends_code'])) {
            $postData["friends_code"] = $_POST['friends_code'];
        }

        $loginAct = $this->Commonmodel->postData($this->config->item('APIURL') . 'user/login', $postData, $this->authtoken);
        if ($loginAct["sucess"] == 200) {
            $response = array(
                'success' => "200",
                'msg' => $loginAct["msg"],
                'otp' => '',
            );
            echo json_encode($response, true);exit;
        } else {
            if ($loginAct["sucess"] == 400) {
                $response = array(
                    'success' => "400",
                    'msg' => $loginAct["msg"],
                );
                echo json_encode($response, true);exit;
            }
        }
    }

    public function resendotp()
    {

        $phone = $this->input->post('phone');
        $request = array('phone' => $phone);

        $data = $this->Commonmodel->postData($this->config->item('APIURL') . 'user/resendotp', $request, $this->authtoken);
        if (isset($data["sucess"]) && $data["sucess"] == 200) {
            $response = array(
                'success' => "200",
                'msg' => "",
            );
            echo json_encode($response, true);exit;
        }
    }

    public function verifyotp()
    {
        $phone = $this->input->post('phone');
        $otp = $this->input->post('otp');

        $postData = array();
        $postData["fname"] = $this->input->post('fname');
        $postData["lname"] = $this->input->post('lname');
        $postData["phone"] = $this->input->post('phone');
        $postData["os_devid_vc"] = $_SERVER['HTTP_USER_AGENT'];

        $postData["reqForm"] = "signup";
        $postData["reg_from"] = "web";
        $postData["otp"] = $otp;
        $postData["app_version"] = 0;
        if (isset($_POST['friends_code'])) {
            $postData["friends_code"] = $_POST['friends_code'];
        }

        ///$request = array("phone" => $phone, "otp" => $otp);
        $otpVarify = $this->Commonmodel->postData($this->config->item('APIURL') . 'user/varifyregisterOtp', $postData, $this->authtoken);
        
        if ($otpVarify["sucess"] == 200 && $otpVarify["varified"]) {
            ///$session_id = $_SESSION["session_id"];
            $frproducts = array();
            $frproducts_order = array();

            if ($this->session->userdata("frproducts")) {
                $frproducts = $this->session->userdata("frproducts");
            }
            if ($this->session->userdata("frproducts") && count($this->session->userdata("frproducts_order")) > 0) {
                $frproducts_order = $this->session->userdata("frproducts_order");
            }

            $userId = $otpVarify["data"]["user"]["_id"];
            $defaultAddress = $this->Commonmodel->getData($this->config->item('APIURL') . 'address/getdefaultaddressofuser', $this->authtoken, $userId);

            $loc = array();
            if (isset($defaultAddress["sucess"]) && $defaultAddress["sucess"] == 200) {
                $loc[0] = $defaultAddress['data'][0]["country"][0]["_id"];
                $loc[1] = $defaultAddress['data'][0]["state"][0]["_id"];
                $loc[2] = $defaultAddress['data'][0]["city"][0]["_id"];
                $loc[3] = $defaultAddress['data'][0]["area"][0]["_id"];
                $cookie_value = $loc[0] . '####' . $loc[1] . '####' . $loc[2] . '####' . $loc[3];
                $this->input->set_cookie('userlocation', $cookie_value, time() + (86400 * 30), "/");
            }

            // set session data
            $user_data['authUser'] = array(
                "isLoggedIn" => true,
                "authtoken" => $otpVarify["data"]["authtoken"],
                "user" => $otpVarify["data"]["user"],
                "location" => $loc,
                'IsGuestLogin' => false,
                'IsCoustomerLogin' => true,
                'model' => 'frontend',
            );
            // set location if exist
            if (isset($defaultAddress["sucess"]) && $defaultAddress["sucess"] == 200) {
                $location_data[0] = $defaultAddress['data'][0]["country"][0]["_id"];
                $location_data[1] = $defaultAddress['data'][0]["state"][0]["_id"];
                $location_data[2] = $defaultAddress['data'][0]["city"][0]["_id"];
                $location_data[3] = $defaultAddress['data'][0]["area"][0]["_id"];
                $user_data['authUser']['location'] = $location_data;
            }
            $this->session->set_userdata($user_data);

            if (!empty($frproducts)) {
                $frprodData['frproducts'] = $frproducts;
                $this->session->set_userdata($frprodData);
            }
            if (!empty($frproducts_order)) {
                $frprodordData['frproducts_order'] = $frproducts_order;
                $this->session->set_userdata($frprodordData);
            }

            $this->session->set_flashdata('success', 'Welcome ' . $otpVarify["data"]["user"]["fname"] . ' ' . $otpVarify["data"]["user"]["lname"] . '.');

            $response = array(
                'success' => "200",
                'msg' => "",
            );
            echo json_encode($response, true);exit;
        } else {
            if ($otpVarify["sucess"] == 404) {
                $response = array(
                    'success' => "404",
                    'msg' => "Record(s) not found.",
                );
                echo json_encode($response, true);exit;
            }
            if ($otpVarify["sucess"] == 204) {
                $response = array(
                    'success' => "204",
                    'msg' => "Please enter valid otp.",
                );
                echo json_encode($response, true);exit;
            }
        }
    }

    public function ajaxlocation()
    {

        $locReq = array(
            "getarea",
            "getcity",
            "getstate",
            "getsubarea",
        );
        $locArr = array(
            "getstate" => 0,
            "getcity" => 1,
            "getarea" => 2,
            "getsubarea" => 3,
        );
        $locReqUri = array(
            "getarea" => "area/index/",
            "getsubarea" => "subarea/index/",
            "getstate" => "state/getstatebycid/",
            "getcity" => "city/getcitybystateid/",
        );
        $firstOpt = array(
            "getarea" => "Area",
            "getcity" => "City",
            "getstate" => "State",
            "getsubarea" => "Sub Area",
        );

        $url = $locReqUri[$this->input->get('q')] . $this->input->get("id");

        $data = $this->Commonmodel->getData($this->config->item('APIURL') . $url);
        $temp = '<option value="">Select ' . $firstOpt[$this->input->get('q')] . '</option>';

        if (isset($data["sucess"]) && $data["sucess"] == 200) {
            foreach ($data["data"] as $val) {
                $temp .= '<option value="' . $val["_id"] . '">' . $val["title"] . '</option>';
            }
        }

        $location_data = $this->input->get('id');

        $loginData['authUser'] = $this->session->userdata('authUser');
        $loginData['authUser']['location'][$locArr[$this->input->get('q')]] = $location_data;
 
        if(!empty( $this->session->userdata('authUser')['location']['3'])){
         $franchise = $this->Commonmodel->getData($this->config->item('APIURL') . 'franchise/getfruser/' . $this->session->userdata('authUser')['location']['3'], FRONT_TOKEN);
            if (!empty($franchise["data"]) && $franchise["sucess"] == 200) {
                $loginData['authUser']['franchise'] = $franchise['data'][0];
            }
        }
        $this->session->set_userdata($loginData);     
        //condition given when ** Sub area removed from site....
        if ($this->input->get('q') == "getsubarea") {
            $cookie_value = $this->session->userdata("authUser")["location"][0] . '####' .
            $this->session->userdata("authUser")["location"][1] . '####' .
            $this->session->userdata("authUser")["location"][2] . '####' .
            $this->session->userdata("authUser")["location"][3];
            //.'####'.$this->session->userdata("authUser")["location"][4];
            $this->input->set_cookie('userlocation', $cookie_value, time() + (86400 * 30), "/");
        }
        echo $temp;
    }

    //-----------------------------------------------------------------------
    public function logout()
    {
        $this->session->sess_destroy();
        redirect(base_url('/'), 'refresh');
    }

}
