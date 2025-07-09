const mongoose = require("mongoose");

const UserDeviceTokenSchema = new mongoose.Schema({
    device_token: {
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

const userdevicetoken = mongoose.model("userdevicetoken", UserDeviceTokenSchema);
module.exports = userdevicetoken;