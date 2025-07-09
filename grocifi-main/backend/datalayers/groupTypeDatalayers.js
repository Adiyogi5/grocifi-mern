const groupTypeModel = require("../modules/groupTypes");
const userModel = require("../modules/User");

exports.listAll = (where = {}) => {
    return new Promise((res, rej) => {
        groupTypeModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.create = (paramBody) => {
    return new Promise((res, rej) => {
        groupTypeModel.create(paramBody)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.edit = (id, paramBody) => {
    return new Promise((res, rej) => {
        groupTypeModel
            .findByIdAndUpdate(id, {
                $currentDate: { modified: true },
                $set: paramBody,
            })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (id) => {
    return new Promise((res, rej) => {
        groupTypeModel
            .findByIdAndRemove(id)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.manageRouting = async(userId) => {
    var data = await userModel.find({ _id: userId });
    return new Promise((res, rej) => {
        if (data.length > 0) {
            var role = data[0].role_type;
            userModel
                .aggregate([
                    { $match: { role_type: data[0].role_type } },
                    {
                        $lookup: {
                            from: "group_type_models",
                            localField: "role_type",
                            foreignField: "Role_title",
                            as: "group_Type_Controll",
                        },
                    },
                    {
                        $unwind: {
                            path: "$group_Type_Controll",
                        },
                    },
                    {
                        $lookup: {
                            from: "list_controller_actions",
                            localField: "group_Type_Controll.list_controller_id",
                            foreignField: "_id",
                            as: "list_controller",
                        },
                    },
                    {
                        $unwind: {
                            path: "$list_controller",
                        },
                    },
                    {
                        $project: {
                            "fname": 1,
                            "lname": 1,
                            "phone_no": 1,
                            "group_Type_Controll.Role_title": 1,
                            "list_controller.controller": 1,
                            "list_controller.controller_action": 1,
                        },
                    }
                ])
                .then((doc) => {
                    res(doc);
                }).catch((err) => {
                    rej(err);
                });
        } else {
            rej(false);
        }
    })
}