const cityModel = require("../modules/City");

exports.gettotalCity = async(where) => {
    return new Promise((res, rej) => { 
        if(where){      
            cityModel.aggregate([ 
             {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "state"
                }
            },
             {
                "$unwind": {
                    "path": "$state",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    title: 1, 
                    stateName: '$state.title',
                }
            },
            { $match: where }
            ]).then((city) => {
                res(city.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{         
            cityModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getAllCities = (where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){
            cityModel.aggregate([{
                    $match: where
                },
                {
                    $lookup: {
                        from: "states",
                        localField: "stateId",
                        foreignField: "_id",
                        as: "state"
                    }
                }, {
                    $project: {
                        __v: 0,
                        created: 0,
                        modified: 0,
                        createdby: 0,
                        modifiedby: 0,
                        "state.is_active": 0,
                        "state.countryId": 0,
                        "state.createdby": 0,
                        "state.modifiedby": 0,
                        "state.created": 0,
                        "state.modified": 0,
                        "state.__v": 0
                    }
                }, {
                    $unwind: {
                        path: "$state",
                        preserveNullAndEmptyArrays: false
                    }
                }
            ]).then((cities) => {
                res(cities);
            }).catch((error) => {
                rej(error);
            });
        }else{  
            cityModel.aggregate([ 
                {
                    $lookup: {
                        from: "states",
                        localField: "stateId",
                        foreignField: "_id",
                        as: "state"
                    }
                },
                {
                    "$unwind": {
                        "path": "$state",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $project: {
                        _id:1,
                        title: 1,
                        is_active:1,
                        stateId:1,
                        created:1, 
                        group_id:1,
                        stateName: '$state.title',
                    }
                },
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
            ]).then((cities) => {
                res(cities);
            }).catch((error) => {
                rej(error);
            }); 
        }
    });
};

exports.getCityByStateId = (where) => {
    return new Promise((res, rej) => {
        cityModel.aggregate([{
                $match: where
            },
            {
                $lookup: {
                    from: "states",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "state"
                }
            }, {
                $project: {
                    __v: 0,
                    created: 0,
                    modified: 0,
                    createdby: 0,
                    modifiedby: 0,
                    "state.is_active": 0,
                    "state.countryId": 0,
                    "state.createdby": 0,
                    "state.modifiedby": 0,
                    "state.created": 0,
                    "state.modified": 0,
                    "state.__v": 0
                }
            }, {
                $unwind: {
                    path: "$state",
                    preserveNullAndEmptyArrays: false
                }
            }
        ]).then((cities) => {
            res(cities);
        }).catch((error) => {
            rej(error);
        }); 
    });
};

exports.save = async(param) => {
    return new Promise((res, rej) => {
        cityModel
            .create(param)
            .then((city) => {
                res(city);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.saveAllcity = async(param) => {
    return new Promise((res, rej) => {
        cityModel.insertMany(param)
            .then((city) => {
                res(city);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.edit = (param) => {
    return new Promise((res, rej) => {
        cityModel.findOne({ "_id": param.cityId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var cityId = body._id;
        delete body._id;
        cityModel.findOneAndUpdate({ "_id": cityId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.status = (_id, status) => {
    return new Promise((res, rej) => {
        cityModel.updateOne({ "_id": _id }, { $currentDate: { "modified": true }, $set: { "is_active": status } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        cityModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (cityId) => {
    return new Promise((res, rej) => {
        cityModel.findByIdAndDelete(cityId)
            .then((city) => {
                if (!city) {
                    res(false);
                } else {
                    res(true);
                }
            }).catch((err) => {
                rej(err);
            });
    });
};