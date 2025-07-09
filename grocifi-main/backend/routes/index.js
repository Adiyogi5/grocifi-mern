var path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Middelwares 
var dirpath = __dirname + `/../public/uploads/temp`;
// Multer Procedure
var storage = multer.diskStorage({
    destination: dirpath,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});


// Validations
const authMiddelware = require("../middelwares/authrization");
const validation = require("../middelwares/validation");
let orderValidation = require("../middelwares/orderValidation");
let confirmorderValidation = require("../middelwares/confirmorderValidation");
const { uservalidationResult, validate } = require('../middelwares/settingValidation');


// Controllers Import For The Routes
const userController = require('../controllers/userController');
const settingController = require('../controllers/settingController');
const catagoryController = require('../controllers/catagoryController');
const bannerController = require('../controllers/bannerController');
const addressController = require('../controllers/addressController');
const emailtemplateController = require('../controllers/email_templateController');
const productController = require('../controllers/productsController');
const rolesController = require('../controllers/rolesController');
const grouptypeController = require('../controllers/groupTypeController');
const searchController = require('../controllers/SearchControllers');
const walletController = require('../controllers/walletLogController');

const offerController = require('../controllers/offerController');
const luckydrawController = require('../controllers/luckydrawController');
const couponController = require('../controllers/couponController');

const voucherController = require('../controllers/voucherController');
const notificationController = require('../controllers/notificationController');
const popupimgController = require('../controllers/popupimgController');
const manageRoutingController = require('../controllers/manageRoutingController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');

//cityController
const subareaController = require('../controllers/subareaController');
const areaController = require('../controllers/areaController');
const cityController = require('../controllers/cityController');
const stateController = require('../controllers/stateController');
const countryController = require('../controllers/countryController');
const franchiseController = require('../controllers/franchiseController');
const listControllerActionController = require('../controllers/listControllerActionController');

router.all('/', (req, res) => {
    res.json({
        "status": "200",
        "message": "Welcome to API",
        "data": {}
    });

});


// Users
router.post('/user/adminlogin',
    validation.licenceKeyRequire,
    userController.adminlogin);

router.post('/user/adminphonelogin',
    validation.licenceKeyRequire,
    userController.adminphonelogin);

router.post('/user/login',
    validation.licenceKeyRequire,
    userController.login);

router.post('/user/dboylogin', //delivery boy login
    validation.licenceKeyRequire,
    userController.dboylogin
);

router.post('/user/stafflogin', //Staff Login
    validation.licenceKeyRequire,
    userController.stafflogin);

router.get('/user/getallstaff', //Staff Login
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getAllStaff);

router.post('/user/sendotp',
    validation.licenceKeyRequire,
    userController.sendotp);

router.post('/user/resendotp',
    validation.licenceKeyRequire,
    userController.resendotp);

router.post('/user/isdeviceexist',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.isDeviceExist);

router.post('/user/getguest',
    validation.licenceKeyRequire,
    userController.getguest);

router.post('/user/setguesttoken',
    validation.licenceKeyRequire,
    userController.setguesttoken);

router.get('/user/isloggedin',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.isloggedin);

router.post('/user/varifyOtp',
    validation.licenceKeyRequire,
    userController.varifyOtp);

router.post('/user/varifyregisterOtp',
    validation.licenceKeyRequire,
    userController.varifyregisterOtp);

