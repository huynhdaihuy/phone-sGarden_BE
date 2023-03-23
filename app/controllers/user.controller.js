const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
var nodemailer = require("nodemailer");


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

exports.forgotPassword = async(req, res) => {
    if (!ObjectId.isValid(req.params.id))
        res.send("Invalid Id!");
    const { id } = req.params
    const { email } = req.body

    const user = await User.findOne({ email });
    if (!user || user._id != id)
        return res.status(400).json({ error: 'User with that email does not exist ' });
    const newPassword = Math.random().toString(36).slice(-8);
    const password = bcrypt.hashSync(newPassword, 8);
    const userUpdated = await User.findByIdAndUpdate(id, { password }, { new: true });
    if (!userUpdated)
        return res.status(500).json({ error: 'User can not update!' });

    let configMail = {
        service: 'gmail.com',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },

    }
    const transport = nodemailer.createTransport(configMail);

    const mailOptions = {
        from: 'Blackism <huynhdaihuybank6@gmail.com>',
        to: email,
        subject: 'Reset Password',
        text: `Your new password is: ${newPassword}`
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send email' });
        }

        res.status(200).json({ message: 'Password reset successful. Check your email for the new password.' });
    });
}