const moment = require("moment");
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const userDatalayers = require('../datalayers/userDatalayer');
const errorsCodes = require('../helpers/error_codes/errorCodes');
const catsDatalayers = require('../datalayers/catagoryDatalayers');
const productsDatalayers = require('../datalayers/productsDatalayer');
const franchiseDatalayers = require('../datalayers/franchiseDatalayer');
const deliveryBoyDataleyers = require('../datalayers/deliveryBoyDatalayers');


exports.getglobal = (req, res) => {
    franchiseDatalayers.getglobal()
        .then((data) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: data
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error
            });
        });
};

exports.getAllFranchiseId = (req, res) => {
    franchiseDatalayers.getAllFranchiseId()
        .then((data) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: data
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error
            });
        });
};

exports.getAllFranchise = (req, res) => {
    franchiseDatalayers.getAllFranchise()
        .then((data) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: data
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "Record not saved. Try again.",
                error: error
            });
        });
};

exports.saveFranchise = (req, res) => {
    var param = req.body;
    franchiseDatalayers.saveFranchise(param)
        .then((data) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: data
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                data: ""
            });
        })
};

exports.edit = (req, res) => {
    if (req.method == "GET") {
        franchiseDatalayers.edit(req.params)
            .then((franchise) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: franchise
                });
            }).catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    } else {
        franchiseDatalayers.update(req.body)
            .then((franchise) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: franchise
                });
            }).catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    }
};

exports.getFranchiseByUserId = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.userId)) {
        franchiseDatalayers.getFranchiseByUserId(mongodb.ObjectId(req.params.userId))
            .then((franchise) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: franchise
                });
            }).catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found. Try again.",
                    error: error
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

exports.getFranchiseById = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.Id)) {
        franchiseDatalayers.getFranchiseById(mongodb.ObjectId(req.params.Id))
            .then((franchise) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: franchise
                });
            }).catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found. Try again.",
                    error: error
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


exports.status = (req, res) => {
    franchiseDatalayers.status(req.params.fId, req.body)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.frareastatus = (req, res) => {
    franchiseDatalayers.frareastatus(req.body)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.delete = (req, res) => {
    franchiseDatalayers.delete(req.body.fId)
        .then((flag) => {
            if (flag) {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                });
            } else {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not found.",
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
}

exports.savefrcats = (req, res) => {
    franchiseDatalayers.savefrcats(mongodb.ObjectId(req.body.franchiseId), mongodb.ObjectId(req.body.catId), req.body.is_active)
        .then(() => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "Franchise Category saved.",
                data: "",
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error,
            });
        })
};

exports.updatefrcats = (req, res) => {
    const param = {
        "_id": mongodb.ObjectId(req.body._id),
        "franchiseId": mongodb.ObjectId(req.body.franchiseId),
        "catId": mongodb.ObjectId(req.body.catId),
        "is_active": req.body.is_active
    };
    franchiseDatalayers.updatefrcats(param)
        .then(() => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "Franchise Category updated.",
                data: "",
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error,
            });
        })
};

exports.savefrarea = (req, res) => {
    franchiseDatalayers.savefrarea(mongodb.ObjectId(req.body.franchiseId), mongodb.ObjectId(req.body.areaId))
        .then((doc) => {
            if (!doc) {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "Franchise area already exists.",
                    data: "",
                });
            } else {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "Franchise area saved.",
                    data: "",
                });
            }
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error,
            });
        })
};

exports.deletefrarea = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.franchiseId) && mongodb.ObjectID.isValid(req.params.areaId)) {
        franchiseDatalayers.deletefrarea(mongodb.ObjectId(req.params.franchiseId), mongodb.ObjectId(req.params.areaId))
            .then((doc) => {
                if (doc) {
                    res.json({
                        sucess: errorsCodes.SUCCESS,
                        msg: "Franchise area deleted.",
                        data: "",
                    });
                } else {
                    res.json({
                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Franchise area not found to delete.",
                        data: "",
                    });
                }
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    error: error,
                });
            })
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};

exports.updatefrarea = (req, res) => {
    const param = {
        "_id": mongodb.ObjectId(req.body._id),
        "franchiseId": mongodb.ObjectId(req.body.franchiseId),
        "areaId": mongodb.ObjectId(req.body.areaId),
        "is_active": req.body.is_active
    };
    franchiseDatalayers.updatefrarea(param)
        .then(() => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "Franchise area updated.",
                data: "",
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error,
            });
        })
};

