const mongoose = require('mongoose');

const productimageSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    productId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    isMain:{
        type:Boolean,
        required:false
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
        type:mongoose.Types.ObjectId
    },
    modifiedby:{
        type:mongoose.Types.ObjectId
    }
});
const productimage = mongoose.model('productimage',productimageSchema);
module.exports=productimage;