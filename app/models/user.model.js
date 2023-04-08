const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'User\'s email required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Format of email is invalid!'],
    },
    name: {
        type: String,
        required: [true, 'User\'s name required'],
        maxLength: 30,
    },
    phone: {
        type: String,
        required: true,
        unique: [true, 'User\'s phone number required'],
        maxLength: 10,
        match: [/0[35789]\d{8}$/, 'Format of phone is invalid!'],
    },
    password: {
        type: String,
        required: [true, 'User\'s password required'],
        minLength: 8,
    },
    address: {
        type: String,
        maxLength: 200,
    },
    avatar: {
        type: String,
        default: null,
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
}, { timestamps: true });
UserSchema.methods.comparePassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while comparing passwords');
    }
};
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(8);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.set("validateBeforeSave", true);

const User = mongoose.model('User', UserSchema);

module.exports = User;