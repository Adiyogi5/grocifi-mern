const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name            : { type: String, required: true, unique: true, trim: true }, 
    status          : { type: Number, default: 1 },
    deletedAt       : { type: Date, default: null},
},{ 
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true }
});

module.exports = mongoose.model('Role', Schema);