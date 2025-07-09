<?php defined('BASEPATH') or exit('No direct script access allowed');

class Products extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        authfront_check(); // check login auth
        authfront_area(); // check location
        $this->authtoken = @$this->session->userdata('authUser')['authtoken'];
        $this->areaId = $this->session->userdata('authUser')['location']['3'];
        $this->load->library('pagination','mailer');
        $this->load->Model('Commonmodel', 'Commonmodel');

    }

    public function index($slug)
    {   
        
        $allCatData = $this->Commonmodel->getData($this->config->item('APIURL') . 'franchise/getfrmaincats/' . $this->areaId, $this->authtoken);

        $catData = $this->Commonmodel->getData($this->config->item('APIURL') . 'category/getcatdetailbyslug/' . $slug, $this->authtoken);

        $start = 0;
        $limit = 6;
        $current_page = 0;
        $user_type = isset($this->session->userdata('authUser')['user']['is_wholesaler'])?'1':0;
        $search = '';
        $priceSort = '';
        $nameSort = '';
        if(isset($_REQUEST['search'])){
            $search = $_REQUEST['search'];
        }
        if(isset($_REQUEST['sort'])){            
            if($_REQUEST['sort']=='price_asc'){
                $priceSort = 1;
            }
            if($_REQUEST['sort']=='price_desc'){
                $priceSort = -1;
            } 
            if($_REQUEST['sort']=='name_asc'){
                $nameSort = 1;
            }
            if($_REQUEST['sort']=='name_desc'){
                $nameSort = -1;
            }
        }        
        if (!empty($_GET['page'])) {
            $current_page = $_GET['page'];
            $start = ($current_page > 1) ? ($current_page - 1) * $limit : 0;
        }
        $url = $this->config->item('APIURL') . 'franchise/getsubcatsandproductbycat/' . $this->areaId . '/' . $catData['data']['_id'] . '?user_type='.$user_type.'&where='.$search.'&priceSort='.$priceSort.'&nameSort='.$nameSort.'&start=' . $start . '&limit=' . $limit;

        $siteProduct = $this->Commonmodel->getData($url . $this->authtoken);
        
        $total = $siteProduct['total'];
        
        if (is_array($siteProduct["data"][2]['products']) && isset($siteProduct["data"][2]['products'][0])) {
            $siteProduct = $siteProduct["data"][2]['products']; 
        }

        $data = [];
        if ($catData['sucess'] == 200) {
            $data['catData'] = $catData['data'];
        }
        if ($allCatData['sucess'] == 200) {
            $data['parentcatData'] = $allCatData['data'];
        }
        $data['slug'] = $slug;
        $data['search'] = $search;
        $data['sort'] = @$_REQUEST['sort'];

        $this->Commonmodel->pageConfig('products/' . $slug, $total, $limit);
        $data['siteProduct'] = $siteProduct;

        $data['title'] = ($data['catData'])?$data['catData']['title']:"Product List";
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/products');
        $this->load->view('home/includes/_footer');
    }

    public function details($id = null)
    {
        $proData = $this->Commonmodel->getData($this->config->item('APIURL') . 'franchise/getproductdetailsbyfrpid/' . $id, $this->authtoken);

        $product = [];
        if (isset($proData["sucess"]) && $proData["sucess"] == 200) {
            if (is_array($proData["data"]) && isset($proData["data"][0])) {
                $product = $proData["data"][0];
            } 
        }

        $data['title'] = isset($product['product'])?$product['product'][0]['title']:"Product";
        $data['product'] = $product;
        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/product_details');
        $this->load->view('home/includes/_footer');
    }

    // searching products
    public function search($InputSearch = null)
    {
        $request = ['str' => $this->input->get('InputSearch'), 'areaId' => $this->areaId];
        $search = $this->Commonmodel->postData($this->config->item('APIURL') . 'product/searchproducts', $request, $this->authtoken);

        if (isset($search["data"]) && is_array($search["data"])) {
            if (isset($search["data"][0])) {
                $search = $search["data"];
            } else {
                $search = "";
            }
        } else {
            $search = "";
        }

        if ($search != "") {
            foreach ($search as $k => $val) {
                if (is_array($val["productvar"]) && isset($val["productvar"][0])) {
                    foreach ($val["productvar"] as $kk => $pvar) {
                        if ($pvar["qty"] <= 0) {
                            unset($search[$k]["productvar"][$kk]);
                        }
                    }
                } else {
                    unset($search[$k]["productvar"]);
                }
            }
        }

        $data = [];
        $cms_1 = $this->Commonmodel->getData($this->config->item('APIURL') . 'settings/cms/' . 8, $this->authtoken);
        $cms_shipping = [];
        if ($cms_1['success'] == 200 && !empty($cms_1['data'])) {
            foreach ($cms_1['data'] as $c1key => $c1value) {
                $cms_shipping['title'] = $c1key;
                $cms_shipping['data'] = $c1value;
            }
        }
        $data['cms_shipping'] = $cms_shipping;

        $data['title'] = "Search";
        $data['search'] = $search;
        $data['InputSearch'] = $this->input->get('InputSearch');

        $this->load->view('home/includes/_header', $data);
        $this->load->view('home/search_list', $data);
        $this->load->view('home/includes/_footer');
    }

}
