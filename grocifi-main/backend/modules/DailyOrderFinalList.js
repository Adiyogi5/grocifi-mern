const mongoose = require('mongoose');

var DailyOrderFinalList = new mongoose.Schema({
    date_from: {
        type: Date,
        default: Date.now()
    },
    date_to: {
        type: Date,
        default: Date.now()
    },
    total_amount: {
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

//module.exports = mongoose.model('daily_order_final_list', DailyOrderFinalList);
const daily_order_final_list = mongoose.model("daily_order_final_list", DailyOrderFinalList);
module.exports = daily_order_final_list;