
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminProtect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/admin', adminProtect, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', adminProtect, updateOrderStatus);

module.exports = router;
