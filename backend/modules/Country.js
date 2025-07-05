const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    cid: Number,
    title: String,
    is_active: {
        type: String,
        trim: true,
        default: "1"
    },
    createdby: {
        type: mongoose.Types.ObjectId
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modifiedby: {
        type: mongoose.Types.ObjectId
    },
    modified: {
        type: Date,
        default: Date.now()
    }
});

const country = mongoose.model('country', countrySchema);

module.exports = country;