const express = require("express");
const router = express.Router();
const couponController = require('../controllers/coupon.controller');

router.get('/', couponController.getCoupons);
router.post('/', couponController.createCoupon);

router.get('/:id', couponController.getCouponById);
router.put('/:id', couponController.updateCoupon);

router.post('/apply', couponController.applyCoupon);

module.exports = router;