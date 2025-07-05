const fs = require("fs");
const moment = require("moment");
const mongodb = require("mongodb");
const walletDatalayers = require("../datalayers/walletLogDatalayers");
const addressDatalayers = require("../datalayers/addressDatalayers");
const userDatalayers = require("../datalayers/userDatalayer");
const orderDatalayers = require("../datalayers/orderDatalayer");
const settingsDatalayers = require("../datalayers/settingDatalayers");
const luckydrawDatalayers = require("../datalayers/luckydrawDatalayers");
const { check, validationResult } = require("express-validator");
const errorsCodes = require("../helpers/error_codes/errorCodes");
const message = require("../helpers/languages/english");
const couponDatalayer = require("../datalayers/couponDatalayer");
const cartDatalayers = require("../datalayers/cartDatalayer");
const productsDatalayers = require("../datalayers/productsDatalayer");
const orderVariantDatalayers = require("../datalayers/orderVariantDatalayers");
const notify = require("../controllers/notificationController");
// const geolocation_utils = require('geolocation-utils');
// import { toLatLon, toLatitudeLongitude, headingDistanceTo, moveTo, insidePolygon } from 'geolocation-utils'
const utils = require("../middelwares/utils");


exports.updateorderDeliveryBoy = async (req, res) => {
    //save order
    orderDatalayers.updateorderDeliveryBoy(mongodb.ObjectId(req.body._id), mongodb.ObjectId(req.body.delivery_boy_id))
        .then((orders) => {
            if (orders) {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "Delivery boy updated",
                    data: orders,
                });
            } else {
                res.json({
                    sucess: errorsCodes.BAD_REQUEST,
                    err: errorsCodes.BAD_REQUEST,
                    msg: "",
                    error: err,
                });
            }
        })
        .catch((err) => {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

async function update_order_status(body) {
    await orderDatalayers.updateStatus(body);

    let mBody = "";
    let notifyToUser = [];
    let uname = body.uname;
    let mTitle = "Order Status";
    let orderUserId = body.orderUserId;
    let user_id = mongodb.ObjectId(body.user_id);
    notifyToUser.push(user_id); //send user id in array...

    switch (parseInt(body.is_active)) {
        case 1:
            mBody = `Dear ${uname}, Your order is placed successfully.`;
            break;
        case 2:
            mBody = `Dear ${uname}, We are processing you order.`;
            break;
        case 3:
            mBody = `Dear ${uname}, Your order is shipped. You will get your ordered product(s) very soon.`;
            break;
        case 4:
            mBody = `Dear ${uname}, Your order no. "${orderUserId}" has been delivered.`;
            break;
        case 5:
            mBody = `Dear ${uname}, We have recived order return request and order no. is ${orderUserId}.`;
            break;
        case 6:
            mBody = `Dear ${uname}, Your order having order no. ${orderUserId} has been cancelled.`;
            break;
    }

    notify.notify(notifyToUser, mTitle, mBody);
}

exports.updateOrderStatus = async (req, res) => {
    try {
        var body = req.body;
        var isFirstOrder = true;
        var oldUserWithZeroOrder = true;
        var orderId = mongodb.ObjectId(body._id);

        let orderData = await orderDatalayers.findOrderDetail_onCondition({
            _id: mongodb.ObjectId(orderId),
        });
        let OrderVariants = await orderDatalayers.findOrderOrderVariants({
            orderId: mongodb.ObjectId(orderId),
        });
        let user_id = mongodb.ObjectId(orderData[0].userId);
        let delivery_boy_id = mongodb.ObjectId(orderData[0].delivery_boy_id);

        if (orderData[0]["is_active"] < body.is_active) {
            var uData = await userDatalayers.findbyField({ _id: user_id });
            var uname = uData[0].fname + " " + uData[0].lname;
            await update_order_status({
                _id: orderId,
                uname: uname,
                user_id: user_id,
                is_active: body.is_active,
                orderUserId: orderData[0].orderUserId
            });
            ///// cancel order
            if (body.is_active == 6) {
                await cancel_order({
                    user_id: user_id,
                    updateOrder: orderData[0],
                    notifyToUser: [user_id]
                });
            }
            ///// delivered order 
            if (body.is_active == 4) {
                let oldOrders = await orderDatalayers.findOrderDetail_onCondition({
                    userId: user_id,
                    is_active: "4"
                });
                if (oldOrders.length > 1) {
                    isFirstOrder = false;
                }
                if (
                    uData[0].prvId != 0 &&
                    uData[0].prvId != null &&
                    uData[0].prvId != undefined &&
                    uData[0].order_count != 0 &&
                    uData[0].order_count != null &&
                    uData[0].order_count != undefined
                ) {
                    oldUserWithZeroOrder = false;
                }

                let frndCode = uData[0].friends_code;
                /// Update order status
                userDatalayers.updateLastOrderDateAndOrderStatus(user_id, {}, { "order_status.delivered": 1 });

                /// update lucky Draw offer **start**
                let orderprolist = await orderDatalayers.updateluckydraw_onOrderDetail({
                    orderId: orderId
                });
                let orderProduct = [];
                orderprolist.forEach((ele, index) => {
                    orderProduct.push(ele.productId);
                });
                let today = new Date();
                today = moment(today)
                    .add(5, "hours")
                    .add(30, "minutes")
                    .format("YYYY-MM-DD");
                today = new Date(today);

                let luckydrawlist = await luckydrawDatalayers.gettodayLuckyDraw({
                    franchise_id: orderData[0].franchiseId,
                    start_date: { $lte: today },
                    expiry_date: { $gte: today },
                    is_active: "1",
                    product_id: { $in: orderProduct }
                });

                luckydrawlist.forEach((ele, index) => {
                    var couCode = couponCode(8);
                    var paramData = {
                        luckydraw_id: mongodb.ObjectId(ele._id),
                        user_id: mongodb.ObjectId(user_id),
                        order_id: mongodb.ObjectId(orderId),
                        product_id: mongodb.ObjectId(ele.product_id),
                        coupon: couCode
                    };
                    luckydrawDatalayers.addLuckyDrawUser(paramData);
                    //// Send Push notification for couponCode
                    notify.notify(
                        [user_id],
                        "Lucky Draw Coupon",
                        `Congurational, you get coupon code "${couCode}" on order having ID: "${orderData[0].orderUserId}"`
                    );
                });
                /// update lucky Draw offer **end**

                /// Update order delivery status
                var tobe_received_total = orderData[0].delivery_total;
                var finaltotal = orderData[0].final_total;
                if (orderData[0].key_wallet_used) {
                    var walletUsed = orderData[0].key_wallet_balance;
                } else {
                    var walletUsed = 0;
                }
                switch (parseInt(orderData[0].payment_method)) {
                    case 1:
                        {
                            //Only COD OR COD + wallet
                            tobe_received_total = orderData[0].delivery_total;
                            break;
                        }
                    case 2:
                        {
                            //Only Razorpay OR Razorpay + wallet
                            tobe_received_total = orderData[0].delivery_total - orderData[0].final_total;
                            break;
                        }
                    case 3:
                        {
                            //Only wallet
                            tobe_received_total = orderData[0].delivery_total - orderData[0].key_wallet_balance;
                            break;
                        }
                    case 4:
                        {
                            //Only Paytm OR Paytm + wallet
                            tobe_received_total = orderData[0].delivery_total - orderData[0].final_total;
                            break;
                        }
                    default:
                        {
                            tobe_received_total = orderData[0].delivery_total;
                            break;
                        }
                }
                if (orderData[0].received_total == 0) {
                    if (orderData[0].payment_method == 1) {
                        var received_total = orderData[0].delivery_total;
                    } else {
                        if (orderData[0].payment_method == 3) {
                            var received_total = orderData[0].delivery_total - orderData[0].total;
                        } else {
                            var received_total = orderData[0].delivery_total - orderData[0].final_total;
                        }
                    }
                } else {
                    received_total = orderData[0].received_total;
                }
                if (received_total < 0) {
                    received_total = 0;
                }
                ///console.log(tobe_received_total);
                var newfinaltotal = 0;
                let order_variant = OrderVariants;
                order_variant.forEach((ele, index) => {
                    if (ele.revised_status == 1) {
                        newfinaltotal += ele.revised_price;
                    }
                });
                let updateParam = {
                    _id: mongodb.ObjectId(orderId),
                    received_total: received_total
                };
                let updates = await orderDatalayers.update(updateParam);
                if (updates) {
                    if (tobe_received_total == 0) {
                        var diffprice = walletUsed - newfinaltotal;
                        ///console.log("diffprice:"+diffprice);
                        if (diffprice > 0) {
                            await updateWalletBalanceIncrease(user_id, diffprice);
                            await referEarnWalletLog(
                                user_id,
                                diffprice,
                                `Rs. ${diffprice.toFixed(2)} is added to wallet in respect of received amount in order no. ${orderData[0].orderUserId}`,
                                "1", "0"
                            );
                            // send notification to user wallet add
                            notify.notify(
                                [user_id],
                                "Wallet Updates",
                                `Rs. ${diffprice.toFixed(2)} is added to wallet in respect of received amount in order no. ${orderData[0].orderUserId}`
                            );
                        }
                    }
                    // update price if received_total && tobe_received_total
                    if (parseInt(received_total) != parseInt(tobe_received_total)) {
                        if (tobe_received_total > received_total) {
                            //less from wallet
                            let amountToUpdate = tobe_received_total - received_total;
                            await updateWalletBalanceDecrease(user_id, amountToUpdate);
                            referEarnWalletLog(
                                user_id,
                                amountToUpdate,
                                `Rs. ${amountToUpdate.toFixed(2)} is deducted from wallet in respect of received amount in order no. ${orderData[0].orderUserId}`,
                                "2", "0"
                            );
                            // send notification to user wallet less
                            notify.notify(
                                [user_id],
                                "Wallet Updates",
                                `Rs. ${amountToUpdate.toFixed(2)} is deducted from wallet in respect of received amount in order no. ${orderData[0].orderUserId}`
                            );
                        } else {
                            //add to wallet
                            let amountToUpdate = received_total - tobe_received_total;
                            await updateWalletBalanceIncrease(user_id, amountToUpdate);
                            await referEarnWalletLog(
                                user_id,
                                amountToUpdate,
                                `Rs. ${amountToUpdate.toFixed(2)} is added to wallet in respect of received amount in order no. ${orderData[0].orderUserId}`,
                                "1", "0"
                            );
                            // send notification to user wallet add
                            notify.notify(
                                [user_id],
                                "Wallet Updates",
                                `Rs. ${amountToUpdate.toFixed(2)} is added to wallet in respect of received amount in order no. ${orderData[0].orderUserId}`
                            );
                        }
                    }
                    ///update delivery boy delivery status
                    if (received_total > 0) {
                        userId = orderData[0].delivery_boy_id;
                        userDatalayers.updateOrderDeliveryStatus(userId, { "delivery_detail.recieved": parseFloat(received_total) });
                    }
                }

                ///is_orderrefer
                if (frndCode != undefined && frndCode != null && frndCode != "") {
                    let x = await settingsDatalayers.getSettings();
                    let frndCode_2User = "";
                    let frndCode_3User = "";
                    let frndCode_4User = "";
                    let frndCode_5User = "";
                    if (x[0].is_orderrefer) {
                        if (isFirstOrder && oldUserWithZeroOrder) {
                            let freindOneData = await userDatalayers.findbyField({
                                refer_code: frndCode,
                            });

                            //this is 2nd user
                            if (
                                freindOneData[0].friends_code != "" &&
                                freindOneData[0].friends_code != undefined &&
                                freindOneData[0].friends_code != null
                            ) {
                                frndCode_2User = freindOneData[0].friends_code;
                            }

                            var frndOne_User_Id = freindOneData[0]._id;
                            let frnd1_prevWalletBalance =
                                freindOneData[0].wallet_balance;
                            let frndOne_earn = x[0].friend_one_earn;
                            let frnd1_newWalletBalance =
                                Number(frnd1_prevWalletBalance) + Number(frndOne_earn);

                            await userDatalayers.updateWallet({
                                _id: frndOne_User_Id,
                                wallet_balance: frnd1_newWalletBalance,
                            });

                            await referEarnWalletLog(
                                frndOne_User_Id,
                                frndOne_earn,
                                `Earn Bonus on ordered by ${uname}.`,
                                "1", "1"
                            );

                            var notifyToUser = [];
                            notifyToUser.push(frndOne_User_Id);
                            notify.notify(
                                notifyToUser,
                                "Wallet Updates",
                                `Earn Bonus Rs. ${frndOne_earn}/- Order by ${uname}.`
                            );

                            //refer & earn 2nd friend
                            if (frndCode_2User != "") {
                                let freindTwoData = await userDatalayers.findbyField({
                                    refer_code: frndCode_2User,
                                });

                                if (
                                    freindTwoData[0].friends_code != "" &&
                                    freindTwoData[0].friends_code != undefined &&
                                    freindTwoData[0].friends_code != null
                                ) {
                                    frndCode_3User = freindTwoData[0].friends_code;
                                }

                                let frnd2_UserId = freindTwoData[0]._id;
                                let frnd2_prevWalletBalance =
                                    freindTwoData[0].wallet_balance;
                                let frndTwo_earn = x[0].friend_two_earn;

                                let frnd2_newWalletBalance =
                                    Number(frnd2_prevWalletBalance) +
                                    Number(frndTwo_earn);

                                await userDatalayers.updateWallet({
                                    _id: frnd2_UserId,
                                    wallet_balance: frnd2_newWalletBalance,
                                });

                                await referEarnWalletLog(
                                    frnd2_UserId,
                                    frndTwo_earn,
                                    `Earn Bonus on order by ${uname}.`,
                                    "1", "1"
                                );

                                var notifyToUser = [];
                                notifyToUser.push(frnd2_UserId);
                                notify.notify(
                                    notifyToUser,
                                    "Wallet Updates",
                                    `Earn Bonus Rs. ${frndTwo_earn}/-, Order by ${uname}`
                                );
                            }

                            //refer & earn 3rd friend
                            /* if (frndCode_3User != "") {
                                let freindThreeData = await userDatalayers.findbyField({ refer_code: frndCode_3User });

                                if (freindThreeData[0].friends_code != "" && freindThreeData[0].friends_code != undefined && freindThreeData[0].friends_code != null) {
                                    frndCode_4User = freindThreeData[0].friends_code;
                                }

                                let frnd3_UserId = freindThreeData[0]._id;
                                let frnd3_prevWalletBalance = freindThreeData[0].wallet_balance;
                                let frndThree_earn = x[0].friend_three_earn;
                                let frnd3_newWalletBalance = Number(frnd3_prevWalletBalance) + Number(frndThree_earn);

                                await userDatalayers.updateWallet({ _id: frnd3_UserId, wallet_balance: frnd3_newWalletBalance.toFixed(2) });

                                await referEarnWalletLog(
                                    frnd3_UserId,
                                    frndThree_earn,
                                    `Earn Bonus on order by ${uname}.`,
                                    "1","1"
                                );

                                var notifyToUser = [];
                                notifyToUser.push(frnd3_UserId);
                                notify.notify(notifyToUser, "Wallet Updates", `Earn Bonus Rs. ${frndThree_earn}/-, Order by ${uname}.`);
                            } */

                            //refer & earn 4th friend
                            /* if (frndCode_4User != "") {
                                let freindFourData = await userDatalayers.findbyField({ refer_code: frndCode_4User });

                                if (freindFourData[0].friends_code != "" && freindFourData[0].friends_code != undefined && freindFourData[0].friends_code != null) {
                                    frndCode_5User = freindFourData[0].friends_code;
                                }

                                let frnd4_UserId = freindFourData[0]._id;
                                let frnd4_prevWalletBalance = freindFourData[0].wallet_balance;
                                let frndFour_earn = x[0].friend_four_earn;
                                let frnd4_newWalletBalance = Number(frnd4_prevWalletBalance) + Number(frndFour_earn);

                                await userDatalayers.updateWallet({ _id: frnd4_UserId, wallet_balance: frnd4_newWalletBalance.toFixed(2) });

                                await referEarnWalletLog(
                                    frnd4_UserId,
                                    frndFour_earn,
                                    `Earn Bonus on order by ${uname}.`,
                                    "1","1"
                                );

                                var notifyToUser = [];
                                notifyToUser.push(frnd4_UserId);
                                notify.notify(notifyToUser, "Wallet Updates", `Earn Bonus Rs. ${frndFour_earn}/-, Order by ${uname}.`);
                            } */

                            //refer & earn 5th friend
                            /* if (frndCode_5User != "") {
                                let freindFiveData = await userDatalayers.findbyField({ refer_code: frndCode_5User });

                                let frnd5_UserId = freindFiveData[0]._id;
                                let frnd5_prevWalletBalance = freindFiveData[0].wallet_balance;
                                let frndFive_earn = x[0].friend_five_earn;
                                let frnd5_newWalletBalance = Number(frnd5_prevWalletBalance) + Number(frndFive_earn);

                                await userDatalayers.updateWallet({ _id: frnd5_UserId, wallet_balance: frnd5_newWalletBalance.toFixed(2) });

                                await referEarnWalletLog(frnd5_UserId, frndFive_earn, `Earn Bonus on order by ${uname}.`, "1","1");

                                var notifyToUser = [];
                                notifyToUser.push(frnd5_UserId);
                                notify.notify(notifyToUser, "Wallet Updates", `Earn Bonus Rs. ${frndFive_earn}/-, Order by ${uname}`);
                            } */
                        } else {
                            let latestOrders = orderData[0];

                            let frndOne_earn_per = x[0].friend_one_earn_percentage;
                            let totalAmount = latestOrders.total;

                            let friendOneData = await userDatalayers.findbyField({
                                refer_code: frndCode,
                            });
                            if (
                                friendOneData[0].friends_code != "" &&
                                friendOneData[0].friends_code != null &&
                                friendOneData[0].friends_code != undefined
                            ) {
                                frndCode_2User = friendOneData[0].friends_code;
                            }

                            var frndone_User_Id = friendOneData[0]._id;
                            let frnd1_prevWalletBalance =
                                friendOneData[0].wallet_balance;

                            let frnOneEarn_amnt =
                                Number(totalAmount) * Number(frndOne_earn_per / 100);

                            let frnd1_newWalletBalance =
                                Number(frnd1_prevWalletBalance) +
                                Number(frnOneEarn_amnt);

                            await userDatalayers.updateWallet({
                                _id: frndone_User_Id,
                                wallet_balance: frnd1_newWalletBalance.toFixed(2),
                            });

                            await referEarnWalletLog(
                                frndone_User_Id,
                                frnOneEarn_amnt,
                                `Earn Bonus on order by ${uname}.`,
                                "1", "1"
                            );

                            var notifyToUser = [];
                            notifyToUser.push(frndone_User_Id);
                            notify.notify(
                                notifyToUser,
                                "Wallet Updates",
                                `Earn Bonus Rs. ${frnOneEarn_amnt.toFixed(
                                    2
                                )}/- Order by ${uname}.`
                            );

                            if (frndCode_2User != "") {
                                let friendTwoData = await userDatalayers.findbyField({
                                    refer_code: frndCode_2User,
                                });

                                if (
                                    friendTwoData[0].friends_code != "" &&
                                    friendTwoData[0].friends_code != null &&
                                    friendTwoData[0].friends_code != undefined
                                ) {
                                    frndCode_3User = friendTwoData[0].friends_code;
                                }

                                let frnd2_UserId = friendTwoData[0]._id;
                                let frnd2_prevWalletBalance =
                                    friendTwoData[0].wallet_balance;

                                let frndTwo_earn_per = x[0].friend_two_earn_percentage;
                                let frnTwoEarn_amnt =
                                    Number(totalAmount) *
                                    Number(frndTwo_earn_per / 100);

                                let frnd2_newWalletBalance =
                                    Number(frnd2_prevWalletBalance) +
                                    Number(frnTwoEarn_amnt);

                                await userDatalayers.updateWallet({
                                    _id: frnd2_UserId,
                                    wallet_balance: frnd2_newWalletBalance,
                                });

                                await referEarnWalletLog(
                                    frnd2_UserId,
                                    frnTwoEarn_amnt,
                                    `Earn Bonus on order by ${uname}.`,
                                    "1", "1"
                                );

                                var notifyToUser = [];
                                notifyToUser.push(frnd2_UserId);
                                notify.notify(
                                    notifyToUser,
                                    "Wallet Updates",
                                    `Earn Bonus Rs. ${frnTwoEarn_amnt}/- Order by ${uname}.`
                                );
                            }
                        }
                    }
                }
            }

            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "Status Updated Succesfully",
                orderId,
            });
        } else {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "Order Status Does Not Updated!!"
            });
        }
    } catch (error) {
        res.json({
            err: errorsCodes.BAD_REQUEST,
            msg: "",
            error: error,
        });
    }
};

