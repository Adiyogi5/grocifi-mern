const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    address_type: {
        type: Number,
        default: 1
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    phone_no: String,
    default_address: {
        type: Boolean,
        default: false
    },
    lat: {
        type: Number,
        default: 0.00
    },
    long: {
        type: Number,
        default: 0.00
    },
    address1: {
        type: String,
        default: null
    },
    address2: {
        type: String,
        default: null
    },
    pincode: {
        type: String,
        default: null
    },
    sub_areaId: {
        type: mongoose.Types.ObjectId,
        default: null
            //required: true
    },
    areaId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    cityId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    stateId: mongoose.Types.ObjectId,
    countryId: mongoose.Types.ObjectId,
    is_active: {
        type: String,
        trim: true,
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

const address = mongoose.model("address", AddressSchema);
module.exports = address;