exports.getFranchiseOfArea = (req, res) => {

    let areaId = req.params.areaId ?? res.locals.user?.address?.areaId;
    // console.log(res.locals);
    if (!areaId) {
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Address Not Defined , Please contact admin",
            error: "Address Not Defined , Please contact admin",
            data: res.locals,
        })
    }

    if (mongodb.ObjectID.isValid(areaId)) {

        franchiseDatalayers.getFranchiseOfArea(mongodb.ObjectId(areaId))
            .then((franchise) => {
                if (franchise.length > 0) {
                    res.json({
                        status: errorsCodes.SUCCESS,
                        sucess: errorsCodes.SUCCESS,
                        msg: "",
                        data: franchise
                    });
                } else {
                    res.json({
                        status: errorsCodes.RESOURCE_NOT_FOUND,
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Record not updated. Try again.",
                        error: error
                    });
                }

            }).catch((error) => {
                res.json({
                    status: errorsCodes.RESOURCE_NOT_FOUND,
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error
                });
            });
    } else {
        res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getfrbanner = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {
        franchiseDatalayers.getfrbanner(mongodb.ObjectId(req.params.areaId))
            .then((franchise) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: franchise
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
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}


exports.getfrcats = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {
        try {
            franchiseDatalayers.getfrcats(mongodb.ObjectId(req.params.areaId))
                .then((catsData) => {
                    if (catsData.length > 0) {
                        catsData = catsData.filter((ele) => { return (ele.is_active == "1"); });

                        res.json({
                            sucess: errorsCodes.SUCCESS,
                            isCat: 1,
                            data: catsData
                        });
                    } else {
                        res.json({
                            err: errorsCodes.RESOURCE_NOT_FOUND,
                            msg: "Record not found. Try again.",
                            data: []
                        });
                    }
                }).catch((error) => {
                    res.json({
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Record not updated. Try again.",
                        error: error
                    });
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
}


exports.getfrmaincats = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {
        try {
            franchiseDatalayers.getfrmaincats(mongodb.ObjectId(req.params.areaId))
                .then((catsData) => {
                    if (catsData.length > 0) {
                        catsData = catsData.filter((ele) => { return (ele.is_active == "1"); });

                        res.json({
                            sucess: errorsCodes.SUCCESS,
                            isCat: 1,
                            data: catsData
                        });
                    } else {
                        res.json({
                            err: errorsCodes.RESOURCE_NOT_FOUND,
                            msg: "Record not updated. Try again.",
                            data: []
                        });
                    }
                }).catch((error) => {
                    res.json({
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Record not updated. Try again.",
                        error: error
                    });
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
}


exports.getfranchiseproducts = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {
        var areaId = mongodb.ObjectId(req.params.areaId);
        var catIdArr = [];
        var frcats = "";
        var products = "";
        var franchiseId = "";
        var fruser = await franchiseDatalayers.getFranchiseOfArea(areaId);
        let userId = mongodb.ObjectId(req.user._id);
        var userType = parseInt(req.query.user_type);

        if (fruser != null && fruser.length > 0) {
            franchiseId = fruser[0].franchiseId;
            franchiseId = mongodb.ObjectId(franchiseId);
            frcats = await franchiseDatalayers.getfrcats(areaId);

            if (frcats.length > 0) {
                frcats.forEach(ele => {
                    catIdArr.push(mongodb.ObjectId(ele._id));
                });

                products = await productsDatalayers.getfranchiseproducts(franchiseId, catIdArr, userType);
                var finalproduct = [];
                var p = 0;
                if (products.length > 0) {
                    products.forEach((ele, i) => {
                        /*products[i].productvar = products[i].productvar.filter((eleV) => {
                            if(userType==1){
                                return (eleV.is_ws_active != '0');
                            }else{
                                return (eleV.is_active != '0');
                            }
                        }); */

                        if (ele.productvar.length > 0) {
                            finalproduct[p] = ele;
                            ele.productvar.forEach((eleV, ii) => {
                                if (userType == 1) {
                                    eleV.is_active = eleV.is_ws_active;
                                }
                                var t = eleV;
                                var its_unit = 0;
                                var max_order = 0;
                                products[i].max_order = max_order;
                                switch (ele.product_unit) {
                                    case 1: //if unit in KG
                                        if (eleV.unit == 1) { //change to grams
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                        }
                                        if (eleV.unit == 2) { //don't change to grams
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                        }
                                        break;
                                    case 2: //if unit in GRAMS
                                        if (eleV.unit == 1) { //change to grams
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                        }
                                        if (eleV.unit == 2) { //don't change to grams
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                        }
                                        break;
                                    case 3: //if unit in LITER
                                        if (eleV.unit == 3) { //change to ml
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                        }
                                        if (eleV.unit == 4) { // don't change to ml
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                        }
                                        break;
                                    case 4: //if unit in ML
                                        if (eleV.unit == 3) { //change to ml
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                        }
                                        if (eleV.unit == 4) { // don't change to ml
                                            its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                            max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                        }
                                        break;
                                    default:
                                        its_unit = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                                        max_order = (ele.product_max_order) ? parseInt(ele.product_max_order) : 0;
                                        break;
                                }
                                t.its_unit = its_unit;
                                t.its_max_order = max_order;
                                products[i].max_order = max_order;
                                products[i].productvar[ii] = t;
                                if (userType == 1) {
                                    products[i].productvar[ii]['is_active'] = t.is_ws_active;
                                }
                                finalproduct[p] = products[i];
                            });
                            p++;
                        }
                    });
                }

                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: finalproduct
                });
            } else {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    data: ""
                });
            }
        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                data: ""
            });
        }
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.checkfrareas = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        let where = { franchiseId: mongodb.ObjectId(req.params.fId) };
        franchiseDatalayers.checkfrareas(where)
            .then((catsData) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: catsData
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
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getfrareas = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        let where = { franchiseId: mongodb.ObjectId(req.params.fId) };
        var total = await franchiseDatalayers.gettotalfrarea(where);
        let params = { skip: 0, limit: 0 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
            params.order = req.query.order;
            if (req.query.dir == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }
        if (req.query.where) {
            where = {
                "$or": [{
                    "area.title": { $regex: new RegExp(req.query.where, 'i') }
                }, {
                    "city.title": { $regex: new RegExp(req.query.where, 'i') }
                }],
                "$and": [{ franchiseId: mongodb.ObjectId(req.params.fId) }]
            };
        }
        //console.log(where);
        var filtered = await franchiseDatalayers.gettotalfrarea(where);
        franchiseDatalayers.getfrareas(where, params)
            .then((catsData) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: catsData,
                    total: total,
                    filtered: filtered,
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
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}


exports.getfranchisecatlist = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        where = {
            "$and": [
                { franchiseId: mongodb.ObjectId(req.params.fId) },
                { is_active: "1" }
            ]
        };
        franchiseDatalayers.getfranchisecatlist(where)
            .then((result) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: result
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
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}


exports.getfranchisecat = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        let where = { franchiseId: mongodb.ObjectId(req.params.fId) };
        var total = await franchiseDatalayers.gettotalfrcategory(where);
        let params = { skip: 0, limit: 0 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
            params.order = req.query.order;
            if (req.query.dir == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }
        if (req.query.where) {
            where = {
                "$or": [
                    {
                        "mainCat.title": { $regex: new RegExp(req.query.where, 'i') }
                    }, {
                        "Cats.title": { $regex: new RegExp(req.query.where, 'i') }
                    }],
                "$and": [{ franchiseId: mongodb.ObjectId(req.params.fId) }]
            };
        }
        //console.log(where);
        var filtered = await franchiseDatalayers.gettotalfrcategory(where);

        franchiseDatalayers.getfranchisecat(where, params)
            .then((result) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: result,
                    total: total,
                    filtered: filtered,
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
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.frcatstatus = (req, res) => {
    franchiseDatalayers.frcatstatus(req.body)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.productslistforfranchise = (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.fId)) {
        var product = [];
        franchiseDatalayers.productslistforfranchise(mongodb.ObjectId(req.params.fId))
            .then((doc) => {

                if (doc.length > 0) {
                    doc.forEach((ele, index) => {
                        if (ele.pimgs.length > 0) {
                            ele.pimgs.forEach((eleIn, indexIn) => {
                                doc[index].pimg = eleIn.title
                            })
                        }
                    });
                }

                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: doc,
                });
            })
            .catch((err) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
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

exports.getFrCatsProductsAndSubCats = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.catId) && mongodb.ObjectID.isValid(req.params.areaId)) {
        const mainArr = [];
        const areaFrIds = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];
        const catId = mongodb.ObjectId(req.params.catId);
        const areaId = mongodb.ObjectId(req.params.areaId);
        catsubcatidArr.push(catId);

        await catsDatalayers.getCatsByField({ "_id": catId })
            .then((mainCat) => {
                if (mainCat.length > 0) {
                    mainArr.push({ "mainCat": mainCat[0] });
                }
            })
            .catch((error) => {
                throw error;
            });

        //subcats category
        catsDatalayers.getSubCatByCatId(catId)
            .then((subcats) => {
                if (subcats.length > 0) {
                    mainArr.push({ "subcat": subcats }); //Add Subcates in main array
                    subcats.forEach((ele) => {
                        catsubcatidArr.push(mongodb.ObjectId(ele._id)); //Add/push cat & sub cats id
                    });
                } else {
                    //mainArr.push({"subcat":[]});   //Add Subcates in main array
                    mainArr.push({ "subcat": [mainArr[0].mainCat] }); //Add Subcates in main array
                }
            })
            .catch((error) => {
                throw error;
            });

        //get franchise works in that area
        const franchiseOfArea = await franchiseDatalayers.getFranchiseOfArea(areaId)
            .then((areaFr) => {
                if (areaFr.length > 0) {
                    areaFr.forEach((ele) => {
                        areaFrIds.push(mongodb.ObjectId(ele.franchiseId));
                    })
                }
            })
            .catch((error) => {
                throw error;
            });

        //get franchise products on that category
        const franchiseProducts = await productsDatalayers.franchiseProductsIds(areaFrIds, catsubcatidArr);
        if (franchiseProducts != null) {
            franchiseProducts.forEach((ele) => {
                frProductIdArr.push(mongodb.ObjectId(ele._id));
                productIdArr.push(mongodb.ObjectId(ele.productId));
                productArr.push({ "productId": ele.productId, "title": ele.product.title, "frProductId": ele._id, "catId": ele.catId, "franchiseId": ele.franchiseId, "isPacket": ele.isPacket, "product_quality": ele.product_quality, "description": ele.product.description, "productImg": "", "productvar": "" });
            });
        }

        if (productIdArr.length > 0) {
            await productsDatalayers.getAllProductsImages(productIdArr)
                .then((imgs) => {
                    if (imgs.length > 0) {
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

            await productsDatalayers.getAllProductsVarient(productIdArr, '', '', '', areaFrIds)
                .then((vars) => {
                    if (vars.length > 0) {
                        for (let index = 0; index < productIdArr.length; index++) {
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

        mainArr.push({ "products": productArr }); //Add products in main array
        res.json({
            sucess: errorsCodes.SUCCESS,
            isCat: 1,
            data: mainArr
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.SearchFrCatsProductsAndSubCats = async function (req, res) {

    if (mongodb.ObjectID.isValid(req.params.catId) && mongodb.ObjectID.isValid(req.params.areaId)) {
        const mainArr = [];
        const areaFrIds = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];
        const catId = mongodb.ObjectId(req.params.catId);
        const areaId = mongodb.ObjectId(req.params.areaId);
        catsubcatidArr.push(catId);
        var priceSort = parseInt(req.params.priceSort);
        var dateSort = parseInt(req.params.dateSort);
        var nameSort = parseInt(req.params.nameSort);

        if (isNaN(priceSort)) { priceSort = parseInt(req.query.priceSort); }
        if (isNaN(dateSort)) { dateSort = parseInt(req.query.dateSort); }
        if (isNaN(nameSort)) { nameSort = parseInt(req.query.nameSort); }

        var userType = parseInt(req.query.user_type);

        let params = { skip: 0, limit: 0 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
        }
        // console.log(params)
        await catsDatalayers.getCatsByField({ "_id": catId })
            .then((mainCat) => {
                if (mainCat.length > 0) {
                    mainArr.push({ "mainCat": mainCat[0] });
                }
            })
            .catch((error) => {
                throw error;
            });
        //subcats category
        await catsDatalayers.getSubCatByCatId(catId)
            .then((subcats) => {
                if (subcats.length > 0) {
                    mainArr.push({ "subcat": subcats }); //Add Subcates in main array
                    subcats.forEach((ele) => {
                        catsubcatidArr.push(mongodb.ObjectId(ele._id)); //Add/push cat & sub cats id
                    });
                } else {
                    mainArr.push({ "subcat": [] }); //Add Subcates in main array
                }
            })
            .catch((error) => {
                throw error;
            });
        //get franchise works in that area
        const franchiseOfArea = await franchiseDatalayers.getFranchiseOfArea(areaId)
            .then((areaFr) => {
                if (areaFr) {
                    areaFr.forEach((ele) => {
                        areaFrIds.push(mongodb.ObjectId(ele.franchiseId));
                    })
                }
            })
            .catch((error) => {
                throw error;
            });
        ///console.log(areaFrIds);

        where = {
            franchiseId: { $in: areaFrIds },
            catId: { $in: catsubcatidArr },
            is_active: "1"
        };
        if (req.query.where) {
            where = {
                "$or": [
                    {
                        "product.title": { $regex: new RegExp(req.query.where, 'i') }
                    }],
                "$and": [{
                    franchiseId: { $in: areaFrIds },
                    catId: { $in: catsubcatidArr },
                    is_active: "1"
                }]
            };
        }

        const totalProducts = await productsDatalayers.NewfranchisetotalProducts(where);
        //get franchise products on that category
        const franchiseProducts = await productsDatalayers.NewfranchiseProductsIds(where, params);
        ////console.log(franchiseProducts.length);
        if (franchiseProducts != null) {
            franchiseProducts.forEach((ele) => {
                frProductIdArr.push(mongodb.ObjectId(ele._id));
                productIdArr.push(mongodb.ObjectId(ele.productId));

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
            await productsDatalayers.getAllProductsImages(productIdArr)
                .then((imgs) => {
                    if (imgs != null && imgs.length > 0) {
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

            await productsDatalayers.getAllProductsVarient(productIdArr, nameSort, dateSort, priceSort, areaFrIds)
                .then((vars) => {
                    if (vars != null && vars.length > 0) {
                        for (let index = 0; index < productIdArr.length; index++) {
                            if (userType == 1) { vars[index].is_active = vars[index].is_ws_active; }
                            productArr[index]["productvar"] = vars.filter((pvar) => {
                                return (String(pvar.productId) == String(productArr[index].productId) && pvar.is_active != '0');
                            });
                        }
                    }
                })
                .catch((error) => {
                    throw error;
                });
        }

        mainArr.push({ "products": productArr });//Add products in main array

        /*// Sorting on Name Basis
        if (req.params.searchParam == undefined || req.params.searchParam == '0') {
            mainArr.push({ "products": productArr }); //Add products in main array
        } else {
            let searchTitle = req.params.searchParam;
            let searchLength = searchTitle.length;
            let searchArr = [];
            productArr.forEach((elem) => {
                let searchElem = elem.title.substring(0, searchLength);
                if (searchElem.toLowerCase() == searchTitle.toLowerCase()) {
                    searchArr.push(elem)
                }
            })
            mainArr.push({ "products": searchArr }); //Add products in main array
        }*/

        res.json({
            sucess: errorsCodes.SUCCESS,
            isCat: 1,
            data: mainArr,
            total: totalProducts
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getallfranchiseproducts = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.franchise_id)) {
        var productArr = [];
        const franchise_id = mongodb.ObjectId(req.params.franchise_id);
        var franchiseProducts = await productsDatalayers.getallfranchiseproducts(franchise_id);

        res.json({
            sucess: errorsCodes.SUCCESS,
            data: franchiseProducts
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getallfranchiseprovariants = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.franchise_id)) {
        var productArr = [];
        const franchise_id = mongodb.ObjectId(req.params.franchise_id);
        var franchiseProducts = await productsDatalayers.allproductsoffranchise(franchise_id);

        if (franchiseProducts.length > 0) {
            franchiseProducts.forEach((eleV) => {
                if (eleV.frproduct.length > 0) {

                    productArr.push(eleV);
                }
            });
        }
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: productArr
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}


//allproductsoffranchise
exports.allProductsOfFranchise = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.franchise_id)) {
        var productArr = [];
        const franchise_id = mongodb.ObjectId(req.params.franchise_id);
        var franchiseProducts = await productsDatalayers.allproductsoffranchise(franchise_id);

        if (franchiseProducts.length > 0) {
            franchiseProducts.forEach((eleV) => {
                if (eleV.frproduct.length > 0) {
                    var temp = {};
                    temp.var_id = eleV._id;
                    temp.frproduct_id = eleV.frproductId;
                    var ele = eleV.frproduct[0];
                    var its_unit = 0;
                    var max_order = 0;
                    switch (ele.product_unit) {
                        case 1: //if unit in KG
                            if (eleV.unit == 1) { //change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            if (eleV.unit == 2) { //don't change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            break;
                        case 2: //if unit in GRAMS
                            if (eleV.unit == 1) { //change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            if (eleV.unit == 2) { //don't change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            break;
                        case 3: //if unit in LITER
                            if (eleV.unit == 3) { //change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            if (eleV.unit == 4) { // don't change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            break;
                        case 4: //if unit in ML
                            if (eleV.unit == 3) { //change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            if (eleV.unit == 4) { // don't change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            break;
                        default:
                            its_unit = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                            max_order = (ele.product_max_order) ? parseInt(ele.product_max_order) : 0;
                            break;
                    }
                    temp.its_unit = its_unit;
                    temp.its_max_order = max_order;
                    productArr.push(temp);
                }
            });
        }
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: productArr
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getInCartProductDetail = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.pId) && mongodb.ObjectID.isValid(req.params.frpId) && mongodb.ObjectID.isValid(req.params.frpvId)) {
        const mainArr = [];
        const productArr = [];
        const productIdArr = [];
        const frProductIdArr = [];
        const areaFrIds = [];

        const productId = mongodb.ObjectId(req.params.pId);
        const frproductId = mongodb.ObjectId(req.params.frpId);
        const productvId = mongodb.ObjectId(req.params.frpvId);

        // let userId = mongodb.ObjectId(req.user._id);
        let userId = req.user && req.user._id && mongodb.ObjectId.isValid(req.user._id) ? mongodb.ObjectId(req.user._id) : null;
        var userType = parseInt(req.query.user_type);

        productIdArr.push(mongodb.ObjectId(productId));
        frProductIdArr.push(mongodb.ObjectId(frproductId));

        //get franchise products on that category
        const franchiseProducts = await productsDatalayers.getFranchiseProductIncart(frproductId);

        ///console.log("franchiseProducts: "+franchiseProducts);

        if (franchiseProducts != null && franchiseProducts.length > 0) {
            franchiseProducts.forEach((ele) => {
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

                areaFrIds.push(mongodb.ObjectId(ele.franchiseId));

                productArr.push({
                    productId: ele.productId,
                    title: ele.product.title,
                    frProductId: ele._id,
                    catId: ele.catId,
                    franchiseId: ele.franchiseId,
                    isPacket: ele.isPacket,
                    product_max_order: ele.product_max_order,
                    product_quality: ele.product_quality,
                    product_unit: ele.product_unit,
                    max_order: max_order,
                    description: ele.product.description,
                    is_active: ele.is_active,
                    productImg: [],
                    productvar: []
                });
            });

            if (productIdArr.length > 0) {
                await productsDatalayers.getAllProductsImages(productIdArr)
                    .then((imgs) => {
                        if (imgs != null && imgs.length > 0) {
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
                await productsDatalayers.getProductwishlist(productIdArr, userId)
                    .then((wishs) => {
                        if (wishs != null && wishs.length > 0) {
                            for (let index = 0; index < productIdArr.length; index++) {

                                productArr[index]["productwishlist"] = wishs.filter((wish) => {
                                    return String(wish.product_id) == String(productArr[index].productId);
                                });
                            }
                        } else {
                            productArr[0]["productwishlist"] = [{ user_id: '', product_id: '' }]
                        }
                    })
                    .catch((error) => {
                        throw error;
                    });


                await productsDatalayers.getAllProductsVarient(productIdArr, '', '', '', areaFrIds)
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
        }

        mainArr.push({ "products": productArr }); //Add products in main array
        res.json({
            sucess: errorsCodes.SUCCESS,
            isCat: 1,
            data: mainArr
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getProductDetailsByVarientId = async function (req, res) {
    var idArr = [];

    if (req.body.frpvIds && req.body.frpvIds.length > 0) {
        req.body.frpvIds.forEach(_id => {
            idArr.push(mongodb.ObjectId(_id));
        });
    }

    if (idArr.length > 0) {
        productsDatalayers.getProductDetailsByVarientId(idArr)
            .then((result) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    data: result
                })
            })
            .catch((err) => {
                throw err;
            });
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "No Record(s) Found.",
            data: ""
        });
    } //console.log(idArr);
}

/*exports.getDeliveryBoy = async(req, res) => {
    var detail = await deliveryBoyDataleyers.getDeliveryBoysDetailsAll();
    try {
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: detail
        })
    } catch (error) {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: error
        })
    }
}*/


/*exports.saveDeliveryBoy = async(req, res) => {
    var param = req.body;
    delBoyId = req.body.delivery_boyId;
    var deliveryBoy_save = {}
    var previous_assign = await deliveryBoyDataleyers.getDeliveryBoy({ "delivery_boyId": delBoyId });
    if (previous_assign.length != 0) {
        var errMsg = `Delivery Boy Already Present`;
        deliveryBoy_save.msg = errMsg;
    } else {
        var deliveryBoy_save = await deliveryBoyDataleyers.saveDeliveryBoy(param);
    };
    try {
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: deliveryBoy_save
        })
    } catch (error) {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: error
        })
    }
}*/

/*exports.updateDeliveryBoy = async(req, res) => {

    var _id = req.body._id;
    var franchiseId = req.body.franchiseId;
    var delivery_boyId = req.body.delivery_boyId;

    var condition = {
        _id: { $ne: _id },
        franchiseId: { $eq: franchiseId },
        delivery_boyId: { $eq: delivery_boyId }
    }

    var delivery_boyTableId = await deliveryBoyDataleyers.getDeliveryBoyx(condition);
    // delivery_boyTableId = delivery_boyTableId[0]._id;

    try {
        res.json({ delivery_boyTableId })
    } catch (error) {
        res.json({
            error
        })
    }
}*/

/*exports.editDeliveryBoy = async(req, res) => {
    var delivery_boyId = req.params.id;
    var param = req.body;
    deliveryBoyDataleyers.editDeliveryBoy(delivery_boyId, param).then((doc) => {
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: doc
        })

    }).catch((err) => {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: err
        })
    });
};*/

/*exports.getAlldeliveryBoydetail = async(req, res) => {
    deliveryBoyDataleyers.getDeliveryBoysDetails(req.query).then((doc) => {
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: doc
        })
    }).catch((err) => {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: err
        })
    });
}*/

/*exports.deliveryBoyStatus = (req, res) => {
    var where = { _id: mongodb.ObjectId(req.body._id) };
    deliveryBoyDataleyers.deliveryboystatus(where, req.body.is_active)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
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
};*/

/*exports.deliveryBoyStatusChange = (req, res) => {
    var where = {
        franchiseId: mongodb.ObjectId(req.body.fId),
        delivery_boyId: mongodb.ObjectId(req.body.dboyId)
    };

    deliveryBoyDataleyers.deliveryboystatuschange(where, req.body.is_active)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
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
};*/

exports.getDeliveryBoys = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.franchiseId)) {
        var franchise_id = mongodb.ObjectId(req.params.franchiseId);
        userDatalayers.getDeliveryBoys(franchise_id)
            .then((doc) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    data: doc
                });
            }).catch((err) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    error: err
                });
            });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getFranchiseDeliveryBoys = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.franchise_id)) {
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);
        userDatalayers.getDeliveryBoys(franchise_id)
            .then((doc) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    data: doc
                });
            }).catch((err) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    error: err
                });
            });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getMyStaff = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.franchiseId)) {
        var id = mongodb.ObjectId(req.params.franchiseId);
        userDatalayers.getMyStaff(id)
            .then((doc) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    data: doc
                })

            }).catch((err) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    error: err
                })
            })
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getStaffToAdd = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.franchiseId)) {
        var id = mongodb.ObjectId(req.params.franchise_id);
        userDatalayers.getStaffToAdd(id)
            .then((doc) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    data: doc
                })

            }).catch((err) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    error: err
                })
            })
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.saveToStaff = async (req, res) => {
    let _id = mongodb.ObjectId(req.body._id);
    let franchise_id = mongodb.ObjectId(req.body.franchise_id);
    let data = { _id, franchise_id };
    userDatalayers.saveToStaff(data)
        .then((doc) => {
            if (doc) {
                res.json({
                    success: errorsCodes.SUCCESS,
                    data: doc
                })
            } else {
                res.json({
                    success: errorsCodes.BAD_REQUEST,
                    msg: "This user not available to add in your staff."
                })
            }
        }).catch((err) => {
            res.json({
                success: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            })
        })
}

