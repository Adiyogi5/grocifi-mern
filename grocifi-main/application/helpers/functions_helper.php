
<?php if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

// -----------------------------------------------------------------------------
//check auth
if (!function_exists('auth_check')) {
    function auth_check()
    {
        // Get a reference to the controller object
        $ci = &get_instance();
        if (!$ci->session->has_userdata('IsAdminLogin')) {
            redirect('admin/login', 'refresh');
        }

    }
}

if (!function_exists('auth_user')) {
    function auth_user($param = null)
    {
        $ci = &get_instance();

        if (($ci->session->userdata('IsFranchiseLogin') == true)) {
            $userData = $ci->session->userdata();
            $franchise_id = $ci->session->userdata('franchise_id');
            $url = $ci->config->item('APIURL') . 'franchise/getfranchisebyid/' . $franchise_id;
            $fraSetting = $ci->Commonmodel->getData($url, $userData['authtoken']);
            if (@$fraSetting['sucess'] == 200) {
                $userData['franchise'] = $fraSetting['data'][0];
            }
            $ci->session->set_userdata($userData);
        }
        if ($param) {
            return ($ci->session->userdata($param)) ?? false;
        }

        return $ci->session->userdata();
    }
}

if (!function_exists('front_auth_user')) {
    function front_auth_user($param = null)
    {
        $ci = &get_instance();
        
        // prd($ci->session->userdata('authUser'));
        if ($ci->session->userdata('authUser') && $param == null) {
            return $ci->session->userdata('authUser');
        }
        if ($param) {
            return ($ci->session->userdata('authUser')[$param]) ?? false;
        }
        return  $ci->session->userdata('authUser');
    }
}

//check auth
if (!function_exists('auth_franchise_check')) {
    function auth_franchise_check()
    {
        // Get a reference to the controller object
        $ci = &get_instance();
        if (!$ci->session->has_userdata('IsFranchiseLogin')) {
            redirect('store/login', 'refresh');
        }

    }
}

function isAllow($module, $type = "can_view")
{

    $ci = &get_instance();

    if ($ci->session->userdata('IsAdminLogin')) {
        return true;
    }

    if (gettype($module) == 'array') {
        $module = (array) $module;
    } else {
        $module = [$module];
    }

    $permission = $ci->general_user_premissions;

    $result = array_filter($permission, function ($key) use ($module, $type, $permission) {
        if (in_array($key, $module) && $permission[$key][$type] == 1) {
            return true;
        }
        return false;
    },
        ARRAY_FILTER_USE_KEY
    );

    if (count($result) > 0) {
        return true;
    } else {
        return false;
    }

}

if (!function_exists('getimage')) {
    function getimage($image) { 
        $ci =& get_instance();
        $docpath = $ci->config->item('DOCPATH');
       
        $PATH = $ci->config->item('APIIMAGES');
        $imagedata = $docpath.$image; 
       
        if(file_exists($imagedata) AND !empty($image)){
          $imageurl = $PATH.$image;
         }else{
           $imageurl = base_url() . 'assets/images/default_img.png';
         }
        return $imageurl;
    }
}

//get recaptcha
if (!function_exists('generate_recaptcha')) {
    function generate_recaptcha()
    {
        $ci = &get_instance();
        if ($ci->recaptcha_status) {
            $ci->load->library('recaptcha');
            echo '<div class="form-group mt-2">';
            echo $ci->recaptcha->getWidget();
            echo $ci->recaptcha->getScriptTag();
            echo ' </div>';
        }

    }
}

// ----------------------------------------------------------------------------
//print old form data
if (!function_exists('old')) {
    function old($field)
    {
        $ci = &get_instance();
        return html_escape($ci->session->flashdata('form_data')[$field]);
    }
}

// --------------------------------------------------------------------------------
if (!function_exists('date_time')) {
    function date_time($datetime)
    {
        return date('F j, Y', strtotime($datetime));
    }
}

