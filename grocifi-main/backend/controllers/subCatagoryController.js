const catagoryDatalayer = require('../datalayers/subCatagoryDatalayers');
const message = require("../helpers/languages/english");
const errorMessage = require("../helpers/error_codes/errorCodes");


exports.getAllCatagories = async (req,res)=>{
    const param = req.query.title;   //Getting title param to search 
    catagoryDatalayer.getAllCatagories(param).then((doc)=>{
        res.json({
            message: message.SUCCESS,
            sucess: errorMessage.SUCEESS,
            catagory_data: doc,
        });
    }).catch((err)=>{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            err: errorMessage.BAD_REQUEST,
            error: err,
        });
    });

};

exports.save = async (req,res)=>{
    const param = req.body;
    catagoryDatalayer.save(param).then((doc)=>{
        res.json({
            message: message.SUCCESS,
            sucess: errorMessage.SUCEESS,
            catagory_created: doc,
        });
    }).catch((err)=>{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            err: errorMessage.BAD_REQUEST,
            error: err,
        });
    });

}

exports.edit = async (req,res)=>{
    const param = req.body;
    const id = req.params.id;
    console.log(param,id);
    catagoryDatalayer.edit(id,param).then((doc)=>{
        res.json({
            message: message.SUCCESS,
            sucess: errorMessage.SUCEESS,
            catagory_created: doc,
        });
    }).catch((err)=>{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            err: errorMessage.BAD_REQUEST,
            error: err,
        });
    });
}


exports.deletecatagory = async (req,res)=>{
    const id = req.params.id;
    catagoryDatalayer.delete(id).then((doc)=>{
        res.json({
            message: message.SUCCESS,
            sucess: errorMessage.SUCEESS,
            catagory_created: doc,
        });
    }).catch((err)=>{
        res.json({
            message: message.SOMETHING_WENT_WRONG,
            err: errorMessage.BAD_REQUEST,
            error: err,
        });
    });
    
}