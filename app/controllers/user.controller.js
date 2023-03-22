const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const db = require("../models");
const User = db.user;
const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");

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
exports.uploadAvatar = asyncHandler(async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    try {
        let uploader = (path) => cloudinaryUploadImg(path, "images");
        const urlImg = [];
        const files = req.files;
        const { id } = req.params;
        if (files) {
            const path = files.images.tempFilePath;
            const newpath = await uploader(path);
            urlImg.push(newpath);
        }
        const userUpdated = await User.findByIdAndUpdate(id, { avatar: urlImg[0].url }, { new: true });
        res.json(userUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error occurred.' });
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