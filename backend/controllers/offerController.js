const fs = require("fs");
const moment = require("moment");
const mongoose = require("mongoose");
const mongodb = require('mongodb')
const offerDatalayers = require("../datalayers/offerDatalayers");
const errorCodes = require("../helpers/error_codes/errorCodes");
const catsDatalayers = require("../datalayers/catagoryDatalayers");
const productDatalayers = require('../datalayers/productsDatalayer');
const franchiseDatalayers = require("../datalayers/franchiseDatalayer");
const franchiseProductDatalayers = require('../datalayers/franchiseproductsDatalayer');
const productsDatalayers = require('../datalayers/productsDatalayer');

exports.getAllOffers = async (req, res) => {
    let where = {};
    let _and = [];
    if (req.query.franchise_id) {
        _and.push({ franchise_id: mongodb.ObjectId(req.query.franchise_id) });
        where1 = { franchise_id: mongodb.ObjectId(req.query.franchise_id) };
    }
    var total = await offerDatalayers.gettotaloffer(where1);
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        ///params.dir = parseInt(req.query.dir); 
        if (req.query.dir == 1) {
            params.dir = 1;
        } else {
            params.dir = -1;
        }
    }
    if (_and.length > 0) {
        where = { $and: _and }
    }
    if (req.query.where) {
        where = {
            "$or": [{
                "title": { $regex: new RegExp('^' + req.query.where + '', 'i') }
            }, {
                "franchiseName": { $regex: new RegExp('^' + req.query.where + '', 'i') }
            }],
            "$and": [where1]
        };
    }

    //console.log(where);
    var filtered = await offerDatalayers.gettotaloffer(where);
    offerDatalayers.getAllOffers(where, params)
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

exports.getOffers = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {
        var area_id = req.params.areaId;
        var is_active = (req.params.is_active) ? req.params.is_active : "1";
        var offer = "";
        var frArea = "";
        var franchise_id = "";
        try {
            frArea = await franchiseDatalayers.getFranchiseAreaOnCondition({ areaId: mongodb.ObjectId(area_id) });
            if (frArea.length > 0) {
                franchise_id = frArea[0].franchiseId;
                offer = await offerDatalayers.getOffers(franchise_id, is_active);
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
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};

exports.getOfferById = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.offerId)) {
        offerDatalayers.getOfferById(mongodb.ObjectId(req.params.offerId))
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
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};

exports.getOfferDetailById = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.offerId)) {
        offerDatalayers.getOfferDetailById(mongodb.ObjectId(req.params.offerId))
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
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};


exports.saveOfferImg = async (req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/offer_banners/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.deleteOfferImg = async (req, res) => {
    fs.unlinkSync(__dirname + "/../public/uploads/offer_banners/" + req.body.imgname)
    res.json({
        sucess: errorCodes.SUCEESS
    });
};



exports.getOfferPriority = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        var fId = mongoose.Types.ObjectId(req.params.fId); //franchise id

        offerDatalayers.getOfferPriority(fId)
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
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};

exports.createOffers = async (req, res) => {
    var param = req.body;

    param.offer_img = param.offerimg;

    // var start_date = await createDateString(param.start_date);
    // var expiry_date = await createDateString(param.expiry_date);

    // param.start_date = start_date;
    // param.expiry_date = expiry_date;

    delete param.offerimg;
    offerDatalayers.saveOffer(param)
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

exports.getProductsOfOffer = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.offerId)) {
        var offerId = mongoose.Types.ObjectId(req.params.offerId);
        var productids = [];
        offerDatalayers.getAllOffersChild({ offer_id: offerId })
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
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};

