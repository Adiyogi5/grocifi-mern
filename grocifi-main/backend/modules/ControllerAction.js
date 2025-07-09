const mongoose = require('mongoose');

const ControllerActionSchema = new mongoose.Schema({
    role_type: {
        type: Number
    },
    action_id: {
        type: mongoose.Types.ObjectId
    },
    is_active: {
        type: Number,
        default: 1
    },
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
    createdby: { type: mongoose.Types.ObjectId },
    modifiedby: { type: mongoose.Types.ObjectId }
})

var controlleraction = mongoose.model('controlleraction', ControllerActionSchema);

module.exports = controlleraction;