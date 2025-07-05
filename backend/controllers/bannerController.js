const fs = require("fs");
const mongodb = require('mongoose');
const message = require('../helpers/languages/english');
const errorsCodes = require('../helpers/error_codes/errorCodes');
const bannerDatalayer = require('../datalayers/bannerDatalayer');

exports.allBanners = async (req,res)=>{
    let where = {};   
    let _and = [];
    if(req.query.franchise_id){
        _and.push({franchise_id: mongodb.Types.ObjectId(req.query.franchise_id)});
        where = {franchise_id: mongodb.Types.ObjectId(req.query.franchise_id)};  
    }
    var total = await bannerDatalayer.gettotalBanner(where); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir); 
    } 
    
    if(req.query.where){ 
        where = {
                "$or": [{
                    "title" : {$regex: new RegExp('^'+req.query.where+'', 'i') }  
                }, {
                    "franchiseName": {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }]
            };  
    }
    if (_and.length > 0) {
        where = { $and: _and }
    }
    var filtered = await bannerDatalayer.gettotalBanner(where); 
    ///console.log(filtered);
    bannerDatalayer.getAllBannerDetails(where, params)
    .then((doc)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:doc,
            total: total,
            filtered: filtered,
        })
    }).catch((err)=>{
        res.json({
            err:errorsCodes.RESOURCE_NOT_FOUND,
            msg:"Record(s) not found.",
            error:err
        })
    });
}

exports.getAllBannerDetails = async (req,res)=>{
    const param = req.query;
    if(param.franchise_id === undefined){
        // If there is no franchise id given then show banner having franchise id=0
        param.franchise_id = null;
        param.is_active ='1';
        bannerDatalayer.getAllBannerDetails(param)
        .then((doc)=>{
            res.json({
                sucess:errorsCodes.SUCEESS,
                msg:"",
                data:doc
    
            })
         })
        .catch((err)=>{
            res.json({
                err:errorsCodes.RESOURCE_NOT_FOUND,
                msg:"Record(s) not found.",
                error:err
            })
        });
    }else{
        ///console.log(param);
        bannerDatalayer.getAllBannerDetails(param).then((doc)=>{
            res.json({
                sucess:errorsCodes.SUCEESS,
                msg:"",
                data:doc
        })
    }).catch((err)=>{
            res.json({
                err:errorsCodes.RESOURCE_NOT_FOUND,
                msg:"Record(s) not found.",
                error:err
            })
        });
    }    
};

exports.save = async(req,res)=>{
    var param= req.body;
    param.img = req.body._img;
    if(req.file != undefined){
        param.img = req.file.filename;
    }
    
    bannerDatalayer.save(param)
    .then((doc)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:doc
        })
    })
    .catch((err)=>{
        res.json({
            err:errorsCodes.RESOURCE_NOT_FOUND,
            msg:"Record(s) not Inserted.",
            error:err
        })
    });
};

exports.getBannerById = async(req,res)=>{
    bannerDatalayer.getBannerById(req.params)
    .then((area)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:area
        });
    }).catch((error)=>{
        res.json({            
            err:errorsCodes.RESOURCE_NOT_FOUND,
            msg:"Record not found.",
            error:error
        });
    });
}

exports.delete = (req,res)=>{
    var id = req.params.id;
    //console.log(id);
    
    bannerDatalayer.delete(id).then((doc)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:doc

        });
    }).catch((err)=>{
        res.json({
            err:errorsCodes.RESOURCE_NOT_FOUND,
            msg:"Record(s) not Deleted.",
            error:err
        });
    });   
}

exports.updatebanner = async(req,res)=>{
    var param = req.body;
    param.img = req.body._img;
    bannerDatalayer.updatebanner(param)
    .then((doc)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:doc

        });
    }).catch((err)=>{
        res.json({
            err:errorsCodes.RESOURCE_NOT_FOUND,
            msg:"Record(s) not Updated.",
            error:err
        });
    });
}


exports.statusAll = async(req,res)=>{
    const is_active = {"is_active":req.body.is_active};
    const idArr = [];
  
  if(req.body.productIds && req.body.productIds.length > 0){
    req.body.productIds.forEach(_id=>{
      idArr.push(mongodb.Types.ObjectId(_id));
    });
  }else{
      return false;
  }
  bannerDatalayer.statusAll(idArr, is_active)
  .then((product)=>{
    res.json({
      sucess:errorsCodes.SUCEESS,
      msg:"",
      data:product
    });
  }).catch((err)=>{
    res.json({
      err:errorsCodes.RESOURCE_NOT_FOUND,
      msg:"",
      error:err
    });
  })
  
};

exports.logicalDeletebanner =(req,res)=>{
    bannerDatalayer.status(req.body._id, req.body.is_active).then((doc)=>{
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:doc
        });
    }).catch((err)=>{
        res.json({
            err:errorsCodes.RESOURCE_NOT_FOUND,
            msg:"Record(s) not Updated.",
            error:err
        });
    });
}

exports.uploadBannerImg = async(req, res)=>{
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/banner_img/" + req.file.filename;
    fs.renameSync( srcPath, destPath);

    res.json({
        sucess: errorsCodes.SUCEESS,
        name: req.file.filename
    });
}