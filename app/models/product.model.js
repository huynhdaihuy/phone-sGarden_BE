const mongoose = require("mongoose");

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
        },
        images: String,
        color: String,
        ram: Number,
        os: {
            type: String,
            trim: true,
        },
        memory: Number,
        camFront: Number,
        camBack: Number,
        series: String,
        pin: Number,

    }, { timestamps: true })
);

module.exports = Product;