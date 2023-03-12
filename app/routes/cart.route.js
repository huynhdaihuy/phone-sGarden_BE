const express = require("express");
const {
    addCart,
    getUserCart,
    emptyCart,
    updateCart
} = require("../controllers/cart.controller");

const { verifyToken } = require("../middleware/authJwt")
const router = express.Router();


router.post("/", verifyToken, addCart);

router.get("/:id", getUserCart);

router.delete("/:id", verifyToken, emptyCart);

router.put("/:id", verifyToken, updateCart);

module.exports = router;