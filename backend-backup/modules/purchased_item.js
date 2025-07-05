const mongoose = require('mongoose');

module.exports = mongoose.model(
    'purchased_item',
    new mongoose.Schema({
        franchise_id: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
        franchise_product_id: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
        stock: {
            type: Object,
            default: null,
            /**
             * {
             *  quantity_1:0,
             *  unit_1:0,
             *  quantity_2:0,
             *  unit_2:0,
             * }
             */
        },
        price: {
            type: Number,
            default: null,
        },
        total_price: {
            type: Number,
            default: null,
        },
        pm_id: {
            type: mongoose.Types.ObjectId,
            default: null,
        },
        sm_id: {
            type: mongoose.Types.ObjectId,
            default: null,
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