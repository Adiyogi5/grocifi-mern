const moment = require("moment");
const userModel = require('../modules/User');
const walletModel = require('../modules/Wallet');
const settingsDatalayers = require("../datalayers/settingDatalayers");

exports.gettotalwalletCustomer = async(where) => {
    return new Promise((res, rej) => {  
         
        walletlog_cond = { $expr: { $gt: [ { $size: "$walletlogs"}, 0 ] }} ;
        userModel.aggregate([ 
            {
                $lookup: { 
                    from: "wallet_logs",
                    let: { "userId": "$_id" }, 
                    pipeline: [
                      {
                        $match: { $expr: { $eq: ["$userId", "$$userId"] } },
                      },
                    ],
                    as: "walletlogs",
                },
            },
            { $match: where } ,  
            {
                $project: { 
                    _id: 1, 
                    email: 1, 
                    role_type:1,
                    phone_no:1,
                    reg_from:1,
                    is_active: 1,
                    is_wholesaler:1,
                    full_name: { $concat: ["$fname", " ", "$lname"] }, 
                    walletlogs: { wallet_amount:1, expire_on:1, transaction:1, is_active:1 }
                }
            },            
            { 
                $match: walletlog_cond
            },             
            ])
            .then((doc) => {   
                res(doc.length);
            })
            .catch((err) => {
                console.log(err);
                rej(err);
            });
    });
}

exports.getwalletCustomer = (where, sort, today) => {
    ///console.log(today);
    return new Promise((res, rej) => {
            walletlog_cond = { $expr: { $gt: [ { $size: "$creditwalletlogs"}, 0 ] }} ;
            today = moment(today).format().split("T")[0];
            today = new Date(today + "T00:00:00.000Z");
            var todayEnd = moment(today).add(1, "days");
            todayEnd = new Date(todayEnd);

            userModel.aggregate([ 
            { $match: where },
            {
                $lookup: { 
                    from: "wallet_logs",
                    let: { "userId": "$_id" }, 
                    pipeline: [
                      {
                        $match: { $expr: { $eq: ["$userId", "$$userId"] },is_active:"1", transaction:"1", is_admin:"1", expire_on: { $lte: todayEnd }  },
                      },
                      {
                        $group: { 
                            _id: {
                                userId: "$userId",
                                transaction:"1", 
                            }, 
                            amount: { $sum: "$wallet_amount" },
                        }, 
                      }
                    ],
                    as: "creditwalletlogs",
                },
            }, 
            {
                $lookup: { 
                    from: "wallet_logs",
                    let: { "userId": "$_id" }, 
                    pipeline: [
                      {
                        $match: { $expr: { $eq: ["$userId", "$$userId"] }, transaction:"2"},
                      },
                      {
                        $group: { 
                            _id: {
                                userId: "$userId",
                                transaction:"1", 
                            }, 
                            amount: { $sum: "$wallet_amount" },
                        }, 
                      }
                    ],
                    as: "debitwalletlogs",
                },
            },  
            {
                $project: { 
                    _id: 1,
                    fname: 1,
                    lname: 1,
                    email: 1,
                    wallet_balance: 1,   
                    is_active: 1,  
                    created: 1,
                    phone_no: 1,  
                    is_wholesaler:1, 
                    full_name: { $concat: ["$fname", " ", "$lname"] },
                    creditwalletlogs: { amount:1 },
                    debitwalletlogs: { amount:1 } 
                }
            },  
            { 
                $match: walletlog_cond
            },
            { $sort : sort },               
            ])
            .then((doc) => {
                res(doc);
            })
            .catch((err) => {
                rej(err);
            });
    });
}


