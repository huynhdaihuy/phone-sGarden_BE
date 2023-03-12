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
    paymentIntent: {
        method: {
            type: String,
            default: "COD"
        },
        amount: {
            type: Number,
            default: Number
        },
        status: {
            type: String,
            default: "Processing"
        },
        created: {
            type: Date
        },
        currency: {
            type: String,
            default: 'vnd'
        },
        destination: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
            unique: [true, 'User"s phone number required'],
            maxLength: 10,
            match: [/0[35789]\d{8}$/, 'Format of phone is invalid !']
        },
        note: {
            type: String
        },
        couponUsed: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            default: null
        }
    },
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