async function cancel_order(status_param) {
    user_id = status_param.user_id;
    updateOrder = status_param.updateOrder;
    notifyToUser = status_param.notifyToUser;

    userDatalayers.updateLastOrderDateAndOrderStatus(user_id, {}, { "order_status.cancelled": 1 });

    var amountToUpdate = Number(updateOrder.key_wallet_balance);
    if (updateOrder.key_wallet_used == true && amountToUpdate > 0) {
        await updateWalletBalanceIncrease(user_id, amountToUpdate);
        await referEarnWalletLog(
            user_id,
            amountToUpdate,
            `Either Order Cancel or Undelivered of Order having ID:[${updateOrder.orderUserId}]`,
            "1", "1"
        );

        notify.notify(
            notifyToUser,
            "Wallet Updates",
            `Either Order Cancelled or not delivered of Order having ID:[${updateOrder.orderUserId}], refund amount ${amountToUpdate}`
        );
    }
    if (updateOrder.razorpay_payment_id != "" && updateOrder.razorpay_payment_id != undefined) {
        var rzrPayedAmt = Number(updateOrder.final_total);
        await updateWalletBalanceIncrease(user_id, rzrPayedAmt);
        await referEarnWalletLog(
            user_id,
            rzrPayedAmt,
            `Either Order Cancel or Undelivered of Order having ID:[${updateOrder.orderUserId}]`,
            "1", "0"
        );
        notify.notify(
            notifyToUser,
            "Wallet Updates",
            `Either Order Cancelled or not delivered of Order having ID:[${updateOrder.orderUserId}], refund amount ${rzrPayedAmt}`
        );
    }
    if (updateOrder.paytm_payment_id != "" && updateOrder.paytm_payment_id != undefined) {
        var rzrPayedAmt = Number(updateOrder.final_total);
        await updateWalletBalanceIncrease(user_id, rzrPayedAmt);
        await referEarnWalletLog(
            user_id,
            rzrPayedAmt,
            `Either Order Cancel or Undelivered of Order having ID:[${updateOrder.orderUserId}]`,
            "1", "0"
        );
        notify.notify(
            notifyToUser,
            "Wallet Updates",
            `Either Order Cancelled or not delivered of Order having ID:[${updateOrder.orderUserId}], refund amount ${rzrPayedAmt}`
        );
    }

    // update coupon uses count on cancel order
    couponDatalayer.updateUsesCount(updateOrder.promo_code, -1);

    var orderVariants = await orderVariantDatalayers.findByField({
        orderId: updateOrder._id,
    });

    orderVariants.forEach((elem) => {
        productsDatalayers.productVarientFindByField({
            _id: mongodb.ObjectId(elem.frproductvarId),
        })
            .then((doc) => {
                if (doc.length > 0) {
                    let qty = parseInt(elem.qty) + parseInt(doc[0].qty);
                    let cond = {
                        qty: qty,
                        order_status: "6"
                    };

                    orderVariantDatalayers.orderVariantUpdate(
                        elem.frproductvarId,
                        cond
                    );

                    productsDatalayers.updateQtyOnOrderPlaced(
                        mongodb.ObjectId(elem.frproductvarId),
                        qty
                    );
                }
            })
            .catch((error) => {
                throw error;
            });
    });
}

exports.orderProcessDetail = async (req, res) => {
    var param = req.body.order_param;
    if (typeof param == "string") {
        param = JSON.parse(req.body.order_param);
    } else {
        param = JSON.parse(JSON.stringify(req.body.order_param));
    }
    var products = {};
    var mainArr = [];

    for (let i = 0; i < param.length; i++) {
        var x = await orderDatalayers.orderProcessDetail(param[i]);
        mainArr.push(x[0]);
    }
    products.products = mainArr;
    try {
        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "Order Process Detail Succesfully",
            data: products,
        });
    } catch (error) {
        res.json({
            err: errorsCodes.BAD_REQUEST,
            msg: "",
            error: error,
        });
    }
};

exports.exportAllorders = async (req, res) => {
    let _or = [];
    let _and = [];
    let _where = {};

    if (req.query.created_from && req.query.created_from != "" && req.query.created_to && req.query.created_to != "") {
        let created_from = new Date(moment(req.query.created_from).add(5, "hours").add(30, "minutes"));
        let created_to = new Date(moment(req.query.created_to).add(1, "days").add(5, "hours").add(30, "minutes"));
        _and.push({ created: { $gte: created_from, $lt: created_to } });
    }
    if ((req.query.delivery_date_from) && (req.query.delivery_date_from)) {
        let startDate = (req.query.delivery_date_from) ? new Date(req.query.delivery_date_from) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));

        let endDate = (req.query.delivery_date_to) ? new Date(moment(req.query.delivery_date_to).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        _and.push({ delivery_date: { $gte: startDate, $lt: endDate } });
    }
    if (req.query.country) {
        _and.push({ country: mongodb.ObjectId(req.query.country) });
    }
    if (req.query.state) {
        _and.push({ state: mongodb.ObjectId(req.query.state) });
    }
    if (req.query.city) {
        _and.push({ city: mongodb.ObjectId(req.query.city) });
    }
    if (req.query.area_group) {
        let arrOfIds = req.query.area_group.split(",").map((ele) => {
            return mongodb.ObjectId(ele);
        })
        _and.push({ area: { $in: arrOfIds } });
    }
    if (req.query.area) {
        _and.push({ area: mongodb.ObjectId(req.query.area) });
    }
    if (req.query.is_wholesaler) {
        if (req.query.is_wholesaler == 1) {
            _and.push({ is_wholesaler: true });
        } else {
            _and.push({ is_wholesaler: false });
        }
    }
    if (req.query.is_active) {
        _and.push({ is_active: req.query.is_active });
    }
    if (req.query.payment_method) {
        _and.push({ payment_method: Number(req.query.payment_method) });
    }

    if (req.query.franchise_id) {
        _and.push({ franchiseId: mongodb.ObjectId(req.query.franchise_id) });
    }
    if (_or.length > 0 && _and.length > 0) {
        where = { $and: [{ $or: _or }, ..._and] }
    }
    if (!_or.length && _and.length > 0) {
        where = { $and: _and }
    }
    if (_or.length && !_and.length > 0) {
        where = { $or: _or }
    }
    orderDatalayers.exportAllorders(where)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: orders
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });

};

