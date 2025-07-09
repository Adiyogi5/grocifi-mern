const mongoose = require("mongoose");

const orderstatusSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    order_status:{
        type:String,
        required:true
    },
    // order_variant_id:{
    //     type:mongoose.Types.ObjectId,
    //     required:true
    // },
    status_date:{
        type:Date,
        default:Date.now()
    },
    is_active:{
        type:String,
        trim:true,
        default:"1" //1-recieved, 2-processed, 3-shipped, 4-delivered, 5-returned, 6-cancel
    },
    created:{
        type:Date,
        default:Date.now()
    },
    modified:{
        type:Date,
        default:Date.now()
    },
    createdby:{
        type:mongoose.Types.ObjectId,
        default:null
    },
    modifiedby:{
        type:mongoose.Types.ObjectId,
        default:null
    }
});

const orderstatus = mongoose.model("orderstatus", orderstatusSchema);
module.exports = orderstatus;