exports.getuserWalletcredit = async(where1, userId) => {
    return new Promise((res, rej) => {
        walletModel.aggregate([
                    { $match: where1 },
                    {
                        $group: {
                            _id: {
                                userId: userId,
                                transaction:"1" 
                            },
                            count: { $sum: 1 },
                            credit: { $sum: "$wallet_amount" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ])
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
    });
}

exports.getuserWalletdebit = async(where2, userId) => {
    return new Promise((res, rej) => {
        walletModel.aggregate([
                    { $match: where2 },
                    {
                        $group: {
                            _id: {
                                userId: userId,
                                transaction:"2" 
                            }, 
                            debit: { $sum: "$wallet_amount" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ])
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
    });
}

exports.save = async(param) => {
    return new Promise((res, rej) => {
        userModel.findById(param.userId)
            .then((userDoc) => {
                if (param.transaction == "1") {
                    param.current_wallet = Number(userDoc.wallet_balance) - Number(param.wallet_amount);
                    param.updated_wallet = param.current_wallet + Number(param.wallet_amount);
                } else {
                    param.current_wallet = Number(userDoc.wallet_balance) + Number(param.wallet_amount);
                    param.updated_wallet = param.current_wallet - Number(param.wallet_amount);
                }

                var createdDate = new Date();
                createdDate = moment(createdDate).add(5, "hours");
                createdDate = moment(createdDate).add(30, "minutes");

                param.date = createdDate;
                param.created = createdDate;
                param.modified = createdDate;

                walletModel.create(param)
                    .then((doc) => {
                        res(doc)
                    }).catch((err) => {
                        rej(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    });
}


exports.gettotalWalletLog = async(where) => {
    return new Promise((res, rej) => { 
        if(where){
            walletModel.aggregate([ 
                { $match: where }, 
            ])
            .then((wallet) => { 
                res(wallet.length);
            })
            .catch((error) => {
                rej(error);
            }); 
        }else{
            walletModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};


exports.getLog = async(where, params) => {
    return new Promise((res, rej) => {
        if(params.limit==0){
            walletModel.find(where).sort({ _id: -1 })
                .then((wlog) => {
                    res(wlog)
                }).catch((err) => {
                    rej(err);
                })
        }else{
            const validOrderFields = ['date', 'created', 'transaction', '_id'];  // Add valid fields as needed
            const validDirValues = [1, -1];  // Sort direction: 1 for ascending, -1 for descending

            // Default sorting behavior if params.order or params.dir are invalid
            let sortField = params.order && validOrderFields.includes(params.order) ? params.order : '_id';
            let sortDir = params.dir && validDirValues.includes(params.dir) ? params.dir : -1;
            walletModel.aggregate([
                {
                    $lookup: {
                        as: "users",
                        localField: "userId",
                        foreignField: "_id",
                        from: "users"
                    }
                }, 
                {
                    "$unwind": {
                        "path": "$users",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: { 
                        _id:1,
                        date: 1,
                        transaction:1,
                        updated_wallet:1,
                        current_wallet:1,
                        is_active:1,
                        expire_on:1, 
                        description:1, 
                        created:1,
                        userId:1,
                        wallet_amount:1,
                        createdby:1,
                        modifiedby:1,
                        usersName: { $concat: ["$users.fname", " ", "$users.lname"] },
                    }
                }, 
                { $match: where }, 
                { $sort: { [sortField]: sortDir } },
                { $skip : params.skip },
                { $limit : params.limit  },
            ])
            .then((wallets) => {
                res(wallets);
            })
            .catch((error) => {
                rej(error);
            }); 

        }
    })
}


exports.gettotalWalletExpiry = async(where) => {
    return new Promise((res, rej) => {  
        if(where){      
            walletModel.aggregate([ 
             {
                $lookup: {
                    from: "users",
                    as: "user",
                    localField: "userId",
                    foreignField: "_id"
                }
            },
            {
                "$unwind": {
                    "path": "$user",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $project: {
                    _id:1,
                    expire_on:1,
                    transaction:1,
                    is_active:1,
                    phone_no: '$user.phone_no', 
                    userName: {$concat: ['$user.fname',' ','$user.lname']},
                }
            },
            { $match: where }
            ]).then((wallet) => {
                res(wallet.length);
            }).catch((error) => {
                rej(error);
            }); 
        }else{      
            walletModel.countDocuments(where)
            .then((doc) => {
                res(doc);
            })
            .catch((error) => {
                rej(error);
            });
        }
    });
};

exports.todayWalletExpiry = async(where, params) => {
    return new Promise((resolve, reject) => {
        if(params.limit==0){
        walletModel.aggregate([{
                    $match: where
                },
                {
                    $lookup: {
                        from: "users",
                        as: "user",
                        localField: "userId",
                        foreignField: "_id"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        transaction: 1,
                        is_active: 1,
                        expire_on: 1,
                        created: 1,
                        modified: 1,
                        userId: 1,
                        wallet_amount: 1,
                        description: 1,
                        "user.fname": 1,
                        "user.lname": 1,
                        "user.phone_no": 1,
                    }
                },
                {
                    $sort: { wallet_amount: -1 }
                }
            ])
            .then((walletData) => {
                resolve(walletData);
            })
            .catch(err => {
                reject(err);
            });
        }else{
            walletModel.aggregate([ 
                {
                    $lookup: {
                        from: "users",
                        as: "user",
                        localField: "userId",
                        foreignField: "_id"
                    }
                },
                {
                    "$unwind": {
                        "path": "$user",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        transaction: 1,
                        is_active: 1,
                        expire_on: 1,
                        created: 1,
                        modified: 1,
                        userId: 1,
                        wallet_amount: 1,
                        description: 1,
                        "user.fname": 1,
                        "user.lname": 1,
                        "user.phone_no": 1,
                        phone_no: '$user.phone_no', 
                        userName: {$concat: ['$user.fname',' ','$user.lname']},
                    }
                },
                { $match: where }, 
                { $sort : { [params.order]:params.dir } },
                { $skip : params.skip },
                { $limit : params.limit  },
            ])
            .then((walletData) => {
                resolve(walletData);
            })
            .catch(err => {
                reject(err);
            });
        } 
    });
}

exports.setExpireWalletAmount = async(today, todayEnd) => {
    var userToBeNotify = [];
    return new Promise(
        (resolve, reject) => {
            walletModel.find({ expire_on: { $gte: today, $lt: todayEnd }, transaction: "1", is_active: "1" })
                .then((walletData) => {
                    if (walletData.length > 0) {
                        walletData.forEach(wd => {
                            var amtToBeExp = wd.wallet_amount;
                            var userId = wd.userId;
                            walletModel.updateOne({ _id: wd._id }, { $currentDate: { modified: true }, $set: { is_active: "3" } })
                                .then((updateResult) => {
                                    if (updateResult.ok == 1) {
                                        userModel.findOne({ _id: userId })
                                            .then((userData) => {
                                                if (userData != null) {
                                                    var userBalance = userData.wallet_balance;
                                                    var amtToBeUpdate = userBalance - amtToBeExp;

                                                    if (amtToBeUpdate < 0) {
                                                        amtToBeUpdate = 0;
                                                    }

                                                    userModel.updateOne({ _id: userData._id }, { $currentDate: { modified: true }, $set: { wallet_balance: amtToBeUpdate } })
                                                        .then((userBalanceUpdateResult) => {
                                                            //
                                                        })
                                                        .catch(error => {
                                                            console.log("User balance updation at walletExpiration function error : " + error);
                                                        });
                                                }
                                            })
                                            .catch(error => {
                                                console.log("User balance find at walletExpiration function error : " + error);
                                            });
                                    }
                                })
                                .catch((error) => {
                                    console.log("Wallet log updateion at walletExpiration function error : " + error);
                                });
                        });
                    }
                    resolve(userToBeNotify);
                })
                .catch(err => {
                    reject(err);
                });
        }
    );
}

exports.setExpireWalletAmountFromPreviouseDay = async(todayEnd) => {
    var userToBeNotify = [];
    return new Promise(
        (resolve, reject) => {
            walletModel.find({ expire_on: { $lt: todayEnd }, transaction: "1", is_active: "1" })
                .then((walletData) => {
                    if (walletData.length > 0) {
                        walletData.forEach(wd => {
                            var amtToBeExp = wd.wallet_amount;
                            var userId = wd.userId;
                            walletModel.updateOne({ _id: wd._id }, { $currentDate: { modified: true }, $set: { is_active: "3" } })
                                .then((updateResult) => {
                                    if (updateResult.ok == 1) {
                                        userModel.findOne({ _id: userId })
                                            .then((userData) => {
                                                if (userData != null) {
                                                    var userBalance = userData.wallet_balance;
                                                    var amtToBeUpdate = userBalance - amtToBeExp;

                                                    if (amtToBeUpdate < 0) {
                                                        amtToBeUpdate = 0;
                                                    }

                                                    userModel.updateOne({ _id: userData._id }, { $currentDate: { modified: true }, $set: { wallet_balance: amtToBeUpdate } })
                                                        .then((userBalanceUpdateResult) => {})
                                                        .catch(error => {
                                                            console.log("User balance updation at walletExpiration function error : " + error);
                                                        });
                                                }
                                            })
                                            .catch(error => {
                                                console.log("User balance find at walletExpiration function error : " + error);
                                            });
                                    }
                                })
                                .catch((error) => {
                                    console.log("Wallet log updateion at walletExpiration function error : " + error);
                                });
                        });
                    }
                    resolve(userToBeNotify);
                })
                .catch(err => {
                    reject(err);
                });
        }
    );
}

exports.notifyBeforeExpireWallet = async(today, todayEnd) => {
    return new Promise(
        (resolve, reject) => {
            walletModel.find({ expire_on: { $gte: today, $lt: todayEnd }, transaction: "1", is_active: "1" }).sort({ expire_on: 1, userId: 1 })
                .then((walletData) => {
                    resolve(walletData);
                })
                .catch(err => {
                    reject(err);
                });
        }
    );
}

exports.setWalletUsedStatus = async(userId, usedWalletAmount) => {
    return new Promise((resolve, reject) => {
        walletModel.find({ userId: userId, transaction: "1", is_active: "1" }).sort({ expire_on: 1 })
            .then((walletData) => {
                var totalLogAmount = 0.00;
                var logIdsArr = [];
                walletData.forEach(ele => {
                    totalLogAmount += ele.wallet_amount;
                    logIdsArr.push(ele._id);
                });

                if (walletData.length > 1) {
                    if (usedWalletAmount >= totalLogAmount) {
                        walletModel.updateMany({ _id: { $in: logIdsArr } }, { $currentDate: { "modified": true }, $set: { is_active: "2" } })
                            .then(updateResult => {
                                //----------------
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }

                    if (usedWalletAmount < totalLogAmount) {
                        var i = 0;
                        for (i = 0; i < walletData.length; i++) {
                            if (usedWalletAmount > 0) {
                                if (walletData[i].wallet_amount >= usedWalletAmount) {
                                    var tempAmt = usedWalletAmount;
                                    walletModel.updateOne({ _id: walletData[i]._id }, { $currentDate: { modified: true }, $set: { is_active: "2" } })
                                        .then((updateResult) => {
                                            console.log("Walet Log: Wallet used status updated.");
                                            if (walletData[i].wallet_amount == usedWalletAmount) {
                                                walletModel.create({
                                                        transaction: '1',
                                                        is_active: '1',
                                                        expire_on: walletData[i].expire_on,
                                                        userId: walletData[i]._id,
                                                        wallet_amount: walletData[i].wallet_amount - tempAmt,
                                                        description: 'Given remaining amount against used wallet amount.'
                                                    })
                                                    .then((updateResult) => {
                                                        console.log("Walet Log: Wallet used status updated.");
                                                    })
                                                    .catch(err => {
                                                        console.log("Error at set setWalletUsedStatus " + err);
                                                    });
                                            }
                                        })
                                        .catch(err => {
                                            console.log("Error at set setWalletUsedStatus " + err);
                                        });
                                    usedWalletAmount = 0;
                                }

                                if (usedWalletAmount > walletData[i].wallet_amount) {
                                    walletModel.updateOne({ _id: walletData[i]._id }, { $currentDate: { modified: true }, $set: { is_active: "2" } })
                                        .then((updateResult) => {
                                            console.log("Walet Log: Wallet used status updated.");
                                        })
                                        .catch(err => {
                                            console.log("Error at set setWalletUsedStatus " + err);
                                        });
                                    usedWalletAmount = usedWalletAmount - walletData[i].wallet_amount;
                                }
                            }
                        }
                    }
                } else {
                    if (walletData.length > 0) {
                        if (totalLogAmount > usedWalletAmount) {
                            walletModel.updateOne({ _id: walletData[0]._id }, { $currentDate: { modified: true }, $set: { is_active: "2" } })
                                .then((updateResult) => {
                                    console.log("Walet Log: Wallet used status updated.");
                                })
                                .catch(err => {
                                    console.log("Error at set setWalletUsedStatus " + err);
                                });


                            walletModel.create({ transaction: '1', is_active: '1', expire_on: walletData[0].expire_on, userId: walletData[0]._id, wallet_amount: totalLogAmount - usedWalletAmount, description: 'Given remaining amount against used wallet amount.' })
                                .then((updateResult) => {
                                    console.log("Walet Log: Wallet used status updated.");
                                })
                                .catch(err => {
                                    console.log("Error at set setWalletUsedStatus " + err);
                                });


                        } else {
                            walletModel.updateOne({ _id: walletData[0]._id }, { $currentDate: { modified: true }, $set: { is_active: "2" } })
                                .then((updateResult) => {
                                    console.log("Walet Log: Wallet used status updated.");
                                })
                                .catch(err => {
                                    console.log("Error at set setWalletUsedStatus " + err);
                                });
                        }
                    }
                }
                resolve(walletData);
            })
            .catch(err => {
                reject(err);
            });
    });
}

exports.getzerouser = async() => {
    return new Promise((res, rej) => {
        userModel.find({ wallet_balance: 0 }).sort({ _id: 1 })
            .then((users) => {
                res(users)
            }).catch((err) => {
                rej(err);
            })
    })
}

exports.happynewyeartoall = async(phone) => {
    return new Promise((res, rej) => {
        userModel.find({ phone_no: phone })
            .then(async(foundUser) => {
                if (foundUser.length > 0) {
                    userModel.updateOne({ _id: foundUser[0]._id }, { $currentDate: { modified: true }, $set: { wallet_balance: 100 } })
                        .then(async(result) => {

                            var today = new Date();
                            today = moment(today).format().split("T")[0];
                            today = new Date(today + "T00:00:00.000Z");
                            var x = await settingsDatalayers.getSettings(); 
                            var walletexpiredays = x[0].wallet_expire_days;

                            var expDay = moment(today).add(walletexpiredays, "days");
                            expDay = new Date(expDay);

                            walletDatalayers.save({
                                userId: foundUser[0]._id,
                                wallet_amount: 100,
                                description: 'Earn on registration.',
                                expire_on: expDay,
                                is_admin:"1"
                            });

                            res(true);
                        })
                        .catch(err => {
                            rej(err);
                        });
                    res(true);
                } else {
                    res(false);
                }
            })
            .catch(err => {
                rej(err);
            });
    })
}