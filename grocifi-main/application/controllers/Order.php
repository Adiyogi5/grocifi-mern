<?php defined('BASEPATH') or exit('No direct script access allowed');

class Order extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        authfront_check(); // check login auth
        authfront_area(); // check location
        $this->authtoken = $this->session->userdata('authUser')['authtoken'];
        $this->areaId = $this->session->userdata('authUser')['location']['3'];
        $this->load->library('pagination');
        $this->load->Model('Commonmodel', 'Commonmodel');
    }


    public function order_detail($order_id=null)
    {
        if ($order_id == null) {
             redirect(base_url('myorders'));
        }

        $orders = $this->Commonmodel->getData($this->config->item('APIURL') . 'order/trackmyorder/'.$order_id, FRONT_TOKEN);

        if (is_array($orders["data"]) && isset($orders["data"][0])) {
            $data['orders'] = $orders["data"][0];
        } else {
            $data['orders'] = array();
        }
        $siteConfig = configSetting();
       
        foreach($siteConfig[3] as $val){
          $data['paymentMethodArr'][$val["id"]] = $val["title"];
        }

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/order_detail');
        $this->load->view('home/includes/_footer');
    }


    public function index()
    {
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


    public function order_confirm()
    {
        if(empty($_SESSION["last_order_id"])){
            redirect(base_url());
        }
        $data['title'] = 'Order Confirm';

        $orders = $this->Commonmodel->getData($this->config->item('APIURL') . 'order/trackmyorder/'.$_SESSION["last_order_id"], FRONT_TOKEN);

        $data['status'] = 0;

        if (is_array($orders["data"]) && isset($orders["data"][0])) {
            $data['status'] = $orders["data"][0]['ostatus'][0]['order_status'];
        } 

        $data['order_id'] = $_SESSION["last_order_id"];

        unset($_SESSION["last_order_id"]);
       
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/order_confirm');
        $this->load->view('home/includes/_footer');
    }

}
