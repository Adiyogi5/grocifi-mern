const mongoose = require('mongoose');  
 
const userSchema = new mongoose.Schema({
    prvId: {
        type: Number,
        default: null
    },
    order_count: {
        type: Number,
        default: null
    },
    fname: {
        type: String,
        default: "",
        trim: true
    },
    lname: {
        type: String,
        default: "",
        trim: true
    },
    email: {
        type: String,
        default: null 
    },
    phone_no: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    device_id: {
        type: String,
        default: null
    },
    device_token: {
        type: String,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    password: {
        type: String,
    },
    img: {
        type: String,
        default: "noimage.png"
    },
    wallet_balance: {
        type: Number,
        default: 0.00
    },
    role_type: {
        type: String,
        default: "4"
    },
    refer_code: {
        type: String,
        unique: true,
        default: null
    },
    friends_code: {
        type: String,
        default: null
    },
    is_active: {
        type: String,
        trim: true,
        default: "1"
    },
    app_version: {
        type: Number,
        default: 14
    },
    os_devid_vc: {
        type: String,
        default: null
    },
    reg_from: {
        type: String,
        default: ''
    },
    order_status: {
        type: Object,
        default: null
    },
    delivery_detail: {
        type: Object,
        default: null
    },
    last_order_date: {
        type: Date,
        default: null
    },
    franchise_id: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    visiting_card: {
        type: String,
        default: null
    },
    gst_no: {
        type: String,
        default: null
    },
    rating: {
        type: Number,
        default: 0
    },
    is_wholesaler: {
        type: Boolean,
        default: false
    },
    wholesaler_firmname: {
        type: String,
        default: null
    },
    is_wholesaler_approve: {
        type: Number,
        default: 0
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    modified: {
        type: Date,
        default: Date.now()
    } 
});

const user = mongoose.model('user', userSchema);
module.exports = user;