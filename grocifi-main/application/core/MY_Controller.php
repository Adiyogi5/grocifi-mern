<?php

class MY_Controller extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->Model('Commonmodel', 'Commonmodel');
        //general settings
        $global_data = [];
        $authtoken = $this->session->userdata('authtoken');
        $url = $this->config->item('APIURL') . 'settings/index';
        $result = $this->Commonmodel->getData($url, $authtoken);
				
        if (@$result['sucess'] == '200') {
            $general_settings_data = $result['data'];
            foreach ($general_settings_data as $skey => $svalue) {
                $global_data['general_settings'] = $svalue;
            }
            $this->general_settings = $global_data['general_settings'];

            //// Get Role Details
            $role_data = [];
            $url = $this->config->item('APIURL') . 'roles/getroles';
            $role_data = $this->Commonmodel->getData($url, $authtoken);
            ///prd($role_data);
            if (@$role_data['success'] == '200') {
                $general_roles_data = $role_data['data'];
                foreach ($general_roles_data as $rkey => $rvalue) {
                    $role_data['general_roles'][$rvalue['role_code']]['role_code'] = $rvalue['role_code'];
                    $role_data['general_roles'][$rvalue['role_code']]['title'] = $rvalue['title'];
                }
                $this->general_roles = $role_data['general_roles'];
            }

            //modules settings
            $global_premission = [];
            if ($this->session->userdata('role_type') == '2') {
                $url = $this->config->item('APIURL') . 'roles/userpermission/' . $this->session->userdata('admin_id');
                $premission_data = $this->Commonmodel->getData($url, $authtoken);
                if (@$premission_data['success'] == '200') {
                    foreach ($premission_data['data'] as $skey => $svalue) {
                        $global_premission['premission'][$svalue['name']]['is_add'] = $svalue['is_add'];
                        $global_premission['premission'][$svalue['name']]['is_edit'] = $svalue['is_edit'];
                        $global_premission['premission'][$svalue['name']]['is_delete'] = $svalue['is_delete'];
                        $global_premission['premission'][$svalue['name']]['is_view'] = $svalue['is_view'];
                    }
                }
            }
            @$this->general_user_premissions = $global_premission['premission'];
            //set timezone
            ///date_default_timezone_set($this->general_settings['system_timezone_gmt']);

            // user cart
      
            if (!empty($this->session->userdata('authUser')['user'])) {
                startSession();
                $cartProduct = "";
                $cart_id_qty = array();
                $cartEmpty = true;
                $cartQty = 0;
                // prd($this->session->userdata('session_id'));
                $user_wallet = 0;
                $is_wholesaler = (!empty($this->session->userdata('authUser')['user']['is_wholesaler'])) ? $this->session->userdata('authUser')['user']['is_wholesaler'] : 0;
                $where = ['user_id' => $this->session->userdata('authUser')['user']['_id'], 'is_wholesaler' => $is_wholesaler, 'session_id' => $this->session->userdata('session_id'), 'user_wallet' => $user_wallet];
                $auth_token = $this->session->userdata('authUser')['authtoken'];
                $cartProduct = $this->Commonmodel->postData($this->config->item('APIURL') . 'cart/get_cart', $where, $auth_token);

            } else {
                $where = ['session_id' => $this->session->userdata('session_id')];
            }
            
        } else {
            echo "Connection Failure !!!";exit;
        }

    }

}
