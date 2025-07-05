const fs = require("fs");
const mongodb = require('mongodb')
const ObjectId = require('mongoose').Types.ObjectId;
const productModel = require("../modules/Products");
const catagoryDatalayer = require("../datalayers/catagoryDatalayers");
const errorsCodes = require("../helpers/error_codes/errorCodes");
const productsDatalayers = require("../datalayers/productsDatalayer");
const { check, validationResult, body } = require("express-validator");
const franchiseDatalayers = require("../datalayers/franchiseDatalayer");
const frproductsDatalayers = require("../datalayers/franchiseproductsDatalayer");
const franchiseproductModel = require("../modules/FrProducts");
const frproductvariantsModel = require("../modules/FrProductVariants");
 

exports.getAllProducts = async(req, res) => {
    let where = {};
    var total = await productsDatalayers.gettotalProduct(where);
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    } else {
        where = req.query;
    }
    ///console.log(req.query.where);
    if (req.query.where) {
        where = {
            "$or": [{
                "title": {$regex: new RegExp('^' + req.query.where + '', 'i')}
            }, {
                "catName": {$regex: new RegExp('^' + req.query.where + '', 'i')}
            }]
        };
    }
    ///console.log(where);
    var filtered = await productsDatalayers.gettotalProduct(where);
    productsDatalayers.getAllProducts(where, params)
        .then((product) => { 
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product,
                total: total,
                filtered: filtered,
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record(s) not found.",
                error: error
            });
        });
};

exports.save = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var param = req.body;
        var files = "";

        if (param._imgs != undefined && param._imgs != "") {
            files = param._imgs;
        }

        productsDatalayers.save(param, files)
            .then((area) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: area
                })
            })
            .catch((err) => {
                res.json({
                    err: errorsCodes.BAD_REQUEST,
                    msg: "",
                    error: err
                });
            });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: errors,
        });
    }
};

exports.uploadimg = async(req, res) => {
    var imgName = [];
    req.files.forEach((img, index) => {
        var srcPath = __dirname + "/../public/uploads/temp/" + img.filename;
        var destPath = __dirname + "/../public/uploads/product_img/" + img.filename;
        fs.renameSync(srcPath, destPath);
        imgName[index] = img.filename;
    });

    res.json({
        sucess: errorsCodes.SUCEESS,
        name: imgName.join(",")
    });
}

exports.edit = (req, res) => {
    if (req.method == "GET") {
        productsDatalayers.edit(mongodb.ObjectId(req.params.productId))
            .then((product) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product
                });
            }).catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    } else {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            var param = req.body;
            var files = "";

            if (req.files != undefined) {
                files = req.files;
            } else if (param._imgs != undefined && param._imgs != "") {
                files = param._imgs;
            }
            productsDatalayers.update(param, files)
                .then((product) => {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: "",
                        data: product
                    });
                }).catch((error) => {
                    res.json({
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Record not updated. Try again.",
                        error: error
                    });
                });
        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: errors,
            });
        }
    }
};

exports.status = (req, res) => {
    productsDatalayers.status(req.body._id, req.body.is_active)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};


