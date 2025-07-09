const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    mtitle: {
        type: String,
        default: null
    },
    mbody: {
        type: String,
        default: null
    },
    mimg: {
        type: String,
        default: null
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    is_read: {
        type: Boolean,
        default: false
    },
    is_general: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: String,
        trim: true,
        default: "1"
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

const notification = mongoose.model("notification", notificationSchema);
module.exports = notification;