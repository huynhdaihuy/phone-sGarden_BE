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
        const queryObj = {...req.query };
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(regex)\b/g, (match) => {
            return `$${match}`
        })
        let users = await User.find(JSON.parse(queryStr));
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
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send("Invalid Id!");
        return;
    } else
        try {
            const users = await User.findOneAndUpdate({ _id: req.params.id }, req.query, { returnDocument: "after", new: true });
            console.log("🚀 ~ file: user.controller.js:63 ~ exports.update=asyncHandler ~ users:", users)
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
exports.changePassword = async(req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id);
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).send({ message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save()
        res.status(200).send({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while changing the password' });
    }
}
exports.forgotPassword = async(req, res) => {
    const { email, username } = req.body;
    const user = await User.findOne({ email, username });
    if (!user) {
        return res.status(400).json({ error: 'User with that email and username does not exist' });
    }
    const newPassword = Math.random().toString(36).slice(-8);
    const password = bcrypt.hashSync(newPassword, 8);
    const userUpdated = await User.findOneAndUpdate({ email, username }, { password }, { new: true });
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