exports.removeFromStaff = async (req, res) => {

    let _id = mongodb.ObjectId(req.body._id);
    let franchise_id = mongodb.ObjectId(req.body.franchise_id);
    let data = { _id, franchise_id };
    userDatalayers.removeFromStaff(data)
        .then((doc) => {
            if (doc) {
                res.json({
                    success: errorsCodes.SUCCESS,
                    data: doc
                })
            } else {
                res.json({
                    success: errorsCodes.BAD_REQUEST,
                    msg: "Record(s) not found to update."
                })
            }
        }).catch((err) => {
            res.json({
                success: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            })
        })
}

exports.getFranchieDetail = async (req, res) => {
    var x = await deliveryBoyDataleyers.getDeliveryBoy(req.params);
    var y = [];
    if (x.length > 0) {
        var franchiseId = mongoose.Types.ObjectId(x[0].franchiseId);
        var userId = await franchiseDatalayers.getByField({ "_id": franchiseId });
        userId = mongoose.Types.ObjectId(userId[0].userId);
        var y = await userDatalayers.findUserOnBasisOfArray([userId]);
    };
    try {
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: y
        })
    } catch (error) {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "",
            error: err
        })
    }
}

exports.getProductDetailsByFrpId = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.frpId)) {
        const frpId = mongodb.ObjectId(req.params.frpId);

        productsDatalayers.getProductDetailsByFrpId(frpId)
            .then((result) => {

                if (result.length > 0 && result[0].variants.length > 0) {
                    result[0].variants = result[0].variants.filter((ele) => {
                        return (ele.is_active != '0');
                    });
                }
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    data: result
                })
            })
            .catch((err) => {
                throw err;
            });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getFranchiseMainCategory = async function (req, res) {
    let operation_manager_id = req.user._id;
    if (req.user.franchise_id) {
        try {
            let franchiseId = mongodb.ObjectId(req.user.franchise_id);
            let catsIds = await franchiseDatalayers.getfranchiseCategoryIds(franchiseId);

            if (catsIds.length > 0) {
                catsIds = catsIds.map((ele) => {
                    return mongodb.ObjectId(ele.catId);
                });
            }
            let categories = await catsDatalayers.getCatsByField({ _id: { $in: catsIds }, is_active: '1', catagory_id: null });
            res.json({
                sucess: errorsCodes.SUCCESS,
                isCat: 1,
                data: categories
            });
        } catch (e) {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                error: e,
                data: ""
            });
        }
    } else {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            data: ""
        });
    }
}

