const popupimgModel = require('../modules/PopSlider');

exports.saveAll = async(param) => {
    return new Promise((res, rej) => {
        popupimgModel.create(param)
            .then((doc) => {
                res(doc)
            }).catch((err) => {
                rej(err);
            });
    });
}


exports.deletebyfranchiseId = async (where)=>{
    return new Promise((res,rej)=>{
        popupimgModel.deleteMany(where).then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}


exports.getpopupimagedata = async(where = {}) => {
    return new Promise((resolve, reject) => {
        popupimgModel
            .find(where)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
} 
