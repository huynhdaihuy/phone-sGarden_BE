const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    createOrder,
    getUserOdrer,
    updateOrderStatus
} = require("../controllers/order.controller");

router.get("/", getAllOrders);

router.post("/", createOrder);

router.get("/:id", getUserOdrer);
router.put("/:id", updateOrderStatus);


module.exports = router;