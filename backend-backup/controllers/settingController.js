const fs = require("fs");
const path = require('path');
const moment = require("moment");
const message = require("../helpers/languages/english");
const orderDatalayer = require("../datalayers/orderDatalayer");
const errorMessage = require("../helpers/error_codes/errorCodes");
const settingDatalayers = require("../datalayers/settingDatalayers");
const mongodb = require("mongodb");

exports.getConfig = async function(req, res) {

    var delivery_date = (req.query.date === undefined) ? null : req.query.date;

    var deliverydate = (!req.query.date) ? new Date(moment().format('YYYY-MM-DD').toString()): new Date(req.query.date);
    var condition = {};
    if(req.query.franchiseId){
        condition.franchiseId = mongodb.ObjectId(req.query.franchiseId);
    }
    var flag = [];
    try {
        flag = await check_all_time_slot_availability(delivery_date);
    } catch (e) {
        flag = [true, true, true, true];
    }

    let settings = await settingDatalayers.getSettings();

    res.json({
        message: message.SUCCESS,
        //data: [{"addressTypes":{1:"Home Address", 2:"Office Address", 3:"Other Address"}}],
        data: [
            //Address Types   0
            await settingDatalayers.getAddressTypes(),

            //Unit Types      1
            await settingDatalayers.getUnits(),

            [ //Delivery time   2
                { id: 0, title: "Any Time", is_available: flag[0] },
                { id: 1, title: "06:00 AM - 10:00 AM", is_available: flag[1] },
                { id: 2, title: "10:00 AM - 02:00 PM", is_available: flag[2] },
                { id: 3, title: "02:00 PM - 10:00 PM", is_available: flag[3] },
                //{ id: 1, title: "07:00 AM - 12:00 PM", is_available: flag[0] },
            ],
            [ //Delivery Day    3
                { id: 0, title: "Date", abv: "date" },
                { id: 1, title: "Today", abv: "today" },
                { id: 2, title: "Tomorrow", abv: "tomorrow" },
            ],
            [ //Payment Method  4
                { id: 1, title: "COD", abv: "cod", flag: settings[0].is_cod },
                { id: 2, title: "RazorPay", abv: "online payment", flag: settings[0].is_razorpay },
                { id: 3, title: "Wallet Payment", abv: "wallet payment", flag: true },
                { id: 4, title: "Paytm", abv: "online payment", flag: settings[0].is_paytm },
                //{ id: 5, title: "COD", abv: "COD", flag: false }
            ],
            [ // Payment Methods    5
                {
                    error: false,
                    payment_methods: {
                        paypal_payment_method: "0",
                        paypal_mode: "",
                        paypal_business_email: "",
                        payumoney_payment_method: "0",
                        payumoney_merchant_key: "",
                        payumoney_merchant_id: "",
                        payumoney_salt: "",
                        razorpay_payment_method: "0",
                        razorpay_key: "rzp_live_iFeFGJ5n4bau9a",
                        /* rzp_test_fav4Dtczn6dmMT */
                        /* rzp_live_iFeFGJ5n4bau9a */
                        razorpay_secret_key: ""
                    }
                }
            ],
            [ //  6
                { status: 1 }
            ],
            [ //Product Quality 7
                { id: 1, title: "Best" },
                { id: 2, title: "Good" },
                { id: 3, title: "Normal" },
                { id: 4, title: "Average" },
                { id: 5, title: "Low" }
            ],
            await settingDatalayers.getDelivarySlote(deliverydate,condition),
        ]
    });
}

