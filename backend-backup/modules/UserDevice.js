const mongoose = require("mongoose");

const UserDeviceSchema = new mongoose.Schema({
    phone_no: {
        type: String,
        require: true
    },
    deviceId: {
        type: String,
        require: true
    },
    is_active: {
        type: String,
        default: "1"
    },
    createdby: {
        type: mongoose.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modifiedby: {
        type: mongoose.Types.ObjectId
    },
    modified: {
        type: Date,
        default: Date.now()
    }
});

const userdevice = mongoose.model("userdevice", UserDeviceSchema);
module.exports = userdevice;