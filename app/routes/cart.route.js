const express = require("express");
const {
    addCart,
    getUserCart,
    emptyCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.post("/", addCart);

router.get("/:id", getUserCart);

router.delete("/:id", emptyCart);

module.exports = router;