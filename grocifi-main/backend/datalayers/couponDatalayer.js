const fs = require("fs");
const moment = require('moment');
const couponModel = require("../modules/Coupon");


exports.gettotalcoupons = async(where) => {
    return new Promise((res, rej) => {  
        if(where){      
            couponModel.aggregate([ 
             {
                $lookup: {
                    from: "franchises",
                    localField: "franchise_id",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
             {
                "$unwind": {
                    "path": "$franchise",
                    "preserveNullAndEmptyArrays": true
                }
            },{
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
                $project: {
                    _id:1,
                    title: 1, 
                    userName: {$concat: ['$user.fname',' ','$user.lname']},
                    franchiseName: {$concat: ['$franchise.firmname']},
                }
            },
            { $match: where }
            ]).then((coupon) => {
                res(coupon.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{          
            couponModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });  
        }          
    });
};

exports.getCoupons = (where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){    
            couponModel.find({})
            .then((coupon) => {
                res(coupon);
            })
            .catch((error) => {
                rej(error);
            });
         }else{
            couponModel.aggregate([ 
                {
                    $lookup: {
                        from: "franchises",
                        localField: "franchise_id",
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
                    $project: { 
                        _id:1,
                        title: 1,
                        is_active:1,
                        franchise_id:1,
                        created:1, 
                        start_date:1,
                        user_id:1,
                        end_date:1,
                        disc_value:1,
                        disc_in:1,
                        reuse_by_same_user:1,
                        uses_number:1,
                        has_expiry:1,
                        used_number:1,
                        coupon:1,
                        userName: {$concat: ['$user.fname',' ','$user.lname']},
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
        }       
    });
};

exports.getCouponById = (couponId) => {
    return new Promise((res, rej) => {
        couponModel.find({ _id: couponId })
            .then((coupon) => {
                res(coupon);
            }).catch((error) => {
                rej(error);
            });
    });
}

exports.saveCoupons = async(param) => {
    return new Promise((res, rej) => {
        couponModel.create(param)
            .then((coupon) => {
                res(coupon);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.edit = (id) => {
    return new Promise((res, rej) => {
        couponModel.findOne({ "_id": id })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var id = body._id;
        body.coupon = body.code_img;
        delete body._id;
        delete body.code_img;
        if (body.user_id == "null" || body.user_id == "") {
            body.user_id = null;
        }
        if (body.end_date == "null" ) {
            body.end_date = null;
        }
        if (body.start_date == "null" ) {
            body.start_date = null;
        }
        couponModel.findByIdAndUpdate({ "_id": id }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                if (data.coupon != body.coupon) {
                    fs.unlinkSync(__dirname + "/../public/uploads/offer_banners/" + data.coupon);
                }
                console.log(data);
                res(data);
            }).catch((err) => {
                console.log(err);
                rej(err);
            });
    });
};

exports.updateUsesCount = (ccode, num) => {
    if (ccode == "" || ccode == undefined) {
        return;
    }

    return new Promise((res, rej) => {
        couponModel.findOneAndUpdate({ title: ccode }, { $inc: { used_number: num } })
            .then((data) => {
                res(data);
            }).catch((err) => {
                console.log(err);
                rej(err);
            });
    });
};

exports.status = (couponId, is_active) => {
    return new Promise((res, rej) => {
        couponModel.updateOne({ "_id": couponId }, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        couponModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (couponId) => {
    return new Promise((res, rej) => {
        couponModel.findByIdAndDelete(couponId)
            .then((subArea) => {
                if (!subArea) {
                    res(false);
                } else {
                    res(true);
                }
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.findbyField = async(param) => {
    return new Promise((res, rej) => {
        couponModel.find(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getExpireCoupon = async(where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){    
            /*today = new Date(today);
            today = moment(today)
                .add(5, "hours")
                .add(30, "minutes")
                .format()
                .split("T")[0];

            today = new Date(today + "T00:00:00.000Z");
            var todayEnd = moment(today).add(1, "days");
            todayEnd = new Date(todayEnd);*/
            couponModel.find(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                });
        }else{
            couponModel.aggregate([ 
                {
                    $lookup: {
                        from: "franchises",
                        localField: "franchise_id",
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
                    $project: { 
                        _id:1,
                        title: 1,
                        is_active:1,
                        franchise_id:1,
                        created:1, 
                        start_date:1,
                        user_id:1,
                        end_date:1,
                        disc_value:1,
                        disc_in:1,
                        reuse_by_same_user:1,
                        uses_number:1,
                        has_expiry:1,
                        used_number:1,
                        coupon:1,
                        userName: {$concat: ['$user.fname',' ','$user.lname']},
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
        }
    });
};

exports.setExpireCoupon = async(given_date, franchise_id) => {
    return new Promise((res, rej) => {
        var nowDate = new Date(given_date);
        nowDate = moment(nowDate).add(5, "hours");
        nowDate = moment(nowDate).add(30, "minutes");
        if(franchise_id!=0){
            couponModel.updateMany({ end_date: { $lt: nowDate }, is_active: "1", franchise_id:franchise_id }, { $currentDate: { "modified": true }, $set: { is_active: "2" } })
            .then((doc) => {
                console.log(doc);
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        }else{
            couponModel.updateMany({ end_date: { $lt: nowDate }, is_active: "1" }, { $currentDate: { "modified": true }, $set: { is_active: "2" } })
                .then((doc) => {
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                });
        }
    });
};