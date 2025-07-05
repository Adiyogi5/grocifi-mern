const fs = require('fs');
const stateDatalayers = require('../datalayers/stateDatalayer');
const cityDatalayers = require('../datalayers/cityDatalayer');
const mongodb = require('mongoose');
const { check, validationResult, body } = require("express-validator");
const errorsCodes = require('../helpers/error_codes/errorCodes');


exports.import_city = async(req, res) => {
    let rawdata = fs.readFileSync(__dirname + "/../public/uploads/cities.json");
    try {
        rawdata = JSON.parse(rawdata);
        rawdata = rawdata.cities;
    } catch (err) {
        console.log(err);
    }

    var aid = mongodb.Types.ObjectId('5f605acbae6da8148b6288a3');
    var states = await stateDatalayers.getstates();

    states.forEach((ele) => {
        let city = rawdata.filter((c) => { return (c.state_id == ele.sid); });
        var tempCity = [];
        if (city.length > 0) {
            city.forEach((elec) => {
                tempCity.push({ title: elec.name, stateId: ele._id, createdby: aid, modifiedby: aid });
            });
            cityDatalayers.saveAllcity(tempCity);
        }
    });

    res.status(200).end();
    return;
};

exports.getAllCities = async(req, res) => {
    let where = {};  
    var total = await cityDatalayers.gettotalCity(where); 
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
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }, {
                    "stateName": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }]
            };  
    }
    //console.log(where);
    var filtered = await cityDatalayers.gettotalCity(where); 
   /// console.log(filtered);
    cityDatalayers.getAllCities(where, params)
        .then((city) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: city,
                total: total,
                filtered: filtered,
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                error: error
            });
        });
};

exports.getCityByStateId = (req, res) => {
    if (mongodb.Types.ObjectId.isValid(req.params.stateId)) {
        var where = req.query;
        where.stateId = mongodb.Types.ObjectId(req.params.stateId);
        where.is_active = "1";
        cityDatalayers.getCityByStateId(where)
        .then((city) => {
            console.log("city data",city)
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: city
            });
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Records not found",
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

exports.saveCity = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var param = req.body;
        // Inserting data in the Database
        cityDatalayers
            .save(param)
            .then((doc) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: doc
                })
            })
            .catch((err) => {
                res.json({
                    err: errorsCodes.BAD_REQUEST,
                    msg: "Unable to save city, please try again.",
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
        if (mongodb.Types.ObjectId.isValid(req.params.cityId)) {
            cityDatalayers.edit(req.params)
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
        }else{
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Invalid ObjectId",
                error: "Invalid ObjectId"
            })
        }
    } else {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            cityDatalayers.update(req.body)
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
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: errors,
            });
        }
    }
};

exports.status = (req, res) => {
    cityDatalayers.status(req.body._id, req.body.is_active)
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
    cityDatalayers.statusAll(idArr, is_active)
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
    cityDatalayers.delete(req.params.cityId)
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
    return [check("title", "City title is required.").exists().not().isEmpty()];
};