
const fs = require("fs");
const moment = require("moment");
const mongodb = require("mongodb"); 
const cartDatalayers = require("../datalayers/cartDatalayer");   
const errorsCodes = require("../helpers/error_codes/errorCodes");
const { check, validationResult, param } = require('express-validator');
const message = require("../helpers/languages/english");
const productsDatalayers = require('../datalayers/productsDatalayer');
const franchiseDatalayers = require('../datalayers/franchiseDatalayer');
const couponDatalayer = require("../datalayers/couponDatalayer");
const settingDatalayers = require("../datalayers/settingDatalayers");
const userDatalayers = require("../datalayers/userDatalayer");

exports.add_to_cart = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
            status: errorsCodes.REQUIRED_PARAMETER_MISSING,
            message: "Required parameter missing",
            data: errors.array()
        });
    }
  
    if (mongodb.ObjectID.isValid(req.body.productvarId)) { 
        const qty = req.body.qty;
        
        var productArr = [];
        const frpvarId = mongodb.ObjectId(req.body.productvarId); 
        const session_id = req.body.session_id;
        var franchiseProducts = await productsDatalayers.allfranchiseproductsbyfrpid(frpvarId);
        var its_unit = 0;
        var its_max_order = 0;
        var frproduct_id = 0;
        var temp_unit = 0;
        if (franchiseProducts.length > 0) {
            franchiseProducts.forEach((eleV) => {
                if (eleV.frproduct.length > 0) { 
                    frproduct_id = eleV.frproductId;
                    var ele = eleV.frproduct[0];
                    var units = 0;
                    var max_order = 0;
                    switch (ele.product_unit) {
                        case 1: //if unit in KG
                            if (eleV.unit == 1) { //change to grams
                                units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            if (eleV.unit == 2) { //don't change to grams
                                units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            break;
                        case 2: //if unit in GRAMS
                            if (eleV.unit == 1) { //change to grams
                                units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            if (eleV.unit == 2) { //don't change to grams
                                units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            break;
                        case 3: //if unit in LITER
                            if (eleV.unit == 3) { //change to ml
                                units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            if (eleV.unit == 4) { // don't change to ml
                                units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                            }
                            break;
                        case 4: //if unit in ML
                            if (eleV.unit == 3) { //change to ml
                                units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            if (eleV.unit == 4) { // don't change to ml
                                units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                            }
                            break;
                        default:
                            units = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                            max_order = (ele.product_max_order) ? parseInt(ele.product_max_order) : 0;
                            break;
                    }
                    its_unit = units; 
                    its_max_order = max_order; 
                }
            });
         

            if(req.body.user_id){
                var chekproductwhere = {
                    "$or": [{
                        "session_id" : session_id
                    }, {
                        "userId": mongodb.ObjectID(req.body.user_id) 
                    }],
                    "$and":[{"frproductvarId":frpvarId}]
                };   
            }else{
                var chekproductwhere = { 
                    "$and":[{"session_id" : session_id},{"frproductvarId":frpvarId}]
                }; 
            }
            const isCarthas = await cartDatalayers.checkCartexist(chekproductwhere)
            if(isCarthas){ 
                var temp_unit = (isCarthas.qty*isCarthas.unit)+its_unit;
            }else {
                var temp_unit = its_unit;
            }

            if (its_max_order && qty != '0' ) {
                if (its_unit > its_max_order) {
                    return res.json({
                        status: errorsCodes.RESOURCE_NOT_FOUND,
                        message: "Max order limit reached.",
                        data: []
                    })
                }
                if (temp_unit > its_max_order) {
                    return res.json({
                        status: errorsCodes.RESOURCE_NOT_FOUND,
                        message: "Max order limit reached.",
                        data: []
                    })
                }
            } 
            

            if(isCarthas){   
                var newqty = parseInt(isCarthas.qty)+parseInt(qty);  
                if(newqty==0){
                    /// Delete cart value
                    cartDatalayers.delete(isCarthas._id)
                    .then((cart) => {
                        res.json({
                            status: errorsCodes.SUCEESS,
                            message: "Item Remove Successfully",
                            data:[]
                        })
                    })
                    .catch((err) => {
                        res.json({
                            status: errorsCodes.BAD_REQUEST,
                            message: "",
                            data: []
                        });
                    });
                }
                // Update cart value
                var param = { 
                            '_id':isCarthas._id,
                            'frproductvarId':frpvarId,
                            'qty': newqty,
                            'frproductId': frproduct_id,
                            'unit': its_unit,
                            'session_id': session_id
                            };  

                if(req.body.user_id){
                    param.userId = mongodb.ObjectId(req.body.user_id);
                } 
                cartDatalayers.update(param)
                .then((cart) => {
                    res.json({
                        status: errorsCodes.SUCEESS,
                        message: "Item Update Successfully",
                        data: {"cart_id":cart._id,"qty":newqty}
                    })
                })
                .catch((err) => {
                    res.json({
                        status: errorsCodes.BAD_REQUEST,
                        message: "",
                        data: []
                    });
                });

            }else{

                if(qty > 0){
                    //////Add first product to cart when cart is not prepared    
                    var param = { 
                                'frproductvarId':frpvarId,
                                'qty': qty,
                                'frproductId': frproduct_id,
                                'unit': its_unit,
                                'session_id': session_id
                                };  

                    if(req.body.user_id){
                        param.userId = mongodb.ObjectId(req.body.user_id);
                    } 

                    cartDatalayers.save(param)
                    .then((cart) => {
                        res.json({
                            status: errorsCodes.SUCEESS,
                            message: "Item Add Successfully",
                            data: cart
                        })
                    })
                    .catch((err) => {
                        res.json({
                            status: errorsCodes.BAD_REQUEST,
                            message: err,
                            data: []
                        });
                    });
                }else{
                    return res.json({
                            status: errorsCodes.BAD_REQUEST,
                            message: "Qty Should be greter then zero",
                            data: []
                        });
                }
            }
        }else{
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Product varient not found",
                data: []
            })            
        } 
    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "Invalid ObjectId",
            data: []
        })
    }
}


exports.update_cart = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
            status: errorsCodes.REQUIRED_PARAMETER_MISSING,
            message: "Required parameter missing",
            data: errors.array()
        });
    }
    if (mongodb.ObjectID.isValid(req.body.cartId)) { 
        const qty = req.body.qty;
        var chekproductwhere = { _id: mongodb.ObjectId(req.body.cartId) }         
        const isCarthas = await cartDatalayers.checkCartexist(chekproductwhere)
        if(isCarthas){
            var franchiseProducts = await productsDatalayers.allfranchiseproductsbyfrpid(isCarthas.frproductvarId);
            var its_unit = 0;
            var its_max_order = 0;
            var frproduct_id = 0;
            var temp_unit = 0;
            if (franchiseProducts.length > 0) {
                franchiseProducts.forEach((eleV) => {
                    if (eleV.frproduct.length > 0) { 
                        frproduct_id = eleV.frproductId;
                        var ele = eleV.frproduct[0];
                        var units = 0;
                        var max_order = 0;
                        switch (ele.product_unit) {
                            case 1: //if unit in KG
                                if (eleV.unit == 1) { //change to grams
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                }
                                if (eleV.unit == 2) { //don't change to grams
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                }
                                break;
                            case 2: //if unit in GRAMS
                                if (eleV.unit == 1) { //change to grams
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                }
                                if (eleV.unit == 2) { //don't change to grams
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                }
                                break;
                            case 3: //if unit in LITER
                                if (eleV.unit == 3) { //change to ml
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                }
                                if (eleV.unit == 4) { // don't change to ml
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order) * 1000) : 0;
                                }
                                break;
                            case 4: //if unit in ML
                                if (eleV.unit == 3) { //change to ml
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment) * 1000) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                }
                                if (eleV.unit == 4) { // don't change to ml
                                    units = (eleV.measurment) ? (parseInt(eleV.measurment)) : 0;
                                    max_order = (ele.product_max_order) ? (parseInt(ele.product_max_order)) : 0;
                                }
                                break;
                            default:
                                units = (eleV.measurment) ? parseInt(eleV.measurment) : 0;
                                max_order = (ele.product_max_order) ? parseInt(ele.product_max_order) : 0;
                                break;
                        }
                        its_unit = units; 
                        its_max_order = max_order; 
                    }
                });
            }
            var newqty = parseInt(isCarthas.qty)+parseInt(qty); 
            if(newqty==0){
                /// Delete cart value
                cartDatalayers.delete(isCarthas._id)
                .then((cart) => {
                    res.json({
                        status: errorsCodes.SUCEESS,
                        message: "Item Remove Successfully",
                        data: {"cart_id":cart._id,"qty":newqty}
                    })
                })
                .catch((err) => {
                    res.json({
                        status: errorsCodes.BAD_REQUEST,
                        message: err,
                        data: []
                    });
                });
            }

            var temp_unit = (isCarthas.qty*isCarthas.unit)+its_unit;

            if (its_max_order && qty >= '0' ) {
                if (its_unit > its_max_order) {
                    return res.json({
                        status: errorsCodes.RESOURCE_NOT_FOUND,
                        message: "Max order limit reached.",
                        data: []
                    })
                }
                if (temp_unit > its_max_order) {
                    return res.json({
                        status: errorsCodes.RESOURCE_NOT_FOUND,
                        message: "Max order limit reached.",
                        data: []
                    })
                }
            } 
            // Update cart value
            var param = { 
                        '_id':isCarthas._id, 
                        'qty': newqty
                        };   
            ///console.log(param);            
            cartDatalayers.update(param)
            .then((cart) => {
                res.json({
                    status: errorsCodes.SUCEESS,
                    message: "Item Update Successfully",
                    data: {"cart_id":cart._id,"qty":newqty}
                })
            })
            .catch((err) => {
                res.json({
                    status: errorsCodes.BAD_REQUEST,
                    message: err,
                    data: []
                });
            });
        }else{
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Cart Id not found",
                data: []
            })   
        }
    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "Invalid ObjectId",
            data: []
        })
    }    
}


