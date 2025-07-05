const moment = require("moment");
const mongoose = require("mongoose");
const orderModel = require("../modules/Order");
const productModel = require("../modules/Products");
const orderstatusModel = require("../modules/OrderStatus");
const orderVariantModel = require("../modules/Order-variants");
const dailyOrderFinalListModel = require("../modules/DailyOrderFinalList");
const dailyOrderFinalListProduct = require("../modules/DailyOrderFinalListProduct");

const orderLogs = require("../modules/logs"); 

exports.gettotalOrders = async(where) => {
    return new Promise((res, rej) => { 
        if (where) {
            orderModel.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $lookup: {
                            from: "franchises",
                            localField: "franchiseId",
                            foreignField: "_id",
                            as: "franchise",
                        },
                    },
                    {
                        $lookup: {
                            from: "addresses",
                            as: "delivery_address",
                            localField: "delivery_address_id",
                            foreignField: "_id",
                        },
                    },
                    /*{
                        $unwind: {
                            path: "$orders",
                            preserveNullAndEmptyArrays: true,
                        },
                    },*/
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$franchise",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$delivery_address",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    
                    {
                        $project: {
                            full_name: {
                                $concat: ["$user.fname", " ", "$user.lname"],
                            },
                            franchiseId:1,
                            orderUserId:1,
                            phone_no: 1,
                            firmname: "$franchise.firmname",
                            country: "$delivery_address.countryId",
                            state: "$delivery_address.stateId",
                            city: "$delivery_address.cityId",
                            area: "$delivery_address.areaId",
                            payment_method:1,
                            delivery_date: 1,
                            created:1,
                            is_active: 1,
                            is_wholesaler:1,
                            delivery_time_id: 1
                        },
                    },
                    {
                        $match: where,
                    },
                ])
                .then((doc) => {
                    res(doc.length);
                })
                .catch((error) => {
                    rej(error);
                });
        } else {
            orderModel
                .countDocuments(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.exportAllorders = (where) => {
    return new Promise((resolve, reject) => {
        orderModel.aggregate([{
                    $lookup: { 
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $lookup: { 
                        from: "franchises",
                        localField: "franchiseId",
                        foreignField: "_id",
                        as: "franchise",
                    },
                },
                {
                    $lookup: {
                        from: "addresses",
                        as: "deliveryaddress",
                        localField: "delivery_address_id",
                        foreignField: "_id",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "delivery_boy_id",
                        foreignField: "_id",
                        as: "delivery_boy",
                    },
                },
                {
                    $lookup: {
                        from: "areas",
                        localField: "deliveryaddress.areaId",
                        foreignField: "_id",
                        as: "area",
                    },
                },
                {
                    $unwind: {
                        path: "$orders",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$franchise",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$deliveryaddress",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$delivery_boy",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$area",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "order_variants",
                        let: { "orderId": "$_id" }, 
                        pipeline: [{
                                $match: {
                                    $expr: { $eq: ["$orderId", "$$orderId"] },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    productId: 1,
                                    franchiseId: 1,
                                    frproductId: 1,
                                    frproductvarId: 1,
                                    order_status: 1,
                                    delivery_date: 1,
                                    created: 1,
                                    qty: 1,
                                    price: 1,
                                    wholesale_discount: 1,
                                    wholesale_price: 1,
                                    subtotal: { $multiply: ["$qty", "$price"] },
                                    image_url: 1,
                                    measurement: 1,
                                    unit: 1,
                                    title: 1,
                                    orderId: 1,
                                }
                            }, 
                        ],
                        as: "variants", 
                    }
                },
                {
                    $project: {
                        _id: 1,
                        total: 1,
                        orderUserId:1,
                        userId: 1,
                        created: 1,
                        phone_no: 1,
                        franchiseId:1,
                        is_wholesaler:1,
                        is_active: 1,
                        ordered_by: 1,
                        delivery_charge: 1,
                        final_total: 1,
                        wholesale_discount: {
                            $subtract: [
                                { 
                                    $sum: "$variants.subtotal" 
                                },
                                "$total"  
                            ]
                        },
                        delivery_date: 1,
                        delivery_time: 1,
                        payment_method: 1,
                        delivery_boy_id: 1,
                        delivery_time_id: 1,
                        key_wallet_balance: 1,
                        delivery_address:1,
                        order_address:1,
                        firmname: "$franchise.firmname",
                        full_name: {
                            $concat: ["$user.fname", " ", "$user.lname"],
                        },
                        delivery_boy: {
                            $concat: ["$delivery_boy.fname", " ", "$delivery_boy.lname"],
                        },
                        area_title: "$area.title",
                        country: "$deliveryaddress.countryId",
                        state: "$deliveryaddress.stateId",
                        city: "$deliveryaddress.cityId",
                        area: "$deliveryaddress.areaId",
                        variants :"$variants"
                    }
                },
                {
                    $match: where,
                },
                {
                    $sort: { created: -1 }
                } 
            ])
            .then((orders) => { 
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
    
};

exports.getAllorders = (where, params) => {
    ///console.log(where, params);
    if (params.limit > 0) {
        return new Promise((resolve, reject) => {
            orderModel
                .aggregate([{
                        $lookup: { 
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $lookup: { 
                            from: "franchises",
                            localField: "franchiseId",
                            foreignField: "_id",
                            as: "franchise",
                        },
                    },
                    {
                        $lookup: {
                            from: "addresses",
                            as: "delivery_address",
                            localField: "delivery_address_id",
                            foreignField: "_id",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "delivery_boy_id",
                            foreignField: "_id",
                            as: "delivery_boy",
                        },
                    },
                    {
                        $lookup: {
                            from: "areas",
                            localField: "delivery_address.areaId",
                            foreignField: "_id",
                            as: "area",
                        },
                    },
                    {
                        $unwind: {
                            path: "$orders",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$franchise",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$delivery_address",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$delivery_boy",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$area",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                   
                    {
                        $project: {
                            _id: 1,
                            total: 1,
                            orderUserId:1,
                            userId: 1,
                            created: 1,
                            phone_no: 1,
                            franchiseId:1,
                            is_wholesaler:1,
                            is_active: 1,
                            ordered_by: 1,
                            final_total: 1,
                            delivery_date: 1,
                            delivery_time: 1,
                            payment_method: 1,
                            delivery_boy_id: 1,
                            delivery_time_id: 1,
                            key_wallet_balance: 1,
                            firmname: "$franchise.firmname",
                            full_name: {
                                $concat: ["$user.fname", " ", "$user.lname"],
                            },
                            delivery_boy: {
                                $concat: ["$delivery_boy.fname", " ", "$delivery_boy.lname"],
                            },
                            area_title: "$area.title",
                            country: "$delivery_address.countryId",
                            state: "$delivery_address.stateId",
                            city: "$delivery_address.cityId",
                            area: "$delivery_address.areaId",
                            // variants:"$variants"
                        }
                    },
                    {
                        $match: where,
                    },
                    {
                        $sort: {
                            [params.order]: params.dir,
                        }
                    }, 
                    { $skip: params.skip },
                    { $limit: params.limit },
                ])
                .then((orders) => {
                    resolve(orders);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    } else {
        return new Promise((resolve, reject) => {
            orderModel
                .aggregate([{
                        $match: where,
                    },
                    {
                        $project: {
                            order: "$$ROOT",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "order.userId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $lookup: {
                            from: "addresses",
                            as: "delivery_address",
                            localField: "order.delivery_address_id",
                            foreignField: "_id",
                        },
                    },
                    {
                        $sort: { "order.created": -1 },
                    },
                ])
                .then((orders) => {
                    resolve(orders);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

exports.getOrderByCatDate = (fdate, tdate, franchise_id, orderCat) => {
    ///console.log(fdate, tdate);
    return new Promise((resolve, reject) => { 

        if(orderCat==''){
                orderModel
                .aggregate([  
                    {
                        $match: { 
                            created: { $gte: fdate, $lt: tdate },
                            is_active: { $eq: "4" },
                            franchiseId: franchise_id
                        },
                    },
                    {
                            $project: {
                                "_id": 1, 
                                "orderId": 1, 
                                "franchiseId":1,
                                "userId":1,
                                "is_wholesaler":1,
                                "key_wallet_balance":1,
                                "promo_discount":1,
                                "total":1,
                                "final_total":1,
                                "created":1,
                                "is_active":1, 
                            }
                        },
                    {
                        $sort: { "order.created": 1 },
                    },
                ])
                .then((orders) => {
                    resolve(orders);
                })
                .catch((error) => {
                    reject(error);
                }); 
            }else{
                
                orderModel
                .aggregate([ 
                    {
                        $lookup: {
                            from: "order_variants",
                            let: { "orderId": "$_id" }, 
                            pipeline: [{
                                    $match: {
                                        $expr: { $eq: ["$orderId", "$$orderId"] },
                                    },
                                }, 
                                {
                                    $lookup: {
                                        from: "products",
                                        let: { "productId": "$productId" },
                                        pipeline: [{
                                                $match: {
                                                    $expr: { $eq: ["$_id", "$$productId"] },
                                                },
                                            },
                                            {
                                                $lookup: {
                                                    from: "catagory_subcatagories",
                                                    let: { "catId": "$catId" },
                                                    pipeline: [{
                                                        $match: {
                                                            $expr: { $eq: ["$_id", "$$catId"] }, 
                                                        },
                                                    }, ],
                                                    as: "cats",
                                                },
                                            },
                                            {
                                                $unwind: {
                                                    path: "$cats",
                                                    preserveNullAndEmptyArrays: true,
                                                },
                                            },
                                            {
                                                $project: {
                                                    "_id": 1, 
                                                    "catId": 1, 
                                                    catagory_id: "$cats.catagory_id" 
                                                }
                                            },
                                            
                                        ],
                                        as: "product",
                                    }, 
                                },
                                {
                                    $unwind: {
                                        path: "$product",
                                        preserveNullAndEmptyArrays: true,
                                    },
                                },
                                {
                                    $project: {
                                        "_id": 1, 
                                        "orderId": 1, 
                                        product: "$product" 
                                    }
                                },
                            ],
                            as: "variants", 
                        }
                    },
                    /*{
                        $unwind: {
                            path: "$variants",
                            preserveNullAndEmptyArrays: true,
                        },
                    },*/                    
                    {
                            $project: {
                                "_id": 1, 
                                "orderId": 1, 
                                "franchiseId":1,
                                "userId":1,
                                "is_wholesaler":1,
                                "key_wallet_balance":1,
                                "promo_discount":1,
                                "total":1,
                                "final_total":1,
                                "created":1,
                                "is_active":1,
                                variants: "$variants" 
                            }
                        },
                    {
                        $match: { 
                            created: { $gte: fdate, $lt: tdate },
                            is_active: { $eq: "4" },
                            franchiseId: franchise_id,
                            $or: [{ "variants.product.catagory_id":orderCat }, { "variants.product.catId":orderCat }]
                        },
                    },    
                    {
                        $sort: { "order.created": 1 },
                    },
                ])
                .then((orders) => {
                    resolve(orders);
                })
                .catch((error) => {
                    reject(error);
                }); 
            }
    });
};


exports.getOrderByDate = (fdate, tdate, franchise_id) => {
    ///console.log(fdate, tdate);
    return new Promise((resolve, reject) => {
        if(franchise_id==''){
            orderModel
            .aggregate([{
                    $match: {
                        created: { $gte: fdate, $lt: tdate },
                        is_active: { $eq: "4" }, 
                    },
                },
                {
                    $sort: { "order.created": 1 },
                },
            ])
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
        }else{
            orderModel
            .aggregate([{
                    $match: {
                        created: { $gte: fdate, $lt: tdate },
                        is_active: { $eq: "4" },
                        franchiseId: franchise_id,
                    },
                },
                {
                    $sort: { "order.created": 1 },
                },
            ])
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
        }
    });
};


exports.gettotalOrderLog = async(where) => {
    return new Promise((res, rej) => {
        if (where) {
            orderModel.aggregate([{
                        $lookup: {
                            as: "users",
                            localField: "userId",
                            foreignField: "_id",
                            from: "users"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$users",
                            "preserveNullAndEmptyArrays": true
                        }
                    }, {
                        $lookup: {
                            as: "franchise",
                            localField: "franchiseId",
                            foreignField: "_id",
                            from: "franchises"
                        }
                    }, {
                        "$unwind": {
                            "path": "$franchise",
                            "preserveNullAndEmptyArrays": true
                        }
                    }, {
                        $project: {
                            _id: 1,
                            total: 1,
                            usersName: { $concat: ["$users.fname", " ", "$users.lname"] },
                            franchiseName: '$franchise.firmname'

                        },
                    },
                    { $match: where },
                ])
                .then((order) => {
                    res(order.length);
                })
                .catch((error) => {
                    rej(error);
                });
        } else {
            orderModel.countDocuments(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getOrderByUserId = (where, params) => {
    return new Promise((resolve, reject) => {
        if (params.limit == 0) {
            orderModel.find(where).sort({ '_id': -1 })
                .then((orders) => {
                    resolve(orders);
                })
                .catch((error) => {
                    reject(error);
                });
        } else {
            orderModel.aggregate([{
                        $lookup: {
                            as: "users",
                            localField: "userId",
                            foreignField: "_id",
                            from: "users"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$users",
                            "preserveNullAndEmptyArrays": true
                        }
                    }, {
                        $lookup: {
                            as: "franchise",
                            localField: "franchiseId",
                            foreignField: "_id",
                            from: "franchises"
                        }
                    }, {
                        "$unwind": {
                            "path": "$franchise",
                            "preserveNullAndEmptyArrays": true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            franchiseId: 1,
                            order_type: 1,
                            order_desc: 1,
                            delivery_boy_id: 1,
                            discount: 1,
                            discount_rupee: 1,
                            promo_code: 1,
                            promo_discount: 1,
                            delivery_date: 1,
                            delivery_day: 1,
                            delivered_date: 1,
                            version_code: 1,
                            tax_percent: 1,
                            tax_amount: 1,
                            total: 1,
                            final_total: 1,
                            is_active: 1,
                            phone_no: 1,
                            delivery_charge: 1,
                            delivery_time_id: 1,
                            delivery_time: 1,
                            key_wallet_used: 1,
                            key_wallet_balance: 1,
                            remaining_wallet_balance: 1,
                            payment_method: 1,
                            latititude: 1,
                            longitude: 1,
                            created: 1,
                            modified: 1,
                            createdby: 1,
                            modifiedby: 1,
                            userId: 1,
                            orderUserId: 1,
                            razorpay_payment_id: 1,
                            delivery_address: 1,
                            usersName: { $concat: ["$users.fname", " ", "$users.lname"] },
                            franchiseName: '$franchise.firmname'
                        }
                    },
                    { $match: where },
                    {
                        $sort: {
                            [params.order]: params.dir
                        }
                    },
                    { $skip: params.skip },
                    { $limit: params.limit },
                ])
                .then((orders) => {
                    resolve(orders);
                })
                .catch((error) => {
                    reject(error);
                });
        }
    });
};

exports.getOrderWhere = (where) => {
    return new Promise((resolve, reject) => {
        orderModel
            .find(where)
            .sort({ _id: -1 })
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.getDboyOrderCounts = async(where) => {
    return new Promise((res, rej) => { 
            orderModel.aggregate([{
                        $lookup: {
                            as: "users",
                            localField: "userId",
                            foreignField: "_id",
                            from: "user"
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$user",
                            "preserveNullAndEmptyArrays": true
                        }
                    },  
                    { $match: where },
                    {
                        $project: {
                            delivery_boy_id:1,
                            phone_no: 1,
                            usersName: { $concat: ["$user.fname", " ", "$user.lname"] } 
                        },
                    },
                     
                ])
                .then((order) => {
                    res(order.length);
                })
                .catch((error) => {
                    rej(error);
                });
         
    });
}; 

exports.gettotalDboyOrder = async(where) => {
    return new Promise((resolve, reject) => {  
        if(where){   
            orderModel.aggregate([  
             {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
             {
                "$unwind": {
                    "path": "$user",
                    "preserveNullAndEmptyArrays": true
                }
            },
            { $match: where }, {
                $project: { 
                    phone_no: 1,
                    delivery_boy_id:1,
                    orderUserId:1,
                    userName: {$concat: ['$user.fname','','$user.lname']},
                }
            },
             
            ]).then((order) => {
                resolve(order.length);
            }).catch((error) => {
                reject(error);
            }); 
        }else{
           orderModel.countDocuments(where)
            .then((doc) => {
                resolve(doc);
            })
            .catch((error) => {
                reject(error);
            }); 
        }
    });
};


exports.getOrderByDboyId = (where) => {
    return new Promise((resolve, reject) => {
        orderModel
            .aggregate([{
                    $match: where,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        orderUserId: 1,
                        is_active: 1,
                        phone_no: 1,
                        payment_method: 1,
                        latitude: 1,
                        longitude: 1,
                        created: 1,
                        review: 1,
                        "user.fname": 1,
                        "user.lname": 1,
                    },
                },
                {
                    $sort: { _id: -1 },
                },
            ])
            .then((doc) => {
                resolve(doc);
            })
            .catch((error) => {
                reject(error);
            });
    });
};


exports.getOrderlistDboyId = (where, params) => {
    return new Promise((resolve, reject) => {
        if(params.limit==0){
            orderModel
            .aggregate([{
                    $match: where,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        orderUserId: 1,
                        is_active: 1,
                        phone_no: 1,
                        payment_method: 1,
                        latitude: 1,
                        longitude: 1,
                        created: 1,
                        review: 1,
                        delivery_boy_id:1,
                        "user.fname": 1,
                        "user.lname": 1,
                    },
                },
                {
                    $sort: { _id: -1 },
                },
            ])
            .then((doc) => {
                resolve(doc);
            })
            .catch((error) => {
                reject(error);
            });
        }else{ 
            orderModel.aggregate([  
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },{
                    "$unwind": {
                        "path": "$user",
                        "preserveNullAndEmptyArrays": true
                    }
                },   
                {
                    $project: { 
                        _id: 1,
                        orderUserId: 1,
                        is_active: 1,
                        phone_no: 1,
                        tax_percent:1,
                        discount:1,
                        delivery_charge:1,
                        total:1,
                        opm_total:1,
                        final_total:1,
                        payment_method: 1,
                        received_total:1,
                        delivery_total:1,
                        promo_discount:1,
                        key_wallet_balance:1,
                        opm_total:1,
                        latitude: 1,
                        longitude: 1,
                        created: 1,
                        review: 1,
                        delivery_boy_id:1,
                        "user.fname": 1,
                        "user.lname": 1,
                        userName: {$concat: ['$user.fname',' ','$user.lname']},
                    }
                },
                { $match: where },
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },                
            ])
            .then((order) => {
                resolve(order);
            })
            .catch((error) => {
                reject(error);
            }); 
        }
    });
};


//orderVariantModel
exports.getTodaysOrder = (rDate, nDate, franchise_id, orderType, orderCat) => {
    return new Promise((resolve, reject) => {
        if(orderType==''){
            if(orderCat==''){
                var cmatch  = { 
                    delivery_date: { $gte: rDate, $lt: nDate },
                    productId: { $ne: null }, 
                    franchiseId: franchise_id
                }
            }else{
                var cmatch  = { 
                    delivery_date: { $gte: rDate, $lt: nDate },
                    productId: { $ne: null }, 
                    franchiseId: franchise_id, 
                    $or: [{ "product.catagory_id":orderCat }, { "product.catId":orderCat }]
                }
            }
        }else{
            if(orderType=='2'){
                var worderType = true;             
            }else if(orderType=='1'){
                var worderType = false;     
            }
            if(orderCat==''){
                var cmatch  = { 
                    delivery_date: { $gte: rDate, $lt: nDate },
                    productId: { $ne: null },
                    franchiseId: franchise_id,
                    "main_order.is_wholesaler": worderType
                };
            }else{
                var cmatch  = { 
                    delivery_date: { $gte: rDate, $lt: nDate },
                    productId: { $ne: null },
                    franchiseId: franchise_id,
                    "main_order.is_wholesaler": worderType,
                    $or: [{ "product.catagory_id":orderCat }, { "product.catId":orderCat }]
                };
            }
        } 
        ////console.log(cmatch);
        orderVariantModel
            .aggregate([
                {
                    $lookup: {
                        from: "orders",
                        localField: "orderId",
                        foreignField: "_id",
                        as: "main_order",
                    },
                },
                /*{
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                {
                    $lookup: {
                        from: "catagory_subcatagories",
                        localField: "product.catId",
                        foreignField: "_id",
                        as: "cats",
                    },
                },*/
                {
                    $lookup: {
                        from: "products",
                        let: { "productId": "$productId" },
                        pipeline: [{
                                $match: {
                                    $expr: { $eq: ["$_id", "$$productId"] },
                                },
                            },
                            {
                                $lookup: {
                                    from: "catagory_subcatagories",
                                    let: { "catId": "$catId" },
                                    pipeline: [{
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$catId"] }, 
                                        },
                                    }, ],
                                    as: "cats",
                                },
                            },
                            {
                                $unwind: {
                                    path: "$cats",
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $project: {
                                    "_id": 1,
                                    "title": 1,
                                    "catId": 1,
                                    "description": 1,
                                    "images": 1,
                                    "is_active": 1, 
                                    catagory_id: "$cats.catagory_id" 
                                }
                            },
                            
                        ],
                        as: "product",
                    },
                },
                {
                    $match: cmatch,
                },
                {
                    $sort: { "cats.priority": 1 },
                },
            ])
            .then((orders) => { 
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            }); 
    });
};

exports.getOrderForAvg = (fromDate, toDate, franchise_id) => {
    return new Promise((res, rej) => { 
        if(franchise_id==''){
            orderModel
            .aggregate([{
                $match: {
                    is_active: "4", 
                    created: { $gte: fromDate, $lte: toDate },
                },
            }, ])
            .then((orders) => {
                res(orders);
            })
            .catch((error) => {
                rej(error);
            });
        }else{
            orderModel
            .aggregate([{
                $match: {
                    is_active: "4",
                    franchiseId: franchise_id,
                    created: { $gte: fromDate, $lte: toDate },
                },
            }, ])
            .then((orders) => {
                res(orders);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getTotalOrderCount = (franchise_id) => {
    return new Promise((res, rej) => {
        if(franchise_id==''){
            orderModel
            .countDocuments()
            .then((orders) => {
                res(orders);
            })
            .catch((error) => {
                rej(error);
            });
        }else{
            orderModel
                .countDocuments({franchiseId: franchise_id})
                .then((orders) => {
                    res(orders);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getTodayAndLastWeekOrders = (fromDate, toDate, franchise_id) => {
    return new Promise((res, rej) => {
        if(franchise_id==''){
            orderModel
            .aggregate([{
                    $match: { created: { $gte: fromDate, $lt: toDate } },
                },
                {
                    $count: "orders",
                },
            ])
            .then((orders) => {
                res(orders);
            })
            .catch((error) => {
                rej(error);
            });
        }else{
            orderModel
            .aggregate([{
                    $match: { created: { $gte: fromDate, $lt: toDate }, franchiseId: franchise_id },
                },
                {
                    $count: "orders",
                },
            ])
            .then((orders) => {
                res(orders);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getTotalSaleOrderCount = (fromDate, toDate, franchise_id) => {
    return new Promise((res, rej) => {
        orderModel
            .aggregate([
                { $match: { created: { $gte: fromDate, $lt: toDate }, franchiseId: franchise_id, is_active: {$eq: '4'} } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m",
                                date: "$created",
                            },
                        },
                        count: { $sum: 1 },
                        sum: { $sum: "$final_total" },
                    },
                },
                { $sort: { _id: 1 } },
            ])
            .then((orders) => {
                res(orders);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.trackMyOrder = (orderId) => {
    return new Promise((resolve, reject) => {
        orderModel
            .aggregate([{
                    $project: {
                        order: "$$ROOT",
                    },
                },
                {
                    $match: { _id: orderId },
                },
                {
                    $lookup: {
                        from: "order_variants",
                        localField: "order._id",
                        foreignField: "orderId",
                        as: "order_variants",
                    },
                },
                {
                    $lookup: {
                        from: "orderstatuses",
                        localField: "order._id",
                        foreignField: "orderId",
                        as: "ostatus",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        as: "user",
                        localField: "order.userId",
                        foreignField: "_id",
                    },
                },
                {
                    $lookup: {
                        from: "addresses",
                        as: "delivery_address",
                        localField: "order.delivery_address_id",
                        foreignField: "_id",
                    },
                },
                {
                    $sort: { "orderstatuses.created": -1 },
                },
            ])
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.getOrderById = (orderId) => {
    return new Promise((resolve, reject) => {
        orderModel
            .aggregate([{
                    $project: {
                        ord: "$$ROOT",
                    },
                },
                {
                    $match: { _id: orderId },
                },
                {
                    $lookup: {
                        from: "orderstatuses",
                        localField: "ord._id",
                        foreignField: "orderId",
                        as: "orderstatus",
                    },
                },
                {
                    $unwind: {
                        path: "$orderstatus",
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ])
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.save = async(param) => {
    return new Promise((res, rej) => {
        orderModel.create(param)
            .then((order) => {
                if (order) {
                    orderstatusModel
                        .create({
                            orderId: order._id,
                            order_status: "1",
                            status_date: param.created,
                            created: param.created,
                            modified: param.created,
                        })
                        .then((doc) => {
                            res(order);
                        })
                        .catch((error) => {
                            throw error;
                        });
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.saveImgOrder = async(orderData) => {
    return new Promise((res, rej) => {
        orderModel
            .create(orderData)
            .then((order) => {
                if (order) {
                    orderstatusModel
                        .create({ orderId: order._id, order_status: "1" })
                        .then((doc) => {
                            res(order);
                        })
                        .catch((error) => {
                            throw error;
                        });
                }
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.updateStatus = (body) => {
    return new Promise((res, rej) => {
        var orderId = body._id;
        delete body._id;
        var createdDate = new Date();
        createdDate = moment(createdDate).add(5, "hours").add(30, "minutes");
        if (body.is_active == "4") {
            body.delivered_date = createdDate;
        }

        orderModel.findOneAndUpdate({ _id: orderId }, { $currentDate: { modified: true }, $set: body }, { new: true })
            .then((data) => {
                orderstatusModel.create({
                    orderId: orderId,
                    order_status: body.is_active,
                    status_date: createdDate,
                    created: createdDate,
                    modified: createdDate,
                });
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.updateOrderRevised = (body) => {
    return new Promise((res, rej) => {
        var orderId = body._id;
        delete body._id;
        orderModel
            .updateOne({ _id: orderId }, { $currentDate: { modified: true }, $set: body })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};


exports.updateOrderPayment = (body) => {
    return new Promise((res, rej) => {
        var orderId = body.orderId;
        delete body.orderId;
        orderModel
            .updateOne({ _id: orderId }, { $currentDate: { modified: true }, $set: body })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.updateorderdeliveryaddress = (body) => {
    return new Promise((res, rej) => {
        var orderId = body._id;
        delete body._id;
        orderModel
            .updateOne({ _id: orderId }, { $currentDate: { modified: true }, $set: body })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.updateorderDeliveryBoy = (_id, delivery_boy_id) => {
    return new Promise((res, rej) => {
        orderModel.findOneAndUpdate({ _id: _id }, { $currentDate: { modified: true }, $set: { delivery_boy_id: delivery_boy_id } }, { new: true })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.edit = (param) => {
    return new Promise((res, rej) => {
        orderModel
            .findOne({ _id: param.orderId })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.update = async(body) => {
    return new Promise((res, rej) => {
        var orderId = body._id;
        delete body._id;
        orderModel.findOneAndUpdate({ _id: orderId }, { $currentDate: { modified: true }, $set: body })
            .then((data) => {
               /// console.log(data);
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        orderModel
            .updateMany({ _id: { $in: pId } }, { $currentDate: { modified: true }, $set: status })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (orderId) => {
    return new Promise((res, rej) => {
        orderModel
            .findByIdAndDelete(orderId)
            .then((order) => {
                if (!order) {
                    res(false);
                } else {
                    res(true);
                }
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.orderProcessDetail = async(val) => {
    return new Promise((res, rej) => {
        productModel
            .aggregate([{
                    $match: {
                        _id: mongoose.Types.ObjectId(val.productId),
                    },
                },
                {
                    $lookup: {
                        from: "productimages",
                        localField: "_id",
                        foreignField: "productId",
                        as: "productImg",
                    },
                },
                {
                    $lookup: {
                        from: "frproductvariants",
                        localField: "_id",
                        foreignField: "productId",
                        as: "productvar",
                    },
                },
                // {
                //   '$unwind': {
                //     'path': '$productvar'
                //   }
                // },
                {
                    $match: {
                        "productvar._id": mongoose.Types.ObjectId(
                            val.productvId
                        ),
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

exports.findOrderBeforeCancel = (where) => {
    return new Promise((resolve, reject) => {
        orderModel
            .findOne(where, { _id: 1 })
            .then((orders) => {
                if (orders != null) {
                    resolve(orders);
                } else {
                    resolve(204);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.updateluckydraw_onOrderDetail = (where) => {
    return new Promise((resolve, reject) => {
        orderVariantModel
            .find(where) 
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.findOrderDetail_onCondition = (where) => {
    return new Promise((resolve, reject) => {
        orderModel
            .find(where)
            .sort({ _id: -1 })
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.findOrderOrderVariants = (where) => {
    return new Promise((resolve, reject) => {
        orderVariantModel
            .find(where)
            .sort({ _id: -1 })
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};


exports.findbyField = (where) => {
    return new Promise((resolve, reject) => {
        orderModel
            .find(where)
            .then((orders) => {
                resolve(orders);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.getFinalOrderList = () => {
    return new Promise((res, rej) => {
        dailyOrderFinalListModel
            .find({})
            .sort({ _id: 1 })
            .then((doc) => {
                res(doc);
            })
            .catch((e) => {
                ///console.log(e);
                rej(e);
            });
    });
};

exports.getFinalOrderListById = (id) => {
    return new Promise((res, rej) => {
        dailyOrderFinalListModel
            .aggregate([{
                    $match: { _id: id },
                },
                {
                    $lookup: {
                        from: "daily_order_final_list_products",
                        as: "products",
                        localField: "_id",
                        foreignField: "daily_order_final_list_id",
                    },
                },
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((e) => {
               // console.log(e);
                rej(e);
            });
    });
};

exports.saveFinalOrderList = (main_data, list_data) => {
    return new Promise((res, rej) => {
        dailyOrderFinalListModel
            .create(main_data)
            .then((doc) => {
                list_data.forEach((ele, index) => {
                    list_data[index].daily_order_final_list_id = doc._id;
                });
                dailyOrderFinalListProduct.create(list_data);
                res(doc);
            })
            .catch((e) => {
               // console.log(e);
                rej(e);
            });
    });
};

exports.getFinalOrderListByDate = (date_from, date_to) => {
    //$match: { created: { $gte: fdate, $lt: tdate }, is_active: { $eq: '4' } }
    return new Promise((res, rej) => {
        dailyOrderFinalListModel
            .aggregate([{
                $match: { date_from: { $gte: date_from, $lt: date_to } },
            }, ])
            .then((doc) => {
                res(doc);
            })
            .catch((e) => {
                ///console.log(e);
                rej(e);
            });
    });
};

exports.saveOrderLog = (data) => {
    return new Promise((res, rej) => {
        orderLogs
            .create(data)
            .then((doc) => {
                res(true);
            })
            .catch((e) => {
                rej(e);
            });
    });
};

exports.saveReview = (_id, userId, body) => {
    return new Promise((res, rej) => {
        orderModel
            .findOneAndUpdate({ _id, userId }, { $currentDate: { modified: true }, $set: { review: body } }, { new: true })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};


exports.saveRevisedOrder = (params) => {
    return new Promise((res, rej) => {
        orderVariantModel.findOneAndUpdate({ _id: params._id }, { $currentDate: { modified: true }, $set: params }, { new: true })
            .then((data) => {
                res(data);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.orderListForOpm = async(where, product_id) => {

    return new Promise((res, rej) => {
        if(product_id==''){
            orderModel.aggregate([ 
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
                { $match: where },
                {
                    $sort: {
                        _id: -1
                    },
                },
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        }else{
            orderModel.aggregate([ 
                    {
                        $lookup: {
                           /* from: "order_variants",
                            localField: "_id",
                            foreignField: "orderId",
                            as: "order_variants",*/
                            from: "order_variants",
                            let: { "orderId": "$_id" }, 
                            pipeline: [
                              {
                                $match: {
                                  $expr: { $eq: ["$orderId", "$$orderId"] },
                                  productId: product_id,
                                },
                              },
                            ],
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
                    { $match: where },
                    {
                        $sort: {
                            _id: -1
                        },
                    },
                ])
                .then((doc) => {
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                });
        }
    });
};

exports.gettotaldailycollection = async(where) => {
    return new Promise((res, rej) => {  
            orderModel.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "delivery_boy_id",
                            foreignField: "_id",
                            as: "deliveryboy",
                        },
                    },
                    {
                        $lookup: {
                            from: "franchises",
                            localField: "franchiseId",
                            foreignField: "_id",
                            as: "franchise",
                        },
                    }, 
                    {
                        $unwind: {
                            path: "$deliveryboy",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$franchise",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $match: where,
                    }, 
                    {
                        $group: { 
                            _id: {
                                delivery_boy_id: "$delivery_boy_id",
                                full_name: {
                                    $concat: ["$deliveryboy.fname", " ", "$deliveryboy.lname"],
                                }, 
                                firmname:"$franchise.firmname", 
                            }, 
                            recived: { $sum: "$received_total" }, 
                            order_count: {$sum:1} 
                        },
                    },
                ])
                .then((doc) => {
                    res(doc.length);
                })
                .catch((error) => {
                    rej(error);
                });
         
    });
};


exports.getdailycollection = async(where) => {
    return new Promise((res, rej) => {  
            orderModel.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "delivery_boy_id",
                            foreignField: "_id",
                            as: "deliveryboy",
                        },
                    },
                    {
                        $lookup: {
                            from: "franchises",
                            localField: "franchiseId",
                            foreignField: "_id",
                            as: "franchise",
                        },
                    }, 
                    {
                        $unwind: {
                            path: "$deliveryboy",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $unwind: {
                            path: "$franchise",
                            preserveNullAndEmptyArrays: true,
                        },
                    },  
                    { $match: where },
                    {
                        $group: { 
                            _id: {
                                delivery_boy_id: "$delivery_boy_id", 
                                full_name: {
                                    $concat: ["$deliveryboy.fname", " ", "$deliveryboy.lname"],
                                }, 
                                firmname:"$franchise.firmname",  
                            }, 
                            recived: { $sum: "$received_total" }, 
                            order_count: {$sum:1}
                        },
                    },
                    { $sort : { created:-1 } }, 
                ])
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
         
    });
};
