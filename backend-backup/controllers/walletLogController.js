const moment = require('moment');
const mongodb = require('mongodb')
const ObjectId = require('mongoose').Types.ObjectId;
const walletLogDatalayers = require('../datalayers/walletLogDatalayers');
const userModel = require('../modules/User');
const userDatalayer = require('../datalayers/userDatalayer');
const walletModel = require('../modules/Wallet');
const errorsCodes = require("../helpers/error_codes/errorCodes");
const notify = require("../controllers/notificationController");

exports.getwalletlog = async(userId) => {

}


exports.saveLog = async(req, res) => {
    const param = req.body;
    walletLogDatalayers.save(param)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: doc,
            });
        }).catch((err) => {
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                err: err,
            });
        })
}



exports.getLog = async(req, res) => {
   /// const userId = mongodb.ObjectId(req.params.userId);
    let where = { "userId": mongodb.ObjectId(req.params.userId) };
    var total = await walletLogDatalayers.gettotalWalletLog(where); 
    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order??"date";
        params.dir = req.query.dir??-1; 
    }else{
        where = { "userId": mongodb.ObjectId(req.params.userId) }
    } 
    if(req.query.where){ 
        where = {
                "$or": [{
                    "description" : {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }, {
                    "amount": {$regex: new RegExp('^'+req.query.where+'', 'i') }  
                }],
                "$and":[{ "userId": mongodb.ObjectId(req.params.userId) }]
            };  
    }    
    
    var filtered = await walletLogDatalayers.gettotalWalletLog(where); 
    walletLogDatalayers.getLog(where, params)
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
                total: total,
                filtered: filtered,
            });
        })
        .catch(error => {
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "No record found.",
                err: error,
            });
        });

}

exports.referandearn = async(req, res) => {

    res.send('Working On the Routes');

}

exports.setExpireWalletAmount = async(req, res) => {
    var today = new Date();

    today = moment(today).format().split("T")[0];
    today = new Date(today + "T00:00:00.000Z");

    var todayEnd = moment(today).add(1, "days");
    todayEnd = new Date(todayEnd);

    walletLogDatalayers.setExpireWalletAmount(today, todayEnd)
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((error) => {
            console.log("Expiration wallet Error: " + error);
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something wen wrong...",
                err: error,
            });
        });
}

exports.todayWalletExpiry = async(req, res) => {
    var today = new Date(req.params.today);

    let where = {}; 
    let _and = [];   
    let where1 = {};
    _and.push({role_type: "4" });  
    where = { $and: _and } ; 
    sort = { created: -1 }; 
   /// console.log(filtered);
    walletLogDatalayers.getwalletCustomer(where, sort, today)
    .then((doc) => { 
        res.json({ 
            sucess: errorsCodes.SUCCESS,
            msg: "SUCCESS",
            data: doc, 
        });
    })
    .catch((err) => {
        res.json({
            err: errorsCodes.BAD_REQUEST,
            message: "Something wen wrong...",
            error: err,
        });
    });
     
}


exports.sendnotifyExpireWallet = async(req, res) => {
    var today = new Date(req.params.today);    
    day = moment(today).format("DD-MM-YYYY").split("T")[0]; 
     
    let where = {}; 
    let _and = [];   
    let where1 = {};
    _and.push({role_type: "4" });  
    where = { $and: _and } ; 
    sort = { created: -1 };  
    walletLogDatalayers.getwalletCustomer(where, sort, today)
        .then((walletData) => { 
            var data = [];
            var added = false; 
            var flag = true;
            var creditAmt = 0;
            var debitAmt = 0;
            var expireAmt = 0;
            if (walletData.length > 0) {
                walletData.forEach((ele, index) => { 
                    if (ele.creditwalletlogs[0] != null && ele.creditwalletlogs[0] != undefined) { 
                       creditAmt = ele.creditwalletlogs[0].amount;    
                    }else{
                       creditAmt = 0; 
                    }
                    if (ele.debitwalletlogs[0] != null && ele.debitwalletlogs[0] != undefined) { 
                       debitAmt = ele.debitwalletlogs[0].amount;    
                    }else{ 
                       debitAmt = 0; 
                    } 
                    expireAmt= parseFloat(creditAmt)-parseFloat(debitAmt);
                    if (expireAmt > 0) {  
                        data.push({
                            userId: ele._id,
                            msgtoBeSent: 'Your wallet amount rs. '+expireAmt+'/- will be expire on '+day+'.',
                        });
                    }
                }); 
                data.forEach((ele) => {
                    notify.notify(mongodb.ObjectId(ele.userId), "Alert for today's expiration", ele.msgtoBeSent);
                });
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: data,
                });   
            }else{
                res.json({
                    error: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Something wen wrong...",
                    err: error,
                });
            }            
        })
        .catch((error) => { 
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something went wrong...",
                err: error,
            });
        });
}