exports.remove_cart_by_userid = async(req, res) => {

    if (mongodb.ObjectID.isValid(req.body.user_id)) { 
        const qty = req.body.qty;
        var chekproductwhere = { userId: mongodb.ObjectId(req.body.user_id) } 
        const isCarthas = await cartDatalayers.getUserCartdata(chekproductwhere); 
        if(isCarthas){
            /// Delete cart value            
            isCarthas.forEach((eleV) => {
                cartDatalayers.delete(eleV._id)
            }) 
            var where = { session_id: isCarthas[0].session_id } 
            //console.log(where);
            cartDatalayers.deletecarttotal(where);

            res.json({
                status: errorsCodes.SUCEESS,
                message: "Cart Remove Successfully",
                data: []
            })

        }else{
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Cart Id not found",
                data: []
            })              
        }
    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "Invalid ObjectId",
            data: []
        })
    }
}


exports.remove_cart = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
            status: errorsCodes.REQUIRED_PARAMETER_MISSING,
            message: "Required parameter missing",
            data: errors.array()
        });
    }
    if (mongodb.ObjectID.isValid(req.body.cartId)) { 
        const qty = req.body.qty;
        var chekproductwhere = { _id: mongodb.ObjectId(req.body.cartId) } 
        const isCarthas = await cartDatalayers.checkCartexist(chekproductwhere)
        if(isCarthas){
            /// Delete cart value
            cartDatalayers.delete(isCarthas._id)
            .then(async(cart) => {
                var where = {session_id:isCarthas.session_id}
                const isCartexist = await cartDatalayers.checkCartexist(where);
                if(isCartexist==null){ 
                    cartDatalayers.deletecarttotal(where);
                }
                res.json({
                    status: errorsCodes.SUCEESS,
                    message: "Item Remove Successfully",
                    data: []
                })
            })
            .catch((err) => {
                res.json({
                    status: errorsCodes.BAD_REQUEST,
                    message: "",
                    data: []
                });
            });
        }else{
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Cart Id not found",
                data: []
            })              
        }
    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "Invalid ObjectId",
            data: []
        })
    }
}

