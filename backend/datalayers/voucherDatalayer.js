const fs = require("fs");
const moment = require('moment');
const voucherModel = require("../modules/Voucher");


exports.gettotalvouchers = async(where) => {
    return new Promise((res, rej) => {  
        if(where){      
            voucherModel.aggregate([ 
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
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
             {
                $lookup: {
                    from: "franchises",
                    localField: "user.franchise_id",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
             {
                "$unwind": {
                    "path": "$franchise",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $project: {
                    _id:1, 
                    created:1,
                    "user.franchise_id":1,
                    deliveryboy: {$concat: ['$user.fname',' ','$user.lname']},
                    franchiseName: {$concat: ['$franchise.firmname']},
                }
            },
            { $match: where }
            ]).then((voucher) => {
                res(voucher.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{          
            voucherModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });  
        }          
    });
};

exports.getVouchers = (where, params) => {
    return new Promise((res, rej) => { 
            voucherModel.aggregate([ 
                {
                $lookup: {
                    from: "users",
                    localField: "user_id",
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
                 {
                    $lookup: {
                        from: "franchises",
                        localField: "user.franchise_id",
                        foreignField: "_id",
                        as: "franchise",
                    },
                },
                 {
                    "$unwind": {
                        "path": "$franchise",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: {
                        _id:1, 
                        amount:1, 
                        is_active:1,
                        created:1,
                        "user.franchise_id":1,
                        deliveryboy: {$concat: ['$user.fname',' ','$user.lname']},
                        franchiseName: {$concat: ['$franchise.firmname']},
                    }
                },
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
            ])
            .then((areas) => {
                res(areas);
            })
            .catch((error) => {
                rej(error);
            }); 
    });
};
 
exports.saveVoucher = async(param) => {
    return new Promise((res, rej) => {
        voucherModel.create(param)
            .then((voucher) => {
                res(voucher);
            })
            .catch((error) => {
                rej(error);
            });
    });
};
 
exports.status = (voucherId, is_active, modifiedby) => {
    return new Promise((res, rej) => {
        voucherModel.updateOne({ "_id": voucherId }, { $currentDate: { "modified": true }, $set: { "is_active": is_active, "modifiedby":modifiedby } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};
 
exports.getdepositbyuser = async(where) => {
    return new Promise((res, rej) => {  
            voucherModel.aggregate([ 
                    { $match: where },
                    {
                        $group: { 
                            _id: {
                                user_id: "$user_id",
                                is_active:"1"  
                            }, 
                            deposit: { $sum: "$amount" }, 
                            deposit_count: {$sum:1}
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