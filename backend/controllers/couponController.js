const fs = require("fs");
const moment = require('moment');
const mongodb = require('mongodb')
const errorCodes = require("../helpers/error_codes/errorCodes");
const couponDatalayer = require("../datalayers/couponDatalayer");
const orderDatalayer = require("../datalayers/orderDatalayer");
const { check, validationResult } = require("express-validator");
const { stringify } = require("querystring");

exports.getCoupons = async(req, res) => {
    let where = {}; 
    let where1 = {}; 
    let _and = [];
    if(req.query.franchise_id){
        _and.push({franchise_id: mongodb.ObjectId(req.query.franchise_id)});
        where1 = {franchise_id: mongodb.ObjectId(req.query.franchise_id)};
    } 
    var total = await couponDatalayer.gettotalcoupons(where1); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir); 
    } 
    if (_and.length > 0) {
        where = { $and: _and }
    } 
    if(req.query.where){ 
        where = {
           "$or": [{
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }, {
                    "franchiseName": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }, {
                    "userName": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }],
            "$and": [where1]
        };  
    } 

    var filtered = await couponDatalayer.gettotalcoupons(where);
    couponDatalayer.getCoupons(where, params)
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
                err: error,
            });
        });
}

exports.getCouponById = (req, res) => {
    couponDatalayer.getCouponById(mongodb.ObjectId(req.params.couponId))
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        })
        .catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error
            });
        });
};

exports.generateCoupon = async(req, res) => {
    let genCoupon = await generateCouponCode();

    res.json({
        sucess: errorCodes.SUCEESS,
        msg: "",
        data: genCoupon
    });
};

generateCouponCode = async() => {
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = 6; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    var data = await couponDatalayer.findbyField({ title: result })

    if (data.length > 0) {
        generateCouponCode();
    } else {
        return result;
    }


}

exports.saveCoupons = async(req, res) => {
    var param = req.body;
    if(param.end_date){
        param.end_date = new Date(param.end_date + "T23:59:59.000Z");
    }
    if (param.user_id == "null" || param.user_id == "") {
        delete param.user_id;
    }
    param.coupon = param.code_img;
    delete param.code_img;
    couponDatalayer.saveCoupons(param)
        .then((result) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch(error => {
            res.json({
                error: errorCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                err: error,
            });
        });
}

exports.edit = (req, res) => {
    if (req.method == "GET") {
        var id = mongodb.ObjectId(req.params.couponId)
        couponDatalayer.edit(id)
            .then((coupon) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: coupon
                });
            }).catch((error) => {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    } else {
         
        couponDatalayer.update(req.body)
            .then((coupon) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: coupon
                });
            }).catch((error) => {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    }
};

exports.updateUsesCount = (req, res) => {
    couponDatalayer.updateUsesCount(req.params.ccode, 1)
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        }).catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error
            });
        });
};

exports.getCouponOfFranchise = (req, res) => {
    couponDatalayer.findbyField({ franchise_id: mongodb.ObjectId(req.params.frId), is_active:"1" })
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        }).catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error
            });
        });
};

exports.getCouponOfUser = (req, res) => {
    couponDatalayer.findbyField({ user_id: mongodb.ObjectId(req.params.userId), is_active: "1" })
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        }).catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error
            });
        });
};

exports.checkForReuseByUser = (req, res) => {
    couponDatalayer.findbyField({ franchise_id: mongodb.ObjectId(req.params.frId), title: req.params.ccode, is_active: "1" })
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        }).catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error
            });
        });
};

