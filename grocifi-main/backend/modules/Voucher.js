const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
     
    user_id: {
        type: mongoose.Types.ObjectId,
        default: null // delivey boy id
    }, 
    amount: {
        type: Number,
        default: 0
    }, 
    is_active: {
        type: String,
        default: "1"   //0= deleted, 1=active
    },
    createdby: {
        type: mongoose.Types.ObjectId,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
    },
    modified: {
        type: Date,
        default: Date.now(),
    }
});

const voucher = mongoose.model('vouchers', voucherSchema);

module.exports = voucher;