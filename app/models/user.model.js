const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 8
        },
        email: {
            type: String,
            required: true,
            unique: [true, 'User"s email required'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Format of email is invalid !']

        },
        name: {
            type: String,
            required: [true, 'User"s name required'],
            maxLength: 30,
        },
        phone: {
            type: String,
            required: true,
            unique: [true, 'User"s phone number required'],
            maxLength: 10,
            match: [/0[35789]\d{8}$/, 'Format of phone is invalid !']
        },
        password: {
            type: String,
            required: [true, "User's password required"],
            minLength: 8
        },
        address: {
            type: String,
            maxLength: 200
        },
        avatar: {
            type: String,
            default: null
        },
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]
    }, { timestamps: true })
);

module.exports = User;