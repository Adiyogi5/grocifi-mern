const mongodb = require("mongoose");
const ordersModel = require("../modules/Order");
const orderVariantModel = require("../modules/Order-variants");
const frProductVariantsModel = require("../modules/FrProductVariants");

exports.findByField = async(where = {}) => {
    return new Promise((res, rej) => {
        orderVariantModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.save = async(param) => {
    return new Promise((res, rej) => {
        orderVariantModel
            .insertMany(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.orderStatus = async(condition) => {
    return new Promise((res, rej) => {
        var status = trackingOrder(condition);
        status
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};


exports.orderDetails = async(condition) => {
    return new Promise((res, rej) => {
        var status = Orderdetail(condition);
        status
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.orderVariantUpdate = async(id, condition) => {
    let order_status = condition.order_status;
    return new Promise((res, rej) => {
        orderVariantModel
            .updateOne({ frproductvarId: id }, {
                $currentDate: { modified: true },
                $set: { order_status: order_status },
            })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

var Orderdetail = async(condition) => {
     
    var where = {
        $match: { 
            _id: mongodb.Types.ObjectId(condition.orderId),
        },
    }; 

    return new Promise((res, rej) => {
        ordersModel
            .aggregate([
                where,
                {
                    $lookup: {
                        from: "order_variants",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "order_variants",
                    },
                },
                {
                    $lookup: {
                        from: "orderstatuses",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "status",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        as: "user",
                        localField: "userId",
                        foreignField: "_id",
                    },
                },
                {
                    $lookup: {
                        from: "franchises",
                        as: "franchise",
                        localField: "franchiseId",
                        foreignField: "_id",
                    },
                },
                {
                    $sort: {
                        created: -1,
                    },
                },
            ])
            .then((doc) => { 
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

var trackingOrder = async(condition) => {
    let userId = mongodb.Types.ObjectId(condition.userId);
    var where = { $match: { userId: userId } };

    if (condition.orderId != undefined) {
        where = {
            $match: {
                userId: userId,
                _id: mongodb.Types.ObjectId(condition.orderId),
            },
        };
    }

    return new Promise((res, rej) => {
        ordersModel
            .aggregate([
                where,
                {
                    $lookup: {
                        from: "order_variants",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "order_variants",
                    },
                }, 
                {
                    $lookup: {
                        from: "orderstatuses",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "status",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        as: "user",
                        localField: "userId",
                        foreignField: "_id",
                    },
                },
                {
                    $sort: {
                        created: -1,
                    },
                },
            ])
            .then((doc) => { 
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};


var variantValues = async(val) => {
    var result;
    var fnOrderVariants = [];
    val.forEach((element) => {
        // each order iteration
        var or = element.order_variants;
        or.forEach((elem) => {
            //  order varaints iteration
            let orDetail = [];
            frProductVariantsModel
                .findById(elem.frproductId)
                .then((doc) => {
                    elem.orderDetail = doc;
                    orDetail.push(elem);
                    result = orDetail;
                })
                .catch((err) => {
                    console.log(err);
                });
            result = elem;
        });
    });
    return result;
};