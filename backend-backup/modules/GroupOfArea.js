const mongoose = require('mongoose');

module.exports = mongoose.model(
    'group_of_area',
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        city_id: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        is_active: {
            type: Number,
            default: 1,
        },
        created: {
            type: Date,
            default: Date.now(),
        },
        modified: {
            type: Date,
            default: Date.now(),
        },
        createdby: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
        modifiedby: {
            type: mongoose.Types.ObjectId,
            default: null,
        }
    })
);