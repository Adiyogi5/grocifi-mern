const mongoose = require("mongoose");

const subareaSchema = new mongoose.Schema({
    title:String,
    areaId:mongoose.Types.ObjectId,
    cityId:mongoose.Types.ObjectId,
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

const subarea = mongoose.model("subarea", subareaSchema);
module.exports = subarea;