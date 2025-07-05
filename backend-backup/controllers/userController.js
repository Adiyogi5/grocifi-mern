const fs = require("fs");
const moment = require("moment");
const responseObj = {};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongodb = require("mongoose");
const MObjectId = require('mongoose').Types.ObjectId;
const message = require("../helpers/languages/english");
const userDatalayers = require("../datalayers/userDatalayer");
const settingDatalayers = require("../datalayers/settingDatalayers");
const errorCodes = require("../helpers/error_codes/errorCodes");
const { check, validationResult } = require("express-validator");
const walletDatalayers = require("../datalayers/walletLogDatalayers");
const notify = require("../controllers/notificationController");
const franchiseDatalayers = require('../datalayers/franchiseDatalayer');
const settingModel = require("../modules/Settings");
var https = require("https");
var urlencode = require("urlencode");

exports.setguesttoken = async(req, res) => {
    var guestToken = await userDatalayers.findbyField({ device_token: req.body.token });
    if (guestToken.length > 0) {
        //----------
    } else {
        guestToken = await userDatalayers.getGuestToken(req.body.token);
        if (guestToken.length > 0) {
            //--------
        } else {
            await userDatalayers.saveGuestToken(req.body.token);
        }
    }
};

exports.getguest = async(req, res) => {
    userDatalayers.getguestlogin()
        .then((user) => {
            if (user === null) {
                res.json({
                    sucess: errorCodes.UNAUTHORIZED,
                    msg: "",
                    data: "",
                });
            }
            const userData = user;
            const data = {};

            data.authtoken = createJWT(userData._id);
            data.user = userData;
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "Guest User",
                data: data
            });
        })
        .catch((err) => { 
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Phone number not found.",
                error: err,
            });
        });
};

exports.giveamountinwallet = (req, res) => {
    var phone_no = req.params.phone_no
    userDatalayers.giveamountinwallet(phone_no)
        .then((user) => {
            if (user == true) {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "100/- Given"
                });
            } else {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND
                });
            }

        })
        .catch((err) => { 
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Phone number not found.",
                error: err,
            });
        });
};

exports.sendotp =  async(req, res) => {    
        var number = req.body.phone;
        var otp = '123456';        
        const url = 'https://api.textlocal.in/send/?apikey=NTA0NjQzNmM0NjMwNmE2Mzc2NzEzMTc0Mzk3MTU0NTY%3D&sender=AYTSMS&numbers=9887001059&message=Hello%2BUser%2BYour%2BLogin%2BVerification%2BCode%2Bis%2B1135.%2BThanks%2BAYT';         
        const request = https.request(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data = data + chunk.toString();
            });          
            response.on('end', () => {
                const body = JSON.parse(data);
                res.json({
                    sucess: "sucess",
                    msg: body
                });
                return; 
            });
        })      
        request.on('error', (error) => {
            res.json({
                sucess: "error",
                msg: error
            });
            return; 
        });
       request.end(); 
}


exports.login = async(req, res) => {
    var refer_code = "IF" + referCode(8);
    let frndCode = req.body.friends_code;
    let uip = req.body.uip;

    // Find frndCode present unique or not //is_refer
    var walletBalance_amount = 0;
    var settings = await settingDatalayers.getSettings();
    var wallet_balance = (settings[0].give_reg_amount) ? settings[0].use_refer_code_amount : 0;

    if (frndCode != "") {
        var refrcode = await userDatalayers.findbyField({ refer_code: frndCode });
        if (refrcode.length > 0) {
            if (!settings[0].give_reg_amount) {
                wallet_balance = (settings[0].is_refer) ? settings[0].use_refer_code_amount : 0;
            }
        } else {
            //frndCode = "";
            res.json({
                sucess: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Given refer code is invalid."
            });
            return;
        }
    }

    var device_id = "";
    var os_devid_vc = "";
    var device_token = "";
    var is_wholesaler = 0;
    var wholesaler_firmname = "";
    var gst_no = "";
    var is_wholesaler_approve = 0;
    var reqParam = {};

    if (req.body.device_id != null && req.body.device_id != undefined) {
        device_id = req.body.device_id;
    }
    if (req.body.is_wholesaler != null && req.body.is_wholesaler != undefined) {
        is_wholesaler = req.body.is_wholesaler;
    }
    if (req.body.firmname != null && req.body.firmname != undefined) {
        wholesaler_firmname = req.body.firmname;
    }
    if (req.body.gst_no != null && req.body.gst_no != undefined) {
        gst_no = req.body.gst_no;
    }
    if (req.body.os_devid_vc != null && req.body.os_devid_vc != undefined) {
        os_devid_vc = req.body.os_devid_vc;
    }
    if (req.body.token != undefined && req.body.token != null) {
        device_token = req.body.token;
    }
    if (req.body.reqForm != "login") {
        reqParam.app_version = req.body.app_version;
        reqParam.reg_from = req.body.reg_from;
    }

    try {
        var fname = (req.body.fname == undefined) ? "" : req.body.fname;
        var lname = (req.body.lname == undefined) ? "" : req.body.lname;

        reqParam.uip = uip;
        reqParam.fname = fname;
        reqParam.lname = lname;
        reqParam.frndCode = frndCode;
        reqParam.device_id = device_id;
        reqParam.refer_code = refer_code;
        reqParam.os_devid_vc = os_devid_vc;
        reqParam.userphone = req.body.phone;
        reqParam.reqForm = req.body.reqForm;
        reqParam.device_token = device_token;
        reqParam.wallet_balance = wallet_balance;
        reqParam.is_wholesaler = is_wholesaler;
        reqParam.wholesaler_firmname = wholesaler_firmname;
        reqParam.gst_no = gst_no;
        reqParam.is_wholesaler_approve = is_wholesaler_approve;
         console.log("reqParam",reqParam)
        var otp = await userDatalayers.login(reqParam);

        if (otp != null && otp != 422 && otp != 421) {
            userDatalayers.sendOTP(req.body.phone, otp);
            //notify.notifyOtp(device_token, otp);
        }
        var ecode = errorCodes.SUCEESS;
        var flag = 1;
        var msg = "";

        if (req.body.reqForm == "login") { 
            if (otp == null) {
                ecode = errorCodes.RESOURCE_NOT_FOUND;
                msg = "Mobile number not found.";
                flag = 0;
            }
            if (otp == 422) {
                ecode = errorCodes.UNPROCESSABLE_ENTITY;
                msg = "Your account is not active please contact "+process.env.APPNAME+" support team at "+process.env.SUPPORTNO;
                flag = 0;
            }
        } 
        if (req.body.reqForm == "signup") {
            if (otp == null) {
                ecode = errorCodes.BAD_REQUEST;
                msg = "Phone number already registered.";
                flag = 0;
            }
        }

        res.json({
            sucess: ecode,
            msg: msg,
            flag: flag,
            data: otp,
            referCode: refer_code,
        });
    } catch (err) {
        res.json({
            err: errorCodes.DATA_NOT_FOUND,
            msg: "Phone number not found.",
            error: err,
        });
    }
};


