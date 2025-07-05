const franchiseModel = require('../modules/Franchise');
const frprofileModel = require('../modules/FrProfile');
//const cat.... = require('../modules/cat...');

exports.getAllFranchise = ()=>{
    return new Promise((resolve, reject)=>{
        franchiseModel.aggregate([
            {
                $match:{ "is_active":"1"}
            },
            {
                $lookup:
                {
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"fUser",
                }
            },{
                $project:
                {
                    "_id":1,
                    "catId":1,
                    "subcatId":1,
                    "fUser._id":1, 
                    "fUser.fname":1, 
                    "fUser.is_active":1
                }
            },{
                 $unwind:  "$fUser"
            }
        ]).then((data)=>{
            data = data.filter((ele)=>{ return (ele.fUser.is_active === '1'); });
            var catIds = [];
            for(i=0; i<data.length;i++){
                catIds[i] = data[i].catId;
            }
            
            /*getCatagoriesByIds
            exports.getCatagoriesByIds = async (param)=>{
                return new Promise((res,rej)=>{
                    catagoryModel.find(param).then((doc)=>{
                        res(doc);
                    }).catch((err)=>{
                        rej(err);
                    });
                });
            }; */
            
            resolve(catIds);
        })
        .catch((error)=>{
            reject(error);
        });
    });
}

exports.saveFranchise = (param)=>{
    return new Promise((res,rej)=>{
        franchiseModel.create(param)
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
};

exports.getByField = (where)=>{
    return new Promise((res,rej)=>{
        franchiseModel.findOne(where)
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
};

exports.update = (param)=>{
    return new Promise((res,rej)=>{
        franchiseModel.findByIdAndUpdate({"_id":param.fId})
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
};

exports.status = (fId, status)=>{
    return new Promise((res,rej)=>{
        var s = "0";
        if(status.is_active != "0"){
            s = (status.is_active == "1")?"2":"1";
        }
        franchiseModel.findOneAndUpdate({"_id":fId}, { $currentDate:{"modified":true}, $set:{ "is_active":s }})
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
};

exports.delete = (fId)=>{
    return new Promise((res,rej)=>{
        franchiseModel.findByIdAndDelete(fId)
        .then((franchise)=>{
            if(!franchise){
                res(false);
            }else{
                res(true);
            }
        }).catch((err)=>{
            rej(err);
        });
    });
};