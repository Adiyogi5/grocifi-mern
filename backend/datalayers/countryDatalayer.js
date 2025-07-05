const countryModel = require("../modules/Country");



exports.gettotalCountry = async(where) => {
    return new Promise((res, rej) => {        
        countryModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.getAllCountry = (where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){
            countryModel.find(where).sort({ title: 1 })
                .then((countries) => {
                    res(countries);
                }).catch((error) => {
                    rej(error);
                });
        }else{ 
            countryModel.find(where).sort({ [params.order]:params.dir }).skip(params.skip).limit(params.limit)
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
        }    
    });
};

exports.saveCountry = async(param) => {
    return new Promise((res, rej) => {
        countryModel
            .create(param)
            .then((country) => {
                res(country);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.saveAllCountry = async(param) => {
    return new Promise((res, rej) => {
        countryModel
            .insertMany(param)
            .then((country) => {
                res(country);
            })
            .catch((error) => {
                rej(error);
            });
    });
};


exports.edit = (param) => {
    return new Promise((res, rej) => {
        countryModel.findOne({ "_id": param.cntryId })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.update = (body) => {
    return new Promise((res, rej) => {
        var cntryId = body._id;
        delete body._id;
        countryModel.findOneAndUpdate({ "_id": cntryId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.status = (_id, status) => {
    return new Promise((res, rej) => {
        countryModel.updateOne({ "_id": _id }, { $currentDate: { "modified": true }, $set: { "is_active": status } })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        countryModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};
exports.delete = (cntryId) => {
    return new Promise((res, rej) => {
        countryModel.findByIdAndDelete(cntryId)
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