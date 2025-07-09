const mongoose = require('mongoose');

const franchiseproductSchema = new mongoose.Schema({
    franchiseId: {
        type: mongoose.Types.ObjectId
    },
    productId: {
        type: mongoose.Types.ObjectId
    },
    catId: {
        type: mongoose.Types.ObjectId
    },
    priority: {
        type: Number,
        default: 1
    },
    isPacket: {
        type: Boolean,
        default: true
    },
    product_max_order: {
        type: Number,
        default: 1
    },
    product_quality: {
        type: Number,
        default: 1
    },
    product_unit: {
        type: Number,
        default: 1
    },
    isShown: { //show product on home page if true
        type: Boolean,
        default: false
    },
    is_active: {
        type: String,
        default: "1"
            //1- active, (Product active and available to sell) Available
            //2-inactive, (Product not active and not available to sell) Not Available
            //3-delete, 
            //4-sold (Product active but not available to sell),
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
        type: mongoose.Types.ObjectId
    },
    modifiedby: {
        type: mongoose.Types.ObjectId
    }
});

const franchiseproduct = mongoose.model('franchiseproduct', franchiseproductSchema);

module.exports = franchiseproduct;