exports.get_carttotal = async(req, res) =>{

    if(req.body.user_id){
        var chekproductwhere = {
                "$or": [{
                    "session_id": req.body.session_id
                }, {
                    "userId": mongodb.ObjectID(req.body.user_id)
                }]}  
    }else{
        var chekproductwhere = { session_id: req.body.session_id }
    }
    const isCarttotal = await cartDatalayers.getCarttotal(chekproductwhere);
    if(isCarttotal){
        return res.json({
            status: errorsCodes.SUCEESS,
            message: "get cart Successfully",
            data: isCarttotal
        })
    }else{
        return res.json({
            status: errorsCodes.RESOURCE_NOT_FOUND,
            message: "Cart is empty!!",
            data: []
        })  
    }

}


exports.get_cart = async(req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
                status: errorsCodes.REQUIRED_PARAMETER_MISSING,
                message: "Required parameter missing",
                data: errors.array()
            });
        }
        const session_id = req.body.session_id;
        const is_wholesaler = (req.body.is_wholesaler)?req.body.is_wholesaler:0;
       
        let user_wallet = 0;
        var where = { session_id: session_id };
        const isCarttotal = await cartDatalayers.getCarttotal(where);
        let promodiscAmt =0; 
        let promoCode = '';
        if(isCarttotal && isCarttotal.promo_disc != null ){
            promodiscAmt = isCarttotal.promo_disc;
            promoCode = isCarttotal.promo_code;
        }  
        
        if(req.body.user_id){
            var chekproductwhere = {
                    "$or": [{
                        "session_id": session_id
                    }, {
                        "userId": mongodb.ObjectID(req.body.user_id)
                    }]}  
        }else{
            var chekproductwhere = { session_id: session_id }
        }
       
        const mainArr = []; 
        var totalAmt =0; 
        var discountAmt =0;
        var deliveryCharge =0;
        var cartQty =0;
        var finalTotalAmt = 0;
        const getsetting = await settingDatalayers.getSettings();
        const condition = { _id: mongodb.ObjectID(req.body.user_id) };
        const userWallet = await userDatalayers.findbyField(condition);

        if(userWallet[0]!=undefined && userWallet[0].wallet_balance && (req.body.user_wallet==1)){
            if(userWallet[0].wallet_balance > 0){
                user_wallet = userWallet[0].wallet_balance;
            }else{
                return res.json({
                    status: errorsCodes.RESOURCE_NOT_FOUND,
                    message: "User wallet have zero ballance!!",
                    data: []
                }) 
            }            
        }
        const isCarthas = await cartDatalayers.getUserCartdata(chekproductwhere);
        
        if(isCarthas[0]){
                if(req.body.user_id && isCarthas[0].user_id == undefined){  
                    var param = { 
                        'session_id':isCarthas[0].session_id, 
                        'userId': req.body.user_id
                        };       
                    await cartDatalayers.updateSessionCart(param);
                }
                productsDatalayers.getCartDetailsByVarientId(chekproductwhere)
                    .then(async(result) => {  
                    let cart_item = [];
                    let cart_total = [];
                    let franchiseId = '';

                        result.forEach(ele => { 
                            if(is_wholesaler=='1'){
                               var pvarprice = ele.productvar[0].wholesale;
                               var discAmt = 0;
                            }else{
                               var pvarprice = ele.productvar[0].price;
                               var discAmt = ((ele.productvar[0].disc_price / 100))*(pvarprice * (ele.qty));
                            }   

                            totalAmt += (pvarprice)*parseInt(ele.qty);
                            discountAmt += parseFloat(discAmt);
                            cartQty  += parseFloat(ele.qty);

                            franchiseId = ele.productvar[0].franchiseId;
                            cart_item.push({
                                _id: ele._id,
                                frproductId: ele.frproductId,
                                frproductvarId: ele.frproductvarId,
                                franchiseId: ele.productvar[0].franchiseId,
                                productId: ele.productvar[0].frProducts[0].productId,
                                discount: ele.productvar[0].disc_price,
                                measurement: ele.productvar[0].measurment,
                                unit: ele.productvar[0].unit,
                                cart_unit: ele.unit,
                                title: ele.productvar[0].frProducts[0].products[0].title,
                                image_url: ele.productvar[0].frProducts[0].products[0].productimage[0].title,
                                qty: ele.qty,
                                price: pvarprice,
                                total: pvarprice*parseInt(ele.qty),
                                disc: discAmt,
                                session_id: ele.session_id
                            });
                        }); 

                        var MinOrderWholesaler = getsetting.min_order_wholesaler;
                        var MinOrder = getsetting.min_order;
                        var AcceptMinimumOrder = getsetting.accept_minimum_order;
                        var DeliveryChrge = getsetting.delivery_chrge; 
                        var DeliveryMaxDay = getsetting.delivery_max_day;
                        var DeliveryDayAfterOrder = getsetting.delivery_day_after_order;

                        const franchiseRecord = await franchiseDatalayers.getFranchiseById(mongodb.ObjectID(franchiseId));
                       
                        if(franchiseRecord[0]!=undefined){
                           
                            MinOrderWholesaler = franchiseRecord[0].min_order_wholesaler;
                            MinOrder = franchiseRecord[0].min_order;
                            AcceptMinimumOrder = franchiseRecord[0].accept_minimum_order;
                            DeliveryChrge = franchiseRecord[0].delivery_chrge; 
                            DeliveryMaxDay = franchiseRecord[0].delivery_max_day;
                            DeliveryDayAfterOrder = franchiseRecord[0].delivery_day_after_order;
                        }                        

                        if(is_wholesaler=='1'){
                            var minOrderVal = MinOrderWholesaler;
                        }else{
                            var minOrderVal = MinOrder;
                        }    

                        if((AcceptMinimumOrder) &&  parseFloat(totalAmt) < parseFloat(minOrderVal)){
                            deliveryCharge = DeliveryChrge;
                        }else{
                            if(parseFloat(totalAmt) < parseFloat(minOrderVal)){
                                deliveryCharge = DeliveryChrge;
                            }else{
                                deliveryCharge = 0;
                            }
                        }   
                  
                        if((discountAmt+promodiscAmt) > totalAmt){
                            finalTotalAmt= 0;
                        }else{
                            finalTotalAmt= (parseFloat(totalAmt)+parseFloat(deliveryCharge)-(discountAmt+promodiscAmt));
                        }
                        if(finalTotalAmt <= parseFloat(user_wallet)){ 
                            user_wallet = finalTotalAmt;
                            finalTotalAmt = 0;
                        }else{
                            finalTotalAmt = (finalTotalAmt-parseFloat(user_wallet));
                        }
                        cart_total.push({
                          'session_id' : session_id,
                          'promo_disc' : promodiscAmt,                              
                          'promo_code' : promoCode,
                          'minOrderVal' : minOrderVal,
                          'acceptMinimumOrder' : AcceptMinimumOrder,
                          'deliveryMaxDay' : DeliveryMaxDay,
                          'deliveryDayAfterOrder' : DeliveryDayAfterOrder,
                          'disc' : discountAmt,
                          'delivery_charge':deliveryCharge,                              
                          'user_wallet' : parseFloat(user_wallet),  
                          'total' : totalAmt,
                          'final_total' : finalTotalAmt,
                          'cartqty':cartQty,
                        }); 
                        mainArr.push({"cart_item": cart_item, "cart_total": cart_total });
                        /// update cart total table
                        cartDatalayers.updateCartTotal(cart_total, session_id);

                        return res.json({
                            status: errorsCodes.SUCEESS,
                            message: "get cart Successfully",
                            data: mainArr
                        })
                    })
                    .catch((err) => {
                        throw err;
                    });
            
        }else{
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Cart is empty!!",
                data: []
            })              
        }
}
 

