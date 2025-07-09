const fs = require("fs");
const moment = require('moment');
const mongodb = require('mongodb')
const errorCodes = require("../helpers/error_codes/errorCodes");
const userDatalayers = require("../datalayers/userDatalayer");
const voucherDatalayer = require("../datalayers/voucherDatalayer"); 
const { check, validationResult } = require("express-validator");
const { stringify } = require("querystring");


exports.getVoucherList = async(req, res) => {
    let where = {};  
    let _and = [];
    if(req.query.franchise_id){
        _and.push({"user.franchise_id": mongodb.ObjectId(req.query.franchise_id)});
        where = {"user.franchise_id": mongodb.ObjectId(req.query.franchise_id)};  
    }     

    if (req.query.created_from && req.query.created_from != "" && req.query.created_to && req.query.created_to != "") {
        let created_from = new Date(moment(req.query.created_from).add(5, "hours").add(30, "minutes"));
        let created_to = new Date(moment(req.query.created_to).add(1, "days").add(5, "hours").add(30, "minutes"));
        _and.push({ created: { $gte: created_from, $lt: created_to } }); 
    } 
    var total = await voucherDatalayer.gettotalvouchers(where); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir); 
    } 
    if(req.query.where){ 
        where = {
                "$or": [ {
                    "franchiseName": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }, {
                    "deliveryboy": {$regex: new RegExp('^'+req.query.where+'', 'i')}  
                }]
            };  
    }
    if (_and.length > 0) {
        where = { $and: _and }
    }
    ///console.log(where);
    var filtered = await voucherDatalayer.gettotalvouchers(where);
    voucherDatalayer.getVouchers(where, params)
        .then((result) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: result,
                total: total,
                filtered: filtered,
            });
        })
        .catch(error => {
            res.json({
                error: errorCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                err: error,
            });
        });
} 

exports.save = async(req, res) => {
    var param = req.body; 
    var user_id = mongodb.ObjectId(req.body.user_id); 
    var amount = parseFloat(req.body.amount);
    voucherDatalayer.saveVoucher(param)
        .then( async(result) => { 

            userDatalayers.updateOrderDeliveryStatus(user_id, { "delivery_detail.deposit": amount });
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch(error => {
            res.json({
                error: errorCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                err: error,
            });
        });
} 
 
exports.status = (req, res) => {
    modifiedby = req.body.modifiedby;
    is_active = req.body.is_active;
    voucherDatalayer.status(mongodb.ObjectId(req.body._id), is_active, modifiedby)
        .then((doc) => {
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};   

exports.getDepositbyuser = (req, res) => {  

    let _and = {is_active:"0"}; 
    let where = [];    
    if(req.params.userId){
        _and.push({user_id: mongodb.ObjectId(req.params.userId)});
    } 
    if ((req.query.start) && (req.query.start)) {
        let startDate = (req.query.start) ? new Date(req.query.start) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));
        let endDate = (req.query.end) ? new Date(moment(req.query.end).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        _and.push({ created: { $gte: startDate, $lt: endDate } });
    } 
    if (_and.length > 0) {
        where = { $and: _and }
    }    
    voucherDatalayer.getdepositbyuser(where)
        .then((doc) => { 
            res.json({
                sucess: errorCodes.SUCEESS,
                msg: "",
                data: doc
            });
        }).catch((err) => {
            res.json({
                err: errorCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err
            });
        });
};  
