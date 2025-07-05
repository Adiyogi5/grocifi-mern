const mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    order_date: {
        type: String,
        default: Date.now()
    },
    order_s: {
        type: Object
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    },

});

var logModel = mongoose.model('log', logSchema);

module.exports = logModel;