exports.updateDefaultImage = (req, res) => {
    productsDatalayers.updateDefaultImage(mongodb.ObjectId(req.body._id), mongodb.ObjectId(req.body.pid))
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.deleteImage = (req, res) => {
    productsDatalayers.deleteImage(mongodb.ObjectId(req.body._id))
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.statusAll = (req, res) => {
    const is_active = { "is_active": req.body.is_active };
    const idArr = [];

    if (req.body.productIds && req.body.productIds.length > 0) {
        req.body.productIds.forEach(_id => {
            idArr.push(mongodb.ObjectId(_id));
        });
    } else {
        return false;
    }

    productsDatalayers.statusAll(idArr, is_active)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.delete = (req, res) => {
    productsDatalayers.delete(req.params.productId)
        .then((flag) => {
            if (flag) {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: ""
                });
            } else {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found."
                });
            }
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.updateFranchiseProductPriority = (req, res) => {
    var id = mongodb.ObjectId(req.body.id);
    var priority = req.body.priority;
    frproductsDatalayers.updateFranchiseProductPriority(id, priority)
        .then((flag) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: flag
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
}



//-------------------------------Get all products of franchise
exports.getAllfrProducts = async(req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        if (!req.params.fId || req.params.fId == undefined) {
            responseObj.err = errorCodes.REQUIRED_PARAMETER_MISSING;
            responseObj.message = language.getMessage("REQUIRED_PARAMETER_MISING");
            responseObj.data = {};
            response.send(responseObj);
            return;
        }
        let where = { franchiseId: mongodb.ObjectId(req.params.fId) };
        var total = await frproductsDatalayers.gettotalfrproducts(where);
        let params = { skip: 0, limit: 0 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
            params.order = req.query.order;
            params.dir = parseInt(req.query.dir);
        }
        if (req.query.where) {
            where = {
                "$or": [{
                    "product.title": new RegExp('' + req.query.where + '', 'i')
                }],
                "$and": [{ franchiseId: mongodb.ObjectId(req.params.fId) }]
            };
        }
       
        var filtered = await frproductsDatalayers.gettotalfrproducts(where);
        ///console.log(params);

        frproductsDatalayers.getAllfrProducts(where, params)
            .then((product) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product,
                    total: total,
                    filtered: filtered,
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    error: error
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};
//getFranchiseProductByVarId
exports.getFranchiseProductInAdmin = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        if (!req.params.fId || req.params.fId == undefined) {
            responseObj.err = errorCodes.REQUIRED_PARAMETER_MISSING;
            responseObj.message = language.getMessage("REQUIRED_PARAMETER_MISING");
            responseObj.data = {};
            response.send(responseObj);
            return;
        }
        let params = { skip: 0, limit: 0 };
        var productsArr = [];
        frproductsDatalayers.getAllfrProducts({ franchiseId: mongodb.ObjectId(req.params.fId) }, params)
            .then((product) => {
                if (product.length > 0) {
                    product.forEach((eleP, index) => {
                        if (eleP.product.is_active == "1") {
                            var pImg = "noimage.png";
                            var pName = eleP.product.title;
                            var priority = eleP.priority;

                            var product_unit = (eleP.product_unit) ? (eleP.product_unit) : 0;
                            var product_max_order = (eleP.product_max_order) ? (eleP.product_max_order) : 0;

                            if (eleP.pimgs.length > 0) {
                                eleP.pimgs.forEach((eleI) => {
                                    pImg = eleI.title;
                                })
                            }

                            if (eleP.productvariants.length > 0) {
                                eleP.productvariants.forEach((eleV) => {
                                    var t = eleV;
                                    t.pImg = pImg;
                                    t.pName = pName;
                                    t.priority = priority;
                                    t.product_max_order = product_max_order;
                                    t.product_unit = product_unit;

                                    var its_unit = 0;
                                    var max_order = 0;
                                    switch (product_unit) {
                                        case 1: //if unit in KG
                                            if (eleV.unit == 1) { //change to grams
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            }
                                            if (eleV.unit == 2) { //don't change to grams
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            }
                                            max_order = (product_max_order) ? (parseInt(product_max_order) * 1000) : 0;
                                            break;

                                        case 2: //if unit in GRAMS
                                            if (eleV.unit == 1) { //change to grams
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            }
                                            if (eleV.unit == 2) { //don't change to grams
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            }
                                            max_order = (product_max_order) ? (parseInt(product_max_order)) : 0;
                                            break;

                                        case 3: //if unit in LITER
                                            if (eleV.unit == 3) { //change to ml
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            }
                                            if (eleV.unit == 4) { // don't change to ml
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            }
                                            max_order = (product_max_order) ? (parseInt(product_max_order) * 1000) : 0;
                                            break;
                                        case 4: //if unit in ML
                                            if (eleV.unit == 3) { //change to ml
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            }
                                            if (eleV.unit == 4) { // don't change to ml
                                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            }
                                            max_order = (product_max_order) ? (parseInt(product_max_order)) : 0;
                                            break;
                                        default:
                                            its_unit = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                                            max_order = (product_max_order) ? parseInt(product_max_order) : 0;
                                            break;
                                    }

                                    t.its_unit = its_unit;
                                    t.its_max_order = max_order;
                                    productsArr.push(t);
                                });
                            }
                        }
                    });
                }

                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: productsArr
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    error: error
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};

exports.getFranchiseProductByVarId = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.varId)) {
    var productsArr = [];
    frproductsDatalayers.getFranchiseProductByVarId(mongodb.ObjectId(req.params.varId))
        .then((product) => {
            var frp = {};
            if (product.length > 0) {
                var eleV = product[0];
                var frProduct = eleV.frproduct[0];

                frp.frproduct_id = frProduct._id;
                var product_unit = (frProduct.product_unit) ? (frProduct.product_unit) : 0;
                var product_max_order = (frProduct.product_max_order) ? (frProduct.product_max_order) : 0;

                var its_unit = 0;
                var max_order = 0;
                switch (product_unit) {
                    case 1: //if unit in KG
                        if (eleV.unit == 1) { //change to grams
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                        }
                        if (eleV.unit == 2) { //don't change to grams
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                        }
                        max_order = (product_max_order) ? (parseInt(product_max_order) * 1000) : 0;
                        break;

                    case 2: //if unit in GRAMS
                        if (eleV.unit == 1) { //change to grams
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                        }
                        if (eleV.unit == 2) { //don't change to grams
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                        }
                        max_order = (product_max_order) ? (parseInt(product_max_order)) : 0;
                        break;

                    case 3: //if unit in LITER
                        if (eleV.unit == 3) { //change to ml
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                        }
                        if (eleV.unit == 4) { // don't change to ml
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                        }
                        max_order = (product_max_order) ? (parseInt(product_max_order) * 1000) : 0;
                        break;
                    case 4: //if unit in ML
                        if (eleV.unit == 3) { //change to ml
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                        }
                        if (eleV.unit == 4) { // don't change to ml
                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                        }
                        max_order = (product_max_order) ? (parseInt(product_max_order)) : 0;
                        break;
                    default:
                        its_unit = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                        max_order = (product_max_order) ? parseInt(product_max_order) : 0;
                        break;
                }

                frp.its_unit = its_unit;
                frp.its_max_order = max_order;
            }
            console.log(frp);
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: frp
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record(s) not found.",
                error: error
            });
        });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};

exports.getProductsOfFranchise = async(req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        var product = await frproductsDatalayers.getfranchiseProduct(mongodb.ObjectId(req.params.fId));
        if (product.length > 0) {
            product = product.filter((pro) => {
                return (pro.product.length > 0);
            });

            product.forEach((ele, index) => {
                product[index].pname = ele.product[0].title;
                ele.pimgs.forEach((eleIn, indexIn) => {
                    if (eleIn.isMain) {
                        product[index].img = eleIn.title
                    }
                });
            });

        } else {
            product = "";
        }
        //console.log(product);
        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            data: product
        });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }  
};

