const mongoose = require('mongoose');

const carttotalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: null
    }, 
    session_id: String,
    promo_code: { type: String, default: null },
    promo_disc: { type: Number, trim: true, default: 0 },
    disc: { type: Number, trim: true, default: 0 },
    delivery_charge: { type: Number, trim: true, default: 0 },
    user_wallet: { type: Number, trim: true, default: 0 },
    total: { type: Number, trim: true, default: 0 },
    final_total: { type: Number, trim: true, default: 0 },
    date_added: Date,
    
});

const carttotal = mongoose.model('cart_total',carttotalSchema);

module.exports=carttotal;