exports.getAllOrders = async (req, res) => {
    let where = {
        franchiseId: '',
        created: ''
    };
    let user = req.user;


    if (user.role_type == "3") {
        let data = await userDatalayers.getUserById(mongodb.ObjectId(user._id));
        where.franchiseId = mongodb.ObjectId(data[0].franchise[0]._id);
    } else {
        delete where.franchiseId;
    }

    if (req.query.created_from && req.query.created_from != "" && req.query.created_to && req.query.created_to != "") {
        let created_from = new Date(moment(req.query.created_from).add(5, "hours").add(30, "minutes"));
        let created_to = new Date(moment(req.query.created_to).add(1, "days").add(5, "hours").add(30, "minutes"));
        where.created = { $gte: created_from, $lt: created_to };
    } else {
        delete where.created;
    }

    let total_order = await orderDatalayers.gettotalOrders();

    let params = { skip: 0, limit: 0 };
    if (req.query.limit) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    }
    var filtered = total_order;
    let _or = [];
    let _and = [];
    let _where = {};

    if (req.query.created_from && req.query.created_from != "" && req.query.created_to && req.query.created_to != "") {
        let created_from = new Date(moment(req.query.created_from).add(5, "hours").add(30, "minutes"));
        let created_to = new Date(moment(req.query.created_to).add(1, "days").add(5, "hours").add(30, "minutes"));
        _and.push({ created: { $gte: created_from, $lt: created_to } });
    }

    if ((req.query.delivery_date_from) && (req.query.delivery_date_from)) {
        let startDate = (req.query.delivery_date_from) ? new Date(req.query.delivery_date_from) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));

        let endDate = (req.query.delivery_date_to) ? new Date(moment(req.query.delivery_date_to).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        _and.push({ delivery_date: { $gte: startDate, $lt: endDate } });
    }

    if (req.query.country) {
        _and.push({ country: mongodb.ObjectId(req.query.country) });
    }

    if (req.query.state) {
        _and.push({ state: mongodb.ObjectId(req.query.state) });
    }

    if (req.query.city) {
        _and.push({ city: mongodb.ObjectId(req.query.city) });
    }

    if (req.query.area_group) {
        let arrOfIds = req.query.area_group.split(",").map((ele) => {
            return mongodb.ObjectId(ele);
        })
        _and.push({ area: { $in: arrOfIds } });
    }

    if (req.query.area) {
        _and.push({ area: mongodb.ObjectId(req.query.area) });
    }

    if (req.query.is_wholesaler) {
        if (req.query.is_wholesaler == 1) {
            _and.push({ is_wholesaler: true });
        } else {
            _and.push({ is_wholesaler: false });
        }
    }

    if (req.query.is_active) {
        _and.push({ is_active: req.query.is_active });
    }

    if (req.query.payment_method) {
        _and.push({ payment_method: Number(req.query.payment_method) });
    }

    if (req.query.where) {
        _or = [{
            full_name: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            firmname: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            phone_no: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            orderUserId: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }];
    }
    if (req.query.franchise_id) {
        _and.push({ franchiseId: mongodb.ObjectId(req.query.franchise_id) });
    }
    if (_or.length > 0 && _and.length > 0) {
        where = { $and: [{ $or: _or }, ..._and] }
    }

    if (!_or.length && _and.length > 0) {
        where = { $and: _and }
    }
    if (_or.length && !_and.length > 0) {
        where = { $or: _or }
    }

    filtered = await orderDatalayers.gettotalOrders(where);

    orderDatalayers.getAllorders(where, params)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: orders,
                filtered: filtered,
                total_order: total_order
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getOrdersByCondition = async (req, res) => {
    let _or = [];
    let _and = [];
    let where = {};
    let _where = {};
    let user = req.user;
    let query = req.query;
    let franchise_id = null;
    let startDate = (query.today) ? new Date(query.today) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));
    let endDate = (query.todayEnd) ? new Date(moment(query.todayEnd).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
    let is_active = (query.is_active) ? [query.is_active] : ['1', '2', '3'];
    where = { delivery_date: { $gte: startDate, $lt: endDate }, is_active: { $in: is_active } };

    if (user.role_type == "3") {
        let data = await userDatalayers.getUserById(mongodb.ObjectId(user._id));
        franchise_id = mongodb.ObjectId(data[0].franchise[0]._id)
        where.franchiseId = franchise_id;
        _and.push({ franchiseId: franchise_id });
    }
    let total_order = await orderDatalayers.gettotalOrders(where);

    let params = { skip: 0, limit: 0 };
    if (req.query.limit) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    }
    var filtered = total_order;

    _and.push({ is_active: { $in: is_active } });

    if ((req.query.delivery_date_from) && (req.query.delivery_date_from)) {
        let startDate = (req.query.delivery_date_from) ? new Date(req.query.delivery_date_from) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));

        let endDate = (req.query.delivery_date_to) ? new Date(moment(req.query.delivery_date_to).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        _and.push({ delivery_date: { $gte: startDate, $lt: endDate } });
    } else {
        _and.push({ delivery_date: { $gte: startDate, $lt: endDate } });
    }

    if (req.query.country) {
        _and.push({ country: mongodb.ObjectId(req.query.country) });
    }

    if (req.query.state) {
        _and.push({ state: mongodb.ObjectId(req.query.state) });
    }

    if (req.query.city) {
        _and.push({ city: mongodb.ObjectId(req.query.city) });
    }

    if (req.query.area_group) {
        let arrOfIds = req.query.area_group.split(",").map((ele) => {
            return mongodb.ObjectId(ele);
        })
        _and.push({ area: { $in: arrOfIds } });
    }

    if (req.query.is_wholesaler) {
        if (req.query.is_wholesaler == 1) {
            _and.push({ is_wholesaler: true });
        } else {
            _and.push({ is_wholesaler: false });
        }
    }

    if (req.query.area) {
        _and.push({ area: mongodb.ObjectId(req.query.area) });
    }

    if (req.query.is_active) {
        _and.push({ is_active: req.query.is_active });
    }

    if (req.query.payment_method) {
        _and.push({ payment_method: Number(req.query.payment_method) });
    }

    if (req.query.delivery_time_id) {
        _and.push({ delivery_time_id: req.query.delivery_time_id });
    }

    if (req.query.where) {
        _or = [{
            full_name: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            delivery_boy: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            area_title: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            phone_no: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }];
    }
    if (req.query.franchise_id) {
        _and.push({ franchiseId: mongodb.ObjectId(req.query.franchise_id) });
    }

    if (_or.length > 0 && _and.length > 0) {
        where = { $and: [{ $or: _or }, ..._and] }
    }

    if (!_or.length && _and.length > 0) {
        where = { $and: _and }
    }

    if (_or.length && !_and.length > 0) {
        where = { $or: _or }
    }

    filtered = await orderDatalayers.gettotalOrders(where);

    orderDatalayers.getAllorders(where, params)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: orders,
                filtered: filtered,
                total_order: total_order
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getfailedpaymentorders = async (req, res) => {
    let _or = [];
    let _and = [];
    let where = {};
    let params = {};

    where = { payment_method: 2, payment_status: { $ne: 2 }, is_active: "1" };

    let total_order = await orderDatalayers.gettotalOrders(where);

    filtered = await orderDatalayers.gettotalOrders(where);

    orderDatalayers.getAllorders(where, params)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: "",
                data: orders,
                filtered: filtered,
                total_order: total_order
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};


exports.getCiOrderByDate = async (req, res) => {
    var fdate = req.params.fdate;
    var tdate = req.params.tdate;
    fdate = new Date(fdate + "T00:00:00.000Z");
    tdate = new Date(tdate + "T23:59:59.000Z");
    var franchise_id = '';
    if (req.params.franchise_id) {
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);
    }
    var orderCat = '';
    if (req.params.category_id != undefined) {
        var orderCat = mongodb.ObjectId(req.params.category_id);
    }
    ////console.log(orderCat);
    orderDatalayers.getOrderByCatDate(fdate, tdate, franchise_id, orderCat)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getOrderByDate = async (req, res) => {
    var fdate = req.params.fdate;
    var tdate = req.params.tdate;
    fdate = new Date(fdate + "T00:00:00.000Z");
    tdate = new Date(tdate + "T23:59:59.000Z");
    var franchise_id = '';

    orderDatalayers.getOrderByDate(fdate, tdate, franchise_id)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getOrderByUserId = async (req, res) => {
    let where = { "userId": mongodb.ObjectId(req.params.userId) };
    var total = await orderDatalayers.gettotalOrderLog(where);
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    } else {
        where = { "userId": mongodb.ObjectId(req.params.userId) }
    }
    if (req.query.where) {
        where = {
            "$or": [{
                "total": { $regex: new RegExp('^' + req.query.where + '', 'i') }
            }, {
                "franchiseName": { $regex: new RegExp('^' + req.query.where + '', 'i') }
            }],
            "$and": [{ "userId": mongodb.ObjectId(req.params.userId) }]
        };
    }
    var filtered = await orderDatalayers.gettotalOrderLog(where);

    orderDatalayers
        .getOrderByUserId(where, params)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
                total: total,
                filtered: filtered,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getOrderWhere = async (req, res) => {
    var userId = req.params.userId;
    if (req.user.role_type == '4') {
        userId = req.user._id;
    }
    let where = { userId: mongodb.ObjectId(userId) };

    if (req.query.month && req.query.month != '' && req.query.year && req.query.year != '') {
        let m = parseInt(req.query.month);
        let y = parseInt(req.query.year);

        let mm = m;
        let yy = y;

        if (mm == 12) {
            mm = 1;
            yy++;
        } else {
            mm++;
        }

        if (m < 10) {
            m = '0' + m;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        let start_date = new Date(y + "-" + m + "-01");
        let end_date = new Date(yy + "-" + mm + "-01");
        where.created = { $gte: start_date, $lt: end_date };
    }

    orderDatalayers.getOrderWhere(where)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getDboyPendingOrders = async (req, res) => {
    try {
        let dboy = req.user;
        let user_id = mongodb.ObjectId(dboy._id);

        let startDate = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));
        let endDate = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        let where = { delivery_boy_id: user_id, is_active: '3', "delivery_date": { $gte: startDate, $lt: endDate } };

        let totalCount = await orderDatalayers.getDboyOrderCounts({ delivery_boy_id: user_id });
        let params = { skip: 0, limit: 0 };
        if (req.query.start && req.query.limit) {
            params.skip = parseInt(req.query.start);
            params.limit = parseInt(req.query.limit);
        }
        if (req.query.start && (req.query.limit == null && req.query.limit == undefined)) {
            params.skip = parseInt(req.query.start);
            params.limit = 20;
        }
        params.order = 'delivery_date';
        params.dir = -1;

        let total = await orderDatalayers.getDboyOrderCounts(where);

        if (req.query.where) {
            where = {
                "$or": [
                    {
                        "phone_no": { $regex: new RegExp('^' + req.query.where + '', 'i') }
                    },
                    {
                        "userName": { $regex: new RegExp('^' + req.query.where + '', 'i') }
                    }, {
                        "orderUserId": { $regex: new RegExp('^' + req.query.where + '', 'i') }
                    }],
                "$and": [{ "delivery_boy_id": user_id, is_active: '3' }]
            };
        }

        var filtered = await orderDatalayers.gettotalDboyOrder(where);
        let orders = await orderDatalayers.getOrderByDboyId(where, params);

        let d;
        await orders.forEach(async (ele, index) => {
            d = await utils.calculateDistance({ lat: ele.latitude, long: ele.longitude });
            orders[index].distance = d;
        });
        orders.sort(function (a, b) {
            if (a.distance < b.distance) { return -1; }
            if (a.distance > b.distance) { return 1; }
            return 0;
        });
        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            data: {
                totalCount,
                orders
            },
            total: total,
            filtered: filtered,
        });

    } catch (e) {
        console.log(e);
    }
};