exports.getlistedproductsbycats = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.cId)) {
        if (!req.params.cId || req.params.cId == undefined) {
            responseObj.err = errorCodes.REQUIRED_PARAMETER_MISSING;
            responseObj.message = language.getMessage("REQUIRED_PARAMETER_MISING");
            responseObj.data = {};
            response.send(responseObj);
            return;
        } 
       // var isglobal = false;
        if(req.params.isglobal==1){
            var isglobal = true;
        }
        productsDatalayers.getProductsByCats(mongodb.ObjectId(req.params.cId), isglobal)
            .then((product) => { 
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    error: error
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};

exports.getproductsbycats = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.cId)) {
        if (!req.params.cId || req.params.cId == undefined) {
            responseObj.err = errorCodes.REQUIRED_PARAMETER_MISSING;
            responseObj.message = language.getMessage("REQUIRED_PARAMETER_MISING");
            responseObj.data = {};
            response.send(responseObj);
            return;
        }

        productsDatalayers.getProductsByCats(mongodb.ObjectId(req.params.cId))
            .then((product) => { 
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    error: error
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};

exports.getfrProductsByCats = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId) && mongodb.ObjectID.isValid(req.params.cId) ) {
        if (!req.params.fId || req.params.fId == undefined && !req.params.cId || req.params.cId == undefined) {
            responseObj.err = errorCodes.REQUIRED_PARAMETER_MISSING;
            responseObj.message = language.getMessage("REQUIRED_PARAMETER_MISING");
            responseObj.data = {};
            response.send(responseObj);
            return;
        }

        frproductsDatalayers.getfrProductsByCats(mongodb.ObjectId(req.params.fId), mongodb.ObjectId(req.params.cId))
            .then((product) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    error: error
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};

exports.savefrproduct = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const param = {};
        param.franchiseId = mongodb.ObjectId(req.body.franchiseId);
        param.productId = mongodb.ObjectId(req.body.productId);
        param.catId = mongodb.ObjectId(req.body.catId);
        param.isPacket = Boolean(req.body.isPacket);
        param.is_active = String(req.body.is_active);

        frproductsDatalayers.save(param)
            .then((product) => {
                if (product.success && product.success == 1) {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: product.msg,
                        data: product.data
                    });
                    return;
                }

                if (product.success && product.success == 2) {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: product.msg,
                        data: product.data
                    });
                    return;
                }

                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: product.msg,
                });
            })
            .catch((err) => {
                res.json({
                    sucess: errorsCodes.BAD_REQUEST,
                    msg: "",
                    error: err
                });
            });
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: errors,
        });
    }
};

