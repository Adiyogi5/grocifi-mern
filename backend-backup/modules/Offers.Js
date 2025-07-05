const mongoose = require('mongoose');

var OfferSchema = new mongoose.Schema({
    title: String,
    offer_img: String,
    franchise_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    description: {
        type: String,
        default: null
    },
    offer_type: {
        type: Number, // 1. offer 2.Section     
    },
    offer_order: {
        type: Number // Use for Showing order for the banners of offers 
    },
    start_date: {
        type: Date,
        default: null
    },
    expiry_date: {
        type: Date,
        default: null
    },
    is_expiry: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: String,
        default: '1'
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
var offerModel = mongoose.model('offer_banners', OfferSchema);
module.exports = offerModel;