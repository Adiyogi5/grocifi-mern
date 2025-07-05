const mongoose = require('mongoose');

const ListControllerActionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    controller: {
        type: String
    },
    action: {
        type: String
    },
    method: {
        type: String,
        default: 'GET'
    },
    is_active: {
        type: Number,
        default: 1
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
})

var listcontrolleraction = mongoose.model('listcontrolleraction', ListControllerActionSchema);


module.exports = listcontrolleraction;