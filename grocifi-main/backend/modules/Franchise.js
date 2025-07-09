const mongoose = require('mongoose');
const franchiseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId
    },
    firmname:{
        type:String,
        required:true
    },
    ownername:{
        type:String,
        required:true
    },
    ownermobile:{
        type:String,
        maxlength:10,
        minlength:10,
        required:true
    },
    logo:{
        type:String,
        default:null
    },
    contactpersonname:{
        type:String,
        required:true
    },
    contactpersonmob:{
        type:String,
        maxlength:10,
        minlength:10,
        required:true
    },
    commission:{
        type:Number,
        default:0.00,
        required:true
    },
    is_global:{
        type:Boolean,
        default:false
    },
    is_active:{
        type:String,
        trim:true,
        default:"1"
    },
    is_cod:{    //Cash On Delivery
        type:Boolean,
        default:true
    },    
    wallet_balance: {
        type: Number,
        default: 0.00
    },
    isallow_global_product:{
        type:Boolean,
        default:true
    },
    min_order: {
        type: String,
        default: null
    },
    min_order_wholesaler: {
        type: String,
        default: null
    },
    delivery_chrge: {
        type: String,
        default: null
    },
    accept_minimum_order: {
        type: Boolean,
        default: true
    },
    delivery_day_after_order: {
        type: Number
    },
    delivery_max_day: {
        type: Number
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

const franchise = mongoose.model('franchise',franchiseSchema);
module.exports = franchise;