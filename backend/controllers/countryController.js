const fs = require('fs');
const countryDatalayers = require('../datalayers/countryDatalayer');
const { check, validationResult, body } = require("express-validator");
const errorsCodes = require('../helpers/error_codes/errorCodes');
const mongodb = require('mongoose');

exports.import_country = async(req, res) => {
    let rawdata = fs.readFileSync(__dirname + "/../public/uploads/countries.json");
    rawdata = JSON.parse(rawdata);
    rawdata = rawdata.countries;
    let countries = [];
    var aid = mongodb.Types.ObjectId('5f605acbae6da8148b6288a3');
    rawdata.forEach((ele) => {
        countries.push({ title: ele.name, cid: ele.id, createdby: aid, modifiedby: aid });
    });

    await countryDatalayers.saveAllCountry(countries);
    res.status(200).end();
    return;
};

exports.getAllCountry = async(req, res) => {

    let where = {};
    var total = await countryDatalayers.gettotalCountry(where);
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    } else {
        where = req.query;
    }
    if (req.query.where) {
        where.title = {$regex: new RegExp('^' + req.query.where + '', 'i')};
    }
    ///console.log(where);
    var filtered = await countryDatalayers.gettotalCountry(where);

    countryDatalayers.getAllCountry(where, params)
        .then((country) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: country,
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

exports.saveCountry = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var param = req.body;
        // Inserting data in the Database
        countryDatalayers
            .saveCountry(param)
            .then((doc) => {
                res.json({

                    sucess: errorsCodes.SUCEESS,
                    msg: "Country Saved successfully.",
                    data: doc
                })
            })
            .catch((err) => {
                res.json({

                    err: errorsCodes.BAD_REQUEST,
                    msg: "Country not saved, Please try again.",
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
        countryDatalayers.edit(req.params)
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
            countryDatalayers.update(req.body)
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
    countryDatalayers.status(req.body._id, req.body.is_active)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
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
    countryDatalayers.statusAll(idArr, is_active)
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
    countryDatalayers.delete(req.params.cntryId)
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
    return [check("title", "Country title is required.").exists().not().isEmpty()];
};