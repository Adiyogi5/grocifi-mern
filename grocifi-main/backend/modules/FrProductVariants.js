const mongoose = require('mongoose');

const frproductvariantsSchema = new mongoose.Schema({
    frproductId: { //id from frproducts collection
        type: mongoose.Types.ObjectId
    },
    measurment: {
        type: Number,
        required: true
    },
    unit: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        default: 0,
        required: true
    },
    wholesale: {
        type: Number,
        default: 0,
        required: true
    },
    disc_price: { //Discounted Price
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    max_order: {
        type: Number,
        default: 0,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: "Description"
    },
    show_default: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: String,
        default: "1" //1- active, //2-inactive, //3-Sold, 
    },
    is_ws_active: {
        type: String,
        default: "1" //1- active, //2-inactive, //3-Sold, 
    },
    franchiseId: {
        type: mongoose.Types.ObjectId
    },
    productId: {
        type: mongoose.Types.ObjectId
    },
    procode:{
        type: String,
        default: null
    },
    catId: {
        type: mongoose.Types.ObjectId
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

const frproductvariants = mongoose.model('frproductvariants', frproductvariantsSchema);

module.exports = frproductvariants;