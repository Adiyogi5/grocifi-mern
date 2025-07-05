const stateModel = require("../modules/State");


exports.gettotalState = async(where) => {
    return new Promise((res, rej) => {   
        if(where){      
            stateModel.aggregate([ 
             {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                },
            },
             {
                "$unwind": {
                    "path": "$country",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    title: 1, 
                    countryName: '$country.title',
                }
            },
            { $match: where }
            ]).then((state) => {
                res(state.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{      
            stateModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getAllstates = (where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){
            stateModel.aggregate([{
                $match: where
            }, {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                },
            }, {
                $project: {
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    "country.created": 0,
                    "country.modified": 0,
                    "country.is_active": 0,
                    "country.createdby": 0,
                    "country.modifiedby": 0,
                    "country.__v": 0,
                }
            }, {
                $unwind: { path: "$country", preserveNullAndEmptyArrays: false },
            }, ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        }else{  
            stateModel.aggregate([                
                {
                    $lookup: {
                        from: "countries",
                        localField: "countryId",
                        foreignField: "_id",
                        as: "country",
                    },
                },
                {
                    "$unwind": {
                        "path": "$country",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: {
                        _id:1,
                        title: 1,
                        is_active:1,
                        stateId:1,
                        created:1, 
                        group_id:1,
                        countryName: '$country.title',
                    }
                }, 
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
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

exports.getStateByCountryId = (where) => {

    return new Promise((res, rej) => {
        stateModel.aggregate([{
                $match: where,
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                },
            },
            {
                $project: {
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    "country.created": 0,
                    "country.modified": 0,
                    "country.is_active": 0,
                    "country.createdby": 0,
                    "country.modifiedby": 0,
                    "country.__v": 0,
                },

            },
            {
                $unwind: { path: "$country", preserveNullAndEmptyArrays: true },
            },
        ]).then((states) => {
            res(states);
        }).catch((error) => {
            rej(error);
        });
    });
};

exports.saveState = async(param) => {
    return new Promise((res, rej) => {
        stateModel
            .create(param)
            .then((state) => {
                res(state);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.saveAllState = async(param) => {
    return new Promise((res, rej) => {
        stateModel.insertMany(param)
            .then((state) => {
                res(state);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.edit = (param) => {
    return new Promise((res, rej) => {
        stateModel.findOne({ "_id": param.stateId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var stateId = body._id;
        delete body._id;
        stateModel.findOneAndUpdate({ "_id": stateId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.status = (_id, status) => {
    return new Promise((res, rej) => {
        stateModel.updateOne({ "_id": _id }, { $currentDate: { "modified": true }, $set: { "is_active": status } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        stateModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (stateId) => {
    return new Promise((res, rej) => {
        stateModel.findByIdAndDelete(stateId)
            .then((state) => {
                if (!state) {
                    res(false);
                } else {
                    res(true);
                }
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getstates = () => {
    return new Promise((res, rej) => {
        stateModel.find()
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};