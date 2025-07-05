const mongoose = require('mongoose');

var LuckyDrawSchema = new mongoose.Schema({
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
    offer_winner: {
        type: Number // Use for count total winners 
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
    is_lock: {
        type: String,
        default: '0'   // 0= not, 1=yes  (offer lock after start date)
    }, 
    is_active: {
        type: String,
        default: '1'   // 1= active, 2=inactive,
    },
    is_generate: {
        type: String,
        default: '0'   // 0= not generate, 1= generate winner
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
var luckydrawModel = mongoose.model('lucky_draw_offers', LuckyDrawSchema);
module.exports = luckydrawModel;