const express = require("express");
const router = express.Router();

const {
    getCoupons,
    createCoupon,
    updateCoupon,
    applyCoupon
} = require("../controllers/coupon.controller");


router.get('/', getCoupons);
router.post('/', createCoupon);

router.put('/:id', updateCoupon);

router.post('/apply', applyCoupon);

module.exports = router;