const deliveryBoyModel = require("../modules/DeliveryBoy");
const mongoose = require("mongoose");

exports.getDeliveryBoy = async(condition = {}) => {
    return new Promise((resolve, reject) => {
        deliveryBoyModel.find(condition)
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.getDeliveryBoyx = async(condition = {}) => {
    return new Promise((resolve, reject) => {
        deliveryBoyModel
            .find(condition)
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.saveDeliveryBoy = async(param) => {
    return new Promise((resolve, reject) => {
        deliveryBoyModel
            .create(param)
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.editDeliveryBoy = async(id, param) => {
    return new Promise((resolve, reject) => {
        deliveryBoyModel
            .findOneAndUpdate({ _id: id }, { $currentDate: { modified: true }, $set: param })
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
}


exports.getDeliveryBoys = async(id) => {
    return new Promise((res, rej) => {
        deliveryBoyModel.aggregate([{
            '$match': {
                'franchiseId': mongoose.Types.ObjectId(id)
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user'
            }
        }, {
            '$project': {
                'is_active': 1,
                'user._id': 1,
                'user.fname': 1,
                'user.fname': 1,
                'user.lname': 1,
                'user.email': 1,
                'user.img': 1,
                'user.role_type': 1,
                'user.is_active': 1,
                'user.phone_no': 1
            }
        }]).then((data) => {
            res(data)
        }).catch((err) => {
            rej(err)
        })
    })
}

exports.deliveryboystatus = (where, is_active) => {
    return new Promise((res, rej) => {
        deliveryBoyModel.updateOne(where, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.deliveryboystatuschange = (where, is_active) => {
    return new Promise((res, rej) => {
        deliveryBoyModel.find(where)
            .then((result) => {
                if (result.length > 0) {
                    deliveryBoyModel.updateOne(where, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
                        .then((doc) => {
                            res(doc);
                        }).catch((err) => {
                            rej(err);
                        });
                } else {
                    deliveryBoyModel.create(where)
                        .then(
                            (result) => {
                                res(result);
                            }
                        )
                        .catch((err) => {
                            rej(err);
                        });
                }
            })
            .catch((err) => {
                rej(err);
            })


    });
};

exports.getDeliveryBoysDetails = async() => {
    return new Promise((resolve, reject) => {
        deliveryBoyModel.aggregate([{
                '$match': {
                    '_id': id
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'userDetail'
                }
            },
            {
                '$unwind': {
                    'path': '$userDetail'
                }
            },
            {
                '$lookup': {
                    'from': 'franchises',
                    'localField': 'franchiseId',
                    'foreignField': '_id',
                    'as': 'franchise_detail'
                }
            },
            {
                '$unwind': {
                    'path': '$franchise_detail'
                }
            },
        ]).then((doc) => {
            resolve(doc);
        }).catch((err) => {
            reject(err);
        });
    })
};

exports.getDeliveryBoysDetailsAll = async() => {
    return new Promise((resolve, reject) => {
        deliveryBoyModel.aggregate([{
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'as': 'user'
                }
            }, {
                '$unwind': {
                    'path': '$user'
                }
            }, {
                '$project': {
                    'user._id': 1,
                    'user.fname': 1,
                    'user.lname': 1,
                    'user.email': 1,
                    'user.img': 1,
                    'user.phone_no': 1,
                    'user.role_type': 1,
                    'user.is_active': 1
                }
            }])
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });

}