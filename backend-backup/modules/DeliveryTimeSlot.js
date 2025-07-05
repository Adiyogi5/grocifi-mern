const mongoose = require("mongoose");

const deliverytimeslotSchema = new mongoose.Schema({
    time_slot_0: { //any time
        type: Number,
        default: 0 //0 for no limit
    },
    time_slot_1: {
        type: Number,
        default: 0 //0 for no limit
    },
    time_slot_2: {
        type: Number,
        default: 0 //0 for no limit
    },
    time_slot_3: {
        type: Number,
        default: 0 //0 for no limit
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

const deliverytimeslotModel = mongoose.model("deliverytimeslots", deliverytimeslotSchema);

module.exports = deliverytimeslotModel;