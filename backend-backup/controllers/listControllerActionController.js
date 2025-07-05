const lCADatalayers = require("../datalayers/listControllerDatalayers");
const errorCodes = require("../helpers/error_codes/errorCodes");
const message = require("../helpers/languages/english");
const mongodb = require('mongoose');

exports.getAllAction = async(req, res) => {
    lCADatalayers.getAllAction()
        .then((data) => {
            if (data.length > 0) {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    message: message.SUCCESS,
                    data: data,
                });
            } else {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND,
                    message: "Record(s) not found.",
                    data: "",
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                err,
            });
        });
};

exports.getMyAccess = async(req, res) => {
    var postedData = req.body;
    lCADatalayers.getMyAccess(postedData.role_type)
        .then((data) => {
            if (data.length > 0) {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    message: message.SUCCESS,
                    data: data,
                });
            } else {
                res.json({
                    sucess: errorCodes.DATA_NOT_FOUND,
                    message: "Record(s) not found.",
                    data: "",
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                err,
            });
        });
};

// function insert_rows() {
//     var data = [];

//     data.forEach((ele) => {
//         dataToBeSave.push({ title: ele, controller: ele.split("_")[0], action: ele.split("_")[1], method: "GET", createdby: createdby, modifiedby: createdby });
//     });

//     lCADatalayers.saveAll(dataToBeSave);

// }

exports.save = async(req, res) => {

    if (req.body.grants.length > 0) {
        //------------------
    } else {
        res.json({
            err: errorCodes.BAD_REQUEST,
            message: message.SOMETHING_WENT_WRONG,
            err,
        });
        return false;
    }

    lCADatalayers.saveRoute(req.body)
        .then((data) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                message: message.SUCCESS,
                data: data,
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                err,
            });
        });
};

exports.edit = async(req, res) => {
    if (req.method == "GET") {
        lCADatalayers.edit(mongodb.Types.ObjectId(req.params.routeId))
            .then((user) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    msg: "",
                    data: user,
                });
            })
            .catch((error) => {
                res.json({
                    err: errorCodes.RESOURCE_NOT_FOUND,
                    msg: "Record not updated. Try again.",
                    error: error,
                });
            });
    } else {
        var postData = req.body;
        var id = mongodb.Types.ObjectId(postData._id);
        lCADatalayers.update(id, postData)
            .then((data) => {
                res.json({
                    sucess: errorCodes.SUCEESS,
                    message: message.SUCCESS,
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    err: errorCodes.BAD_REQUEST,
                    message: message.SOMETHING_WENT_WRONG,
                    err,
                });
            });
    }
};

exports.delete = async(req, res) => {
    const id = req.params.Id;
    lCADatalayers.delete(id)
        .then((data) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                message: message.SUCCESS,
                data: "",
            });
        })
        .catch((err) => {
            res.json({
                err: errorCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                err,
            });
        });
};

exports.status = (req, res) => {
    lCADatalayers.status(mongodb.Types.ObjectId(req.body._id), req.body.is_active)
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