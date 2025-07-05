const mongoose = require("mongoose");

const AdminpermissionSchema = new mongoose.Schema({
    name:String, 
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    is_view: { type: Number, enum: [0, 1, 2], default: 1 },
    is_add: { type: Number, enum: [0, 1, 2], default: 1},
    is_edit: { type: Number, enum: [0, 1, 2], default: 1 },
    is_delete: { type: Number, enum: [0, 1, 2], default: 1 },
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

const admin_permission = mongoose.model("admin_permissions", AdminpermissionSchema);
module.exports = admin_permission;