exports.markExpireUserWallet = async(req, res) => {
    var today = new Date(req.params.today);    
    expDay = moment(today).format().split("T")[0]; 
     
    let where = {}; 
    let _and = [];   
    let where1 = {};
    _and.push({role_type: "4" });  
    where = { $and: _and } ; 
    sort = { created: -1 };  
    walletLogDatalayers.getwalletCustomer(where, sort, today)
        .then((walletData) => { 
            var data = [];
            var added = false; 
            var flag = true;
            var creditAmt = 0;
            var debitAmt = 0;
            var expireAmt = 0;
            if (walletData.length > 0) {
                walletData.forEach((ele, index) => { 
                    if (ele.creditwalletlogs[0] != null && ele.creditwalletlogs[0] != undefined) { 
                       creditAmt = ele.creditwalletlogs[0].amount;    
                    }else{
                       creditAmt = 0; 
                    }
                    if (ele.debitwalletlogs[0] != null && ele.debitwalletlogs[0] != undefined) { 
                       debitAmt = ele.debitwalletlogs[0].amount;    
                    }else{ 
                       debitAmt = 0; 
                    } 
                    expireAmt= parseFloat(creditAmt)-parseFloat(debitAmt);
                    if (expireAmt > 0) {
                        walletLogDatalayers.save({
                            userId: ele._id,
                            wallet_amount: expireAmt,
                            description: 'Wallet amount expired, Due to unused!!.',
                            expire_on: expDay,
                            transaction: '2' 
                        });
                        amtToBeUpdate = ele.wallet_balance-expireAmt;
                        userModel.updateOne({ _id: ele._id }, { $currentDate: { modified: true }, $set: { wallet_balance: amtToBeUpdate } })
                        .then((userBalanceUpdateResult) => {
                            //
                        })
                        .catch(error => {
                            console.log("User balance updation at walletExpiration function error : " + error);
                        });
                    }
                });  
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: data,
                });   
            }else{
                res.json({
                    error: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Something went wrong...",
                    err: error,
                });
            }            
        })
        .catch((error) => { 
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something went wrong...",
                err: error,
            });
        });
}


exports.getuserWalletdebit = async(req, res) => {
    let userId = mongodb.ObjectId(req.params.userId);
    let where = { userId:userId, transaction:"2"  }; 
    
    walletLogDatalayers.getuserWalletdebit(where, userId)
    .then((doc) => { 
        res.json({ 
            sucess: errorsCodes.SUCCESS,
            msg: "SUCCESS",
            data: doc, 
        });
    })
    .catch((err) => {
        res.json({
            err: errorsCodes.BAD_REQUEST,
            message: "Something wen wrong...",
            error: err,
        });
    });
}

exports.todayWalletExpiryOLD = async(req, res) => {
    var today = new Date(req.params.today);

    today = moment(today).format().split("T")[0];
    today = new Date(today + "T00:00:00.000Z");
    var todayEnd = moment(today).add(1, "days");
    todayEnd = new Date(todayEnd);
    
    let where  = { expire_on: { $gte: today, $lt: todayEnd }, transaction: "1", is_active: "1" };   
   // console.log(total);
    var total = await walletLogDatalayers.gettotalWalletExpiry(where); 
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
                    "userName" : {$regex: new RegExp('^'+req.query.where+'', 'i') } 
                }, {
                    "phone_no": {$regex: new RegExp('^'+req.query.where+'', 'i') }  
                }],
                "$and": [{ expire_on: { $gte: today, $lt: todayEnd }, transaction: "1", is_active: "1" }]
            };  
    }
    var filtered = await walletLogDatalayers.gettotalWalletExpiry(where); 
   /// console.log(where);
    
    walletLogDatalayers.todayWalletExpiry(where, params)
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
                total: total,
                filtered: filtered,
            });
        })
        .catch((error) => {
            console.log("Expiration wallet Error: " + error);
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something wen wrong...",
                err: error,
            });
        });
}

exports.setExpireWalletAmountFromPreviouseDay = async(req, res) => {
    var today = new Date();

    today = moment(today).subtract(1, "days");
    today = moment(today).format().split("T")[0];
    today = new Date(today + "T00:00:00.000Z");

    var todayEnd = moment(today).add(1, "days");
    todayEnd = new Date(todayEnd);

    ////console.log(todayEnd);
    walletLogDatalayers.setExpireWalletAmountFromPreviouseDay(todayEnd)
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((error) => {
            console.log("Expiration wallet Error: " + error);
            res.json({
                error: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something wen wrong...",
                err: error,
            });
        });
}

