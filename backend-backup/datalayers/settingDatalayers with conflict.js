const settingsModel = require("../modules/Settings");
const holidayModel = require("../modules/holiday");
const dtsModel = require("../modules/DeliveryTimeSlot");

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

exports.getAddressTypes = async() => {
    return new Promise((res, rej) => {
        res([
            { id: 1, title: "Home Address", abv: "Home" },
            { id: 2, title: "Office Address", abv: "Office " },
            { id: 3, title: "Other Address", abv: "Other" },
        ]);
    });
};

exports.getUnits = async() => {
    return new Promise((res, rej) => {
        res([
            { id: 1, title: "Kilogram(s)", abv: "Kg(s)." },
            { id: 2, title: "Grams", abv: "Gms" },
            { id: 3, title: "Liter", abv: "ltr" },
            { id: 4, title: "Mili Litres", abv: "Ml" },
            { id: 5, title: "Pack", abv: "pack" },
            { id: 6, title: "Piece", abv: "pcs" },
            { id: 7, title: "Box", abv: "box" }
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
        dtsModel.find()
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

exports.gettotalHolidays = async(where) => {
    return new Promise((res, rej) => {
        if (where) {
            holidayModel.aggregate([{
                    $lookup: {
                        from: "users",
                        localField: "franchiseId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    "$unwind": {
                        "path": "$user",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    $project: {
                        _id: 1,
                        title: 1,
                        franchiseName: { $concat: ['$user.fname', ' ', '$user.lname'] },
                    } <<
                    << << < HEAD
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
                            from: "users",
                            localField: "franchiseId",
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
                            _id: 1,
                            is_active: 1,
                            holiday_date: 1,
                            created: 1,
                            description: 1,
                            franchiseName: { $concat: ['$user.fname', ' ', '$user.lname'] },
                        }
                    },
                    { $match: where },
                    { $skip: params.skip },
                    { $limit: params.limit },
                    {
                        $sort: {
                            [params.order]: params.dir
                        }
                    },
                ])
                .then((doc) => {
                    res(doc);
                })
                .catch((err) => {
                    rej(err);
                }); ===
            === =
        }, { $match: where }, { $sort: {
                [params.order]: params.dir } }, { $skip: params.skip }, { $limit: params.limit },
    ])
    .then((doc) => {
        res(doc);
    })
    .catch((err) => {
        rej(err);
    }); >>>
>>> > 8 ba4bbf2c6e2e25b9f858e410e29a6991d4ec7d4
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