const Coupon = require('../models/coupon.model');
const Cart = require('../models/cart.model');

exports.createCoupon = async(req, res) => {
    try {
        const {
            code,
            discountType,
            discountAmount,
            minimumAmount,
            startDate,
            endDate,
            quantity,
        } = req.body;

        const coupon = new Coupon({
            code,
            discountType,
            discountAmount,
            minimumAmount,
            startDate,
            endDate,
            quantity,
        });

        await coupon.save();

        res.status(201).send({ message: 'Coupon created successfully.', coupon });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};

exports.getCoupons = async(req, res) => {
    try {
        const coupons = await Coupon.find();
        res.status(200).send(coupons);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};

exports.getCouponByCode = async(req, res) => {
    try {
        const { code } = req.query;

        const coupon = await Coupon.find(code);

        if (!coupon) {
            return res.status(404).send({ message: 'Coupon not found.' });
        }

        res.status(200).send(coupon);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};

exports.updateCoupon = async(req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).send({ message: 'Coupon not found.' });
        }

        const {
            code,
            discountType,
            discountAmount,
            minimumAmount,
            startDate,
            endDate,
            quantity,
        } = req.body;

        coupon.code = code || coupon.code;
        coupon.discountType = discountType || coupon.discountType;
        coupon.discountAmount = discountAmount || coupon.discountAmount;
        coupon.minimumAmount = minimumAmount || coupon.minimumAmount;
        coupon.startDate = startDate || coupon.startDate;
        coupon.endDate = endDate || coupon.endDate;
        coupon.quantity = quantity || coupon.quantity;

        await coupon.save();

        res.status(200).send({ message: 'Coupon updated successfully.', coupon });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};

exports.applyCoupon = async(req, res) => {
    try {
        const { code, idCart } = req.body;
        const coupon = await Coupon.findOne({ code });
        const cart = await Cart.findOne({ _id: idCart });

        if (!coupon) {
            return res.status(404).send({ message: 'Coupon not found.' });
        }
        if (cart.isUsedCoupon) {
            return res.status(400).send({ message: 'Coupon is alredy used !' });
        }
        if (coupon.quantity === 0) {
            return res.status(400).send({ message: 'Coupon is out of stock.' });
        }
        const totalCart = cart.cartTotal;
        if (totalCart < coupon.minimumAmount) {
            return res.status(400).send({ message: `Cart amount must be greater than or equal to ${coupon.minimumAmount}.` });
        }
        let discount = 0;
        if (coupon.discountType === 'percent') {
            discount = coupon.discountAmount / 100 * totalCart;
        } else {
            discount = coupon.discountAmount;
            if (discount > totalCart) {
                discount = totalCart;
            }
        }
        coupon.quantity -= 1;
        cart.cartTotal -= discount;
        await cart.save();
        await coupon.save();
        res.status(200).send({ message: 'Coupon applied successfully.', discount });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
}