// --------------------------------------------------------------------------------
// limit the no of characters
if (!function_exists('text_limit')) {
    function text_limit($x, $length)
    {
        if (strlen($x) <= $length) {
            echo $x;
        } else {
            $y = substr($x, 0, $length) . '...';
            echo $y;
        }
    }
}

function pr($data)
{
    echo '<pre>';
    print_r($data);
    echo '</pre>';
}

function prd($data)
{
    echo '<pre>';
    print_r($data);
    echo '</pre>';
    exit();
}

if (!function_exists('check_user_premissions')) {
    function check_user_premissions($role, $admin_id, $page, $mode, $param = null)
    {
        $aclevel = checkaccesslevel($page, $mode, $param);
        //prd($aclevel);
        $ci = &get_instance();
        $freepage = array(
            'profile',
            'change_password',
            'fetch_state_list_by_country_id',
            'fetch_city_list_by_state_id',
            'fetch_areagroup_list_by_city_id',
            'fetch_area_list_by_city_id',
            'fetch_area_list_by_group_id',
            'getuserbyName',
        );
        if ($role == 2 && !in_array($aclevel[0], $freepage) && !in_array($mode, $freepage)) {
            $url = $ci->config->item('APIURL') . 'roles/userpagepermission/' . $admin_id . '/' . $aclevel[0];
            $authtoken = $ci->session->userdata('authtoken');
            $premission_data = $ci->Commonmodel->getData($url, $authtoken);
            // prd($premission_data);
            if (@$premission_data['success'] == '200') {
                $premission = !empty($premission_data['data'][0]) ? $premission_data['data'][0] : [];
                if (isset($premission['is_view']) && $premission['is_view'] == 0) {
                    $ci->session->set_flashdata('errors', "You don't have permission to access page.");
                    redirect('error', 'refresh');
                } elseif (in_array($aclevel[1], $aclevel[2])) {
                    //echo $premission['is_'.$aclevel[3]]; exit;
                    if ($premission['is_view'] != 0 && $premission['is_' . $aclevel[3]] == 0) {
                        if (!$ci->input->is_ajax_request()) {
                            $ci->session->set_flashdata('errors', "You don't have permission to access page.");
                            redirect('error', 'refresh');
                        } else {
                            $records['msg'] = "You don't have permission to access page.";
                            echo json_encode($records);exit;
                        }
                    }
                } else {
                    if (@$premission['is_delete'] == 0 && $aclevel[3] == 'change__status') {
                        if (!$ci->input->is_ajax_request()) {
                            $ci->session->set_flashdata('errors', "You don't have permission to access page.");
                            redirect('error', 'refresh');
                        } else {
                            $records['msg'] = "You don't have permission to access page.";
                            echo json_encode($records);exit;
                        }
                    }
                }
            }
        }

    }
}