router.get('/user/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getAllUser);

router.get('/user/userswithorders',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getAllUsersAndOrders);

router.get('/user/getuserbyrole',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getUserByRole);

router.get('/user/exportuser',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.exportUserByRole);

router.get('/user/finduser',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.findUser
);

router.post('/user/updateuserorderstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.updateUserOrderStatus
);

router.get('/user/finduserbyrefercode',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.findUserByReferCode
);

router.get('/user/getclients',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getClients);

router.get('/user/getadmin',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getAdmin);

router.get('/user/franchises',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getAllFranchise
);

router.get('/user/alldeliverboy',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getAllDeliveryBoy
);

router.post('/user/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.validation('save_user'),
    userController.save
);

router.get('/user/edit/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.edit
);

router.get('/user/getfranchiseusers',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getFranchiseUsers
);

router.get('/user/getuserbyname/:name',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getUserByName
);

router.get('/user/getuserbyid/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getUserById
);

router.post(
    "/user/add_favproduct",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.Addfavproduct
);

router.get(
    "/user/users_favlist/:userId/:areaId",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.FavProduct
);

router.post('/user/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.validation('update_user'),
    userController.edit
);

router.post('/user/updateuser',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.updateUser
);

router.post('/user/updatewalletbalance',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.updateWalletBalance
);

router.post('/user/uploadvisitingcard',
    upload.single('visiting_card'),
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    userController.uploadvisitingcard
);

router.get('/user/deletevisitingcard/:filename',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.delvisitcardimg);


router.post('/user/uploadimg',
    upload.single('user_img'),
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    userController.uploadimg
);

router.post('/user/updateuserimage',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.updateImageName
);

router.post('/user/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.status
);

router.post('/user/wholesalerstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.wholesalerstatus
);

router.post('/user/changestatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.changestatus
);


router.delete('/user/deleteuser',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.delete
);


router.post('/user/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.statusAll
);


router.get('/user/getwalletbalance/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.walletbalance
);

router.get('/user/getmyreferer/:rcode',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getMyReferer
);

router.get('/user/getmyfriends/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getMyFriends
);

router.post('/user/uploadfirmlogo',
    upload.single('firm_img'),
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    userController.uploadfirmlogo
);

router.post('/user/saveipfriendcode',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    userController.saveipcode
);

router.get('/user/getfcodeofip/:uip',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getfcodeofip
);

router.post('/user/updateappversion',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.updateAppVersion
);

router.get('/user/getuserbyphonenumber/:phone_no',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.getUserByPhoneNumber);

router.get('/user/todayandlastweekcustomers',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.todayAndLastWeekCustomers);

router.post('/user/updaterefercode',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.updateReferCode
);

// Roles Of Users
router.get('/roles/getroles',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.getRoles
);

router.post('/roles/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.validation('save_role'),
    rolesController.save);

router.get('/roles/edit/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.edit);

router.post('/roles/update',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.validation('update_role'),
    rolesController.edit);


router.post('/roles/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.status);

router.post('/roles/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.statusAll);

router.get('/roles/getallmodule',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.getallmodule);

router.get('/roles/userpermission/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.getuserpermission);

router.get('/roles/userpagepermission/:userId/:page',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.getuserpagepermission);


router.post('/roles/saveuserpermission',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.saveuserpermission);

router.post('/roles/updateuserpermission',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    rolesController.updateuserpermission);



//Sub Area
router.get('/subarea/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.getAllSubareas
);


router.get('/subarea/index/:areaId',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    subareaController.getSubareasByAreaId
);


router.post('/subarea/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.validation(),
    subareaController.saveSubArea
);


router.get('/subarea/edit/:subAreaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.edit
);

router.post('/subarea/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.validation(),
    subareaController.edit);


router.post('/subarea/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.status);


router.post('/subarea/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.statusAll);


router.delete('/subarea/delete/:subAreaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    subareaController.delete);


//Area
router.get('/area/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.getAllAreas);

router.get('/area/index/:cityId',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    areaController.getAreasByCityId);


router.post('/area/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.validation(),
    areaController.saveArea);


router.get('/area/edit/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.edit);


router.post('/area/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.validation(),
    areaController.edit);


router.post('/area/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.status);


router.post('/area/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.statusAll);


router.delete('/area/delete/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.delete);


router.get('/area/groups',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.getAllGroups);

router.get('/area/getareabygroupid/:group_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.getAreaByGroupId);

router.get('/area/editgroupofarea/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.editGroupOfArea);

router.post('/area/savegroupofarea',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.groupAreaValidations(),
    areaController.saveGroupOfArea);

router.post('/area/updategroupofarea',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.groupAreaValidations(),
    areaController.updateGroupOfArea);

router.post('/area/groupstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    areaController.statusGroup);

//City
router.get('/city/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.getAllCities);


router.post('/city/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.validation(),
    cityController.saveCity);


router.get('/city/getcitybystateid/:stateId',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    cityController.getCityByStateId);


router.get('/city/edit/:cityId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.edit);


router.post('/city/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.validation(),
    cityController.edit);


router.post('/city/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.status);


router.post('/city/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.statusAll);


router.delete('/city/delete/:cityId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cityController.delete);


//State
router.get('/state/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.getAllState);


router.post('/state/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.validation(),
    stateController.saveState);


router.get('/state/getstatebycid/:countryId',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    stateController.getStateByCountryId);


router.get('/state/edit/:stateId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.edit);


router.post('/state/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.validation(),
    stateController.edit
);


router.post('/state/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.status);


router.post('/state/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.statusAll);


router.delete('/state/delete/:stateId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    stateController.delete);


//Country

// router.get('/country/import_country',
//     validation.licenceKeyRequire,
//     countryController.import_country);

// router.get('/state/import_state',
//     validation.licenceKeyRequire,
//     stateController.import_state);

// router.get('/city/import_city',
//     validation.licenceKeyRequire,
//     cityController.import_city);


router.get('/country/index/:is_active?',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    countryController.getAllCountry);

router.post('/country/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    countryController.validation(),
    countryController.saveCountry);

router.get('/country/edit/:cntryId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    countryController.edit);


router.post('/country/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    countryController.validation(),
    countryController.edit);


router.post('/country/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    countryController.status);


router.post('/country/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    countryController.statusAll);


router.delete('/country/delete/:cntryId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    countryController.delete);


//Setting Route
router.get("/settings/index",
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    settingController.getSettings);

//CMS Setting Route
router.get("/cmssettings/index",
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    settingController.getcmsSettings);


router.post("/settings/save",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    uservalidationResult(),
    validate,
    settingController.save);

router.get("/settings/getdeliverytimeslot/",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.getdeliverytimeslot
);

router.get("/settings/getdeliveryslot/:franchiseId",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.getdeliveryslot
);

router.post("/settings/savedeliverytimeslot",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.save_time_slot_limit);

router.post("/settings/savedeliveryslot",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.save_delivery_slot);


router.post("/settings/edit",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.edit);

router.post("/settings/editcms",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.editcms);


router.get('/settings/cms/:cms_id',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    settingController.getCMS);


router.get("/settings/getconfigs",
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    settingController.getConfig
);

router.get("/settings/getconfigData",
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    settingController.getConfigData
);

router.get("/settings/getAvailbleTimeslot",
    validation.licenceKeyRequire,
   // authMiddelware.validate,
    settingController.getAvailbleTimeslot
);

router.post("/settings/uploadsitelogo",
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.single('logo'),
    settingController.uploadSettingImages);

router.post("/settings/uploadadimage",
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.single('ad_img'),
    settingController.uploadAdImage);

router.post("/settings/uploadsitefav",
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.single('favicon'),
    settingController.uploadSettingImages
);

router.post("/settings/uploadLogowhite",
    upload.single('logowhite'),
    settingController.uploadSettingImages
);

router.post("/settings/checktimeslotavailability",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.checktimeslotavailability
);

router.get("/settings/checkalltimeslotavailability",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.checkalltimeslotavailability
);

router.get("/settings/getholidays",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.getHolidays
);

router.get("/settings/getholidaybyid/:id",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.getHolidayById
);

router.post("/settings/saveholiday",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.saveHoliday
);

router.post("/settings/updateholiday",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.updateHoliday
);

router.post("/settings/updateholidaystatus",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.updateHolidayStatus
);

router.delete("/settings/removeholiday/:id",
    validation.licenceKeyRequire,
    authMiddelware.validate,
    settingController.removeHolidayById
);

// Voucher Routes 
router.get('/voucher/list',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    voucherController.getVoucherList);

router.post('/voucher/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    voucherController.save);

router.post('/voucher/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    voucherController.status);

router.get('/voucher/getdepositbyuser/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    voucherController.getDepositbyuser);

// Catagory Routes 
router.get('/catagory/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getAllCatagories);

router.get('/catagory/parentlist',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getParentList);

router.get('/catagory/list',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getCatagoriesList);

router.post('/catagory/save',
    validation.licenceKeyRequire,
    authMiddelware.validate, //upload.single('catagory_img'),
    catagoryController.validation('savecategory'),
    catagoryController.save);

router.post('/catagory/updatesynccat',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.updatesynccat);

router.post('/catagory/uploadcatimg',
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.single('catagory_img'),
    catagoryController.uploadCatImg);

router.get('/catagory/edit/:catagoryId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.edit);

router.get('/category/getcatdetailbyslug/:catagoryslug',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getcatdetailbyslug);

router.post('/catagory/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.validation('updatecategory'),
    catagoryController.update);


router.post('/catagory/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.status);


router.post('/catagory/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.statusAll);


router.delete('/catagory/delete/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.deletecatagory);


router.get('/catagory/getcatlist/:catId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getCatagoryList);


router.get('/catagory/getallcatlist',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getAllCatagoryList);


router.get('/catagory/getcatbyid/:catId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getCatagoryById);


// Logically Active and inactiving the route 
//router.delete('/catagory/delete/:catagoryid/status/:is_active?',catagoryController.logicalDelete);


// Sub Catagory Routes 
router.get('/catagory/index/:catagory_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getAllSubCatagories);

router.post('/subcatagory/edit/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.editsubCatagory);


router.delete('/subcatagory/delete/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.deletesubCatagory);

router.post('/catagory/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.statusAll);

// Logically Active and inactiving the route 
router.delete('/subcatagory/delete/:subCatagoryId/status/:is_active?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.logicalDeleteSubCatagory);

// Fetching catagory and Subcatagory on catagory basis
router.get('/subcatagoryandcatagory/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.catagoryAndSubCatagoryDetails);

router.get('/catagory/getcatswithproductcount',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    catagoryController.getCatsWithProductCount);


// Banner Api 
//router.get('/banner/index',bannerController.getAllBannerDetails);

//router.get('/banner/',bannerController.all);


router.get('/banner/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    bannerController.allBanners);

//router.get('/banner/index/:bid',bannerController.allBanners);

router.get('/banner/mybanners',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    bannerController.getAllBannerDetails);


//It shows all banner which are is_active=1  and franchise id in null
router.post('/banner/save',
    validation.licenceKeyRequire,
    authMiddelware.validate, //                upload.single('banner_img'),
    bannerController.save);

router.post('/banner/uploadbannerimg',
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.single('banner_img'),
    bannerController.uploadBannerImg);

router.get('/banner/edit/:bannerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    bannerController.getBannerById);

router.post('/banner/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate, //                upload.single('banner_img'),
    bannerController.updatebanner);

router.post('/banner/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    bannerController.statusAll);

router.delete('/banner/delete/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    bannerController.delete);

// Logically Active and inactiving the route 

router.post('/banner/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    bannerController.logicalDeletebanner);

// Forgot Password Change Password 

router.post('/changepassword',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.validation('changePassword'),
    userController.changepassword);

// router.get('/forgetpassword',
//     validation.licenceKeyRequire,
//     authMiddelware.validate,
//     userController.findbyField);

router.post('/forgetpassword',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    userController.generateforgotpasswordotp);


// User Address With Different Type Of Address
router.get('/address/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.getAllAddresses); //getaddress

router.get('/address/getdefaultaddressofuser/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.getDefaultAddressOfUser);


router.get('/address/edit/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.logicalList);

router.get('/address/getaddress/:aId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.getaddress
);

router.get('/address/getdetailedaddress/:aId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.getDetailedAddress
);

router.post('/address/edit/:aId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.edit);

router.post('/address/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.saveAddress);

router.post('/address/wholeaddress',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.completeDefaultAddress);

router.post('/address/checkaddress',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.checkAddress);


router.post('/address/removedefaultaddress',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.removedefaultAddress);

router.post('/address/default',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.defaultAddress);

router.delete('/address/delete/:aId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.delete);

router.post('/address/delete',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    addressController.logicallyDelete);
//logically delete

// Email Template 
router.get('/emailtemplate/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    emailtemplateController.list);

router.get('/emailtemplate/index/:_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    emailtemplateController.getDetail);

router.post('/emailtemplate/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    emailtemplateController.create);

router.post('/emailtemplate/edit/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    emailtemplateController.edit);

// router.delete('/emailtemplate/delete/:id',emailtemplateController.delete)

//Franchise
router.get('/franchise/getglobal',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getglobal);

router.get('/franchise/allfranchise',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getAllFranchiseId);

router.get('/franchise/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getAllFranchise);

router.post('/franchise/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.saveFranchise);

router.get('/franchise/edit/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.edit);

router.post('/franchise/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.edit);

router.get('/franchise/getfranchisebyuserid/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchiseByUserId);

router.get('/franchise/getfranchisebyid/:Id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchiseById);

router.post('/franchise/status/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.status);


router.get('/franchise/getfruser/:areaId',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    franchiseController.getFranchiseOfArea);

router.get('/franchise/getfrbanner/:areaId',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    franchiseController.getfrbanner);

router.get('/franchise/getfrcats/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getfrcats);

router.get('/franchise/getfrmaincats/:areaId',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    franchiseController.getfrmaincats);

router.get('/franchise/getfranchiseproductlistbycat/:areaId/:catId/:searchParam?/:priceSort?/:dateSort?',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    franchiseController.getfranchiseproductlistbycat);

router.get('/franchise/getfeatureproductlist/:areaId',
    validation.licenceKeyRequire,
    ///authMiddelware.validate,
    franchiseController.getfeatureproductlist);

router.get('/franchise/franchiseproductsearch/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.franchiseproductsearch);

router.get('/franchise/getfranchiseproducts/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getfranchiseproducts);

router.post('/product/updatefranchiseproductpriority',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.updateFranchiseProductPriority);

router.get('/franchise/checkfrareas/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.checkfrareas);

router.get('/franchise/getfrareas/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getfrareas);

router.post('/franchise/frareastatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.frareastatus);

router.post('/franchise/savefrcats',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.savefrcats);

router.post('/franchise/updatefrcats/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.updatefrcats);


router.post('/franchise/savefrarea',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.savefrarea);

router.post('/franchise/updatefrarea/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.updatefrarea);

router.delete('/franchise/deletefrarea/:franchiseId/:areaId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.deletefrarea);

router.get('/franchise/getfranchisecatlist/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getfranchisecatlist);

router.get('/franchise/getfranchisecat/:fId',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    franchiseController.getfranchisecat);

router.post('/franchise/frcatstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.frcatstatus);

router.get('/franchise/getsubcatsandproductbycat/:areaId/:catId/:searchParam?/:priceSort?/:nameSort?/:dateSort?',
    validation.licenceKeyRequire,
    //authMiddelware.validate,
    franchiseController.SearchFrCatsProductsAndSubCats
    //franchiseController./*getFrCatsProductsAndSubCats*/SearchFrCatsProductsAndSubCats
);

router.get('/franchise/getfranchisemaincategory', // used by operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchiseMainCategory
);

router.get('/franchise/getfranchisesubcategoryandproducts/:category_id', // used by operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchiseSubCategoryAndProducts
);

router.post('/franchise/savepurchaseditem', // used by operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.savePurchasedItem
);

router.post('/franchise/updatepurchaseditem', // used by operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.updatePurchasedItem
);


router.get('/franchise/getcipurchaseditembydate/:pdate/:franchise_id', // used by operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getCIPurchasedItemByDate
);

router.get('/franchise/getpurchaseditembydate/:pdate', // used by operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getPurchasedItemByDate
);

router.get('/franchise/getallfranchiseproducts/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getallfranchiseproducts
);

router.get('/franchise/getallfranchiseprovariants/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getallfranchiseprovariants
);

router.get('/franchise/allproductsoffranchise/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.allProductsOfFranchise
);

router.get('/franchise/getfranchiseproductsbyfrpid/:frpId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchiseProductsbyfrpid
);


router.get('/franchise/getincartproductdetail/:pId/:frpId/:frpvId',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    franchiseController.getInCartProductDetail
);

router.get('/franchise/getproductdetailsbyfrpid/:frpId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getProductDetailsByFrpId);

router.post('/franchise/getproductdetailsbyvarientid/',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getProductDetailsByVarientId);


//productController
router.get('/product/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getAllProducts);

router.post('/product/save',
    validation.licenceKeyRequire,
    authMiddelware.validate, // upload.array('product_img'),  
    productController.save);

router.get('/product/edit/:productId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.edit);

router.post('/product/edit/',
    validation.licenceKeyRequire,
    authMiddelware.validate, //upload.array('product_img'),
    productController.edit);

router.post('/product/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.status);

router.post('/product/updatedefaultimage',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.updateDefaultImage);

router.post('/product/deleteimage',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.deleteImage);

router.post('/product/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.statusAll);

router.delete('/product/delete/:productId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.delete);

router.post('/product/uploadimg',
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.array('product_img'),
    productController.uploadimg);

router.get('/product/getproductsbycats/:cId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getproductsbycats);

router.get('/product/getlistedproductsbycats/:cId/:isglobal',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getlistedproductsbycats);


// Complete Product Detail Route With Images And Its Varients

router.get('/product/productdetailbyid/',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.completeFranchiseProductDetails);

//franchise products
router.get('/product/getfranchiseproducts/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getAllfrProducts);

//products of franchise in admin panel to place order
router.get('/product/getfranchiseproductsinadmin/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getFranchiseProductInAdmin);

router.get('/product/getfranchiseproductbyvarid/:varId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getFranchiseProductByVarId);

router.get('/product/getproductsoffranchise/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getProductsOfFranchise);

router.get('/product/getfranchiseproductsbycats/:fId/:cId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getfrProductsByCats);

router.post('/product/savefranchiseproduct',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.validation('savefrproduct'),
    productController.savefrproduct);
//save product with varients fId is id of frenchise

router.post('/product/makefeaturedproduct',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.makefeaturedproduct);

router.post('/product/savefranchisevarient',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.savefrvarient);


router.post('/product/updatefranchisevarient',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.updatefrvarient);

router.get('/product/getproductvarient/:pId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getfranchiseproductvarient);

router.get('/product/getproductvarientbyId/:pId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getproductvarientbyId);

router.get('/product/editfranchiseproduct/:fpId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.editfrproduct);

router.post('/product/editfranchiseproduct/:fpId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.validation('updatefrproduct'),
    productController.editfrproduct);

router.post('/product/franchiseproductstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.frproductstatus);

router.post('/product/franchiseproductstatusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.frproductstatusAll);

router.delete('/product/franchiseproductdelete/:fpId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.frproductdelete);

router.post('/product/searchproducts',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    productController.searchproducts);

router.get('/franchise/productslistforfranchise/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.productslistforfranchise);
//It provides products by categories which is already selected by franchise 

//franchise products varient
router.get('/product/getfranchiseproductvarient/:frproductId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.getAllfrProductvarient);

router.post('/product/franchiseproductvarientsave',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.frProductvarientsave);

router.post('/product/franchiseproductvarientstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.frProductvarientstatus);

router.post('/product/addnewsyncproduct',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.fraddnewsyncproduct);

router.post('/product/updatesyncproduct',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.frupdatesyncproduct);

router.get('/product/getproductsimages/:pId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    productController.productsimagebyid);

// Group Types ACL Action 
router.get('/acl/grouptype/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    grouptypeController.listAll);

router.post('/acl/grouptype/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    grouptypeController.save);

router.post('/acl/grouptype/edit/:Id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    grouptypeController.edit);

router.delete('/acl/grouptype/delete/:Id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    grouptypeController.delete);


// List Controller ACL Action 
router.get('/access/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.getAllAction);

router.post('/access/getmyaccess',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.getMyAccess);



router.post('/access/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.save);

router.get('/access/edit/:routeId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.edit);

router.post('/access/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.edit);

router.delete('/access/delete/:Id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.delete);

router.post('/access/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    listControllerActionController.status);


// Delivery Boy On Basis Of Franchise 

/*router.get('/franchise/getdeliveryboy',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getDeliveryBoy);*/

/*router.post('/franchise/savedeliveryboy',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.saveDeliveryBoy);

router.post('/franchise/updatedeliveryboy',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.updateDeliveryBoy);

router.get('/franchise/editdeliveryboy/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.editDeliveryBoy);

router.get('/franchise/getalldetail',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getAlldeliveryBoydetail);*/

router.get('/franchise/getdeliveryboys/:franchiseId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getDeliveryBoys);

router.get('/franchise/getfranchisedeliveryboys/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchiseDeliveryBoys);

router.get('/franchise/getmystaff/:franchiseId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getMyStaff);

router.get('/franchise/getstafftoadd/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getStaffToAdd);

router.post('/franchise/removefromstaff',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.removeFromStaff);

router.post('/franchise/savetostaff',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.saveToStaff);

router.get('/franchise/getfranchisedetail/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.getFranchieDetail);

/*router.post('/franchise/deliveryboystatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.deliveryBoyStatus);

router.post('/franchise/deliveryboychange',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    franchiseController.deliveryBoyStatusChange);*/

// Daily Collection
router.get('/order/dailycollection',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getDailycollection)

// Experiments
router.get('/managerouting',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    manageRoutingController.manageRoutingIndex)

//order
router.get('/order/getallorders/:fId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getAllOrders);

router.get('/order/exportorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.exportAllorders);

// router.get('/order/usersnotorderedlistexport',
//     validation.licenceKeyRequire,
//     authMiddelware.validate,
//     orderController.usersNotOrderedListExport);

router.get('/order/getordersbycondition',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrdersByCondition);

router.get('/order/getciorderbydate/:fdate/:tdate/:franchise_id/:category_id?', //from-date & to-date
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getCiOrderByDate);

router.get('/order/getorderbydate/:fdate/:tdate', //from-date & to-date
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrderByDate);


/// Route Add to cart
router.post('/cart/add_to_cart',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    // cartController.validate("addToCart"),
    cartController.add_to_cart);

router.post('/cart/update_cart',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cartController.validate("updateCart"),
    cartController.update_cart);

router.post('/cart/remove_cart',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cartController.validate("removeCart"),
    cartController.remove_cart);

router.post('/cart/get_cart',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    cartController.validate("getCart"),
    cartController.get_cart);

router.post('/cart/get_carttotal',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    cartController.get_carttotal);

router.post('/cart/remove_cart_by_userid',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    cartController.remove_cart_by_userid);


router.post('/cart/checkcoupon/:ccode',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cartController.validate("checkCoupon"),
    cartController.checkcoupon);

router.post('/cart/removecoupon/',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cartController.validate("removeCoupon"),
    cartController.removecoupon);

router.get('/cart/checkwallet/:sessionId/:userId/:mode',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    cartController.validate("checkWallet"),
    cartController.checkwallet);


// router.post('/order/placeorder'/**,  validation.licenceKeyRequire*/,  orderController.placeOrder);

router.get('/order/getuserorders/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrderByUserId);

router.get('/order/getorderwhere',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrderWhere);

router.get('/order/getdboyorders/:userId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrderByDboyId);

router.get('/order/getdboypendingorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getDboyPendingOrders);

router.post('/order/uploadorderimg',
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    upload.single('user_img'),
    orderController.uploadorderimg);

router.post('/order/palceimgorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.palceimgorder);

router.get('/order/deleteorderimg/:filename',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.delorderimg);

router.post('/order/placeorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderValidation.validateOrder,
    orderController.placeOrderNew);

router.get('/order/getfailedpaymentorders',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getfailedpaymentorders);

router.post('/order/updateorderpayment',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.updateorderpayment);

router.post('/order/chkorderstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    confirmorderValidation.validateOrder,
    orderController.chkOrderstatus);

router.post('/order/confirmorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    confirmorderValidation.validateOrder,
    orderController.confirmOrder);


router.post('/order/saverevisedorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.saveRevisedOrder);

router.post('/order/savereturnedproduct',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.saveReturnedProduct);

router.post('/order/saveorderdelivered',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.saveOrderDelivered);

router.post('/order/updateorderdeliveryaddress',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.updateorderdeliveryaddress);

router.post('/order/updatestatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.updateOrderStatus);

router.post('/order/updaterevised',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.updateOrderRevised);

/*router.get('/order/notify_status',
    validation.licenceKeyRequire, 
    orderController.notify_status);*/

/*router.get('/order/updatestatusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.updateStatusAll);*/

router.get('/order/getorderbyid/:orderId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrderById);

router.get('/order/getorderwithid/:orderId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getOrderWithId);

router.get('/order/getcitodayorder/:fromDate?/:toDate?/:franchise_id?/:is_wholesaler?/:category_id?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getCiTodaysOrder);

router.get('/order/gettodayorder/:fromDate?/:toDate?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getTodaysOrder);

router.get('/order/finalorderlist',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getFinalOrderList);

router.get('/order/finalorderlistbyid/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getFinalOrderListById);

router.post('/order/savefinalorderlist',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.savefinalOrderList);

router.get('/order/getciordersofdaterange/:fromDate/:toDate/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getciordersofdaterange);

router.get('/order/getordersofdaterange/:fromDate/:toDate',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getordersofdaterange);

router.get('/order/getcitodayandlastweekorders/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getCiTodayAndLastWeekOrders);

router.get('/order/gettodayandlastweekorders',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getTodayAndLastWeekOrders);

router.get('/order/getsalegraphorder/:franchise_id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getsalegraphorder);

router.get('/order/findorderbeforecancel/:_id/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.findOrderBeforeCancel);

router.post('/order/trackingorder',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.trackingOrder);

router.get('/order/orderlistforopm', //order list for operation manager
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.orderListForOpm);


router.get('/order/printorderbill/:orderId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.printOrderbill);

// Search Products
router.get('/order/trackingorder/:userId/:orderId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.trackingOrder);

router.post('/orderprocess/detail',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.orderProcessDetail);

router.post('/order/updateorderdeliveryboy',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.updateorderDeliveryBoy);

router.get('/order/getdeliveryaddress/:orderId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.getDeliveryAddress);

router.post('/search/product',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    searchController.productsDetail);

// router.get('/srchexp/getsubcatsandproductbycat/:areaId/:catId/:searchParam?',franchiseController.SearchFrCatsProductsAndSubCats);

router.get('/order/trackmyorder/:orderId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.trackMyOrder);

router.get('/order/todayreviewtobedone',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.todayReviewToBeDone);


router.post('/order/saveorderreview',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.saveOrderReview);


//----------------luckydrawController Banner API-------------------------// 
router.get('/luckydraw_coupon/getluckydrawlist',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    luckydrawController.getluckydrawlist);

router.post('/lucky_draw_coupon/update',
    validation.licenceKeyRequire,
    ///authMiddelware.validate,
    luckydrawController.updateOffers);

router.get('/luckydraw_coupon/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.getAllLuckydraws);

router.get('/luckydraw_coupon/index/:areaId/:is_active?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.getOffers);

router.post('/lucky_draw_coupon/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.status);

router.post('/lucky_draw_coupon/saveofferimg',
    validation.licenceKeyRequire,
    upload.single('offer_img'),
    luckydrawController.saveOfferImg);

router.post('/lucky_draw_coupon/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.createOffers);

router.get('/lucky_draw_coupon/edit/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.editOffers);

router.post('/lucky_draw_coupon/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.editOffers);

router.get('/lucky_draw_coupon/getofferbyid/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.getOfferById)

router.get('/lucky_draw_coupon/getofferdetailbyid/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.getOfferDetailById)

router.get('/lucky_draw_coupon/getproductsofoffer/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.getProductsOfOffer);

router.get('/lucky_draw_coupon/getparticateusers/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.getParticateUsers);

router.post('/lucky_draw_coupon/productsave',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.offerChildSave);

router.post('/lucky_draw_coupon/productremove',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.removeOfferProduct);

router.post('/lucky_draw_coupon/generatewinner',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    luckydrawController.generateOfferwinner);

router.get('/list/lucky_draw_coupon_products/:offerId/:searchParam?/:priceSort?/:created?',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    luckydrawController.listofProdcutsonOfferId);


//----------------Offer Banner API-------------------------// 

router.get('/offer/index',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    offerController.getAllOffers)

router.get('/offer/index/:areaId/:is_active?',
    validation.licenceKeyRequire,
    // authMiddelware.validate,
    offerController.getOffers);

router.post('/offer/saveofferimg',
    validation.licenceKeyRequire,
    upload.single('offer_img'),
    offerController.saveOfferImg);

router.post('/offer/deleteofferimg',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.deleteOfferImg);

router.get('/offer/getofferpriority/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.getOfferPriority);

router.post('/offer/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    //upload.single('offer_img'),
    offerController.createOffers);

router.get('/offer/getproductsofoffer/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.getProductsOfOffer);


router.get('/offer/getofferbyid/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.getOfferById)

router.get('/offer/getofferdetailbyid/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.getOfferDetailById)


router.get('/offer/edit/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.editOffers);

router.post('/offer/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.editOffers);

router.post('/offer/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.statusall);

router.post('/offer/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.status);

router.delete('/offer/delete/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.deleteOffer);


router.post('/offer/multipledelte',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.deleteMultipleOffer);

router.post('/offer/multilogicallydelete',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.logicalDelete);



// -------------------Offer Child---------------------//

router.post('/offerchild/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.offerChildSave);

router.post('/offerchild/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.offerChildEdit);

router.post('/offerchild/removeofferproduct',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.removeOfferProduct);

router.delete('/offerchild/delete/:id',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.hardDeleteofferChild);

router.post('/offerchild/statusall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.offerChildstatusall);

router.post('/offerchild/multipledelte',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.deleteMultipleOfferChild);

router.get('/list/offerChild/:offerId/:searchParam?/:priceSort?/:created?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.listofProdcutsonOfferId);

router.get('/list/getofferChild/:offerId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    offerController.listOfferProdcut);


//-------------coupon Controller-----------------//

router.get('/coupon/index',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.getCoupons);

router.get('/coupon/generatecoupon',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.generateCoupon);

router.post('/coupon/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.saveCoupons);

router.post('/coupon/savecouponcodeimg',
    validation.licenceKeyRequire,
    upload.single('coupon'),
    couponController.saveCouponImg);

router.post('/coupon/deletecouponimg',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.deleteCouponImg);

router.get('/coupon/edit/:couponId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.edit);

router.delete('/coupon/delete/:couponId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.delete);

router.get('/coupon/getcouponoffranchise/:frId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.getCouponOfFranchise);

router.get('/coupon/getcouponofuser/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.getCouponOfUser);

router.post('/coupon/edit',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.edit);

router.post('/coupon/status',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.status);

router.get('/coupon/updateusescount/:ccode',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.updateUsesCount);

router.get('/coupon/checkexpiry/:ccode/:frId/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.checkExpiry);

router.get('/coupon/checkforreusebyuser/:ccode/:frId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.checkForReuseByUser);

router.get('/coupon/getexpirecoupon/:today',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.getExpireCoupon);

router.post('/coupon/setexpirecoupon',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    couponController.setExpireCoupon);

//-------------Wallet Transcition---------------//

router.post('/walletlog/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.saveLog);

router.get('/walletlog/gethistory/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.getLog);

router.post('/walletlog/setexpirewalletamountfrompreviouseday',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.setExpireWalletAmountFromPreviouseDay);


router.post('/walletlog/setexpirewalletamount',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.setExpireWalletAmount);

router.get('/walletlog/gettodaywalletexpiry/:today',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.todayWalletExpiry);

router.get('/walletlog/sendnotifyexpirewallet/:today',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.sendnotifyExpireWallet);

router.get('/walletlog/markexpireuserwallet/:today',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.markExpireUserWallet);

/*router.get('/walletlog/getuserWalletdebit/:userId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.getuserWalletdebit);*/

router.post('/walletlog/notifybeforeexpirewallet',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    walletController.notifyBeforeExpireWallet);

// router.post('/walletlog/happynewyeartoall',
//     validation.licenceKeyRequire,
//     authMiddelware.validate,
//     walletController.happynewyeartoall);

router.post('/order/setwalletusedstatus',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    orderController.setWalletUsedStatus);

//------------Refer And Earn-----------------------//

router.post('/referandearn', walletController.referandearn);

router.post('/notify/sendtoall',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    notificationController.sendtoall
);

router.post('/notify/sendnotification',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    notificationController.sendnotification
);


router.post('/notify/uploadimg',
    upload.single('notify_img'),
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    notificationController.uploadimg
);

router.post('/popupimg/uploadimg',
    upload.single('popup_img'),
    //validation.licenceKeyRequire,
    //authMiddelware.validate,
    popupimgController.uploadimg
);

router.post('/popupimg/save',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    popupimgController.save
);

router.get('/popupimg/getpopupimg/:fId?',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    popupimgController.getpopupimg
);

router.delete('/popupimg/deletepopupimg/:fId',
    validation.licenceKeyRequire,
    authMiddelware.validate,
    popupimgController.deletepopupimg
);

router.get('/notify/getnotification/:userId/:type?', notificationController.getnotification);

  

module.exports = router;