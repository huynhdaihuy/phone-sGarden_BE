const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        enum: ['percent', 'specific'],
        required: true,
    },
    discountAmount: {
        type: Number,
        required: true,
    },
    minimumAmount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;