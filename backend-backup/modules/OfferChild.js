const mongoose = require('mongoose');

var offerChildSchema = new mongoose.Schema({
    offer_id:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    product_id:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    is_active:{
        type:String,
        default:'1'
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

var offerChildModel = mongoose.model('offer_child',offerChildSchema);

module.exports = offerChildModel;
