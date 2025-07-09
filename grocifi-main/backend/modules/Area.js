const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
    title: {
        type: String
    },
    cityId: {
        type: mongoose.Types.ObjectId
    },
    group_id: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    is_active: {
        type: String,
        trim: true,
        default: "1"
    },
    created: {
        type: Date,
        default: Date.now()
    },
    modified: {
        type: Date,
        default: Date.now()
    },
    createdby: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    modifiedby: {
        type: mongoose.Types.ObjectId,
        default: null
    }
});

const area = mongoose.model("area", areaSchema);
module.exports = area;