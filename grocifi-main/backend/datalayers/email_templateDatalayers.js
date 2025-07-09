const emailModel = require('../modules/EmailTemplate');


exports.listAll = async (condition={})=>{
    return new Promise((resolve,reject)=>{
        emailModel.find(condition).then((doc)=>{
            resolve(doc);
        }).catch((err)=>{
            reject(err);
        })
    })
}

exports.create =  async (params)=>{
    return new Promise((resolve,reject)=>{
        emailModel.create(params).then((doc)=>{
            resolve(doc);
        }).catch((err)=>{
            reject(err);
        })
    })
}

exports.edit =  async (id,param)=>{
    return new Promise((resolve,reject)=>{
        emailModel.findByIdAndUpdate(id,{$set:param,$currentDate:{"modified":true}}).then((doc)=>{
            resolve(doc);
        }).catch((err)=>{
            reject(err);
        })
    })
}


exports.delete = async (id)=>{
    return new Promise((resolve,reject)=>{
        emailModel.findByIdAndDelete(id).then((doc)=>{
            resolve(doc);
        }).catch((err)=>{
            reject(err);
        })
    })
}