exports.removecoupon = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
            status: errorsCodes.REQUIRED_PARAMETER_MISSING,
            message: "Required parameter missing",
            data: errors.array()
        });
    }
    var userId = mongodb.ObjectId(req.body.user_id);
    const session_id = req.body.session_id; 

    if(req.body.user_id){
        var chekproductwhere = {
            "$or": [{
                "session_id" : session_id
            }, {
                "userId": mongodb.ObjectID(req.body.user_id) 
            }],
        };   
    }else{
        var chekproductwhere = { 
            "$and":[{"session_id" : session_id}]
        }; 
    }
    const isCarthas = await cartDatalayers.checkCartexist(chekproductwhere)
   
    if (isCarthas) { 
        var procode = [{promo_disc:0, promo_code:''}];
        cartDatalayers.updateCartTotal(procode, session_id);
         return res.json({
            sucess: errorsCodes.SUCEESS,
            msg: "Coupon Remove Successfully",
            data: ""
        });
    }else{
        res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again."
            });
    }
     
}

exports.checkcoupon = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
            status: errorsCodes.REQUIRED_PARAMETER_MISSING,
            message: "Required parameter missing",
            data: errors.array()
        });
    }
    var ccode = req.params.ccode;
    var userId = mongodb.ObjectId(req.body.user_id);
    var franchiseId = mongodb.ObjectId(req.body.franchise_id);
    const session_id = req.body.session_id;  
     
    if(req.body.user_id){
        var where = {
            "$or": [{
                "session_id" : session_id
            }, {
                "userId": mongodb.ObjectID(req.body.user_id) 
            }],
        };   
    }else{
        var where = { 
            "$and":[{"session_id" : session_id}]
        }; 
    }

    const isCarttotal = await cartDatalayers.getCarttotal(where);
    let final_total =0; 
    if(isCarttotal && isCarttotal.final_total != null ){
        final_total = isCarttotal.final_total;
    }  

    couponDatalayer.findbyField({
            is_active: 1,
            title: ccode,
            franchise_id: franchiseId
        })
        .then((couponData) => {  
            if (couponData.length > 0) {
                couponData = couponData[0];

                if (couponData.user_id != null && couponData.user_id != userId) {
                    return res.json({
                        sucess: errorsCodes.RESOURCE_NOT_FOUND,
                        msg: "Coupon is not valid.",
                        data: { flag: false }
                    }); 
                }
                if (couponData.uses_number != 0 && couponData.uses_number == couponData.used_number) {
                    return res.json({
                        sucess: errorsCodes.FORBIDDEN,
                        msg: "This coupon has been reached its maximum uses.",
                        data: { flag: false }
                    }); 
                }
                
                let today = new Date();
                today = moment(today)
                        .add(5, "hours")
                        .add(30, "minutes")
                        .format("YYYY-MM-DD");
                today = new Date(today);

                if (couponData.has_expiry == true) { 
                    if(couponData.start_date > today){
                        res.json({
                            sucess: errorCodes.FORBIDDEN,
                            msg: "Coupon has not started yet.",
                            data: { flag: false }
                        });
                        res.end();
                        return;
                    }
                    if(couponData.end_date < today){
                        res.json({
                            sucess: errorCodes.FORBIDDEN,
                            msg: "Coupon has been expired.",
                            data: { flag: false }
                        });
                        res.end();
                        return;
                    }
                }

                if (couponData.reuse_by_same_user == true) {

                    if (couponData.disc_in == 1) {  //Percentage (%)
                        var disc = final_total * (couponData.disc_value / 100);
                    } else {   //Rupees (Rs.)
                        var disc = couponData.disc_value;
                    }
                    /// update cart total table
                    var procode = [{promo_disc:disc, promo_code:ccode}];
                    cartDatalayers.updateCartTotal(procode, session_id);
                   /* couponData=JSON.parse(JSON.stringify(couponData));
                    couponData.promo_disc = disc;*/
                    return res.json({
                        sucess: errorsCodes.SUCEESS,
                        msg: "Coupon Apply Successfully",
                        data: {"promo_disc":disc}
                    });
                } else {
                    orderDatalayer.findbyField({ userId: userId, promo_code: ccode })
                        .then((orders) => {
                            if (orders.length > 0) {
                                return res.json({
                                    sucess: errorsCodes.DATA_NOT_FOUND,
                                    msg: "This coupon has been used in previous order.",
                                    data: { flag: false }
                                });
                            } else {
                                if (couponData.disc_in == 1) {  //Percentage (%)
                                    var disc = final_total * (couponData.disc_value / 100);
                                } else {   //Rupees (Rs.)
                                    var disc = couponData.disc_value;
                                }
                                /// update cart total table
                                var procode = [{promo_disc:disc, promo_code:ccode}];
                                cartDatalayers.updateCartTotal(procode, session_id);
                                /*couponData=JSON.parse(JSON.stringify(couponData));
                                couponData.promo_disc = disc;*/
                                return res.json({
                                    sucess: errorsCodes.SUCEESS,
                                    msg: "Coupon Apply Successfully",
                                    data:  {"promo_disc":disc}
                                });
                            }
                        })
                        .catch(err => {
                            res.json({
                                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                                msg: "Coupon is not valid.",
                                data: err
                            });
                        });
                }
            } else {
                return res.json({
                    sucess: errorsCodes.DATA_EXPIRED,
                    msg: "Coupon has been expired.",
                    data: { flag: false }
                });
            }
        }).catch((error) => {
            res.json({
                sucess: errorsCodes.RESOURCE_NOT_FOUND,
                msg: "Record not updated. Try again."
            });
        });
}