function checkaccesslevel($page, $mode, $param)
{
    switch ($page) {
        case "notification":
            $curd = array('add' . $mode . '', 'edit' . $mode . '', 'delete' . $mode . '', 'view' . $mode . '');
            $page = "general_notification";
            $type = str_replace($page, '', $mode);
            break;
        case "product":
            $curd = array('addproduct', 'editproduct', 'deleteproduct', 'viewcategory');
            $page = 'product';
            $type = str_replace('product', '', $mode);
            break;
        case "category":
            $curd = array('addcategory', 'editcategory', 'deletecategory', 'viewcategory');
            $page = 'category';
            $type = str_replace('category', '', $mode);
            break;
        case "voucher":
            $curd = array('addvoucher', 'editvoucher', 'deletevoucher', 'vievoucher');
            $page = 'voucher';
            $type = str_replace('voucher', '', $mode);
            break;
        case "order":
            if ($mode == 'index') {
                $curd = array('add' . $page . '', 'edit' . $page . '', 'delete' . $page . '', 'view' . $page . '');
                $page = "order_list";
                $type = $mode;
            } elseif ($mode == 'placeorder' || $mode == 'edit') {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = "place_order";
                if ($mode == 'placeorder') {
                    $type = 'add';
                    $mode = 'add';
                } else {
                    $type = $mode;
                }
            } else {
                $curd = array('add' . $mode . '', 'edit' . $mode . '', 'delete' . $mode . '', 'view' . $mode . '');
                $page = $mode;
                $type = str_replace($page, '', $mode);
            }
            break;
        case "users":
            if ($mode == 'franchise') {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'user_franchise';
                $type = 'view';
            } elseif ($mode == 'customer') {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'user_customer';
                $type = 'view';
            } elseif ($mode == 'wholesaler') {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'user_wholesaler';
                $type = 'view';
            } elseif ($mode == 'delivery_boy') {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'user_delivery_boy';
                $type = 'view';
            } elseif ($mode == 'admin') {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'user_admin_subadmin';
                $type = 'view';
            } elseif (strstr($mode, 'dailycollection')) {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'user_dailycollection';
                $type = 'view';
            } elseif (strstr($mode, 'franchiseareas')) {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'franchise_area';
                $type = $mode;
            } elseif (strstr($mode, 'franchisecategory')) {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'franchise_category';
                $type = $mode;
            } elseif (strstr($mode, 'franchiseproduct') || strstr($mode, 'updatefranchisevarient')) {
                $curd = array('add', 'edit', 'delete', 'view');
                $page = 'franchise_product';
                if (strstr($mode, 'updatefranchisevarient')) {
                    $type = 'edit';
                    $mode = 'edit';
                } elseif (strstr($mode, 'franchiseproduct') && $mode != 'franchiseproduct_datatable_json') {
                    $type = 'add';
                    $mode = 'add';
                } else {
                    $type = $mode;
                }
            } else {
                $curd = array('add', 'edit', 'delete', 'view');
                if ($param == 'admin') {
                    $page = 'user_admin_subadmin';
                } elseif ($param == 'franchise') {
                    $page = 'user_franchise';
                } elseif ($param == 'customer') {
                    $page = 'user_customer';
                } elseif ($param == 'wholesaler') {
                    $page = 'user_wholesaler';
                } elseif ($param == 'delivery_boy') {
                    $page = 'user_delivery_boy';
                }
                $type = $mode;
            }
            break;
        case "settings":
            if ($page == 'settings' && $mode == 'index') {
                $page = $page;
                $curd = array('add', 'edit', 'delete', 'view');
                $type = $mode;
            } elseif (strstr($mode, 'hoilday')) {
                $curd = array('addhoilday', 'edithoilday', 'deletehoilday', 'view');
                $page = 'holiday';
                $type = str_replace('hoilday', '', $mode);
            } elseif (strstr($mode, 'role')) {
                $curd = array('addrole', 'editrole', 'deleterole', 'view');
                $page = 'rolemanager';
                $type = str_replace('role', '', $mode);
            } else {
                $curd = array('add' . $mode . '', 'edit' . $mode . '', 'delete' . $mode . '', 'view' . $mode . '');
                $page = $mode;
                $type = str_replace($page, '', $mode);
            }
            break;
        case "locations":
            if (strstr($mode, 'country')) {
                $curd = array('addcountry', 'editcountry', 'deletecountry', 'viewcountry');
                $page = 'country';
                if ($mode == 'change_country_status') {
                    $mode = 'deletecountry';
                }
                $type = str_replace('country', '', $mode);
            }
            if (strstr($mode, 'state')) {
                $curd = array('addstate', 'editstate', 'deletestate', 'viewstate');
                $page = 'state';
                if ($mode == 'change_state_status') {
                    $mode = 'deletestate';
                }
                $type = str_replace('state', '', $mode);
            }
            if (strstr($mode, 'city')) {
                $curd = array('addcity', 'editcity', 'deletecity', 'viewcity');
                $page = 'city';
                if ($mode == 'change_city_status') {
                    $mode = 'deletecity';
                }
                $type = str_replace('city', '', $mode);
            }
            if (strstr($mode, 'area')) {
                $curd = array('addarea', 'editarea', 'deletearea', 'viewarea');
                $page = 'area';
                if ($mode == 'change_area_status') {
                    $mode = 'deletearea';
                }
                $type = str_replace('area', '', $mode);
            }
            if (strstr($mode, 'area_group')) {
                $curd = array('addarea_group', 'editarea_group', 'deletearea_group', 'viewarea_group');
                $page = 'area_group';
                if ($mode == 'change_area_group_status') {
                    $mode = 'deletearea_group';
                }
                $type = str_replace('area_group', '', $mode);
            }
            if (strstr($mode, 'sub_area')) {
                $curd = array('addsub_area', 'editsub_area', 'deletesub_area', 'viewsub_area');
                $page = 'sub_area';
                if ($mode == 'change_sub_area_status') {
                    $mode = 'deletesub_area';
                }
                $type = str_replace('sub_area', '', $mode);
            }
            break;
        default:
            $page = $page;
            $curd = array('add', 'edit', 'delete', 'view');
            $type = $mode;
    }

    return array($page, $mode, $curd, $type);

}

