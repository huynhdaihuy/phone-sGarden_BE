const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    createOrder,
    getOdrerByID,
    updateOrderStatus,
    getUserAllOdrer
} = require("../controllers/order.controller");

router.get("/", getAllOrders);

router.post("/", createOrder);

router.get("/user/:id", getUserAllOdrer);

router.get("/:id", getOdrerByID);


router.put("/:id", updateOrderStatus);


module.exports = router;