exports.getOrderByDboyId = async (req, res) => {
    let user = req.user; //user
    let user_id = "";

    if (user.role_type != "5") {
        user_id = mongodb.ObjectId(req.params.userId);
    } else {
        user_id = mongodb.ObjectId(user._id);
    }
    let where = { "delivery_boy_id": user_id };

    if (user.role_type == "5" && req.query.start_date == null && req.query.start_date == undefined) {
        where.is_active = { $lt: "4" };
    }

    let params = { skip: 0, limit: 0 };
    if (req.query.start && (req.query.limit == null && req.query.limit == undefined)) {
        params.skip = parseInt(req.query.start);
        params.limit = 20;
        let startDate = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));
        let endDate = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        where = { "delivery_boy_id": user_id, "delivery_date": { $gte: startDate, $lt: endDate } };
    }

    let totalCount = await orderDatalayers.getDboyOrderCounts(where);
    var total = await orderDatalayers.gettotalDboyOrder(where);

    if (req.query.start && req.query.limit) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
    }
    if (req.query.order) {
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    } else {
        params.order = 'created';
        params.dir = -1;
    }
    if (req.query.where) {
        where = {
            "$or": [
                {
                    "phone_no": { $regex: new RegExp('^' + req.query.where + '', 'i') }
                },
                {
                    "userName": { $regex: new RegExp('^' + req.query.where + '', 'i') }
                }, {
                    "orderUserId": { $regex: new RegExp('^' + req.query.where + '', 'i') }
                }],
            "$and": [{ "delivery_boy_id": user_id }]
        };
    }

    if (req.query.start_date != '""' && req.query.start_date !== null && req.query.start_date !== "" && req.query.start_date !== undefined) {
        let start_date = new Date(req.query.start_date);
        let end_date = req.query.end_date;
        end_date = new Date(moment(end_date).add(1, "days").format("YYYY-MM-DD"));
        where.created = { $gte: start_date, $lt: end_date };
        ///where.is_active = { $in: ['4', '5', '6'] }; 
    }
    var filtered = await orderDatalayers.gettotalDboyOrder(where);

    orderDatalayers.getOrderlistDboyId(where, params)
        .then((orders) => {
            ////console.log(total+'='+filtered);
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: {
                    totalCount: totalCount,
                    orders: orders,
                },
                total: total,
                filtered: filtered,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getOrderWithId = async (req, res) => {
    orderDatalayers
        .edit(req.params)
        .then((orders) => {
            res.json({
                success: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getOrderById = async (req, res) => {
    //save order
    orderDatalayers
        .getOrderById(mongodb.ObjectId(req.params.orderId))
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getCiTodaysOrder = async (req, res) => {
    var rDate = req.params.fromDate;
    rDate = new Date(rDate);

    var nDate = "";
    if (req.params.toDate == undefined) {
        nDate = moment(rDate).add(1, "days").format().split("T")[0];
    } else {
        nDate = moment(req.params.toDate).add(1, "days").format().split("T")[0];
    }
    var is_active = "2";
    if (req.query.is_active != undefined) {
        is_active = req.query.is_active;
    }
    nDate = new Date(nDate + "T00:00:00.000Z");
    var franchise_id = mongodb.ObjectId(req.params.franchise_id);
    var orderType = '';
    if (req.params.is_wholesaler != 0) {
        var orderType = req.params.is_wholesaler;
    }
    var orderCat = '';
    if (req.params.category_id != undefined) {
        var orderCat = mongodb.ObjectId(req.params.category_id);
    }
    orderDatalayers
        .getTodaysOrder(rDate, nDate, franchise_id, orderType, orderCat)
        .then((result) => {
            var temp = result.filter((ele) => {
                return ele.main_order[0].is_active == is_active;
            });

            if (temp.length > 0) {
                temp.forEach((ele, index) => {
                    temp[index].munit = "";
                });

                temp.forEach((ele, index) => {
                    if (ele.unit == 1 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement) *
                            1000;
                        temp[index]["unit"] = 2;
                    }

                    if (ele.unit == 2 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }

                    if (ele.unit == 3 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement) *
                            1000;
                        temp[index]["unit"] = 4;
                    }

                    if (ele.unit == 4 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }

                    if (ele.unit == 5 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }

                    if (ele.unit == 6 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }
                });

                var added = false;
                var temps = [];

                temp.forEach((ele, index) => {
                    if (temps.length > 0) {
                        added = false;
                        temps.forEach((eles, indx) => {
                            if (
                                JSON.stringify(ele.productId) ==
                                JSON.stringify(eles.productId) &&
                                ele.unit == eles.unit
                            ) {
                                temps[indx]["munit"] = ele.munit + eles.munit;
                                temps[indx]["qty"] = ele.qty + eles.qty;
                                added = true;
                            }
                        });

                        if (!added) {
                            temps.push(ele);
                        }
                    } else {
                        temps.push(ele);
                    }
                });

                temps.forEach((ele, index) => {
                    if (ele.unit == 2) {
                        temps[index].unit = 1;
                        temps[index].munit = Number(temps[index].munit) / 1000;
                    }

                    if (ele.unit == 4) {
                        temps[index].unit = 3;
                        temps[index].munit = Number(temps[index].munit) / 1000;
                    }
                });
                result = temps;
            }

            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getTodaysOrder = async (req, res) => {
    var rDate = req.params.fromDate;
    rDate = new Date(rDate);

    var nDate = "";
    if (req.params.toDate == undefined) {
        nDate = moment(rDate).add(1, "days").format().split("T")[0];
    } else {
        nDate = moment(req.params.toDate).add(1, "days").format().split("T")[0];
    }
    var is_active = "2";
    if (req.query.is_active != undefined) {
        is_active = req.query.is_active;
    }
    nDate = new Date(nDate + "T00:00:00.000Z");
    var franchise_id = '';
    var orderType = req.params.is_wholesaler;

    orderDatalayers
        .getTodaysOrder(rDate, nDate, franchise_id, orderType)
        .then((result) => {
            var temp = result.filter((ele) => {
                return ele.main_order[0].is_active == is_active;
            });

            if (temp.length > 0) {
                temp.forEach((ele, index) => {
                    temp[index].munit = "";
                });

                temp.forEach((ele, index) => {
                    if (ele.unit == 1 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement) *
                            1000;
                        temp[index]["unit"] = 2;
                    }

                    if (ele.unit == 2 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }

                    if (ele.unit == 3 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement) *
                            1000;
                        temp[index]["unit"] = 4;
                    }

                    if (ele.unit == 4 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }

                    if (ele.unit == 5 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }

                    if (ele.unit == 6 && ele.munit == "") {
                        temp[index].munit =
                            parseInt(temp[index].qty) *
                            parseInt(temp[index].measurement);
                    }
                });

                var added = false;
                var temps = [];

                temp.forEach((ele, index) => {
                    if (temps.length > 0) {
                        added = false;
                        temps.forEach((eles, indx) => {
                            if (
                                JSON.stringify(ele.productId) ==
                                JSON.stringify(eles.productId) &&
                                ele.unit == eles.unit
                            ) {
                                temps[indx]["munit"] = ele.munit + eles.munit;
                                temps[indx]["qty"] = ele.qty + eles.qty;
                                added = true;
                            }
                        });

                        if (!added) {
                            temps.push(ele);
                        }
                    } else {
                        temps.push(ele);
                    }
                });

                temps.forEach((ele, index) => {
                    if (ele.unit == 2) {
                        temps[index].unit = 1;
                        temps[index].munit = Number(temps[index].munit) / 1000;
                    }

                    if (ele.unit == 4) {
                        temps[index].unit = 3;
                        temps[index].munit = Number(temps[index].munit) / 1000;
                    }
                });
                result = temps;
            }

            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getFinalOrderList = async (req, res) => {
    orderDatalayers
        .getFinalOrderList()
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getFinalOrderListById = async (req, res) => {
    const id = mongodb.ObjectID(req.params.id);
    orderDatalayers
        .getFinalOrderListById(id)
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.savefinalOrderList = async (req, res) => {
    let data = req.body;
    let main_data = data[0];
    delete data[0];
    list_data = data.filter((ele) => {
        return ele != null;
    });

    let date_from = main_data.date_from;
    let date_to = moment(date_from).add(1, "days").format("YYYY-MM-DD");
    date_from = new Date(date_from);
    date_to = new Date(date_to);

    try {
        let oldData = await orderDatalayers.getFinalOrderListByDate(
            date_from,
            date_to
        );

        if (oldData.length > 0) {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: "List already saved.",
                error: "",
            });
            return;
        }
    } catch (err) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: "",
            error: err,
        });
    }

    orderDatalayers
        .saveFinalOrderList(main_data, list_data)
        .then((result) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: result,
            });
        })
        .catch((err) => {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.getciordersofdaterange = async (req, res) => {
    var fromDate = req.params.fromDate;
    var toDate = req.params.toDate;
    var franchise_id = '';
    if (req.params.franchise_id) {
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);
    }
    var orderDetails = {
        total_order: 0,
        total_days: 0,
        avg_order: 0,
        total_amount: 0,
        avg_amount: 0,
    };

    fromDate = new Date(fromDate);
    toDate = new Date(moment(toDate).add(1, "days").format("YYYY-MM-DD"));

    let orders = await orderDatalayers.getOrderForAvg(fromDate, toDate, franchise_id);
    if (orders.length > 0) {
        var total_days = 0;
        if (moment(req.params.fromDate).isSame(req.params.toDate)) {
            total_days = 1;
        } else {
            let fromDate = new Date(req.params.fromDate);
            let toDate = new Date(req.params.toDate);
            fromDate = moment(fromDate, "DD.MM.YYYY");
            toDate = moment(toDate, "DD.MM.YYYY");
            total_days = toDate.diff(fromDate, "days");
        }

        var total_amount = 0;
        orderDetails.total_order = orders.length;

        orders.forEach((ele) => {
            total_amount += ele.total;
        });

        orderDetails.total_amount = Number(total_amount).toFixed(2);
        orderDetails.avg_order = Number(orders.length / total_days).toFixed(0);
        orderDetails.avg_amount = Number(total_amount / total_days).toFixed(2);
        orderDetails.total_days = total_days;
    }

    res.json({
        sucess: errorsCodes.SUCEESS,
        msg: "",
        data: orderDetails,
    });
};

exports.getordersofdaterange = async (req, res) => {
    var fromDate = req.params.fromDate;
    var toDate = req.params.toDate;
    var franchise_id = '';

    var orderDetails = {
        total_order: 0,
        total_days: 0,
        avg_order: 0,
        total_amount: 0,
        avg_amount: 0,
    };

    fromDate = new Date(fromDate);
    toDate = new Date(moment(toDate).add(1, "days").format("YYYY-MM-DD"));

    let orders = await orderDatalayers.getOrderForAvg(fromDate, toDate, franchise_id);
    if (orders.length > 0) {
        var total_days = 0;
        if (moment(req.params.fromDate).isSame(req.params.toDate)) {
            total_days = 1;
        } else {
            let fromDate = new Date(req.params.fromDate);
            let toDate = new Date(req.params.toDate);
            fromDate = moment(fromDate, "DD.MM.YYYY");
            toDate = moment(toDate, "DD.MM.YYYY");
            total_days = toDate.diff(fromDate, "days");
        }

        var total_amount = 0;
        orderDetails.total_order = orders.length;

        orders.forEach((ele) => {
            total_amount += ele.total;
        });

        orderDetails.total_amount = Number(total_amount).toFixed(2);
        orderDetails.avg_order = Number(orders.length / total_days).toFixed(0);
        orderDetails.avg_amount = Number(total_amount / total_days).toFixed(2);
        orderDetails.total_days = total_days;
    }

    res.json({
        sucess: errorsCodes.SUCEESS,
        msg: "",
        data: orderDetails,
    });
};

exports.getCiTodayAndLastWeekOrders = async (req, res) => {
    try {
        let today = new Date();
        let previousDate = new Date();
        let nextDay = new Date();
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);

        var orderDetails = {
            total_order: 0,
            last_week_orders: 0,
            today_orders: 0,
        };

        today = moment(today)
            .add(5, "hours")
            .add(30, "minutes")
            .format("YYYY-MM-DD");
        today = new Date(today);

        nextDay = moment(today).add(1, "days").format("YYYY-MM-DD");
        nextDay = new Date(nextDay);

        previousDate = moment(today).subtract(7, "days").format("YYYY-MM-DD");
        previousDate = new Date(previousDate);

        var totalOrders = await orderDatalayers.getTotalOrderCount(franchise_id); // total orders
        orderDetails.total_order = totalOrders;

        var lastWeekOrders = await orderDatalayers.getTodayAndLastWeekOrders(previousDate, today, franchise_id); // last week data
        if (lastWeekOrders.length > 0) {
            orderDetails.last_week_orders = lastWeekOrders[0].orders;
        }

        var todayOrders = await orderDatalayers.getTodayAndLastWeekOrders(today, nextDay, franchise_id); // last week data
        if (todayOrders.length > 0) {
            orderDetails.today_orders = todayOrders[0].orders;
        }

        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            data: orderDetails,
        });
    } catch (e) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: e,
            data: { total_order: 0, last_week_orders: 0, today_orders: 0 },
        });
    }
};

exports.getTodayAndLastWeekOrders = async (req, res) => {
    try {
        let today = new Date();
        let previousDate = new Date();
        let nextDay = new Date();
        var franchise_id = '';

        var orderDetails = {
            total_order: 0,
            last_week_orders: 0,
            today_orders: 0,
        };

        today = moment(today)
            .add(5, "hours")
            .add(30, "minutes")
            .format("YYYY-MM-DD");
        today = new Date(today);

        nextDay = moment(today).add(1, "days").format("YYYY-MM-DD");
        nextDay = new Date(nextDay);

        previousDate = moment(today).subtract(7, "days").format("YYYY-MM-DD");
        previousDate = new Date(previousDate);

        var totalOrders = await orderDatalayers.getTotalOrderCount(franchise_id); // total orders
        orderDetails.total_order = totalOrders;

        var lastWeekOrders = await orderDatalayers.getTodayAndLastWeekOrders(previousDate, today, franchise_id); // last week data
        if (lastWeekOrders.length > 0) {
            orderDetails.last_week_orders = lastWeekOrders[0].orders;
        }

        var todayOrders = await orderDatalayers.getTodayAndLastWeekOrders(today, nextDay, franchise_id); // last week data
        if (todayOrders.length > 0) {
            orderDetails.today_orders = todayOrders[0].orders;
        }

        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            data: orderDetails,
        });
    } catch (e) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: e,
            data: { total_order: 0, last_week_orders: 0, today_orders: 0 },
        });
    }
};


exports.getsalegraphorder = async (req, res) => {
    try {
        let today = new Date();
        var orderDetails = {};
        var franchise_id = mongodb.ObjectId(req.params.franchise_id);

        prevDay = moment(today).subtract(1, "year").format("YYYY-MM-DD");
        prevDay = new Date(prevDay);
        today = moment(today).format("YYYY-MM-DD");
        today = new Date(today);

        var totalOrders = await orderDatalayers.getTotalSaleOrderCount(prevDay, today, franchise_id); // total orders

        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            data: totalOrders,
        });
    } catch (e) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: e,
            data: { total_order: 0 },
        });
    }
};

exports.uploadorderimg = async (req, res) => {
    var srcPath = __dirname + "/../public/uploads/temp/" + req.file.filename;
    var destPath =
        __dirname + "/../public/uploads/user_order/" + req.file.filename;
    fs.renameSync(srcPath, destPath);

    res.json({
        sucess: errorsCodes.SUCEESS,
        name: req.file.filename,
    });
};

exports.delorderimg = async (req, res) => {
    fs.unlink(
        __dirname + "/../public/uploads/user_order/" + req.params.filename,
        (err) => {
            if (err) {
                return;
            }
        }
    );

    res.json({
        sucess: errorsCodes.SUCEESS,
    });
};