exports.getFranchiseSubCategoryAndProducts = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.category_id)) {
        let operation_manager_id = req.user._id;
        if (req.user.franchise_id) {
            let category_id = mongodb.ObjectId(req.params.category_id);
            let franchiseId = mongodb.ObjectId(req.user.franchise_id);
            let mainArr = [];

            try {
                /*let catsIds = await franchiseDatalayers.getfranchiseCategoryIds(franchiseId);
                if (catsIds.length > 0) {
                    catsIds = catsIds.map((ele) => {
                        return mongodb.ObjectId(ele.catId);
                    });
                }*/
                catsIds = [];
                catsIds.push(category_id);
                subcat = [];
                let mainCat = await catsDatalayers.getCatagoryById(category_id);

                //subcats category
                await catsDatalayers.getSubCatByCatId(category_id)
                    .then((subcats) => {
                        if (subcats.length > 0) {
                            subcats.forEach((ele) => {
                                subcat.push(ele);
                                catsIds.push(mongodb.ObjectId(ele._id));
                            });
                        }
                    })
                    .catch((error) => {
                        throw error;
                    });

                let products = await productsDatalayers.getFranchiseProductList(franchiseId, catsIds);
                let productArr = [];

                products.forEach((ele, index) => {
                    if (ele.product.length > 0) {
                        let imgs = []
                        if (ele.productImg.length > 0) {
                            imgs = ele.productImg.filter((ele_img) => {
                                return ele_img.isMain == true;
                            }).map((ele_img) => {
                                return { title: ele_img.title, isMain: ele_img.isMain }
                            });
                        } else {
                            imgs = [{ title: '', isMain: true }]
                        }

                        productArr.push({
                            "catId": ele.catId,
                            "frProductId": ele._id,
                            "isPacket": ele.isPacket,
                            "productId": ele.productId,
                            "unit": ele.product_unit,
                            "title": ele.product[0].title,
                            "franchiseId": ele.franchiseId,
                            "description": ele.product.description,
                            "product_quality": ele.product_quality,
                            "productImg": imgs
                        });
                    }
                });

                mainArr.push({ "mainCat": mainCat, subcat, "products": productArr });

                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: mainArr
                });
            } catch (e) {
                res.json({
                    sucess: errorsCodes.BAD_REQUEST,
                    error: e,
                    data: ""
                });
            }
        } else {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                data: ""
            });
        }
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.savePurchasedItem = async (req, res) => {
    let user = req.user;
    if (user.franchise_id) {
        let post = req.body;
        post.franchise_id = user.franchise_id;
        post.stock = { quantity_1: post.quantity, unit_1: post.unit, quantity_2: 0, unit_2: 0 }
        post.pm_id = user._id;
        post.created = moment(new Date()).add(5, "hours").add(30, "minutes");
        post.modified = moment(new Date()).add(5, "hours").add(30, "minutes");
        post.createdby = user._id;
        post.modifiedby = user._id;

        delete post.quantity;
        delete post.unit;
        franchiseDatalayers.savePurchasedItem(post)
            .then((data) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: data
                });
            })
            .catch((error) => {
                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    error: error,
                    msg: "Record not updated. Try again.",
                    data: ""
                });
            });
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Record not updated. Try again.",
            data: ""
        });
    }
}

