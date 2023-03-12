const db = require("../models");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");

const Cart = db.cart;
const User = db.user;
const Product = db.product;
const Order = db.order;




const createOrder = asyncHandler(async(req, res) => {
    const { idUser, method, destination, phone, note } = req.body;
    if (!ObjectId.isValid(idUser)) throw new Error("Invalid id!");
    try {
        if (!method) throw new Error("Create cash order failed");
        let userCart = await Cart.findOne({ orderBy: idUser }).populate("isUsedCoupon.couponTnfo");
        let finalAmout = 0;
        finalAmout = userCart.cartTotal;
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                method: method,
                amount: finalAmout,
                status: "Processing",
                created: Date.now(),
                currency: "vnd",
                destination,
                phone,
                note,
                couponUsed: userCart.isUsedCoupon.couponTnfo
            },
            orderBy: idUser,
            orderStatus: "Processing",
        }).save();
        console.log("🚀 ~ file: order.controller.js:39 ~ createOrder ~ newOrder:", newOrder)

        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });

        const updated = await Product.bulkWrite(update, {});
        await Cart.findOneAndRemove({ orderBy: idUser });
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
            .populate("paymentIntent.couponUsed")
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
                "paymentIntent.status": status,
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