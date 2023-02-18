const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};

exports.getAllUser = asyncHandler(async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        throw new Error(error);
    }
});

exports.findOne = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    else
        try {
            const user = await User.find({ _id: req.params.id });
            res.json(user);
        } catch (error) {
            throw new Error(error);
        }
});

exports.update = asyncHandler(async(req, res) => {
    console.log("🚀 ~ file: user.controller.js:45 ~ exports.update=asyncHandler ~ req.body", req.body)
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    else
        try {
            const users = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { returnDocument: "after" });
            res.json(users);
        } catch (error) {
            throw new Error(error);
        }
});

exports.delete = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    else
        try {
            const user = await User.deleteOne({ _id: req.params.id });
            res.json(user);
        } catch (error) {
            throw new Error(error);
        }
});