const express = require("express");
const router = express.Router();

const {
    getCoupons,
    createCoupon,
    getCouponByCode,
    updateCoupon,
    applyCoupon
} = require("../controllers/coupon.controller");


router.get('/', getCoupons);
router.post('/', createCoupon);

router.get('/code', getCouponByCode);
router.put('/:id', updateCoupon);

router.post('/apply', applyCoupon);

module.exports = router;