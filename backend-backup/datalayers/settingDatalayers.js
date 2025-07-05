const settingsModel = require("../modules/Settings");
const holidayModel = require("../modules/holiday");
const dtsModel = require("../modules/DeliveryTimeSlot");
const deliveryslotModel = require("../modules/DeliverySlot");
const mongodb = require("mongodb");
const moment = require("moment");

exports.getSettings = async() => {
    return new Promise((res, rej) => {
        settingsModel.find({}, { "cms_content": 0 })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getCMSSettings = async() => {
    return new Promise((res, rej) => {
        settingsModel.find({}, { "cms_content": 1 })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getAddressTypes = async() => {
    return new Promise((res, rej) => {
        res([
            { id: 1, title: "Home Address", abv: "Home" },
            { id: 2, title: "Office Address", abv: "Office " },
            { id: 3, title: "Other Address", abv: "Other" },
        ]);
    });
};

exports.getDelivarySlote = async(deliverydate,condition) => {
    return new Promise((res, rej) => {
        var isCurrent =  moment().isSame(deliverydate, 'day');
        var currentTime =  moment().format('H:m').toString();
        // console.log(deliverydate);
        deliveryslotModel.aggregate([
            {
                $lookup: {
                  from: "holidays",
                  let: { franchseID: "$franchiseId" },
                  pipeline: [
                    {
                      $match: {
                        $expr : { 
                            "$and" : [
                                { $eq: ["$franchiseId", "$$franchseID"] },
                                { $eq:[ "$holiday_date", deliverydate ]},
                                { $eq:[ "$is_active", 1]}
                            ]
                        }
                      },
                    },
                  ],
                  as: "holidayData",
                },
            },
            {
                $lookup: {
                  from: "orders",
                  let: { delivery_soltid: '$_id', franchseID: '$franchiseId' },
                  pipeline: [
                    {
                      $match: {
                        $expr : { 
                            "$and" : [
                                { $eq: ["$delivery_solt_id", "$$delivery_soltid"] },
                                { $eq: ["$franchiseId", "$$franchseID"] },
                                { $eq:[ "$delivery_date", deliverydate ]}
                            ]
                        }
     
                      },
                    },
                  ],
                  as: "orderData",
                },
            },
            { $match: condition },
            {
                $project: {  
                    _id:0,
                    id:"$_id",
                    start_time:1,
                    is_default:1,
                    end_time:1,
                    title: { $concat:['$start_time',' - ','$end_time'] },
                    orderCount:{ $size: "$orderData" },
                    // value:1,
                    is_available: {
                        $cond: { 
                            if: { $gt: [ { $size: "$holidayData" }, 0 ] }, // Check condition if Delivery day is holiday then return false 
                                then: false, 
                                else:{
                                    $cond: {  
                                        if: { $lt: ["$value", 0 ] }, // Check condition if timeslot value less then 0 then return false
                                        then: false, 
                                        else: {
                                            $cond: {  
                                                if: { $eq: ["$value", 0 ] },  // Check condition if timeslot value == 0 then return true else check odercount 
                                                then: {
                                                    $cond: {  
                                                        if: { $eq: ["$default", 1 ] },   // Check condition if timeslot value greter then oder count  then return true else Return false 
                                                        then: true,
                                                        else: {
                                                            $cond: {  
                                                                if: { $eq: [isCurrent, true  ] },   // Check condition if timeslot value greter then oder count  then return true else Return false 
                                                                then: {
                                                                    $cond: {  
                                                                        if:{ $gt: ["$start_time", currentTime ] },   // Check condition if timeslot value greter then oder count  then return true else Return false 
                                                                        then: true,
                                                                        else: false
                                                                    }
                                                                },  
                                                                else: true
                                                            }
                                                        },  
                                                    }
                                                },   
                                                else:{
                                                    $cond: {  
                                                        if: { $eq: [isCurrent, true  ] },   // Check condition if timeslot value greter then oder count  then return true else Return false 
                                                        then: {
                                                            $cond: { 
                                                                if:  { $and:[{ $gt: ["$value", { $size: "$orderData"}  ] },{ $gt: ["$start_time",currentTime ] }] },   // Check condition if timeslot value greter then oder count  then return true else Return false 
                                                                then: true,
                                                                else: false
                                                            }
                                                        },  
                                                        else:  {
                                                            $cond: {  
                                                                if: { $gt: ["$value", { $size: "$orderData" }  ] },   // Check condition if timeslot value greter then oder count  then return true else Return false 
                                                                then: true,
                                                                else: false
                                                            }
                                                        },  
                                                    }
                                                },  
                                            }
                                        }, 
                                    }
                                    
                                }, 
                            }
                    }
                },
            },  
            
        ])
        .then((products) => { 
            res(products);
        })
        .catch((error) => {
            rej(error);
        }); 

    });
}


exports.getUnits = async() => {
    return new Promise((res, rej) => {
        res([
            { id: 1, title: "Kilogram(s)", abv: "Kg(s)." },
            { id: 2, title: "Grams", abv: "Gms" },
            { id: 3, title: "Liter", abv: "ltr" },
            { id: 4, title: "Mili Litres", abv: "Ml" },
            { id: 5, title: "Pack", abv: "pack" },
            { id: 6, title: "piece", abv: "pcs" },
            { id: 7, title: "M", abv: "m" }
        ]);
    });
};

exports.save = async(params) => {
    return new Promise((res, rej) => {
        settingsModel.create(params).then((doc) => {
            res(doc);
        }).catch((err) => {
            rej(err);
        });
    });
};

exports.edit = (param) => {
    return new Promise((res, rej) => {
        var id = param._id;
        param.logo = param.logoImg;
        param.favicon = param.favImg;
        param.logowhite = param.logowhite;
        settingsModel.updateOne({ _id: id }, { $currentDate: { "modified": true }, $set: param })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}; 

exports.update = (id, param) => {
    return new Promise((res, rej) => {
        settingsModel.updateOne({ _id: id }, { $currentDate: { "modified": true }, $set: param })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.cms = async() => {
    return new Promise((res, rej) => {
        settingsModel.find({}, { cms_content: 1 }).then((doc) => {
            res(doc);
        }).catch((err) => {
            rej(err);
        })

    });
}

exports.getdeliverytimeslot = async() => {
    return new Promise((res, rej) => {
        dtsModel.find({})
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}
exports.getdeliveryslot = async(params) => {
    return new Promise((res, rej) => {
        deliveryslotModel.find(params)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}


exports.save_time_slot_limit = async(postBody) => {
    return new Promise((res, rej) => {
        dtsModel.create(postBody)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}

exports.save_delivery_slot_limit = async(postBody) => {
    return new Promise((res, rej) => {
        deliveryslotModel.create(postBody)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}

exports.deleteDeliverySlot = async(where) => {
    return new Promise((res, rej) => {
        // console.log(mongodb.ObjectId('65214a940392952bdc96ca86'))
        deliveryslotModel.deleteMany({default:{ $ne:1}, _id:{ $nin : where}})
        .then((doc) => {
            res(doc);
        }).catch((err) => {
            rej(err);
        });
    });
}

exports.update_time_slot_limit = async(id, postBody) => {
    return new Promise((res, rej) => {
        dtsModel.updateOne({ _id: id }, { $currentDate: { "modified": true }, $set: postBody })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}

exports.update_delivery_slot = async(id, postBody) => {
    return new Promise((res, rej) => {
       
        deliveryslotModel.updateOne({ _id: id }, { $currentDate: { "modified": true }, $set: postBody })
            .then((doc) => {
               
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
}

exports.gettotalHolidays = async(where) => {
    return new Promise((res, rej) => {
        if (where) {
            holidayModel.aggregate([{
                    $lookup: {
                        from: "franchises",
                        localField: "franchiseId",
                        foreignField: "_id",
                        as: "franchise",
                    },
                },
                {
                    "$unwind": {
                        "path": "$franchise",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $project: {
                        _id: 1,
                        title: 1,
                        franchiseName: { $concat: ['$franchise.firmname'] },
                    }
                },
                { $match: where }
            ]).then((holiday) => {
                res(holiday.length);
            }).catch((error) => {
                rej(error);
            });
        } else {
            holidayModel.countDocuments(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getHolidays = async(where, params) => {
    return new Promise((res, rej) => {
        if (params.limit == 0) {
            holidayModel.find().sort({ holiday_date: 1 })
                .then((doc) => {
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                });
        } else {
            holidayModel.aggregate([{
                        $lookup: {
                            from: "franchises",
                            localField: "franchiseId",
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
                            _id: 1,
                            is_active: 1,
                            holiday_date: 1,
                            franchiseId:1,
                            created: 1,
                            description: 1,
                            franchiseName: { $concat: ['$franchise.firmname'] },
                        }
                    },
                    { $match: where },
                    { $sort: {
                            [params.order]: params.dir } },
                    { $skip: params.skip },
                    { $limit: params.limit },
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

exports.saveHoliday = async(params) => {
    return new Promise((res, rej) => {
        holidayModel.create(params)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getHolidayById = (id) => {
    return new Promise((res, rej) => {
        holidayModel.findOne({ _id: id })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.updateHoliday = (param) => {
    return new Promise((res, rej) => {
        holidayModel.findByIdAndUpdate({ _id: param._id }, { $currentDate: { "modified": true }, $set: param }, { new: true })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.findHolidaysByField = async(where) => {
    return new Promise((res, rej) => {
        holidayModel.find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.removeHolidayById = (_id) => {
    return new Promise((res, rej) => {
        holidayModel.findOneAndDelete({ _id: _id })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};