exports.palceimgorder = async (req, res) => {
    var address = "";
    var param = req.body;
    var orderImgs = param.order_imgs;
    var useId = mongodb.ObjectId(param.userId);
    await addressDatalayers
        .getDefaultAddressOfUser(useId)
        .then((data) => {
            if (data[0]["address1"] == undefined) {
                res.json({
                    sucess: "404",
                    msg: "Delivery address not found",
                    tracking_id: order.orderUserId,
                });
                return;
            } else {
                address =
                    data[0]["address1"] +
                    " " +
                    data[0]["address2"] +
                    ", " +
                    //data[0]["subarea"][0]["title"]+" "+
                    data[0]["area"][0]["title"] +
                    " " +
                    data[0]["city"][0]["title"] +
                    ", " +
                    data[0]["state"][0]["title"] +
                    " " +
                    data[0]["country"][0]["title"] +
                    ", " +
                    "pincode - " +
                    data[0]["pincode"];
            }
        })
        .catch((error) => {
            console.log(error);
        });

    var orderData = {
        discount: 0,
        discount_rupee: 0,
        promo_code: 0,
        promo_discount: 0,
        delivery_date: moment(Date.now()).add(1, "days").format().split("T")[0],
        delivery_day: 2,
        delivered_date: moment(Date.now())
            .add(1, "days")
            .format()
            .split("T")[0],
        version_code: 9,
        tax_percent: 0,
        tax_amount: 0,
        total: 0,
        final_total: 0,
        is_active: 1,
        phone_no: param.phone_no,
        delivery_charge: 0,
        delivery_time_id: 1,
        delivery_time: "10:00 AM - 12:00 PM",
        key_wallet_used: false,
        key_wallet_balance: 0,
        remaining_wallet_balance: 0, //*********************** */
        payment_method: 1,
        latititude: "0.00",
        longitude: "0.00",
        createdby: param.userId,
        modifiedby: param.userId,
        userId: param.userId,
        franchiseId: null,
        orderUserId: Date.now(),
        delivery_address: address,
        order_type: param.order_type,
        order_desc: param.decsription,
    };

    orderDatalayers
        .saveImgOrder(orderData)
        .then((order) => {
            var ordId = order._id;
            var orderVariants = [];
            var ordImg = orderImgs.split(",");

            ordImg.forEach((ele) => {
                if (ele != "") {
                    orderVariants.push({
                        productId: null,
                        order_status: 1,
                        createdby: param.userId,
                        modifiedby: param.userId,
                        frproductvarId: null,
                        franchiseId: null,
                        price: 0,
                        frproductId: null,
                        qty: 0,
                        image_url: ele,
                        measurement: 0,
                        unit: 0,
                        title: null,
                        orderId: ordId,
                    });
                }
            });

            orderVariantDatalayers
                .save(orderVariants)
                .then((orderVar) => {
                    notify.notify(
                        [mongodb.ObjectId(param.userId)],
                        "Order Recieved",
                        `Your order is placed successfully. Your order id is: ${order.orderUserId}.`
                    );
                })
                .catch((error) => {
                    console.log(error);
                });

            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "Order placed successfully",
                tracking_id: order.orderUserId,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.trackMyOrder = async (req, res) => {
    //save order
    orderDatalayers.trackMyOrder(mongodb.ObjectId(req.params.orderId))
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};


exports.updateOrderRevised = async (req, res) => {
    orderDatalayers
        .updateOrderRevised(req.body)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.updateorderdeliveryaddress = async (req, res) => {
    orderDatalayers
        .updateorderdeliveryaddress(req.body)
        .then((orders) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: orders,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                msg: "",
                error: err,
            });
        });
};

exports.saveRevisedOrder = async (req, res) => {
    let user = req.user;
    if (user.role_type != "7") {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Something Went Wrong"
        });
        return;
    }

    try {
        let param = req.body;
        ////console.log(param);
        if (req.body.body_param) {
            param = JSON.parse(req.body.body_param);
        }

        let dboy = param.pop(); //final_
        var order_data = await orderDatalayers.trackMyOrder(mongodb.ObjectId(dboy.order_id));

        if (order_data[0].order.is_active != '2') {
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: "Order can be revised when order is processed"
            });
            return;
        }

        let res_data = [];
        let opm_total = 0;
        let units = await settingsDatalayers.getUnits();
        let used_wallet = 0;
        if (order_data[0].order.key_wallet_used == true && order_data[0].order.key_wallet_balance > 0) {
            used_wallet = Number(order_data[0].order.key_wallet_balance);
        }
        let promodiscount = 0;
        if (order_data[0].order.promo_discount > 0) {
            promodiscount = Number(order_data[0].order.promo_discount);
        }

        let temp = [];
        units.forEach((ele, index) => {
            temp[ele.id] = ele.title;
        });
        units = temp;

        temp = [];

        for (let i = 0; i < param.length; i++) {
            if (param[i].revised_status == 1) {
                opm_total += parseInt(param[i].revised_price);
            }
            temp = await orderDatalayers.saveRevisedOrder(param[i]);
            temp = param[i];
            res_data.push(temp);
        }
        if (order_data[0].order.payment_method != 3) {
            opm_total = opm_total - (used_wallet + promodiscount);
        } else {
            opm_total = opm_total - promodiscount;
        }

        let updateParam = {
            opm_id: user._id,
            opm_total: opm_total,
            delivery_total: opm_total,
            ///received_total: opm_total,
            _id: mongodb.ObjectId(dboy.order_id),
            delivery_boy_id: mongodb.ObjectId(dboy.delivery_boy_id)
        };
        temp = [];
        temp = await orderDatalayers.update(updateParam);
        if (temp) {
            res_data.push({ delivery_boy_id: mongodb.ObjectId(dboy.delivery_boy_id) });
        }

        let user_data = await userDatalayers.findbyField({ _id: order_data[0].order.userId });
        update_order_status({
            is_active: "3",
            _id: dboy.order_id,
            user_id: user_data[0]._id,
            uname: user_data[0].fname + " " + user_data[0].lname,
            orderUserId: order_data[0].order.orderUserId
        });

        order_data = await orderDatalayers.trackMyOrder(mongodb.ObjectId(dboy.order_id));

        let mTitle = "Your order items to be delivered";
        let order_variant = order_data[0].order_variants;

        let mBody = "";
        order_variant.forEach((ele, index) => {
            if (ele.revised_status == 1) {
                if (ele.price == ele.revised_price) {
                    mBody += (index + 1) + ". " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
                } else {
                    mBody += (index + 1) + ". [Revised] " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
                }
            } else {
                mBody += (index + 1) + ". [Not Available] " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
            }
        });
        mBody += `Final Total : ${opm_total.toFixed(2)}\n`;
        notify.notify([user_data[0]._id], mTitle, mBody);

        res.json({
            sucess: errorsCodes.SUCCESS,
            msg: "",
            data: res_data
        });
    } catch (err) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: "",
            error: err
        });
    }
}

exports.saveReturnedProduct = async (req, res) => {
    let user = req.user;
    try {
        if (user.role_type != "5" || user.franchise_id == null) {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something Went Wrong"
            });
            return;
        }

        let temp = [];
        let res_data = [];
        let delivery_total = 0;
        let order_id = mongodb.ObjectId(req.body.order_id);
        let param = { _id: mongodb.ObjectId(req.body._id), revised_status: req.body.revised_status };

        let order = await orderDatalayers.trackMyOrder(order_id);
        if (order[0].order.is_active != "3") {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Product(s) will be return only in shipped stage."
            });
            return;
        }
        let updates = await orderDatalayers.saveRevisedOrder(param);

        let used_wallet = 0;
        let promo_discount = 0;

        if (order[0].order.key_wallet_used == true && order[0].order.key_wallet_balance > 0) {
            used_wallet = Number(order[0].order.key_wallet_balance);
        }
        if (order[0].order.promo_discount > 0) {
            promo_discount = Number(order[0].order.promo_discount);
        }

        if (updates) {
            order[0].order_variants.forEach((ele, index) => {
                if (ele._id == req.body._id) {
                    order[0].order_variants[index].revised_status = req.body.revised_status;
                }
            })
        }

        let units = await settingsDatalayers.getUnits();
        units.forEach((ele) => {
            temp[ele.id] = ele.title;
        });
        units = temp;
        let order_variant = order[0].order_variants;
        // revised delivery_total amt
        order_variant.forEach((ele) => {
            if (ele.revised_status == 1) {
                delivery_total += ele.revised_price;
            }
        });
        // Wallet Amount used algo
        if (order[0].order.payment_method != 3) {
            delivery_total = delivery_total - (used_wallet + promo_discount);
        } else {
            delivery_total = delivery_total - promo_discount;
        }
        /*if(delivery_total<= 0){
            delivery_total = 0;
        }*/
        let updateParam = {
            _id: order_id,
            delivery_total: delivery_total,
            ///received_total: delivery_total
        };
        ////console.log(updateParam);
        temp = await orderDatalayers.update(updateParam);
        if (temp) {
            res_data.push({ order_id, delivery_total });
        }

        res.json({
            sucess: errorsCodes.SUCCESS,
            msg: "Order status change successfully",
            data: res_data
        });

    } catch (err) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: "Something went wrong!!",
            error: err
        });
    }
}

exports.saveOrderDelivered = async (req, res) => {
    let user = req.user;
    try {
        let order_id = mongodb.ObjectId(req.body.order_id);
        let order = await orderDatalayers.trackMyOrder(order_id);

        let user_id = mongodb.ObjectId(order[0].order.userId);
        let user_data = await userDatalayers.findbyField({ _id: user_id });
        let wallet_amt = user_data[0].wallet_balance;

        if (user.role_type != "5" || String(user.franchise_id) != String(order[0].order.franchiseId) || order[0].order.is_active != "3") {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something Went Wrong"
            });
            return;
        }

        let temp = [];
        let received_total = Math.abs(req.body.received_total);
        var tobe_received_total = order[0].order.delivery_total;
        var finaltotal = order[0].order.final_total;
        if (order[0].order.key_wallet_used) {
            var walletUsed = order[0].order.key_wallet_balance;
        } else {
            var walletUsed = 0;
        }

        switch (parseInt(order[0].order.payment_method)) {
            case 1:
                {
                    //Only COD OR COD + wallet
                    tobe_received_total = order[0].order.delivery_total;
                    break;
                }
            case 2:
                {
                    //Only Razorpay OR Razorpay + wallet
                    tobe_received_total = order[0].order.delivery_total - order[0].order.final_total;
                    break;
                }
            case 3:
                {
                    //Only wallet
                    tobe_received_total = order[0].order.delivery_total - order[0].order.key_wallet_balance;
                    break;
                }
            case 4:
                {
                    //Only Paytm OR Paytm + wallet
                    tobe_received_total = order[0].order.delivery_total - order[0].order.final_total;
                    break;
                }
            default:
                {
                    tobe_received_total = order[0].order.delivery_total;
                    break;
                }
        }

        var newfinaltotal = 0;
        let order_variant = order[0].order_variants;
        order_variant.forEach((ele, index) => {
            if (ele.revised_status == 1) {
                newfinaltotal += ele.revised_price;
            }
        });
        ////console.log(received_total);
        let updateParam = {
            _id: mongodb.ObjectId(req.body.order_id),
            received_total: parseFloat(received_total)
        };
        let updates = await orderDatalayers.update(updateParam);
        //// Update wallet data
        if (updates) {
            /*  if(tobe_received_total==0){
                    var diffprice = walletUsed-newfinaltotal;
                    ///console.log("diffprice:"+diffprice);
                    if(diffprice>0){
                        await updateWalletBalanceIncrease(user_id, diffprice);
                        await referEarnWalletLog(
                            user_id,
                            diffprice,
                            `Rs. ${diffprice.toFixed(2)} is added to wallet in respect of received amount in order no. ${order[0].order.orderUserId}`,
                            "1","0"
                        );
                        // send notification to user wallet add
                        notify.notify(
                            [user_id],
                            "Wallet Updates",
                            `Rs. ${diffprice.toFixed(2)} is added to wallet in respect of received amount in order no. ${order[0].order.orderUserId}`
                        );
                    }
                }             
                // update price if received_total && tobe_received_total
                if (parseInt(received_total) != parseInt(tobe_received_total)) {
                    if (tobe_received_total > received_total) {
                        //less from wallet
                        let amountToUpdate = tobe_received_total - received_total;
                        await updateWalletBalanceDecrease(user_id, amountToUpdate);
                        referEarnWalletLog(
                            user_id,
                            amountToUpdate,
                            `Rs. ${amountToUpdate.toFixed(2)} is deducted from wallet in respect of received amount in order no. ${order[0].order.orderUserId}`,
                            "2","0"
                        );
                         // send notification to user wallet less
                        notify.notify(
                            [user_id],
                            "Wallet Updates",
                            `Rs. ${amountToUpdate.toFixed(2)} is deducted from wallet in respect of received amount in order no. ${order[0].order.orderUserId}`
                        );
                    } else {
                        //add to wallet
                        let amountToUpdate = received_total - tobe_received_total;
                        await updateWalletBalanceIncrease(user_id, amountToUpdate);
                        await referEarnWalletLog(
                            user_id,
                            amountToUpdate,
                            `Rs. ${amountToUpdate.toFixed(2)} is added to wallet in respect of received amount in order no. ${order[0].order.orderUserId}`,
                            "1","0"
                        );
                        // send notification to user wallet add
                        notify.notify(
                            [user_id],
                            "Wallet Updates",
                            `Rs. ${amountToUpdate.toFixed(2)} is added to wallet in respect of received amount in order no. ${order[0].order.orderUserId}`
                        );
                    }
                }
                ///update delivery boy delivery status
                if(received_total>0){ 
                    userId = order[0].order.delivery_boy_id; 
                    userDatalayers.updateOrderDeliveryStatus(userId, { "delivery_detail.recieved": parseFloat(received_total) });
                }*/

            let units = await settingsDatalayers.getUnits();
            units.forEach((ele) => {
                temp[ele.id] = ele.title;
            });
            units = temp;
            let order_variant = order[0].order_variants;

            let mBody = "";
            let mTitle = "Delivered order is as below:";

            order_variant.forEach((ele, index) => {
                switch (ele.revised_status) {
                    case 0:
                        mBody += (index + 1) + ". [Not Available] " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
                        break;
                    case 2:
                        mBody += (index + 1) + ". [Returned] " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
                        break;
                    default:
                        if (ele.price == ele.revised_price) {
                            mBody += (index + 1) + ". " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
                        } else {
                            mBody += (index + 1) + ". [Revised] " + ele.title + " (" + ele.revised_qty + " x " + ele.revised_measurement + " " + units[ele.revised_unit] + ")\n";
                        }
                        break;
                }
            });
            mBody += "Received Amount is : " + received_total.toFixed(2) + "\n";
            notify.notify([user_data[0]._id], mTitle, mBody);
        }

        /// update lucky Draw offer **start**
        let orderprolist = await orderDatalayers.updateluckydraw_onOrderDetail({
            orderId: order_id
        });
        let orderProduct = [];
        orderprolist.forEach((ele, index) => {
            orderProduct.push(ele.productId);
        });
        let today = new Date();
        today = moment(today)
            .add(5, "hours")
            .add(30, "minutes")
            .format("YYYY-MM-DD");
        today = new Date(today);

        let luckydrawlist = await luckydrawDatalayers.gettodayLuckyDraw({
            franchise_id: order[0].order.franchiseId,
            start_date: { $lte: today },
            expiry_date: { $gte: today },
            is_active: "1",
            product_id: { $in: orderProduct }
        });

        luckydrawlist.forEach((ele, index) => {
            var couCode = couponCode(8);
            var paramData = {
                luckydraw_id: mongodb.ObjectId(ele._id),
                user_id: mongodb.ObjectId(user_id),
                order_id: mongodb.ObjectId(order_id),
                product_id: mongodb.ObjectId(ele.product_id),
                coupon: couCode
            };
            luckydrawDatalayers.addLuckyDrawUser(paramData);
            //// Send Push notification for couponCode
            notify.notify(
                [user_id],
                "Lucky Draw Coupon",
                `Congurational, you get coupon code "${couCode}" on order having ID: "${order[0].order.orderUserId}"`
            );
        });
        /// update lucky Draw offer **end**

        res.json({
            sucess: errorsCodes.SUCCESS,
            msg: "Order delivered successfully"
        });
    } catch (err) {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: "",
            error: err
        });
    }
}