exports.makefeaturedproduct = async(req, res) => {
    const param = {};
    param.franchiseId = mongodb.ObjectId(req.body.franchiseId);
    param.productId = mongodb.ObjectId(req.body.productId);
    param.isShown = req.body.isShown;

    frproductsDatalayers.makefeaturedproduct(param)
        .then((product) => {
            if (product.success && product.success == 1) {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: product.msg,
                    data: product.data
                });
                return;
            }

            if (product.success && product.success == 0) {
                res.json({
                    err: errorsCodes.SUCEESS,
                    msg: product.msg,
                    data: ""
                });
                return;
            }
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err
            });
        });
};


exports.getproductvarientbyId = async(req, res) => { 
    if (mongodb.ObjectID.isValid(req.params.pId)) {
        frproductsDatalayers.getproductvarientbyId(mongodb.ObjectId(req.params.pId))
            .then((varients) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: varients
                });
                return;
            })
            .catch((err) => {
                res.json({
                    err: errorsCodes.BAD_REQUEST,
                    msg: "",
                    error: err
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};


exports.getfranchiseproductvarient = async(req, res) => { 
    if (mongodb.ObjectID.isValid(req.params.pId)) {
        frproductsDatalayers.getproductvarient(mongodb.ObjectId(req.params.pId))
        .then((varients) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: varients
            });
            return;
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err
            });
        });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
};

exports.savefrvarient = async(req, res) => {
    var rows = req.body.varientRows;
    var data = [];

    rows.forEach((ele, i) => {
        data.push({
            catId: mongodb.ObjectId(req.body.catId),
            productId: mongodb.ObjectId(req.body.productId),
            frproductId: mongodb.ObjectId(req.body.frproductId),
            franchiseId: mongodb.ObjectId(req.body.franchiseId),
            measurment: ele.measurment,
            unit: ele.unit,
            wholesale: ele.wholesale?ele.wholesale:0,
            price: ele.price,
            disc_price: ele.disc_price,
            qty: ele.qty,
            is_active: ele.is_active,
            is_ws_active: ele.is_ws_active?ele.is_ws_active:'1'
        });
    });

    frproductsDatalayers.saveVarient(data)
        .then((varients) => {
            if (varients) {
                frproductsDatalayers.updateFrProductByCondition({ franchiseId: mongodb.ObjectId(req.body.franchiseId), productId: mongodb.ObjectId(req.body.productId) }, { isPacket: Boolean(req.body.isPacket) });
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: varients
                });
                return;
            }
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err
            });
        });
};



