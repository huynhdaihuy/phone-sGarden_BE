const MongoDB = require('../utils/mongodb.util');
const ApiError = require("../api-error");
const NewsService = require("../services/news.service");

exports.create = async(req, res, next) => {
    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while creating the product'))

    }
};

exports.findOne = async(req, res, next) => {
    try {
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.findById(req.params.id);
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
        const newsService = new NewsService(MongoDB.client);
        const { name } = req.query;
        console.log(name);
        if (name) {
            documents = await newsService.findByName(name);
        } else {
            documents = await newsService.find({});
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
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.update(req.params.id, req.body);

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
        const newsService = new NewsService(MongoDB.client);
        const document = await newsService.delete(req.params.id);
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
        const newsService = new NewsService(MongoDB.client);
        const deletedCount = await newsService.deleteAll();
        return res.send({ message: `${deletedCount} contacts were deleted successfully` });
    } catch (error) {
        return next(new ApiError(500, `Error occured while retrieving favourite `));

    }
};

exports.findAllFavorite = async(req, res, next) => {
    try {
        const newsService = new NewsService(MongoDB.client);
        const documents = await newsService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(new ApiError(500, `Error occured while retrieving favourite `));
    }
};