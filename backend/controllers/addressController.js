const mongodb = require('mongodb')
const ObjectId = require('mongoose').Types.ObjectId;
const addressDatalayers = require("../datalayers/addressDatalayers");
const userDatalayers = require("../datalayers/userDatalayer");
const errorsCodes = require("../helpers/error_codes/errorCodes");

exports.getAllAddresses = async (req, res) => {
    addressDatalayers
        .getAll_Address_On_Phone_no(req.query)
        .then((city) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: city,
            });
        })
        .catch((error) => {
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                error: error,
            });
        });
};

exports.logicalList = async (req, res) => {
    var condition = { userId: mongodb.ObjectId(req.params.userId), is_active: "1" };
    addressDatalayers.getAll_Address_On_Phone_no(condition)
        .then((active_address) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: active_address,
            });
        })
        .catch((error) => {
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                err: error,
            });
        });
};

exports.saveAddress = async (req, res) => {
    // this function only works if body receives flag for default_address
    const params = req.body;
    const condition = {};
    condition._id = mongodb.ObjectId(params.userId);
    condition.phone_no = params.phone_no;
    const doc = await userDatalayers.findbyField(condition);
    if (doc[0] != null) {
        if (params.default_address) {
            const address = await addressDatalayers.getAll_Address_On_Phone_no({ userId: params.userId, default_address: true });
            if (address[0]) {
                var id = mongodb.ObjectId(address[0]._id);
                await addressDatalayers.defaultAddress(id, mongodb.ObjectId(params.userId), false);
                addressDatalayers.saveAddress(params)
                    .then((doc) => {
                        res.json({
                            sucess: errorsCodes.SUCEESS,
                            msg: "Success",
                            data: "",
                        });
                    })
                    .catch((err) => {
                        res.json({
                            error: errorsCodes.RESOURCE_NOT_FOUND,
                            msg: "Something Went Wrong",
                            err: err,
                        });
                    });
            } else {
                addressDatalayers.saveAddress(params)
                    .then((doc) => {
                        res.json({
                            sucess: errorsCodes.SUCEESS,
                            msg: "Success",
                            data: "",
                        });
                    })
                    .catch((err) => {
                        res.json({
                            error: errorsCodes.RESOURCE_NOT_FOUND,
                            msg: "Something Went Wrong",
                            err: err,
                        });
                    });
            }
        } else {
            addressDatalayers.saveAddress(params)
                .then((doc) => {
                    res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: "Success",
                        data: "",
                    });
                })
                .catch((err) => {
                    res.json({
                        error: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Something Went Wrong",
                        err: err,
                    });
                });
        }
    } else {
        res.json({
            error: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Something Went Wrong",
            err: "No User Found",
        });
        // response json of no such data is found
    }
};

exports.edit = async (req, res) => {
    const id = req.params.aId;
    const param = req.body;
    addressDatalayers.editAddress(id, param)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                data: "",
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.SUCEESS,
                error: err,
            });
        });
};

exports.getaddress = async (req, res) => {
    addressDatalayers.getaddress(req.params.aId)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.SUCEESS,
                error: err,
            });
        });
};

exports.getDetailedAddress = async (req, res) => {
    addressDatalayers.getDetailedAddress(mongodb.ObjectId(req.params.aId))
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.SUCEESS,
                error: err,
            });
        });
};

exports.removedefaultAddress = async (req, res) => {
    var userId = mongodb.ObjectId(req.body.userId);
    addressDatalayers.removedefaultAddress(userId)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.BAD_REQUEST,
                error: err,
            });
        });
};

exports.defaultAddress = async (req, res) => {
    var _id = mongodb.ObjectId(req.body.address_id);
    var userId = mongodb.ObjectId(req.body.user_id);
    addressDatalayers.defaultAddress(_id, userId, req.body.default_address)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.BAD_REQUEST,
                error: err,
            });
        });
};

exports.logicallyDelete = async (req, res) => {
    addressDatalayers.logicallydelete({ _id: mongodb.ObjectId(req.body.address_id), is_active: "0" })
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.BAD_REQUEST,
                error: err,
            });
        });
};

exports.delete = async (req, res) => {
    const id = req.params.aId;
    addressDatalayers
        .deleteAddress(id)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                data: "",
            });
        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.RESOURCE_NOT_FOUND,
                error: err,
            });
        });
};

exports.completeDefaultAddress = async (req, res) => {
    const condition = { userId: mongodb.ObjectId(req.body.userId), default_address: true, is_active: '1' };
    addressDatalayers.getAll_Address_On_Phone_no(condition)
        .then((addressData) => {
            var addressData = addressData[0];
            var completeAddress = `${addressData.address1},${addressData.address2} pincode: ${addressData.pincode}`;
            let wholeAddress = {
                complete_address: completeAddress,
                address: addressData
            };
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: wholeAddress,
            });
        })
        .catch((error) => {
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                error: error,
            });
        });
};

exports.checkAddress = async (req, res) => {
    const condition = { userId: mongodb.ObjectId(req.body.userId), areaId: mongodb.ObjectId(req.body.areaId), is_active: '1' };
    var x = await addressDatalayers.getAll_Address_On_Phone_no(condition);
    var noAddress_flag = false;
    var deafaultAddress_flag = false;
    var result = [];

    try {
        // flag for no address for the user 
        if (x.length == 0) {
            var flag = {};
            flag.message = `Please Create a Address Record`;
            flag.no_address = true;
            result.push(flag);
            noAddress_flag = true
        }
        var no_ofAddress = x.length;
        var default_add = x.filter((elem) => {
            if (elem.default_address == true) {
                return elem
            }
        })
        // flag for default address for the user
        if (default_add.length == 0) {
            var flag = {};
            flag.message = `Please Create a Default Address Record`;
            flag.default_address = true;
            result.push(flag);
            deafaultAddress_flag = true;
        }
        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            flags: result,
            number_of_address: no_ofAddress,
            noAddress_flag: noAddress_flag,
            defaultAddress_flag: deafaultAddress_flag
        });
    } catch (error) {
        res.json({
            error: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "No record found.",
            error: error,
        });
    }
}

exports.getDefaultAddressOfUser = async (req, res) => {
    var userId = mongodb.ObjectId(req.params.userId)
    addressDatalayers.getDefaultAddressOfUser(userId)
        .then((doc) => {
            if (doc.length > 0) {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    data: doc,
                });
            } else {
                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    data: "",
                });
            }

        })
        .catch((err) => {
            res.json({
                msg: errorsCodes.SUCEESS,
                error: err,
            });
        });
};