exports.updatefrvarient = async(req, res) => {
    var orows = req.body.oldvarientRows;
    var rows = req.body.varientRows;
    var o_data = [];
    var data = [];

    orows.forEach((ele, i) => {
        o_data.push({
            _id: mongodb.ObjectId(ele._id),
            catId: mongodb.ObjectId(req.body._categoryId),
            productId: mongodb.ObjectId(req.body.productId),
            frproductId: mongodb.ObjectId(req.body._frproductId),
            franchiseId: mongodb.ObjectId(req.body._franchiseId),
            measurment: ele.measurment,
            unit: ele.unit,
            wholesale: ele.wholesale?ele.wholesale:0,
            price: ele.price,
            mrp: ele.mrp,
            disc_price: ele.disc_price,
            qty: ele.qty,
            is_active: ele.is_active,
            is_ws_active: ele.is_ws_active?ele.is_ws_active:'1'
        });
    });

    rows.forEach((ele, i) => {
        data.push({
            catId: mongodb.ObjectId(req.body._categoryId),
            productId: mongodb.ObjectId(req.body.productId),
            frproductId: mongodb.ObjectId(req.body._frproductId),
            franchiseId: mongodb.ObjectId(req.body._franchiseId),
            measurment: ele.measurment,
            unit: ele.unit,
            wholesale: ele.wholesale?ele.wholesale:0,
            price: ele.price,
            mrp: ele.mrp,
            disc_price: ele.disc_price,
            qty: ele.qty,
            is_active: ele.is_active,
            is_ws_active: ele.is_ws_active?ele.is_ws_active:'1'
        });
    });

    if (o_data.length > 0) {
        frproductsDatalayers.updateOldVarient(o_data)
            .then((result) => {
                //----------
            })
            .catch((err) => {
                throw err;
            });
    }

    if (data.length > 0) {
        frproductsDatalayers.saveVarient(data)
            .then((varients) => { 
                if (varients) {
                    let _body ={
                        isPacket: req.body.isPacket,
                        product_max_order: req.body.product_max_order,
                        product_unit: req.body.product_unit,
                        product_quality: req.body.product_quality,
                        is_active: req.body.is_active,
                        createdby: req.body.createdby,
                        modifiedby: req.body.modifiedby
                    };
                    if(req.body.isShown){
                        _body.isShown = req.body.isShown; 
                    }
                    frproductsDatalayers.updateFrProductByCondition({
                        franchiseId: mongodb.ObjectId(req.body._franchiseId),
                        productId: mongodb.ObjectId(req.body.productId)
                    }, _body);
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: "",
                        data: varients
                    });
                    return;
                }
            })
            .catch((err) => {
                res.json({
                    err: errorsCodes.BAD_REQUEST,
                    msg: "",
                    error: err
                });
            });
    } else {
        let _body ={
                isPacket: req.body.isPacket, //Boolean(), 
                is_active: req.body.is_active,                
                product_max_order: req.body.product_max_order,
                product_unit: req.body.product_unit,
                product_quality: req.body.product_quality,
                createdby: req.body.createdby,
                modifiedby: req.body.modifiedby
            };
            if(req.body.isShown){
                _body.isShown = req.body.isShown; 
            }

        frproductsDatalayers.updateFrProductByCondition({
                franchiseId: mongodb.ObjectId(req.body._franchiseId),
                productId: mongodb.ObjectId(req.body.productId)
            }, _body).then((result) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: result
                });
            })
            .catch((err) => {
                throw err;
            });
    }

};

exports.editfrproduct = (req, res) => {
    if (req.method == "GET") {
        frproductsDatalayers.edit(req.params.fpId)
            .then((frproduct) => {
                if (frproduct.success == 1) {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: frproduct.msg,
                        data: frproduct.data
                    });
                    return;
                }

                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: frproduct.msg,
                    data: ""
                });

            }).catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    } else {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            frproductsDatalayers.update(req.body)
                .then((frproduct) => {
                    if (frproduct.success == 1) {
                        res.json({
                            sucess: errorsCodes.SUCEESS,
                            msg: frproduct.msg,
                            data: frproduct.data
                        });
                    }
                    if (frproduct.success == 2) {
                        res.json({
                            err: errorsCodes.CONFLICT,
                            msg: frproduct.msg,
                            data: frproduct.data
                        });
                    }                    
                }).catch((error) => {
                    res.json({
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Record not updated. Try again.",
                        error: error
                    });
                });
        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: errors,
            });
        }
    }
};

exports.frproductstatus = (req, res) => {
    frproductsDatalayers.status(req.body._id, req.body.is_active)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.frproductstatusAll = (req, res) => {
    const is_active = { "is_active": req.body.is_active };
    const idArr = [];

    if (req.body.productIds && req.body.productIds.length > 0) {
        req.body.productIds.forEach(_id => {
            idArr.push(mongodb.ObjectId(_id));
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Please select product(s).",
            error: err
        });
        return false;
    }

    frproductsDatalayers.statusAll(idArr, is_active)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.frproductdelete = (req, res) => {
    frproductsDatalayers.delete(req.params.fpId)
        .then((flag) => {
            if (flag) {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "Record deleted successfully."
                });
            } else {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found."
                });
            }
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
}