exports.updatePurchasedItem = async (req, res) => {
    let user = req.user;
    if (user.franchise_id) {
        let post = req.body;

        let old_data = await franchiseDatalayers.getPurchasedItemById(mongodb.ObjectId(post._id));

        post.stock = {
            quantity_1: old_data.stock.quantity_1,
            unit_1: old_data.stock.unit_1,
            quantity_2: post.quantity,
            unit_2: post.unit
        };

        post.sm_id = user._id;
        post.modifiedby = user._id;
        post.modified = new Date(moment(new Date()).add(5, "hours").add(30, "minutes"));

        delete post.quantity;
        delete post.unit;

        franchiseDatalayers.updatePurchasedItem(post)
            .then((data) => {
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "",
                    data: data
                });
            })
            .catch((error) => {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    data: ""
                });
            });
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Record not updated. Try again.",
            data: ""
        });
    }
}

exports.getPurchasedItemByDate = async (req, res) => {
    let user = req.user;
    if (user.franchise_id || user.role_type == "1" || user.role_type == "3") {
        let startDate = new Date(req.params.pdate);
        let endDate = new Date(moment(req.params.pdate).add(1, "days").format("YYYY-MM-DD"));
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);

        try {
            let where = { created: { $gte: startDate, $lt: endDate }, "pImage.isMain": true };

            if (user.franchise_id) {
                where.franchise_id == user.franchise_id;
            } else if (user.role_type == "3") {
                where.franchise_id == user._id;
            }

            let purchased_item = await franchiseDatalayers.getPurchasedItemByDate(where);

            let temp = purchased_item;
            purchased_item = [];
            temp.forEach(ele => {
                purchased_item.push({
                    _id: ele._id,
                    franchise_id: ele.franchise_id,
                    stock: {
                        quantity_1: ele.stock.quantity_1,
                        unit_1: ele.stock.unit_1,
                        quantity_2: ele.stock.quantity_2,
                        unit_2: ele.stock.unit_2,
                    },
                    price: ele.price,
                    total_price: ele.total_price,
                    pm_id: ele.pm_id,
                    sm_id: ele.sm_id,
                    title: ele.product.title,
                    image: ele.pImage.title,
                    created: ele.created,
                    modified: ele.modified,
                    franchise_product_id: ele.franchise_product_id,
                    firm_name: ele.franchise.firmname
                });
            });
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: purchased_item
            });
        } catch (error) {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                error: error,
                msg: "Record(s) not found. Try again."
            });
        }
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Record not updated. Try again.",
            data: ""
        });
    }
}

