const fs = require("fs");
const moment = require("moment");
const mongodb = require("mongodb"); 
const ObjectId = require("mongoose").Types.ObjectId;
const userDatalayers = require("../datalayers/userDatalayer");
const errorsCodes = require("../helpers/error_codes/errorCodes");
const popupimgDatalayer = require("../datalayers/popupimgDatalayer");
const franchiseDatalayers = require('../datalayers/franchiseDatalayer');


exports.save = async(req, res) => {
    var body = req.body;

    var popimgData = [];
    var createdDate = new Date();
    createdDate = moment(createdDate).add(5, "hours");
    createdDate = moment(createdDate).add(30, "minutes");

    body.forEach(async(ele) => { 
        var where = { franchiseId: mongodb.ObjectId(ele.franchiseId) }  
        await popupimgDatalayer.deletebyfranchiseId(where);
    });

    body.forEach((ele) => { 
        popimgData.push({ 
            franchiseId: ele.franchiseId,
            popup_img: ele.popup_img,
            is_active: ele.is_active,
            created: createdDate,
            modified: createdDate,
        });
    });    
    
    popupimgDatalayer
    .saveAll(popimgData)
    .then((popimgRes) => { 
        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "Popup image update sucessfully..",
            data: [],
        });
    })
    .catch((error) => {
        res.json({
            err: errorsCodes.BAD_REQUEST,
            msg: "Invalid Request!!",
            error: error,
        });
    });

};   

exports.getpopupimg = async(req, res) => {
     let where = {};   
    if(req.params.fId){
        where = {franchiseId: mongodb.ObjectId(req.params.fId)};  
    }
    const isPopimg = await popupimgDatalayer.getpopupimagedata(where);
        
    if(isPopimg[0]){         
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:isPopimg,
        })

    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "No Record Found!!",
            data: []
        })              
    }

};


exports.deletepopupimg = async(req, res) => {
    let where = {}; 
    if(req.params.fId){
        where = {franchiseId: mongodb.ObjectId(req.params.fId)};  
    }
    const isPopimg = await popupimgDatalayer.getpopupimagedata(where);
   
    
    if(isPopimg[0]){  
        await popupimgDatalayer.deletebyfranchiseId(where);
        res.json({
            sucess:errorsCodes.SUCEESS,
            msg:"",
            data:[],
        })

    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "No Record Found!!",
            data: []
        })              
    }

};


exports.uploadimg = async(req, res)=>{
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath = __dirname + "/../public/uploads/popup_img/" + req.file.filename;
    fs.renameSync( srcPath, destPath);

    res.json({
        sucess: errorsCodes.SUCEESS,
        name: req.file.filename
    });
} 
