const mongoose = require('mongoose');

const useripSchema = new mongoose.Schema({
    phone_ip: String,
    friend_code: String,
    is_active: {
        type: Number,
        default: 1
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    }
});

const userip = mongoose.model('userip', useripSchema);
module.exports = userip;