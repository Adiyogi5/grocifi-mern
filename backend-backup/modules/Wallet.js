const mongoose = require('mongoose');

var walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    prvId: {
        type: Number,
        default: null
    },
    current_wallet: {
        type: Number,
        default: 0,
        required: true
    },
    wallet_amount: {
        type: Number,
        required: true
    },
    updated_wallet: {
        type: Number,
        default: 0,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    transaction: {
        type: String,
        default: '1' //1=Credit, 2=Debit
    },
    is_active: {
        type: String,
        default: '1' //1 - active, 2 - used, 3 - expired
    },
    is_admin: {
        type: String,
        default: '0' //1=admin, 0=none
    },
    expire_on: {
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
    }

});

var walletModel = mongoose.model('wallet_log', walletSchema);

module.exports = walletModel;