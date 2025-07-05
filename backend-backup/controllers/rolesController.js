const mongodb = require("mongodb");
const roleDatalayers = require('../datalayers/rolesDatalayers');
const modulesDatalayers = require('../datalayers/modulesDatalayers');
const adminpermissionDatalayers = require('../datalayers/adminpermissionDatalayers');
const { check, validationResult } = require("express-validator");
const errorCodes = require('../helpers/error_codes/errorCodes');
const message = require('../helpers/languages/english');

exports.getRoles = async(req, res) => { 
    let where = {};
    var total = await roleDatalayers.gettotalroles(where);
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
                "title": new RegExp('' + req.query.where + '', 'i')
            }]
        };        
    } 
    var filtered = await roleDatalayers.gettotalroles(where);
    roleDatalayers.getRoles(where, params)
        .then((doc) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
                total: total,
                filtered: filtered,
            })
        }).catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: message.SOMETHING_WENT_WRONG,
                error: err
            })
        })

}

exports.save = async(req, res) => {
    let data = req.body;
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
        res.json({
            err: errorCodes.BAD_REQUEST,
            msg: "Something Went Wrong",
            error: validation,
        });
        return;
    }

    let lastRole = await roleDatalayers.getLastRoles();
    data.role_code = lastRole;
    roleDatalayers.save(data)
        .then((doc) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: ""
            })
        }).catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: message.SOMETHING_WENT_WRONG,
                error: err
            })
        })
}

exports.edit = async(req, res) => {
    if (req.method == "POST") {
        let body = req.body; 
        const validation = validationResult(req);
       /*
        if (!validation.isEmpty()) {
            res.json({
                err: errorCodes.BAD_REQUEST,
                msg: "Something Went Wrong",
                error: validation,
            });
            return;
        }*/
        roleDatalayers.update(mongodb.ObjectId(body._id), body)
            .then((doc) => {
                res.json({
                    success: errorCodes.SUCEESS,
                    msg: message.SUCCESS,
                    data: doc
                });
            }).catch((err) => {
                res.json({
                    success: errorCodes.BAD_REQUEST,
                    msg: message.SOMETHING_WENT_WRONG,
                    error: err
                });
            });
    } else {
        roleDatalayers.getRoleById(mongodb.ObjectId(req.params.id))
            .then((doc) => {
                res.json({
                    success: errorCodes.SUCEESS,
                    msg: message.SUCCESS,
                    data: doc
                })
            }).catch((err) => {
                res.json({
                    success: errorCodes.RESOURCE_NOT_FOUND,
                    msg: message.SOMETHING_WENT_WRONG,
                    error: err
                })
            })
    }
}

exports.status = async(req, res) => {
    body = req.body;

    roleDatalayers.update(mongodb.ObjectId(body._id), body)
        .then((doc) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc
            })
        }).catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: message.SOMETHING_WENT_WRONG,
                error: err
            })
        })
}

exports.getallmodule = async(req, res) => {   
    let where  =  {}
    modulesDatalayers.getallmodule(where)
        .then((doc) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc
            })
        }).catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: message.SOMETHING_WENT_WRONG,
                error: err
            })
        })
}

exports.getuserpermission = async(req, res) => {  
    let where  = { userId: mongodb.ObjectId(req.params.userId) }  ;
 
    adminpermissionDatalayers.getuserpermission(where)
        .then((doc) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc
            })
        }).catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: message.SOMETHING_WENT_WRONG,
                error: err
            })
        })
}


exports.getuserpagepermission = async(req, res) => {  
    let where  = { "userId": mongodb.ObjectId(req.params.userId), "name":req.params.page };
    adminpermissionDatalayers.getuserpermission(where)
        .then((doc) => {
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc
            })
        }).catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                msg: message.SOMETHING_WENT_WRONG,
                error: err
            })
        })
}


exports.saveuserpermission = async(req, res) => {
    
    var param = req.body; 
    // Inserting data in the Database
    adminpermissionDatalayers
        .saveuserpermission(param)
        .then((doc) => { 
            let where  = { userId: mongodb.ObjectId(doc[0].userId) }  ;
            adminpermissionDatalayers.getuserpermission(where)
            .then((doc) => {
                res.json({
                    success: errorCodes.SUCEESS,
                    msg: message.SUCCESS,
                    data: doc
                })
            }).catch((err) => {
                res.json({
                    success: errorCodes.RESOURCE_NOT_FOUND,
                    msg: message.SOMETHING_WENT_WRONG,
                    error: err
                })
            })  
        })
        .catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                code: message.SOMETHING_WENT_WRONG,
                error: err
            });
        });
     
};

exports.updateuserpermission = async(req, res) => {
    
    var param = req.body; 
    // Inserting data in the Database
    adminpermissionDatalayers
        .updateuserpermission(param)
        .then((doc) => { 
            res.json({
                success: errorCodes.SUCEESS,
                msg: message.SUCCESS,
                data: doc
            })  
        })
        .catch((err) => {
            res.json({
                success: errorCodes.RESOURCE_NOT_FOUND,
                code: message.SOMETHING_WENT_WRONG,
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

    roleDatalayers.statusAll(idArr, is_active)
        .then((product) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: product
            });
        }).catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        })

};

exports.validation = (method) => {
    switch (method) {
        case "save_role":
            {
                return [
                    check("title", "Role name is required").exists().not().isEmpty()
                    .custom((title, { req }) => {
                        return roleDatalayers.getRoles({ title: new RegExp(["^", title, "$"].join(""), "i") })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`Role named "${title}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                    })
                ];
                break;
            }
        case "update_role":
            {
                return [
                    check("title", "Role name is required").exists().not().isEmpty()
                    .custom((title, { req }) => {
                        return roleDatalayers.getRoles({ _id: { $ne: mongodb.ObjectId(req.body._id) }, title: new RegExp(["^", title, "$"].join(""), "i") })
                            .then((result) => {
                                if (result.length > 0) {
                                    throw new Error(`Role named "${title}" is already exists`);
                                } else {
                                    return true;
                                }
                            });
                    })
                ];
                break;
            }
    }
};