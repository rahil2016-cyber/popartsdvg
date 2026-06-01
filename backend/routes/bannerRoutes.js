
const express = require('express');
const router = express.Router();
const { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { adminProtect } = require('../middleware/auth');

router.get('/', getBanners);
router.get('/admin', adminProtect, getAllBanners);
router.post('/', adminProtect, createBanner);
router.put('/:id', adminProtect, updateBanner);
router.delete('/:id', adminProtect, deleteBanner);

module.exports = router;
