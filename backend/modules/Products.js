const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    search_title: {
        type: String,
        default: null,
        required: true
    },
    catId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    procode:{
        type: String,
        default: null
    },
    description: {
        type: String,
        required: true
    },
    is_global:{
        type:Boolean,
        default:false
    },
    is_active: {
        type: String,
        trim: true,
        default: "1"
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    },
    createdby: {
        type: mongoose.Types.ObjectId
    },
    modifiedby: {
        type: mongoose.Types.ObjectId
    }
});

const product = mongoose.model('product', productSchema);

module.exports = product;