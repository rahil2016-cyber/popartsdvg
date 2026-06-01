const express = require('express');
const router = express.Router();
const { createSession, verifyPayment } = require('../controllers/paymentController');

// Define routes
router.post('/create-session', createSession);
router.post('/verify', verifyPayment);

module.exports = router;
