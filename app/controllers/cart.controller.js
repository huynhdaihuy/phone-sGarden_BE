const db = require("../models");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");

const Cart = db.cart;
const User = db.user;
const Product = db.product;



const addCart = asyncHandler(async(req, res) => {
    const { _id, cart } = req.body;
    console.log("🚀 ~ file: cart.controller.js:12 ~ addCart ~ cart:", cart)
    try {
        let products = [];
        const user = await User.findById(_id);

        const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            console.log("🚀 ~ file: cart.controller.js:24 ~ addCart ~ cart[i]._id:", cart[i]._id)
            object.count = cart[i].count;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user._id,
        }).save();
        res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
});

const getUserCart = asyncHandler(async(req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) throw new Error("Invalid id!");
    try {
        const cart = await Cart.findOne({ orderBy: id }).populate(
            "products.product"
        );
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async(req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) throw new Error("Invalid id!");
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderBy: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    addCart,
    getUserCart,
    emptyCart
}