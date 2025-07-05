const mongoose = require("mongoose");

const popsliderSchema = new mongoose.Schema({
    franchiseId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    popup_img: {
        type: String,
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
    }
});

const popslider = mongoose.model("popslider", popsliderSchema);
module.exports = popslider;