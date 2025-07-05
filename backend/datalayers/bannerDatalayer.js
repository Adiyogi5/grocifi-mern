const bannerModule = require('../modules/Banner');

exports.gettotalBanner = async(where) => {
    return new Promise((res, rej) => {  
        if(where){      
            bannerModule.aggregate([ 
             {
                $lookup: {
                    from: "franchises",
                    localField: "franchise_id",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
             {
                "$unwind": {
                    "path": "$franchise",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    title: 1, 
                    franchiseName: {$concat: ['$franchise.firmname']},
                }
            },
            { $match: where }
            ]).then((banner) => {
                res(banner.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{      
            bannerModule.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.getAllBannerDetails = async (where, params)=>{
    return new Promise((res,rej)=>{
        if(params.limit==0){
            bannerModule.find(params).then((doc)=>{
                res(doc);
            }).catch((err)=>{
                rej(err);
            })
        }else{
            bannerModule.aggregate([ 
                {
                    $lookup: {
                        from: "franchises",
                        localField: "franchise_id",
                        foreignField: "_id",
                        as: "franchise",
                    },
                },
                 {
                    "$unwind": {
                        "path": "$franchise",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: { 
                        _id:1,
                        title: 1,
                        is_active:1,
                        franchise_id:1,
                        created:1, 
                        img:1,
                        franchiseName: {$concat: ['$franchise.firmname']},
                    }
                },
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },                
            ])
            .then((areas) => {
                res(areas);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.save = async (param)=>{
    return new Promise((res,rej)=>{
        if(param.franchise_id == "null" || param.franchise_id==""){
            param.franchise_id = null;
        }
        bannerModule.create(param)
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}

exports.delete = async (id)=>{
    return new Promise((res,rej)=>{
        bannerModule.findByIdAndDelete(id).then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}


exports.updatebanner =async(body)=>{
    return new Promise((res,rej)=>{
        var _id =body._id;
        body.franchise_id = (body.franchise_id == "null" || body.franchise_id=="")?null:body.franchise_id;
        bannerModule.findOneAndUpdate({"_id":_id}, { $currentDate:{"modified":true}, $set:body})
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}

exports.status =async(id,is_active)=>{
    return new Promise((res,rej)=>{
        bannerModule.updateOne({"_id":id}, { $currentDate:{"modified":true}, $set:{ "is_active":is_active }})
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        })
    })
}

exports.statusAll = (pId, status)=>{
    return new Promise((res,rej)=>{
      bannerModule.updateMany({ "_id":{$in:pId} },{ $currentDate:{ "modified":true },$set:status})
      .then((doc)=>{
        res(doc);
      }).catch((err)=>{
        rej(err);
      });
    });
  };

  exports.getBannerById = (param)=>{
    return new Promise((res,rej)=>{
        bannerModule.findOne({"_id":param.bannerId})
        .then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
  };