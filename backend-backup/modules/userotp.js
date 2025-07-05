const mongoose = require('mongoose');

const userotpSchema = new mongoose.Schema({
    phone_no:String,
    otp:{
        type:String,
        default:null
    },
    created:{
        type:Date,
        default:Date.now()
    },
    modified:{
        type:Date,
        default:Date.now()
    }
});

const userotp = mongoose.model('userotp',userotpSchema);

module.exports=userotp;