const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    title:String,
    stateId:mongoose.Types.ObjectId,
    is_active:{
        type:String,
        trim:true,
        default:"1"
    },
    createdby:{
        type:mongoose.Types.ObjectId
    },
    created:{
        type:Date,
        default:Date.now()
    },
    modifiedby:{
        type:mongoose.Types.ObjectId
    },
    modified:{
        type:Date,
        default:Date.now()
    }
});

const city = mongoose.model("city", citySchema);
module.exports = city;