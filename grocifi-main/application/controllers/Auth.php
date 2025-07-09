<?php defined('BASEPATH') or exit('No direct script access allowed');

class Auth extends MY_Controller
{

    public function __construct()
    {
        parent::__construct();
        authfront_check(); // check login auth
        $this->authtoken = $this->session->userdata('authUser')['authtoken'];
        $this->load->library('mailer');
        $this->load->Model('Commonmodel', 'Commonmodel');
    }

    //--------------------------------------------------------------
    public function index()
    {

        if ($this->session->has_userdata('IsAdminLogin')) {
            redirect('admin/dashboard');
        } elseif ($this->session->has_userdata('IsFranchiseLogin')) {
            redirect('store/dashboard');
        } else {
            redirect('admin/login');
        }
    }

    //--------------------------------------------------------------
    public function login()
    {
        $cur_tab = $this->uri->segment(1);
        $data['cur_tab'] = $cur_tab;

        if ($this->input->post('submit')) {
            $this->form_validation->set_rules('phone_no', 'Phone No', 'trim|required');
            $this->form_validation->set_rules('password', 'Password', 'trim|required');

            if ($this->form_validation->run() == false) {
                $data = array(
                    'errors' => validation_errors(),
                );
                $this->session->set_flashdata('error', $data['errors']);
                redirect(base_url('admin/login'), 'refresh');
            } else {
                $data = array(
                    'phone_no' => $this->input->post('phone_no'),
                    'password' => $this->input->post('password'),
                );
                $url = $this->config->item('APIURL') . 'user/adminphonelogin';
                $result = $this->Commonmodel->postData($url, $data);

                if ($result['sucess'] == '200') {
                    $loginData = $result['data'];
                    $role_type = $loginData['user']['role_type'];
                    if ($loginData['user']['role_type'] == 3 || !empty($loginData['user']['franchise_id'])) {
                        $authtoken = $loginData['authtoken'];
                        if (empty($loginData['user']['franchise_id'])) {
                            $url = $this->config->item('APIURL') . 'franchise/getfranchisebyuserid/' . $loginData['user']['_id'];
                            $resultfran = $this->Commonmodel->getData($url, $authtoken);
                        } else {
                            $url = $this->config->item('APIURL') . 'franchise/getfranchisebyid/' . $loginData['user']['franchise_id'];
                            $resultfran = $this->Commonmodel->getData($url, $authtoken);
                        }
                        $franchise = [];
                        if ($resultfran['sucess'] == '200') {
                            $franchise = $resultfran['data'][0];
                        }
                        $admin_data = array(
                            'admin_id' => $loginData['user']['_id'],
                            'username' => $loginData['user']['fname'] . ' ' . $loginData['user']['lname'],
                            'email' => $loginData['user']['email'],
                            'img' => $loginData['user']['img'],
                            'role_type' => $loginData['user']['role_type'],
                            'phone_no' => $loginData['user']['phone_no'],
                            'is_active' => $loginData['user']['is_active'],
                            'authtoken' => $loginData['authtoken'],
                            'franchise_id' => $franchise['_id'],
                            'firmname' => $franchise['firmname'],
                            'IsFranchiseLogin' => true,
                            'model' => 'store',
                        );
                    } else {
                        $admin_data = array(
                            'admin_id' => $loginData['user']['_id'],
                            'username' => $loginData['user']['fname'] . ' ' . $loginData['user']['lname'],
                            'email' => $loginData['user']['email'],
                            'img' => $loginData['user']['img'],
                            'role_type' => $loginData['user']['role_type'],
                            'phone_no' => $loginData['user']['phone_no'],
                            'is_active' => $loginData['user']['is_active'],
                            'authtoken' => $loginData['authtoken'],
                            'IsAdminLogin' => true,
                            'model' => 'admin',
                        );
                    }
                    $this->session->set_userdata($admin_data);
                    if ($loginData['user']['role_type'] == 3 || !empty($loginData['user']['franchise_id'])) {
                        redirect(base_url('store/dashboard'), 'refresh');
                    } else {
                        redirect(base_url('admin/dashboard'), 'refresh');
                    }
                } else {
                    $this->session->set_flashdata('errors', 'Invalid Phone or Password!');
                    redirect(base_url('admin/login'));
                }
            }
        } else {
            $data['title'] = 'Login';
            $data['navbar'] = false;
            $data['sidebar'] = false;
            $data['footer'] = false;

            $this->load->view('includes/_header', $data);
            $this->load->view('auth/login');
            $this->load->view('includes/_footer', $data);
        }
    }

    //-------------------------------------------------------------------------
    public function register()
    {
        redirect('admin/login');
    }

    //----------------------------------------------------------
    public function verify()
    {
        $verification_id = $this->uri->segment(4);
        $result = $this->auth_model->email_verification($verification_id);
        if ($result) {
            $this->session->set_flashdata('success', 'Your email has been verified, you can now login.');
            redirect(base_url('login'));
        } else {
            $this->session->set_flashdata('success', 'The url is either invalid or you already have activated your account.');
            redirect(base_url('admin/login'));
        }
    }

