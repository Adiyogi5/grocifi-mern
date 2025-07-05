const addressModel = require("../modules/Address");

exports.getAll_Address_On_Phone_no = async(param) => {
    return new Promise((res, rej) => {
        addressModel.aggregate([
                { $match: param },  
                {
                    $lookup: {
                        from: "areas",
                        as: "area",
                        localField: "areaId",
                        foreignField: "_id"
                    }
                },
                {
                    "$unwind": {
                        "path": "$area",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $lookup: {
                        from: "cities",
                        as: "city",
                        localField: "cityId",
                        foreignField: "_id"
                    }
                },
                {
                    "$unwind": {
                        "path": "$city",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $lookup: {
                        from: "states",
                        as: "state",
                        localField: "stateId",
                        foreignField: "_id"
                    }
                },
                 {
                    "$unwind": {
                        "path": "$state",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $lookup: {
                        from: "countries",
                        as: "country",
                        localField: "countryId",
                        foreignField: "_id"
                    }
                }, 
                  {
                    "$unwind": {
                        "path": "$country",
                        "preserveNullAndEmptyArrays": true
                    }
                },              
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        /*addressModel.find(param)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });*/
    });
};

exports.saveAddress = async(param) => {
    return new Promise((resolve, reject) => {
        addressModel.create(param)
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.editAddress = async(id, param) => {
    return new Promise((resolve, reject) => {
        addressModel.findByIdAndUpdate(id, { $currentDate: { modified: true }, $set: param })
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


exports.removedefaultAddress = async(userId) => {
    return new Promise((res, rej) => { //------------------
        var updateAll = { default_address: false };  
        //console.log("userId: "+userId);
        //console.log(updateAll);
        addressModel.updateMany({ userId: userId }, { $currentDate: { modified: true }, $set: updateAll })
            .then((document) => { 
                res(document);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.defaultAddress = async(id, userId, default_address) => {
    return new Promise((res, rej) => { //------------------
        var updateAll = { default_address: false };
        var updateOne = { default_address: default_address };

        addressModel.updateMany({ userId: userId }, { $currentDate: { modified: true }, $set: updateAll })
            .then((document) => {
                if (default_address) {

                    addressModel.updateOne({ _id: id }, { $currentDate: { modified: true }, $set: updateOne })
                        .then((doc) => {
                            res(doc);
                        })
                        .catch((err) => {
                            rej(err);
                        });
                }
                res(document);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.deleteAddress = async(id) => {
    return new Promise((resolve, reject) => {
        addressModel
            .findByIdAndDelete(id)
            .then((doc) => {
                resolve(doc);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.logicallydelete = async(body) => {
    return new Promise((res, rej) => {
        addressModel.findByIdAndUpdate(body._id, { $currentDate: { modified: true }, $set: body })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getaddress = async(id) => {
    return new Promise((res, rej) => {
        addressModel.findOne({ _id: id })
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getDefaultAddressOfUser = async(userId) => {
    return new Promise((res, rej) => {
        addressModel.aggregate([
                { $match: { default_address: true, userId: userId, is_active: '1' } },
                {
                    $lookup: {
                        from: "areas",
                        as: "area",
                        localField: "areaId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "cities",
                        as: "city",
                        localField: "cityId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "states",
                        as: "state",
                        localField: "stateId",
                        foreignField: "_id"
                    }
                },
                {
                    $lookup: {
                        from: "countries",
                        as: "country",
                        localField: "countryId",
                        foreignField: "_id"
                    }
                },
                {
                    $project: {
                        "address1": 1,
                        "address2": 1,
                        "address_type": 1,
                        "default_address": 1,
                        "lat": 1,
                        "long": 1,
                        "is_active": 1,
                        "countryId": 1,
                        "stateId": 1,
                        "cityId": 1,
                        "areaId": 1,
                        "pincode": 1,
                        "phone_no":1,
                        //"subarea.title":1,
                        "area._id": 1,
                        "area.title": 1,
                        "city._id": 1,
                        "city.title": 1,
                        "state._id": 1,
                        "state.title": 1,
                        "country._id": 1,
                        "country.title": 1
                    }
                }
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

exports.getDetailedAddress = async(address_id) => {
    return new Promise((res, rej) => {
        addressModel.aggregate([
                { $match: { _id: address_id } },
                {
                    $lookup: {
                        from: "areas",
                        as: "area",
                        localField: "areaId",
                        foreignField: "_id"
                    }
                }, {
                    $lookup: {
                        from: "cities",
                        as: "city",
                        localField: "cityId",
                        foreignField: "_id"
                    }
                }, {
                    $lookup: {
                        from: "states",
                        as: "state",
                        localField: "stateId",
                        foreignField: "_id"
                    }
                }, {
                    $lookup: {
                        from: "countries",
                        as: "country",
                        localField: "countryId",
                        foreignField: "_id"
                    }
                }, {
                    $project: {
                        "address1": 1,
                        "address2": 1,
                        "address_type": 1,
                        "default_address": 1,
                        "lat": 1,
                        "long": 1,
                        "is_active": 1,
                        "countryId": 1,
                        "stateId": 1,
                        "cityId": 1,
                        "areaId": 1,
                        "pincode": 1,
                        "phone_no":1,
                        "area._id": 1,
                        "area.title": 1,
                        "city._id": 1,
                        "city.title": 1,
                        "state._id": 1,
                        "state.title": 1,
                        "country._id": 1,
                        "country.title": 1
                    }
                }
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
};

/**
 * 
 * 
 * 
 * areaModel.aggregate([
      {
        $lookup:{
          from: "cities",
          localField: "cityId",
          foreignField: "_id",
          as: "city",
        }
      },
      {
        $project:
        { 
          __v: 0, 
          created:0,
          updated:0,
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
        $unwind: { path: "$city", preserveNullAndEmptyArrays: false },
      }
    ])
 */