function safe_encode($string)
{
    return strtr(base64_encode($string), '+/=', '-_-');
}

function safe_decode($string)
{
    return base64_decode(strtr($string, '-_-', '+/='));
}

function generateRandomString($length = 10)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

if (!function_exists('authfront_check')) {
    function authfront_check()
    {
        $ci = &get_instance();
        // prd($ci->session->userdata('authUser'));
        if (empty($ci->session->userdata('authUser')['user'])) {
            $data = [];
            $url = $ci->config->item('APIURL') . 'user/getguest';
            $result = $ci->Commonmodel->postData($url, $data);

            if ($result['sucess'] == '200') {
                $loginData = $result['data'];
                $admin_data['authUser'] = array(
                    'user' => $loginData['user'],
                    'authtoken' => $loginData['authtoken'],
                    'IsGuestLogin' => true,
                    'IsCoustomerLogin' => false,
                    'isLoggedIn' => false,
                    'model' => 'frontend',
                );
                $ci->session->set_userdata($admin_data);
            }
        }
    }
}

if (!function_exists('authfront_area')) {
    function authfront_area()
    {
        $ci = &get_instance();
       
        if (!isset($ci->session->userdata('authUser')['location'][3]) || !isset($ci->session->userdata('authUser')['franchise'])) {

            $location_data[0] = '5f587a916a254867fcd29515';
            $location_data[1] = '63da07da532dbb2ee05aa225';
            $location_data[2] = '63da07fa532dbb2ee05aa226';
            $location_data[3] = '608006f70e1db4b8e8d07a73';
            //// update session

            $loginData['authUser'] = $ci->session->userdata('authUser');
            $loginData['authUser']['location'] = $location_data;
            $franchise = $ci->Commonmodel->getData($ci->config->item('APIURL') . 'franchise/getfruser/' . @$location_data[3], @$ci->session->userdata('authUser')['authtoken']);

            if (!empty($franchise["data"]) && $franchise["sucess"] == 200) {
                $loginData['authUser']['franchise'] = $franchise['data'][0];
            }
            $ci->session->set_userdata($loginData);
        }
    }
}


