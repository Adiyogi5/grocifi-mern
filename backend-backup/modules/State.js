const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    sid: Number,
    title: String,
    is_active: {
        type: String,
        trim: true,
        default: "1"
    },
    countryId: {
        type: mongoose.Types.ObjectId
    },
    createdby: {
        type: mongoose.Types.ObjectId
    },
    modifiedby: {
        type: mongoose.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    }
});

const state = mongoose.model('state', stateSchema);

module.exports = state;