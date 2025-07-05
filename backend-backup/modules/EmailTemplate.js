const mongoose= require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
    title:String,
    subject:String,
    body:String,
    is_active:{
        type:Number,
        default:1
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


const email_template = mongoose.model('email_template',emailTemplateSchema);


module.exports = email_template;