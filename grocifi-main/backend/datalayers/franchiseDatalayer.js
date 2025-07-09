const mongodb = require('mongodb');
const bannerModel = require('../modules/Banner');
const productModel = require('../modules/Products');
const franchiseModel = require('../modules/Franchise');
const franchiseareaModel = require('../modules/FranchiseArea');
const franchisecatsModel = require('../modules/FranchiseCategory');
const purchasedItemModel = require('../modules/purchased_item');


exports.getglobal = () => {
    return new Promise((resolve, reject) => {
        franchiseModel.aggregate([{
                $match : {is_global:true}
            },
            {
                $project: { "_id": 1, "firmname": 1 , "is_active": 1, "userId":1, "isallow_global_product":1 }
            }])
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}


exports.getAllFranchiseId = () => {
    return new Promise((resolve, reject) => {
        franchiseModel.aggregate([{
                $match : {is_global:false}
            },
            {
                $project: { "_id": 1, "firmname": 1 , "is_active": 1, "userId":1, "isallow_global_product":1 }
            }])
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

exports.getAllFranchise = () => {
    return new Promise((resolve, reject) => {
        franchiseModel.aggregate([{
                $lookup: {
                    "from": "users",
                    "localField": "userId",
                    "foreignField": "_id",
                    "as": "user"
                }
            }, {
                $unwind: {
                    "path": "$user",
                    "preserveNullAndEmptyArrays": true
                }
            }])
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

exports.saveFranchise = (param) => {
    return new Promise((res, rej) => {
        franchiseModel.create(param)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.edit = (param) => {
    return new Promise((res, rej) => {
        franchiseModel.findOne({ "_id": param.fId })
            .then((franchise) => {
                res(franchise);
            }).catch((err) => {
                rej(err);
            });
    });
};


exports.getFranchiseById = (fId) => {
    return new Promise((res, rej) => { 
        franchiseModel.aggregate([{
                    $match: { _id: fId }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                }, {
                    $unwind: { path: "$user" }
                }
            ])
            .then((franchise) => {
                res(franchise);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getFranchiseByUserId = (userId) => {
    return new Promise((res, rej) => {
        //franchiseModel.findOne({"_id":param.fId})
        franchiseModel.aggregate([{
                    $match: { userId: userId }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                }, {
                    $unwind: { path: "$user" }
                }
            ])
            .then((franchise) => {
                res(franchise);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var fId = body._id;
        delete body._id;
        franchiseModel.findOneAndUpdate({ "_id": fId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.status = (fId, body) => {
    return new Promise((res, rej) => {
        franchiseModel.findOneAndUpdate({ "_id": fId }, { $currentDate: { "modified": true }, $set: { "is_active": body.is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusByUserId = (uId, is_active) => {
    return new Promise((res, rej) => {
        franchiseModel.updateOne({ "userId": uId }, { $currentDate: { "modified": true }, $set: { "is_active": is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getByField = (where) => {
    return new Promise((res, rej) => {
        franchiseModel.find(where)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getFranchiseOfArea = (areaId) => {
    return new Promise((resolve, reject) => {
        const frsData = [];
        franchiseareaModel.aggregate([{
            $match: { "areaId": areaId, "is_active": "1" }
        }, {
            "$project": {
                "frarea": "$$ROOT"

            }
        }, {
            "$lookup": {
                "localField": "frarea.franchiseId",
                "from": "franchises",
                "foreignField": "_id",
                "as": "frFranchise"
            }
        }, {
            "$unwind": {
                "path": "$frFranchise",
                "preserveNullAndEmptyArrays": true
            }
        }, {
            "$lookup": {
                "localField": "frFranchise.userId",
                "from": "users",
                "foreignField": "_id",
                "as": "userData"
            }
        }, {
            "$unwind": {
                "path": "$userData",
                "preserveNullAndEmptyArrays": true
            }
        }]).then((data) => {
            if (data.length > 0) {
                data.forEach((ele) => {
                    var frarea = "";
                    if (ele.frarea) {
                        frarea = ele.frarea;
                        delete frarea.__v;
                        delete frarea.created;
                        delete frarea.modified;
                        delete frarea.createdby;
                        delete frarea.modifiedby;
                    }

                    var frFranchise = "";
                    if (ele.frFranchise) {
                        frFranchise = ele.frFranchise; 
                        delete frFranchise.__v;
                        delete frFranchise.created;
                        delete frFranchise.modified;
                        delete frFranchise.createdby;
                        delete frFranchise.modifiedby;
                    }

                    var userData = "";
                    if (ele.userData) {
                        userData = ele.userData;
                        delete userData.__v;
                        delete userData.created;
                        delete userData.modified;
                        delete userData.createdby;
                        delete userData.modifiedby;
                    }
                    frsData.push(Object.assign(userData, frFranchise, frarea));
                });
                resolve(frsData);
            } else {
                resolve(null);
            }
        }).catch((error) => { reject(error); });
    })
};

exports.getfrbanner = (areaId) => {
    return new Promise((resolve, reject) => {
        const frBanner = [];
        franchiseareaModel.aggregate([
        {
            $match: { "areaId": areaId, "is_active": "1" }
        },
        {
            $lookup: { 
                from: "banners",
                let: { "franchise_id": "$franchiseId" }, 
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$franchise_id", "$$franchise_id"] },
                      is_active: "1",
                    },
                  },
                ],
                as: "frBanner",
            },
        },   
        {
            $project: { "frBanner.franchise_id": 1, "frBanner.title": 1, "frBanner.img": 1, "frBanner.is_active": 1 }
        }, {
            "$unwind": { "path": "$frBanner" }
        }]).then((data) => {
            if (data != null && data.length > 0) {
                for (i = 0; i < data.length; i++) {
                    frBanner.push(data[i].frBanner);
                }
                resolve(frBanner);
            } else {
                bannerModel.find({ "franchise_id": null, "is_active": "1" }, { "_id": 0, "title": 1, "franchise_id": 1, "img": 1, "is_active": 1 })
                    .then((data) => {
                        if (data != null && data.length > 0) {
                            for (i = 0; i < data.length; i++) {
                                frBanner.push(data[i]);
                            }
                            resolve(frBanner);
                        } else {
                            frBanner.push({ "title": "no title", "franchise_id": "", "is_active":"1", "img": "noimage.jpg" });
                            resolve(frBanner);
                        }
                    }).catch((error) => {
                        reject(error);
                    });
            }
        }).catch((error) => { reject(error); });
    });
};

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function(a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

 

exports.getfrcats = (areaId) => {
    return new Promise((resolve, reject) => { 
        franchiseareaModel.aggregate([{
                    $match: { "areaId": areaId, "is_active": "1" }
                },
                {
                    "$project": {
                        "frarea": "$$ROOT"
                    }
                },
                {
                    "$lookup": { 
                        from: "franchisecategories",
                        let: { "franchiseId": "$frarea.franchiseId" }, 
                        pipeline: [
                          {
                            $match: {
                              $expr: { $eq: ["$franchiseId", "$$franchiseId"] },
                              is_active: "1",
                            },
                          },
                        ],
                        as: "frCats",
                    }
                },
                {
                    "$unwind": {
                        "path": "$frCats",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "frCats.catId",
                        "from": "catagory_subcatagories",
                        "foreignField": "_id",
                        "as": "Cats"
                    }
                },
                {
                    "$unwind": {
                        "path": "$Cats",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$project": {
                        "Cats._id": "$Cats._id",
                        "Cats.title": "$Cats.title",
                        "Cats.slug": "$Cats.slug",
                        "Cats.priority": "$Cats.priority",
                        "Cats.coming_soon": "$Cats.coming_soon",
                        "Cats.is_active": "$Cats.is_active",
                        "Cats.catagory_id": "$Cats.catagory_id",
                        "Cats.allow_upload": "$Cats.allow_upload",
                        "Cats.catagory_img": "$Cats.catagory_img",
                    }
                },
                {
                    $sort: { "Cats.priority": 1 }
                }
            ])
            .then((data) => {
                var catsData = [];
                if (data.length > 0) {
                    data.forEach((ele) => {
                        catsData.push(ele.Cats);
                    });
                    //catsData = catsData.sort(dynamicSort("priority"));
                    resolve(catsData);
                } else {
                    resolve(catsData);
                }
            }).catch((error) => { reject(error); });
         
    });
};


exports.getfrmaincats = (areaId) => {
    return new Promise((resolve, reject) => { 
        franchiseareaModel.aggregate([{
                    $match: { "areaId": areaId, "is_active": "1" }
                },
                {
                    "$project": {
                        "frarea": "$$ROOT"
                    }
                },
                {
                    "$lookup": { 
                        from: "franchisecategories",
                        let: { "franchiseId": "$frarea.franchiseId" }, 
                        pipeline: [
                          {
                            $match: {
                              $expr: { $eq: ["$franchiseId", "$$franchiseId"] },
                              is_active: "1",
                            },
                          },
                        ],
                        as: "frCats",
                    }
                },
                {
                    "$unwind": {
                        "path": "$frCats",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": {
                        "localField": "frCats.catId",
                        "from": "catagory_subcatagories",
                        "foreignField": "_id",
                        "as": "Cats"
                    }
                },
                {
                    "$unwind": {
                        "path": "$Cats",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$project": {
                        "Cats._id": "$Cats._id",
                        "Cats.title": "$Cats.title",
                        "Cats.slug": "$Cats.slug",
                        "Cats.priority": "$Cats.priority",
                        "Cats.coming_soon": "$Cats.coming_soon",
                        "Cats.is_active": "$Cats.is_active",
                        "Cats.catagory_id": "$Cats.catagory_id",
                        "Cats.allow_upload": "$Cats.allow_upload",
                        "Cats.catagory_img": "$Cats.catagory_img",
                    }
                },
                {
                    $match: { "Cats.catagory_id": null }
                },
                {
                    $sort: { "Cats.priority": 1 }
                }
            ])
            .then((data) => {
                var catsData = [];
                if (data.length > 0) {
                    data.forEach((ele) => {
                        catsData.push(ele.Cats);
                    });
                    //catsData = catsData.sort(dynamicSort("priority"));
                    resolve(catsData);
                } else {
                    resolve(catsData);
                }
            }).catch((error) => { reject(error); });
         
    });
};


exports.getfeaturefrcats = (areaId) => {
    return new Promise((resolve, reject) => { 
        franchiseareaModel.aggregate([{
                    $match: { "areaId": areaId, "is_active": "1" }
                },
                {
                    "$project": {
                        "frarea": "$$ROOT"
                    }
                },
                {
                    "$lookup": { 
                        from: "franchisecategories",
                        let: { "franchiseId": "$frarea.franchiseId" }, 
                        pipeline: [
                          {
                            $match: {
                              $expr: { $eq: ["$franchiseId", "$$franchiseId"] },
                              is_active: "1",
                            },
                          },
                        ],
                        as: "frCats",
                    }
                },
                {
                    "$unwind": {
                        "path": "$frCats",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$lookup": { 
                        from: "catagory_subcatagories",
                        let: { "catId": "$frCats.catId" }, 
                        pipeline: [
                          {
                            $match: {
                              $expr: { $eq: ["$_id", "$$catId"] },
                              is_active: "1",
                              is_feature: "1",
                            },
                          },
                        ],
                        as: "Cats",
                    }
                }, 
                {
                    "$unwind": {
                        "path": "$Cats",
                        "preserveNullAndEmptyArrays": false
                    }
                },
                {
                    "$project": {
                        "Cats._id": "$Cats._id",
                        "Cats.title": "$Cats.title",
                        "Cats.slug": "$Cats.slug",
                        "Cats.priority": "$Cats.priority",
                        "Cats.coming_soon": "$Cats.coming_soon",
                        "Cats.is_active": "$Cats.is_active",
                        "Cats.catagory_id": "$Cats.catagory_id",
                        "Cats.allow_upload": "$Cats.allow_upload",
                        "Cats.catagory_img": "$Cats.catagory_img",
                    }
                },
                {
                    $sort: { "Cats.priority": 1 }
                } 
            ])
            .then((data) => {
                var catsData = [];
                if (data.length > 0) {
                    data.forEach((ele) => {
                        catsData.push(ele.Cats);
                    });
                    //catsData = catsData.sort(dynamicSort("priority"));
                    resolve(catsData);
                } else {
                    resolve(catsData);
                }
            }).catch((error) => { reject(error); });
         
    });
};

exports.delete = (fId) => {
    return new Promise((res, rej) => {
        franchiseModel.findByIdAndDelete(fId)
            .then((franchise) => {
                if (!franchise) {
                    res(false);
                } else {
                    res(true);
                }
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.savefrcats = (franchiseId, catId, is_active) => {
    return new Promise((res, rej) => {
        franchisecatsModel.find({ "franchiseId": franchiseId, "catId": catId })
            .then((frcats) => {

                if (!frcats.length) {
                    franchisecatsModel.create({ "franchiseId": franchiseId, "catId": catId })
                        .then((doc) => {
                            res(doc);
                        }).catch((err) => {
                            rej(err);
                        });
                } else {
                    franchisecatsModel.updateOne({ "_id": frcats[0]._id }, { $currentDate: { "modified": true }, $set: { is_active: is_active } })
                        .then((result) => {
                            //console.log(result);
                            res(result);
                        })
                        .catch((err) => {
                            //console.log(err); 
                        })
                }
            })
            .catch((error) => {
                console.log(error)
            });
    });
};

exports.updatefrcats = (param) => {
    return new Promise((res, rej) => {
        franchisecatsModel.find({
                $and: [{ "_id": { $ne: param._id } },
                    { "franchiseId": { $eq: param.franchiseId } },
                    { "catId": { $eq: param.catId } }
                ]
            })
            .then((frcats) => {
                var frcats_id = param._id
                delete param._id;
                if (!frcats.length) {
                    franchisecatsModel.findByIdAndUpdate({ "_id": frcats_id }, { $currentDate: { "modified": true }, $set: param })
                        .then((doc) => {
                            res(doc);
                        }).catch((err) => {
                            rej(err);
                        });
                }
            })
            .catch((error) => {
                console.log(error)
            });
    });
};

exports.savefrarea = (franchiseId, areaId) => {
    return new Promise((res, rej) => {
        franchiseareaModel.find({ "franchiseId": franchiseId, "areaId": areaId })
            .then((frareas) => {
                if (!frareas.length) {
                    franchiseareaModel.create({ "franchiseId": franchiseId, "areaId": areaId })
                        .then((doc) => {
                            res(doc);
                        }).catch((err) => {
                            rej(err);
                        });
                } else {
                    res(null);
                }
            })
            .catch((error) => {
                console.log(error)
            });
    });
};

exports.updatefrarea = (param) => {
    return new Promise((res, rej) => {
        franchiseareaModel.find({
                $and: [{ "_id": { $ne: param._id } },
                    { "franchiseId": { $eq: param.franchiseId } },
                    { "areaId": { $eq: param.areaId } }
                ]
            })
            .then((frcats) => {
                var frarea_id = param._id
                delete param._id;
                if (!frcats.length) {
                    franchiseareaModel.findByIdAndUpdate({ "_id": frarea_id }, { $currentDate: { "modified": true }, $set: param })
                        .then((doc) => {
                            res(doc);
                        }).catch((err) => {
                            rej(err);
                        });
                }
            })
            .catch((error) => {
                console.log(error)
            });
    });
};

exports.gettotalfrarea = async(where) => {
    return new Promise((res, rej) => { 
        if(where){      
            franchiseareaModel.aggregate([ 
              {
                    "$lookup": {
                        "from": "areas",
                        "localField": "areaId",
                        "foreignField": "_id",
                        "as": "area"
                    }
                }, {
                    "$unwind": {
                        "path": "$area"
                    }
                }, {
                    "$lookup": {
                        "from": "cities",
                        "localField": "area.cityId",
                        "foreignField": "_id",
                        "as": "city"
                    }
                }, {
                    "$unwind": {
                        "path": "$city"
                    }
                }, 
            { $match: where }
            ]).then((doc) => { 
                res(doc.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{         
            franchiseareaModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.checkfrareas = (where) => {
    return new Promise((res, rej) => {
        franchiseareaModel.find(where).then((data) => {
            res(data);
        }).catch((error) => {
            rej(error);
        });
    });
};

exports.getfrareas = (where, params) => {
    return new Promise((resolve, reject) => {
        if(params.limit==0){
            franchiseareaModel.aggregate([{
               $match: where
            }, {
                "$project": {
                    "frarea": "$$ROOT"
                }
            }, {
                "$lookup": {
                    "from": "areas",
                    "localField": "frarea.areaId",
                    "foreignField": "_id",
                    "as": "area"
                }
            }, {
                "$unwind": {
                    "path": "$area"
                }
            }, {
                "$lookup": {
                    "from": "cities",
                    "localField": "area.cityId",
                    "foreignField": "_id",
                    "as": "city"
                }
            }, {
                "$unwind": {
                    "path": "$city"
                }
            }]).then((data) => {
                resolve(data);
            }).catch((error) => { reject(error); });
        }else{
            franchiseareaModel.aggregate([
            {
                $lookup: {
                    "from": "areas",
                    "localField": "areaId",
                    "foreignField": "_id",
                    "as": "area"
                }
            }, {
                $unwind: {
                    "path": "$area"
                }
            }, {
                $lookup: {
                    "from": "cities",
                    "localField": "area.cityId",
                    "foreignField": "_id",
                    "as": "city"
                }
            }, {
                $unwind: {
                    "path": "$city"
                }
            },
            { $match: where }, 
            { $sort : { [params.order]:params.dir } },
            { $skip : params.skip },
            { $limit : params.limit }    
            ]).then((data) => {
                resolve(data);
            }).catch((error) => { reject(error); });            
        }
    });
};

exports.frareastatus = (body) => {
    return new Promise((res, rej) => {
        franchiseareaModel.updateOne({ "_id": body._id }, { $currentDate: { "modified": true }, $set: { "is_active": body.is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.deletefrarea = (franchiseId, areaId) => {
    return new Promise((res, rej) => {
        franchiseareaModel.deleteOne({ franchiseId: franchiseId, areaId: areaId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.gettotalfrcategory = async(where) => {
    return new Promise((res, rej) => { 
        if(where){      
            franchisecatsModel.aggregate([ 
                {
                    "$lookup": {
                        "from": "catagory_subcatagories",
                        "localField": "frCats.catId",
                        "foreignField": "_id",
                        "as": "Cats"
                    }
                }, {
                    "$unwind": {
                        "path": "$Cats",
                        "preserveNullAndEmptyArrays": true
                    }
                }, {
                    "$lookup": {
                        "from": "catagory_subcatagories",
                        "localField": "Cats.catagory_id",
                        "foreignField": "_id",
                        "as": "mainCat"
                    }
                }, {
                    "$unwind": {
                        "path": "$mainCat",
                        "preserveNullAndEmptyArrays": true
                    }
                }, 
            { $match: where }
            ]).then((doc) => {
                res(doc.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{         
            franchisecatsModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getfranchisecatlist = (where) => {
    return new Promise((resolve, reject) => {
        ///console.log(where);
            franchisecatsModel.aggregate([{
               $match: where
            }, {
                "$project": {
                    "frCats": "$$ROOT"
                }
            }, {
                "$lookup": {
                    "from": "catagory_subcatagories",
                    "localField": "frCats.catId",
                    "foreignField": "_id",
                    "as": "Cats"
                }
            }, {
                "$unwind": {
                    "path": "$Cats",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                "$lookup": {
                    "from": "catagory_subcatagories",
                    "localField": "Cats.catagory_id",
                    "foreignField": "_id",
                    "as": "mainCat"
                }
            }, {
                "$unwind": {
                    "path": "$mainCat",
                    "preserveNullAndEmptyArrays": true
                }
            }]).then((data) => {
               
                resolve(data);
            }).catch((error) => { reject(error); });

    });
};

exports.getfranchisecat = (where, params) => {
    return new Promise((resolve, reject) => {
        if(params.limit==0){
            franchisecatsModel.aggregate([{
               $match: where
            }, {
                "$project": {
                    "frCats": "$$ROOT"
                }
            }, {
                "$lookup": {
                    "from": "catagory_subcatagories",
                    "localField": "frCats.catId",
                    "foreignField": "_id",
                    "as": "Cats"
                }
            }, {
                "$unwind": {
                    "path": "$Cats",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                "$lookup": {
                    "from": "catagory_subcatagories",
                    "localField": "Cats.catagory_id",
                    "foreignField": "_id",
                    "as": "mainCat"
                }
            }, {
                "$unwind": {
                    "path": "$mainCat",
                    "preserveNullAndEmptyArrays": true
                }
            }]).then((data) => {
                resolve(data);
            }).catch((error) => { reject(error); });
        }else{
            franchisecatsModel.aggregate([
            {
                "$lookup": {
                    "from": "catagory_subcatagories",
                    "localField": "catId",
                    "foreignField": "_id",
                    "as": "Cats"
                }
            }, {
                "$unwind": {
                    "path": "$Cats",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                "$lookup": {
                    "from": "catagory_subcatagories",
                    "localField": "Cats.catagory_id",
                    "foreignField": "_id",
                    "as": "mainCat"
                }
            }, {
                "$unwind": {
                    "path": "$mainCat",
                    "preserveNullAndEmptyArrays": true
                }
            },
            { $match: where }, 
            { $sort : { [params.order]:params.dir } },
            { $skip : params.skip },
            { $limit : params.limit }
            ]).then((data) => {
                resolve(data);
            }).catch((error) => { reject(error); });
        }
    });
};
//---------------------------------

exports.getfranchiseCategoryIds = (franchiseId) => {
    return new Promise((res, rej) => {
        franchisecatsModel.find({ franchiseId: franchiseId, is_active: "1" }, { _id: 0, catId: 1 }).then((data) => {
            res(data);
        }).catch((error) => {
            rej(error);
        });
    });
};

exports.getfranchiseCategories = (franchiseId) => {
    return new Promise((resolve, reject) => {
        franchisecatsModel.aggregate([{
                $match: { franchiseId: franchiseId, "catagory.catagory_id": null }
            }, {
                "$project": {
                    "frCats": "$$ROOT"
                }
            }, {
                "$lookup": {
                    from: "catagory_subcatagories",
                    as: "catagory",
                    localField: "frCats.catId",
                    foreignField: "_id"
                }
            },
            {
                "$unwind": {
                    "path": "$catagory",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                $project: {
                    _id: 0,
                    "catagory._id": 1,
                    "catagory.title": 1,
                    "catagory.priority": 1,
                    "catagory.is_active": 1,
                    "catagory.catagory_id": 1,

                }
            }
        ]).then((data) => {
            resolve(data);
        }).catch((error) => {
            reject(error);
        });
    });
};

exports.frcatstatus = (body) => {
    return new Promise((res, rej) => {
        franchisecatsModel.updateOne({ "_id": body._id }, { $currentDate: { "modified": true }, $set: { "is_active": body.is_active } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.productslistforfranchise = (fId) => {
    var catId = [];
    var varProduct = [];
    var varProductImg = [];
    return new Promise((res, rej) => {
        franchisecatsModel.find({ franchiseId: fId }, { catId: 1, _id: 0 })
            .then((catIds) => {
                if (catIds.length > 0) {
                    catIds.forEach((i) => {
                        catId.push(i.catId);
                    });

                    productModel.aggregate([{
                                $match: { catId: { $in: catId } }
                            },
                            {
                                $sort: { title: 1 }
                            },
                            {
                                $lookup: {
                                    from: "productimages",
                                    as: "pimgs",
                                    localField: "_id",
                                    foreignField: "productId"
                                }
                            }, 
                        ])
                        .then((prducts) => {
                            res(prducts)
                        })
                        .catch((err) => {
                            rej(err);
                        })
                } else {
                    res(null);
                }
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.getFranchiseAreaOnCondition = async(cond = {}) => {
    return new Promise((res, rej) => {
        franchiseareaModel.find(cond)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err)
            })
    })
}

exports.savePurchasedItem = async(post) => {
    return new Promise((res, rej) => {
        purchasedItemModel.create(post)
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err)
            })
    })
}

exports.updatePurchasedItem = async(post) => {
    return new Promise((res, rej) => {
        purchasedItemModel.findOneAndUpdate({ _id: post._id }, { $set: post }, { new: true })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err)
            })
    })
}

// exports.getPurchasedItemByDate = async(where) => {
//     return new Promise((res, rej) => {
//         purchasedItemModel.find(where)
//             .sort({ created: 1 })
//             .then((doc) => {
//                 res(doc);
//             }).catch((err) => {
//                 rej(err)
//             })
//     })
// }

exports.getPurchasedItemById = async(_id) => {
    return new Promise((res, rej) => {
        purchasedItemModel.findOne({ _id })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err)
            })
    })
}

exports.getPurchasedItemByDate = async(where) => {
    return new Promise((res, rej) => {
        purchasedItemModel.aggregate([{
                $lookup: {
                    from: "franchiseproducts",
                    as: "franchiseproduct",
                    localField: "franchise_product_id",
                    foreignField: "_id"
                }
            }, {
                $lookup: {
                    from: "products",
                    as: "product",
                    localField: "franchiseproduct.productId",
                    foreignField: "_id"
                }
            }, {
                $lookup: {
                    from: "productimages",
                    as: "pImage",
                    localField: "product._id",
                    foreignField: "productId"
                }
            }, {
                $lookup: {
                    from: "franchises",
                    as: "franchise",
                    localField: "franchise_id",
                    foreignField: "_id"
                }
            }, {
                $unwind: {
                    "path": "$franchiseproduct",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                $unwind: {
                    "path": "$product",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                $unwind: {
                    "path": "$pImage",
                    "preserveNullAndEmptyArrays": true
                }
            }, {
                $unwind: {
                    "path": "$franchise",
                    "preserveNullAndEmptyArrays": true
                }
            }, { $match: where },
            { $sort: { "product.title": 1 } }
        ])


        .then((doc) => {
            res(doc);
        }).catch((err) => {
            rej(err)
        })
    })
}