const fs = require("fs");
const bcrypt = require("bcrypt");
const moment = require("moment");
const userModel = require("../modules/User");
const userIpModel = require("../modules/userip");
const userOtpModel = require("../modules/userotp");
const frUserModel = require("../modules/Franchise");
const frDeliveryModel = require("../modules/DeliveryBoy");
const settingModel = require("../modules/Settings");
const userDeviceModel = require("../modules/UserDevice");
const ProductWishlistModel = require("../modules/ProductWishlist");
const UserDeviceTokenModel = require("../modules/UserDeviceToken");
const walletDatalayers = require("../datalayers/walletLogDatalayers");
const settingsDatalayers = require("../datalayers/settingDatalayers");
const productsDatalayers = require("../datalayers/productsDatalayer");
const franchiseDatalayers = require("../datalayers/franchiseDatalayer");
const frproductsDatalayers = require("../datalayers/franchiseproductsDatalayer");
const deliveryslotModel = require("../modules/DeliverySlot");

var https = require("https");
var http = require("http");
var urlencode = require("urlencode");
//const { uservalidationResult } = require("../middelwares/settingValidation");

exports.adminlogin = (body) => {
  return new Promise((res, rej) => {
    userModel
      .findOne(
        {
          email: { $eq: body.email },
          is_active: { $eq: "1" },
          role_type: { $in: ["1", "2", "3"] },
        },
        {
          _id: 1,
          fname: 1,
          lname: 1,
          email: 1,
          password: 1,
          dob: 1,
          img: 1,
          role_type: 1,
          is_active: 1,
          phone_no: 1,
        }
      )
      .then((user) => {
        if (user !== null) {
          if (bcrypt.compareSync(body.password, user.password)) {
            res({
              success: 1,
              data: {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                dob: user.dob,
                img: user.img,
                role_type: user.role_type,
                is_active: user.is_active,
                _id: user._id,
                phone_no: user.phone_no,
              },
              message: "",
            });
          } else {
            res({ success: 0, message: "Wrong Password." });
          }
        } else {
          res({ success: 0, message: "Wrong email." });
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.adminphonelogin = (body) => {
  return new Promise((res, rej) => {
    userModel
      .findOne(
        {
          phone_no: { $eq: body.phone_no },
          is_active: { $eq: "1" },
          role_type: { $in: ["1", "2", "3"] },
        },
        {
          _id: 1,
          fname: 1,
          lname: 1,
          email: 1,
          password: 1,
          dob: 1,
          img: 1,
          role_type: 1,
          is_active: 1,
          phone_no: 1,
          franchise_id: 1,
        }
      )
      .then((user) => {
        if (user !== null) {
          if (bcrypt.compareSync(body.password, user.password)) {
            res({
              success: 1,
              data: {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                phone_no: user.phone_no,
                dob: user.dob,
                img: user.img,
                role_type: user.role_type,
                is_active: user.is_active,
                franchise_id: user.franchise_id,
                _id: user._id,
              },
              message: "",
            });
          } else {
            res({ success: 0, message: "Wrong Password." });
          }
        } else {
          res({ success: 0, message: "Wrong Phone no.." });
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.registerUser = async (reqParam) => {
  var uip = reqParam.uip;
  var fname = reqParam.fname;
  var lname = reqParam.lname;
  var reqForm = reqParam.reqForm;
  var frndCode = reqParam.frndCode;
  var device_id = reqParam.device_id;
  var os_devid_vc = reqParam.os_devid_vc;
  var referCode = reqParam.refer_code;
  var userphone = reqParam.userphone;
  var device_token = reqParam.device_token;
  var walletBalance = reqParam.wallet_balance;
  var is_wholesaler = reqParam.is_wholesaler;
  var gst_no = reqParam.gst_no;
  var is_wholesaler_approve = reqParam.is_wholesaler_approve;
  var wholesaler_firmname = reqParam.wholesaler_firmname;
  var setting = await settingsDatalayers.getSettings();

  return new Promise(async (res, rej) => {
    userModel
      .findOne({ phone_no: userphone })
      .then((user) => {
        if (!user) {
          var createdDate = new Date();
          createdDate = moment(createdDate).add(5, "hours");
          createdDate = moment(createdDate).add(30, "minutes");

          var param = {
            fname: fname,
            lname: lname,
            phone_no: userphone,
            device_id: device_id,
            created: createdDate,
            modified: createdDate,
            refer_code: referCode,
            friends_code: frndCode,
            os_devid_vc: os_devid_vc,
            device_token: device_token,
            reg_from: reqParam.reg_from,
            wallet_balance: walletBalance,
            is_wholesaler: is_wholesaler,
            gst_no: gst_no,
            is_wholesaler_approve: is_wholesaler_approve,
            wholesaler_firmname: wholesaler_firmname,
            app_version: reqParam.app_version,
            last_order_date: null,
            order_status: { recieved: 0, delivered: 0, cancelled: 0 },
            password: bcrypt.hashSync(userphone, 10),
          };

          var today = new Date();
          today = moment(today).format().split("T")[0];
          today = new Date(today + "T00:00:00.000Z");
          var walletexpiredays = setting[0].wallet_expire_days;

          var expDay = moment(today).add(walletexpiredays, "days");
          expDay = new Date(expDay);
          userModel
            .create(param)
            .then((user) => {
              if (walletBalance > 0) {
                walletDatalayers.save({
                  userId: user._id,
                  wallet_amount: walletBalance,
                  description: "Earn on registration.",
                  expire_on: expDay,
                  transaction: "1",
                  is_admin: "1",
                  //transaction_type: 4,
                });
              }
              userIpModel
                .updateOne(
                  { phone_ip: uip, friend_code: frndCode },
                  { $currentDate: { modified: true }, $set: { is_active: 2 } }
                )
                .then(() => {
                  console.log('reg');
                  res(true);
                })
                .catch((error) => {
                  rej(null);
                });
            })
            .catch((error) => {
              rej(error);
            });

        } else {
          res(null);
        }
      })
      .catch((error) => {
        res(error);
      });
  });

};

exports.login = async (reqParam) => {
  var uip = reqParam.uip;
  var fname = reqParam.fname;
  var lname = reqParam.lname;
  var reqForm = reqParam.reqForm;
  var frndCode = reqParam.frndCode;
  var device_id = reqParam.device_id;
  var os_devid_vc = reqParam.os_devid_vc;
  var referCode = reqParam.refer_code;
  var userphone = reqParam.userphone;
  var device_token = reqParam.device_token;
  var walletBalance = reqParam.wallet_balance;
  var is_wholesaler = reqParam.is_wholesaler;
  var gst_no = reqParam.gst_no;
  var is_wholesaler_approve = reqParam.is_wholesaler_approve;
  var wholesaler_firmname = reqParam.wholesaler_firmname;
  var setting = await settingsDatalayers.getSettings();


  if (reqForm == "login") {
    return new Promise((res, rej) => {
      userModel
        .findOne({ phone_no: userphone, role_type: "4" })
        .then((user) => {
          if (!user) {
            res(null);
          } else {
            if (user.is_active != "1") {
              res("422");
              return;
            }
            if (user.is_wholesaler == 1) {
              if (user.is_wholesaler_approve != "1") {
                res("422");
                return;
              }
            }
            var otp = createAndSaveOTP(userphone);
            if (device_id != "" && device_token != "") {
              userModel
                .updateOne(
                  { phone_no: userphone },
                  {
                    $currentDate: { modified: true },
                    $set: { device_id: device_id, device_token: device_token },
                  }
                )
                .then((resultt) => {
                  //------------
                })
                .catch((err) => {
                  //------------
                });
            }
            if (!otp) {
              res(null);
            } else {
              //sendOTP(userphone, otp);
              res(otp);
            }
          }
        })
        .catch((error) => {
          rej(error);
        });
    });
  } else {
    return new Promise(async (res, rej) => {
      userModel
        .findOne({ phone_no: userphone })
        .then((user) => {
          if (!user) {

            var otp = createAndSaveOTP(userphone);
            if (!otp) {
              res(null);
            } else {
              res(otp);
            }

            /*var createdDate = new Date();
            createdDate = moment(createdDate).add(5, "hours");
            createdDate = moment(createdDate).add(30, "minutes");

            var param = {
              fname: fname,
              lname: lname,
              phone_no: userphone,
              device_id: device_id,
              created: createdDate,
              modified: createdDate,
              refer_code: referCode,
              friends_code: frndCode,
              os_devid_vc: os_devid_vc,
              device_token: device_token,
              reg_from: reqParam.reg_from,
              wallet_balance: walletBalance,
              is_wholesaler: is_wholesaler,
              gst_no: gst_no,
              is_wholesaler_approve: is_wholesaler_approve,
              wholesaler_firmname: wholesaler_firmname,
              app_version: reqParam.app_version,
              last_order_date: null,
              order_status: { recieved: 0, delivered: 0, cancelled: 0 },
              password: bcrypt.hashSync(userphone, 10),
            };

            var today = new Date();
            today = moment(today).format().split("T")[0];
            today = new Date(today + "T00:00:00.000Z");
            var walletexpiredays = setting[0].wallet_expire_days;

            var expDay = moment(today).add(walletexpiredays, "days");
            expDay = new Date(expDay);
            userModel
              .create(param)
              .then((user) => {
                if (walletBalance > 0) {
                  walletDatalayers.save({
                    userId: user._id,
                    wallet_amount: walletBalance,
                    description: "Earn on registration.",
                    expire_on: expDay,
                    transaction: "1",
                    is_admin: "1",
                    //transaction_type: 4,
                  });
                }
                userIpModel
                  .updateOne(
                    { phone_ip: uip, friend_code: frndCode },
                    { $currentDate: { modified: true }, $set: { is_active: 2 } }
                  )
                  .then(() => {
                    //------------
                  })
                  .catch((error) => {
                    rej(null);
                  });                
              })
              .catch((error) => {
                rej(error);
              });*/

          } else {
            res(null);
          }
        })
        .catch((error) => {
          res(error);
        });
    });
  }
};

exports.resendotp = (userphone) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ phone_no: userphone, role_type: { $in: ["4", "10"] }, is_active: "1" })
      .then((user) => {
        if (!user) {
          res(null);
        } else {
          var otp = createAndSaveOTP(userphone);
          if (!otp) {
            res(null);
          } else {
            res(otp);
          }
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getUserDevice = (phone, deviceId) => {
  return new Promise((res, rej) => {
    userDeviceModel
      .find({ deviceId: deviceId })
      .then((userDevice) => {
        if (userDevice.length > 0) {
          res(false);
        } else {
          userDeviceModel
            .create({ phone_no: phone, deviceId: deviceId })
            .then((doc) => {
              res(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.saveipcode = (uIp, fCode) => {
  return new Promise((res, rej) => {
    userIpModel
      .find({ phone_ip: uIp })
      .then((userIp) => {
        if (userIp.length > 0) {
          userIpModel
            .updateOne(
              { phone_ip: uIp },
              { $currentDate: { modified: true }, $set: { is_active: 1 } }
            )
            .then(() => {
              res(true);
            })
            .catch((error) => {
              rej(null);
            });
        } else {
          userIpModel
            .create({ phone_ip: uIp, friend_code: fCode })
            .then((doc) => {
              res(true);
            })
            .catch((error) => {
              rej(null);
            });
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getfcodeofip = (uIp) => {
  return new Promise((res, rej) => {
    userIpModel
      .find({ phone_ip: uIp, is_active: 1 }, { phone_ip: 1, friend_code: 1 })
      .then((userIp) => {
        res(userIp);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.isDeviceExist = (deviceId) => {
  return new Promise((res, rej) => {
    userDeviceModel
      .find({ deviceId: deviceId })
      .then((userDevice) => {
        if (userDevice.length > 0) {
          res(true);
        } else {
          res(false);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.giveamountinwallet = async (phone, msg = "") => {
  return new Promise((res, rej) => {
    userModel
      .find({ phone_no: phone })
      .then(async (foundUser) => {
        if (foundUser.length > 0) {
          userModel
            .updateOne(
              { _id: foundUser[0]._id },
              {
                $currentDate: { modified: true },
                $set: { wallet_balance: 100 },
              }
            )
            .then(async (result) => {
              var today = new Date();
              today = moment(today).format().split("T")[0];
              today = new Date(today + "T00:00:00.000Z");
              var x = await settingsDatalayers.getSettings();
              var walletexpiredays = x[0].wallet_expire_days;

              var expDay = moment(today).add(walletexpiredays, "days");
              expDay = new Date(expDay);
              if (msg == "") {
                msg = "Earn on registration.";
              }
              walletDatalayers.save({
                userId: foundUser[0]._id,
                wallet_amount: 100,
                description: msg,
                expire_on: expDay,
                transaction: "1",
                is_admin: "1",
              });

              res(true);
            })
            .catch((err) => {
              rej(err);
            });
          res(true);
        } else {
          res(false);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

// exports.sendOTP = (number, otp) => {
//   return new Promise((res, rej) => {

//     // The new API URL and the parameters
//     const apiKey = 'WVAOe2WgJQ8yoBF2';
//     const senderId = 'GPCNAT';
//     const message = urlencode(`Please enter the OTP code ${otp} in the space provided to verify your account. GPC Natural Food Products.`);

//     // Construct the URL with the OTP and other details
//     const url = `http://sms.textmedia.in/vb/apikey.php?apikey=${apiKey}&senderid=${senderId}&number=${number}&message=${message}`;

//     // Call the API using an HTTP GET request
//     http.get(url, (response) => {
//       let responseData = '';

//       // Collect data chunks
//       response.on('data', (chunk) => {
//         responseData += chunk;
//       });

//       // Handle the response
//       response.on('end', () => {
//         console.log("Response from TextMedia API:", responseData);

//         // Check if the response is success or error
//         if (responseData.includes('Success')) {
//           res("OTP sent successfully.");
//         } else {
//           rej("Failed to send OTP.");
//         }
//       });
//     }).on('error', (error) => {
//       console.error("Error sending OTP:", error);
//       rej(error);
//     });
//   });
// };

exports.sendOTP = (number, otp) => {
  return new Promise((res, rej) => {
    settingModel
      .findOne()
      .then((settingData) => {
        var msg = urlencode(
          "Hello User Your Login Verification Code is " + otp + ". Thanks AYT"
        );
        var username = settingData.textLocalUser;
        var hash = settingData.textLocalHash;
        var sender = settingData.textLocalSender;
        // var data = "username=" + username + "&hash=" + hash + "&sender=" + sender + "&numbers=" + number + "&message=" + msg;
        var data =
          "apikey=" +
          hash +
          "&sender=" +
          sender +
          "&numbers=" +
          number +
          "&message=" +
          msg;
        var options = { host: "api.textlocal.in", path: "/send?" + data };

        callback = function (response) {
          var str = "";
          //another chunk of data has been recieved, so append it to `str`
          response.on("data", function (chunk) {
            str += chunk;
          });
          //the whole response has been recieved, so we just print it out here
          response.on("end", function () {
            console.log("error: " + str);
          });
        };
        https.request(options, callback).end();
        res("");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

function createAndSaveOTP(userphone) {
  // console.log('ss',userphone)
  return new Promise((res, rej) => {
    userOtpModel
      .findOne({ phone_no: userphone })
      .then((data) => {
        var otp = generateOTP(6);
        if (userphone == "9785869100") {
          otp = "123456";
        }

        if (!data) {
          userOtpModel
            .create({ phone_no: userphone, otp: otp })
            .then(async () => {
              // await sendOTP(userphone, otp)
              res(otp);
            })
            .catch((error) => {
              rej(null);
            });
        } else {
          userOtpModel
            .findOneAndUpdate(
              { _id: data._id },
              {
                $currentDate: { created: true, modified: true },
                $set: { otp: otp },
              }
            )
            .then(async (userData) => {

              // await sendOTP(userData.phone_no, userData.otp)
              res(otp);
            })
            .catch((error) => {
              console.log('error')
              console.log(error)
              rej(null);
            });
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
}

exports.varifyOtp = (userphone, otp) => {
   console.log(userphone)
  return new Promise((res, rej) => {
    userOtpModel
      .findOne({ phone_no: userphone, otp: otp })
      .then((userotp) => {
        if (!userotp) {
          res(null);
        } else {
          userOtpModel
            .deleteOne({ _id: userotp._id })
            .then(() => {
              //---------------------
              //console.log("OTP Rmoved.");
            })
            .catch((error) => {
              console.log(error);
            });

          this.findbyField({ phone_no: userotp.phone_no });

          res(userotp);
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};


exports.getLoginUser = async (phone_no) => {
  return new Promise((res, rej) => {
    userModel
      .findOne(
        { phone_no: phone_no },
        {
          created: 0,
          modified: 0,
          password: 0,
          createdby: 0,
          modifiedby: 0,
          __v: 0,
        }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

function generateOTP(n) {
  var add = 1,
    max = 12 - add;
  if (n > max) {
    return generate(max) + generate(n - max);
  }
  max = Math.pow(10, n + add);
  var number = Math.floor(Math.random() * (max - max / 10 + 1)) + max / 10;
  return ("" + number).substring(add);
}

exports.getGuestToken = async (token) => {
  return new Promise((res, rej) => {
    UserDeviceTokenModel.find({ device_token: token })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.saveGuestToken = async (token) => {
  return new Promise((res, rej) => {
    UserDeviceTokenModel.create({ device_token: token })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getAllGuestToken = async (token) => {
  return new Promise((res, rej) => {
    UserDeviceTokenModel.find()
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.deleteGuestToken = async (token) => {
  return new Promise((res, rej) => {
    UserDeviceTokenModel.findOneAndDelete({ device_token: token })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getguestlogin = () => {
  return new Promise((res, rej) => {
    userModel
      .findOne(
        { email: process.env.GUESTEMAIL, role_type: "6", is_active: "1" },
        { fname: 1, lname: 1, email: 1, img: 1, role_type: 1, _id: 1 }
      )
      .then((user) => {
        if (!user) {
          res(null);
        } else {
          res(user);
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};


exports.dboylogin = (userphone) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ phone_no: userphone, role_type: "5", is_active: "1" })
      .then((user) => {
        if (!user) {
          res(null);
        } else {
          var otp = createAndSaveOTP(userphone);

          if (!otp) {
            res(null);
          } else {
            res(otp);
          }
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.stafflogin = (userphone) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({
        phone_no: userphone,
        is_active: "1",
        role_type: { $nin: ["1", "3", "4", "6"] },
      })
      .then((user) => {
        if (!user) {
          res(null);
        } else {
          var otp = createAndSaveOTP(userphone);

          if (!otp) {
            res(null);
          } else {
            res(otp);
          }
        }
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getAllUser = (where = {}) => {
  return new Promise((res, rej) => {
    userModel
      .find(where)
      .sort({ created: -1 })
      //.sort({ role_type: 1, title: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getAllStaff = (where = {}) => {
  return new Promise((res, rej) => {
    userModel
      .find(where, { _id: 1, fname: 1, lname: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.gettotalUsers = async (where) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $lookup: {
            from: "franchises",
            localField: "_id",
            foreignField: "userId",
            as: "franchise",
          },
        },
        {
          $unwind: {
            path: "$franchise",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            email: 1,
            role_type: 1,
            phone_no: 1,
            reg_from: 1,
            is_active: 1,
            is_wholesaler: 1,
            full_name: { $concat: ["$fname", " ", "$lname"] },
            franchiseName: { $concat: ["$franchise.firmname"] },
          },
        },
        { $match: where },
      ])
      .then((doc) => {
        res(doc.length);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getUserByRole = (where, sort, params) => {
  return new Promise((res, rej) => {
    if (params.limit == 0) {
      userModel
        .aggregate([
          {
            $match: where,
          },
          {
            $project: {
              full_name: { $concat: ["$fname", " ", "$lname"] },
              _id: 1,
              fname: 1,
              lname: 1,
              email: 1,
              franchise_id: 1,
              wallet_balance: 1,
              role_type: 1,
              is_active: 1,
              app_version: 1,
              reg_from: 1,
              created: 1,
              phone_no: 1,
              order_status: 1,
              last_order_date: 1,
              is_wholesaler: 1,
              rating: 1,
              // is_global:"",
            },
          },
          {
            $sort: sort,
          },
        ])
        .then((doc) => {
          res(doc);
        })
        .catch((err) => {
          rej(err);
        });
    } else {
      // console.log(where ,sort, params)
      userModel
        .aggregate([
          {
            $lookup: {
              from: "franchises",
              localField: "_id",
              foreignField: "userId",
              as: "franchise",
            },
          },
          {
            $unwind: {
              path: "$franchise",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              fname: 1,
              lname: 1,
              email: 1,
              wallet_balance: 1,
              franchise_id: 1,
              role_type: 1,
              is_active: 1,
              app_version: 1,
              reg_from: 1,
              created: 1,
              phone_no: 1,
              order_status: 1,
              delivery_detail: 1,
              last_order_date: 1,
              is_wholesaler: 1,
              rating: 1,
              is_global: { $ifNull: ["$franchise.is_global", false] },
              full_name: { $concat: ["$fname", " ", "$lname"] },
              franchiseName: { $concat: ["$franchise.firmname"] },
            },
          },
          { $match: where },
          { $sort: { [params.order]: params.dir } },
          { $skip: params.skip },
          { $limit: params.limit },
        ])
        .then((doc) => {
          res(doc);
        })
        .catch((err) => {
          rej(err);
        });
    }
  });
};

exports.gettotalDeliveryBoy = async (where) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $lookup: {
            from: "franchises",
            localField: "franchise_id",
            foreignField: "_id",
            as: "franchise",
          },
        },
        {
          $unwind: {
            path: "$franchise",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            email: 1,
            role_type: 1,
            phone_no: 1,
            reg_from: 1,
            is_active: 1,
            is_wholesaler: 1,
            full_name: { $concat: ["$fname", " ", "$lname"] },
            franchiseName: { $concat: ["$franchise.firmname"] },
          },
        },
        { $match: where },
      ])
      .then((doc) => {
        res(doc.length);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getDeliveryBoyByRole = (where, sort, params) => {
  return new Promise((res, rej) => {
    if (params.limit == 0) {
      userModel
        .aggregate([
          {
            $match: where,
          },
          {
            $project: {
              full_name: { $concat: ["$fname", " ", "$lname"] },
              _id: 1,
              fname: 1,
              lname: 1,
              email: 1,
              franchise_id: 1,
              wallet_balance: 1,
              role_type: 1,
              is_active: 1,
              app_version: 1,
              reg_from: 1,
              created: 1,
              phone_no: 1,
              order_status: 1,
              last_order_date: 1,
              is_wholesaler: 1,
              rating: 1,
            },
          },
          {
            $sort: sort,
          },
        ])
        .then((doc) => {
          res(doc);
        })
        .catch((err) => {
          rej(err);
        });
    } else {
      userModel
        .aggregate([
          {
            $lookup: {
              from: "franchises",
              localField: "franchise_id",
              foreignField: "_id",
              as: "franchise",
            },
          },
          {
            $unwind: {
              path: "$franchise",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              fname: 1,
              lname: 1,
              email: 1,
              wallet_balance: 1,
              franchise_id: 1,
              role_type: 1,
              is_active: 1,
              app_version: 1,
              reg_from: 1,
              created: 1,
              phone_no: 1,
              order_status: 1,
              delivery_detail: 1,
              last_order_date: 1,
              is_wholesaler: 1,
              rating: 1,
              is_global: "$franchise.is_global",
              full_name: { $concat: ["$fname", " ", "$lname"] },
              franchiseName: { $concat: ["$franchise.firmname"] },
            },
          },
          { $match: where },
          { $sort: { [params.order]: params.dir } },
          { $skip: params.skip },
          { $limit: params.limit },
        ])
        .then((doc) => {
          res(doc);
        })
        .catch((err) => {
          rej(err);
        });
    }
  });
};
exports.gettotalCustomer = async (where, waddr, issearch) => {
  return new Promise((res, rej) => {
    if (issearch == "1") {
      delivery_cond = { $expr: { $gt: [{ $size: "$delivery_address" }, 0] } };
    } else {
      delivery_cond = {};
    }
    userModel
      .aggregate([
        {
          $lookup: {
            from: "addresses",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: waddr,
              },
            ],
            as: "delivery_address",
          },
        },
        { $match: where },
        {
          $project: {
            _id: 1,
            email: 1,
            role_type: 1,
            phone_no: 1,
            reg_from: 1,
            is_active: 1,
            is_wholesaler: 1,
            full_name: { $concat: ["$fname", " ", "$lname"] },
            delivery_address: {
              countryId: 1,
              stateId: 1,
              cityId: 1,
              areaId: 1,
            },
          },
        },
        {
          $match: delivery_cond,
        },
      ])
      .then((doc) => {
        res(doc.length);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getCustomerByRole = (where, sort, params, waddr, issearch) => {
  return new Promise((res, rej) => {
    if (issearch == "1") {
      delivery_cond = { $expr: { $gt: [{ $size: "$delivery_address" }, 0] } };
    } else {
      delivery_cond = {};
    }
    userModel
      .aggregate([
        { $match: where },
        {
          $lookup: {
            from: "addresses",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: waddr,
              },
            ],
            as: "delivery_address",
          },
        },
        {
          $project: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            wallet_balance: 1,
            franchise_id: 1,
            role_type: 1,
            is_active: 1,
            app_version: 1,
            reg_from: 1,
            created: 1,
            phone_no: 1,
            order_status: 1,
            delivery_detail: 1,
            last_order_date: 1,
            is_wholesaler: 1,
            is_wholesaler_approve: 1,
            rating: 1,
            full_name: { $concat: ["$fname", " ", "$lname"] },
            delivery_address: {
              countryId: 1,
              stateId: 1,
              cityId: 1,
              areaId: 1,
            },
          },
        },
        {
          $match: delivery_cond,
        },
        { $sort: { [params.order]: params.dir } },
        { $skip: params.skip },
        { $limit: params.limit },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.exportCustomerByRole = (where, waddr, issearch) => {
  return new Promise((res, rej) => {
    if (issearch == "1") {
      delivery_cond = { $expr: { $gt: [{ $size: "$delivery_address" }, 0] } };
    } else {
      delivery_cond = {};
    }
    userModel
      .aggregate([
        { $match: where },
        {
          $lookup: {
            from: "addresses",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: waddr,
              },
              {
                $lookup: {
                  from: "areas",
                  localField: "areaId",
                  foreignField: "_id",
                  as: "areaDetails",
                },
              },
              {
                $lookup: {
                  from: "cities",
                  localField: "cityId",
                  foreignField: "_id",
                  as: "cityDetails",
                },
              },
              {
                $lookup: {
                  from: "states",
                  localField: "stateId",
                  foreignField: "_id",
                  as: "stateDetails",
                },
              },
              {
                $lookup: {
                  from: "countries",
                  localField: "countryId",
                  foreignField: "_id",
                  as: "countryDetails",
                },
              },
              {
                $unwind: { path: "$areaDetails", preserveNullAndEmptyArrays: true },
              },
              {
                $unwind: { path: "$cityDetails", preserveNullAndEmptyArrays: true },
              },
              {
                $unwind: { path: "$stateDetails", preserveNullAndEmptyArrays: true },
              },
              {
                $unwind: { path: "$countryDetails", preserveNullAndEmptyArrays: true },
              },
              // Filter addresses based on address_type
              // {
              //   $match: {
              //     address_type: 1,
              //   },
              // },
              // Make sure there's only one address after matching
              {
                $limit: 1,
              },
            ],
            as: "delivery_address",
          },
        },
        {
          $project: {
            _id: 1,
            fname: 1,
            lname: 1,
            email: 1,
            gst_no: 1,
            wallet_balance: 1,
            franchise_id: 1,
            role_type: 1,
            is_active: 1,
            app_version: 1,
            reg_from: 1,
            created: 1,
            phone_no: 1,
            order_status: 1,
            last_order_date: 1,
            is_wholesaler: 1,
            rating: 1,
            full_name: { $concat: ["$fname", " ", "$lname"] },
            delivery_address: {
              address1: { $arrayElemAt: ["$delivery_address.address1", 0] },
              address2: { $arrayElemAt: ["$delivery_address.address2", 0] },
              pincode: { $arrayElemAt: ["$delivery_address.pincode", 0] },
              phone_no: { $arrayElemAt: ["$delivery_address.phone_no", 0] },
              address_type: { $arrayElemAt: ["$delivery_address.address_type", 0] },
              countryId: { $arrayElemAt: ["$delivery_address.countryId", 0] },
              stateId: { $arrayElemAt: ["$delivery_address.stateId", 0] },
              cityId: { $arrayElemAt: ["$delivery_address.cityId", 0] },
              areaId: { $arrayElemAt: ["$delivery_address.areaId", 0] },
              default_address: { $arrayElemAt: ["$delivery_address.default_address", 0] },
              area_name: { $arrayElemAt: ["$delivery_address.areaDetails.title", 0] },
              city_name: { $arrayElemAt: ["$delivery_address.cityDetails.title", 0] },
              state_name: { $arrayElemAt: ["$delivery_address.stateDetails.title", 0] },
              country_name: { $arrayElemAt: ["$delivery_address.countryDetails.title", 0] },
            },
          },
        },
        {
          $match: delivery_cond,
        },
        { $sort: { created: -1 } },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};



exports.getAllUserWithDefaultAddress = () => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $lookup: {
            from: "addresses",
            as: "address",
            localField: "_id",
            foreignField: "userId",
          },
        },
      ])
      .then((users) => {
        res(users);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getAllUsersAndOrders = (where) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $match: where,
        },
        {
          $lookup: {
            from: "orders",
            as: "orders",
            localField: "_id",
            foreignField: "userId",
          },
        },
        {
          $sort: { created: -1 },
        },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getClients = (param = {}) => {
  return new Promise((res, rej) => {
    userModel
      .find(
        { role_type: "4", is_active: "1" },
        { _id: 1, fname: 1, lname: 1, phone_no: 1 }
      )
      .sort({ fname: 1, lname: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getAdmin = () => {
  return new Promise((res, rej) => {
    userModel
      .find({ role_type: "1" })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getAllFranchise = () => {
  return new Promise((res, rej) => {
    userModel
      .find({ role_type: "3" }, { _id: 1, fname: 1, lname: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getAllDeliveryBoy = () => {
  return new Promise((res, rej) => {
    userModel
      .find({ role_type: "5" }, { _id: 1, fname: 1, lname: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.save = async (param, isFranchise) => {
  param.user.password = await bcrypt.hashSync(param.user.password, 10);
  param.user.last_order_date = null;
  param.user.order_status = { recieved: 0, delivered: 0, cancelled: 0 };
  const globalfrid = await franchiseDatalayers.getByField({ is_global: true });
  return new Promise((res, rej) => {
    userModel
      .create(param.user)
      .then(async (doc) => {
        if (param.user.role_type == 3) {
          param.franchise.userId = doc._id;
          frUserModel
            .create(param.franchise)
            .then(async (frDoc) => {
              let timeSlot = {
                'default': 1,
                'start_time': 'Any',
                'end_time': 'Time',
                'value': 0,
                'franchiseId': frDoc._id,
                'createdby': param.user.createdby,
                'modifiedby': param.user.createdby,
              };

              await deliveryslotModel.create(timeSlot);
              /// update global product while create new franchise
              if (frDoc.isallow_global_product == true) {
                if (globalfrid.length) {
                  var newfranId = globalfrid[0]._id;
                  let frprodata =
                    await productsDatalayers.getallfranchiseproducts(newfranId);
                  if (frprodata.length > 0) {
                    frprodata.forEach(async (ele) => {
                      var vardata = [];
                      const param = {
                        franchiseId: frDoc._id,
                        catId: ele.catId,
                        productId: ele.productId,
                        product_quality: ele.product_quality,
                        product_max_order: ele.product_max_order,
                        product_unit: ele.product_unit,
                        is_active: ele.is_active,
                        isShown: ele.isShown,
                        createdby: ele.createdby,
                        isPacket: ele.isPacket,
                        modifiedby: ele.modifiedby,
                      };
                      let frnewprodata = await frproductsDatalayers.save(param);
                      var frnewprodataId = 0;
                      if (frnewprodata["data"]) {
                        var frnewprodataId = frnewprodata["data"]._id;
                      }
                      /// update varient data
                      const fwhere = {
                        franchiseId: newfranId,
                        frproductId: ele._id,
                      };

                      let frprovardata =
                        await productsDatalayers.allfranchiseproductvarient(
                          fwhere
                        );
                      frprovardata.forEach((fele, i) => {
                        vardata.push({
                          catId: fele.catId,
                          productId: fele.productId,
                          frproductId: frnewprodataId,
                          franchiseId: frDoc._id,
                          measurment: fele.measurment,
                          unit: fele.unit,
                          wholesale: fele.wholesale ? fele.wholesale : 0,
                          price: fele.price,
                          mrp: fele.mrp,
                          disc_price: fele.disc_price,
                          qty: fele.qty,
                          is_active: fele.is_active,
                          is_ws_active: fele.is_ws_active
                            ? fele.is_ws_active
                            : "1",
                        });
                      });
                      /// update frpro varient
                      if (vardata.length > 0) {
                        frproductsDatalayers
                          .saveVarient(vardata)
                          .then((varients) => {
                            res(doc);
                          })
                          .catch((err) => {
                            res.json({
                              err: errorsCodes.BAD_REQUEST,
                              msg: "",
                              error: err,
                            });
                          });
                      } else {
                        res(doc);
                      }
                    });
                  } else {
                    res(doc);
                  }
                } else {
                  res(doc);
                }
              } else {
                res(doc);
              }
            })
            .catch((err) => {
              rej(err);
            });
        } else {
          res(doc);
        }
        if (param.user.role_type == 5) {
          param.deliveryboy.userId = doc._id;
          frDeliveryModel
            .create(param.deliveryboy)
            .then(async (frDoc) => {
              res(doc);
            })
            .catch((err) => {
              rej(err);
            });
        } else {
          res(doc);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getFranchiseUsers = (where) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $match: where,
        },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getUserByName = (where) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $match: where,
        },
        {
          $project: {
            _id: 1,
            fname: 1,
            lname: 1,
            phone_no: 1,
            is_wholesaler: 1,
            is_active: 1,
            is_wholesaler_approve: 1,
            wholesaler_firmname: 1,
            wallet_balance: 1,
          },
        },
        { $limit: 20 },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getUserById = (id) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $match: { _id: id },
        },
        {
          $lookup: {
            from: "franchises",
            as: "franchise",
            localField: "_id",
            foreignField: "userId",
          },
        },
        {
          $lookup: {
            from: "addresses",
            as: "address",
            localField: "_id",
            foreignField: "userId",
            pipeline: [
              {
                $match: { default_address: true }
              },
            ]
          },
        },

        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "franchise_delivery_boys",
            as: "franchisedeliveryboys",
            localField: "_id",
            foreignField: "userId",
          },
        },
        {
          $unwind: {
            path: "$franchisedeliveryboys",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.edit = async (param) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ _id: param.userId })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updatepassword = (body) => {
  return new Promise((res, rej) => {
    userModel
      .updateOne(
        { _id: body._id },
        { $currentDate: { modified: true }, $set: { password: body.password } }
      )
      .then((result) => {
        if (result.ok == 1) {
          res(true);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.update = (body) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: body.user._id },
        { $currentDate: { modified: true }, $set: body.user },
        { new: true }
      )
      .then((doc) => {
        if (body.user.role_type && body.user.role_type == 3) {
          frUserModel
            .updateOne(
              { _id: body.franchise.firmId },
              { $currentDate: { modified: true }, $set: body.franchise }
            )
            .then((result) => {
              res(doc);
            })
            .catch((err) => {
              rej(err);
            });
        } else {
          res(doc);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateWallet = (body) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: body._id },
        { $currentDate: { modified: true }, $set: body },
        { new: true }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateUser = (_id, body) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: _id },
        { $currentDate: { modified: true }, $set: body },
        { new: true }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateLastOrderDateAndOrderStatus = async (
  _id,
  body = {},
  incBody = {}
) => {
  return new Promise((res, rej) => {
    if (Object.keys(body).length > 0) {
      //{"order_status.recieved":1}
      userModel
        .findOneAndUpdate(
          { _id: _id },
          { $currentDate: { modified: true }, $set: body, $inc: incBody },
          { new: true }
        )
        .then((doc) => {
          res(doc);
        })
        .catch((err) => {
          rej(err);
        });
    } else {
      //{"order_status.recieved":1}
      userModel
        .findOneAndUpdate(
          { _id: _id },
          { $currentDate: { modified: true }, $inc: incBody },
          { new: true }
        )
        .then((doc) => {
          res(doc);
        })
        .catch((err) => {
          rej(err);
        });
    }
  });
};

exports.updateOrderDeliveryStatus = async (_id, incBody = {}) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: _id },
        { $currentDate: { modified: true }, $inc: incBody },
        { new: true }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateReferCode = (_id, refer_code) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id },
        { $currentDate: { modified: true }, $set: { refer_code } },
        { new: true }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateWalletBalance = async (postedData) => {
  return new Promise((res, rej) => {
    userModel
      .find({ _id: postedData._id })
      .then(async (foundUser) => {
        if (foundUser.length > 0) {
          var walletIsActive = "1";
          var expire_on = moment(Date.now()).add(5.3, "hours");
          var wbToBeAddOrSub = Number(postedData.wb);
          var x = await settingsDatalayers.getSettings();
          var walletexpiredays = x[0].wallet_expire_days;

          if (postedData.ttype == "1") {
            postedData.wb =
              Number(postedData.wb) + Number(foundUser[0].wallet_balance);
            expire_on = moment(expire_on).add(walletexpiredays, "days");
          } else {
            postedData.wb =
              Number(foundUser[0].wallet_balance) - Number(postedData.wb);
            walletIsActive = "3";
          }

          userModel
            .findOneAndUpdate(
              { _id: postedData._id },
              {
                $currentDate: { modified: true },
                $set: { wallet_balance: postedData.wb },
              },
              { new: true }
            )
            .then((result) => {
              if (result) {
                walletDatalayers
                  .save({
                    transaction: postedData.ttype,
                    is_active: walletIsActive,
                    expire_on: expire_on,
                    userId: postedData._id,
                    wallet_amount: wbToBeAddOrSub,
                    is_admin: postedData.is_admin,
                    description: postedData.description,
                  })
                  .then((wbUpdateResult) => {
                    res(result);
                  })
                  .catch((err) => {
                    rej(err);
                  });
              }
              res(result);
            })
            .catch((err) => {
              rej(err);
            });
        } else {
          rej(false);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.status = (_id, status) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: _id },
        { $currentDate: { modified: true }, $set: { is_active: status } },
        { new: true }
      )
      .then((result) => {
        if (result.role_type == "3") {
          frUserModel
            .findOneAndUpdate(
              { userId: _id },
              { $currentDate: { modified: true }, $set: { is_active: status } }
            )
            .then((result) => {
              //console.log(result);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.wholesalerstatus = (_id, status) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: _id },
        {
          $currentDate: { modified: true },
          $set: { is_wholesaler_approve: status },
        },
        { new: true }
      )
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.changestatus = (_id, status) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: _id },
        { $currentDate: { modified: true }, $set: { is_wholesaler: status } },
        { new: true }
      )
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateImageName = (_id, img) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ _id: _id }, { img: 1 })
      .then((result) => {
        if (result.img != "noimage.png" && result.img != "noimage.jpg") {
          fs.unlink(
            __dirname + "/../public/uploads/user_img/" + result.img,
            (err) => {
              if (err) {
                return;
              }
            }
          );
        }

        userModel
          .updateOne(
            { _id: _id },
            { $currentDate: { modified: true }, $set: { img: img } }
          )
          .then((result) => {
            if (result.ok == 1) {
              res(true);
            }
          })
          .catch((err) => {
            rej(err);
          });
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.findUserOnBasisOfArray = async (userIdArr) => {
  return new Promise((res, rej) => {
    userModel
      .find({ _id: { $in: userIdArr } }, { password: 0, _v: 0 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.statusAll = (pId, status) => {
  return new Promise((res, rej) => {
    userModel
      .updateMany(
        { _id: { $in: pId } },
        { $currentDate: { modified: true }, $set: status }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.delete = (userId) => {
  return new Promise((res, rej) => {
    userModel
      .findByIdAndDelete(userId)
      .then((user) => {
        if (!user) {
          res(false);
        } else {
          res(true);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.findbyField = async (param) => {
  return new Promise((res, rej) => {
    userModel
      .find(param)
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.loggedIn = async (id) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ _id: id }, { password: 0, __v: 0 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.fortgotPasswordOtp = async (param) => {

  return new Promise((resolve, reject) => {
    createAndSaveOTP(param)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.gettotalfriendLog = async (where) => {
  return new Promise((res, rej) => {
    userModel
      .find(where)
      .sort({ created: 1 })
      .then((foundUser) => {
        if (foundUser.length > 0) {
          var myCode = foundUser[0].refer_code;
          if (myCode != undefined && myCode != null && myCode != "") {
            userModel
              .find({ friends_code: myCode, role_type: "4" })
              .then((my_friends) => {
                res(my_friends.length);
              })
              .catch((err) => {
                rej(err);
              });
          } else {
            res(0);
          }
        } else {
          res(0);
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getMyFriends = (where, params) => {
  return new Promise((res, rej) => {
    userModel
      .find(where)
      .sort({ created: 1 })
      .then((foundUser) => {
        if (foundUser.length > 0) {
          var myCode = foundUser[0].refer_code;
          if (myCode != undefined && myCode != null && myCode != "") {
            userModel
              .find({ friends_code: myCode, role_type: "4" })
              .then((my_friends) => {
                res(my_friends);
              })
              .catch((err) => {
                rej(err);
              });
          } else {
            res("");
          }
        }
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getMyReferer = (rcode) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ refer_code: rcode })
      .then((foundUser) => {
        res(foundUser);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateByField = (_id, body) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: _id },
        { $currentDate: { modified: true }, $set: body }
      )
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.updateByWhere = (where, body) => {
  return new Promise((res, rej) => {
    userModel
      .updateMany(where, { $currentDate: { modified: true }, $set: body })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

exports.getTotalCustomersCount = () => {
  return new Promise((res, rej) => {
    userModel
      .countDocuments({ role_type: "4" })
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getTodayAndLastWeekCustomers = (fromDate, toDate) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $match: { created: { $gte: fromDate, $lt: toDate } },
        },
        {
          $count: "users",
        },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getMyStaff = (franchise_id) => {
  return new Promise((res, rej) => {
    userModel
      .find({ franchise_id })
      .sort({ role_type: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getStaffToAdd = (franchise_id) => {
  return new Promise((res, rej) => {
    //userModel.find({$or:[{franchise_id:franchise_id}, {franchise_id:null}]})
    userModel
      .find(
        {
          is_active: "1",
          role_type: { $nin: ["1", "3", "4", "6"] },
          franchise_id: { $in: [franchise_id, null] },
        },
        { _id: 1, fname: 1, lname: 1, role_type: 1, franchise_id: 1 }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.removeFromStaff = (where) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: where._id, franchise_id: where.franchise_id },
        { $currentDate: { modified: true }, $set: { franchise_id: null } },
        { new: true }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.saveToStaff = (where) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ _id: where._id, franchise_id: null })
      .then((doc) => {
        if (doc) {
          userModel
            .findOneAndUpdate(
              { _id: where._id },
              {
                $currentDate: { modified: true },
                $set: { franchise_id: where.franchise_id },
              },
              { new: true }
            )
            .then((doc) => {
              res(doc);
            })
            .catch((error) => {
              rej(error);
            });
        } else {
          res(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getMyStaff = (franchise_id) => {
  return new Promise((res, rej) => {
    userModel
      .find({ franchise_id })
      .sort({ role_type: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.getStaffToAdd = (franchise_id) => {
  return new Promise((res, rej) => {
    //userModel.find({$or:[{franchise_id:franchise_id}, {franchise_id:null}]})
    userModel
      .find(
        {
          is_active: "1",
          role_type: { $nin: ["1", "3", "4", "6"] },
          franchise_id: { $in: [franchise_id, null] },
        },
        { _id: 1, fname: 1, lname: 1, role_type: 1, franchise_id: 1 }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.removeFromStaff = (where) => {
  return new Promise((res, rej) => {
    userModel
      .findOneAndUpdate(
        { _id: where._id, franchise_id: where.franchise_id },
        { $currentDate: { modified: true }, $set: { franchise_id: null } },
        { new: true }
      )
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.saveToStaff = (where) => {
  return new Promise((res, rej) => {
    userModel
      .findOne({ _id: where._id, franchise_id: null })
      .then((doc) => {
        if (doc) {
          userModel
            .findOneAndUpdate(
              { _id: where._id },
              {
                $currentDate: { modified: true },
                $set: { franchise_id: where.franchise_id },
              },
              { new: true }
            )
            .then((doc) => {
              res(doc);
            })
            .catch((error) => {
              rej(error);
            });
        } else {
          res(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getDeliveryBoys = (franchise_id) => {
  return new Promise((res, rej) => {
    userModel
      .find({ franchise_id: franchise_id, role_type: "5", is_active: "1" })
      .sort({ fname: 1 })
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.finduserwishlist = async (where = {}, franchiseId) => {
  return new Promise((resolve, reject) => {
    ProductWishlistModel.aggregate([
      {
        $match: where,
      },
      {
        $lookup: {
          from: "products",
          let: { product_id: "$product_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$product_id", "$$product_id"] },
              },
            },
            { $sort: { "product.title": 1 } },
            { $skip: params.skip },
            { $limit: params.limit },
            {
              $lookup: {
                from: "franchiseproducts",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$productId", "$$productId"] },
                      franchiseId: franchiseId,
                    },
                  },
                  {
                    $project: {
                      isPacket: 1,
                      franchiseId: 1,
                      productId: 1,
                      catId: 1,
                      priority: 1,
                      product_max_order: 1,
                      product_unit: 1,
                      product_quality: 1,
                      isShown: 1,
                      is_active: 1,
                      max_order: {
                        $cond: {
                          if: { $eq: ["$product_unit", 1] },
                          then: { $multiply: ["$product_max_order", 1000] },
                          else: {
                            $cond: {
                              if: { $eq: ["$product_unit", 3] },
                              then: { $multiply: ["$product_max_order", 1000] },
                              else: "$product_max_order",
                            },
                          },
                        },
                      },
                    },
                  },
                ],
                as: "franchiseproducts",
              },
            },
            {
              $unwind: { path: "$franchiseproducts" },
            },
            {
              $lookup: {
                from: "frproductvariants",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$productId", "$$productId"] },
                      franchiseId: franchiseId,
                    },
                  },
                  {
                    $project: {
                      description: 1,
                      show_default: 1,
                      created: 1,
                      modified: 1,
                      catId: 1,
                      productId: 1,
                      frproductId: 1,
                      franchiseId: 1,
                      measurment: 1,
                      unit: 1,
                      price: 1,
                      disc_price: 1,
                      qty: 1,
                      mrp: 1,
                      wholesale: 1,
                      is_ws_active: 1,
                      provar_max_order: "$franchiseproducts.product_max_order",
                      is_active: {
                        $cond: {
                          if: { $eq: [userType, "1"] },
                          then: "$is_ws_active",
                          else: "$is_active",
                        },
                      },
                      its_unit: {
                        $cond: {
                          if: { $eq: ["$unit", 1] },
                          then: { $multiply: ["$measurment", 1000] },
                          else: {
                            $cond: {
                              if: { $eq: ["$unit", 3] },
                              then: { $multiply: ["$measurment", 1000] },
                              else: "$measurment",
                            },
                          },
                        },
                      },

                    },
                  },
                ],
                as: "productvar",
              },
            },
            {
              $lookup: {
                from: "productimages",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$productId", "$$productId"] },
                    },
                  },
                  {
                    $project: {
                      title: 1,
                      productId: 1,
                      isMain: 1,
                      is_active: 1,
                    },
                  },
                ],
                as: "productimages",
              },
            },
            {
              $project: {
                title: 1,
                catId: 1,
                description: 1,
                is_active: 1,
                isPacket: "$franchiseproducts.isPacket",
                frpro_is_active: "$franchiseproducts.frpro_is_active",
                franchiseId: "$franchiseproducts.franchiseId",
                productId: "$franchiseproducts.productId",
                catId: "$franchiseproducts.catId",
                priority: "$franchiseproducts.priority",
                product_unit: "$franchiseproducts.product_unit",
                product_quality: "$franchiseproducts.product_quality",
                isShown: "$franchiseproducts.isShown",
                product_max_order: "$franchiseproducts.product_max_order",
                max_order: "$franchiseproducts.max_order",

                productimages: "$productimages",
                productvar: "$productvar",
              },
            },
          ],
          as: "product",
        },
      },
    ])
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getuserFavProduct = (where) => {
  return new Promise((res, rej) => {
    ProductWishlistModel.find(where)
      .then((doc) => {
        res(doc);
      })
      .catch((error) => {
        rej(error);
      });
  });
};

exports.finduserFavProduct = async (where, params, franchiseId, userType) => {
  return new Promise((resolve, reject) => {
    ProductWishlistModel.aggregate([
      { $match: where },
      {
        $lookup: {
          from: "products",
          let: { productId: "$product_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$productId"] },
              },
            },
            { $sort: { "product.title": 1 } },
            { $skip: params.skip },
            { $limit: params.limit },
            {
              $lookup: {
                from: "franchiseproducts",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$productId", "$$productId"] },
                      franchiseId: franchiseId,
                    },
                  },
                  {
                    $project: {
                      isPacket: 1,
                      franchiseId: 1,
                      productId: 1,
                      catId: 1,
                      priority: 1,
                      product_max_order: 1,
                      product_unit: 1,
                      product_quality: 1,
                      isShown: 1,
                      is_active: 1,
                      max_order: {
                        $cond: {
                          if: { $eq: ["$product_unit", 1] },
                          then: { $multiply: ["$product_max_order", 1000] },
                          else: {
                            $cond: {
                              if: { $eq: ["$product_unit", 3] },
                              then: { $multiply: ["$product_max_order", 1000] },
                              else: "$product_max_order",
                            },
                          },
                        },
                      },
                    },
                  },
                ],
                as: "franchiseproducts",
              },
            },
            {
              $unwind: { path: "$franchiseproducts" },
            },
            {
              $lookup: {
                from: "frproductvariants",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$productId", "$$productId"] },
                      franchiseId: franchiseId,
                    },
                  },
                  {
                    $project: {
                      description: 1,
                      show_default: 1,
                      created: 1,
                      modified: 1,
                      catId: 1,
                      productId: 1,
                      frproductId: 1,
                      franchiseId: 1,
                      measurment: 1,
                      unit: 1,
                      price: 1,
                      disc_price: 1,
                      qty: 1,
                      mrp: 1,
                      wholesale: 1,
                      is_ws_active: 1,
                      provar_max_order: "$franchiseproducts.product_max_order",
                      is_active: {
                        $cond: {
                          if: { $eq: [userType, "1"] },
                          then: "$is_ws_active",
                          else: "$is_active",
                        },
                      },
                      its_unit: {
                        $cond: {
                          if: { $eq: ["$unit", 1] },
                          then: { $multiply: ["$measurment", 1000] },
                          else: {
                            $cond: {
                              if: { $eq: ["$unit", 3] },
                              then: { $multiply: ["$measurment", 1000] },
                              else: "$measurment",
                            },
                          },
                        },
                      },
                      /*its_max_order: { $cond: { 
                                                          if: { $eq: ["$unit", 1] },
                                                          then: {$multiply: ["$provar_max_order", 1000] },  
                                                          else: {"$cond": {
                                                                "if": { "$eq": ["$unit",3]}, 
                                                                "then":  {$multiply: ["$provar_max_order", 1000] }, 
                                                                "else": "$provar_max_order"
                                                              }},
                                                        },
                                                      }, */
                    },
                  },
                ],
                as: "productvar",
              },
            },
            {
              $lookup: {
                from: "productimages",
                let: { productId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$productId", "$$productId"] },
                    },
                  },
                  {
                    $project: {
                      title: 1,
                      productId: 1,
                      isMain: 1,
                      is_active: 1,
                    },
                  },
                ],
                as: "productimages",
              },
            },
            {
              $project: {
                title: 1,
                catId: 1,
                description: 1,
                is_active: 1,
                isPacket: "$franchiseproducts.isPacket",
                frpro_is_active: "$franchiseproducts.frpro_is_active",
                franchiseId: "$franchiseproducts.franchiseId",
                productId: "$franchiseproducts.productId",
                catId: "$franchiseproducts.catId",
                priority: "$franchiseproducts.priority",
                product_unit: "$franchiseproducts.product_unit",
                product_quality: "$franchiseproducts.product_quality",
                isShown: "$franchiseproducts.isShown",
                product_max_order: "$franchiseproducts.product_max_order",
                max_order: "$franchiseproducts.max_order",

                productimages: "$productimages",
                productvar: "$productvar",
              },
            },
          ],
          as: "product",
        },
      },
    ])
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.createFavProduct = async (params) => {
  return new Promise((resolve, reject) => {
    ProductWishlistModel.create(params)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
exports.deleteFavProduct = async (params) => {
  return new Promise((resolve, reject) => {
    ProductWishlistModel.deleteOne(params)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

exports.getUserbyArea = async (where) => {
  return new Promise((res, rej) => {
    userModel
      .aggregate([
        {
          $lookup: {
            from: "addresses",
            as: "address",
            localField: "_id",
            foreignField: "userId",
          },
        },
        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            email: 1,
            is_active: 1,
            areaId: "$address.areaId",
            device_token: 1,
          },
        },
        { $match: where },
      ])
      .then((doc) => {
        res(doc);
      })
      .catch((err) => {
        rej(err);
      });
  });
};
