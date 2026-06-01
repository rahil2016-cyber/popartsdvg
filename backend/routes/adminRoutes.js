
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Removed local loginLimiter
const { getDashboardStats, getUsers, createAdmin } = require('../controllers/adminController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const { getAllReels, createReel, updateReel, deleteReel } = require('../controllers/reelController');
const { adminProtect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/dashboard', adminProtect, getDashboardStats);
router.get('/users', adminProtect, getUsers);
router.post('/', adminProtect, createAdmin);

// Cloudinary signature for direct frontend uploads
router.get('/upload-signature', adminProtect, (req, res) => {
  try {
    const cloudinary = require('../config/cloudinary');
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
      timestamp: timestamp,
      folder: 'popartsdvg'
    }, cloudinary.config().api_secret);
    
    res.json({
      signature,
      timestamp,
      api_key: cloudinary.config().api_key,
      cloud_name: cloudinary.config().cloud_name
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating signature', error: error.message });
  }
});

// Products
router.get('/products', adminProtect, getProducts);
router.post('/products', adminProtect, upload.array('images', 6), createProduct);
router.put('/products/:id', adminProtect, upload.array('images', 6), updateProduct);
router.delete('/products/:id', adminProtect, deleteProduct);

// Orders
router.get('/orders', adminProtect, getAllOrders);
router.get('/orders/:id', adminProtect, getOrderById);
router.put('/orders/:id/status', adminProtect, updateOrderStatus);

// Categories
router.get('/categories', adminProtect, getCategories);
router.post('/categories', adminProtect, createCategory);
router.put('/categories/:id', adminProtect, updateCategory);
router.delete('/categories/:id', adminProtect, deleteCategory);

// Coupons
router.get('/coupons', adminProtect, getCoupons);
router.post('/coupons', adminProtect, createCoupon);
router.put('/coupons/:id', adminProtect, updateCoupon);
router.delete('/coupons/:id', adminProtect, deleteCoupon);

// Reels
router.get('/reels', adminProtect, getAllReels);
router.post('/reels', adminProtect, upload.single('media'), createReel);
router.put('/reels/:id', adminProtect, upload.single('media'), updateReel);
router.delete('/reels/:id', adminProtect, deleteReel);

module.exports = router;
