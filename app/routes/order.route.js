const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    createOrder,
    getOdrerByID,
    updateOrderStatus,
    getUserAllOdrer
} = require("../controllers/order.controller");
const { user } = require("../models");

router.get("/", getAllOrders);

router.post("/", createOrder);

// Get by id of user
router.get("/user/:id", getUserAllOdrer);

// Get by id of order
router.get("/:id", getOdrerByID);

// Update by id of order

router.put("/:id", updateOrderStatus);


module.exports = router;