exports.resendotp = async(req, res) => {
    var phone = req.body.phone;
    try {
        var otp = await userDatalayers.resendotp(phone);
        userDatalayers.sendOTP(req.body.phone, otp);
        if (otp != "" && otp != null) {
            var user = await userDatalayers.findbyField({ phone_no: phone });
            if (user.length > 0) {
                var token = user[0].device_token;
                //notify.notifyOtp(token, otp);
            }
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "Otp Send Successfully",
                data: otp
            });
        } else {
            res.json({
                sucess: errorCodes.DATA_NOT_FOUND,
                msg: "Phone number not found.",
            });
        }
    } catch (err) {
        res.json({
            err: errorCodes.DATA_NOT_FOUND,
            msg: "Phone number not found.",
            error: err,
        });
    }
};

exports.isDeviceExist = async(req, res) => {
    res.json({
        sucess: errorCodes.SUCEESS,
        msg: "",
        data: false
    });
    return;
    var deviceId = req.body.deviceId;
    userDatalayers.isDeviceExist(deviceId)
        .then((flag) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: flag
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Phone number not found.",
                error: err,
            });
        })
};

exports.varifyOtp = (req, res) => {
    userDatalayers.varifyOtp(req.body.phone, req.body.otp)
        .then((user) => { 
            if (user == null) {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND,
                    varified: false,
                    msg: "Please enter valid OTP.",
                });
            } else { 

                var userData = "";
                userDatalayers.getLoginUser(req.body.phone)
                    .then((user) => {
                        const userData = user;
                        const data = {};

                        data.authtoken = createJWT(userData._id);
                        data.user = userData;

                        userDatalayers.deleteGuestToken(userData.device_token);

                        res.json({
                            sucess: errorCodes.SUCEESS,
                            varified: true,
                            msg: "Otp varified successfully.",
                            data: data,
                        });
                    })
                    .catch((error) => console.log(error));
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Phone number not found.",
                error: err,
            });
        });
};

exports.varifyregisterOtp = async(req, res) => {
   
    userDatalayers.varifyOtp(req.body.phone, req.body.otp)
        .then(async(user) => { 
            if (user == null) {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND,
                    varified: false,
                    msg: "Please enter valid OTP.",
                });
            } else { 
    

                var refer_code = "IF" + referCode(8);
                let frndCode = req.body.friends_code;
                let uip = req.body.uip;
                // Find frndCode present unique or not //is_refer
                var walletBalance_amount = 0;
                var settings = await settingDatalayers.getSettings();
                var wallet_balance = (settings[0].give_reg_amount) ? settings[0].use_refer_code_amount : 0;
                if (frndCode != "") {
                    var refrcode = await userDatalayers.findbyField({ refer_code: frndCode });
                    if (refrcode.length > 0) {
                        if (!settings[0].give_reg_amount) {
                            wallet_balance = (settings[0].is_refer) ? settings[0].use_refer_code_amount : 0;
                        }
                    } else {
                        //frndCode = "";
                        res.json({
                            sucess: errorCodes.RESOURCE_NOT_FOUND,
                            msg: "Given refer code is invalid."
                        });
                        return;
                    }
                }
                var device_id = "";
                var os_devid_vc = "";
                var device_token = "";
                var is_wholesaler = 0;
                var wholesaler_firmname = "";
                var gst_no = "";
                var is_wholesaler_approve = 0;
                var reqParam = {};

                if (req.body.device_id != null && req.body.device_id != undefined) {
                    device_id = req.body.device_id;
                }
                if (req.body.is_wholesaler != null && req.body.is_wholesaler != undefined) {
                    is_wholesaler = req.body.is_wholesaler;
                }
                if (req.body.firmname != null && req.body.firmname != undefined) {
                    wholesaler_firmname = req.body.firmname;
                }
                if (req.body.gst_no != null && req.body.gst_no != undefined) {
                    gst_no = req.body.gst_no;
                }
                if (req.body.os_devid_vc != null && req.body.os_devid_vc != undefined) {
                    os_devid_vc = req.body.os_devid_vc;
                }
                if (req.body.token != undefined && req.body.token != null) {
                    device_token = req.body.token;
                }
                if (req.body.reqForm != "login") {
                    reqParam.app_version = req.body.app_version;
                    reqParam.reg_from = req.body.reg_from;
                }

                var fname = (req.body.fname == undefined) ? "" : req.body.fname;
                var lname = (req.body.lname == undefined) ? "" : req.body.lname;

                reqParam.uip = uip;
                reqParam.fname = fname;
                reqParam.lname = lname;
                reqParam.frndCode = frndCode;
                reqParam.device_id = device_id;
                reqParam.refer_code = refer_code;
                reqParam.os_devid_vc = os_devid_vc;
                reqParam.userphone = req.body.phone;
                reqParam.reqForm = req.body.reqForm;
                reqParam.device_token = device_token;
                reqParam.wallet_balance = wallet_balance;
                reqParam.is_wholesaler = is_wholesaler;
                reqParam.wholesaler_firmname = wholesaler_firmname;
                reqParam.gst_no = gst_no;
                reqParam.is_wholesaler_approve = is_wholesaler_approve;
                ///console.log('reqParam'); console.log(reqParam);

                userDatalayers.registerUser(reqParam)
                    .then((userreg) => {     
                        var userData = "";                        
                        userDatalayers.getLoginUser(req.body.phone)
                            .then((user) => {
                                const userData = user;
                                const data = {};

                                data.authtoken = createJWT(userData._id);
                                data.user = userData;

                                userDatalayers.deleteGuestToken(userData.device_token);

                                res.json({
                                    sucess: errorCodes.SUCEESS,
                                    varified: true,
                                    msg: "Otp varified successfully.",
                                    data: data,
                                });
                            }).catch((error) => console.log(error));

                }).catch((error) => console.log(error));
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Phone number not found.",
                error: err,
            });
        });
};


