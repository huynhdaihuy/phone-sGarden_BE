const express = require("express");
const {
    addCart,
    getUserCart,
    emptyCart,
} = require("../controllers/cart.controller");

const { verifyToken } = require("../middleware/authJwt")
const router = express.Router();
// verifyToken
router.post("/", addCart);

router.get("/:id", getUserCart);

router.delete("/:id", verifyToken, emptyCart);

module.exports = router;