// create product_sociallogs
const mongoose = require("mongoose");

const ProductWishlistSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    product_id: {
        type: mongoose.Types.ObjectId,
        required: false
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

const productwishlist = mongoose.model("product_wishlist", ProductWishlistSchema);
module.exports = productwishlist;
 