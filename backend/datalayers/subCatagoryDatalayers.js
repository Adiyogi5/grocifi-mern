const catagoryModel = require('../modules/Catagory');



exports.getAllCatagories = async (param)=>{

        return new Promise((res,rej)=>{
            catagoryModel.find(param).then((doc)=>{
               subCatagoryValidation(doc);
                res(doc);
            }).catch((err)=>{
                rej(err);
            });
        });
    };


exports.save = async (param)=>{

        return new Promise((res,rej)=>{
            catagoryModel.create(param).then((doc)=>{
                res(doc);
            }).catch((err)=>{
                rej(err);
            });
        });
    };    


exports.edit  = async (id,param)=>{

    return new Promise((res,rej)=>{
        catagoryModel.findByIdAndUpdate(id,param).then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
};    
    

exports.delete  = async (id)=>{

    return new Promise((res,rej)=>{
        catagoryModel.findByIdAndDelete(id).then((doc)=>{
            res(doc);
        }).catch((err)=>{
            rej(err);
        });
    });
};  



function subCatagoryValidation (param){
    console.log(param);
    var flag = 0;
    for (let id of param){
        
        if(id.catagorytId=='0'){
            console.log(hi);
        }

        // console.log(typeof id.catagorytId);
    }
}