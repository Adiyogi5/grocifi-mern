const fs = require("fs");
const moment = require("moment");
const mongodb = require("mongodb");
var admin = require("firebase-admin");
const ObjectId = require("mongoose").Types.ObjectId;
const userDatalayers = require("../datalayers/userDatalayer");
const errorsCodes = require("../helpers/error_codes/errorCodes");
const notifyDatalayer = require("../datalayers/notificationDatalayer");
const franchiseDatalayers = require('../datalayers/franchiseDatalayer');

var serviceAccount = require("../middelwares/serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://adityom-dc66a.firebaseio.com",
});


exports.notify = async(userId, mTitle, mBody, img = "") => {
    var regKey = [];
    await userDatalayers
        .findbyField({ _id: { $in: userId } })
        .then((result) => {
            if (result.length > 0) {
                var createdDate = new Date();
                createdDate = moment(createdDate).add(5, "hours");
                createdDate = moment(createdDate).add(30, "minutes");

                result.forEach((element) => {
                    if (
                        element.device_token != null &&
                        element.device_token != undefined
                    ) {
                        regKey.push(element.device_token);
                    }

                    notifyDatalayer
                        .save({ mtitle: mTitle, mbody: mBody, user_id: element._id, created: createdDate, modified: createdDate })
                        .then((notifyRes) => {
                            //console.log(notifyRes);
                            //----------------
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });

    var payload = {
        notification: {
            title: mTitle,
            body: mBody,
            image: img,
        },
    }; 
    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };  
    ///console.log(payload);
    if (regKey.length > 0) {
        admin
            .messaging()
            .sendToDevice(regKey, payload, options)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return;
};

exports.sendtoall = async(req, res) => {
    mTitle = req.body.title;
    mBody = req.body.mbody;
    mImg = (req.body.notify_img) ? req.body.notify_img : null;
    var regKey = [];

    await userDatalayers
        .findbyField({ device_token: { $ne: null } })
        .then((result) => {
            if (result.length > 0) {
                result.forEach((element) => {
                    if (
                        element.device_token != null &&
                        element.device_token != undefined &&
                        element.device_token != ""
                    ) {
                        regKey.push(element.device_token);
                    }
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });

    var notifyData = [];
    userDatalayers
        .getAllUser({ role_type: "4" })
        .then((result) => {
            if (result.length > 0) {
                var createdDate = new Date();
                createdDate = moment(createdDate).add(5, "hours");
                createdDate = moment(createdDate).add(30, "minutes");

                result.forEach((ele) => {
                    notifyData.push({
                        mtitle: mTitle,
                        mbody: mBody,
                        user_id: ele._id,
                        mimg: mImg,
                        is_general: true,
                        created: createdDate,
                        modified: createdDate,
                    });
                });

                if (mImg) {
                    var srcPath = __dirname + "/../public/uploads/temp/" + mImg;
                    var destPath = __dirname + "/../public/uploads/notify_img/" + mImg;
                    fs.renameSync(srcPath, destPath);
                }

                notifyDatalayer
                    .saveAll(notifyData)
                    .then((notifyRes) => {
                        //console.log(notifyRes);
                        //----------------
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });

    await userDatalayers
        .getAllGuestToken()
        .then((doc) => {
            if (doc.length > 0) {
                doc.forEach((ele) => {
                    regKey.push(ele.device_token);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });

    image = "";
    if (mImg) {
        image = process.env.NOTIFY_URL + mImg;
        //image = 'http://ec2-13-233-246-39.ap-south-1.compute.amazonaws.com:3000/uploads/notify_img/' + mImg;    //Restro

    }
    var payload = {
        notification: {
            title: mTitle,
            body: mBody,
            image: image,
        },
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };
    var tempKey = [];
    if (regKey.length > 0) {
        while (regKey.length > 0) {
            tempKey = regKey.splice(0, 500);            
            admin
                .messaging()
                .sendToDevice(tempKey, payload, options)
                .then((response) => {
                    //console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    res.json({
        sucess: 200,
    });
};


exports.sendnotification = async(req, res) => {

    mTitle = req.body.title;
    mfranchiseId = req.body.franchiseId;
    mBody = req.body.mbody;
    mImg = (req.body.notify_img) ? req.body.notify_img : null;
    var regKey = [];
    var frareaid = [];

    let params = {skip: 0, limit: 0 }; 
    where = { franchiseId:mongodb.ObjectId(mfranchiseId) };  
     
    await franchiseDatalayers.getfrareas(where, params)
        .then((catsData) => { 
            catsData.forEach((result) => { 
                frareaid.push(mongodb.ObjectId(result._id)); 
            }); 
        }).catch((error) => { 
             console.log(error);
        });

    where1 = {
        "areaId": { $in: frareaid }, 
        "is_active": "1"
    };  
    var notifyData = [];
    await userDatalayers.getUserbyArea(where1)
        .then((userArea) => {   
            if (userArea.length > 0) {
                var createdDate = new Date();
                createdDate = moment(createdDate).add(5, "hours");
                createdDate = moment(createdDate).add(30, "minutes");
                userArea.forEach((ele) => {
                    regKey.push(ele.device_token);
                    notifyData.push({
                        mtitle: mTitle,
                        mbody: mBody,
                        user_id: ele._id,
                        mimg: mImg,
                        is_general: true,
                        created: createdDate,
                        modified: createdDate,
                    });
                });
                if (mImg) {
                    var srcPath = __dirname + "/../public/uploads/temp/" + mImg;
                    var destPath = __dirname + "/../public/uploads/notify_img/" + mImg;
                    fs.renameSync(srcPath, destPath);
                }

                notifyDatalayer
                    .saveAll(notifyData)
                    .then((notifyRes) => {
                        //console.log(notifyRes);
                        //----------------
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } 
             

        }).catch((error) => { 
            console.log(error);
        });

    image = "";
    if (mImg) {
        image = process.env.NOTIFY_URL + mImg;
        //image = 'http://ec2-13-233-246-39.ap-south-1.compute.amazonaws.com:3000/uploads/notify_img/' + mImg;    //Restro

    }
    var payload = {
        notification: {
            title: mTitle,
            body: mBody,
            image: image,
        },
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };

    var tempKey = [];
    if (regKey.length > 0) {
        while (regKey.length > 0) {
            tempKey = regKey.splice(0, 500);
            admin
                .messaging()
                .sendToDevice(tempKey, payload, options)
                .then((response) => {
                    //console.log(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    res.json({
        sucess: 200,
    });
}


exports.getnotification = async(req, res) => {
    var userId = mongodb.ObjectId(req.params.userId);
    var type = req.params.type;

    let _and = [];
    
    _and.push({ "user_id": mongodb.ObjectId(req.params.userId) });

    if(type==1){
        _and.push({ "is_general": true });
    }
    if(type==0){
        _and.push({ "is_general": false });
    }
    if (_and.length > 0) {
        where = { $and: _and }
    }

    let params = {skip: 0, limit: 0 };
    if(req.query.start){
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = "created";
        params.dir = -1; 
    }
    var total = await notifyDatalayer.gettotalnotificationLog(where); 
     
    notifyDatalayer.getnotificationofuser(where, params)
        .then((notify) => {            
            if (notify.length > 0) {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: notify,
                    total: total
                });
            } else {
                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "",
                    data: [],
                });
            }
        })
        .catch((error) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record(s) not found.",
                error: error,
            });
        });
};

exports.notifyOtp = async(token, otp) => {
    var regKey = [];
    regKey.push(token);

    var payload = {
        notification: {
            title: process.env.APPNAME+" OTP",
            body: process.env.APPNAME+" OTP is ${otp}. Thanks,"+process.env.APPNAME,
            image: "",
        },
    };

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };

    if (regKey.length > 0) {
        admin
            .messaging()
            .sendToDevice(regKey, payload, options)
            .then((response) => {
                //console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return;
};

exports.uploadimg = async(req, res) => {
    res.json({
        sucess: errorsCodes.SUCEESS,
        name: req.file.filename,
    });
};