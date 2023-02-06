const MongoDB = require('../utils/mongodb.util');
const ApiError = require("../api-error");
const OrderService = require("../services/orders.service");

exports.create = async(req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while creating the product'))

    }
};

exports.findOne = async(req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving contact with id=${req.params.id}`));

    }
};

exports.findByCategory = async(req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.find(req.params);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, `Error retrieving contact with id=${req.params.id}`));

    }
};

exports.findAll = async(req, res, next) => {
    let documents = [];
    try {
        const orderService = new OrderService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await orderService.findByName(name);
        } else {
            documents = await orderService.find();
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
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Order not found"));
        }
        return res.send({ message: 'Order was updated successfully' });
    } catch (error) {
        return next(new ApiError(500, `Error updating order with id=${req.params.id}`));

    }
};

exports.delete = async(req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.delete(req.params.id);
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
        const orderService = new OrderService(MongoDB.client);
        const deletedCount = await orderService.deleteAll();
        return res.send({ message: `${deletedCount} contacts were deleted successfully` });
    } catch (error) {
        return next(new ApiError(500, `Error occured while retrieving favourite `));

    }
};

exports.findAllFavorite = async(req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const documents = await orderService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, `Error occured while retrieving favourite `));
    }
};