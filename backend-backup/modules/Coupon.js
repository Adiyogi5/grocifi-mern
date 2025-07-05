const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    franchise_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    coupon: {
        type: String,
        required: true
    },
    has_expiry: {
        type: Boolean,
        default: true
    },
    start_date: {
        type: Date,
        default: null
    },
    end_date: {
        type: Date,
        default: null
    },
    uses_number: {
        type: Number //0 for unlimited and if 0 > then limited uses
    },
    used_number: {
        type: Number, //0 for unlimited and if 0 > then limited uses
        default: 0
    },
    reuse_by_same_user: {
        type: Boolean
    },
    disc_in: {
        type: Number //1=> in %, 2=> in Rs.
    },
    disc_value: {
        type: Number // % or Rs
    },
    is_active: {
        type: Number,
        default: 1
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

const coupon = mongoose.model("coupon", CouponSchema);
module.exports = coupon;