exports.getCIPurchasedItemByDate = async (req, res) => {
    let user = req.user;
    if (user.franchise_id || user.role_type == "1" || user.role_type == "3") {
        let startDate = new Date(req.params.pdate);
        let endDate = new Date(moment(req.params.pdate).add(1, "days").format("YYYY-MM-DD"));
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);

        try {
            let where = { created: { $gte: startDate, $lt: endDate }, "pImage.isMain": true, franchise_id: franchise_id };

            let purchased_item = await franchiseDatalayers.getPurchasedItemByDate(where);

            let temp = purchased_item;
            purchased_item = [];
            temp.forEach(ele => {
                purchased_item.push({
                    _id: ele._id,
                    franchise_id: ele.franchise_id,
                    stock: {
                        quantity_1: ele.stock.quantity_1,
                        unit_1: ele.stock.unit_1,
                        quantity_2: ele.stock.quantity_2,
                        unit_2: ele.stock.unit_2,
                    },
                    price: ele.price,
                    total_price: ele.total_price,
                    pm_id: ele.pm_id,
                    sm_id: ele.sm_id,
                    title: ele.product.title,
                    image: ele.pImage.title,
                    created: ele.created,
                    modified: ele.modified,
                    franchise_product_id: ele.franchise_product_id,
                    firm_name: ele.franchise.firmname
                });
            });
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: purchased_item
            });
        } catch (error) {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                error: error,
                msg: "Record(s) not found. Try again."
            });
        }
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Record not updated. Try again.",
            data: ""
        });
    }
}


