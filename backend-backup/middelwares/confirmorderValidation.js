let moment = require("moment");
let mongodb = require("mongodb");
let errorsCodes = require("../helpers/error_codes/errorCodes");
let settingsDatalayers = require("../datalayers/settingDatalayers");
let franchiseproductsDatalayer = require("../datalayers/franchiseproductsDatalayer");
const franchiseDatalayers = require('../datalayers/franchiseDatalayer');
const cartDatalayers = require("../datalayers/cartDatalayer");  
const productsDatalayers = require("../datalayers/productsDatalayer");
let utilsFunctions = require("./utils");

exports.validateOrder = async(req, res, next) => {
    let user = req.user;
    let order = req.body.order_param;
    ///console.log(order); 
    if (typeof req.body.order_param == "string") {
        order = JSON.parse(req.body.order_param);
        req.body.order_param = order;
    } 
    let is_wholesaler = order.is_wholesaler;
    if (user.is_active != '1') { //if user is not active
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            message: 'You can not place any order due to in-active account, Please contact '+process.env.APPNAME+' support team at '+process.env.SUPPORTNO,
            data: {},
        });
        return;
    }

    let settingData = await settingsDatalayers.getSettings();
    const franchiseRecord = await franchiseDatalayers.getFranchiseById(mongodb.ObjectID(order.franchiseId));
    
    let minOrderwholesaler = settingData[0].min_order_wholesaler;
    let minOrder = settingData[0].min_order;
    let acceptMinOrder = settingData[0].accept_minimum_order;
    let DeliveryChrge = settingData[0].delivery_chrge; 
    let DeliveryMaxDay = settingData[0].delivery_max_day;
    let delivery_day_after_order = settingData[0].delivery_day_after_order;

    if(franchiseRecord[0]!=undefined){
        minOrderwholesaler = franchiseRecord[0].min_order_wholesaler;
        minOrder = franchiseRecord[0].min_order;
        acceptMinOrder = franchiseRecord[0].accept_minimum_order;
        DeliveryChrge = franchiseRecord[0].delivery_chrge; 
        DeliveryMaxDay = franchiseRecord[0].delivery_max_day;
        delivery_day_after_order = franchiseRecord[0].delivery_day_after_order;       
    }   

    var where = {
                "$or": [{
                    "session_id": order.session_id
                }, {
                    "userId": mongodb.ObjectID(order.userId)
                }]} 
    let isCarttotal = await cartDatalayers.getCarttotal(where);
    let cartvalue = 0;
    if(isCarttotal && isCarttotal.promo_disc != null ){
        cartvalue = isCarttotal.total;
    } 

    let createdDate = new Date();
    createdDate = await utilsFunctions.add530(createdDate);
    if (order.delivery_date == undefined || order.delivery_date == "") {
        req.body.delivery_date = moment(createdDate).add(delivery_day_after_order, "days").format("YYYY-MM-DD");
        order.delivery_date = req.body.order_param.delivery_date;
    }

    let d1 = moment(order.delivery_date).format("YYYY-MM-DD");
    let d2 = moment(createdDate).format("YYYY-MM-DD");

    if ((delivery_day_after_order && moment(d1).isSame(d2)) || moment(d2).isAfter(d1)) {
        req.body.order_param.delivery_date = moment(createdDate).add(delivery_day_after_order, "days").format("YYYY-MM-DD");
        order.delivery_date = req.body.order_param.delivery_date;
    }
    if(req.body.order_param.delivery_date == undefined){
        req.body.order_param.delivery_date = d1;
        order.delivery_date = req.body.order_param.delivery_date;
    }

    let holiday = await settingsDatalayers.findHolidaysByField({ holiday_date: new Date(req.body.order_param.delivery_date), is_active: 1 });
    if (holiday.length > 0) {  
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: process.env.APPNAME+' is unable to give you delivery on date '+d1+', Please select another date.',
        });
        return;
    } 
    if(cartvalue==0){
        res.json({
            sucess: errorsCodes.BAD_REQUEST,
            msg: process.env.APPNAME+' can not accept zero order value!!',
        });
        return;
    }
    
    /// Max delivery order limit (acceptMinOrder)
    if(is_wholesaler=='1'){
        if (acceptMinOrder==false && parseFloat(cartvalue)<parseFloat(minOrderwholesaler)) { 
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: process.env.APPNAME+' accepts minimum order amount Rs. '+minOrderwholesaler+'/-',
            });
            return;
        }
    }else{
        if (acceptMinOrder==false && parseFloat(cartvalue)<parseFloat(minOrder)) { 
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: process.env.APPNAME+' accepts minimum order amount Rs. '+minOrder+'/-',
            });
            return;
        }
    }
    /// Check Delivery location and franchise login of order
    if(order.deliveryareaId != undefined && order.deliveryareaId != null && order.deliveryareaId != ""){
        let where = {franchiseId:mongodb.ObjectId(order.franchiseId)};
        let franchiseArea = await franchiseDatalayers.checkfrareas(where);
        let issamearea = 0
        franchiseArea.forEach((ele, index) => {
            if (ele.areaId == order.deliveryareaId) { 
                issamearea = 1;
            }
        })
        if(issamearea==0){
            res.json({
                sucess: errorsCodes.BAD_REQUEST,
                msg: 'Your delivery area and Franchise area are not same..',
            });
            return;
        }
    }

    //-----Order varient check for product 
    let cart_item = [];
    productsDatalayers.getCartDetailsByVarientId(where)
        .then((result) => {  
        let cart_total = []; 
        result.forEach(ele => { 
            if(is_wholesaler=='1'){
               var pvarprice = ele.productvar[0].wholesale;
               var discAmt = 0;
            }else{
               var pvarprice = ele.productvar[0].price;
               var discAmt = ((ele.productvar[0].disc_price / 100))*(pvarprice * (ele.qty));
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
                title: ele.productvar[0].frProducts[0].products[0].title
            });
        }); 
    })
    .catch((err) => {
        throw err;
    });

    let franchiseProducts = await franchiseproductsDatalayer.getfranchiseProductsAndVariants(mongodb.ObjectId(order.franchiseId));

    let err_msg = [];
    let frpIds = [];
    let ordered_variants = [];
    let order_variants = cart_item;
    ////console.log(order_variants);
    //**********Code for app where frproductId & frproductvarId same  */
    order_variants.forEach((ele, index) => {
        if (ele.frproductId == ele.frproductvarId) {
            franchiseProducts.forEach((fp_ele, index_in) => {
                if (fp_ele.variants.length > 0) {
                    fp_ele.variants.forEach((fp_ele_var) => {
                        if (fp_ele_var._id == ele.frproductId) {
                            order_variants[index].frproductId = String(fp_ele_var.frproductId);
                        }
                    });
                }
            });
        }
    });
    //**********Code for app where frproductId & frproductvarId same  */
    let temp = { frproductId: '', order_val: 0 };
    frpIds = order_variants.map((ele) => { return ele.frproductId; });
    frpIds = frpIds.filter(function(ele, index, frpIds) { return index == frpIds.indexOf(ele); });
    order_variants.forEach((ele) => {
        temp = { frproductId: '', order_val: 0 };
        switch (ele.unit) {
            case '1':
                {
                    temp.frproductId = ele.frproductId;
                    temp.order_val = parseInt(ele.measurement) * 1000 * parseInt(ele.qty);
                    break;
                }
            case '3':
                {
                    temp.frproductId = ele.frproductId;
                    temp.order_val = parseInt(ele.measurement) * 1000 * parseInt(ele.qty);
                    break;
                }
            default:
                {
                    temp.frproductId = ele.frproductId;
                    temp.order_val = ele.measurement * parseInt(ele.qty);
                    break;
                }
        }
        ordered_variants.push(temp);
    });

    if (frpIds.length > 0) {
        temp = ordered_variants;
        ordered_variants = [];
        frpIds.forEach((ele_frpId) => {
            let t = temp.filter((ele) => { return ele.frproductId == ele_frpId; });
            let total_order_val = t.reduce((p, n) => { return p + n.order_val; }, 0);
            ordered_variants.push({ frproductId: ele_frpId, order_val: total_order_val });
        });
    }

    let order_varify_flag = true;
    order_variants.forEach((ele) => {
        let db_products = []; 

        db_products = franchiseProducts.filter((fpEle) => {  
            return ((fpEle._id).toString() == (ele.frproductId).toString());
        });
       // console.log(ele);
        let max_order = 0;
        if (db_products[0].product_max_order) {
            switch (db_products[0].product_unit) {
                case 1:
                    {
                        max_order = db_products[0].product_max_order * 1000;
                        break;
                    }
                case 3:
                    {
                        max_order = db_products[0].product_max_order * 1000;
                        break;
                    }
                default:
                    {
                        max_order = db_products[0].product_max_order;
                        break;
                    }
            }
        }
        
        if (max_order) {
            let temp = ordered_variants.filter((ov_ele) => {
                return ((ov_ele.frproductId).toString() == (db_products[0]._id).toString());
            });

            temp = temp[0].order_val
            if (temp > max_order && is_wholesaler=='0') {
                err_msg.push(`The order limit of "${ele.title}" is exceeded `);
                order_varify_flag = false;
            }
        }

        let db_products_variants = db_products[0].variants;
        let db_ordered_variants = db_products_variants.filter((vEle) => {
            return ((ele.frproductvarId).toString() == (vEle._id).toString())
        });  

       
     
        if(is_wholesaler=='1'){
            if (db_ordered_variants[0].wholesale != ele.price) {
                err_msg.push(`The wholesale price of "${ele.title}" is updated by ${process.env.APPNAME}.'`);
                order_varify_flag = false;
            }
        }else{
            if (db_ordered_variants[0].price != ele.price) {
                err_msg.push(`The price of "${ele.title}" is updated by "${process.env.APPNAME}".'`);
                order_varify_flag = false;
            }
        } 

        if(is_wholesaler=='1')
        {
            if (db_ordered_variants[0].is_ws_active != '1') {
                err_msg.push(`"${ele.title}" is not available please update your cart.`);
                order_varify_flag = false;
            }
        }
        else
        {
            if (db_ordered_variants[0].is_active != '1') {
                err_msg.push(`"${ele.title}" is not available please update your cart.`);
                order_varify_flag = false;
            }
        }


       
    });
    if (!order_varify_flag) {
        res.json({
            sucess: errorsCodes.UNPROCESSABLE_ENTITY,
            msg: err_msg.join('\n')
        });
        return;
    }
   
    next();
};