exports.editOffers = async (req, res) => {
    if (req.method == "GET") {
        var offerId = mongoose.Types.ObjectId(req.params.offerId);
        offerDatalayers.getOfferById(offerId)
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

        offerDatalayers.edit(_id, param)
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

exports.status = async (req, res) => {
    offerDatalayers.status(mongoose.Types.ObjectId(req.body._id), req.body.is_active)
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

exports.statusall = async (req, res) => {
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
    offerDatalayers
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

exports.deleteOffer = async (req, res) => {
    offerDatalayers
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

exports.deleteMultipleOffer = async (req, res) => {
    var idArrs = req.body.deleting_ids;
    offerDatalayers
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

exports.logicalDelete = async (req, res) => {
    var idArrs = req.body.ids;
    var param = { is_active: "2" };
    offerDatalayers
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

var createDateString = async (date_string) => {
    date_string = moment(date_string, "DD-MM-YYYY")
        .add(1, "days")
        .subtract(3, "hours");
    return date_string;
};

exports.offerChildSave = async (req, res) => {
    var createdDate = new Date();
    createdDate = moment(createdDate).add(5, "hours");
    createdDate = moment(createdDate).add(30, "minutes");

    var param = {
        offer_id: mongoose.Types.ObjectId(req.body.offer_id),
        product_id: mongoose.Types.ObjectId(req.body.product_id),
        createdby: req.body.createdby,
        modifiedby: req.body.modifiedby,
        created: createdDate,
        modified: createdDate
    };

    offerDatalayers.saveOfferChild(param)
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

exports.removeOfferProduct = async (req, res) => {
    var offer_id = mongoose.Types.ObjectId(req.body.offer_id);
    var product_id = mongoose.Types.ObjectId(req.body.product_id);

    offerDatalayers.removeOfferProduct(offer_id, product_id)
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

exports.offerChildRemove = async (req, res) => {
    var param = {
        offer_id: mongoose.Types.ObjectId(req.body.offer_id),
        product_id: mongoose.Types.ObjectId(req.body.product_id)
    };

    offerDatalayers.offerChildRemove(param)
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

exports.offerChildEdit = async (req, res) => {
    var _id = req.body.offer_childId;
    delete req.body.offer_childId;
    offerDatalayers
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

exports.hardDeleteofferChild = async (req, res) => {
    var id = req.params.id;
    offerDatalayers
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

exports.offerChildstatusall = async (req, res) => {
    var param = req.body;
    var idArr = param.offerChild_id;
    delete param.offer_id;
    offerDatalayers
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

exports.deleteMultipleOfferChild = async (req, res) => {
    var idArrs = req.body.deleting_ids;
    offerDatalayers
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

exports.listofProdcutsonOfferId = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.offerId)) {
        var offer_id = mongoose.Types.ObjectId(req.params.offerId);
        var cond = { offer_id };
        const mainArr = [];
        const areaFrIds = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];

        var userType = parseInt(req.query.user_type);

        try {
            var x = await offerDatalayers.getAllOffersChild(cond);
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

            var z = await offerDatalayers.getAPPAllOffers({ _id: offer_id });
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

                await productDatalayers.getAllProductsVarient(productIdArr, '', '', '', areaFrIds)
                    .then((vars) => {
                        if (vars.length > 0) {
                            for (let index = 0; index < productIdArr.length; index++) {
                                if (userType == 1) { vars[index].is_active = vars[index].is_ws_active; }
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
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};



exports.listOfferProdcut = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.offerId)) {

        const offerId = mongodb.ObjectId(req.params.offerId);
        var fruser = await offerDatalayers.getAPPAllOffers({ _id: offerId });

        var catIdArr = [];
        var frcats = "";
        var products = "";
        var franchiseId = "";
        ///var fruser = await franchiseDatalayers.getFranchiseOfArea(areaId);
        let mainArr = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];

        var userType = parseInt(req.query.user_type);
        let params = { skip: 0, limit: 20, order: "product.title", dir: 1 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = 20;
        }
        if (req.query.nameSort) {
            params.order = "product.title";
            if (req.query.nameSort == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }
        if (req.query.priceSort) {
            params.order = "product.productvar.price";
            if (req.query.priceSort == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }

        if (fruser != null && fruser.length > 0) {
            franchiseId = fruser[0].franchise_id;
            franchiseId = mongodb.ObjectId(franchiseId);

            if (userType == 0) {
                where = {
                    "product.productvar.is_active": "1",
                    offer_id: offerId
                };
            } else if (userType == 1) {
                where = {
                    "product.productvar.is_ws_active": "1",
                    offer_id: offerId
                };
            }

            if (req.query.where) {
                if (userType == 0) {
                    where = {
                        "$or": [
                            {
                                "product.title": new RegExp('' + req.query.where + '', 'i')
                            }],
                        "$and": [{ offer_id: offerId, "product.productvar.is_active": "1" }]
                    };
                } else if (userType == 1) {
                    where = {
                        "$or": [
                            {
                                "product.title": new RegExp('' + req.query.where + '', 'i')
                            }],
                        "$and": [{ offer_id: offerId, "product.productvar.is_ws_active": "1" }]
                    };
                }
            }

            const franchiseProducts = await productsDatalayers.OfferfranchiseProductsList(where, params, franchiseId, userType);

            res.json({
                sucess: errorCodes.SUCCESS,
                data: franchiseProducts
            });

        } else {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                data: ""
            });
        }
    } else {
        res.json({
            err: errorCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