if (!function_exists('getwebcat')) {
    function getwebcat($areaId)
    {
        // get category
        $ci = &get_instance();
        $siteCategory = $ci->Commonmodel->getData($ci->config->item('APIURL') . 'franchise/getfrcats/' . $areaId, @$ci->session->userdata('authUser')['authtoken']);
        // prd( $siteCategory);
        $catId = [];
        $cats = [];
        if (isset($siteCategory["data"])) {
            foreach ($siteCategory['data'] as $key => $val) {
                if ($val["catagory_id"] == "") {
                    $catId = $val["_id"];
                }
            }
            foreach ($siteCategory['data'] as $key => $val) {
                if ($val["is_active"] == "1" && empty($val["catagory_id"])) {
                    $cimg = "noimage.png";
                    if (@$val["catagory_img"] != "") {
                        $file_headers = get_headers($ci->config->item('CATEGORYIMAGEPATH') . $val["catagory_img"]);
                        // print_r($file_headers);
                        if ($file_headers[0] == 'HTTP/1.1 200 OK') {
                            $cimg = $val["catagory_img"];
                        }
                    }
                    $cats[] = array(
                        "id" => $val["_id"],
                        "title" => $val["title"],
                        "slug" => $val["slug"],
                        "coming_soon" => isset($val["coming_soon"]) ? $val["coming_soon"] : false,
                        "img" => $ci->config->item('CATEGORYIMAGEPATH') . $cimg,
                        "allow_upload" => isset($val["allow_upload"]) ? $val["allow_upload"] : "false");
                }
            }
        }
        $return['siteCategory'] = $cats;
        $return['catId'] = $catId;
        return $return;
    }

}

function startSession($session_id = '')
{
    $ci = &get_instance();
    if (!$session_id) {

        if (function_exists('random_bytes')) {

            $session_id = substr(bin2hex(random_bytes(26)), 0, 26);

        } else {
            $session_id = substr(bin2hex(openssl_random_pseudo_bytes(26)), 0, 26);
        }
    }
     
    if (empty($ci->session->userdata('session_id'))) {
        if (preg_match('/^[a-zA-Z0-9,\-]{22,52}$/', $session_id)) {
            $session = array('session_id' => $session_id);
            $ci->session->set_userdata($session);
        } else {
            exit('Error: Invalid session ID!');
        }
    }

    return $ci->session->userdata('session_id');
}

function mycart()
{
    $ci = &get_instance();
    $cartProduct = "";
    $cart_id_qty = array();
    $cartEmpty = true;
    $cartQty = 0;
    $user_wallet = 0; 
    $html= '';
   
    if (!empty($ci->session->userdata('authUser')['user'])) {
       $is_wholesaler = (!empty($ci->session->userdata('authUser')['user']['is_wholesaler']))?$ci->session->userdata('authUser')['user']['is_wholesaler']:0;
       $where = ["user_id"=> $ci->session->userdata('authUser')['user']['_id'] ,"is_wholesaler"=>$is_wholesaler,"session_id"=> $ci->session->userdata('session_id'),"user_wallet"=> $user_wallet ];

    }else{
       $where = ["session_id"=> $ci->session->userdata('session_id')];
    }

    $cartProduct =  $ci->Commonmodel->postData($ci->config->item('APIURL') .'cart/get_cart', $where, FRONT_TOKEN);  
    if(!empty($_SESSION["cartData"]['qty']))
        $_SESSION["cartData"]['qty'] = 0;
    
    if(@$cartProduct['status'] == 200){
          $cartProduct['data'][0]['cart_item'];
          $cartqty = array_sum(array_column($cartProduct['data'][0]['cart_item'], 'qty')); 
          $_SESSION["cartData"]['qty']= $cartqty; 
    }
    return $cartProduct;
} 

function configSetting()
  {

    $ci = &get_instance();

    $delivery_day_after_order = $ci->general_settings["delivery_day_after_order"];
    $today = new DateTime('today');
    $nextDay = $today->modify('+'.$delivery_day_after_order.' day');
    $nextDay = $today->format('Y-m-d');
      
    $formatedDate = $today->format("l, d F, Y");
    $freashiseId = @front_auth_user('franchise')['franchiseId'];

    $siteConfig  = $ci->Commonmodel->getData($ci->config->item('APIURL') ."settings/getconfigData?franchiseId=".$freashiseId."&date=$nextDay");
   
    if(@$siteConfig['data']){
        return $siteConfig['data'];
    }
     return [];
  }  