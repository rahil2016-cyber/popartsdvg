const express = require('express');
const router = express.Router();
const { createSession, verifyPayment, cashfreeWebhook } = require('../controllers/paymentController');

// Define routes
router.post('/create-session', createSession);
router.post('/verify', verifyPayment);
router.post('/webhook', cashfreeWebhook);

module.exports = router;
