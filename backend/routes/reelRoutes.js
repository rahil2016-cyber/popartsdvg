
const express = require('express');
const router = express.Router();
const { getReels } = require('../controllers/reelController');

// Public route
router.get('/', getReels);

module.exports = router;
