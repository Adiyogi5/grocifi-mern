const mongoose = require('mongoose');

var DailyOrderFinalListProduct = new mongoose.Schema({
    daily_order_final_list_id: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    product_name: {
        type: String,
        default: null
    },
    number_of_order: {
        type: Number,
        default: 0
    },
    qty: {
        type: Number,
        default: 0
    },
    unit: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
        default: null
    }
});

//module.exports = mongoose.model('daily_order_final_list_product', DailyOrderFinalListProduct);

const daily_order_final_list_product = mongoose.model("daily_order_final_list_product", DailyOrderFinalListProduct);
module.exports = daily_order_final_list_product;