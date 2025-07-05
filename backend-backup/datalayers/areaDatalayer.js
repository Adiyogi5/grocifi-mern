const areaModel = require("../modules/Area");
const areaGroupModel = require("../modules/GroupOfArea");

exports.gettotalArea = async(where) => {
    return new Promise((res, rej) => {
        if (where) {
            areaModel.aggregate([{
                    $lookup: {
                        from: "cities",
                        localField: "cityId",
                        foreignField: "_id",
                        as: "city",
                    }
                },
                {
                    "$unwind": {
                        "path": "$city",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $project: {
                        _id: 1,
                        title: 1,
                        cityName: '$city.title',
                    }
                },
                { $match: where }
            ]).then((area) => {
                res(area.length);
            }).catch((error) => {
                rej(error);
            });
        } else {
            areaModel.countDocuments(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getAllAreas = (where, params) => {
    return new Promise((res, rej) => {
        if (params.limit == 0) {
            areaModel.aggregate([{
                        $match: where
                    }, {
                        $lookup: {
                            from: "cities",
                            localField: "cityId",
                            foreignField: "_id",
                            as: "city",
                        }
                    },
                    {
                        $project: {
                            __v: 0,
                            created: 0,
                            updated: 0,
                            "city.stateId": 0,
                            "city.created": 0,
                            "city.modified": 0,
                            "city.is_active": 0,
                            "city.createdby": 0,
                            "city.modifiedby": 0,
                            "city.__v": 0,
                        }
                    },
                    {
                        $sort: { title: 1 }
                    },
                    {
                        $unwind: { path: "$city", preserveNullAndEmptyArrays: false },
                    }
                ])
                .then((areas) => {
                    res(areas);
                })
                .catch((error) => {
                    rej(error);
                });
        } else {
            /// console.log(params);
            areaModel.aggregate([{
                        $lookup: {
                            from: "cities",
                            localField: "cityId",
                            foreignField: "_id",
                            as: "city",
                        }
                    },
                    {
                        "$unwind": {
                            "path": "$city",
                            "preserveNullAndEmptyArrays": true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            is_active: 1,
                            cityId: 1,
                            created: 1,
                            group_id: 1,
                            cityName: '$city.title',
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
                .then((areas) => {
                    res(areas);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getAreasByCityId = (where) => {
    return new Promise((res, rej) => {
        areaModel.find(where).sort({ title: 1 })
            .then((areas) => {
                res(areas);
            }).catch((error) => {
                rej(error);
            });
    });
}

exports.saveArea = async(param) => {
    return new Promise((res, rej) => {
        areaModel
            .create(param)
            .then((area) => {
                res(area);
            })
            .catch((error) => {
                rej(error);
            });
    });
};


exports.edit = (param) => {
    return new Promise((res, rej) => {
        areaModel.findOne({ "_id": param.areaId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var areaId = body._id;
        delete body._id;
        areaModel.findOneAndUpdate({ "_id": areaId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.status = (areaId, is_active) => {
    return new Promise((res, rej) => {
        areaModel.updateOne({ "_id": areaId }, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        areaModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.delete = (areaId) => {
    return new Promise((res, rej) => {
        areaModel.findByIdAndDelete(areaId)
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


exports.editGroupOfArea = (param) => {
    return new Promise((res, rej) => {
        areaGroupModel.findOne({ "_id": param.areaId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.gettotalGrouparea = async(where) => {
    return new Promise((res, rej) => {
        if (where) {
            areaGroupModel.aggregate([{
                    $lookup: {
                        from: "areas",
                        as: "area",
                        localField: "_id",
                        foreignField: "group_id"
                    }
                }, {
                    $lookup: {
                        from: "cities",
                        as: "city",
                        localField: "city_id",
                        foreignField: "_id"
                    }
                }, {
                    "$unwind": {
                        "path": "$city",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $lookup: {
                        from: "states",
                        as: "state",
                        localField: "city.stateId",
                        foreignField: "_id"
                    }
                }, {
                    "$unwind": {
                        "path": "$state",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $project: {
                        _id: 1,
                        title: 1,
                        cityName: '$city.title',
                        stateName: '$state.title',
                    }
                },
                { $match: where }
            ]).then((area) => {
                res(area.length);
            }).catch((error) => {
                rej(error);
            });
        } else {
            areaGroupModel.countDocuments(where)
                .then((doc) => {
                    res(doc);
                })
                .catch((error) => {
                    rej(error);
                });
        }
    });
};

exports.getAllGroups = (where, params) => {
    return new Promise((res, rej) => {
        if (params.limit == 0) {
            areaGroupModel.aggregate([{
                $match: where
            }, {
                $lookup: {
                    from: "areas",
                    as: "area",
                    localField: "_id",
                    foreignField: "group_id"
                }
            }, {
                $lookup: {
                    from: "cities",
                    as: "city",
                    localField: "city_id",
                    foreignField: "_id"
                }
            }, {
                $lookup: {
                    from: "states",
                    as: "state",
                    localField: "city.stateId",
                    foreignField: "_id"
                }
            }, {
                $project: {
                    __v: 0,
                    "area.__v": 0,
                    "area.created": 0,
                    "area.createdby": 0,
                    "area.is_active": 0,
                    "area.modified": 0,
                    "area.modifiedby": 0,
                    "area.cityId": 0,
                    "area.group_id": 0,
                    "city.__v": 0,
                    "city.created": 0,
                    "city.createdby": 0,
                    "city.is_active": 0,
                    "city.modified": 0,
                    "city.modifiedby": 0,
                    "state.__v": 0,
                    "state.sid": 0,
                    "state.created": 0,
                    "state.createdby": 0,
                    "state.is_active": 0,
                    "state.modified": 0,
                    "state.modifiedby": 0
                }
            }, {
                $sort: { title: 1 }
            }]).then((areas) => {
                res(areas);
            }).catch((error) => {
                rej(error);
            });
        } else {
            areaGroupModel.aggregate([{
                    $lookup: {
                        from: "areas",
                        as: "area",
                        localField: "_id",
                        foreignField: "group_id"
                    }
                }, {
                    $lookup: {
                        from: "cities",
                        as: "city",
                        localField: "city_id",
                        foreignField: "_id"
                    }
                }, {
                    "$unwind": {
                        "path": "$city",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $lookup: {
                        from: "states",
                        as: "state",
                        localField: "city.stateId",
                        foreignField: "_id"
                    }
                }, {
                    "$unwind": {
                        "path": "$state",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $project: {
                        _id: 1,
                        title: 1,
                        is_active: 1,
                        city_id: 1,
                        created: 1,
                        group_id: 1,
                        cityName: '$city.title',
                        stateName: '$state.title',
                        //areaName: '$area.title',
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
            ]).then((areas) => {
                res(areas);
            }).catch((error) => {
                rej(error);
            });
        }
    });
};

exports.findGroupOfAreaByCondition = (where) => {
    return new Promise((res, rej) => {
        areaGroupModel.find(where)
            .then((areas) => {
                res(areas);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.saveGroupOfArea = async(param) => {

    return new Promise((res, rej) => {
        areaGroupModel.create(param)
            .then((area) => {
                areaModel.updateMany({ "_id": { $in: param.area_id } }, { $currentDate: { "modified": true }, $set: { group_id: area._id } })
                    .then((result) => {
                        res(area);
                    });
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.updateGroupOfArea = async(param) => {

    return new Promise((res, rej) => {
        areaGroupModel.findOneAndUpdate({ _id: param._id }, { $currentDate: { "modified": true }, $set: param })
            .then((area) => {
                areaModel.updateMany({ group_id: param._id }, { $currentDate: { "modified": true }, $set: { group_id: null } })
                    .then((result) => {
                        areaModel.updateMany({ _id: { $in: param.area_id } }, { $currentDate: { "modified": true }, $set: { group_id: param._id } })
                            .then((result1) => {
                                res(area);
                            }).catch((error) => {
                                rej(error);
                            });
                    }).catch((error) => {
                        rej(error);
                    });
            }).catch((error) => {
                rej(error);
            });
    });
};

exports.statusGroup = (groupId, is_active) => {
    return new Promise((res, rej) => {
        areaGroupModel.findOneAndUpdate({ _id: groupId }, { $currentDate: { modified: true }, $set: { is_active: is_active } }, { new: true })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getAreaWhere = (where) => {
    return new Promise((res, rej) => {
        areaModel.find(where).sort({ title: 1 })
            .then((areas) => {
                res(areas);
            }).catch((error) => {
                rej(error);
            });
    });
}