function OrderParam(param) {
    var OrderTableValue = {};
    OrderTableValue.total = param.total;
    OrderTableValue.userId = param.userId;
    OrderTableValue.discount = param.discount;
    OrderTableValue.phone_no = param.phone_no;
    OrderTableValue.latitude = param.latitude;
    OrderTableValue.longitude = param.longitude;
    OrderTableValue.ordered_by = param.ordered_by;
    OrderTableValue.is_wholesaler = param.is_wholesaler;
    OrderTableValue.tax_amount = param.tax_amount;
    OrderTableValue.promo_code = param.promo_code;
    OrderTableValue.franchiseId = param.franchiseId;
    OrderTableValue.orderUserId = param.orderUserId;
    OrderTableValue.tax_percent = param.tax_percent;
    OrderTableValue.final_total = param.final_total;

    OrderTableValue.opm_id = null;
    OrderTableValue.opm_total = (param.payment_method == 3) ? param.total : param.final_total;
    OrderTableValue.delivery_total = (param.payment_method == 3) ? param.total : param.final_total;
    OrderTableValue.received_total = 0; //(param.payment_method == 3) ? param.total : param.final_total;

    OrderTableValue.os_devid_vc = (param.os_devid_vc) ? param.os_devid_vc : "";
    OrderTableValue.delivery_day = param.delivery_day;
    OrderTableValue.version_code = param.version_code;
    OrderTableValue.paytm_status = param.paytm_status;
    OrderTableValue.delivery_date = param.delivery_date;
    OrderTableValue.delivered_date = param.delivered_date;
    OrderTableValue.discount_rupee = param.discount_rupee;
    OrderTableValue.promo_discount = param.promo_discount;
    OrderTableValue.payment_method = param.payment_method;
    OrderTableValue.payment_status = param.payment_status;
    OrderTableValue.delivery_charge = param.delivery_charge;
    OrderTableValue.key_wallet_used = param.key_wallet_used;
    OrderTableValue.delivery_address = param.delivery_address;
    OrderTableValue.paytm_payment_id = param.paytm_payment_id;
    OrderTableValue.razorpay_payment_id = (param.razorpay_payment_id) ? param.razorpay_payment_id : "";
    OrderTableValue.razorpay_order_id = (param.razorpay_order_id) ? param.razorpay_order_id : "";
    OrderTableValue.remaining_wallet_balance = param.remaining_wallet_balance;
    OrderTableValue.cancelled_id = (param.cancelled_id) ? param.cancelled_id : null;
    OrderTableValue.review = { product_rate: 0, dboy_rate: 0, comment: "", why_low_rate: "" };
    OrderTableValue.delivery_time_id = (param.delivery_time_id != '') ? param.delivery_time_id : 0;
    OrderTableValue.delivery_time = (param.delivery_time != '') ? param.delivery_time : 'Any Time';
    OrderTableValue.key_wallet_balance = param.key_wallet_used != 0 ? param.key_wallet_balance : 0;
    OrderTableValue.delivery_address_id = (param.delivery_address_id && param.delivery_address_id != '') ? param.delivery_address_id : '';
    OrderTableValue.delivery_solt_id = (param.delivery_solt_id != '') ? param.delivery_solt_id : null;
    return OrderTableValue;
}


exports.chkOrderstatus = async (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        var param = req.body.order_param;
        var uname = req.user.fname + " " + req.user.lname;
        var createdDate = moment(new Date()).add(5, "hours").add(30, "minutes");
        var is_wholesaler = (param.is_wholesaler) ? param.is_wholesaler : 0;
        var totalAmt = 0;
        var discountAmt = 0;
        var cartQty = 0;
        const mainArr = [];

        param.orderUserId = Date.now();
        let walletValue = await walletBalance(param.userId);
        var previousBalance = walletValue;
        const getsetting = await settingsDatalayers.getSettings();

        var where = {
            "$or": [{
                "session_id": param.session_id
            }, {
                "userId": mongodb.ObjectID(param.userId)
            }]
        }
        const isCarthas = await cartDatalayers.getUserCartdata(where);

        if (isCarthas[0]) {
            if (walletValue <= 0) {
                walletValue = 0;
                param.key_wallet_used = 0;
            }
            if (walletValue > 0 && param.key_wallet_used != 0) {
                walletValue = Number(walletValue) - Number(param.key_wallet_balance);
            }
            walletValue = Number(walletValue).toFixed(2);
            param.remaining_wallet_balance = walletValue;
            var notifyToUser = [];
            notifyToUser.push(param.userId); //send user id in array...

            if (walletValue >= 0) {
                var orderParam = OrderParam(param);
                var delivery_date = orderParam.delivery_date;
                orderParam.created = createdDate;
                orderParam.modified = createdDate;

                let isCarttotal = await cartDatalayers.getCarttotal(where);
                orderParam.promo_discount = isCarttotal.promo_disc;
                orderParam.discount = isCarttotal.disc;
                orderParam.delivery_charge = isCarttotal.delivery_charge;
                orderParam.total = isCarttotal.total;
                orderParam.final_total = isCarttotal.final_total;
                orderParam.tax_amount = 0;
                orderParam.tax_percent = 0;
                orderParam.is_wholesaler = is_wholesaler;
                orderParam.opm_total = (param.payment_method == 3) ? isCarttotal.total : isCarttotal.final_total;
                orderParam.delivery_total = (param.payment_method == 3) ? isCarttotal.total : isCarttotal.final_total;
                res.json({
                    sucess: errorsCodes.SUCCESS,
                    msg: "Allow order place"
                });

            } else {
                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    err: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Wallet Balance Low",
                    error: "Wallet Balance Low",
                });
            }
        } else {
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Cart is empty!!",
                data: []
            })
        }
    } else {
        return res.json({
            sucess: errorsCodes.BAD_REQUEST,
            err: errorsCodes.BAD_REQUEST,
            msg: errors,
        });
    }
};


exports.confirmOrder = async (req, res) => {
    const errors = validationResult(req);
    try{
        if (errors.isEmpty()) {
            var param = req.body.order_param;
            var uname = req.user.fname + " " + req.user.lname;
            var createdDate = moment(new Date()).add(5, "hours").add(30, "minutes");
            var is_wholesaler = (param.is_wholesaler) ? param.is_wholesaler : 0;
            var totalAmt = 0;
            var discountAmt = 0;
            var cartQty = 0;
            const mainArr = [];
    
            param.orderUserId = Date.now();
            let walletValue = await walletBalance(param.userId);
            var previousBalance = walletValue;
            const getsetting = await settingsDatalayers.getSettings();
    
            var where = {
                "$or": [{
                    "session_id": param.session_id
                }, {
                    "userId": mongodb.ObjectID(param.userId)
                }]
            }
            const isCarthas = await cartDatalayers.getUserCartdata(where);
    
            if (isCarthas[0]) {
                if (walletValue <= 0) {
                    walletValue = 0;
                    param.key_wallet_used = 0;
                }
                if (walletValue > 0 && param.key_wallet_used != 0) {
                    walletValue = Number(walletValue) - Number(param.key_wallet_balance);
                }
                walletValue = Number(walletValue).toFixed(2);
                param.remaining_wallet_balance = walletValue;
                var notifyToUser = [];
                notifyToUser.push(param.userId); //send user id in array...
    
                if (walletValue >= 0) {
                    var orderParam = OrderParam(param);
                    var delivery_date = orderParam.delivery_date;
                    orderParam.created = createdDate;
                    orderParam.modified = createdDate;
    
                    //----555
                    var delivery_address = await addressDatalayers.getDefaultAddressOfUser(mongodb.ObjectId(param.userId));
                    if (delivery_address.length === 0) {
                        return res.status(404).json({ sucess:  errorsCodes.RESOURCE_NOT_FOUND, msg: "Delivery address not found",data: [] });
                    }
                    
                    orderParam.delivery_address_id = delivery_address[0]._id;
                    orderParam.order_address = {}
                    orderParam.order_address.street = delivery_address[0].address1 + ", " + delivery_address[0].address2;
                    orderParam.order_address.pincode = delivery_address[0].pincode;
                    orderParam.order_address.city = delivery_address[0].city[0].title;
                    orderParam.order_address.state = delivery_address[0].state[0].title;
                    orderParam.order_address.country = delivery_address[0].country[0].title;
                    orderParam.order_address.area = delivery_address[0].area[0].title;
    
                    let isCarttotal = await cartDatalayers.getCarttotal(where);
                    orderParam.promo_discount = isCarttotal.promo_disc;
                    orderParam.discount = isCarttotal.disc;
                    orderParam.delivery_charge = isCarttotal.delivery_charge;
                    orderParam.total = isCarttotal.total;
                    orderParam.final_total = isCarttotal.final_total;
                    orderParam.tax_amount = 0;
                    orderParam.tax_percent = 0;
                    orderParam.is_wholesaler = is_wholesaler;
                    orderParam.opm_total = (param.payment_method == 3) ? isCarttotal.total : isCarttotal.final_total;
                    orderParam.delivery_total = (param.payment_method == 3) ? isCarttotal.total : isCarttotal.final_total;
    
                    if (orderParam.delivery_address_id == '') {
                        var delivery_address = await addressDatalayers.getDefaultAddressOfUser(mongodb.ObjectId(param.userId));
                        orderParam.delivery_address_id = delivery_address[0]._id;
                        orderParam.delivery_address = "Address:" + delivery_address[0].address1 + " " + delivery_address[0].address2 + " pincode: " + delivery_address[0].pincode + "\nState: " + delivery_address[0].state[0].title + "\nCity: " + delivery_address[0].city[0].title + "\nArea: " + delivery_address[0].area[0].title + "\nMobile: " + delivery_address[0].phone_no + "\nDeliver to : " + uname + "";
                        orderParam.phone_no = delivery_address[0].phone_no;
                    } else {
                        var delivery_address = await addressDatalayers.getDetailedAddress(mongodb.ObjectId(param.delivery_address_id));
                        orderParam.delivery_address_id = delivery_address[0]._id;
                        orderParam.delivery_address = "Address:" + delivery_address[0].address1 + " " + delivery_address[0].address2 + " pincode: " + delivery_address[0].pincode + "\nState: " + delivery_address[0].state[0].title + "\nCity: " + delivery_address[0].city[0].title + "\nArea: " + delivery_address[0].area[0].title + "\nMobile: " + delivery_address[0].phone_no + "\nDeliver to : " + uname + "";
                        orderParam.phone_no = delivery_address[0].phone_no;
                    }
    
    
                    orderDatalayers.save(orderParam)
                        .then(async (order) => {
    
                            /// get cart item value
                            var where = {
                                "$or": [{
                                    "session_id": param.session_id
                                }, {
                                    "userId": mongodb.ObjectID(param.userId)
                                }]
                            }
                            let cart_item = [];
                            let cartData = [];
    
                            cartData = await productsDatalayers.getCartDetailsByVarientId(where);
                            let cart_total = [];
                            // old oode
                            cartData.forEach(ele => {
                                let wholesale = ele.productvar[0].wholesale || 0;
    
                                let totalprice = ele.productvar[0].price * ele.qty;
                                let totalwholesale_price = wholesale * ele.qty;
                                if (is_wholesaler == '1') {
                                    var pvarprice = ele.productvar[0].wholesale;
                                    var discAmt = 0;
                                } else {
                                    var pvarprice = ele.productvar[0].price;
                                    var discAmt = ((ele.productvar[0].disc_price / 100)) * (pvarprice * (ele.qty));
                                }
                                cart_item.push({
                                    productId: ele.productvar[0].frProducts[0].productId,
                                    frproductvarId: ele.frproductvarId,
                                    franchiseId: ele.productvar[0].franchiseId,
                                    frproductId: ele.frproductId,
                                    qty: ele.qty,
                                    price: pvarprice,
                                    image_url: ele.productvar[0].frProducts[0].products[0].productimage[0].title,
                                    measurement: ele.productvar[0].measurment,
                                    unit: ele.productvar[0].unit,
                                    title: ele.productvar[0].frProducts[0].products[0].title,
                                    wholesale_price: wholesale,
                                    wholesale_discount: (totalprice - totalwholesale_price)
                                });
                            });
    
    
                            // new code 13-11-24
                            // cartData.forEach(ele => {
    
                            //     let totalprice = varient[0].price * ele.qty;
                            //     let totalwholesale_price = ele.productvar[0].wholesale * ele.qty;
                            //     cart_item.push({
                            //         productId: ele.productvar[0].frProducts[0].productId,
                            //         frproductvarId: ele.frproductvarId,
                            //         franchiseId: ele.productvar[0].franchiseId,
                            //         frproductId: ele.frproductId,
                            //         qty: ele.qty,
                            //         price: ele.productvar[0].price,
                            //         wholesale_price: ele.productvar[0].wholesale,
                            //         wholesale_discount : (totalprice - totalwholesale_price),
                            //         image_url: ele.productvar[0].frProducts[0].products[0].productimage[0].title,
                            //         measurement: ele.productvar[0].measurment,
                            //         unit: ele.productvar[0].unit,
                            //         title: ele.productvar[0].frProducts[0].products[0].title
                            //     });
                            // });
    
                            couponDatalayer.updateUsesCount(orderParam.promo_code, 1);
                            userDatalayers.updateLastOrderDateAndOrderStatus(param.userId, { last_order_date: moment(new Date()).format('YYYY-MM-DD') }, { "order_status.recieved": 1 });
    
                            var orderId = order._id;
                            var orders = cart_item;
                            var productVariantId = [];
    
                            // console.log("cart_item::");console.log(cart_item);
                            orders.forEach((elem, i) => {
                                orders[i].image_url = ImageName(elem.image_url);
                                orders[i].orderId = orderId;
                                orders[i].order_status = "1";
                                orders[i].delivery_date = delivery_date;
                                orders[i].created = createdDate;
                                orders[i].modified = createdDate;
    
                                orders[i].revised_unit = orders[i].unit
                                orders[i].revised_measurement = orders[i].measurement
                                orders[i].revised_qty = orders[i].qty
                                orders[i].revised_price = (orders[i].price * orders[i].qty)
                                orders[i].revised_status = 1
                                productVariantId.push(mongodb.ObjectId(elem.frproductvarId));
                            });
                            /// console.log("orders:"); console.log(orders);
    
                            orderVariantDatalayers.save(orders)
                                .then(async (data) => {
                                    if (param.key_wallet_used != 0) {
                                        userDatalayers.updateWallet({ _id: param.userId, wallet_balance: walletValue });
                                        //updateWalletBalance(updateUser);
                                    }
    
                                    var x = updateQuantity(productVariantId, orders);
                                    x.then(async (condition) => {
                                        console.log(condition);
                                        if (condition) {
                                            if (param.key_wallet_used != 0) {
                                                orderUserId = param.orderUserId;
                                                referEarnWalletLog(
                                                    param.userId,
                                                    param.key_wallet_balance,
                                                    "Amount deducted from wallet due to wallet uses in the order. Your order id is:[" + orderUserId + "]",
                                                    "2", "0"
                                                );
                                            }
    
                                            notify.notify(
                                                notifyToUser,
                                                "Order Recieved",
                                                `Dear ${uname}, Your order is placed successfully. Your order id is: ${param.orderUserId}.`
                                            );
                                            // delete cart value
                                            if (param.session_id) {
                                                var cartwhere = { session_id: param.session_id };
                                                await cartDatalayers.deleteCart(cartwhere);
                                            }
                                            res.json({
                                                sucess: errorsCodes.SUCEESS,
                                                msg: "Order placed successfully.",
                                                tracking_id: param.orderUserId,
                                                order_id: orderId,
                                                updated_wallet_balance: walletValue,
                                                previous_balance: previousBalance,
                                            });
                                        } else {
                                            res.json({
                                                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                                err: errorsCodes.RESOURCE_NOT_FOUND,
                                                msg: "FR Product Variant not updated ",
                                                tracking_id: param.orderUserId,
                                                order_id: orderId,
                                                updated_wallet_balance: walletValue,
                                            });
                                        }
                                    }).catch((err) => {
                                        res.json({
                                            sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                            err: errorsCodes.RESOURCE_NOT_FOUND,
                                            msg: "Something Went Wrong",
                                            error: err,
                                        });
                                    });
                                })
                                .catch((err) => {
                                    res.json({
                                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                        err: errorsCodes.RESOURCE_NOT_FOUND,
                                        msg: "",
                                        error: err,
                                    });
                                });
                        })
                        .catch((err) => {
                            res.json({
                                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                err: errorsCodes.RESOURCE_NOT_FOUND,
                                msg: "Something went wrong, Unable to save order",
                                error: "Something went wrong, Unable to save order",
                                errMsg: err,
                                orderParam
                            });
                        });
                } else {
                    res.json({
                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Wallet Balance Low",
                        error: "Wallet Balance Low",
                    });
                }
            } else {
                return res.json({
                    status: errorsCodes.RESOURCE_NOT_FOUND,
                    message: "Cart is empty!!",
                    data: []
                })
            }
        } else {
            return  res.json({
                sucess: errorsCodes.BAD_REQUEST,
                err: errorsCodes.BAD_REQUEST,
                msg: errors,
            });
        }
    }catch(e){
        return res.status(400).json({
            sucess: false,   // Fix the spelling mistake
            error: errorsCodes.BAD_REQUEST,
            msg: e.message || 'An unexpected error occurred' // Use a fallback message
        });
    }
    
};