exports.adminphonelogin = (req, res) => {
    userDatalayers.adminphonelogin(req.body)
        .then((admin) => {
            if (admin.success == 1) {
                const userData = admin.data;
                const data = {};
                data.authtoken = createJWT(userData._id);
                data.user = userData;

                responseObj.sucess = errorCodes.SUCCESS;
                responseObj.message = "";
                responseObj.data = data;
                res.json(responseObj);
            } else {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND,
                    msg: admin.message,
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Wrong phone number or password.",
                error: err,
            });
        });
};

exports.adminlogin = (req, res) => {
    userDatalayers.adminlogin(req.body)
        .then((admin) => {
            if (admin.success == 1) {
                const userData = admin.data;
                const data = {};
                data.authtoken = createJWT(userData._id);
                data.user = userData;

                responseObj.sucess = errorCodes.SUCCESS;
                responseObj.message = "";
                responseObj.data = data;
                res.json(responseObj);
            } else {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND,
                    msg: admin.message,
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.DATA_NOT_FOUND,
                msg: "Wrong Email or password.",
                error: err,
            });
        });
};

function createJWT(userId) {
    const secretKey = process.env.ENCRYPTION_KEY;
    var token = jwt.sign({ subject: userId },
        secretKey /* , { expiresIn: 86400*30 } */
    );
    return token;
}

exports.isloggedin = (req, res) => {
    res.json({
        sucess: errorCodes.SUCEESS,
        msg: "Authrized",
    });
    return;
};

exports.getAdmin = (req, res) => {
    userDatalayers
        .getAdmin()
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};
 

exports.dboylogin = async(req, res) => {
    try {
        var otp = await userDatalayers.dboylogin(req.body.phone);

        if (otp != null) {
            userDatalayers.sendOTP(req.body.phone, otp);
        } else {

        }

        var ecode = errorCodes.SUCEESS;
        var flag = 1;
        var msg = "";


        if (otp == null) {
            ecode = errorCodes.RESOURCE_NOT_FOUND;
            msg = "Record(s) not found.";
            flag = 0;
        }

        return res.json({
            sucess: ecode,
            msg: msg,
            flag: flag,
            data: "",
        });
    } catch (err) {
        return res.json({
            err: errorCodes.DATA_NOT_FOUND,
            msg: "User not found.",
            error: err,
        });
    }
};

exports.stafflogin = async(req, res) => {
    try {
        var otp = await userDatalayers.stafflogin(req.body.phone);
        if (otp != null) {
            userDatalayers.sendOTP(req.body.phone, otp);
        } else {

        }
        var ecode = errorCodes.SUCEESS;
        var flag = 1;
        var msg = "";

        if (otp == null) {
            ecode = errorCodes.RESOURCE_NOT_FOUND;
            msg = "Record(s) not found.";
            flag = 0;
        }
        var where = { phone_no: req.body.phone}
        var userData =  await userDatalayers.getAllUser( where );
        var optuser = {}; 
        optuser['franchise_id'] = userData[0]['franchise_id'];
        res.json({
            sucess: ecode,
            msg: msg,
            flag: flag,
            data: optuser,
        });
    } catch (err) {
        res.json({
            err: errorCodes.DATA_NOT_FOUND,
            msg: "User not found.",
            error: err,
        });
    }
};

exports.getAllFranchise = (req, res) => {
    userDatalayers.getAllFranchise()
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err
            });
        });
};

