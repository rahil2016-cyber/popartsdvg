
const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, getAllReviews, approveReview, deleteReview } = require('../controllers/reviewController');
const { protect, adminProtect } = require('../middleware/auth');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.get('/admin', adminProtect, getAllReviews);
router.put('/:id/approve', adminProtect, approveReview);
router.delete('/:id', adminProtect, deleteReview);

module.exports = router;
