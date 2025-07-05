const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: "Other Catagory"
    },
    catagory_id: {
        type: mongoose.Types.ObjectId,
        default: null // master catagory takes null and other takes their master catagory as their id
    },
    catcode:{
        type: String,
        default: null
    },
    slug:{
        type: String,
        required: true,
        default: null
    },
    priority: {
        type: Number,
        default: null
    },
    description: String,
    catagory_img: String,
    allow_upload: {
        type: Boolean,
        default: false
    },
    coming_soon: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: String,
        default: "1"
    },
    is_feature: {
        type: String,
        default: "0"
    },
    createdby: {
        type: mongoose.Types.ObjectId,
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
    },
    modified: {
        type: Date,
        default: Date.now(),
    }
});

const catagory = mongoose.model('catagory_subcatagory', catagorySchema);

module.exports = catagory;