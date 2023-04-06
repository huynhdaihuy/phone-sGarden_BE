const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    createOrder,
    getOdrerByID,
    updateOrderStatus,
    getUserAllOdrer,
    getBestSellingProduct
} = require("../controllers/order.controller");

router.get("/", getAllOrders);

router.get("/best-selling-product", getBestSellingProduct);

router.post("/", createOrder);

// Get by id of user
router.get("/user/:id", getUserAllOdrer);

// Get by id of order
router.get("/:id", getOdrerByID);

// Update by id of order

router.put("/:id", updateOrderStatus);


module.exports = router;