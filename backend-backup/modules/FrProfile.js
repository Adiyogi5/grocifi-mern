const mongoose = require('mongoose');
//First Name, Last Name, email, dob, photo, mobile no, password, ---- Firm Name, Owner Name, Onwer Mobile No, Contact Person Name & Mobile No, Commision(%), Address, C,S,C,A,SA, Zip, Photo/Logo					
const frprofileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId
    },
    firm_name:{
        type:String,
        default:null
    },
    owner_name:{
        type:String,
        default:null
    },
    logo:{
        type:String,
        default:null
    },
    owner_mobile:{
        type:String,
        default:null
    },
    contact_name:{
        type:String,
        default:null
    },
    contact_mobile:{
        type:String,
        default:null
    },
    commition:{
        type:String,
        //type:Float32Array,
        default:null
    },
    is_active:{
        type:String,
        trim:true,
        default:"1"
    },
    createdby:{
        type:mongoose.Types.ObjectId,
        default:null
    },
    created:{
        type:Date,
        default:Date.now()
    },
    modifiedby:{
        type:mongoose.Types.ObjectId,
        default:null
    },
    modified:{
        type:Date,
        default:Date.now()
    }
});

const frprofile = mongoose.model('frprofile',frprofileSchema);
module.exports = frprofile;