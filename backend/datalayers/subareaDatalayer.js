const subareaModel = require("../modules/SubArea");


exports.gettotalSubArea = async(where) => {
    return new Promise((res, rej) => {   
        if(where){      
            subareaModel.aggregate([ 
            {
                $lookup: {
                    from: "areas",
                    localField: "areaId",
                    foreignField: "_id",
                    as: "area",
                }
            },{
                "$unwind": {
                    "path": "$area",
                    "preserveNullAndEmptyArrays": true
                }
            }, 
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "city",
                }
            },{
                "$unwind": {
                    "path": "$city",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    title: 1, 
                    areaName: '$area.title',
                    cityName: '$city.title',
                }
            },
            { $match: where }
            ]).then((city) => {
                res(city.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{       
            subareaModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getAllSubareas = (where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){
            subareaModel.aggregate([{
                $lookup: {
                    from: "areas",
                    localField: "areaId",
                    foreignField: "_id",
                    as: "area",
                }
            }, {
                $project: {
                    __v: 0,
                    created: 0,
                    updated: 0,
                    "area.cityId": 0,
                    "area.created": 0,
                    "area.modified": 0,
                    "area.is_active": 0,
                    "area.createdby": 0,
                    "area.modifiedby": 0,
                    "area.__v": 0,
                }
            }, {
                $unwind: { path: "$area", preserveNullAndEmptyArrays: false },
            }])
            .then((subareas) => {
                res(subareas);
            }).catch((error) => {
                rej(error);
            });
        }else{
            subareaModel.aggregate([
            {
                $lookup: {
                    from: "areas",
                    localField: "areaId",
                    foreignField: "_id",
                    as: "area",
                }
            },{
                "$unwind": {
                    "path": "$area",
                    "preserveNullAndEmptyArrays": true
                }
            }, 
            {
                $lookup: {
                    from: "cities",
                    localField: "cityId",
                    foreignField: "_id",
                    as: "city",
                }
            },{
                "$unwind": {
                    "path": "$city",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $project: {
                    _id:1,
                    title: 1,
                    is_active:1,
                    areaId:1,
                    cityId:1,
                    created:1,  
                    areaName: '$area.title',
                    cityName: '$city.title',
                }
            }, 
            { $match: where }, 
            { $sort : { [params.order]:params.dir } },
            { $skip : params.skip },
            { $limit : params.limit  },
            ])
            .then((subareas) => {
                res(subareas);
            }).catch((error) => {
                rej(error);
            });
        }
    });
};


exports.getSubareasByAreaId = (areaId) => {
    return new Promise((res, rej) => {
        subareaModel.find({ "areaId": areaId, })
            .then((subareas) => {
                res(subareas);
            }).catch((error) => {
                rej(error);
            });
    });
};

exports.saveSubArea = async(param) => {
    return new Promise((res, rej) => {
        subareaModel
            .create(param)
            .then((subarea) => {
                res(subarea);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.edit = (param) => {
    return new Promise((res, rej) => {
        subareaModel.findOne({ "_id": param.subAreaId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var subAreaId = body._id;
        delete body._id;
        subareaModel.findOneAndUpdate({ "_id": subAreaId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.status = (_id, status) => {
    return new Promise((res, rej) => {
        subareaModel.updateOne({ "_id": _id }, { $currentDate: { "modified": true }, $set: { "is_active": status } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};
exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        subareaModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (subAreaId) => {
    return new Promise((res, rej) => {
        subareaModel.findByIdAndDelete(subAreaId)
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