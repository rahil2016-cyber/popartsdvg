
const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { adminProtect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', adminProtect, createProduct);
router.put('/:id', adminProtect, updateProduct);
router.delete('/:id', adminProtect, deleteProduct);

module.exports = router;
