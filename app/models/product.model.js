const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
        default: 10,
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
    camFront: String,
    camBack: String,
    series: String,
    pin: Number,
    sale: {
        isOnSale: {
            type: Boolean,
            default: false,
        },
        salePercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        }
    },
}, { timestamps: true });


const Product = mongoose.model("Product", productSchema);
module.exports = Product