exports.checkwallet = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(errorsCodes.REQUIRED_PARAMETER_MISSING).json({
            status: errorsCodes.REQUIRED_PARAMETER_MISSING,
            message: "Required parameter missing",
            data: errors.array()
        });
    }
    const userId = req.params.userId; 
    const mode = req.params.mode;  
    const session_id = req.params.sessionId; 

    var where = { session_id: session_id };
    const isCarttotal = await cartDatalayers.getCarttotal(where);
    let final_total =0; 
    if(isCarttotal && isCarttotal.final_total != null ){
        final_total = isCarttotal.final_total;
    } 

    if(mode==1){
        if(final_total==0){ 
            return res.json({
                status: errorsCodes.RESOURCE_NOT_FOUND,
                message: "Invalid cart detail!!!",
                data: []
            })   
        }else{
            const condition = { _id: req.params.userId }
            const userwallet = await userDatalayers.findbyField(condition)
            let wallet_balance = userwallet[0].wallet_balance;
            if(wallet_balance >0){
                if(final_total < wallet_balance){                    
                    wallet_balance = final_total;
                } 
                return res.json({
                    status: errorsCodes.SUCEESS,
                    message: "Wallet amount used from cart!!!",
                    data: {"wallet_balance":wallet_balance}
                })                 
            }else{

                return res.json({
                    status: errorsCodes.RESOURCE_NOT_FOUND,
                    message: "User wallet have zero ballance!!",
                    data: []
                })                 
            }            
        }
    }else{ 
        return res.json({
            status: errorsCodes.SUCEESS,
            message: "Wallet amount remove from cart!!!",
            data: []
        })  
    }  

}
 

