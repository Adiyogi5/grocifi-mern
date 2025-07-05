const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    franchiseId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    cancelled_id: {
        type: mongoose.Types.ObjectId,
        required: null
    },
    opm_id: {
        type: mongoose.Types.ObjectId,
        required: null
    },
    order_type: {
        type: Number,
        default: 1
    },
    order_desc: {
        type: String,
        default: null
    },
    delivery_boy_id: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    discount: {
        type: Number,
        default: 0
    },
    discount_rupee: {
        type: Number,
        default: 0
    },
    delivery_address_id: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    delivery_address: {
        type: String,
        required: true
    },
    order_address: {
        street: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        area: {
            type: String,
        }
    },
    promo_code: {
        type: String,
        default: null
    },
    promo_discount: {
        type: Number,
        default: 0
    },
    delivery_date: {
        type: Date,
        default: Date.now()
    },
    orderUserId: {
        type: String,
    },
    razorpay_order_id: {
        type: String,
        default: null
    },
    razorpay_payment_id: {
        type: String,
    },
    paytm_payment_id: {
        type: String,
        default: null
    },
    paytm_status: {
        type: Object,
        default: null
    },
    delivery_day: {
        type: Number,
        default: 2
    },
    delivered_date: {
        type: Date,
        default: null
    },
    version_code: {
        type: Number,
        default: null
    },
    os_devid_vc: {
        type: String,
        default: null
    },
    tax_percent: {
        type: Number,
        default: null
    },
    tax_amount: {
        type: Number,
        default: null
    },
    total: {
        type: Number,
        default: null
    },
    final_total: {
        type: Number,
        default: null
    },
    opm_total: {
        type: Number,
        default: null
    },
    delivery_total: {
        type: Number,
        default: null
    },
    received_total: {
        type: Number,
        default: 0
    },
    is_active: {
        type: String,
        default: '1'
    },
    review: {
        type: Object,
        default: null
    },
    phone_no: {
        type: String,
        default: null
    },
    delivery_charge: {
        type: Number,
        default: null
    },
    delivery_time_id: {
        type: Number,
        default: 0
    },
    delivery_solt_id: {
        type: Object,
        default: null
    },
    delivery_time: {
        type:String,
        default: "Any Time"
    },
    key_wallet_used: {
        type: Boolean,
        default: null
    },
    key_wallet_balance: {
        type: String,
        default: null
    },
    remaining_wallet_balance: {
        type: Number,
        default: null
    },
    payment_status: {
        type: Number,
        default: 2
    },
    payment_method: {
        type: Number,
        default: null
    },
    latitude: {
        type: String,
        default: "0.0"
    },
    longitude: {
        type: String,
        default: "0.0"
    },
    is_wholesaler: {
        type: Boolean,
        default: false
    },
    ordered_by: {
        type: String,
        default: "androids"
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

const order = mongoose.model("order", orderSchema);
module.exports = order;