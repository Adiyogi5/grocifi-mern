const mongoose = require('mongoose');

module.exports = mongoose.model(
    'role',
    new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        role_code: {
            type: Number,
            required: true,
            unique: true
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