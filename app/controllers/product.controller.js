const asyncHandler = require("express-async-handler");
const db = require("../models");
const { uploadImages } = require("../controllers/upload.controller")
const Product = db.product;

const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");


const createProduct = asyncHandler(async(req, res) => {
    let uploader = (path) => cloudinaryUploadImg(path, "images");
    const urlImg = [];
    const files = req.files;
    if (files.images.length) {
        for (const file of files.images) {
            const path = file.tempFilePath;
            const newpath = await uploader(path);
            urlImg.push(newpath);
        }
    } else {
        const path = files.images.tempFilePath;
        const newpath = await uploader(path);
        urlImg.push(newpath);
    }
    console.log("🚀 ~ file: product.controller.js:26 ~ createProduct ~ urlImg:", urlImg[0].url)

    const obj = req.body;
    urlImg[0].url ? obj.images = urlImg[0].url : res.status(400).send("Cannot upload file images to cloud !");
    try {
        const newProduct = await Product.create(obj);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async(req, res) => {
    const id = req.params;
    try {
        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
            new: true,
        });
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findOneAndDelete(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getaProduct = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllProduct = asyncHandler(async(req, res) => {
    try {
        const queryObj = {...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        if (req.query.isOnSale) {
            queryObj["sale.isOnSale"] = true;
            delete queryObj["isOnSale"];
        }
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        queryStr = queryStr.replace(/\b(regex)\b/g, (match) => {
            return `$${match}`
        })
        let query = Product.find(JSON.parse(queryStr));

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }
        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
};