const mongoose = require("mongoose");

var groupTypesSchema = new mongoose.Schema({
    Role_title:String,
    list_controller_id:{
        type:mongoose.Types.ObjectId
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

})

var groupTypeModel = mongoose.model('group_type_model',groupTypesSchema);

module.exports = groupTypeModel;