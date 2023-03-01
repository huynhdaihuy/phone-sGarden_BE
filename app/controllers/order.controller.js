const db = require("../models");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
var uniqid = require('uniqid');

const Cart = db.cart;
const User = db.user;
const Product = db.product;
const Order = db.order;




const createOrder = asyncHandler(async(req, res) => {
    const { _id, method } = req.body;
    if (!ObjectId.isValid(_id)) throw new Error("Invalid id!");
    try {
        if (!method) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderBy: _id });
        console.log("🚀 ~ file: order.controller.js:21 ~ createOrder ~ userCart:", userCart)
        let finalAmout = 0;
        finalAmout = userCart.cartTotal;
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: method,
                amount: finalAmout,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "vnd",
            },
            orderBy: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        await Cart.findOneAndRemove({ orderBy: _id });
        res.json({ message: "success" });
    } catch (error) {
        throw new Error(error);
    }
});

const getOdrerByID = asyncHandler(async(req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new Error("Invalid id!");
    try {
        const userorders = await Order.findOne({ _id: id })
            .populate("products.product")
            .populate("orderBy")
            .exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllOrders = asyncHandler(async(req, res) => {
    try {
        const alluserorders = await Order.find()
            .populate("products.product")
            .populate("orderBy")
            .exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});

const getUserAllOdrer = asyncHandler(async(req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new Error("Invalid id!");
    try {
        const allUserOrders = await Order.find({ orderBy: id })
            .populate("products.product")
            .populate("orderBy")
            .exec();
        res.json(allUserOrders);
    } catch (error) {
        throw new Error(error);
    }
});
const updateOrderStatus = asyncHandler(async(req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    if (!ObjectId.isValid(id)) throw new Error("Invalid id!");
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id, {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            }, { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});
module.exports = {
    createOrder,
    getOdrerByID,
    getAllOrders,
    updateOrderStatus,
    getUserAllOdrer
}