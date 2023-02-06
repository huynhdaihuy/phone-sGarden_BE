const MongoDB = require('../utils/mongodb.util');
const ApiError = require("../api-error");
const AccountService = require("../services/account.service");
const jwt = require('jsonwebtoken');

exports.create = async(req, res, next) => {
    if (!req.body.username) {
        return next(new ApiError(400, 'Username can not be empty'));
    }
    try {
        const accountService = new AccountService(MongoDB.client);
        const document = await accountService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while creating the product'))

    }
};

exports.findOne = async(req, res, next) => {
    try {
        const accountService = new AccountService(MongoDB.client);
        const document = await accountService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving contact with id=${req.params.id}`));

    }
};

exports.findAll = async(req, res, next) => {
    let documents = [];
    try {
        const accountService = new AccountService(MongoDB.client);
        const { lastname } = req.query;
        if (lastname) {
            documents = await accountService.findByName(lastname);
        } else {
            documents = await accountService.find({});
        }
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while retrieving the contacts'))

    }
    return res.send(documents);
};

exports.update = async(req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data update can not empty'));
    }
    try {
        const accountService = new AccountService(MongoDB.client);
        const document = await accountService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: 'Contact was updated successfully' });
    } catch (error) {
        return next(new ApiError(500, `Error updating contact with id=${req.params.id}`));

    }
};

exports.delete = async(req, res, next) => {
    try {
        const accountService = new AccountService(MongoDB.client);
        const document = await accountService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: 'Contact was deleted successfully' });
    } catch (error) {
        return next(new ApiError(500, `Error deleting contact with id=${req.params.id}`));

    }
};

exports.deleteAll = async(req, res, next) => {
    try {
        const accountService = new AccountService(MongoDB.client);
        const deletedCount = await accountService.deleteAll();
        return res.send({ message: `${deletedCount} contacts were deleted successfully` });
    } catch (error) {
        return next(new ApiError(500, `Error occured while retrieving favourite `));

    }
};
exports.login = async(req, res, next) => {
    try {
        const accountService = new AccountService(MongoDB.client);
        const user = await accountService.login(req.body.user);
        const payload = req.body;
        if (user) {
            user.accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
            return res.send(user);
        }
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving User with id=${req.params.username}`));

    }
};