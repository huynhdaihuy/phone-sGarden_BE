const MongoDB = require('../utils/mongodb.util');
const ApiError = require("../api-error");
const ProductService = require("../services/product.service");

exports.create = async(req, res, next) => {
    if (!req.body.name) {
        return next(new ApiError(400, 'Name can not be empty'));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while creating the product'))

    }
};
exports.findOne = async(req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
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
    const { keyword, brand, ram, os, priceAbove, priceBelow, type } = req.query;
    try {
        const productService = new ProductService(MongoDB.client);
        if (keyword) {
            documents = await productService.findByKeyword(keyword);

        } else if (priceAbove && type) {
            documents = await productService.findByPriceAboveType(priceAbove, type);
        } else if (priceBelow && type) {
            documents = await productService.findByPriceBelowType(priceAbove, type);
        } else if (type) {
            documents = await productService.find({ type });
        } else if (priceAbove && priceBelow) {
            documents = await productService.findByPriceLimit({ priceAbove, priceBelow });
        } else if (priceAbove) {
            documents = await productService.findByPriceAbove(priceAbove);
        } else if (priceBelow) {
            documents = await productService.findByPriceBelow(priceBelow);
        } else if (brand && ram && os) {
            documents = await productService.findByBrandRamOs({ brand, ram, os });
        } else if (brand && ram) {
            documents = await productService.findByBrandRam({ brand, ram });
        } else if (brand) {
            documents = await productService.find({ brand });
        } else if (ram) {
            documents = await productService.find({ ram: Number(ram) });
        } else if (os) {
            documents = await productService.find({ os });
        } else
            documents = await productService.find({});
    } catch (error) {
        return next(new ApiError(500, 'An error occurred while retrieving the products'))

    }
    return res.send(documents);
};


exports.update = async(req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, 'Data update can not empty'));
    }
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.update(req.params.id, req.body);

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
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
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
        const productService = new ProductService(MongoDB.client);
        const deletedCount = await productService.deleteAll();
        return res.send({ message: `${deletedCount} contacts were deleted successfully` });
    } catch (error) {
        return next(new ApiError(500, `Error occured while retrieving favourite `));

    }
};