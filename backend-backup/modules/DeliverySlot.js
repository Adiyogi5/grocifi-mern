const mongoose = require("mongoose");

const deliveryslotSchema = new mongoose.Schema({
    start_time:{
        type: String,
    },
    end_time:{
        type: String,
    },
    value:{
        type: Number,
    },
    default:{
        type: Number,
        default: "0",
    },
    franchiseId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
        defaful: null
    },
    created: {
        type: Date,
        default: Date.now(),
    },
    modified: {
        type: Date,
        default: Date.now(),
    },

});

const deliveryslotModel = mongoose.model("deliveryslots", deliveryslotSchema);

module.exports = deliveryslotModel;