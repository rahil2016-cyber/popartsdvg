
const express = require('express');
const router = express.Router();
const { getCoupons, getCouponByCode, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { adminProtect } = require('../middleware/auth');

router.get('/', adminProtect, getCoupons);
router.get('/code/:code', getCouponByCode);
router.post('/', adminProtect, createCoupon);
router.put('/:id', adminProtect, updateCoupon);
router.delete('/:id', adminProtect, deleteCoupon);

module.exports = router;
