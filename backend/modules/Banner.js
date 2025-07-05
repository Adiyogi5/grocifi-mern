const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title:{
        type:String,
        default:'Banner'+'-'+Date.now()
    },
    is_active:{
        type:String,
        default:'1'
    },
    img:String,
    franchise_id:{
        type:mongoose.Types.ObjectId,
        default:null
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

const banner = mongoose.model('banner',bannerSchema);

module.exports=banner;