const mongoose = require('mongoose');

var orderVariantsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    franchiseId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    frproductId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    frproductvarId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    title: String,
    unit: Number,
    measurement: Number,
    image_url: String,
    qty: Number,
    price: Number,

    revised_unit: Number,
    revised_measurement: Number,
    revised_qty: Number,
    revised_price: Number,
    revised_status: Number, //0 => not available or cancel, 1 => available, 2 => returned
    tax_percent: Number,
    tax_amount: Number,
    wholesale_discount: Number,
    wholesale_price: Number,
    orderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    order_status: {
        type: String,
        trim: true,
        default: "1" //1-recieved, 2-processed, 3-shipped, 4-delivered, 5-returned, 6-cancel
    },
    delivery_date: {
        type: Date,
        default: Date.now()
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
    },

})

var orderVariant = mongoose.model('order_variants', orderVariantsSchema);

module.exports = orderVariant;