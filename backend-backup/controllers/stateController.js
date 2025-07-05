const fs = require('fs');
const countryDatalayer = require('../datalayers/countryDatalayer');
const stateDatalayers = require('../datalayers/stateDatalayer');
const errorsCodes = require('../helpers/error_codes/errorCodes');
const mongodb = require('mongoose');
const { check, validationResult, body } = require("express-validator");


exports.import_state = async(req, res) => {
    let rawdata = fs.readFileSync(__dirname + "/../public/uploads/states.json");
    rawdata = JSON.parse(rawdata);
    rawdata = rawdata.states;
    var aid = mongodb.Types.ObjectId('5f605acbae6da8148b6288a3');
    var countries = await countryDatalayer.getAllCountry({});

    let states = [];
    rawdata.forEach((ele) => {
        let country = countries.filter((c) => { return (c.cid == ele.country_id) });
        states.push({ title: ele.name, sid: ele.id, countryId: mongodb.Types.ObjectId(country[0]._id), createdby: aid, modifiedby: aid });
    });
    await stateDatalayers.saveAllState(states);

    res.status(200).end();
    return;
};

exports.getAllState = async(req, res) => {
    let where = {};  
    var total = await stateDatalayers.gettotalState(where); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir); 
    }else{
        where = req.query;
    } 
    if(req.query.where){
         where = {
                "$or": [{
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }, {
                    "countryName": {$regex: new RegExp('^'+req.query.where+'', 'i') }
                }]
            };  
    }
    //console.log(where);
    var filtered = await stateDatalayers.gettotalState(where); 
   /// console.log(filtered);
    stateDatalayers.getAllstates(where, params)
        .then((state) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: state,
                total: total,
                filtered: filtered,
            });
        })
        .catch((error) => {
            res.json({
                message: errorsCodes.RESOURCE_NOT_FOUND,
                error: error
            });
        });
};

exports.getStateByCountryId = (req, res) => {
    var where = req.query;
    where.countryId = mongodb.Types.ObjectId(req.params.countryId);
    stateDatalayers.getStateByCountryId(where)
        .then((state) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: state
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Records not found",
                error: error
            });
        });
};

exports.saveState = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var param = req.body;
        // Inserting data in the Database
        stateDatalayers
            .saveState(param)
            .then((state) => {
                res.json({
                    code: errorsCodes.SUCEESS,
                    data: state
                })
            })
            .catch((err) => {
                res.json({
                    code: errorsCodes.BAD_REQUEST,
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
        stateDatalayers.edit(req.params)
            .then((area) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: area
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
            stateDatalayers.update(req.body)
                .then((state) => {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: "",
                        data: state
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
    stateDatalayers.status(req.body._id, req.body.is_active)
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
    stateDatalayers.statusAll(idArr, is_active)
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
    stateDatalayers.delete(req.params.stateId)
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

exports.validation = () => {
    return [check("title", "State title is required.").exists().not().isEmpty()];
};