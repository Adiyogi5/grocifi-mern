const notificationModel = require('../modules/Notification');

exports.save = async(param) => {
    return new Promise((res, rej) => {
        notificationModel.create(param)
            .then((doc) => {
                res(doc)
            }).catch((err) => {
                rej(err);
            });
    });
}

exports.saveAll = async(param) => {
    return new Promise((res, rej) => {
        notificationModel.insertMany(param)
            .then((doc) => {
                res(doc)
            }).catch((err) => {
                rej(err);
            });
    });
}

exports.getnotificationofuser = async(where, params) => {
     return new Promise((res, rej) => {
        if(params.limit==0){
            notificationModel.find(where).sort({ _id: -1 })
            .then((notify) => {
                res(notify)
            }).catch((err) => {
                rej(err);
            })
        }else{
            notificationModel.aggregate([                  
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
            ])
            .then((notification) => {
                res(notification);
            })
            .catch((error) => {
                rej(error);
            }); 
        }
    }) 
}



exports.gettotalnotificationLog = async(where) => {
    return new Promise((res, rej) => {  
            notificationModel.aggregate([ 
                { $match: where }, 
            ])
            .then((notification) => { 
                res(notification.length);
            })
            .catch((error) => {
                rej(error);
            });
    });
};