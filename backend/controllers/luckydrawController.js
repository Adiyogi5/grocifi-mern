const fs = require("fs");
const moment = require("moment");
const mongoose = require("mongoose");
const mongodb = require('mongodb')
const luckydrawDatalayers = require("../datalayers/luckydrawDatalayers");
const errorCodes = require("../helpers/error_codes/errorCodes");
const catsDatalayers = require("../datalayers/catagoryDatalayers");
const productDatalayers = require('../datalayers/productsDatalayer');
const franchiseDatalayers = require("../datalayers/franchiseDatalayer");
const franchiseProductDatalayers = require('../datalayers/franchiseproductsDatalayer');
const notify = require("../controllers/notificationController");

exports.getAllLuckydraws = async(req, res) => {
    let where = {};  
    let _and = [];
    if(req.query.franchise_id){
        _and.push({franchise_id: mongodb.ObjectId(req.query.franchise_id)});
        where1 = {franchise_id: mongodb.ObjectId(req.query.franchise_id)};  
    } 
    var total = await luckydrawDatalayers.gettotalluckydraw(where1); 
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
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }, {
                    "franchiseName": {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }],
                "$and": [where1]
            };  
    }
    
    //console.log(where);
    var filtered = await luckydrawDatalayers.gettotalluckydraw(where);
    luckydrawDatalayers.getAllluckydraws(where, params)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
                total: total,
                filtered: filtered,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not Get. Try again.",
                error: err,
            });
        });
};

exports.status = async(req, res) => {
    luckydrawDatalayers.status(mongoose.Types.ObjectId(req.body._id), req.body.is_active)
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

exports.saveOfferImg = async(req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/offer_banners/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.deleteOfferImg = async(req, res) => {
    fs.unlinkSync(__dirname + "/../public/uploads/offer_banners/" + req.body.imgname)
    res.json({
        sucess: errorCodes.SUCEESS
    });
};

exports.createOffers = async(req, res) => {
    var param = req.body;

    param.offer_img = param.offerimg; 

    delete param.offerimg;
    luckydrawDatalayers.saveOffer(param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error,
            });
        });
};

exports.editOffers = async(req, res) => {
    if (req.method == "GET") {
        var offerId = mongoose.Types.ObjectId(req.params.offerId);
        luckydrawDatalayers.getOfferById(offerId)
            .then((doc) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    err: errorCodes.BAD_REQUEST,
                    msg: "Record not saved. Try again.",
                    error: err,
                });
            });
    } else {
        var _id = mongoose.Types.ObjectId(req.body._id);
        var param = req.body;
        param.offer_img = param.offerimg;
        delete param._id;
        delete param.offerimg;
        ///console.log(_id);
        luckydrawDatalayers.edit(_id, param)
            .then((doc) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    err: errorCodes.BAD_REQUEST,
                    msg: "Record not saved. Try again.",
                    error: err,
                });
            });
    }
};
 

exports.getOfferById = async(req, res) => {
    luckydrawDatalayers.getOfferById(mongoose.Types.ObjectId(req.params.offerId))
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not Get. Try again.",
                error: err,
            });
        });
};

exports.getOfferDetailById = async(req, res) => {
    luckydrawDatalayers.getOfferDetailById(mongoose.Types.ObjectId(req.params.offerId))
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not Get. Try again.",
                error: err,
            });
        });
};

exports.getProductsOfOffer = async(req, res) => {
    var luckydraw_id = mongoose.Types.ObjectId(req.params.offerId);
    var productids = [];
    luckydrawDatalayers.getAllOffersChild({ luckydraw_id: luckydraw_id })
        .then((doc) => {
            if (doc.length > 0) {
                doc.forEach((ele, index) => {
                    productids.push(ele.product_id);
                });
            } 
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: productids
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error,
            });
        });
};


exports.getParticateUsers = async(req, res) => {
    var luckydraw_id = mongoose.Types.ObjectId(req.params.offerId);
    var productids = [];
    luckydrawDatalayers.getParticateUsers({ luckydraw_id: luckydraw_id })
        .then((doc) => {  
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error,
            });
        });
};