exports.validate = (method) => {
    switch (method) {
        case "addToCart":
            {
                return [                    
                    check("productvarId", "Product Varient id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Product Varient id is required!"),
                    check("qty", "quantity is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("quantity is required!"),
                    check("session_id", "Session id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Session id is required!") 
                ];
            }
            break;
        case "updateCart":
            {
                return [ 
                    check("cartId", "Cart id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Cart id is required!") , 
                    check("qty", "quantity is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("quantity is required!") ,
                ];
            }     
            break;
        case "removeCart":
            {
                return [ 
                    check("cartId", "Cart id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Cart id is required!"), 
                ];
            } 
            break;
            case "getCart":
            {
                return [ 
                    check("session_id", "Session id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Session id is required!") 
                ];
            } 
            break;
            case "checkCoupon":
            {
                return [ 
                    check("ccode", "Coupon code is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Coupon code is required!"),
                    check("franchise_id", "Franchise id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Franchise id is required!"),
                    check("user_id", "User id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("User id is required!"),
                    check("session_id", "Session id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Session id is required!")    
                ];
            }
            break;
            case "removeCoupon":
            {
                return [  
                    check("franchise_id", "Franchise id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Franchise id is required!"),
                    check("user_id", "User id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("User id is required!"),
                    check("session_id", "Session id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Session id is required!")    
                ];
            }
            break;
            
            case "checkWallet":
            {
                return [ 
                    check("mode", "Mode is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Mode is required!"), 
                    check("userId", "User id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("User id is required!"),
                    check("sessionId", "Session id is required!")
                    .exists()
                    .not()
                    .isEmpty()
                    .withMessage("Session id is required!")    
                ];
            }
            
    }
}