exports.placeOrderNew = async (req, res) => {
    //userDatalayers    delivery_address_id
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        var param = req.body.order_param;

        var uname = req.user.fname + " " + req.user.lname;
        var createdDate = moment(new Date()).add(5, "hours").add(30, "minutes");

        param.orderUserId = Date.now();
        let walletValue = await walletBalance(param.userId);
        var previousBalance = walletValue;

        if (walletValue <= 0) {
            walletValue = 0;
            param.key_wallet_used = 0;
        }

        if (walletValue > 0 && param.key_wallet_used != 0) {
            walletValue = Number(walletValue) - Number(param.key_wallet_balance);
        }

        walletValue = Number(walletValue).toFixed(2);
        param.remaining_wallet_balance = walletValue;

        var notifyToUser = [];
        notifyToUser.push(param.userId); //send user id in array...

        if (walletValue >= 0) {
            var orderParam = OrderParam(param);
            var delivery_date = orderParam.delivery_date;
            orderParam.created = createdDate;
            orderParam.modified = createdDate;
            // let delivery_address = []
            let delivery_address = await addressDatalayers.getDefaultAddressOfUser(mongodb.ObjectId(param.userId));
            if (delivery_address.length === 0) {
                return res.json({
                    sucess: errorsCodes.BAD_REQUEST,
                    err: errorsCodes.BAD_REQUEST,
                    msg: "Address not found!",
                    error: "Address not found!",

                });
            }
            orderParam.delivery_address_id = delivery_address[0]._id;
            orderParam.order_address = {}
            orderParam.order_address.street = delivery_address[0].address1 + ", " + delivery_address[0].address2;
            orderParam.order_address.pincode = delivery_address[0].pincode;
            orderParam.order_address.city = delivery_address[0].city[0].title;
            orderParam.order_address.state = delivery_address[0].state[0].title;
            orderParam.order_address.country = delivery_address[0].country[0].title;
            orderParam.order_address.area = delivery_address[0].area[0].title;

            if (param.payment_method == "2" || param.payment_method == "4") {
                orderParam.payment_status = 1;
            }

            orderDatalayers.save(orderParam)
                .then(async (order) => {
                    couponDatalayer.updateUsesCount(orderParam.promo_code, 1);
                    userDatalayers.updateLastOrderDateAndOrderStatus(param.userId, { last_order_date: moment(new Date()).format('YYYY-MM-DD') }, { "order_status.recieved": 1 });

                    var orderId = order._id;
                    var orders = param.order_val;
                    // var productVariantId = [];
                    // await processOrderProduct(order, orders,delivery_date);
                    // orders.forEach(async(elem, i) => {
                    //     let varient = await productsDatalayers.getProductsVarientById(mongodb.ObjectId(elem.frproductvarId)) 
                    //     let wholesale =varient[0].wholesale||0
                    //     console.log(varient[0])
                    //     orders[i].image_url = ImageName(elem.image_url);
                    //     orders[i].orderId = orderId;


                    //     orders[i].order_status = "1";
                    //     orders[i].delivery_date = delivery_date;
                    //     orders[i].created = createdDate;
                    //     orders[i].modified = createdDate;

                    //     orders[i].revised_unit = orders[i].unit
                    //     orders[i].revised_measurement = orders[i].measurement
                    //     orders[i].revised_qty = orders[i].qty
                    //     orders[i].revised_price = (orders[i].price*orders[i].qty)
                    //     orders[i].revised_status = 1
                    //     orders[i].wholesale_price = wholesale
                    //     orders[i].wholesale_discount = (varient[0].price - wholesale) 
                    //     console.log(orders)
                    //     productVariantId.push(mongodb.ObjectId(elem.frproductvarId));
                    // });

                    await processOrderProduct(order, orders, delivery_date)
                        .then((productVariantId) => {

                            if (param.key_wallet_used != 0) {
                                userDatalayers.updateWallet({ _id: param.userId, wallet_balance: walletValue });
                            }

                            var x = updateQuantity(productVariantId, orders);
                            x.then((condition) => {
                                if (condition) {
                                    if (param.key_wallet_used != 0) {
                                        orderUserId = param.orderUserId;
                                        referEarnWalletLog(
                                            param.userId,
                                            param.key_wallet_balance,
                                            "Amount deducted from wallet due to wallet uses in the order. Your order id is:[" + orderUserId + "]",
                                            "2", "0"
                                        );
                                    }

                                    notify.notify(
                                        notifyToUser,
                                        "Order Recieved",
                                        `Dear ${uname}, Your order is placed successfully. Your order id is: ${param.orderUserId}.`
                                    );

                                    res.json({
                                        sucess: errorsCodes.SUCEESS,
                                        msg: "Order placed successfully.",
                                        tracking_id: param.orderUserId,
                                        order_id: orderId,
                                        updated_wallet_balance: walletValue,
                                        previous_balance: previousBalance,
                                    });
                                } else {
                                    res.json({
                                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                        err: errorsCodes.RESOURCE_NOT_FOUND,
                                        msg: "FR Product Variant not updated ",
                                        tracking_id: param.orderUserId,
                                        order_id: orderId,
                                        updated_wallet_balance: walletValue,
                                    });
                                }
                            }).catch((err) => {
                                res.json({
                                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                    err: errorsCodes.RESOURCE_NOT_FOUND,
                                    msg: "Something Went Wrong",
                                    error: err,
                                });
                            });
                        })
                        .catch((err) => {
                            console.log(err)

                            res.json({
                                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                err: errorsCodes.RESOURCE_NOT_FOUND,
                                msg: "",
                                error: err,
                            });
                        });
                })
                .catch((err) => {
                    res.json({
                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
                        err: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Something went wrong, Unable to save order",
                        error: "Something went wrong, Unable to save order",
                        errMsg: err,
                    });
                });
        } else {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Wallet Balance Low",
                error: "Wallet Balance Low",
            });
        }
    } else {
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            err: errorsCodes.BAD_REQUEST,
            msg: errors,
        });
    }
};



async function processOrderProduct(order, orders, delivery_date) {
    var orderId = order._id;
    var createdDate = moment(new Date()).add(5, "hours").add(30, "minutes");
    return new Promise(async (resolve, reject) => {
        const productVariantId = []; // Initialize the array to collect product variant IDs
        try {
            for (let i = 0; i < orders.length; i++) {
                let elem = orders[i];
                try {
                    // Fetch product variant data asynchronously
                    let varient = await productsDatalayers.getProductsVarientById(mongodb.ObjectId(elem.frproductvarId));
                    let wholesale = varient[0].wholesale || 0;

                    let totalprice = varient[0].price * elem.qty;
                    let totalwholesale_price = wholesale * elem.qty;
                    // Modify the order data
                    let updatedOrder = {
                        ...elem,  // Shallow copy the order object
                        image_url: ImageName(elem.image_url),
                        orderId: orderId,
                        order_status: "1",
                        delivery_date: delivery_date,
                        created: createdDate,
                        modified: createdDate,
                        revised_unit: elem.unit,
                        revised_measurement: elem.measurement,
                        revised_qty: elem.qty,
                        revised_price: elem.price * elem.qty,  // Total price based on quantity
                        revised_status: 1,
                        wholesale_price: wholesale,
                        wholesale_discount: (totalprice - totalwholesale_price)
                    };

                    orders[i] = updatedOrder; // Update the original order
                    productVariantId.push(mongodb.ObjectId(elem.frproductvarId));

                } catch (err) {
                    console.error(`Error processing order at index ${i}:`, err);
                }
            }
            //    console.log(orders)
            await orderVariantDatalayers.save(orders);

            resolve(productVariantId);

        } catch (err) {
            console.error("Error processing the entire order batch:", err);
            reject(err);
        }
    });

}


exports.updateorderpayment = async (req, res) => {

    if (mongodb.ObjectID.isValid(req.body.orderId)) {
        orderDatalayers.trackMyOrder(mongodb.ObjectId(req.body.orderId))
            .then((orders) => {

                orderDatalayers
                    .updateOrderPayment(req.body)
                    .then((orders) => {
                        res.json({
                            sucess: errorsCodes.SUCEESS,
                            msg: "",
                            data: orders,
                        });
                    })
                    .catch((err) => {
                        res.json({
                            err: errorsCodes.BAD_REQUEST,
                            msg: "",
                            error: err,
                        });
                    });

            })
            .catch((err) => {
                res.json({
                    err: errorsCodes.BAD_REQUEST,
                    msg: "",
                    error: err,
                });
            });
    } else {
        res.json({
            err: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Invalid ObjectId",
            error: "Invalid ObjectId"
        })
    }
};


