<?php

if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

class Commonmodel extends CI_Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function generateRandomString($length)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function generateRandomCode($length)
    {
        $characters = '0123456789';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function seterrorMessage($name, $message, $type)
    {
        $class = '<p class="alert bg-danger"><i class="icon-cross3"></i>&nbsp;';
        if ($type == 'success') {
            $class = '<p class="alert bg-success text-white"><i class="icon-checkmark2"></i>&nbsp;';
        }
        $this->session->set_flashdata($name, $class . $message . '</p>');
    }

    public function getIndianCurrency($number)
    {
        $decimal = round($number - ($no = floor($number)), 2) * 100;
        $hundred = null;
        $digits_length = strlen($no);
        $i = 0;
        $str = array();
        $words = array(0 => '', 1 => 'one', 2 => 'two',
            3 => 'three', 4 => 'four', 5 => 'five', 6 => 'six',
            7 => 'seven', 8 => 'eight', 9 => 'nine',
            10 => 'ten', 11 => 'eleven', 12 => 'twelve',
            13 => 'thirteen', 14 => 'fourteen', 15 => 'fifteen',
            16 => 'sixteen', 17 => 'seventeen', 18 => 'eighteen',
            19 => 'nineteen', 20 => 'twenty', 30 => 'thirty',
            40 => 'forty', 50 => 'fifty', 60 => 'sixty',
            70 => 'seventy', 80 => 'eighty', 90 => 'ninety');
        $digits = array('', 'hundred', 'thousand', 'lakh', 'crore');
        while ($i < $digits_length) {
            $divider = ($i == 2) ? 10 : 100;
            $number = floor($no % $divider);
            $no = floor($no / $divider);
            $i += $divider == 10 ? 1 : 2;
            if ($number) {
                $plural = (($counter = count($str)) && $number > 9) ? 's' : null;
                $hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
                $str[] = ($number < 21) ? $words[$number] . ' ' . $digits[$counter] . $plural . ' ' . $hundred : $words[floor($number / 10) * 10] . ' ' . $words[$number % 10] . ' ' . $digits[$counter] . $plural . ' ' . $hundred;
            } else {
                $str[] = null;
            }

        }
        $Rupees = implode('', array_reverse($str));
        $paise = ($decimal) ? "." . ($words[$decimal / 10] . " " . $words[$decimal % 10]) . ' Paise' : '';
        return ($Rupees ? $Rupees . 'Rupees ' : '') . $paise;
    }

    public function getData($url, $auth = null, $id = null)
    {
        // API URL
        if (empty($id)) {
            $url = $url;
        } else {
            $url = $url . '/' . $id;
        }
        // Create a new cURL resource
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        if (!empty($auth)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
                'Authorization: Bearer ' . $auth,
            ));
        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
            ));
        }
        $result = curl_exec($ch);
        $err = curl_error($ch);
        // Close cURL resource
        curl_close($ch);
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            $mydata = json_decode($result, true);
            return $mydata;
        }
    }

    public function postData($url, $data, $auth = null)
    {
        // User account login info
        $apiData = json_encode($data);
       
        // Create a new cURL resource
        $ch = curl_init($url);
        
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        if (!empty($auth)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
                'Authorization: Bearer ' . $auth,
            ));
        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
            ));
        }
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $apiData);

        $result = curl_exec($ch);
        $err = curl_error($ch);
        // Close cURL resource
        curl_close($ch);
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            $mydata = json_decode($result, true);
            return $mydata;
        }
    }

    public function putData($url, $data, $auth = null)
    {
        // User account login info
        $apiData = json_encode($data);
        // Create a new cURL resource
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        if (!empty($auth)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
                'Authorization: Bearer ' . $auth,
            ));
        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
            ));
        }
        ///curl_setopt($ch, CURLOPT_USERPWD, "$apiUser:$apiPass");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($apiData));

        $result = curl_exec($ch);
        $err = curl_error($ch);
        // Close cURL resource
        curl_close($ch);
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            $mydata = json_decode($result, true);
            return $mydata;
        }

    }

    public function deleteData($url, $auth = null)
    {
        // Create a new cURL resource
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        if (!empty($auth)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
                'Authorization: Bearer ' . $auth,
            ));
        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'X-API-KEY: ' . $this->config->item('APIKEY'),
                'Content-Type: application/json',
            ));
        }
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");

        $result = curl_exec($ch);
        $err = curl_error($ch);
        // Close cURL resource
        curl_close($ch);
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            $mydata = json_decode($result, true);
            return $mydata;
        }

    }

    public function postImgCurl($url, $data, $auth = null)
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST", // OR GET
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => [
                "x-api-key: " . $this->config->item('APIKEY') . "",
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        if ($err) {
            return "cURL Error #:" . $err;
        } else {
            $result = json_decode($response, true);
            return $result;
        }
    }

    public function getCurlValue($filename, $contentType, $postname)
    {
        if (function_exists('curl_file_create')) {
            return curl_file_create($filename, $contentType, $postname);
        }
        $value = "@{$filename};filename=" . $postname;
        if ($contentType) {
            $value .= ';type=' . $contentType;
        }
        return $value;
    }

    public function redirect($url)
    {
        header("Location: " . $this->config->item('base_url') . $url . "");
        die();
    }

    public function dataTableData($GET)
    {
        $data = array();
        $where = '';
        if ($GET['order'][0]['dir'] == 'asc') {$dir = 1;} else { $dir = -1;}
        $data['where'] = isset($GET['search']['value']) ? $GET['search']['value'] : "";
        $data['order'] = $GET['columns'][$GET['order'][0]['column']]['name'] . " ";
        $data['dir'] = $dir;
        $data['start'] = $GET['start'];
        $data['length'] = $GET['length'];
        return $data;
    }


    public function pageConfig($url, $total_record, $limit)
    {
        $config['base_url'] = base_url($url);
        $config['total_rows'] = $total_record;
        $config['per_page'] = $limit;
        $config['use_page_numbers'] = true;
        $config['reuse_query_string'] = true;
        $config['page_query_string'] = true;
        $config['query_string_segment'] = 'page';
        $config['full_tag_open'] = '<ul class="pagination justify-content-center">';
        $config['full_tag_close'] = '</ul>';
        $config['first_link'] = false;
        $config['last_link'] = false;
        $config['first_tag_open'] = '<li class="page-item">';
        $config['first_tag_close'] = '</li>';
        $config['prev_link'] = '<i class="mdi mdi-arrow-left"></i>';
        $config['prev_tag_open'] = '<li class="prev">';
        $config['prev_tag_close'] = '</li>';
        $config['next_link'] = '<i class="mdi mdi-arrow-right"></i>';
        $config['next_tag_open'] = '<li class="next">';
        $config['next_tag_close'] = '</li>';
        $config['last_tag_open'] = '<li class="page-item">';
        $config['last_tag_close'] = '</li>';
        $config['cur_tag_open'] = '<li class="page-item active"><a class="" href="#">';
        $config['cur_tag_close'] = '</a></li>';
        $config['num_tag_open'] = '<li class="page-item">';
        $config['num_tag_close'] = '</li>';
        // prd($config['per_page']);
        $this->pagination->initialize($config);
    }

}