exports.getfeatureproductlist = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {
        var areaId = mongodb.ObjectId(req.params.areaId);
        var catIdArr = [];
        var frcats = "";
        var products = "";
        var franchiseId = "";
        var fruser = await franchiseDatalayers.getFranchiseOfArea(areaId);
        let mainArr = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];
        const priceSort = parseInt(req.params.priceSort);
        const dateSort = parseInt(req.params.dateSort);
        const nameSort = parseInt(req.params.nameSort);
        let userId = "";

        if (req.query.user_id) {
            userId = mongodb.ObjectId(req.query.user_id);
        }
        var userType = 0;
        if (req.query.user_type) {
            userType = parseInt(req.query.user_type);
        }
        let params = { skip: 0, limit: 100 };
        let _and = [];

        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
        }
        params.limit = 1000;
        if (fruser != null && fruser.length > 0) {
            franchiseId = fruser[0].franchiseId;
            franchiseId = mongodb.ObjectId(franchiseId);
            frcats = await franchiseDatalayers.getfeaturefrcats(areaId);

            if (frcats.length > 0) {
                frcats.forEach(ele => {
                    catIdArr.push(mongodb.ObjectId(ele._id));
                });

                if (userType == 0) {
                    where = {
                        franchiseId: franchiseId,
                        catId: { $in: catIdArr },
                        is_active: "1"
                    };
                } else if (userType == 1) {
                    where = {
                        franchiseId: franchiseId,
                        catId: { $in: catIdArr },
                        is_ws_active: "1"
                    };
                }

                if (req.query.where) {
                    if (userType == 0) {
                        where = {
                            "$or": [
                                {
                                    "product.title": { $regex: new RegExp(req.query.where, 'i') }
                                }],
                            "$and": [{
                                franchiseId: franchiseId,
                                catId: { $in: catIdArr },
                                "product.is_active": "1"
                            }]
                        };
                    } else if (userType == 1) {
                        where = {
                            "$or": [
                                {
                                    "product.title": { $regex: new RegExp(req.query.where, 'i') }
                                }],
                            "$and": [{
                                franchiseId: { $in: franchiseId },
                                catId: { $in: catIdArr },
                                "product.is_active": "1"
                            }]
                        };
                    }
                }

                const franchiseProducts = await productsDatalayers.NewfeatureProductsIds(where, params, franchiseId, userType, userId);

                res.json({
                    sucess: errorsCodes.SUCCESS,
                    isCat: 1,
                    data: franchiseProducts
                });

            } else {
                res.json({
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not Found. Try again.",
                    data: ""
                });
            }
        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                data: ""
            });
        }
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}

