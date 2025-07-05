const areaDatalayers = require("../datalayers/areaDatalayer");
const { check, validationResult } = require("express-validator");
const errorsCodes = require("../helpers/error_codes/errorCodes");
const mongodb = require('mongoose');

exports.getAllAreas = async(req, res) => {
    let where = {};
    var total = await areaDatalayers.gettotalArea(where);
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
        where = {
            "$or": [{
                "title": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            }, {
                "cityName": {$regex: new RegExp('^' + req.query.where + '', 'i') }
            }]
        };
    }
    //console.log(where);
    var filtered = await areaDatalayers.gettotalArea(where);
    areaDatalayers.getAllAreas(where, params)
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

//getAreasByCityId
exports.getAreasByCityId = (req, res) => {
    var where = { "cityId": JSON.parse(JSON.stringify(req.params.cityId)), "is_active":"1" };
    areaDatalayers.getAreasByCityId(where)
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

exports.saveArea = async(req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        var param = req.body;
        // Inserting data in the Database
        areaDatalayers
            .saveArea(param)
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

exports.editGroupOfArea = (req, res) => {
    if (req.method == "GET") {
        areaDatalayers.editGroupOfArea(req.params)
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
            areaDatalayers.update(req.body)
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

exports.edit = (req, res) => {
    if (req.method == "GET") {
        areaDatalayers.edit(req.params)
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
            areaDatalayers.update(req.body)
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
    areaDatalayers.status(mongodb.Types.ObjectId(req.body._id), req.body.is_active)
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

    areaDatalayers.statusAll(idArr, is_active)
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
    areaDatalayers.delete(req.params.areaId)
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


exports.getAllGroups = async(req, res) => {
    let where = {};
    var total = await areaDatalayers.gettotalGrouparea(where);
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    } else {
        let qry = req.query;
        if (qry._id) {
            where._id = mongodb.Types.ObjectId(qry._id);
        }
        if (qry.is_active) {
            where.is_active = Number(qry.is_active);
        }
        if (qry.city_id) {
            where.city_id = mongodb.Types.ObjectId(qry.city_id);
        }
    }
    if (req.query.where) {
        where = {
            "$or": [{
                "title": {$regex: new RegExp('^' + req.query.where + '', 'i')}
            }, {
                "stateName": {$regex: new RegExp('^' + req.query.where + '', 'i')}
            }, {
                "cityName": {$regex: new RegExp('^' + req.query.where + '', 'i')}
            }]
        };
    }

    var filtered = await areaDatalayers.gettotalGrouparea(where);

    areaDatalayers.getAllGroups(where, params)
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

exports.saveGroupOfArea = async(req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        var param = req.body;
        delete param._id;
        try {
            let data = await areaDatalayers.saveGroupOfArea(param);
            //let area = await areaDatalayers.getAllGroups({ _id: data._id });
            res.json({
                success: errorsCodes.SUCEESS,
                msg: "",
                data: "", //area
            });
        } catch (error) {
            res.json({
                success: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error,
            });
        }
    } else {

        res.json({
            success: errorsCodes.BAD_REQUEST,
            msg: capitalize(errors.errors[0].param) + " : " + errors.errors[0].msg,
            error: errors,
        });
    }
};

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

exports.updateGroupOfArea = async(req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            let data = await areaDatalayers.updateGroupOfArea(req.body);
            /// let area = await areaDatalayers.getAllGroups({ _id: mongodb.Types.ObjectId(req.body._id) });
            res.json({
                success: errorsCodes.SUCEESS,
                msg: "",
                data: "", //area
            });
        } catch (error) {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: error,
            });
        }
    } else {
        res.json({
            success: errorsCodes.BAD_REQUEST,
            msg: capitalize(errors.errors[0].param) + " : " + errors.errors[0].msg,
            error: errors,
        });
    }
};

exports.statusGroup = (req, res) => {
    areaDatalayers.statusGroup(mongodb.Types.ObjectId(req.body._id), req.body.is_active)
        .then((doc) => {
            res.json({
                success: errorsCodes.SUCEESS,
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

//getAreasByCityId
exports.getAreaByGroupId = (req, res) => {
    let where = {};
    where.group_id = mongodb.Types.ObjectId(req.params.group_id);
    if (req.query.is_active) {
        where.is_active = req.query.is_active;

    }

    areaDatalayers.getAreaWhere(where)
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
    return [check("title", "Area title is required.").exists().not().isEmpty()];
};

exports.groupAreaValidations = () => {
    return [
        check("title", "Group title is required.").exists().not().isEmpty()
        .custom(async(value, { req }) => {
            let where = { title: value };
            if (req.body._id && req.body._id != '') {
                where = { title: value, _id: { $ne: mongodb.Types.ObjectId(req.body._id) } };
            }
            let doc = await areaDatalayers.findGroupOfAreaByCondition(where);

            if (!doc.length) {
                return true;
            } else {
                throw new Error(`"${value}" Already exists. Please choose another one.`);
            }
        }),
        check("city_id", "Area is required.").exists().not().isEmpty(),
    ];
};