exports.offerChildSave = async(req, res) => {
    var createdDate = new Date();
    createdDate = moment(createdDate).add(5, "hours");
    createdDate = moment(createdDate).add(30, "minutes");

    var param = {
        luckydraw_id: mongoose.Types.ObjectId(req.body.offer_id),
        product_id: mongoose.Types.ObjectId(req.body.product_id),
        createdby: req.body.createdby,
        modifiedby: req.body.modifiedby,
        created: createdDate,
        modified: createdDate
    };

    luckydrawDatalayers.saveOfferChild(param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.removeOfferProduct = async(req, res) => {
    var luckydraw_id = mongoose.Types.ObjectId(req.body.offer_id);
    var product_id = mongoose.Types.ObjectId(req.body.product_id);

    luckydrawDatalayers.removeOfferProduct(luckydraw_id, product_id)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not Deleted. Try again.",
                error: err,
            });
        });
};


exports.generateOfferwinner = async(req, res) => {
    var id = mongoose.Types.ObjectId(req.body.offer_id);
    var param = { luckydraw_id: id }
    luckydrawoffer = await luckydrawDatalayers.getOfferById(id);
    luckydrawparticate = await luckydrawDatalayers.getParticateUsers(param);
    var offerwinner = luckydrawoffer.offer_winner;
    var userIdsArr = [];
    if (luckydrawparticate.length > 0) {
        luckydrawparticate.forEach(ele => {
            userIdsArr.push(mongoose.Types.ObjectId(ele._id));
        });
    } 
    var newuserIds = [];
    for (var i = 0; i < offerwinner; i++) {
      var idx = Math.floor(Math.random() * userIdsArr.length);
      newuserIds.push(userIdsArr[idx]);
      userIdsArr.splice(idx, 1);
    }  

    luckydrawDatalayers.generateOfferwinner(id, newuserIds)
        .then((doc) => {   
            if (luckydrawparticate.length > 0) {
                luckydrawparticate.forEach(ele => {  
                    if(userIdsArr.indexOf(ele._id) === -1){ 
                        let notifyToUser = [];
                        notifyToUser.push(ele.user_id); 
                        let mTitle = "lucky draw offer";
                        mBody = `Dear ${ele.user_name}, Your coupon:"${ele.coupon}" has won the lucky draw offer.`;
                        notify.notify(notifyToUser, mTitle, mBody);
                    }
                });
            } 
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: "",
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not Deleted. Try again.",
                error: err,
            });
        });
};


exports.getOffers = async(req, res) => {
    var area_id = req.params.areaId;
    var is_active = (req.params.is_active) ? req.params.is_active : "1";
    var offer = "";
    var frArea = "";
    var franchise_id = "";
    try {
        frArea = await franchiseDatalayers.getFranchiseAreaOnCondition({ areaId: mongoose.Types.ObjectId(area_id) });

        if (frArea.length > 0) {
            franchise_id = frArea[0].franchiseId;
            offer = await luckydrawDatalayers.getluckydraws(franchise_id, is_active);
        } else {
            throw "There is no Franchise Id as per given Area Id";
        }
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: "",
            data: offer,
        });
    } catch (error) {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: "Record not Get. Try again.",
            error: error,
        });
    }
};

exports.getluckydrawlist = async(req, res) => {
    let where = {};  
    let today = new Date();
    today = moment(today)
            .add(5, "hours")
            .add(30, "minutes")
            .format("YYYY-MM-DD");
    today = new Date(today);
    where = {
            "$and": [{ 
                "start_date": { $eq: today }
            },{
                "is_lock":0
            }] 
        };   
    try { 
        offer = await luckydrawDatalayers.getluckydrawlists(where);
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: "",
            data: offer,
        });
    } catch (error) {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: "Record not Get. Try again.",
            error: error,
        });
    }
};

