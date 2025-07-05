const mongoose = require('mongoose');

module.exports = mongoose.model(
    'holiday',
    new mongoose.Schema({
        holiday_date: {
            type: Date,
            default: Date.now()
        },
        franchiseId: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
        description: {
            type: String,
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