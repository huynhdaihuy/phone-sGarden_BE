const fs = require("fs");
const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary");

const {
    cloudinaryUploadImg,
    cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const uploadImages = asyncHandler(async(req, res) => {
    let uploader = (path) => cloudinaryUploadImg(path, "images");
    try {
        const urls = [];
        const files = req.files;
        if (files.images.length) {
            for (const file of files.images) {
                const path = file.tempFilePath;
                const newpath = await uploader(path);
                urls.push(newpath);
            }
        } else {
            const path = files.images.tempFilePath;
            console.log("🚀 ~ file: upload.controller.js:23 ~ uploadImages ~ path", path)
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
        }
        const images = urls.map((file) => {
            return file;
        });
        res.json(images);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteImages = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try {
        const deleted = cloudinaryDeleteImg(id, "images");
        res.json({ message: "Deleted" });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    uploadImages,
    deleteImages,
};