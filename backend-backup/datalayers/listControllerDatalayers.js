const listcontrollerModel = require("../modules/ListControllerAction");
const controllerActionModel = require("../modules/ControllerAction");
const mongodb = require('mongoose');

exports.getAllAction = async() => {
    return new Promise((res, rej) => {
        listcontrollerModel.find().sort({ title: 1 })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.saveRoute = async(body) => {
    return new Promise((res, rej) => {
        listcontrollerModel.create(body)
            .then((data) => {
                //console.log(data);

                var grants = [];
                body.grants.forEach((element, index) => {
                    if (element) {
                        grants.push({ role_type: index + 1, action_id: data._id, createdby: body.createdby, modifiedby: body.modifiedby });
                    }
                });

                if (grants.length > 0) {
                    //console.log(grants);
                    controllerActionModel.insertMany(grants);
                }

                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getMyAccess = async(role_type) => {
    return new Promise((res, rej) => {
        controllerActionModel.aggregate([{
                    $match: { role_type: Number(role_type) }
                },
                {
                    $lookup: {
                        from: "listcontrolleractions",
                        as: "routes",
                        localField: "action_id",
                        foreignField: "_id",
                    }
                },
                {
                    $project: {
                        _id: 1,
                        action_id: 1,
                        is_active: 1,
                        role_type: 1,
                        "routes._id": 1,
                        "routes.title": 1,
                        "routes.controller": 1,
                        "routes.action": 1,
                        "routes.method": 1,
                        "routes.is_active": 1
                    }
                }
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                console.log(err);
                rej(err);
            });
    });
};

exports.edit = (routeId) => {
    return new Promise((res, rej) => {

        listcontrollerModel.aggregate([{
                    $match: { _id: routeId }
                },
                {
                    $lookup: {
                        from: "controlleractions",
                        as: "controlleractions",
                        localField: "_id",
                        foreignField: "action_id"
                    }
                }
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                console.log(err);
                rej(err);
            });
    });
};

exports.update = async(id, postData) => {
    return new Promise((res, rej) => {
        listcontrollerModel.updateOne({ _id: id }, {
                $currentDate: { modified: true },
                $set: postData,
            })
            .then((data) => {
                controllerActionModel.deleteMany({ action_id: id })
                    .then((dresult) => {
                        var grants = [];
                        postData.grants.forEach((element, index) => {
                            if (element) {
                                grants.push({ role_type: index + 1, action_id: id, createdby: postData.modifiedby, modifiedby: postData.modifiedby });
                            }
                        });

                        if (grants.length > 0) {
                            controllerActionModel.insertMany(grants)
                                .then((insResult) => {
                                    //************* */
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.status = (_id, is_active) => {
    return new Promise((res, rej) => {
        listcontrollerModel.findOneAndUpdate({ "_id": _id }, { $currentDate: { "modified": true }, $set: { "is_active": is_active } }, { new: true })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (id) => {
    return new Promise((res, rej) => {
        listcontrollerModel.findByIdAndDelete(id)
            .then((data) => {
                controllerActionModel.deleteMany({ action_id: mongodb.Types.ObjectId(id) })
                    .then((dres) => {
                        //-------------
                    })
                    .catch(err => {
                        console.log(err);
                    });
                res(data)
            })
            .catch((err) => {
                rej(err);
            });
    });
}