const mongoose = require('mongoose');

const franchisecategorySchema = new mongoose.Schema({
    franchiseId:{
        type:mongoose.Types.ObjectId
    },
    catId:{
        type:mongoose.Types.ObjectId
    },
    is_active:{
        type:String,
        trim:true,
        default:"1"
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

const franchisecategory = mongoose.model('franchisecategory',franchisecategorySchema);
module.exports = franchisecategory;