exports.getfranchiseproductlistbycat = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.catId) && mongodb.ObjectID.isValid(req.params.areaId)) {

        const catId =   mongodb.ObjectId(req.params.catId);
        const areaId =  mongodb.ObjectId(req.params.areaId);
        let userId = req.user && req.user._id && mongodb.ObjectId.isValid(req.user._id) ? mongodb.ObjectId(req.user._id) : null;


        var catIdArr = [];
        var frcats = "";
        var products = "";
        var franchiseId = "";
        var fruser = await franchiseDatalayers.getFranchiseOfArea(areaId);
        let mainArr = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];
        const priceSort = parseInt(req.params.priceSort);
        const dateSort = parseInt(req.params.dateSort);
        catsubcatidArr.push(catId);

        var userType = parseInt(req.query.user_type);
        const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 20;
        const limit = 1000;

        // Calculate the skip value (to skip over documents from previous pages)
        const skip = (page - 1) * limit;
        let params = { skip: skip, limit: limit, order: "title", dir: 1 };
        // if (req.query.start) {
        //     params.skip = skip;
        //     params.limit = limit;
        // }
        if (req.query.nameSort) {
            params.order = "title";
            if (req.query.nameSort == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }
        if (req.query.priceSort) {
            params.order = "productvar.price";
            if (req.query.priceSort == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }

        await catsDatalayers.getCatsByField({ "_id": catId })
            .then((mainCat) => {
                if (mainCat.length > 0) {
                    mainArr.push({ "mainCat": mainCat[0] });
                }
            })
            .catch((error) => {
                throw error;
            });
        //subcats category
        await catsDatalayers.getSubCatByCatId(catId)
            .then((subcats) => {
                if (subcats.length > 0) {
                    mainArr.push({ "subcat": subcats }); //Add Subcates in main array
                    subcats.forEach((ele) => {
                        catsubcatidArr.push(mongodb.ObjectId(ele._id)); //Add/push cat & sub cats id
                    });
                } else {
                    mainArr.push({ "subcat": [] });
                    /// mainArr.push({ "subcat": [mainArr[0].mainCat] }); //Add Subcates in main array
                }
            })
            .catch((error) => {
                throw error;
            });


        if (fruser != null && fruser.length > 0) {
            franchiseId = fruser[0].franchiseId;
            franchiseId = mongodb.ObjectId(franchiseId);

            if (userType == 0) {
                where = {
                    is_active: { $ne: "2" },
                    catId: { $in: catsubcatidArr },
                };
            } else if (userType == 1) {
                where = {
                    is_ws_active: { $ne: "2" },
                    catId: { $in: catsubcatidArr },
                };
            }

            if (req.query.where) {
                if (userType == 0) {
                    where = {
                        "$or": [
                            {
                                "title": new RegExp('' + req.query.where + '', 'i')
                            }],
                        "$and": [{ catId: { $in: catsubcatidArr }, is_active: { $ne: "2" } }]
                    };
                } else if (userType == 1) {
                    where = {
                        "$or": [
                            {
                                "title": new RegExp('' + req.query.where + '', 'i')
                            }],
                        "$and": [{ catId: { $in: catsubcatidArr }, is_ws_active: { $ne: "2" } }]
                    };
                }
            }

            const totalCount = await productsDatalayers.countFranchiseProducts(where, franchiseId, userType);

            // Step 2: Calculate the total number of pages
            const totalPages = Math.ceil(totalCount / limit);
            /// console.log(where); 
            const franchiseProducts = await productsDatalayers.NewfranchiseProductsList(where, params, franchiseId, userType, userId);

            mainArr.push({
                "totalPages": totalPages,
                "totalPosts": totalCount,
                "currentPage": page,
                "limit": limit,
                "products": franchiseProducts
            });

            return res.json({
                sucess: errorsCodes.SUCCESS,
                isCat: 1,
                data: mainArr
            });


        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                data: ""
            });
        }
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}


exports.franchiseproductsearch = async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.areaId)) {

        const areaId = mongodb.ObjectId(req.params.areaId);
        var catIdArr = [];
        var frcats = "";
        var products = "";
        var franchiseId = "";
        var fruser = await franchiseDatalayers.getFranchiseOfArea(areaId);
        let mainArr = [];
        const productArr = [];
        const productIdArr = [];
        const catsubcatidArr = [];
        const frProductIdArr = [];
        let userId = mongodb.ObjectId(req.user._id);

        var userType = parseInt(req.query.user_type);
        let params = { skip: 0, limit: 20, order: "title", dir: 1 };
        if (req.query.start) {
            params.skip = parseInt(req.query.start);
            params.limit = 20;
        }
        if (req.query.nameSort) {
            params.order = "title";
            if (req.query.nameSort == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }
        if (req.query.priceSort) {
            params.order = "productvar.price";
            if (req.query.priceSort == 1) {
                params.dir = 1;
            } else {
                params.dir = -1;
            }
        }

        if (fruser != null && fruser.length > 0) {
            franchiseId = fruser[0].franchiseId;
            franchiseId = mongodb.ObjectId(franchiseId);

            if (userType == 0) {
                where = {
                    is_active: "1",
                };
            } else if (userType == 1) {
                where = {
                    is_ws_active: "1",
                };
            }

            if (req.query.where) {
                if (userType == 0) {
                    where = {
                        "$or": [
                            {
                                "title": new RegExp('' + req.query.where + '', 'i')
                            }],
                        "$and": [{ is_active: "1" }]
                    };
                } else if (userType == 1) {
                    where = {
                        "$or": [
                            {
                                "title": new RegExp('' + req.query.where + '', 'i')
                            }],
                        "$and": [{ is_ws_active: "1" }]
                    };
                }
            }
            /// console.log(where); 
            const franchiseProducts = await productsDatalayers.NewfranchiseProductsList(where, params, franchiseId, userType, userId);

            res.json({
                sucess: errorsCodes.SUCCESS,
                data: franchiseProducts
            });

        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again.",
                data: ""
            });
        }
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}


//allproductsoffranchise
exports.getFranchiseProductsbyfrpid = async function (req, res) {
    if (mongodb.ObjectID.isValid(req.params.frpId)) {
        var productArr = [];
        const frpId = mongodb.ObjectId(req.params.frpId);
        var franchiseProducts = await productsDatalayers.allfranchiseproductsbyfrpid(frpId);

        if (franchiseProducts.length > 0) {
            franchiseProducts.forEach((eleV) => {
                if (eleV.frproduct.length > 0) {
                    var temp = {};
                    temp.var_id = eleV._id;
                    temp.frproduct_id = eleV.frproductId;
                    var ele = eleV.frproduct[0];
                    var its_unit = 0;
                    var max_order = 0;
                    switch (ele.product_unit) {
                        case 1: //if unit in KG
                            if (eleV.unit == 1) { //change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            if (eleV.unit == 2) { //don't change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            break;
                        case 2: //if unit in GRAMS
                            if (eleV.unit == 1) { //change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            if (eleV.unit == 2) { //don't change to grams
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            break;
                        case 3: //if unit in LITER
                            if (eleV.unit == 3) { //change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            if (eleV.unit == 4) { // don't change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            break;
                        case 4: //if unit in ML
                            if (eleV.unit == 3) { //change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            if (eleV.unit == 4) { // don't change to ml
                                its_unit = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            break;
                        default:
                            its_unit = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                            max_order = (ele.product_max_order) ? parseInt(ele.product_max_order) : 0;
                            break;
                    }
                    temp.its_unit = its_unit;
                    temp.its_max_order = max_order;
                    productArr.push(temp);
                }
            });
        }
        res.json({
            sucess: errorsCodes.SUCCESS,
            data: productArr
        });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
}