exports.getAllfrProductvarient = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.frproductId)) {
        if (!req.params.frproductId || req.params.frproductId == undefined) {
            responseObj.err = errorCodes.REQUIRED_PARAMETER_MISSING;
            responseObj.message = language.getMessage("REQUIRED_PARAMETER_MISING");
            responseObj.data = {};
            response.send(responseObj);
            return;
        }

        const where = req.query;
        where.frproductId = mongodb.ObjectId(req.params.frproductId);

        frproductsDatalayers.getAllfrProductvarient(where)
            .then((product) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    error: error
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }        
};

//save varient of product ---->it will call when product is being updated
exports.frProductvarientsave = (req, res) => {
    frproductsDatalayers.frProductvarientsave(req.body)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record(s) not found.",
                error: error
            });
        });
};

exports.frProductvarientstatus = function(req, res) {
    const is_active = { "is_active": req.body.is_active };
    const idArr = [];

    if (req.body.frenchiseProductVarientIds && req.body.frenchiseProductVarientIds.length > 0) {
        req.body.frenchiseProductVarientIds.forEach(_id => {
            idArr.push(mongodb.ObjectId(_id));
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Please select product(s).",
            error: err
        });
        return false;
    }

    frproductsDatalayers.varientstatus(idArr, is_active)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};

exports.completeFranchiseProductDetails = async(req, res) => {
    const franchiseProductId = req.query.franchiseProductId;
    productsDatalayers.completeProductDetails(franchiseProductId)
        .then((product) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
}

exports.productsimagebyid = async(req, res) => {
    if (mongodb.ObjectID.isValid(req.params.pId)) {
        const pId = mongodb.ObjectId(req.params.pId); 
        productsDatalayers.ProductimageDetails(pId)
            .then((product) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: product
                });
            }).catch((err) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    error: err
                });
            });
    }else{
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }    
}


