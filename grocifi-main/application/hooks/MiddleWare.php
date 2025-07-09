<?php
class MiddleWare
{
    function initialize() {
        $ci =& get_instance();
        $token = ($ci->session->userdata('authtoken'))??"";
        $fronttoken = ($ci->session->userdata('authUser')['authtoken'])??"";
        $model = ($ci->session->userdata('model'))??"";
        $mainFranchiseID = ($ci->session->userdata('main_franchise_id'))??"";
        
        $fronUser   = $ci->session->userdata('authUser');
        $areaId     = ($fronUser['location']['3'])??0;
        $webcategory =  (getwebcat($areaId))??[]; 
        
        define('TOKEN', $token);

        define('WEBCATEGORY', $webcategory);

        define('MODEL', $model);
        define('MAINFRANCHISE', $mainFranchiseID);
        define('FRONT_TOKEN', $fronttoken);
        startSession();
    }


    function getwebcat($areaId)
    {
        // get category
        $ci = &get_instance();
        $siteCategory = $ci->Commonmodel->getData($ci->config->item('APIURL') . 'franchise/getfrcats/' . $areaId, $ci->authtoken);
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