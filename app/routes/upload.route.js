const express = require("express");
const { uploadImages, deleteImages } = require("../controllers/upload.controller.js");
const

    router = express.Router();

router.post(
    "/",
    uploadImages
);

router.delete("/delete-img/:id", deleteImages);

module.exports = router;