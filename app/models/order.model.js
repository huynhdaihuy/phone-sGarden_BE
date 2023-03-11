const mongoose = require("mongoose");

const Order = mongoose.model("Order", new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        count: Number,
        price: String,
    }, ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Cash on Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
        ],
    },
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
}))

module.exports = Order