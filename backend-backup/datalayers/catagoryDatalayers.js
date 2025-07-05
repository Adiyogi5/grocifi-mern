const catagoryModel = require("../modules/Catagory");
var fs = require("fs");

exports.gettotalCatagory = async(where) => {
    return new Promise((res, rej) => {  
        if(where){      
            catagoryModel.aggregate([ 
            {
                $lookup: {
                    from: "catagory_subcatagories",
                    localField: "catagory_id",
                    foreignField: "_id",
                    as: "catagory"
                }
            },{
                "$unwind": {
                    "path": "$catagory",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    title: 1, 
                    mainCategory: '$catagory.title',
                }
            },
            { $match: where }
            ]).then((catagory) => {
                res(catagory.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{
            catagoryModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getCatagoriesList = async(where, params) => {
    return new Promise((res, rej) => { 
        catagoryModel.aggregate([ 
            {
                $lookup: {
                    from: "catagory_subcatagories",
                    localField: "catagory_id",
                    foreignField: "_id",
                    as: "catagory"
                }
            },
            {
                "$unwind": {
                    "path": "$catagory",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                $project: {
                    _id:1,
                    title: 1,
                    is_active:1,
                    priority:1,
                    created:1, 
                    description:1,
                    mainCategory: '$catagory.title',
                }
            },
            { $match: where }, 
            { $sort : { [params.order]:params.dir } },
            { $skip : params.skip },
            { $limit : params.limit  },               
        ]).then((catagory) => {
            res(catagory);
        }).catch((error) => {
            rej(error);
        });   
    });
};


exports.getCatagorybyCatcode = async(where) => {
    return new Promise((res, rej) => { 
            catagoryModel
            .find(where)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            }); 
    });
};

exports.getAllCatagories = async(where) => {
    return new Promise((res, rej) => { 
            catagoryModel
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
        if (param.catagory_id == "") {
            delete param.catagory_id;
        }
        catagoryModel
            .create(param)
            .then((doc) => {
                if (param.catagory_img == "No Image") {
                    res(doc);
                } else {
                    var srcPath =
                        __dirname + "/../public/uploads/temp/" + doc.catagory_img;
                    var destPath =
                        __dirname + "/../public/uploads/catagory_img/" + doc.catagory_img;
                    fs.copyFileSync(srcPath, destPath);
                    fs.unlinkSync(srcPath);
                    res(doc);
                }
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.edit = async(body) => {
    return new Promise((res, rej) => {
        var _id = body._id;
        body.catagory_img = body.cat_image; 
        ///console.log(body);
        if (body.catagory_id == "") {
            body.catagory_id = null;
        }
        catagoryModel
            .findOneAndUpdate({ _id: _id }, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                try {
                    var srcPath = __dirname + "/../public/uploads/temp/" + body.cat_image;
                    var destPath =
                        __dirname + "/../public/uploads/catagory_img/" + body.cat_image;

                    if (doc.catagory_img != "" && fs.existsSync(srcPath)) {
                        fs.copyFileSync(srcPath, destPath);
                        fs.unlinkSync(srcPath);
                    }
                } catch (err) {
                    console.error(err);
                }
                res(doc);
            })
            .catch((err) => { 
                rej(err);
            });
    });
};

exports.status = (_id, body) => {
    return new Promise((res, rej) => {
        catagoryModel
            .updateOne({ _id: _id }, {
                $currentDate: { modified: true },
                $set: { is_active: body.is_active },
            })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.delete = async(id) => {
    return new Promise((res, rej) => {
        catagoryModel
            .findByIdAndDelete(id)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        catagoryModel
            .updateMany({ _id: { $in: pId } }, { $currentDate: { modified: true }, $set: status })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.subcatagorycatagorydetails = async(condition) => {
    return new Promise((res, rej) => {
        catagoryModel
            .find()
            .or(condition)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getCatsByField = async(where) => {
    return new Promise((res, rej) => {
        catagoryModel
            .find(where).sort({ priority: 1 })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getCatsByCondition = async(where) => {
    return new Promise((res, rej) => {
        catagoryModel
            .aggregate([{
                $match: where
            }])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getSubCatByCatId = (catId) => {
    return new Promise((res, rej) => {
        catagoryModel.find({ catagory_id: catId, is_active: "1" }).sort({ priority: 1 })
            .then((subCats) => {
                res(subCats);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getAllCatagoryList = () => {
    var    where = {'catagory_id':null};     
    return new Promise((res, rej) => {
        catagoryModel
            .aggregate([{
                    $match: where,
                },
                {
                    $lookup: {
                        from: "catagory_subcatagories",
                        as: "cats",
                        localField: "_id",
                        foreignField: "catagory_id",
                    },
                },
                {
                    $sort: {
                        "cats.title": 1,
                        "cats.catagory_id": 1,
                    },
                },
                {
                    $project: {
                        __v: 0,
                        "cats.__v": 0,
                    },
                }, 
            ])
            .then((Cats) => {
                res(Cats);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getCatagoryList = (catId) => {
    var where = {};
    if (catId != "") {
        where = { catagory_id: catId };
    }
    return new Promise((res, rej) => {
        catagoryModel
            .aggregate([{
                    $match: where,
                },
                {
                    $lookup: {
                        as: "cats",
                        foreignField: "_id",
                        localField: "catagory_id",
                        from: "catagory_subcatagories",
                    },
                },
                {
                    $sort: {
                        "cats.title": 1,
                        "cats.catagory_id": 1,
                    },
                },
                {
                    $project: {
                        __v: 0,
                        "cats.__v": 0,
                    },
                },
                {
                    $unwind: { path: "$cats", preserveNullAndEmptyArrays: true },
                },
            ])
            .then((Cats) => {
                res(Cats);
            })
            .catch((err) => {
                rej(err);
            });
    });
};


exports.getCatagoryBySlug = (catslug) => {
    return new Promise((res, rej) => {
        catagoryModel
            .findOne({ slug: catslug })
            .then((Cat) => {
                res(Cat);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getCatagoryById = (catId) => {
    return new Promise((res, rej) => {
        catagoryModel
            .findOne({ _id: catId })
            .then((Cat) => {
                res(Cat);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getCatsWithProducts = () => {
    return new Promise((res, rej) => {
        catagoryModel.aggregate([{
                    $lookup: {
                        from: "products",
                        as: "products",
                        localField: "_id",
                        foreignField: "catId",
                    },
                },
                {
                    $sort: {
                        "priority": 1,
                    },
                }
            ])
            .then((Cats) => {
                res(Cats);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.findbyField = async(param) => {
    return new Promise((res, rej) => {
        catagoryModel.find(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};