const mongoose = require("mongoose");

const Cart = new mongoose.model("Cart", mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        count: Number,
        price: Number,
    }],
    cartTotal: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isUsedCoupon: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
}))

module.exports = Cart