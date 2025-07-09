<?php
defined('BASEPATH') or exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|    example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|    https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|    $route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|    $route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|    $route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:    my-controller/index    -> my_controller/index
|        my-controller/my-method    -> my_controller/my_method
 */
$route['default_controller'] = 'home';
///$route['admin'] = 'dashboard';
$route['admin'] = 'admin/dashboard';
$route['store'] = 'store/dashboard';
$route['admin/login'] = 'auth/login';
$route['store/login'] = 'auth/login';
$route['error'] = 'auth/error';
$route['admin/forgot_password'] = 'auth/forgot_password';
$route['reset_password'] = 'auth/reset_password';
$route['register'] = 'auth/register';
$route['verify'] = 'auth/verify';
$route['logout'] = 'auth/logout';
$route['404_override'] = '';
$route['translate_uri_dashes'] = false;

/****Home Routes*****/
$route['userlocation'] = 'home/location';
$route['aboutus'] = 'home/pages/1';
$route['faq'] = 'home/pages/3';
$route['termsandconditions'] = 'home/pages/4';
$route['privacy'] = 'home/pages/5';
$route['franchise'] = 'home/pages/6';
$route['referandearn'] = 'home/pages/7';
$route['products/search'] = 'products/search/$1';
$route['products/(:any)'] = 'products/index/$1';
$route['contactus'] = 'home/contactus';
$route['logout'] = 'home/logout';
$route['submitenquiry'] = 'home/submitenquiry';

// User profile routes
$route['profile'] = 'userprofile/index';
$route['wallet_history'] = 'userprofile/wallet_history';
$route['notifications/(:any)'] = 'userprofile/notifications/$1';
$route['notifications'] = 'userprofile/notifications';
$route['myorders'] 	  = 'userprofile/myorders';
$route['myaddress']   = 'userprofile/myaddress';
$route['add_address'] = 'userprofile/add_address';
$route['edit_address/(:any)'] = 'userprofile/edit_address/$1';
$route['friendlist'] = 'userprofile/friend_list';
$route['wishlist'] 	 = 'userprofile/wishlist';
$route['dashboard']	 = 'userprofile/dashboard';