exports.getAllDeliveryBoy = (req, res) => {
    userDatalayers
        .getAllDeliveryBoy()
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getAllUser = async(req, res) => {
    const param = req.query; //Getting title param to search
    userDatalayers.getAllUser(param)
        .then((doc) => {
            res.json({
                sucess: message.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getAllStaff = async(req, res) => {
    user = req.user;
    let where = {};
    where.role_type = { $nin: ['1', '3', '4', '6'] }

    if (user.role_type == "3") {
        where.franchise_id = user._id;
    } else if (user.role_type != "1") {
        where.franchise_id = user.franchise_id;
    }

    userDatalayers.getAllStaff(where)
        .then((doc) => {
            res.json({
                sucess: message.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.exportUserByRole = async(req, res) => {
    let role = req.query.role;
    let where = {};
    let _and2 = [];
    let _and = [];
    let waddr = { $expr: { $eq: ["$userId", "$$userId"] } };
    let issearch = 0;

    if (req.query.country) {
        issearch = 1;
        _and2.push({ countryId: mongodb.Types.ObjectId(req.query.country) });
    } 
    if (req.query.state) {
        issearch = 1;
        _and2.push({ stateId: mongodb.Types.ObjectId(req.query.state) });
    }
    if (req.query.city) {
        issearch = 1;
        _and2.push({ cityId: mongodb.Types.ObjectId(req.query.city) });
    } 
    if (req.query.area) {
        issearch = 1;
        _and2.push({ areaId: mongodb.Types.ObjectId(req.query.area) });
    }
    switch (role) { 
        case 'customer':
            _and.push({role_type: "4", is_wholesaler:false }); 
            where = { $and: _and } 
            sort = { created: -1 };
            break;
        case 'wholesaler':
            _and2.push({role_type: "4", is_wholesaler:true }); 
            where = { $and: _and } 
            sort = { created: -1 };
            break;     
    }
    if(_and2!=''){  
        _and2.push({ $expr: { $eq: ["$userId", "$$userId"] } }); 
        waddr =  { $and: _and2 };
    }
    userDatalayers.exportCustomerByRole(where, waddr, issearch)
    .then((doc) => { 
        res.json({ 
            sucess: errorCodes.SUCCESS,
            msg: message.SUCCESS,
            data: doc 
        });
    })
    .catch((err) => {
        res.json({
            err: errorCodes.BAD_REQUEST,
            message: message.SOMETHING_WENT_WRONG,
            error: err,
        });
    });
};

exports.getUserByRole = async(req, res) => {
    let role = req.query.role;
    let where = {};
    let sort = {};
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    }    
    let waddr = { $expr: { $eq: ["$userId", "$$userId"] } };
    let _and = [];
    let _and2 = [];
    let issearch = 0;
    if(req.query.role_id){
        _and.push({role_type:req.query.role_id});
    }
    if(req.query.franchise_id){
        _and.push({franchise_id: mongodb.Types.ObjectId(req.query.franchise_id)});
    }
    if (req.query.country) {
        issearch = 1;
        _and2.push({ countryId: mongodb.Types.ObjectId(req.query.country) });
    } 
    if (req.query.state) {
        issearch = 1;
        _and2.push({ stateId: mongodb.Types.ObjectId(req.query.state) });
    }
    if (req.query.city) {
        issearch = 1;
        _and2.push({ cityId: mongodb.Types.ObjectId(req.query.city) });
    } 
    if (req.query.area) {
        issearch = 1;
        _and2.push({ areaId: mongodb.Types.ObjectId(req.query.area) });
    }


    let where1 = {};
    switch (role) {
        case 'admin':
            _and.push({role_type: { $nin: ["3", "4", "5", "6"] }}); 
            where = { $and: _and }
            where1 = { $and: _and } 
            sort = { fname: 1 };
            break;
        case 'franchise': 
            _and.push({role_type: "3"});
            where = { $and: _and }
            where1 = { $and: _and } 
            sort = { fname: 1 };
            break;
        case 'customer':
            _and.push({role_type: "4", is_wholesaler:false }); 
            where = { $and: _and }
            where1 = { $and: _and }  
            sort = { created: -1 };
            break;
        case 'wholesaler':
            _and.push({role_type: "4", is_wholesaler:true }); 
            where = { $and: _and }
            where1 = { $and: _and }
            sort = { created: -1 };
            break;    
        case 'delivery_boy': 
            _and.push({role_type: "5"}); 
            where = { $and: _and }
            where1 = { $and: _and } 
            sort = { fname: -1 };
            break; 
        default:
            where = {};
            sort = { fname: 1 };
            break;
    }

    if(role=='customer' || role=='wholesaler'){
        var total = await userDatalayers.gettotalCustomer(where1, waddr, issearch);
    }else{
        var total = await userDatalayers.gettotalUsers(where1);
    }   

    if(_and2!=''){  
        _and2.push({ $expr: { $eq: ["$userId", "$$userId"] } }); 
        waddr =  { $and: _and2 };
    }   

    if (req.query.where) {
        where = {
            "$or": [{
                "fname": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            },{
                "lname": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            }, {
                "franchiseName": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            }, {
                "phone_no": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            }, {
                "reg_from": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            }],
            "$and": [where1]
        };
    }  
 
    if(role=='customer' || role=='wholesaler'){
        var filtered = await userDatalayers.gettotalCustomer(where, waddr, issearch);
        userDatalayers.getCustomerByRole(where, sort, params, waddr, issearch)
        .then((doc) => { 
            res.json({ 
                sucess: errorCodes.SUCCESS,
                msg: message.SUCCESS,
                data: doc,
                total: total,
                filtered: filtered,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
    }else if(role=='delivery_boy'){
        var filtered = await userDatalayers.gettotalDeliveryBoy(where);
        userDatalayers.getDeliveryBoyByRole(where, sort, params)
            .then((doc) => { 
                res.json({ 
                    sucess: errorCodes.SUCCESS,
                    msg: message.SUCCESS,
                    data: doc,
                    total: total,
                    filtered: filtered,
                });
            })
            .catch((err) => {
                res.json({
                    err: errorCodes.BAD_REQUEST,
                    message: message.SOMETHING_WENT_WRONG,
                    error: err,
                });
            });        
    }else{
        var filtered = await userDatalayers.gettotalUsers(where);
        userDatalayers.getUserByRole(where, sort, params)
            .then((doc) => { 
                res.json({ 
                    sucess: errorCodes.SUCCESS,
                    msg: message.SUCCESS,
                    data: doc,
                    total: total,
                    filtered: filtered,
                });
            })
            .catch((err) => {
                res.json({
                    err: errorCodes.BAD_REQUEST,
                    message: message.SOMETHING_WENT_WRONG,
                    error: err,
                });
            });
    }
};

exports.getAllUsersAndOrders = async(req, res) => {
    let where = {};

    if (req.query.created_from && req.query.created_from != "" && req.query.created_to && req.query.created_to != "") {
        let created_from = new Date(moment(req.query.created_from).add(5, "hours").add(30, "minutes"));
        let created_to = new Date(moment(req.query.created_to).add(1, "days").add(5, "hours").add(30, "minutes"));
        where.created = { $gte: created_from, $lt: created_to };
    }

    userDatalayers.getAllUsersAndOrders(where)
        .then((doc) => {
            res.json({
                sucess: message.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.findUser = async(req, res) => {
    //str = new RegExp(str, 'i');
    let param = req.query;

    userDatalayers.findbyField(param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.findUserByReferCode = async(req, res) => {
    let where = {};
    let _id = null;
    let refer_code = null;
    if (req.query._id) {
        _id = mongodb.Types.ObjectId(req.query._id);
        where._id = { $ne: _id };
    }

    if (req.query.refer_code) {
        refer_code =  new RegExp('^' + req.query.refer_code + '', 'i');
        where.refer_code = refer_code;
    }

    userDatalayers.findbyField(where)
        .then((doc) => { 
            if (doc.length > 0) {
                res.json({
                    sucess: 422,
                    msg: `Refer code ${req.query.refer_code} already taken`,
                });
            } else {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: '',
                });
            }
        })
        .catch((err) => {
            res.json({
                sucess: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getClients = (req, res) => {
    userDatalayers.getClients()
        .then((doc) => {
            res.json({
                sucess: message.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};


exports.updateUserOrderStatus = async(req, res) => {
    let _id = mongodb.Types.ObjectId(req.body._id);
    let updateBody = {
        last_order_date: req.body.last_order_date,
        order_status: {
            recieved: req.body.recieved,
            delivered: req.body.delivered,
            cancelled: req.body.cancelled
        }
    }

    let doc = await userDatalayers.updateUser(_id, updateBody);
    if (doc._id) {
        res.json({
            success: errorCodes.SUCCESS,
            msg: "",
            data: doc
        });
    } else {
        res.json({
            success: errorCodes.BAD_REQUEST,
            msg: "",
            data: doc
        });
    }
}

exports.save = async(req, res) => {
    var param = req.body; 
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.json({
            sucess: errorCodes.BAD_REQUEST,
            msg: validation.errors[0].msg,
            error: validation,
        });
        return;
    }

    if (param.user.refer_code == '') {
        param.user.refer_code = "IF" + referCode(8);
    } else {
        let data = await userDatalayers.findbyField({ refer_code: param.user.refer_code });
        if (data.length > 0) {
            res.json({
                sucess: errorCodes.BAD_REQUEST,
                msg: "Invalid Refer Code, Record not saved. Try again...",
            });
            return;
        }
    }

    if (!param.user.friends_code || param.user.friends_code == '') {
        //Do Nothing
    } else {
        var settings = await settingDatalayers.getSettings();
        let data = await userDatalayers.findbyField({ refer_code: param.user.friends_code }); 
        if (data.length > 0) {
            if (!settings[0].give_reg_amount) {
                param.user.wallet_balance = (settings[0].is_refer) ? settings[0].use_refer_code_amount : 0;
            }
        } else {
            res.json({
                sucess: errorCodes.BAD_REQUEST,
                msg: "Given refer code is invalid."
            });
            return;
        }
    } 
    if(param.user.delivery_detail){
        param.user.delivery_detail =  { recieved: 0, deposit: 0 }
    }   
   //  console.log(param);
    userDatalayers.save(param)
        .then((doc) => {
            if (param.user.wallet_balance > 0) {
                var today = new Date();
                today = moment(today).format().split("T")[0];
                today = new Date(today + "T00:00:00.000Z"); 
                var walletexpiredays = settings[0].wallet_expire_days;

                var expDay = moment(today).add(walletexpiredays, "days");
                expDay = new Date(expDay); 
                walletDatalayers.save({
                    userId: doc._id,
                    wallet_amount: param.user.wallet_balance,
                    description: 'Earn on registration.',
                    expire_on: expDay,
                    transaction: '1',
                    is_admin:'1',
                }); 
            }
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((e) => { 
            res.json({
                sucess: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: e.errors,
            });
        });
};

exports.uploadimg = async(req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/user_img/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.uploadvisitingcard = async(req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/user_visitingcard/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.delvisitcardimg = async(req, res) => {
    fs.unlink(
        __dirname + "/../public/uploads/user_visitingcard/" + req.params.filename,
        (err) => {
            if (err) {
                return;
            }
        }
    );
    res.json({
        sucess: errorCodes.SUCEESS,
    });
};

exports.uploadfirmlogo = async(req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/firm_img/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.getFranchiseUsers = (req, res) => {
    const where = { is_active: req.query.is_active, role_type: "3" };
    userDatalayers.getFranchiseUsers(where)
        .then((user) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: user,
            });
        })
        .catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error,
            });
        });
};


exports.getUserByName = async(req, res) => {
    /// name = mongodb.Types.ObjectId(req.params.name); 
    let where = {};
    where = {
        "$or": [{
            "fname": {$regex: new RegExp('^' + req.params.name + '', 'i') }
        }, {
            "lname": {$regex: new RegExp('^' + req.params.name + '', 'i') }
        }, {
            "phone_no": {$regex: new RegExp('^' + req.params.name + '', 'i') }
        }],
        "$and": [{"role_type": "4"}, {"is_active":"1"}]
    };
    userDatalayers.getUserByName(where)
        .then((user) => {
            const newlist = [];
            if (user.length > 0) {
                user.forEach((ele, index) => {
                    if(ele.is_wholesaler==1) {
                        if(ele.is_wholesaler_approve==1){
                            newlist.push(ele);
                        }
                    }else{
                        newlist.push(ele);
                    }
                }); 
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: newlist,
                });
            }else{
               res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error,
                }); 
            }
        })
        .catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error,
            });
        });
};

exports.getUserById = (req, res) => {
    id = mongodb.Types.ObjectId(req.params.id);
    userDatalayers.getUserById(id)
        .then((user) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: user,
            });
        })
        .catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error,
            });
        });
};

exports.edit = (req, res) => {
    if (req.method == "GET") {
        userDatalayers.edit(req.params)
            .then((user) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: user,
                });
            })
            .catch((error) => {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error,
                });
            });
    } else {
        const validation = validationResult(req);
        if (!validation.isEmpty()) {
            res.json({
                sucess: errorCodes.BAD_REQUEST,
                msg: validation.errors[0].msg,
                error: validation,
            });
            return;
        }

        var param = {};
        if (!param.user) {
            param.user = (req.body.user) ? req.body.user : req.body;
            param.franchise = (req.body.franchise) ? req.body.franchise : {};
        } else {
            param = req.body;
        }

        userDatalayers.update(param)
            .then((user) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: user,
                });
            })
            .catch((error) => {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error,
                });
            });
    }
};