exports.notifyBeforeExpireWallet = async(req, res) => {
    var today = req.body.today;

    today = moment(today).format().split("T")[0];
    today = new Date(today + "T00:00:00.000Z");
    var todayEnd = moment(today).add(2, "days");
    todayEnd = new Date(todayEnd);

    var walletData = await walletLogDatalayers.notifyBeforeExpireWallet(today, todayEnd);
    var data = [];
    var added = false;
    var day = "today";
    var flag = true;
    if (walletData.length > 0) {
        walletData.forEach((ele, index) => {
            day = (today.getDate() == ele.expire_on.getDate()) ? "today" : "tomorrow";
            flag = (day == "today") ? true : false;

            if (data.length > 0) {
                added = false;
                data.forEach((eles, indx) => {
                    if (JSON.stringify(ele.userId) == JSON.stringify(eles.userId)) {
                        data[indx].msgtoBeSent = "";
                        data[indx].toBeNotify.push({
                            flag: flag,
                            amt: ele.wallet_amount,
                            msg: `Your wallet amount rs. ${ele.wallet_amount}/- will be expired ${day}.`
                        });
                        added = true;
                    }
                });

                if (!added) {
                    data.push({
                        userId: ele.userId,
                        msgtoBeSent: "",
                        toBeNotify: [{
                            flag: flag,
                            amt: ele.wallet_amount,
                            msg: `Your wallet amount rs. ${ele.wallet_amount}/- will be expired ${day}.`
                        }]
                    });
                }
            } else {
                data.push({
                    userId: ele.userId,
                    msgtoBeSent: "",
                    toBeNotify: [{
                        flag: flag,
                        amt: ele.wallet_amount,
                        msg: `Your wallet amount rs. ${ele.wallet_amount}/- will be expired ${day}.`
                    }]
                });
            }
        });

        var todayMsg = '';
        var tomorrowMsg = '';
        var today_tomorrowMsg = '';
        var amtOne = "";
        var amtTwo = "";

        if (data.length > 0) {
            data.forEach((ele, index) => {
                amtOne = "";
                amtTwo = "";

                todayMsg = 'Some of your wallet amount <$$> has been expiring today. You have the last chance to utilize these amounts in your upcoming orders.';

                tomorrowMsg = 'Some of your wallet amount <$$$$> will expire tomorrow. You have the last chance to utilize these amounts in your upcoming orders.';

                today_tomorrowMsg = 'Some of your wallet amount <$$> has been expiring today and another amount <$$$$> will expire tomorrow. You have the last chance to utilize these amounts in your upcoming orders.';


                if (ele.toBeNotify.length > 1) {
                    ele.toBeNotify.forEach((eleIn) => {
                        if (eleIn.flag) {
                            amtOne = amtOne + " INR " + (eleIn.amt).toFixed(2) + "/-,";
                        } else {
                            amtTwo = amtTwo + " INR " + (eleIn.amt).toFixed(2) + "/-,";
                        }
                    })
                } else {
                    if (ele.toBeNotify[0].flag) {
                        amtOne = amtOne + " INR " + (ele.toBeNotify[0].amt).toFixed(2) + "/-";
                    } else {
                        amtTwo = amtTwo + " INR " + (ele.toBeNotify[0].amt).toFixed(2) + "/-";
                    }
                }

                if (amtOne != "" && amtTwo == "") {
                    data[index].msgtoBeSent = todayMsg.replace("<$$>", amtOne);
                }

                if (amtOne == "" && amtTwo != "") {
                    data[index].msgtoBeSent = tomorrowMsg.replace("<$$$$>", amtTwo);
                }

                if (amtOne != "" && amtTwo != "") {
                    today_tomorrowMsg = today_tomorrowMsg.replace("<$$>", amtOne);
                    today_tomorrowMsg = today_tomorrowMsg.replace("<$$$$>", amtTwo);
                    data[index].msgtoBeSent = today_tomorrowMsg;
                }
                delete data[index].toBeNotify;
            });
        }
    }

    data.forEach((ele) => {
        notify.notify(mongodb.ObjectId(ele.userId), "Alert for today's expiration", ele.msgtoBeSent);
    });

    res.json({
        sucess: errorsCodes.SUCEESS,
        msg: "",
        data: data,
    });
}

var changeDateFormat = (date_string) => {
    date_string = moment(date_string, "DD-MM-YYYY")
        .add(1, "days")
        .subtract(2, "hours");
    return date_string;
}

exports.happynewyeartoall = async(req, res) => {
    var users = await walletLogDatalayers.getzerouser();
    console.log(users.length);

    if (users.length > 0) {
        var msg = "Happy New Year too all!! You have been given INR 100.00 as a New Year gift. Place Order Now and Get Fresh Vegetables and Fruits.";
        users.forEach((ele) => {
            var resp = userDatalayer.giveamountinwallet(ele.phone_no, msg);

            if (resp == true) {
                notify.notify([mongodb.ObjectId(ele._id)], msg);
            }
        });
    }

    res.json({
        sucess: errorsCodes.SUCEESS,
        msg: "",
        data: users,
    });

    // console.log(users);
    // res.end();
    // return;
    // walletLogDatalayers.happynewyeartoall()
    //     .then((user) => {
    //         if (user == true) {
    //             res.json({
    //                 sucess: errorCodes.SUCEESS,
    //                 msg: "100/- Given"
    //             });
    //         } else {
    //             res.json({
    //                 sucess: errorCodes.DATA_NOT_FOUND
    //             });
    //         }

    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.json({
    //             err: errorCodes.DATA_NOT_FOUND,
    //             msg: "Phone number not found.",
    //             error: err,
    //         });
    //     });
};