exports.orderListForOpm = async (req, res) => {
    try {
        let user = req.user;
        if (user.role_type != "7" || user.franchise_id == null) {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something Went Wrong"
            });
            return;
        }
        let franchiseId = user.franchise_id;
        let startDate = (req.query.start_date && req.query.start_date != "") ? new Date(req.query.start_date) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));

        let endDate = (req.query.end_date && req.query.end_date != "") ? new Date(moment(req.query.end_date).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        let today = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));
        var product_id = '';
        var search = '';
        var where = { franchiseId: franchiseId, is_active: { $in: ["1", "2", "3", "4"] }, delivery_date: { $gte: startDate, $lt: endDate } };

        if (req.query.product_id) {
            var product_id = mongodb.ObjectId(req.query.product_id);
        }
        if (req.query.search) {
            var search = req.query.search;
            var where = {
                franchiseId: franchiseId,
                is_active: { $in: ["1", "2", "3", "4"] },
                delivery_date: { $gte: startDate, $lt: endDate },
                'user.phone_no': search
            };
        }

        let updated_data = await orderDatalayers.orderListForOpm(where, product_id);

        let data = [];
        let prow = 0;
        updated_data.forEach((ele, index) => {
            if (ele.order_variants.length > 0) {
                data[prow] = ele;
                switch (parseInt(ele.is_active)) {
                    case 1:
                        {
                            data[prow].data_tab = "new";
                            break;
                        }
                    case 2:
                        {
                            data[prow].data_tab = "new";
                            if (moment(moment(ele.delivery_date).format("YYYY-MM-DD")).isSame(moment(today).format("YYYY-MM-DD"))) {
                                data[prow].data_tab = "to_be_deliver";
                            }
                            break;
                        }
                    case 3:
                        {
                            data[prow].data_tab = "shipped";
                            break;
                        }
                    case 4:
                        {
                            data[prow].data_tab = "delivered";
                            break;
                        }
                    default:
                        {
                            //Do Nothing
                        }
                }
                prow++;
            }
        });
        res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "",
            data,
        });
    } catch (err) {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Something Went Wrong",
            error: err,
        });
    }
};

exports.trackingOrder = async (req, res) => {
    var condition = {};
    var param = "";
    let userId = req.user._id

    if (req.method == "GET") {
        condition = {
            userId: req.params.userId,
            orderId: req.params.orderId,
        };
    } else {
        param = req.body;
        condition = {
            userId: userId
        };
    }

    orderVariantDatalayers.orderStatus(condition)
        .then((data) => {
            if (data.length > 0) {
                data.forEach((ele, i) => {
                    let totalWholesaleDiscount = 0;
                    if (ele.order_variants.length > 0) {
                        ele.order_variants.forEach((order_variants, ii) => {
                            if (order_variants.qty * order_variants.price == order_variants.revised_qty * order_variants.revised_price) {
                                data[i].order_variants[ii].revised_price = order_variants.qty * order_variants.price;
                            }
                            if (order_variants.wholesale_discount) {
                                totalWholesaleDiscount += order_variants.wholesale_discount;
                            }
                        });
                    }
                    data[i].total_wholesale_discount = totalWholesaleDiscount;
                    if (ele.review == "" || ele.review == null || ele.review == undefined) {
                        data[i].review = {};
                    }
                });
            }
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something Went Wrong",
                error: err,
            });
        });
};

exports.printOrderbill = async (req, res) => {
    var condition = {};
    condition = {
        orderId: mongodb.ObjectId(req.params.orderId),
    };

    orderVariantDatalayers.orderDetails(condition)
        .then((data) => {
            if (data.length > 0) {
                data.forEach((ele, i) => {
                    if (ele.order_variants.length > 0) {
                        ele.order_variants.forEach((order_variants, ii) => {
                            if (order_variants.qty * order_variants.price == order_variants.revised_qty * order_variants.revised_price) {
                                data[i].order_variants[ii].revised_price = order_variants.qty * order_variants.price;
                            }
                        });
                    }
                });
            }
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Something Went Wrong",
                error: err,
            });
        });
};

var walletBalance = async (userId) => {
    const userDetail = await userDatalayers.findbyField({ _id: userId });
    if (userDetail.length > 0) {
        const wallet_value = userDetail[0].wallet_balance;
        return wallet_value;
    } else {
        return false;
    }
};

var updateWalletBalance = async (updateParam) => {
    await userDatalayers.update(updateParam, false);
    return true;
};

var updateQuantity = async (prodvarid, placeOrders) => {
    var returnValue;
    var updateQtyResponse = [];

    await productsDatalayers
        .productVarientFindByCondition(prodvarid)
        .then((doc) => {
            if (doc) {
                var orderPlace = [];
                var databaseQTy = [];

                placeOrders.forEach((elem) => {
                    var orderplaceObject = {};
                    orderplaceObject.id = elem.frproductvarId;
                    orderplaceObject.qty = elem.qty;
                    orderPlace.push(orderplaceObject);
                });

                doc.forEach((elem) => {
                    var databaseObject = {};
                    databaseObject.id = elem._id;
                    databaseObject.qty = elem.qty;
                    databaseQTy.push(databaseObject);
                });

                let x;
                orderPlace.forEach((elem) => {
                    x = databaseQTy.filter(dq => (dq.id).toString() == (elem.id).toString());
                    var updateQty = {};
                    updateQty.id = elem.id;
                    updateQty.qty = parseInt(x[0].qty) - parseInt(elem.qty);

                    productsDatalayers
                        .updateQtyOnOrderPlaced(
                            mongodb.ObjectId(elem.id),
                            updateQty.qty
                        )
                        .then((ack) => {
                            updateQtyResponse.push(ack);
                        })
                        .catch((err) => {
                            updateQtyResponse.push(err);
                        });
                });

                returnValue = true;
            } else {
                returnValue = false;
            }
        })
        .catch((err) => {
            console.log('returnValue' + err);
            returnValue = false;
        });

    return returnValue;
};

function ImageName(param) {
    param = param.split("/");
    let length = param.length;
    return param[length - 1];
}

/**await userDatalayers.updateWallet({
                        _id: frndOne_User_Id,
                        wallet_balance: frnd1_newWalletBalance,
                    }); */


var updateWalletBalanceIncrease = async (userId, value) => {
    try {
        var user = await userDatalayers.findbyField({ _id: userId });
        var oldBalance = Number(user[0].wallet_balance);
        var newBalance = Number(value) + Number(oldBalance);
        let data = { _id: userId, wallet_balance: newBalance };
        let updatedUser = await userDatalayers.updateWallet(data);
        return updatedUser;
    } catch (error) {
        return error;
    }
};

var updateWalletBalanceDecrease = async (userId, value) => {
    try {
        var user = await userDatalayers.findbyField({ _id: userId });
        var oldBalance = Number(user[0].wallet_balance);
        var newBalance = Number(oldBalance) - Number(value);
        let data = { _id: userId, wallet_balance: newBalance };
        let updatedUser = await userDatalayers.updateWallet(data);
        return updatedUser;
    } catch (error) {
        return error;
    }
};

exports.findOrderBeforeCancel = async (req, res) => {
    var condition = {
        _id: mongodb.ObjectId(req.params._id),
        userId: mongodb.ObjectId(req.params.userId),
        is_active: "1",
    };

    orderDatalayers.findOrderBeforeCancel(condition)
        .then((data) => {
            if (data == 204) {
                res.json({
                    msg: "",
                    data: data,
                    sucess: errorsCodes.DATA_NOT_FOUND,
                });
            } else {
                res.json({
                    msg: "",
                    data: data,
                    sucess: errorsCodes.SUCEESS,
                });
            }
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

var referEarnWalletLog = async (userId, wallet_amount, msg, transaction, isadmin = 0) => {
    let user_id = mongodb.ObjectId(userId);
    let x = await settingsDatalayers.getSettings();
    let walletexpiredays = x[0].wallet_expire_days;
    let expireon = (transaction == '1') ? moment(Date.now()).add(walletexpiredays, "days") : Date.now();
    await walletDatalayers.save({
        userId: user_id,
        wallet_amount: wallet_amount,
        description: msg,
        transaction: transaction,
        is_admin: isadmin,
        expire_on: expireon,
    });
    return true;
};

exports.setWalletUsedStatus = async (req, res) => {
    walletDatalayers
        .setWalletUsedStatus(
            mongodb.ObjectId("5fd4770e82a1193979ca7aa4"),
            parseInt(200)
        )
        .then((walletUsedStatusResult) => {
            res.json({
                sucess: errorsCodes.SUCEESS,
                msg: "",
                data: walletUsedStatusResult,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "",
                error: err,
            });
        });
};

exports.getDeliveryAddress = async (req, res) => {
    var order = await orderDatalayers.edit(req.params);
    if (order) {
        addressDatalayers
            .getaddress(order.delivery_address_id)
            .then((address) => {
                res.json({
                    sucess: errorsCodes.SUCEESS,
                    msg: "",
                    data: address,
                });
            })
            .catch((err) => {
                res.json({
                    sucess: errorsCodes.RESOURCE_NOT_FOUND,
                    msg: "Order not found.",
                    error: err,
                });
            });
    } else {
        res.json({
            sucess: errorsCodes.RESOURCE_NOT_FOUND,
            msg: "Order not found.",
        });
    }
};

exports.todayReviewToBeDone = async (req, res) => {
    try {
        let user_id = req.user._id;
        if (mongodb.ObjectID.isValid(user_id)) {
            let current_date = new Date();
            current_date = moment(current_date).format('YYYY-MM-DD') //new Date();

            let today_start = new Date(current_date);
            let today_end = new Date(moment(current_date).add(1, "days").format('YYYY-MM-DD'));

            let orders = await orderDatalayers.findOrderDetail_onCondition({
                userId: mongodb.ObjectId(user_id),
                is_active: '4',
                delivery_date: { $gte: today_start, $lt: today_end }
            });

            if (orders.length > 0 && !orders[0].review.product_rate) {
                res.json({
                    success: errorsCodes.SUCCESS,
                    msg: "",
                    data: orders[0]._id
                });
            } else {
                res.json({
                    success: errorsCodes.DATA_NOT_FOUND,
                    msg: "Order Not found"
                });
            }
        } else {
            res.json({
                err: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Invalid ObjectId",
                error: "Invalid ObjectId"
            })
        }
    } catch (e) {
        console.log(e);
    }

};

exports.saveOrderReview = async (req, res) => {
    try {
        let user_id = mongodb.ObjectId(req.user._id);
        let order_id = mongodb.ObjectId(req.body.order_id);

        let review = {
            product_rate: 0,
            dboy_rate: 0,
            comment: "",
            why_low_rate: ""
        };

        review.comment = (req.body.comment) ? req.body.comment : "";
        review.dboy_rate = (req.body.dboy_rate) ? req.body.dboy_rate : 0;
        review.product_rate = (req.body.product_rate) ? req.body.product_rate : 0;
        review.why_low_rate = (req.body.why_low_rate) ? req.body.why_low_rate : "";
        if (review.product_rate > 5) {
            review.product_rate = 5;
        }

        if (review.dboy_rate > 5) {
            review.dboy_rate = 5;
        }
        let doc = await orderDatalayers.saveReview(order_id, user_id, review);

        if (doc) {
            res.json({
                success: errorsCodes.SUCEESS,
                msg: "Your review submitted successfully.",
                data: doc,
            });
        } else {
            res.json({
                success: errorsCodes.DATA_NOT_FOUND,
                msg: "Order not found to rate.",
            });
        }
    } catch (e) {
        res.json({
            success: errorsCodes.DATA_NOT_FOUND,
            error: e,
        });
    }
};

exports.getDailycollection = async (req, res) => {
    let where = { is_active: { $in: [4, 5, 6] } };
    let sort = {};
    let params = { skip: 0, limit: 0 };
    if (req.query.start) {
        params.skip = parseInt(req.query.start);
        params.limit = parseInt(req.query.limit);
        params.order = req.query.order;
        params.dir = parseInt(req.query.dir);
    }

    var total = await orderDatalayers.gettotaldailycollection(where);

    let _and = [];
    let _or = [];

    let startDate = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));
    let endDate = new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));

    if (req.query.franchise_id) {
        _and.push({ franchise_id: mongodb.ObjectId(req.query.franchise_id) });
    }
    if ((req.query.delivery_date_from) && (req.query.delivery_date_from)) {
        let startDate = (req.query.delivery_date_from) ? new Date(req.query.delivery_date_from) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").format('YYYY-MM-DD'));

        let endDate = (req.query.delivery_date_to) ? new Date(moment(req.query.delivery_date_to).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD')) : new Date(moment(new Date()).add(5, "hours").add(30, "minutes").add(1, "days").format('YYYY-MM-DD'));
        _and.push({ delivery_date: { $gte: startDate, $lt: endDate } });
    } else {
        _and.push({ delivery_date: { $gte: startDate, $lt: endDate } });
    }
    if (req.query.is_active) {
        _and.push({ is_active: req.query.is_active });
    } else {
        _and.push({ is_active: "4" });
    }
    if (req.query.payment_method) {
        _and.push({ payment_method: Number(req.query.payment_method) });
    }
    if (req.query.where) {
        _or = [{
            full_name: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }, {
            firmname: { $regex: new RegExp('^' + req.query.where + '', 'i') }
        }];
    }

    if (_or.length > 0 && _and.length > 0) {
        where = { $and: [{ $or: _or }, ..._and] }
    }

    if (!_or.length && _and.length > 0) {
        where = { $and: _and }
    }
    if (_or.length && !_and.length > 0) {
        where = { $or: _or }
    }
    ///console.log(where);    
    filtered = await orderDatalayers.gettotaldailycollection(where);

    orderDatalayers.getdailycollection(where, params)
        .then((doc) => {
            res.json({
                sucess: errorsCodes.SUCCESS,
                msg: message.SUCCESS,
                data: doc,
                total: total,
                filtered: filtered,
            });
        })
        .catch((err) => {
            res.json({
                err: errorsCodes.BAD_REQUEST,
                message: message.SOMETHING_WENT_WRONG,
                error: err,
            });
        });
};


function couponCode(length) {
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