exports.updateUser = (req, res) => {

    userDatalayers.updateUser(mongodb.Types.ObjectId(req.body._id), req.body)
        .then((user) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: "",
                data: user,
            });
        })
        .catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error,
            });
        });

};

exports.updateWalletBalance = async(req, res) => {
    var postedData = {};
    postedData._id = mongodb.Types.ObjectId(req.body._id);
    postedData.wb = Number(req.body.wallet_balance); //wallet balance
    postedData.ttype = req.body.ttype; //wallet balance
    postedData.description = req.body.description; //wallet balance
    postedData.is_admin = req.body.is_admin; //add by admin or not
    await userDatalayers.updateWalletBalance(postedData)
        .then((result) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: result
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not found.",
                data: err
            });
        });
}

exports.status = (req, res) => {
    userDatalayers.status(req.body._id, req.body.is_active)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.wholesalerstatus = (req, res) => {
    userDatalayers.wholesalerstatus(req.body._id, req.body.is_wholesaler_approve)
        .then((doc) => {
            var notifyToUser = req.body._id;
            if(req.body.is_wholesaler_approve==1){
                notify.notify(
                    notifyToUser,
                    "Account Approved",
                    'Dear '+doc.fname+', Your account has been approved by '+process.env.APPNAME
                );
            }else if(req.body.is_wholesaler_approve==2){
                notify.notify(
                    notifyToUser,
                    "Account Rejected",
                    'Dear '+doc.fname+', Your account has been Rejected by '+process.env.APPNAME
                );
            }
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.changestatus = (req, res) => {
    userDatalayers.changestatus(req.body._id, req.body.is_wholesaler)
        .then((doc) => {
            var notifyToUser = req.body._id; 
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.updateReferCode = async(req, res) => {
    userDatalayers.findbyField({ _id: mongodb.Types.ObjectId(req.body._id) })
        .then((user) => {
            if (user.length > 0) {
                let refer_code = user[0].refer_code;
                if (refer_code.trim() != '') {
                    userDatalayers.updateByField(mongodb.Types.ObjectId(req.body._id), { refer_code: req.body.refer_code })
                        .then((doc) => {
                            userDatalayers.updateByWhere({ friends_code: refer_code }, { friends_code: req.body.refer_code })
                                .then((doc) => {
                                    res.json({
                                        success: errorCodes.SUCEESS,
                                        msg: ""
                                    });
                                })
                                .catch((err) => {
                                    res.json({
                                        success: errorCodes.RESOURCE_NOT_FOUND,
                                        msg: "Record(s) not found.",
                                        error: err
                                    });
                                });
                        })
                        .catch((err) => {
                            res.json({
                                success: errorCodes.RESOURCE_NOT_FOUND,
                                msg: "Record(s) not found.",
                                error: err
                            });
                        });
                } else {
                    userDatalayers.updateByField(mongodb.Types.ObjectId(req.body._id), { refer_code: req.body.refer_code })
                        .then((doc) => {
                            res.json({
                                success: errorCodes.SUCEESS,
                                msg: ""
                            });
                        })
                        .catch((err) => {
                            res.json({
                                success: errorCodes.RESOURCE_NOT_FOUND,
                                msg: "",
                                error: err
                            });
                        });
                }
            } else {
                res.json({
                    success: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found."
                });
            }
        })
        .catch(err => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.updateImageName = (req, res) => {
    userDatalayers
        .updateImageName(req.body._id, req.body.img)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.statusAll = async(req, res) => {
    const is_active = { is_active: req.body.is_active };
    const idArr = [];

    if (req.body.productIds && req.body.productIds.length > 0) {
        req.body.productIds.forEach((_id) => {
            idArr.push(mongodb.Types.ObjectId(_id));
        });
    } else {
        return false;
    }
    userDatalayers
        .statusAll(idArr, is_active)
        .then((product) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: product,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.delete = (req, res) => {
    userDatalayers
        .delete(req.body.userId)
        .then((flag) => {
            if (flag) {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                });
            } else {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found.",
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.saveipcode = async(req, res) => {
    var uIp = req.body.uip;
    var fCode = req.body.fCode;
    await userDatalayers.saveipcode(uIp, fCode)
        .then((doc) => { 
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: ""
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
    res.end();
}

exports.getfcodeofip = async(req, res) => {
    var uIp = req.params.uip;
    userDatalayers.getfcodeofip(uIp)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
}

exports.changepassword = async(req, res) => {
    const validation = validationResult(req);
    if (validation.isEmpty()) {
        const params = req.body;
        var password = req.body.password;
        var _id = req.body._id;
        var oldpassword = req.body.oldpassword;
        var olduserpassword = '';
        var data = await userDatalayers.findbyField({ _id: req.body._id });
        if (data[0] == undefined) {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "No Such User Present",
            });
        } else {
            data = data[0];
            var token = bcrypt.compareSync(oldpassword, data.password);
            if (token) {
                password = bcrypt.hashSync(password, 10);
                params.password = password;
                delete params.oldpassword;
                delete params.confirm_pwd;
                params._id = _id; 
                userDatalayers.updatepassword(params)
                    .then((doc) => {
                        res.json({
                            sucess: errorCodes.SUCEESS,
                            msg: "",
                            data: doc,
                        });
                    })
                    .catch((err) => {
                        res.json({
                            sucess: errorCodes.RESOURCE_NOT_FOUND,
                            msg: "",
                            error: err,
                        });
                    });
            } else {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Check Your Old Password",
                    error: "",
                });
            }
        }
    } else {
        res.json({
            err: errorCodes.RESOURCE_NOT_FOUND,
            msg: "Something Went Wrong",
            error: validation,
        });
    }
};

exports.findbyField = async(req, res) => {
    const params = req.query;
    userDatalayers
        .findbyField({ _id: params.id })
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.generateforgotpasswordotp = async(req, res) => {
    var body = req.body;
    var data = await userDatalayers.findbyField({ phone_no: req.body.phone });
    if (data[0] != null) {
        if (req.body.reqForm === "forgot") {
            userDatalayers
                .fortgotPasswordOtp(req.body.phone)
                .then((otp) => {
                    res.json({
                        sucess: errorCodes.SUCEESS,
                        msg: "",
                        flag: "1",
                        data: otp,
                    });
                })
                .catch((err) => {
                    res.json({
                        err: errorCodes.RESOURCE_NOT_FOUND,
                        msg: "No Such Request Present",
                        error: {
                            err_field: err,
                        },
                    });
                });
        } else {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "No Such Request Present",
                error: {
                    err_field: req.body.reqForm,
                },
            });
        }
    } else {
        res.json({
            err: errorCodes.RESOURCE_NOT_FOUND,
            msg: "No Such User Present",
            error: {
                err_field: req.body.phone,
            },
        });
    }
};

exports.walletbalance = (req, res) => {
    const condition = { _id: req.params.userId };
    userDatalayers
        .findbyField(condition)
        .then((value) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                wallet_balance: value[0].wallet_balance,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "No Such Request Present",
                error: {
                    err_field: err,
                },
            });
        });
};

function referCode(length) {
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}




exports.getMyFriends = async(req, res) => {
    if (MObjectId.isValid(req.params.userId)) {
        let where = { "_id": mongodb.Types.ObjectId(req.params.userId) };

        var total = await userDatalayers.gettotalfriendLog(where);
        let params = { skip: 0, limit: 0 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
            params.order = req.query.order;
            params.dir = parseInt(req.query.dir);
        } else {
            where = { "_id": mongodb.Types.ObjectId(req.params.userId) }
        } 
        if (req.query.where) {
            where = {
                "$or": [{
                    "fname": {$regex: new RegExp('^' + req.query.where + '', 'i') }
                }, {
                    "lname": {$regex: new RegExp('^' + req.query.where + '', 'i') }
                }],
                "$and": [{ "_id": mongodb.Types.ObjectId(req.params.userId) }]
            };
        }
        var filtered = await userDatalayers.gettotalfriendLog(where);
        userDatalayers.getMyFriends(where, params)
            .then((result) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: result,
                    total: total,
                    filtered: filtered,
                });
            })
            .catch(error => {
                res.json({
                    error: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "No record found.",
                    err: err,
                });
            });
    }else{
        res.json({
            err: errorCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

/*exports.getMyFriends = async(req, res) => {
    try {
        const userId = mongodb.Types.ObjectId(req.params.userId);
        var userData = await userDatalayers.getMyFriends(userId);

        res.json({
            sucess: message.SUCCESS,
            msg: "",
            data: userData
        });
    } catch (err) { 
        res.json({
            sucess: message.BAD_REQUEST,
            msg: "",
            data: ""
        });
    }
};*/

exports.getMyReferer = async(req, res) => {
    try {
        var userData = await userDatalayers.getMyReferer(req.params.rcode);

        res.json({
            sucess: message.SUCCESS,
            msg: "",
            data: userData
        });
    } catch (err) { 
        res.json({
            sucess: message.BAD_REQUEST,
            msg: "",
            data: ""
        });
    }
};

exports.updateAppVersion = (req, res) => { //Update user's app version
    var _id = mongodb.Types.ObjectId(req.body._id);
    var postedData = { app_version: Number(req.body.app_version) };

    userDatalayers.updateByField(_id, postedData)
        .then((result) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: result
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not found.",
                data: err
            });
        });
}

exports.getUserByPhoneNumber = async(req, res) => {
    userDatalayers.findbyField({ phone_no: req.params.phone_no })
        .then((result) => {
            res.json({
                sucess: message.SUCCESS,
                msg: "",
                data: result
            });
        })
        .catch(err => {
            res.json({
                sucess: message.BAD_REQUEST,
                msg: "",
                data: ""
            });
        });
};

exports.todayAndLastWeekCustomers = async(req, res) => {
    try {
        let today = new Date();
        let nextDay = new Date();
        let previousDate = new Date();
        var customerDetails = { total_customer: 0, last_week_customer: 0, today_customer: 0 };

        today = moment(today).add(5, "hours").add(30, "minutes").format("YYYY-MM-DD");
        today = new Date(today);

        nextDay = moment(today).add(1, "days").format("YYYY-MM-DD");
        nextDay = new Date(nextDay);

        previousDate = moment(today).subtract(7, "days").format("YYYY-MM-DD");
        previousDate = new Date(previousDate);

        var totalCustomers = await userDatalayers.getTotalCustomersCount(); // total customers
        customerDetails.total_customer = totalCustomers;

        var lastWeekCustomer = await userDatalayers.getTodayAndLastWeekCustomers(previousDate, today); // last week data
        if (lastWeekCustomer.length > 0) {
            customerDetails.last_week_customer = lastWeekCustomer[0].users;
        }

        var todayCustomer = await userDatalayers.getTodayAndLastWeekCustomers(today, nextDay); // last week data
        if (todayCustomer.length > 0) {
            customerDetails.today_customer = todayCustomer[0].users;
        }

        res.json({
            sucess: errorCodes.SUCEESS,
            msg: "",
            data: customerDetails
        });
    } catch (e) { 
        res.json({
            sucess: errorCodes.BAD_REQUEST,
            msg: e,
            data: { total_customer: 0, last_week_customer: 0, today_customer: 0 }
        });
    }
};

exports.validation = (method) => {
    switch (method) {
        case "changePassword":
            {
                return [
                    check("password", "Password Value Missing").exists(),
                    check(
                        "confirm_pwd",
                        "passwordConfirmation field must have the same value as the password field"
                    )
                    .exists()
                    .custom((value, { req }) => value === req.body.password),
                ];
            }
        case "save_user":
            {
                return [
                    check("user.phone_no", "")
                    .custom(async(phone_no, { req }) => {
                        if (phone_no) {
                        return userDatalayers.findbyField({ phone_no })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`Phone number "${phone_no}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length; 
                         if(plenth!=10){
                           throw new Error(`Phone number "${phone_no}" is no longer than the maximum allowed length (10)`);  
                         }
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length;
                         if(plenth==0){
                           throw new Error(`Phone Number is required`);  
                         }
                        }
                    }), 
                    check("phone_no", "")
                    .custom(async(phone_no, { req }) => {
                        if (phone_no) {
                        return userDatalayers.findbyField({ phone_no })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`Phone number "${phone_no}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length; 
                         if(plenth!=10){
                           throw new Error(`Phone number "${phone_no}" is no longer than the maximum allowed length (10)`);  
                         }
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length;
                         if(plenth==0){
                           throw new Error(`Phone Number is required`);  
                         }
                        }
                    }),  
                    check("user.email", " ")
                    .custom(async(email, { req }) => {
                        if (email) {
                            return userDatalayers.findbyField({ email })
                                .then((result) => {
                                    if (result.length > 0) {
                                        throw new Error(`Email "${email}" is already exists`);
                                    } else {
                                        return true;
                                    }
                                });
                        }
                    }),
                    check("email", " ")
                    .custom(async(email, { req }) => {
                        if (email) {
                            return userDatalayers.findbyField({ email })
                                .then((result) => {
                                    if (result.length > 0) {
                                        throw new Error(`Email "${email}" is already exists`);
                                    } else {
                                        return true;
                                    }
                                });
                        }
                    }),
                    check("user.role_type", "").custom(async(role_type, { req }) => {
                        if (role_type) {
                         var plenth = role_type.length;
                         if(plenth==0){
                           throw new Error(`User role is required`);  
                         }
                        }
                    })
                ];
                break;
            }
        case "update_user":
            {    
                return [
                    check("phone_no", "")
                    .custom(async(phone_no, { req }) => {
                        if (phone_no) {
                        return userDatalayers.findbyField({ _id: { $ne: mongodb.Types.ObjectId(req.body._id) }, phone_no: phone_no })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`Phone number "${phone_no}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length;
                         if(plenth!=10){
                           throw new Error(`Phone number "${phone_no}" is no longer than the maximum allowed length (10)`);  
                         }
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length;
                         if(plenth==0){
                           throw new Error(`Phone Number is required`);  
                         }
                        }
                    }), 
                    check("user.phone_no", "")
                    .custom(async(phone_no, { req }) => {
                        if (phone_no) {
                        return userDatalayers.findbyField({ _id: { $ne: mongodb.Types.ObjectId(req.body.user._id) }, phone_no: phone_no })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`Phone number "${phone_no}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length;
                         if(plenth!=10){
                           throw new Error(`Phone number "${phone_no}" is no longer than the maximum allowed length (10)`);  
                         }
                        }
                    }).custom(async(phone_no, { req }) => {
                        if (phone_no) {
                         var plenth = phone_no.length;
                         if(plenth==0){
                           throw new Error(`Phone Number is required`);  
                         }
                        }
                    }), 
                    check("user.email", " ")
                    .custom(async(email, { req }) => {
                        if (email) {
                            return userDatalayers.findbyField({ _id: { $ne: mongodb.Types.ObjectId(req.body.user._id) }, email: email })
                                .then((result) => {
                                    if (result.length > 0) {
                                        throw new Error(`Email "${email}" is already exists`);
                                    } else {
                                        return true;
                                    }
                                });
                        }
                    }),
                    check("email", " ")
                    .custom(async(email, { req }) => {
                        if (email) {
                            return userDatalayers.findbyField({ _id: { $ne: mongodb.Types.ObjectId(req.body._id) }, email: email })
                                .then((result) => {
                                    if (result.length > 0) {
                                        throw new Error(`Email "${email}" is already exists`);
                                    } else {
                                        return true;
                                    }
                                });
                        }
                    }),
                    check("user.role_type", "").custom(async(role_type, { req }) => {
                        if (role_type) {
                         var plenth = role_type.length;
                         if(plenth==0){
                           throw new Error(`User role is required`);  
                         }
                        }
                    })
                ];
                break;
            }
    }
};
 

exports.FavProduct = async(request, response, next) => {
    
    let params = {skip: 0, limit: 20 };
    if(request.query.start){   
        params.skip = parseInt(request.query.start);
        params.limit = 20;
    } 
    var userType = parseInt(request.query.user_type);
    const areaId = mongodb.Types.ObjectId(request.params.areaId);

    var fruser = await franchiseDatalayers.getFranchiseOfArea(areaId);

    if (fruser != null && fruser.length > 0) {
        franchiseId = fruser[0].franchiseId;
        franchiseId = mongodb.Types.ObjectId(franchiseId); 

        if (MObjectId.isValid(request.params.userId)) {
            var userId = mongodb.Types.ObjectId(request.params.userId)
            var where = { user_id: userId }
     
            userDatalayers.finduserFavProduct(where, params, franchiseId, userType)
                .then((wishlistData) => { 
                    if (wishlistData !== null && typeof wishlistData !== "undefined" && wishlistData.length > 0) {
                        response.json({
                            sucess: errorCodes.SUCEESS,
                            msg: "",
                            data: wishlistData
                        });
                    } else {
                        response.json({
                            error: errorCodes.RESOURCE_NOT_FOUND,
                            msg: "No record found.",
                            error: error,
                        });
                    }
                })
                .catch(function(error) {
                    response.json({
                        error: errorCodes.RESOURCE_NOT_FOUND,
                        msg: "No record found.",
                        error: error,
                    });
                });
        } else {
            response.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Invalid ObjectId",
                error: "Invalid ObjectId"
            })
        }
    } else {
        response.json({
            err: errorCodes.RESOURCE_NOT_FOUND,
            msg: "Record not updated. Try again.",
            data: ""
        });
    }
};


exports.Addfavproduct = async(request, response, next) => {
    // this function only works if body receives flag for default_address
    const body = request.body // request.params
    const type = body.type 

    var criteria = {
        user_id: mongodb.Types.ObjectId(body.user_id),
        product_id: mongodb.Types.ObjectId(body.product_id)
    };  

    const wishlistData = await userDatalayers.getuserFavProduct(criteria);

    if (wishlistData !== null && typeof wishlistData !== "undefined" && wishlistData.length > 0) {            
        if(parseInt(type) == 0){
           deletelog = userDatalayers.deleteFavProduct(criteria);
           response.json({
                sucess: errorCodes.SUCEESS,
                msg: "Product remove from your favorite list",
                data: []
            }); 
        }else{
            response.json({
                error: errorCodes.SYNTAX_ERROR,
                msg: "Product is allready added in your wishlist",
                error: true
            }); 
        }
    }else{
        
        userDatalayers.createFavProduct(body)
        .then((logData) => {
            response.json({
                sucess: errorCodes.SUCEESS,
                msg: "Add product to favorite list",
                data: []
            }); 
        }).catch(function(error) { 
            response.json({
                error: errorCodes.SYNTAX_ERROR,
                msg: error,
                error: error,
            }); 
        })
    }

     
};