exports.getConfigData = async function(req, res) {

    var delivery_date = (!req.query.date) ? new Date(moment().format('YYYY-MM-DD').toString()): req.query.date;
    var condition = {};
    if(req.query.franchiseId){
        condition.franchiseId = mongodb.ObjectId(req.query.franchiseId);
    }

    let settings = await settingDatalayers.getSettings();

    res.json({
        message: message.SUCCESS,
        //data: [{"addressTypes":{1:"Home Address", 2:"Office Address", 3:"Other Address"}}],
        data: [
            //Address Types   0
            await settingDatalayers.getAddressTypes(),

            //Unit Types      1
            await settingDatalayers.getUnits(),

            // [ //Delivery time   2
            //     { id: 0, title: "Any Time", is_available: flag[0] },
            //     { id: 1, title: "06:00 AM - 10:00 AM", is_available: flag[1] },
            //     { id: 2, title: "10:00 AM - 02:00 PM", is_available: flag[2] },
            //     { id: 3, title: "02:00 PM - 10:00 PM", is_available: flag[3] },
            //     //{ id: 1, title: "07:00 AM - 12:00 PM", is_available: flag[0] },
            // ],
            [ //Delivery Day    3
                { id: 0, title: "Date", abv: "date" },
                { id: 1, title: "Today", abv: "today" },
                { id: 2, title: "Tomorrow", abv: "tomorrow" },
            ],
            [ //Payment Method  4
                { id: 1, title: "COD", abv: "cod", flag: settings[0].is_cod },
                { id: 2, title: "RazorPay", abv: "online payment", flag: settings[0].is_razorpay },
                { id: 3, title: "Wallet Payment", abv: "wallet payment", flag: true },
                // { id: 4, title: "Paytm", abv: "online payment", flag: settings[0].is_paytm },
                //{ id: 5, title: "COD", abv: "COD", flag: false }
            ],
            [ // Payment Methods    5
                {
                    error: false,
                    payment_methods: {
                        paypal_payment_method: "0",
                        paypal_mode: "",
                        paypal_business_email: "",
                        payumoney_payment_method: "0",
                        payumoney_merchant_key: "",
                        payumoney_merchant_id: "",
                        payumoney_salt: "",
                        razorpay_payment_method: "0",
                        razorpay_key: "rzp_live_iFeFGJ5n4bau9a",
                        /* rzp_test_fav4Dtczn6dmMT */
                        /* rzp_live_iFeFGJ5n4bau9a */
                        razorpay_secret_key: ""
                    }
                }
            ],
            [ //  6
                { status: 1 }
            ],
            [ //Product Quality 7
                { id: 1, title: "Best" },
                { id: 2, title: "Good" },
                { id: 3, title: "Normal" },
                { id: 4, title: "Average" },
                { id: 5, title: "Low" }
            ],
            await settingDatalayers.getDelivarySlote(delivery_date,condition),
        ]
    });
}


function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
   
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
}

exports.getAvailbleTimeslot = async function(req, res) {
    
    var delivery_date = (!req.query.date) ? moment().format('YYYY-MM-DD').toString(): moment(req.query.date).format('YYYY-MM-DD').toString();
    var condition = {};
    if(req.query.franchiseId){
        condition.franchiseId = mongodb.ObjectId(req.query.franchiseId);
    }
    var timeSlots=  await settingDatalayers.getDelivarySlote(delivery_date,condition);
    timeSlots.map(e => {
        if(!e.is_default){
            e.title =  (  tConvert(e.start_time) +' '+  tConvert(e.end_time));
        }        
        return e;
    });

    res.json({
        status: errorMessage.SUCEESS,
        message: message.SUCCESS,
        data: timeSlots,
    });
}

