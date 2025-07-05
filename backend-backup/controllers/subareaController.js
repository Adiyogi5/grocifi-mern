const subareaDatalayer = require('../datalayers/subareaDatalayer');
const { check, validationResult } = require("express-validator");
const errorsCodes = require('../helpers/error_codes/errorCodes');
const mongodb = require('mongoose');


exports.getAllSubareas = async(req, res) => {
    let where = {};   
    var total = await subareaDatalayer.gettotalSubArea(where); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir); 
    }else{
      const where = req.query;  
    } 
    if(req.query.where){ 
        where = {
                "$or": [{
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }, {
                    "cityName": {$regex: new RegExp('^'+req.query.where+'', 'i') }  
                }, {
                    "areaName": {$regex: new RegExp('^'+req.query.where+'', 'i') }
                }]
            };  
    }    
    //console.log(where);
    var filtered = await subareaDatalayer.gettotalSubArea(where); 
    subareaDatalayer.getAllSubareas(where, params)
        .then((area) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: area,
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

//getSubAreasByAreaId
exports.getSubareasByAreaId = (req, res) => {
    subareaDatalayer.getSubareasByAreaId(req.params.areaId)
        .then((area) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: area
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error
            });
        });
};

exports.validation = () => {
    return [
        check("title", "Sub area title is required.").exists().not().isEmpty(),
        check("areaId", "Area is required.").exists().not().isEmpty(),
        check("cityId", "City is required.").exists().not().isEmpty(),
    ];
};

exports.saveSubArea = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        subareaDatalayer
            .saveSubArea(req.body)
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

exports.edit = (req, res) => {
    if (req.method == "GET") {
        subareaDatalayer.edit(req.params)
            .then((subarea) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: subarea
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
            subareaDatalayer.update(req.body)
                .then((subarea) => {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: "",
                        data: subarea
                    });
                }).catch((error) => {
                    res.json({
                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
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
    subareaDatalayer.status(mongodb.Types.ObjectId(req.body._id), req.body.is_active)
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

exports.statusAll = async(req, res) => {
    const is_active = { "is_active": req.body.is_active };
    const idArr = [];

    if (req.body.productIds && req.body.productIds.length > 0) {
        req.body.productIds.forEach(_id => {
            idArr.push(mongodb.Types.ObjectId(_id));
        });
    } else {
        return false;
    }

    subareaDatalayer.statusAll(idArr, is_active)
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
        })
};

exports.delete = (req, res) => {
    subareaDatalayer.delete(req.params.subAreaId)
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