    //--------------------------------------------------
    // public function forgot_password()
    // {

    //     if ($this->input->post('submit')) {
    //         //checking server side validation
    //         $this->form_validation->set_rules('email', 'Email', 'valid_email|trim|required');
    //         if ($this->form_validation->run() == false) {
    //             $data = array(
    //                 'errors' => validation_errors(),
    //             );
    //             $this->session->set_flashdata('errors', $data['errors']);
    //             redirect(base_url('forget_password'), 'refresh');
    //         }

    //         $email = $this->input->post('email');
    //         $response = $this->auth_model->check_user_mail($email);

    //         if ($response) {

    //             $rand_no = rand(0, 1000);
    //             $pwd_reset_code = md5($rand_no . $response['admin_id']);
    //             $this->auth_model->update_reset_code($pwd_reset_code, $response['admin_id']);

    //             // --- sending email
    //             $this->load->helper('email_helper');
    //             $name = $response['firstname'] . ' ' . $response['lastname'];
    //             $email = $response['email'];
    //             $reset_link = base_url('reset_password/' . $pwd_reset_code);
    //             $body = $this->mailer->pwd_reset_email($name, $reset_link);
    //             $to = $email;
    //             $subject = 'Reset your password';
    //             $message = $body;
    //             $email = send_email($to, $subject, $message, $file = '', $cc = '');

    //             if ($email) {
    //                 $this->session->set_flashdata('success', 'We have sent instructions for resetting your password to your email');

    //                 redirect(base_url('forgot_password'));
    //             } else {
    //                 $this->session->set_flashdata('error', 'There is the problem on your email');
    //                 redirect(base_url('forgot_password'));
    //             }
    //         } else {
    //             $this->session->set_flashdata('error', 'The Email that you provided are invalid');
    //             redirect(base_url('forgot_password'));
    //         }
    //     } else {

    //         $data['title'] = 'Forget Password';
    //         $data['navbar'] = false;
    //         $data['sidebar'] = false;
    //         $data['footer'] = false;

    //         $this->load->view('includes/_header', $data);
    //         $this->load->view('auth/forget_password');
    //         $this->load->view('includes/_footer', $data);
    //     }
    // }

    public function forgot_password()
    {
        $data['title'] = 'Forget Password';
        $cur_tab = $this->uri->segment(1);
        $data['cur_tab'] = $cur_tab;

        if ($this->input->post()) {

            $this->form_validation->set_rules('phone_no', 'Phone', 'xss_clean|required|trim');
            if ($this->form_validation->run() == false) {
                $this->session->set_flashdata('errors', validation_errors());
                redirect(base_url('admin/forgot_password'));

            } else {

                $phone = $this->input->post('phone_no');
                $postData = ['reqForm' => "forgot", 'phone_no' => $phone];
                $response = $this->Commonmodel->postData($this->config->item('APIURL') . 'forgetpassword/', $postData, $this->authtoken);
                prd($response);

            }

        }
        $data['title'] = 'Forgot Password';
        $data['navbar'] = false;
        $data['sidebar'] = false;
        $data['footer'] = false;

        $this->load->view('includes/_header', $data);
        $this->load->view('auth/forget_password');
        $this->load->view('includes/_footer');

    }

    //----------------------------------------------------------------
    public function reset_password($id = 0)
    {

        // check the activation code in database
        if ($this->input->post('submit')) {
            $this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[5]');
            $this->form_validation->set_rules('confirm_password', 'Password Confirmation', 'trim|required|matches[password]');

            if ($this->form_validation->run() == false) {
                $data = array(
                    'errors' => validation_errors(),
                );

                $this->session->set_flashdata('reset_code', $id);
                $this->session->set_flashdata('errors', $data['errors']);
                redirect($_SERVER['HTTP_REFERER'], 'refresh');
            } else {
                $new_password = password_hash($this->input->post('password'), PASSWORD_BCRYPT);
                $this->auth_model->reset_password($id, $new_password);
                $this->session->set_flashdata('success', 'New password has been Updated successfully.Please login below');
                redirect(base_url('login'));
            }
        } else {
            $result = $this->auth_model->check_password_reset_code($id);

            if ($result) {

                $data['title'] = 'Reseat Password';
                $data['reset_code'] = $id;
                $data['navbar'] = false;
                $data['sidebar'] = false;
                $data['footer'] = false;

                $this->load->view('includes/_header', $data);
                $this->load->view('auth/reset_password');
                $this->load->view('includes/_footer', $data);

            } else {
                $this->session->set_flashdata('error', 'Password Reset Code is either invalid or expired.');
                redirect(base_url('forgot_password'));
            }
        }
    }

    //-----------------------------------------------------------------------
    public function logout()
    {
        $this->session->sess_destroy();
        redirect(base_url('admin/login'), 'refresh');
    }

    //--------------------------------------------------------------
    public function error()
    {
        $data['title'] = 'Not Authorized!!';
        $data['navbar'] = false;
        $data['sidebar'] = false;
        $data['footer'] = false;

        $this->load->view('includes/_header', $data);
        $this->load->view('auth/error');
        $this->load->view('includes/_footer', $data);
    }

} // end class
