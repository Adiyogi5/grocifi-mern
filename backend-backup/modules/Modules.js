const mongoose = require("mongoose");

const modulesSchema = new mongoose.Schema({
    name:String, 
    is_view: { type: Number, enum: [0, 1, 2], default: 1 },
    is_add: { type: Number, enum: [0, 1, 2], default: 1 },
    is_edit: { type: Number, enum: [0, 1, 2], default: 1 },
    is_delete: { type: Number, enum: [0, 1, 2], default: 1 },
    created:{
        type:Date,
        default:Date.now()
    }
});

const modules = mongoose.model("modules", modulesSchema);
module.exports = modules;