const moongoose = require('mongoose');

var deliveryBoySchema = new moongoose.Schema({
    userId:{
        type:moongoose.Types.ObjectId,
        required:true
    },
    franchiseId: {
        type:moongoose.Types.ObjectId,
        required:true
    },
    address: {
        type: String,
        default: "",
        trim: true
    },
    is_active:{
        type:String,
        default:'1'
    },
    created:{
        type:Date,
        default:Date.now()
    },
    is_approved: {
        type: String,
        trim: true,
        default: "0"
    },   
    approvedby:{
        type:moongoose.Types.ObjectId,
        default:null
    }, 
    modified:{
        type:Date,
        default:Date.now()
    },
    createdby:{
        type:moongoose.Types.ObjectId,
        default:null
    },
    modifiedby:{
        type:moongoose.Types.ObjectId,
        default:null
    }
});

var deliveryBoyModel = moongoose.model('franchise_delivery_boy',deliveryBoySchema);


module.exports = deliveryBoyModel;