exports.updateOffers = async(req, res) => { 
    console.log(req.body);
    var _id = mongoose.Types.ObjectId(req.body._id);
    var param = req.body;
    
    delete param._id; 
    luckydrawDatalayers.edit(_id, param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });

};

exports.listofProdcutsonOfferId = async(req, res) => {
    var luckydraw_id = mongoose.Types.ObjectId(req.params.offerId);
    var cond = { luckydraw_id: luckydraw_id }
    const mainArr = [];
    const areaFrIds = [];
    const productArr = [];
    const productIdArr = [];
    const catsubcatidArr = [];
    const frProductIdArr = [];

    var userType = parseInt(req.query.user_type);

    try {
        var x = await luckydrawDatalayers.getAllOffersChild(cond);
        if (!x[0]) {
            throw `No such Record Fetch From offers child table`;
        }
        var productIdsArr = [];
        if (x.length > 0) {
            x.forEach(ele => {
                productIdsArr.push(mongoose.Types.ObjectId(ele.product_id));
            });
        }

        var product_id = x[0].product_id;

        var catSubcatDetail = await franchiseProductDatalayers.getAllfrProductsOnCondition({ productId: { $in: productIdsArr } });

        var catId = catSubcatDetail[0].catId;

        if (catSubcatDetail.length > 0) {
            catSubcatDetail.forEach(ele => {
                catsubcatidArr.push(mongoose.Types.ObjectId(ele.catId));
            });
        }

        var z = await luckydrawDatalayers.getAPPAllOffers({ _id: luckydraw_id });
        var franchise_id = z[0].franchise_id;
        var a = await franchiseDatalayers.getFranchiseAreaOnCondition({ franchiseId: franchise_id })
        var areaId = a[0].areaId; 

        mainArr.push({ "mainCat": '' });

        mainArr.push({ "subcat": '' }); //Add Subcates in main array

        //get franchise works in that area
        const franchiseOfArea = await franchiseDatalayers.getFranchiseOfArea(areaId)
            .then((areaFr) => {
                if (areaFr.length > 0) {
                    areaFr.forEach((ele) => {
                        areaFrIds.push(mongoose.Types.ObjectId(ele.franchiseId));
                    })
                }
            })
            .catch((error) => {
                throw error;
            });
        //get franchise products on that category
        const franchiseProducts = await productDatalayers.franchiseProductsIds(areaFrIds, catsubcatidArr);

        if (franchiseProducts != null) {
            franchiseProducts.forEach((ele) => {
                frProductIdArr.push(mongoose.Types.ObjectId(ele._id));
                productIdArr.push(mongoose.Types.ObjectId(ele.productId));

                var max_order = 0;
                switch (ele.product_unit) {
                    case 1:
                        max_order = parseInt(ele.product_max_order) * 1000;
                        break;
                    case 3:
                        max_order = parseInt(ele.product_max_order) * 1000;
                        break;
                    default:
                        max_order = parseInt(ele.product_max_order);
                        break;
                }

                productArr.push({
                    productId: ele.productId,
                    title: ele.product.title,
                    frProductId: ele._id,
                    catId: ele.catId,
                    franchiseId: ele.franchiseId,
                    priority: (ele.priority) ? ele.priority : "",
                    isPacket: ele.isPacket,
                    product_max_order: ele.product_max_order,
                    product_quality: ele.product_quality,
                    product_unit: ele.product_unit,
                    max_order: max_order,
                    description: ele.product.description,
                    productImg: [],
                    productvar: []
                });
            });
        }

        if (productIdArr.length > 0) {
            await productDatalayers.getAllProductsImages(productIdArr)
                .then((imgs) => {
                    if (imgs != undefined && imgs != null && imgs.length > 0) {
                        for (let index = 0; index < productIdArr.length; index++) {
                            productArr[index]["productImg"] = imgs.filter((img) => {
                                return String(img.productId) == String(productArr[index].productId);
                            });
                        }
                    } else {
                        productArr[0]["productImg"] = [{ title: '', productId: '', isMain: false }]
                    }
                })
                .catch((error) => {
                    throw error;
                });

            await productDatalayers.getAllProductsVarient(productIdArr, '', '','', areaFrIds)
                .then((vars) => {
                    if (vars.length > 0) {
                        for (let index = 0; index < productIdArr.length; index++) {
                            if(userType==1){ vars[index].is_active = vars[index].is_ws_active; }
                            productArr[index]["productvar"] = vars.filter((pvar) => {
                                return String(pvar.productId) == String(productArr[index].productId);
                            });
                        }
                    }
                })
                .catch((error) => {
                    throw error;
                });
        }

        var NewproductArr = [];
        if (productArr.length > 0) {
            productArr.forEach((ele) => {
                var s1 = JSON.stringify(ele.productId);
                productIdsArr.forEach(eleIn => {
                    if (s1 == JSON.stringify(eleIn)) {
                        NewproductArr.push(ele);
                    }
                })
            })
        }
        mainArr.push({ "products": NewproductArr }); //Add products in main array      
        res.json({
            sucess: errorCodes.SUCEESS,
            msg: "",
            data: mainArr,
        }); 

    } catch (error) {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: "Record not fetched. Try again.",
            error: error,
        });
    }
};

