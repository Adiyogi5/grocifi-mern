const moment = require("moment");
const mongoose = require("mongoose");
const cartModel = require("../modules/Cart");
const carttotalModel = require("../modules/CartTotal");
const productModel = require("../modules/Products"); 


exports.save = async (param)=>{
    return new Promise((res,rej)=>{ 
        cartModel.create(param)
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}

exports.update = (body) => {
    return new Promise((res, rej) => {
        var cartId = body._id;
        delete body._id;
        cartModel.findOneAndUpdate({ "_id": cartId }, { $currentDate: { "modified": true }, $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.updateSessionCart = (body) => {
    return new Promise((res, rej) => {
        var sessionId = body.session_id; 
        cartModel.updateMany({ "session_id": sessionId }, { $set: body })
            .then((data) => {
                res(data);
            }).catch((err) => {
                rej(err);
            });
    });
};

exports.updateCartTotal = (body, sessionId) => {
    return new Promise((res, rej) => {  
        carttotalModel.find({'session_id':sessionId})
            .then((data) => {    
                if (data.length == 0) {
                    carttotalModel.create(body)
                    .then((doc)=>{
                        res(doc);
                    }).catch((err)=>{
                        rej(err);
                    })
                }else{
                    carttotalModel.update({ "session_id": sessionId }, { $set: body[0] })
                    .then((data) => { 
                        res(data);
                    }).catch((err) => {
                        rej(err);
                    });
                } 

            })
            .catch((error) => {
                reject(error)
            }) 
    });
};


exports.deleteCart = async (where)=>{
    return new Promise((res,rej)=>{
        cartModel.deleteMany(where).then((doc)=>{            
            carttotalModel.deleteMany(where).then((doc)=>{            
                res(doc);                
            }).catch((err)=>{
                rej(err);
            }) 
        }).catch((err)=>{
            rej(err);
        })
    })
}


exports.delete = async (id)=>{
    return new Promise((res,rej)=>{
        cartModel.findByIdAndDelete(id).then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}


exports.deletecarttotal = async (where)=>{
    return new Promise((res,rej)=>{
        carttotalModel.deleteMany(where).then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}

exports.checkCartexist = async(where = {}) => {
    return new Promise((resolve, reject) => {
        cartModel
            .findOne(where)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
} 
 
exports.getCarttotal = async(where) => {
    return new Promise((resolve, reject) => {
        carttotalModel
            .findOne(where)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}  

exports.getUserCartdata = async(where = {}) => {
    return new Promise((resolve, reject) => {
        cartModel
            .find(where)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
} 
