const adminpermissionModule = require('../modules/AdminPermission');


exports.getuserpermission = async(where) => {
    return new Promise((res, rej) => {
        adminpermissionModule
            .find(where) 
            .then((doc) => {
                res(doc);
            })
            .catch((e) => {
                console.log(e);
                rej(e);
            });
    });
};
 

exports.saveuserpermission = async(param) => {
    return new Promise((res, rej) => {
        adminpermissionModule
            .insertMany(param)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
    });
}; 


exports.updateuserpermission = (body) => {
    return new Promise((res, rej) => {
        var perId = body._id;
        var mode = body.mode;
        var modeval = body.modeval;
        if(mode=='is_view'){ 
            adminpermissionModule.updateOne({ "_id": perId }, { $currentDate: { "modified": true }, $set: { "is_view": modeval } })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        }else if(mode=='is_add'){ 
            adminpermissionModule.updateOne({ "_id": perId }, { $currentDate: { "modified": true }, $set: { "is_add": modeval } })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        }else if(mode=='is_edit'){ 
            adminpermissionModule.updateOne({ "_id": perId }, { $currentDate: { "modified": true }, $set: { "is_edit": modeval } })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });    
        }else if(mode=='is_delete'){ 
            adminpermissionModule.updateOne({ "_id": perId }, { $currentDate: { "modified": true }, $set: { "is_delete": modeval } })
                .then((data) => {
                    res(data);
                }).catch((err) => {
                    rej(err);
                });
        }
    });
};
 