/* 
exports.getOfferPriority = async(req, res) => {
    var fId = mongoose.Types.ObjectId(req.params.fId); //franchise id


    luckydrawDatalayers.getOfferPriority(fId)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc + 1,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error,
            });
        });
};

exports.createOffers = async(req, res) => {
    var param = req.body;

    param.offer_img = param.offerimg;

    // var start_date = await createDateString(param.start_date);
    // var expiry_date = await createDateString(param.expiry_date);

    // param.start_date = start_date;
    // param.expiry_date = expiry_date;

    delete param.offerimg;
    luckydrawDatalayers.saveOffer(param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error,
            });
        });
};



exports.statusall = async(req, res) => {
    var param = req.body;
    var idArr = req.body.offer_id;
    delete param.offer_id;
    if (param.expiry_date || param.start_date) {
        if (param.expiry_date) {
            param.expiry_date = await createDateString(param.expiry_date);
        } else {
            param.start_date = await createDateString(param.start_date);
        }
    }
    luckydrawDatalayers
        .editOnBasisArray(idArr, param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.deleteOffer = async(req, res) => {
    luckydrawDatalayers
        .hardDelete(req.params.id)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.deleteMultipleOffer = async(req, res) => {
    var idArrs = req.body.deleting_ids;
    luckydrawDatalayers
        .MultipleHardDelete(idArrs)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.logicalDelete = async(req, res) => {
    var idArrs = req.body.ids;
    var param = { is_active: "2" };
    luckydrawDatalayers
        .editOnBasisArray(idArrs, param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

var createDateString = async(date_string) => {
    date_string = moment(date_string, "DD-MM-YYYY")
        .add(1, "days")
        .subtract(3, "hours");
    return date_string;
};
 

exports.offerChildRemove = async(req, res) => {
    var param = {
        offer_id: mongoose.Types.ObjectId(req.body.offer_id),
        product_id: mongoose.Types.ObjectId(req.body.product_id)
    };

    luckydrawDatalayers.offerChildRemove(param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.offerChildEdit = async(req, res) => {
    var _id = req.body.offer_childId;
    delete req.body.offer_childId;
    luckydrawDatalayers
        .editOfferChild(_id, req.body)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.hardDeleteofferChild = async(req, res) => {
    var id = req.params.id;
    luckydrawDatalayers
        .hardDeleteOfferChild(id)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not Deleted. Try again.",
                error: err,
            });
        });
};

exports.offerChildstatusall = async(req, res) => {
    var param = req.body;
    var idArr = param.offerChild_id;
    delete param.offer_id;
    luckydrawDatalayers
        .editOnBasisArrayOfferChild(idArr, param)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

exports.deleteMultipleOfferChild = async(req, res) => {
    var idArrs = req.body.deleting_ids;
    luckydrawDatalayers
        .MultipleHardDelete_offerChild(idArrs)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: err,
            });
        });
};

*/