exports.checkExpiry = (req, res) => {
    var ccode = req.params.ccode;
    var userId = mongodb.ObjectId(req.params.userId);
    var franchiseId = mongodb.ObjectId(req.params.frId);

    couponDatalayer.findbyField({
            is_active: 1,
            title: ccode,
            franchise_id: franchiseId
        })
        .then((couponData) => {

            if (couponData.length > 0) {
                couponData = couponData[0];

                if (couponData.user_id != null && couponData.user_id != userId) {
                    res.json({
                        sucess: errorCodes.RESOURCE_NOT_FOUND,
                        msg: "Coupon is not valid.",
                        data: { flag: false }
                    });
                    res.end();
                    return;
                }

                if (couponData.uses_number != 0 && couponData.uses_number == couponData.used_number) {
                    res.json({
                        sucess: errorCodes.FORBIDDEN,
                        msg: "This coupon has been reached its maximum uses.",
                        data: { flag: false }
                    });
                    res.end();
                    return;
                }
                
                let today = new Date();
                today = moment(today)
                        .add(5, "hours")
                        .add(30, "minutes")
                        .format("YYYY-MM-DD");
                today = new Date(today);

                if (couponData.has_expiry == true) { 
                    if(couponData.start_date > today){
                        res.json({
                            sucess: errorCodes.FORBIDDEN,
                            msg: "Coupon has not started yet.",
                            data: { flag: false }
                        });
                        res.end();
                        return;
                    }
                    if(couponData.end_date < today){
                        res.json({
                            sucess: errorCodes.FORBIDDEN,
                            msg: "Coupon has been expired.",
                            data: { flag: false }
                        });
                        res.end();
                        return;
                    }
                }

                if (couponData.reuse_by_same_user == true) {
                    res.json({
                        sucess: errorCodes.SUCEESS,
                        msg: "",
                        data: couponData
                    });
                } else {
                    orderDatalayer.findbyField({ userId: userId, promo_code: ccode })
                        .then((orders) => {
                            if (orders.length > 0) {
                                res.json({
                                    sucess: errorCodes.DATA_NOT_FOUND,
                                    msg: "This coupon has been used in previous order.",
                                    data: { flag: false }
                                });
                            } else {
                                res.json({
                                    sucess: errorCodes.SUCEESS,
                                    msg: "",
                                    data: couponData
                                });
                            }
                        })
                        .catch(err => {
                            res.json({
                                sucess: errorCodes.RESOURCE_NOT_FOUND,
                                msg: "Coupon is not valid.",
                                data: err
                            });
                        });
                }
            } else {
                res.json({
                    sucess: errorCodes.DATA_EXPIRED,
                    msg: "Coupon has been expired.",
                    data: { flag: false }
                });
            }

        }).catch((error) => {
            res.json({
                sucess: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again."
            });
        });
};

exports.getExpireCoupon = async(req, res) => {
    today = new Date(req.params.today);
    today = moment(today)
        .add(5, "hours")
        .add(30, "minutes")
        .format("YYYY-MM-DD");
    today = new Date(today + "T00:00:00.000Z");
    var todayEnd = moment(today).add(1, "days");
    todayEnd = new Date(todayEnd);
    let where = {};
    let where1 = {};  
    let _and = [];
    
    _and.push( {end_date: { $gte: today, $lt: todayEnd } }); 

    if(req.query.franchise_id){
        _and.push({franchise_id: mongodb.ObjectId(req.query.franchise_id)});
    }
    if (_and.length > 0) {
        where = { $and: _and }
        where1 = { $and: _and }
    }
    var total = await couponDatalayer.gettotalcoupons(where); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir); 
    } 
    if(req.query.where){  
         where = {
           "$or": [{
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }, {
                    "franchiseName": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }, {
                    "userName": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }],
            "$and": [where1]
        };     
    }
    ///console.log(where);
    var filtered = await couponDatalayer.gettotalcoupons(where);

    couponDatalayer.getExpireCoupon(where, params)
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon,
                total: total,
                filtered: filtered,
            });
        }).catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error
            });
        });
};

exports.setExpireCoupon = (req, res) => {
    var franchise_id = 0;
    if(req.body.franchise_id){
        var franchise_id = mongodb.ObjectId(req.body.franchise_id);
    }
    var date = req.body.given_date;
    
    couponDatalayer.setExpireCoupon(date, franchise_id)
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        }).catch((error) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                error: error
            });
        });
};


exports.status = (req, res) => {
    couponDatalayer.status(mongodb.ObjectId(req.body._id), req.body.is_active)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.statusAll = async(req, res) => {
    const is_active = { "is_active": req.body.is_active };
    const idArr = [];

    if (req.body.couponIds && req.body.couponIds.length > 0) {
        req.body.couponIds.forEach(_id => {
            idArr.push(mongodb.Types.ObjectId(_id));
        });
    } else {
        return false;
    }

    couponDatalayer.statusAll(idArr, is_active)
        .then((coupon) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: coupon
            });
        }).catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        })
};

exports.delete = (req, res) => {
    couponDatalayer.delete(req.params.couponId)
        .then((flag) => {
            if (flag) {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: ""
                });
            } else {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found."
                });
            }
        }).catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.saveCouponImg = async(req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/offer_banners/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.deleteCouponImg = async(req, res) => {
    fs.unlinkSync(__dirname + "/../public/uploads/offer_banners/" + req.body.imgname)
    res.json({
        sucess: errorCodes.SUCEESS
    });
};