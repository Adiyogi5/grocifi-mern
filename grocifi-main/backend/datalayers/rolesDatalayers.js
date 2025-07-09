const rolesModel = require('../modules/Roles');

exports.gettotalroles = async(where) => {
    return new Promise((res, rej) => {
        rolesModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
    });
};

exports.getRoles = async(where, params) => {
    return new Promise((res, rej) => {
        if (params.limit == 0) {
            rolesModel.find(where).sort({ role_code: 1 })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            })
        }else{
            rolesModel.aggregate([ 
                    { $match: where },
                    { $sort: {[params.order]: params.dir } },
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

exports.getLastRoles = async() => {
    return new Promise((res, rej) => {
        rolesModel.find().limit(1).sort({ role_code: -1 })
            .then((data) => {
                let n = 0;
                if (data.length > 0) {
                    n = data[0].role_code;
                }
                n++;
                res(n);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.save = async(param) => {
    return new Promise((res, rej) => {
        rolesModel.create(param).then((data) => {
            res(data);
        }).catch((err) => {
            rej(err);
        })

    });
}

exports.getRoleById = async(_id) => {
    return new Promise((res, rej) => {
        rolesModel.findOne({ _id }).then((data) => {
            res(data);
        }).catch((err) => {
            rej(err);
        })

    });
}

exports.update = async(id, param) => {
    return new Promise((res, rej) => {
        rolesModel.findByIdAndUpdate(id, { $currentDate: { "modified": true }, $set: param }, { new: true }).then((data) => {
            res(data);
        }).catch((err) => {
            rej(err);
        })

    });
}

exports.statusAll = (pId, status) => {
    return new Promise((res, rej) => {
        rolesModel.updateMany({ "_id": { $in: pId } }, { $currentDate: { "modified": true }, $set: status })
            .then((doc) => {
                res(doc);
            }).catch((err) => {
                rej(err);
            });
    });
};