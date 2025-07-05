const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: null
    }, 
    frproductId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    frproductvarId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    unit: { type: Number, trim: true, default: 0 },
    qty: { type: Number, trim: true, default: 0 },
    ///price: { type: Number, trim: true, default: 0 },
    date_added: Date,
    session_id: String,
});

const cart = mongoose.model('cart',cartSchema);

module.exports=cart;