exports.getcmsSettings = function(req, res) {
    settingDatalayers.getCMSSettings()
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                message: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getSettings = function(req, res) {
    settingDatalayers.getSettings()
        .then((doc) => {
            res.json({
                sucess: errorMessage.SUCEESS,
                message: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.uploadSettingImages = async(req, res) => {
    if (req.file != undefined) {
        var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
        var filename = (req.file.fieldname == "favicon") ? "favicon" : "logo";
        filename += path.extname(req.file.filename);
        var destPath = __dirname + "/../public/uploads/setting_img/" + filename;
        // console.log(filename,destPath);
        fs.renameSync(srcPath, destPath);

        res.json({
            sucess: errorMessage.SUCEESS,
            name: filename
        });
    } else {
        res.end();
    }
}

exports.uploadAdImage = async(req, res) => {
    if (req.file != undefined) {
        try {
            var filename = req.file.filename;
            var srcPath = __dirname + "/../public/uploads/temp/" + filename;
            var destPath = __dirname + "/../public/uploads/setting_img/" + filename;
            var settings = await settingDatalayers.getSettings();
            var old_ad = __dirname + "/../public/uploads/setting_img/" + settings[0].ad_img;
            var data = { ad_img: filename, modifiedby: req.body.modifiedby };
            settingDatalayers.update(settings[0]._id, data)
                .then((doc) => {
                    console.log(doc);
                })
                .catch((err) => {
                    console.log(err);
                });
            fs.renameSync(srcPath, destPath);
            fs.unlinkSync(old_ad);
            res.json({
                sucess: errorMessage.SUCEESS,
                name: filename
            });
        } catch (e) {
            res.json({
                sucess: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                name: ""
            });
        }
    } else {
        res.end();
    }
}

exports.save = (req, res) => {
    const hostName = req.headers.host;
    const files = req.files;
    const bodyParam = req.body;
    bodyParam.site_name = hostName;
    bodyParam.logo = files.logo[0].originalname + '-' + Date.now();
    bodyParam.favicon = files.favicon[0].originalname + '-' + Date.now();
    bodyParam.logowhite = files.logowhite[0].originalname + '-' + Date.now();

    settingDatalayers.save(bodyParam)
        .then((doc) => {
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.edit = (req, res) => {
    const params = req.body;
    params._id = req.body._id;

    settingDatalayers.edit(params)
        .then((doc) => {
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                edited_data: doc,
            });
        })
        .catch((err) => {
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.editcms = (req, res) => {
    const params = req.body;
    params._id = req.body._id;
    ////console.log(params);
    settingDatalayers.update(req.body._id, params)
        .then((doc) => {
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                edited_data: doc,
            });
        })
        .catch((err) => {
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.getCMS = async(req, res) => {
    var cmsCode = req.params.cms_id - 1;
    var x = await settingDatalayers.cms(); 
    try {
        var cmsData = x[0].cms_content[cmsCode];
        res.json({
            success: errorMessage.SUCEESS,
            msg: message.SUCCESS,
            data: cmsData,
        });
    } catch (error) {
        res.json({
            success: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            err: error,
        });
    }
};

exports.getdeliverytimeslot = async(req, res) => {
    settingDatalayers.getdeliverytimeslot()
        .then((doc) => {
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                err: error,
            });
        });
};


exports.getdeliveryslot = async(req, res) => {
     let params  = req.params
    settingDatalayers.getdeliveryslot(params)
        .then((doc) => {
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: doc,
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: message.SOMETHING_WENT_WRONG,
                err: error,
            });
        });
};


exports.save_time_slot_limit = async(req, res) => {
    var postBody = req.body;
    var id = (req.body._id != 'null') ? req.body._id : 0;
    delete postBody._id;

    try {
        var doc;
        if (id) {
            doc = await settingDatalayers.update_time_slot_limit(id, postBody);
        } else {
            doc = await settingDatalayers.save_time_slot_limit(postBody);
        }
        res.json({
            success: errorMessage.SUCEESS,
            msg: message.SUCCESS,
            data: doc,
        });
    } catch (e) {
        console.log(e);
        res.json({
            success: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            err: e,
        });
    }
};

exports.save_delivery_slot = async(req, res) => {
    var postBody = req.body;
    
    try {
        var doc;
        var idsArr = [];
        postBody.forEach(async(e) => {
            if(e.id){
                idsArr.push(mongodb.ObjectId(e.id))
                var id = mongodb.ObjectId(e.id);
                await settingDatalayers.update_delivery_slot(id,e);
            }else{
                var insedata = await settingDatalayers.save_delivery_slot_limit(e);
                idsArr.push(mongodb.ObjectId(insedata._id))
            }
        });
        if(idsArr.length){
            await settingDatalayers.deleteDeliverySlot(idsArr);
        }
       
        res.json({
            success: errorMessage.SUCEESS,
            msg: message.SUCCESS,
            data: doc,
        });
    } catch (e) {
        res.json({
            success: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            err: e,
        });
    }
};

exports.checktimeslotavailability = async(req, res) => {
    try {
        let slot_id = req.body.slot_id;
        let delivery_date = req.body.delivery_date;
        let data = await check_all_time_slot_availability(delivery_date);
        let flag = data[slot_id];

        res.json({
            sucess: errorMessage.SUCEESS,
            msg: "",
            data: flag,
        });
    } catch (e) {
        res.json({
            sucess: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            err: e,
        });
    }
}

async function check_all_time_slot_availability(delivery_date) {
    try {
        if (delivery_date != null) { //If has delivery date and it is previous date from today
            /*let todayDate = new Date(moment(new Date()).utcOffset("+05:30").format('YYYY-MM-DD'));
            if (moment(delivery_date).isBefore(todayDate)) {
                return [true, false, false, true];
            }*/

            let data = await settingDatalayers.findHolidaysByField({ holiday_date: new Date(delivery_date), is_active: 1 });

            if (data.length > 0) { //If today is holiday then all time slot is false
                return [false, false, false, false];
            }
        }

        var hour = 0;
        var isToday = false;
        var slot_ids = [0, 1, 2, 3]; //0 for any time
        var flag = [false, false, false, false]; //any time at 3rd index

        var orders;
        var endDate;
        var createdDate;

        var slot_0_length = 0; //any time
        var slot_1_length = 0;
        var slot_2_length = 0;
        var slot_3_length = 0;

        var time_slot_limit_0 = 0; //any time
        var time_slot_limit_1 = 0;
        var time_slot_limit_2 = 0;
        var time_slot_limit_3 = 0;

        var time_slot_limit = await settingDatalayers.getdeliverytimeslot();

        if (time_slot_limit) {
            time_slot_limit_0 = (time_slot_limit[0].time_slot_0) ? time_slot_limit[0].time_slot_0 : 0;
            time_slot_limit_1 = (time_slot_limit[0].time_slot_1) ? time_slot_limit[0].time_slot_1 : 0;
            time_slot_limit_2 = (time_slot_limit[0].time_slot_2) ? time_slot_limit[0].time_slot_2 : 0;
            time_slot_limit_3 = (time_slot_limit[0].time_slot_3) ? time_slot_limit[0].time_slot_3 : 0;
        }

        time_slot_limit = [];
        time_slot_limit[0] = time_slot_limit_0; //any time
        time_slot_limit[1] = time_slot_limit_1;
        time_slot_limit[2] = time_slot_limit_2;
        time_slot_limit[3] = time_slot_limit_3;

        var settings = await settingDatalayers.getSettings();

        if (delivery_date == null) {
            isToday = true;
            createdDate = new Date(); 
            if(settings[0].delivery_day_after_order>0){
                createdDate = moment(createdDate).utcOffset("+05:30").add(1, "days");            
            }else{
                createdDate = moment(createdDate).utcOffset("+05:30"); //.add(1, "days")            
            }
            hour = moment(createdDate).hour();
            createdDate = moment(createdDate).format('YYYY-MM-DD');
            endDate = moment(createdDate).add(1, "days").format('YYYY-MM-DD');
        } else {
            createdDate = delivery_date;
            createdDate = moment(createdDate).utcOffset("+05:30");            

            var temp = new Date();
            temp = moment(temp).utcOffset("+05:30");
            hour = moment(temp).hour();            
            temp = moment(temp).format('YYYY-MM-DD');
            if (moment(createdDate).isSame(temp)) {
                isToday = true;
            }
            createdDate = moment(createdDate).format('YYYY-MM-DD');
            endDate = moment(createdDate).add(1, "days").format('YYYY-MM-DD');
        }

        createdDate = new Date(createdDate + "T00:00:00.000Z");        
        endDate = new Date(endDate + "T00:00:00.000Z");
        orders = await orderDatalayer.findbyField({
            is_active: { $in: ["1", "2"] },
            delivery_time_id: { $in: slot_ids },
            delivery_date: { $gte: createdDate, $lt: endDate }
        });

        temp = []; //any time
        temp = orders.filter((ele) => {
            return (ele.delivery_time_id == 0);
        });
        slot_0_length = temp.length;

        var temp = [];
        temp = orders.filter((ele) => {
            return (ele.delivery_time_id == 1);
        });
        slot_1_length = temp.length;

        temp = [];
        temp = orders.filter((ele) => {
            return (ele.delivery_time_id == 2);
        });
        slot_2_length = temp.length;

        temp = [];
        temp = orders.filter((ele) => {
            return (ele.delivery_time_id == 3);
        });
        slot_3_length = temp.length;
  
        let any_time_flag = false; //any time
        if ((!time_slot_limit[0]) || time_slot_limit[0] > slot_0_length) {
            any_time_flag = true;
            flag[0] = true;
        }

        if ((!time_slot_limit[1]) || time_slot_limit[1] > slot_1_length) {
            flag[1] = true;
        }

        if ((!time_slot_limit[2]) || time_slot_limit[2] > slot_2_length) {
            flag[2] = true;
            var time_flag3 = true;
        }else{
            var time_flag3 = false;
        }

        if ((!time_slot_limit[3]) || time_slot_limit[3] > slot_3_length) {
            flag[3] = true;
            var time_flag4 = true;
        }else{
            var time_flag4 = false;
        } 
         
        if (settings[0].delivery_day_after_order==0 && isToday) {            
            if (hour >= 10) {
                flag = [any_time_flag, false, time_flag3, time_flag4];
            }

            if (hour >= 14) {
                flag = [any_time_flag, false, false, time_flag4];
            }

            if (hour >= 22) {
                flag = [any_time_flag, false, false, false];
            }
        } 

        return flag;
    } catch (e) {
        res.json({
            sucess: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            err: e,
        });
    }
}

exports.checkalltimeslotavailability = async(req, res) => {
    var delivery_date = (req.query.date === undefined) ? null : req.query.date;

    try {
        var flag = await check_all_time_slot_availability(delivery_date);
        res.json({
            sucess: errorMessage.SUCEESS,
            msg: "",
            data: flag
        });
    } catch (e) {
        res.json({
            sucess: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            err: flag = [true, true, true, true],
        });
    }
}

exports.getHolidays = async(req, res) => {
    let where = {};
    let _and = [];
    if(req.query.franchise_id){
        _and.push({franchiseId: mongodb.ObjectId(req.query.franchise_id)});
        where = {franchiseId: mongodb.ObjectId(req.query.franchise_id)};  
    }
    var total = await settingDatalayers.gettotalHolidays(where);
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    }
    if (req.query.where) {
        ///where.description = new RegExp(''+req.query.where+'', 'i');  
        let tmp = new Date(req.query.where);
        if (tmp != 'Invalid Date') {
            where = {
                "$or": [{
                    "description": {$regex: new RegExp('^' + req.query.where + '', 'i')}
                }, {
                    "franchiseName": {$regex: new RegExp('^' + req.query.where + '', 'i')}
                }, {
                    "holiday_date": tmp
                }]
            };
        } else {
            where = {
                "$or": [{
                    "description": {$regex: new RegExp('^' + req.query.where + '', 'i')}
                }, {
                    "franchiseName": {$regex: new RegExp('^' + req.query.where + '', 'i')}
                }]
            };
        }
    }
    if (_and.length > 0) {
        where = { $and: _and }
    }
    ///console.log(where);
    var filtered = await settingDatalayers.gettotalHolidays(where);
    settingDatalayers.getHolidays(where, params)
        .then((docs) => {
            /// console.log(docs); 
            res.json({
                success: errorMessage.SUCEESS,
                message: message.SUCCESS,
                data: docs,
                total: total,
                filtered: filtered,
            });
        })
        .catch((err) => {
            res.json({
                success: errorMessage.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.saveHoliday = async(req, res) => {
    let holiday_date = new Date(req.body.holiday_date);
    try {
        let data = await settingDatalayers.findHolidaysByField({ holiday_date });
        if (data.length > 0) {
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: `Date: ${moment(holiday_date).format('DD/MM/YYYY')} already added.`,
                error: ''
            });
        } else {
            let data = await settingDatalayers.saveHoliday(req.body);
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: data,
            });
        }
    } catch (error) {
        res.json({
            success: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            error: error,
        });
    }
}

exports.getHolidayById = async(req, res) => {
    var id = req.params.id
    settingDatalayers.getHolidayById(id)
        .then((docs) => {
            res.json({
                success: errorMessage.SUCEESS,
                message: message.SUCCESS,
                data: docs,
            });
        })
        .catch((err) => {
            res.json({
                success: errorMessage.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};

exports.updateHoliday = async(req, res) => {
    let _id = mongodb.ObjectId(req.body._id);
    let holiday_date = new Date(req.body.holiday_date);

    try {
        let where = { _id: { $ne: _id }, holiday_date: { $eq: holiday_date } };
        let data = await settingDatalayers.findHolidaysByField(where);
        if (data.length > 0) {
            res.json({
                success: errorMessage.BAD_REQUEST,
                msg: `Date: ${moment(holiday_date).format('DD/MM/YYYY')} already added.`,
                error: ''
            });
        } else {
            let data = await settingDatalayers.updateHoliday(req.body);
            res.json({
                success: errorMessage.SUCEESS,
                msg: message.SUCCESS,
                data: data,
            });
        }

    } catch (error) {
        res.json({
            success: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            error: error
        });
    }
}

exports.updateHolidayStatus = async(req, res) => {
    try {
        let data = await settingDatalayers.updateHoliday(req.body);
        res.json({
            success: errorMessage.SUCEESS,
            msg: message.SUCCESS,
            data: data,
        });
    } catch (error) {
        res.json({
            success: errorMessage.BAD_REQUEST,
            msg: message.SOMETHING_WENT_WRONG,
            error: error
        });
    }
}

exports.removeHolidayById = async(req, res) => {
    settingDatalayers.removeHolidayById(req.params.id)
        .then((docs) => {
            res.json({
                success: errorMessage.SUCEESS,
                message: message.SUCCESS,
                data: docs,
            });
        })
        .catch((err) => {
            res.json({
                success: errorMessage.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};