exports.searchproducts = async(req, res) => {
    var str = req.body.str;
    var areaId = mongodb.ObjectId(req.body.areaId);
    var idsArr = [];
    var franchiseId = ""; 

    productsDatalayers.searchproductsandcats(str, areaId)
        .then((product) => {           
            if (product.length > 0) {
                product.forEach(ele => {
                    idsArr.push(mongodb.ObjectId(ele._id));
                    /*ele.category.forEach(e => {
                        idsArr.push(mongodb.ObjectId(e._id));
                    });*/
                }); //ids of all products and categories match with search string
 
                franchiseDatalayers.getFranchiseOfArea(areaId)
                    .then((franchise) => {
                        //console.log("franchise: "+franchise[0].franchiseId);
                        if (franchise.length > 0) {
                            franchiseId = mongodb.ObjectId(franchise[0].franchiseId);
                            //frachise id who works in given area;
                            productsDatalayers.searchproducts(franchiseId, idsArr)
                                .then((result) => { 
                                    if (result.length > 0 && result[0].productvar.length > 0) {
                                        result[0].productvar = result[0].productvar.filter((ele) => {
                                            return (ele.is_active != '0');
                                        });
                                    } 
                                    res.json({
                                        sucess: errorsCodes.SUCEESS,
                                        msg: "",
                                        data: result
                                    });
                                })
                                .catch((error) => {
                                    //console.log(error);
                                    res.json({
                                        sucess: errorsCodes.SUCEESS,
                                        msg: "",
                                        data: result
                                    });
                                });
                        } else {
                            res.json({
                                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                msg: "Record(s) not found.",
                                data: ""
                            });
                        }
                    }).catch((error) => {
                        //console.log(error);
                        res.json({
                            sucess: errorsCodes.SUCEESS,
                            msg: "",
                            data: ""
                        });
                    });
            } else {
                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record(s) not found.",
                    data: ""
                });
            }
        }).catch((err) => {
            console.log(err);
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};


exports.fraddnewsyncproduct = async(req, res) => {
    const product = req.body.product;
    let user = req.user;
    if(product){
        product.forEach( async(element, index, array) => {  
            var where1 = {procode : element.procode};
            proexist  = await productsDatalayers.getProductsByProcode(where1); 
             
            if(proexist==''){ 
                var where = {catcode : element.catcode};
                catexist = await catagoryDatalayer.getCatagorybyCatcode(where);
                ////console.log("catexist: "+catexist.length);
                if(catexist.length > 0){
                    param = { 
                        catId: mongodb.ObjectId(catexist[0]['_id']), 
                        procode:element.procode, 
                        title:element.name, 
                        description:element.name, 
                        search_title:element.name, 
                        createdby:user._id, 
                        modifiedby:user._id,
                        is_active:"1",
                        created:element.created, 
                        modified:element.modified                                 
                    };
                    productModel.create(param)
                    .then((doc) => {  
                        fdata = {
                            'franchiseId': mongodb.ObjectId(element.franchise_id),
                            'catId': mongodb.ObjectId(doc['catId']), 
                            'productId': mongodb.ObjectId(doc['_id']),
                            'product_quality': 1,
                            'product_max_order': 0,
                            'product_unit': 1,
                            'is_active': "1", 
                            'isShown': 0,
                            'createdby': user._id,
                            'isPacket': 1,
                            'modifiedby': user._id,
                        }; 
                        franchiseproductModel.create(fdata)
                            .then((products) => { 
                                varientRows = {  
                                    'franchiseId': mongodb.ObjectId(element.franchise_id),
                                    'catId': mongodb.ObjectId(doc['catId']), 
                                    'frproductId': mongodb.ObjectId(products['_id']), 
                                    'productId': mongodb.ObjectId(doc['_id']),
                                    'procode':element.procode,
                                    'qty': element.stock,
                                    'measurment': 1,
                                    'unit': 6,
                                    'price':  element.Rate,
                                    'mrp':  element.MRP,
                                    'disc_price':0, 
                                    'is_active':  element.is_active
                                }; 
                                frproductvariantsModel.create(varientRows)
                                .then((varproducts) => {
                                    //console.log("varproducts"+varproducts);                             
                                })
                                .catch((error) => {
                                    console.log(err);  
                                });  
                            })
                            .catch((error) => {
                                console.log(err);  
                            });     
                    })
                    .catch((err) => { 
                        console.log(err);  
                    }); 
                }
            }
        })
    }else{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            code: errorMessage.BAD_REQUEST,
            error: `Product Data not found`,
        });
    }
};

exports.frupdatesyncproduct = async(req, res) => {
    const product = req.body.product;
    let user = req.user; 
    if(product){
        product.forEach( async(element, index, array) => {   
            var where = { "procode" : element.procode };
            proexist  = await productsDatalayers.getProductvariantByProcode(where); 
            if(proexist!=''){   
                if(element.stock && element.Rate!=undefined){
                    varientRows = {   
                        'is_active': element.is_active, 
                        'qty': element.stock,
                        'price':  element.Rate,
                        'mrp':  element.MRP
                    }; 
                }else if(element.stock && element.Rate==undefined){
                    varientRows = {   
                        'is_active': element.is_active, 
                        'qty': element.stock 
                    }; 
                }else if(element.Rate){
                    varientRows = {   
                        'price':  element.Rate,
                        'mrp':  element.MRP
                    }; 
                } 
                frproductvariantsModel.updateMany({ "_id": mongodb.ObjectId(proexist[0]['_id']) }, { $currentDate: { "modified": true }, $set: varientRows })
                .then((doc) => {
                    ///res(doc);
                }).catch((err) => {
                    ///nothing
                }); 
            }
        })
    }else{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            code: errorMessage.BAD_REQUEST,
            error: `Product Data not found`,
        });
    }
};

exports.validation = (method) => {
    switch (method) {
        case "savefrproduct":
            {
                return [
                    check("franchiseId", "Franchise is required.").exists().not().isEmpty(),
                    check("productId", "Product is required.").exists().not().isEmpty(),
                    check("catId", "Category is required.").exists().not().isEmpty()
                ];
            }
        case "updatefrproduct":
            {
                return [
                    check("_id", "Franchise product ID is required.").exists().not().isEmpty(),
                    check("franchiseId", "Franchise is required.").exists().not().isEmpty(),
                    check("productId", "Product is required.").exists().not().isEmpty(),
                    check("catId", "Category is required.").exists().not().isEmpty()
                ];
            }

    }
};